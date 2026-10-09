import type { LucideIcon } from "lucide-react";
import {
  Compass,
  ShieldAlert,
  GraduationCap,
  BarChart4,
} from "lucide-react";

export type SolutionPillar = {
  id: string;
  title: string;
  icon: LucideIcon;
  challenge: string;
  approach: string;
  outcomes: string[];
  beneficiaries: string;
};

export const solutions: SolutionPillar[] = [
  {
    id: "market-coordination",
    title: "Digital Platforms & Market Coordination",
    icon: Compass,
    challenge:
      "Smallholder farmers produce across disparate, non-standardized clusters. Off-takers like feed mills and food conglomerates cannot negotiate with thousands of individual farmers, creating excessive dependence on opportunistic middlemen who capture up to 45% of value.",
    approach:
      "Pazelgreen builds digital market hubs that coordinate smallholder aggregation, standardizing batch quality, moisture measurement, and digital weighbridge verification before matching supply directly with corporate off-takers.",
    outcomes: [
      "Direct connection between smallholder clusters and industrial buyers",
      "Transparent daily price benchmarks cutting out unfair farmgate discounts",
      "Standardized contract templates and digital bills of lading",
      "Guaranteed escrow disbursement upon verified gate arrival",
    ],
    beneficiaries:
      "Agricultural Cooperatives, Industrial Processors, Commodity Aggregators",
  },
  {
    id: "waste-reduction",
    title: "Waste Reduction & Resource Optimization",
    icon: ShieldAlert,
    challenge:
      "Over 40% of perishable agricultural produce in Nigeria rots between the field and market. Without scheduled off-take calendars and decentralized cooling, farmers are forced to dump produce at distressed rates or watch it spoil at collection gates.",
    approach:
      "We integrate predictive harvest forecasting with decentralized cold storage hubs and haulage load-matching. By matching off-takers before harvest commences, produce dwells minimal hours at rural collection points.",
    outcomes: [
      "Pre-harvest buyer matching reducing on-farm dwell time by up to 60%",
      "Solar-powered modular cold storage at critical aggregation nodes",
      "Optimized haulage routes eliminating empty transit return trips",
      "Moisture monitoring ensuring grains do not develop toxic aflatoxins",
    ],
    beneficiaries: "Horticulture Growers, Grain Aggregators, Freight Carriers",
  },
  {
    id: "capacity-building",
    title: "Capacity Building & Ecosystem Development",
    icon: GraduationCap,
    challenge:
      "Software alone cannot bridge the digital divide in rural communities without human-centered training. Cooperative executives and rural aggregation workers often lack familiarity with digital ledgers, calibrated testing tools, and escrow frameworks.",
    approach:
      "Pazelgreen deploys field operations teams to train cooperative executives, warehouse managers, and youth aggregation agents. We run practical workshops on digital bookkeeping, moisture meter calibration, and quality grading.",
    outcomes: [
      "Digital literacy and mobile ledger tools for cooperative secretaries",
      "Practical training on calibrated grain testing and moisture standards",
      "Youth employment creation as certified local aggregation agents",
      "Formalization of cooperative transaction history for banking credit",
    ],
    beneficiaries:
      "Rural Cooperatives, Youth Field Agents, Women Farmer Associations",
  },
  {
    id: "data-intelligence",
    title: "Data & Intelligence for Agriculture",
    icon: BarChart4,
    challenge:
      "Emerging market agriculture suffers from acute data poverty. Institutional lenders, food multinationals, and policymakers make billion-naira decisions based on fragmented rumors rather than empirical field metrics.",
    approach:
      "We convert thousands of daily field transactions into reliable, anonymized data feeds. Our analytics track spot price trends across major terminal markets, harvest yield forecasts, and value chain climate vulnerabilities.",
    outcomes: [
      "Hyperlocal spot price indices updated daily across 8 trade corridors",
      "Predictive harvest volume models across key crop belts",
      "Auditable supply chain data for export compliance and ESG reporting",
      "Creditworthiness indicators for smallholder agricultural financing",
    ],
    beneficiaries:
      "Multinational FMCGs, Agricultural Banks, Policy Research Institutes",
  },
];
