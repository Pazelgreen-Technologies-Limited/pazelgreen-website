import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Sparkles } from "lucide-react";
import { socialLinks } from "@/lib/social-links";
import { contactDetails } from "./contact-details";

export default function ContactAside() {
  const phoneHref = contactDetails.phone.replace(/\s+/g, "");

  return (
    <div className="space-y-6 lg:col-span-5">
      {/* Head office & support */}
      <div className="space-y-6 rounded-3xl bg-primary-darker p-8 text-inverse-foreground shadow-md">
        <span className="block text-xs font-bold uppercase tracking-wider text-primary-light">
          Head Office & Support
        </span>

        <h3 className="font-sans text-2xl font-bold text-inverse-foreground">
          Pazelgreen Technologies
        </h3>

        <div className="space-y-4 text-sm text-inverse-foreground/85">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary-light" />
            <div>
              <span className="block text-xs text-inverse-foreground/60">
                Inquiries & Support
              </span>
              <a
                href={`mailto:${contactDetails.email}`}
                className="font-medium transition-colors hover:text-inverse-foreground"
              >
                {contactDetails.email}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary-light" />
            <div>
              <span className="block text-xs text-inverse-foreground/60">
                Direct Telephone / WhatsApp
              </span>
              <a
                href={`tel:${phoneHref}`}
                className="font-medium transition-colors hover:text-inverse-foreground"
              >
                {contactDetails.phone}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary-light" />
            <div>
              <span className="block text-xs text-inverse-foreground/60">
                Corporate Address
              </span>
              <span className="font-medium">{contactDetails.address}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary-light" />
            <div>
              <span className="block text-xs text-inverse-foreground/60">
                Operational Hours
              </span>
              <span className="font-medium">
                {contactDetails.operatingHours}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Response SLA */}
      <div className="space-y-3 rounded-2xl border border-primary-darker/10 bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h4 className="font-sans text-sm font-bold text-primary-darker">
            Our Commitment to Partners
          </h4>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Agriculture runs on strict biological calendars. We never leave
          commercial buyers, cooperative leaders, or farmers waiting. You will
          receive an operational response within one business day.
        </p>
      </div>

      {/* Connect with Pazelgreen — carried over from the previous contact page */}
      <div className="rounded-2xl bg-primary-darker p-6 text-inverse-foreground">
        <p className="mb-1 flex items-center gap-2 text-xs font-semibold text-primary-light">
          <span className="h-px w-6 bg-primary-light" /> FOLLOW US
        </p>
        <h3 className="text-lg font-bold">Connect with Pazelgreen</h3>
        <p className="mt-1 mb-4 text-sm text-inverse-foreground/80">
          Follow our journey transforming agricultural technology across
          emerging markets.
        </p>
        <div className="flex gap-3">
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <Link
              key={label}
              href={href}
              aria-label={label}
              className="rounded-full p-2 transition-colors hover:bg-primary-dark/50 focus:outline-none focus:ring-2 focus:ring-primary-light"
            >
              <div className="rounded-full border border-inverse-foreground p-3">
                <Icon size={16} className="text-inverse-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
