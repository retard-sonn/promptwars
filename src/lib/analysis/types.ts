export const regionIds = ["in", "us", "uk", "generic"] as const;
export type RegionId = (typeof regionIds)[number];
export type Channel = "sms" | "whatsapp" | "email" | "unknown";
export type Verdict = "Likely a scam" | "Suspicious" | "No clear signs of fraud" | "Not enough to tell";
export type Tactic =
  | "urgency"
  | "impersonation"
  | "payment demand"
  | "credential or OTP request"
  | "authority pressure"
  | "too-good-to-be-true"
  | "secrecy"
  | "threat of loss"
  | "lookalike link"
  | "sender mismatch";

export type Span = { start: number; end: number };
export type EntityKind = "url" | "phone" | "email" | "upi" | "amount" | "brand";
export type Entity = { kind: EntityKind; value: string; span: Span };
export type Sender = { raw: string; displayName?: string; address?: string; phone?: string };
export type Extraction = {
  urls: string[];
  entities: Entity[];
  brands: string[];
  sender?: Sender;
  channel: Channel;
};
export type NormalisedText = {
  text: string;
  starts: number[];
  ends: number[];
  mixedScript: boolean;
  zeroWidthRemoved: number;
};
export type Signal = {
  id: string;
  tactic: Tactic;
  weight: number;
  confidence: number;
  quote: string;
  span: Span;
  explanation: string;
  source: "text" | "link" | "sender";
};
export type UrlAnatomy = {
  scheme: string;
  subdomain: string;
  domain: string;
  tld: string;
  path: string;
};
export type LinkFinding = {
  code: string;
  label: string;
  detail: string;
  weight: number;
};
export type AnalyzedLink = {
  raw: string;
  normalized: string;
  host: string;
  span: Span;
  anatomy: UrlAnatomy;
  findings: LinkFinding[];
  lookalikeOf?: string;
  expandedUrl?: string;
};
export type RulesResult = {
  score: number;
  confidence: number;
  verdict: Verdict;
  signals: Signal[];
  links: AnalyzedLink[];
  extraction: Extraction;
  normalisation: { mixedScript: boolean; zeroWidthRemoved: number };
  summary: string;
};
export type BrandProfile = { name: string; domains: string[] };
export type ReportingChannel = { label: string; value: string; url?: string };
export type RegionPack = {
  id: RegionId;
  name: string;
  lastVerified: string;
  scamTypes: string[];
  brands: BrandProfile[];
  officialDomains: string[];
  localCountryCodes: string[];
  senderConventions: string[];
  reporting: ReportingChannel[];
};
