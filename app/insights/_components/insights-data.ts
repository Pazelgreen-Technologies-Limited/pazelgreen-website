/**
 * Placeholder insight articles until `@/lib/site-config` is provided.
 * Images reuse existing public assets as stand-ins.
 */
export type InsightArticle = {
  id: string;
  title: string;
  summary: string;
  category: string;
  publishedAt: string;
  readTime: string;
  image: string;
  author: {
    name: string;
    role: string;
  };
  content: string[];
};

export const categories = [
  "All",
  "Market Intelligence",
  "Value Chain Economics",
  "Fintech & Trade Infrastructure",
] as const;

export const insights: InsightArticle[] = [
  {
    id: "spot-price-transparency",
    title: "Why farmgate price opacity still costs Nigerian grain growers 20–35%",
    summary:
      "A field look at how fragmented price discovery between rural clusters and terminal markets transfers value to opportunistic intermediaries.",
    category: "Market Intelligence",
    publishedAt: "Mar 2026",
    readTime: "8 min",
    image: "/about-fragmentation.png",
    author: {
      name: "Adaobi Okeke",
      role: "Market Intelligence Lead",
    },
    content: [
      "Across major grain corridors in Nigeria, smallholders still discover prices through word of mouth, local agents, or last week's terminal rumor. That lag is not a soft inconvenience — it is a structural transfer of margin.",
      "When cooperatives lack a shared daily benchmark, buyers can quote farmgate discounts that appear reasonable in isolation but compound across a harvest window. Our corridor tracking suggests effective discounts of 20–35% versus transparently published terminal-adjacent indices.",
      "Digital market coordination does not eliminate negotiation. It compresses asymmetric information so both sides start from the same observable facts: moisture, grade, volume, and a credible reference price.",
      "PAGEX-style hubs make those facts portable. Once a batch is verified at aggregation, the same record can travel with the lot — reducing the room for informal re-grading and last-mile surprises.",
    ],
  },
  {
    id: "post-harvest-dwell",
    title: "Cutting on-farm dwell time: the economics of pre-harvest off-take matching",
    summary:
      "Post-harvest loss is often framed as a cooling problem. Timing and buyer certainty are usually the tighter constraints.",
    category: "Value Chain Economics",
    publishedAt: "Feb 2026",
    readTime: "6 min",
    image: "/vision-bg.jpg",
    author: {
      name: "Ibrahim Musa",
      role: "Supply Chain Economist",
    },
    content: [
      "Cooling infrastructure matters, but many Nigerian perishable losses begin before a cold room is even relevant. Produce waits — at the farmgate, at an informal collection point, or on an overloaded truck with no confirmed buyer.",
      "Pre-harvest off-take matching flips the sequence. Buyers commit to volume windows before harvest peaks; aggregators schedule haulage against those windows; farmers harvest into a known demand slot.",
      "In pilots where dwell time at rural nodes fell by roughly half, distressed selling declined and grade compliance improved. Certainty changes farmer behavior as much as hardware does.",
      "The implication for investors and DFIs: logistics CapEx without demand coordination underperforms. Pair storage and haulage with contractual matching, not as an afterthought.",
    ],
  },
  {
    id: "escrow-for-aggregators",
    title: "Escrow and digital bills of lading as trade infrastructure for aggregators",
    summary:
      "How settlement rails and verifiable delivery records unlock trust between cooperatives, haulage, and industrial off-takers.",
    category: "Fintech & Trade Infrastructure",
    publishedAt: "Jan 2026",
    readTime: "7 min",
    image: "/impact-bg.jpg",
    author: {
      name: "Chioma Eze",
      role: "Trade Infrastructure Lead",
    },
    content: [
      "Agricultural trade fails quietly when payment and proof of delivery are informal. Aggregators front cash, carriers move loads on trust, and off-takers dispute quality after the truck has already left the gate.",
      "Escrow tied to verified gate arrival changes incentives. Funds release when weighbridge, moisture, and quality checks clear — not when a phone call says the truck is 'almost there.'",
      "Digital bills of lading give every party the same narrative of the shipment. That shared record is the foundation for dispute reduction and, eventually, working-capital products priced on observable performance.",
      "Fintech in agritech is not a wallet bolted onto a marketplace. It is settlement discipline woven into physical trade events.",
    ],
  },
  {
    id: "cooperative-credit-histories",
    title: "From informal ledgers to bankable cooperative transaction histories",
    summary:
      "Why digital bookkeeping at the cooperative level is a credit product in disguise — not just an admin upgrade.",
    category: "Fintech & Trade Infrastructure",
    publishedAt: "Dec 2025",
    readTime: "5 min",
    image: "/get-involved-bg.jpg",
    author: {
      name: "Tunde Adebayo",
      role: "Rural Finance Advisor",
    },
    content: [
      "Lenders do not struggle to find farmers. They struggle to underwrite them. Without a durable transaction history, every season looks like a first-time borrower.",
      "Cooperatives that digitize aggregation, payment, and delivery events create a portable credit narrative: volumes fulfilled, quality consistency, repayment behavior on input advances.",
      "Field training on mobile ledgers is therefore not 'capacity building' theater. It is the on-ramp to formal finance for women farmer associations and youth aggregation agents alike.",
      "The institutions that treat cooperative digitalization as infrastructure — not a CSR workshop — will own the next decade of agricultural lending.",
    ],
  },
];
