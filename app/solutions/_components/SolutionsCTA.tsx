import Button from "@/components/ui/Button";

export default function SolutionsCTA() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
      <div className="space-y-6 rounded-3xl bg-primary-darker p-8 text-center text-inverse-foreground sm:p-12">
        <h2 className="font-sans text-3xl font-extrabold sm:text-4xl">
          Deploy these capabilities in your agricultural project
        </h2>
        <p className="mx-auto max-w-2xl text-sm text-inverse-foreground/80 sm:text-base">
          We partner with agribusinesses, state agricultural boards, and
          development finance institutions to tailor programs to specific crop
          value chains.
        </p>
        <div className="flex justify-center pt-2">
          <Button variant="white" href="/contact?type=partner">
            Consult with our solutions team
          </Button>
        </div>
      </div>
    </section>
  );
}
