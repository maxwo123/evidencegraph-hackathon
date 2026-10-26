import type { GroundedAnswer } from "@/lib/schemas";

export type EvidencePassage = {
  id: string;
  title: string;
  authors: string;
  year: number;
  journal: string;
  page: number;
  doi: string;
  pmid: string;
  pmcid: string;
  sourceUrl: string;
  text: string;
  copyrightNotice: string;
};

export const defaultQuestion =
  "What does Morgan et al. 2017 show—and not show—about using molecular properties to prioritize compounds for RNA screening?";

export const evidencePassages: EvidencePassage[] = [
  {
    id: "morgan-2017-rbind-fda-01",
    title:
      "Discovery of Key Physicochemical, Structural, and Spatial Properties of RNA-Targeted Bioactive Ligands",
    authors: "Morgan, B. S.; Forte, J. E.; Culver, R. N.; Zhang, Y.; Hargrove, A. E.",
    year: 2017,
    journal: "Angewandte Chemie International Edition",
    page: 4,
    doi: "10.1002/anie.201707641",
    pmid: "28810078",
    pmcid: "PMC5752130",
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5752130/",
    text:
      "For the comparison of R-BIND (SM) and FDA, we included only FDA molecules within the molecular weight range of R-BIND (SM) to account for the presence of larger and potentially multivalent molecules within the FDA library (SI Figure 3-2, SI Table 3-3). Further, there were statistically significant differences in the molecular complexity of the molecules, where R-BIND (SM) contained fewer sp3-hybridized carbons (Fsp3) and stereocenters (nStereo) compared to the FDA library. We cannot determine, however, the extent to which these differences can be attributed to reduced complexity in synthetic and commercial screening libraries, from which many R-BIND (SM) ligands were discovered.",
    copyrightNotice:
      "Excerpt from Morgan et al. (2017). Copyright remains with the authors and publisher.",
  },
  {
    id: "morgan-2017-future-testing-01",
    title:
      "Discovery of Key Physicochemical, Structural, and Spatial Properties of RNA-Targeted Bioactive Ligands",
    authors: "Morgan, B. S.; Forte, J. E.; Culver, R. N.; Zhang, Y.; Hargrove, A. E.",
    year: 2017,
    journal: "Angewandte Chemie International Edition",
    page: 5,
    doi: "10.1002/anie.201707641",
    pmid: "28810078",
    pmcid: "PMC5752130",
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5752130/",
    text:
      "Together, these differences support the existence of a ‘privileged chemical space’ for RNA targeting and suggest several important future directions, including the explicit testing of these guiding principles against several RNA targets and the expansion of the properties analyzed.",
    copyrightNotice:
      "Excerpt from Morgan et al. (2017). Copyright remains with the authors and publisher.",
  },
];

export const reviewedAnswer: GroundedAnswer = {
  answer:
    "Morgan et al. found statistically significant property-distribution differences between curated bioactive RNA-targeted small molecules and a molecular-weight-restricted set of FDA-approved drugs. Those differences can guide screening-library design, but the study does not show that the properties prospectively predict whether a compound will bind RNA.",
  status: "supported_with_limitations",
  claims: [
    {
      text: "The comparison reports significant molecular-property differences after restricting the FDA reference set to the R-BIND molecular-weight range.",
      passageIds: ["morgan-2017-rbind-fda-01"],
    },
    {
      text: "The authors frame these patterns as guiding principles that still require explicit testing across RNA targets.",
      passageIds: ["morgan-2017-future-testing-01"],
    },
  ],
  limitations: [
    "The FDA collection is a reference library, not a same-assay non-binder control.",
    "The analysis is retrospective and does not establish prospective prediction of RNA binding.",
  ],
  model: "Human-reviewed fixture",
  mode: "reviewed",
};

export function getPassageById(id: string): EvidencePassage | undefined {
  return evidencePassages.find((passage) => passage.id === id);
}

export function getAllowedPassageIds(): Set<string> {
  return new Set(evidencePassages.map((passage) => passage.id));
}
