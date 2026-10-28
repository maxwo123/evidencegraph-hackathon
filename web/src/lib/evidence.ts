import type { GroundedAnswer } from "@/lib/schemas";

export type EvidencePassage = {
  id: string;
  title: string;
  authors: string;
  year: number;
  journal: string;
  location: string;
  page?: number;
  doi: string;
  pmid: string;
  pmcid: string;
  sourceUrl: string;
  text: string;
  excerptNote?: string;
  copyrightNotice: string;
};

export const defaultQuestion =
  "What molecular-property differences does each paper report?";

export const exampleQuestions = [
  defaultQuestion,
  "What comparison groups were used, and what do they establish?",
  "How are the datasets related, and what new evidence does the update add?",
  "Do the papers establish that an untested molecule binds a particular RNA?",
];

export const evidencePassages: EvidencePassage[] = [
  {
    id: "morgan-2017-rbind-fda-01",
    title:
      "Discovery of Key Physicochemical, Structural, and Spatial Properties of RNA-Targeted Bioactive Ligands",
    authors: "Morgan, B. S.; Forte, J. E.; Culver, R. N.; Zhang, Y.; Hargrove, A. E.",
    year: 2017,
    journal: "Angewandte Chemie International Edition",
    location: "PDF page 4",
    page: 4,
    doi: "10.1002/anie.201707641",
    pmid: "28810078",
    pmcid: "PMC5752130",
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5752130/",
    text:
      "For the comparison of R-BIND (SM) and FDA, we included only FDA molecules within the molecular weight range of R-BIND (SM) to account for the presence of larger and potentially multivalent molecules within the FDA library (SI Figure 3-2, SI Table 3-3). […] Further, there were statistically significant differences in the molecular complexity of the molecules, where R-BIND (SM) contained fewer sp3-hybridized carbons (Fsp3) and stereocenters (nStereo) compared to the FDA library. […] We cannot determine, however, the extent to which these differences can be attributed to reduced complexity in synthetic and commercial screening libraries, from which many R-BIND (SM) ligands were discovered.",
    excerptNote:
      "Selected sentences from one paragraph; bracketed ellipses mark omitted sentences.",
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
    location: "PDF page 5",
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
  {
    id: "donlic-2022-dataset-update-01",
    title:
      "R-BIND 2.0: An Updated Database of Bioactive RNA-Targeting Small Molecules and Associated RNA Secondary Structures",
    authors:
      "Donlic, A.; Swanson, E. G.; Chiu, L.-Y.; Wicks, S. L.; Juru, A. U.; Cai, Z.; et al.",
    year: 2022,
    journal: "ACS Chemical Biology",
    location: "Introduction",
    doi: "10.1021/acschembio.2c00224",
    pmid: "35594415",
    pmcid: "PMC9343015",
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9343015/",
    text:
      "We also collected follow-up studies for existing database ligands as well as new reports, which were published between June 1st, 2018 and December 31st, 2019 and found that, despite the small molecule database ligand number increasing by 50% (n = 97 to n = 153), distinguishing cheminformatics and shape-based trends remained the same for R-BIND small molecule database members when compared to those for protein-targeting ligands.",
    copyrightNotice:
      "Excerpt from Donlic et al. (2022). Copyright remains with the authors and publisher.",
  },
  {
    id: "donlic-2022-reclassification-01",
    title:
      "R-BIND 2.0: An Updated Database of Bioactive RNA-Targeting Small Molecules and Associated RNA Secondary Structures",
    authors:
      "Donlic, A.; Swanson, E. G.; Chiu, L.-Y.; Wicks, S. L.; Juru, A. U.; Cai, Z.; et al.",
    year: 2022,
    journal: "ACS Chemical Biology",
    location: "R-BIND (SM) 1.2 vs 2.0",
    doi: "10.1021/acschembio.2c00224",
    pmid: "35594415",
    pmcid: "PMC9343015",
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9343015/",
    text:
      "First, an increase in the average molecular weight was observed with the latest update and found to be statistically significantly different as per the Mann-Whitney U analysis in the latest update (P-value = 0.02). As a consequence of the MW increase, increases in averages of other parameters were observed as well. For example, accessible surface area (ASA) was found to have a statistically significant increase in R-BIND (SM) 2.0 compared to that in R-BIND (SM) 1.2 (P-value = 0.03). […] We can thus conclude that these differences were due to reclassification and not a change in the chemical space itself.",
    excerptNote:
      "Selected sentences from the section; the bracketed ellipsis marks omitted explanatory sentences about applying the prior molecular-weight cutoff.",
    copyrightNotice:
      "Excerpt from Donlic et al. (2022). Copyright remains with the authors and publisher.",
  },
  {
    id: "donlic-2022-rbind-fda-01",
    title:
      "R-BIND 2.0: An Updated Database of Bioactive RNA-Targeting Small Molecules and Associated RNA Secondary Structures",
    authors:
      "Donlic, A.; Swanson, E. G.; Chiu, L.-Y.; Wicks, S. L.; Juru, A. U.; Cai, Z.; et al.",
    year: 2022,
    journal: "ACS Chemical Biology",
    location: "R-BIND (SM) 2.0 vs FDA",
    doi: "10.1021/acschembio.2c00224",
    pmid: "35594415",
    pmcid: "PMC9343015",
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9343015/",
    text:
      "For all cheminformatic analyses, the FDA library used for comparison had an MW cutoff equal to the highest molecular weight ligand in the R-BIND (SM) 2.0 library (R-BIND (SM) 0132 A and B, 705.93 Da), in line with previous comparisons of these two libraries. […] In comparing the newly updated libraries, we again conducted a Mann-Whitney U analysis and found that 18 out of 20 physicochemical parameters between the FDA and R-BIND 2.0 library had statistically significant differences.",
    excerptNote:
      "Selected sentences from the section; the bracketed ellipsis marks omitted sentences.",
    copyrightNotice:
      "Excerpt from Donlic et al. (2022). Copyright remains with the authors and publisher.",
  },
  {
    id: "donlic-2022-structure-classes-01",
    title:
      "R-BIND 2.0: An Updated Database of Bioactive RNA-Targeting Small Molecules and Associated RNA Secondary Structures",
    authors:
      "Donlic, A.; Swanson, E. G.; Chiu, L.-Y.; Wicks, S. L.; Juru, A. U.; Cai, Z.; et al.",
    year: 2022,
    journal: "ACS Chemical Biology",
    location: "Classification of RNA target structure-ligand pairs",
    doi: "10.1021/acschembio.2c00224",
    pmid: "35594415",
    pmcid: "PMC9343015",
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9343015/",
    text:
      "In the training of the data set, around 84% of small molecules were correctly classified by the RNA structure motif that they target. Furthermore, in the cross-validation, around 68% of small molecules were classified correctly. […] Together, these results show the potential to use cheminformatics and RNA structural information in R-BIND to enrich for ligands targeting a given RNA secondary or tertiary structure.",
    excerptNote:
      "Selected sentences from the section; the bracketed ellipsis marks omitted sentences.",
    copyrightNotice:
      "Excerpt from Donlic et al. (2022). Copyright remains with the authors and publisher.",
  },
];

export const reviewedAnswer: GroundedAnswer = {
  answer:
    "Morgan 2017 reports property-distribution differences between curated bioactive RNA-targeted small molecules and a molecular-weight-restricted FDA-drug reference. Donlic 2022 reports that the broad trends persist in R-BIND 2.0, while explaining that some version-to-version shifts reflect reclassification rather than a changed chemical space.",
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
    {
      text: "Donlic 2022 reports that the small-molecule corpus grew from 97 to 153 while its distinguishing cheminformatic and shape trends remained.",
      passageIds: ["donlic-2022-dataset-update-01"],
    },
    {
      text: "The updated molecular-weight-matched FDA comparison reports significant differences for 18 of 20 physicochemical parameters.",
      passageIds: ["donlic-2022-rbind-fda-01"],
    },
    {
      text: "Some apparent shifts between R-BIND 1.2 and 2.0 were attributed to reclassification rather than a changed chemical space.",
      passageIds: ["donlic-2022-reclassification-01"],
    },
  ],
  limitations: [
    "The FDA collection is a reference library, not a same-assay non-binder control.",
    "Donlic 2022 extends a related R-BIND corpus and is not an independent replication dataset.",
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
