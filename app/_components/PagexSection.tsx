import Image from "next/image";
import Button from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";

const platformCapabilities = [
  "Connect farmers, buyers, and service providers",
  "Coordinate activity across agricultural value chains",
  "Support more transparent trade and market visibility",
];

export default function PagexSection() {
  return (
    <section className="bg-primary-darker px-6 py-16 text-inverse-foreground md:py-20">
      <div className="mx-auto grid max-w-300 grid-cols-1 items-center gap-8 md:grid-cols-[1.1fr_0.9fr] md:gap-12">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-primary-light">
            Featured platform
          </p>
          <h2 className="mt-2 text-4xl font-extrabold sm:text-5xl">PAGEX</h2>
          <p className="mt-4 max-w-2xl text-lg font-semibold text-inverse-foreground">
            Ecosystem coordination and market intelligence for agricultural
            trade.
          </p>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-inverse-foreground/80">
            A platform connecting agricultural value-chain participants to
            coordinate activity, improve visibility, and enable more efficient
            exchange.
          </p>

          <ul className="mt-6 space-y-3">
            {platformCapabilities.map((capability) => (
              <li key={capability} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-light" />
                <span>{capability}</span>
              </li>
            ))}
          </ul>

          <Button
            href="/pagex"
            variant="white"
            showArrow
            className="mt-8 transition-transform duration-200 hover:-translate-y-0.5"
          >
            Open PAGEX
          </Button>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md">
          <Image
            src="/pagex-network-visual.png"
            alt="Network illustration showing connected stakeholders and synchronized market data"
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
