import { EvidenceWorkbench } from "@/components/evidence-workbench";
import { reviewedAnswer } from "@/lib/evidence";

export default function Home() {
  return <EvidenceWorkbench initialAnswer={reviewedAnswer} />;
}
