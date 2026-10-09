import { CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { solutions } from "./solutions-data";

export default function SolutionPillars() {
  return (
    <section className="mx-auto max-w-[1200px] space-y-16 px-4 sm:px-6 lg:px-8">
      {solutions.map((sol, index) => {
        const Icon = sol.icon;

        return (
          <article
            key={sol.id}
            className={`space-y-8 rounded-3xl border border-primary-darker/10 p-8 sm:p-12 ${
              index % 2 === 0 ? "bg-card" : "bg-primary-surface/40"
            }`}
          >
            <div className="flex flex-col justify-between gap-6 border-b border-primary-darker/10 pb-6 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary-darker/10 bg-primary-surface">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Strategic Pillar 0{index + 1}
                  </span>
                  <h2 className="font-sans text-2xl font-bold text-primary-darker sm:text-3xl">
                    {sol.title}
                  </h2>
                </div>
              </div>

              <Button
                variant="solid"
                href={`/contact?type=${sol.id}`}
                className="shrink-0 self-start md:self-auto"
              >
                Inquire about this pillar
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-primary/70">
                    The Systemic Challenge
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {sol.challenge}
                  </p>
                </div>

                <div>
                  <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-primary/70">
                    Our Operational Approach
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {sol.approach}
                  </p>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-primary-darker/10 bg-background p-6">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                  Key Deliverables & Outcomes
                </h3>
                <ul className="space-y-2.5 text-xs text-foreground">
                  {sol.outcomes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-primary-darker/10 pt-3 text-xs text-muted-foreground">
                  <strong>Target Beneficiaries:</strong> {sol.beneficiaries}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
