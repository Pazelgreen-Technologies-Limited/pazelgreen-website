import { SITE_CONFIG } from "@/lib/site-config";

export default function PrivacyPolicyContent() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl space-y-12">
        <div className="space-y-4 border-b border-border pb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-primary/70">
            Legal & Data Governance
          </span>
          <h1 className="font-sans text-3xl font-extrabold tracking-tight text-primary-darker sm:text-4xl lg:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-xs text-muted-foreground">
            Last Updated: May 2026 · Effective Date: January 1, 2026
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-foreground">
          <section className="space-y-3">
            <h2 className="font-sans text-xl font-bold text-primary-darker">
              1. Introduction & Scope
            </h2>
            <p>
              Pazelgreen Technologies Limited (&quot;Pazelgreen&quot;,
              &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), headquartered
              in Ikorodu, Lagos State, Nigeria, operates the PAGEX ecosystem
              platform, market intelligence feeds, and related agricultural
              coordination services.
            </p>
            <p>
              This Privacy Policy describes how we collect, store, process, and
              protect personal and operational data belonging to farmers,
              cooperative members, buyers, logistics carriers, and website
              visitors in compliance with the Nigeria Data Protection Act (NDPA)
              and applicable international standards.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-bold text-primary-darker">
              2. Data We Collect
            </h2>
            <p>
              We collect information necessary to facilitate agricultural trades,
              quality verification, and settlement:
            </p>
            <ul className="list-disc space-y-1.5 pl-5 text-xs text-muted-foreground">
              <li>
                <strong className="text-foreground">Identity & Contact:</strong>{" "}
                Name, phone number, email address, national identity numbers
                where required for KYC, and cooperative affiliations.
              </li>
              <li>
                <strong className="text-foreground">
                  Agricultural & Geospatial Data:
                </strong>{" "}
                Farm location GPS coordinates, crop varieties grown, estimated
                harvest tonnage, soil and moisture testing records.
              </li>
              <li>
                <strong className="text-foreground">
                  Transactional Records:
                </strong>{" "}
                Contract values, weighbridge slips, delivery bills of lading,
                payment accounts, and escrow clearance logs.
              </li>
              <li>
                <strong className="text-foreground">
                  Technical Telemetry:
                </strong>{" "}
                Device identifiers, browser type, and transit telemetry
                collected via IoT-monitored agricultural haulage.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-bold text-primary-darker">
              3. How We Use Your Data
            </h2>
            <p>
              Your data is used strictly for legitimate agricultural
              coordination purposes:
            </p>
            <ul className="list-disc space-y-1.5 pl-5 text-xs text-muted-foreground">
              <li>
                Matching supply from smallholder clusters with industrial
                processing buyers.
              </li>
              <li>
                Executing cryptographic batch traceability from farmgate to
                final factory reception.
              </li>
              <li>
                Calculating benchmark commodity indices without exposing
                individual farm identity.
              </li>
              <li>
                Facilitating secure escrow releases and direct bank or mobile
                money settlements.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-bold text-primary-darker">
              4. Data Security & Storage
            </h2>
            <p>
              We implement industry-standard encryption protocols (TLS in
              transit and AES-256 at rest) across all databases and
              communication channels. Escrow financial instructions are audited,
              and access to producer records is restricted to authorized field
              agents and verification personnel.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-bold text-primary-darker">
              5. Your Rights as a Data Subject
            </h2>
            <p>
              Under the NDPA, you have the right to request access to your
              recorded personal data, correct inaccurate cooperative logs,
              object to automated profiling, or request deletion of
              non-regulatory records.
            </p>
            <p>
              To exercise your rights, email our Data Governance Officer at{" "}
              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="text-primary underline transition-colors hover:text-primary-hover"
              >
                {SITE_CONFIG.contact.email}
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-sans text-xl font-bold text-primary-darker">
              6. Inquiries & Contact
            </h2>
            <p>
              Pazelgreen Technologies Limited
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
              <br />
              Phone:{" "}
              <a
                href={`tel:${SITE_CONFIG.contact.phone.replace(/\s+/g, "")}`}
                className="text-primary underline transition-colors hover:text-primary-hover"
              >
                {SITE_CONFIG.contact.phone}
              </a>
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
