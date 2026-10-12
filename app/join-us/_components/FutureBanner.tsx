// import Button from "@/components/ui/Button";
// import { ArrowRight } from "lucide-react";
// import Link from "next/link";

// export default function FutureBanner() {
//   return (
//     <section className="bg-background-alt px-6 py-16 md:py-20">
//       <div className="mx-auto max-w-[1200px]">
//         <div className="max-w-2xl">
//           <h2 className="font-sans text-3xl font-bold text-primary-darker sm:text-4xl">
//             Let&apos;s Build the Future Together
//           </h2>
//           <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
//             Reach out to discuss your interests, ask questions, or propose new
//             opportunities. We&apos;d love to hear from you.
//           </p>
//           <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
//             <Button href="/join-us/careers" variant="solid">
//               Career Inquiries
//             </Button>
//             <Link
//               href="/join-us/partnerships"
//               className="inline-flex items-center gap-2 font-semibold text-primary-darker hover:underline"
//             >
//               Partnership Inquiries <ArrowRight size={16} />
//             </Link>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import BackgroundSection from "@/components/BackgroundSection";
import Button from "@/components/ui/Button";

export default function FutureBanner() {
  return (
    <BackgroundSection
      imageSrc="/future-bg.jpg"
      imageAlt="Drone flying over agricultural field with a humanoid robot"
      overlayColor="bg-gradient-to-b from-[#052E16]/10 to-[#14532D]/90"
      height="h-[500px]"
    >
      <h2 className="max-w-xl text-4xl font-bold text-background md:text-3xl">
        Let&apos;s Build the Future Together
      </h2>
      <p className="mt-3 max-w-lg text-sm text-background/90 md:text-base">
        Reach out to discuss your interests, ask questions, or propose new
        opportunities. We&apos;d love to hear from you.
      </p>

      {/* Two CTA buttons */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Button href="/join-us/careers" variant="white">
          Career Inquiries
        </Button>
        <Button href="/join-us/partnerships" variant="solid">
          Partnership Inquiries
        </Button>
      </div>
    </BackgroundSection>
  );
}
