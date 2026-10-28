import { createHash } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoDir = resolve(scriptDir, "../..");
const cloudBaseUrl = "https://pmc-oa-opendata.s3.amazonaws.com";

function fail(message) {
  console.error(`Ingestion stopped: ${message}`);
  process.exit(1);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function decodeXml(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&#([0-9]+);/g, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 10)),
    )
    .replace(/\s+/g, " ")
    .trim();
}

function httpsFromS3(url) {
  const withoutDigest = url.split("?", 1)[0];
  const prefix = "s3://pmc-oa-opendata/";
  if (!withoutDigest.startsWith(prefix)) {
    throw new Error(`Unexpected PMC object URL: ${url}`);
  }
  return `${cloudBaseUrl}/${withoutDigest.slice(prefix.length)}`;
}

async function fetchText(url, label) {
  const response = await fetch(url, {
    headers: { "User-Agent": "EvidenceGraph-Hackathon/1.0" },
  });
  if (!response.ok) {
    throw new Error(`${label} returned HTTP ${response.status}`);
  }
  return response.text();
}

function extractSectionHeadings(xml) {
  const headings = [...xml.matchAll(/<title(?:\s[^>]*)?>([\s\S]*?)<\/title>/gi)]
    .map((match) => decodeXml(match[1]))
    .filter(Boolean);
  return [...new Set(headings)];
}

function extractParagraphs(text) {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter((paragraph) => paragraph.length >= 40)
    .map((text, index) => ({
      id: `paragraph-${String(index + 1).padStart(4, "0")}`,
      text,
      sha256: sha256(text),
    }));
}

const { values } = parseArgs({
  options: {
    pmcid: { type: "string" },
    help: { type: "boolean", short: "h" },
  },
  strict: true,
});

if (values.help) {
  console.log("Usage: npm run ingest-paper -- --pmcid PMC9343015");
  process.exit(0);
}

const pmcid = values.pmcid?.trim().toUpperCase();
if (!pmcid || !/^PMC\d+$/.test(pmcid)) {
  fail("provide a PMCID such as PMC9343015 with --pmcid");
}

try {
  const listUrl = `${cloudBaseUrl}/?list-type=2&prefix=${pmcid}.&delimiter=/`;
  const listing = await fetchText(listUrl, "PMC version lookup");
  const versions = [...listing.matchAll(/<CommonPrefixes><Prefix>(PMC\d+\.(\d+)\/)\<\/Prefix><\/CommonPrefixes>/g)]
    .map((match) => ({ prefix: match[1].slice(0, -1), version: Number(match[2]) }))
    .sort((a, b) => b.version - a.version);

  if (versions.length === 0) {
    fail(`${pmcid} is not available in the PMC Article Dataset`);
  }

  const selected = versions[0];
  const metadataUrl = `${cloudBaseUrl}/metadata/${selected.prefix}.json`;
  const metadata = JSON.parse(await fetchText(metadataUrl, "PMC metadata"));
  const textUrl = httpsFromS3(metadata.text_url);
  const xmlUrl = httpsFromS3(metadata.xml_url);
  const [fullText, xml] = await Promise.all([
    fetchText(textUrl, "PMC full text"),
    fetchText(xmlUrl, "PMC XML"),
  ]);

  const paragraphs = extractParagraphs(fullText);
  const sectionHeadings = extractSectionHeadings(xml);
  const outputDir = resolve(repoDir, "local-papers/ingestion", pmcid);
  mkdirSync(outputDir, { recursive: true });

  const paperRecord = {
    schemaVersion: 1,
    status: "needs_review",
    ingestedAt: new Date().toISOString(),
    paper: {
      id: pmcid.toLowerCase(),
      pmcid: metadata.pmcid,
      pmid: metadata.pmid ? String(metadata.pmid) : null,
      doi: metadata.doi ?? null,
      title: metadata.title,
      citation: metadata.citation,
      version: metadata.version,
    },
    access: {
      licenseCode: metadata.license_code,
      isPmcOpenAccess: metadata.is_pmc_openaccess,
      isAuthorManuscript: metadata.is_manuscript,
      redistributionNotAssumed: true,
    },
    sources: {
      metadataUrl,
      textUrl,
      xmlUrl,
      textSha256: sha256(fullText),
      xmlSha256: sha256(xml),
    },
    extraction: {
      sectionHeadings,
      paragraphCount: paragraphs.length,
      candidatePassages: [],
      note: "Automated acquisition and paragraph anchoring completed. Scientific passage selection and review remain pending.",
    },
  };

  writeFileSync(resolve(outputDir, "paper-record.json"), `${JSON.stringify(paperRecord, null, 2)}\n`);
  writeFileSync(resolve(outputDir, "paragraphs.json"), `${JSON.stringify(paragraphs, null, 2)}\n`);
  writeFileSync(resolve(outputDir, `${selected.prefix}.txt`), fullText);
  writeFileSync(resolve(outputDir, `${selected.prefix}.xml`), xml);

  const reviewPath = resolve(outputDir, "review.md");
  if (!existsSync(reviewPath)) {
    const review = `# Ingestion review: ${metadata.title}\n\n- **Status:** Needs review\n- **PMCID:** ${metadata.pmcid}\n- **PMID:** ${metadata.pmid ?? "Not recorded"}\n- **DOI:** ${metadata.doi ?? "Not recorded"}\n- **Version:** ${metadata.version}\n- **License code:** ${metadata.license_code}\n- **Paragraph anchors:** ${paragraphs.length}\n- **Source:** https://pmc.ncbi.nlm.nih.gov/articles/${metadata.pmcid}/\n\n## Review checklist\n\n- [ ] Confirm paper identity and relevance.\n- [ ] Confirm access and redistribution constraints.\n- [ ] Select candidate passages for the project question.\n- [ ] Check selected quotations against the visible source.\n- [ ] Approve only reviewed records for the live corpus.\n`;
    writeFileSync(reviewPath, review);
  }

  console.log(`Ingested ${metadata.pmcid}: ${metadata.title}`);
  console.log(`Saved ${paragraphs.length} anchored paragraphs to ${outputDir}`);
  console.log("Status: needs_review (not added to the live corpus)");
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}
