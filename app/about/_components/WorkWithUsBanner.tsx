import Button from "@/components/ui/Button";

export default function WorkWithUsBanner() {
  return (
    <section className="w-full bg-gradient-to-r from-[#073616] via-[#0E5B25] to-[#128827] py-8 text-white shadow-inner sm:py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
          Work With Us – To Build What&apos;s Next
        </h2>

        <Button
          href="/join-us"
          variant="white"
          className="rounded-full! px-8! py-3! font-semibold text-gray-900 shadow-md transition-transform hover:scale-105"
        >
          Partner With Us
        </Button>
      </div>
    </section>
  );
}
