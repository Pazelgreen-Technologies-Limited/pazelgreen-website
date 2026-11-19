import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  async headers() {
    return [
      ...["/admin/:path*", "/api/:path*"].map(source => ({ source, headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] })),
      ...["/blog/preview/:path*", "/join-us/careers/preview/:path*", "/legal/preview/:path*"].map(source => ({ source, headers: [
        { key: "X-Robots-Tag", value: "noindex, nofollow" },
        { key: "Cache-Control", value: "private, no-store" },
        { key: "Referrer-Policy", value: "no-referrer" },
      ] })),
    ];
  },
};

export default withPayload(nextConfig);
