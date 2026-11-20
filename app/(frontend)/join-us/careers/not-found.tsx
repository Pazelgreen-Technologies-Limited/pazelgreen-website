import Link from "next/link";
export default function CareersNotFound() {
  return <main className="mx-auto max-w-3xl px-6 pb-24 pt-44"><h1 className="text-3xl font-bold text-green-950">Position or page not found</h1><p className="mt-4 text-gray-600">This position may no longer be published, or the address may have changed.</p><Link className="mt-6 inline-block font-bold text-green-800 underline" href="/join-us/careers">View open positions</Link></main>;
}
