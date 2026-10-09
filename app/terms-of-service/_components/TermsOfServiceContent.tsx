import { SITE_CONFIG } from "@/lib/site-config";

export default function TermsOfServiceContent() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl space-y-12">
        <div className="space-y-4 border-b border-border pb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-primary/70">
            Platform Agreement
          </span>
          <h1 className="font-sans text-3xl font-extrabold tracking-tight text-primary-darker sm:text-4xl lg:text-5xl">
            Terms of Service
          </h1>
          <p className="text-xs text-muted-foreground">
            Last Updated: May 2026 · Effective Date: January 1, 2026
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-foreground">
          <section className="space-y-3">
            <h2 className="font-sans text-xl font-bold text-primary-darker">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or utilizing the websites, mobile interfaces, or
              trade coordination tools provided by Pazelgreen Technologies
              Limited (&quot;Pazelgreen&quot;, &quot;PAGEX&quot;), you agree to
              be bound by these Terms of Service. If you are entering into this
              agreement on behalf of a cooperative, corporation, or entity, you
              warrant that you have full authority to bind that entity.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-bold text-primary-darker">
              2. Platform Role & Trade Execution
            </h2>
            <p>
              PAGEX functions as an ecosystem coordination layer, digital
              order-routing platform, and market intelligence facilitator. We
              connect registered agricultural producers, verified commercial
              buyers, and independent service providers.
            </p>
            <ul className="list-disc space-y-1.5 pl-5 text-xs text-muted-foreground">
              <li>
                All commodity listings must accurately specify grade, crop
                variety, estimated moisture level, and aggregation hub
                location.
              </li>
              <li>
                Trades are settled in accordance with objective digital
                weighbridge metrics and laboratory moisture readings recorded at
                intake gates.
              </li>
              <li>
                In the event of quality parameter discrepancies exceeding
                contract tolerances, automated arbitration workflows governed by
                pre-agreed specifications apply.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-bold text-primary-darker">
              3. Escrow Settlement Rules
            </h2>
            <p>
              To prevent non-delivery and payment default, trade contracts
              matched on PAGEX mandate the use of audited custodian escrow
              holding accounts.
            </p>
            <ul className="list-disc space-y-1.5 pl-5 text-xs text-muted-foreground">
              <li>
                Buyer funds are held securely upon issuance of the digital
                purchase order.
              </li>
              <li>
                Funds are disbursed to the seller&apos;s verified bank or
                mobile wallet upon confirmed weigh-in and quality acceptance.
              </li>
              <li>
                Neither party may unilaterally reverse escrow allocations
                without platform dispute resolution proceedings.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-bold text-primary-darker">
              4. Market Intelligence & Proprietary Feeds
            </h2>
            <p>
              Price benchmarks, historical trends, and harvest forecasts
              published on PAGEX are compiled using proprietary aggregation
              algorithms. You may not scrape, redistribute, or commercially
              sublicense our spot indices without prior written consent from
              Pazelgreen Technologies Limited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-bold text-primary-darker">
              5. Governing Law & Jurisdiction
            </h2>
            <p>
              These terms are governed by and construed in accordance with the
              laws of the Federal Republic of Nigeria. Any disputes arising
              under these terms shall be resolved under the jurisdiction of the
              courts of Lagos State, Nigeria.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-bold text-primary-darker">
              6. Contact Regarding Terms
            </h2>
            <p>
              Legal Affairs, Pazelgreen Technologies Limited
              <br />
              {SITE_CONFIG.contact.address}
              <br />
              Email:{" "}
              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="text-primary underline transition-colors hover:text-primary-hover"
              >
                {SITE_CONFIG.contact.email}
              </a>
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
