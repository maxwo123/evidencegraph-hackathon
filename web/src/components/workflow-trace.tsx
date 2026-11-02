import type { EvidenceAgentRun } from "@/lib/schemas";

const stageLabels: Record<EvidenceAgentRun["stages"][number]["name"], string> = {
  planning: "Plan evidence",
  retrieval: "Retrieve passages",
  comparison: "Check study lineage",
  drafting: "Draft claims",
  validation: "Validate citations",
  repair: "Repair once",
  completed: "Finish",
};

type WorkflowTraceProps = {
  run: EvidenceAgentRun;
};

export function WorkflowTrace({ run }: WorkflowTraceProps) {
  return (
    <section className="workflow-trace" aria-label="Agent workflow">
      <div className="workflow-heading">
        <div>
          <p>Agent run</p>
          <h2>Verified workflow</h2>
        </div>
        <span>{run.repaired ? "1 repair used" : "No repair needed"}</span>
      </div>
      <ol>
        {run.stages.map((stage, index) => (
          <li className={`workflow-${stage.status}`} key={`${stage.name}-${index}`}>
            <span className="workflow-marker" aria-hidden="true">
              {stage.status === "completed"
                ? "✓"
                : stage.status === "failed"
                  ? "!"
                  : "—"}
            </span>
            <div>
              <h3>{stageLabels[stage.name]}</h3>
              <p>{stage.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
