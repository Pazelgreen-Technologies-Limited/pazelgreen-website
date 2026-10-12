import Button from "@/components/ui/Button";
import { ArrowRight, Phone } from "lucide-react";
import Link from "next/link";

export default function JoinHero() {
  return (
    <section className="bg-background mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <div className="max-w-3xl space-y-5">
          <span className="text-xs font-bold uppercase tracking-wider text-primary/70">
            Build with us
          </span>
          <h1 className="font-sans text-4xl font-extrabold text-primary-darker sm:text-5xl lg:text-6xl">
            Join the Pazelgreen Ecosystem
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Become part of the ecosystem shaping agricultural innovation.
            We&apos;re building the future of sustainable farming, and we need
            you.
          </p>
          <div className="flex flex-col items-start gap-4 pt-2 sm:flex-row sm:items-center">
            <Button href="/contact" variant="solid">
              <Phone size={16} /> Contact Us
            </Button>
            <Link
              href="/join-us/signup"
              className="inline-flex items-center gap-2 font-semibold text-primary-darker hover:underline"
            >
              Sign up now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
