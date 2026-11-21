import type { RegionId, RegionPack } from "./types";

const deliveryBrands = [
  { name: "DHL", domains: ["dhl.com"] },
  { name: "FedEx", domains: ["fedex.com"] },
  { name: "UPS", domains: ["ups.com"] },
  { name: "Amazon", domains: ["amazon.com", "amazon.co.uk", "amazon.in"] },
];
const paymentBrands = [
  { name: "PayPal", domains: ["paypal.com"] },
  { name: "Paytm", domains: ["paytm.com"] },
  { name: "PhonePe", domains: ["phonepe.com"] },
];

export const regionPacks: Record<RegionId, RegionPack> = {
  in: {
    id: "in", name: "India", lastVerified: "2026-11-21",
    scamTypes: ["KYC", "UPI", "Aadhaar", "PAN", "FASTag", "traffic challan", "electricity", "telecom disconnection"],
    brands: [
      { name: "State Bank of India", domains: ["sbi.co.in"] },
      { name: "SBI", domains: ["sbi.co.in"] },
      { name: "HDFC", domains: ["hdfcbank.com"] },
      { name: "ICICI", domains: ["icicibank.com"] },
      { name: "Axis Bank", domains: ["axisbank.com"] },
      { name: "Punjab National Bank", domains: ["pnbindia.in"] },
      ...paymentBrands, ...deliveryBrands,
      { name: "India Post", domains: ["indiapost.gov.in"] },
      { name: "Income Tax", domains: ["incometax.gov.in"] },
      { name: "Aadhaar", domains: ["uidai.gov.in"] },
      { name: "UIDAI", domains: ["uidai.gov.in"] },
      { name: "TRAI", domains: ["trai.gov.in"] },
      { name: "NHAI", domains: ["nhai.gov.in"] },
      { name: "FASTag", domains: ["ihmcl.com"] },
      { name: "Sanchar Saathi", domains: ["sancharsaathi.gov.in"] },
    ],
    officialDomains: ["cybercrime.gov.in", "sancharsaathi.gov.in", "uidai.gov.in", "incometax.gov.in", "trai.gov.in", "parivahan.gov.in"],
    localCountryCodes: ["+91"],
    senderConventions: ["Bank sender IDs often contain a bank abbreviation", "Official messages do not ask for an OTP or card PIN"],
    reporting: [
      { label: "National cybercrime portal", value: "cybercrime.gov.in", url: "https://cybercrime.gov.in" },
      { label: "Financial fraud helpline", value: "1930" },
      { label: "Sanchar Saathi Chakshu", value: "sancharsaathi.gov.in", url: "https://sancharsaathi.gov.in" },
      { label: "Your bank", value: "Use the number on your card or the official bank website" },
    ],
  },
  us: {
    id: "us", name: "United States", lastVerified: "2026-11-21",
    scamTypes: ["bank verification", "delivery fee", "tax refund", "toll balance", "government benefit", "tech support"],
    brands: [...paymentBrands, ...deliveryBrands,
      { name: "IRS", domains: ["irs.gov"] },
      { name: "USPS", domains: ["usps.com"] },
      { name: "Social Security", domains: ["ssa.gov"] },
      { name: "FTC", domains: ["ftc.gov"] },
    ],
    officialDomains: ["reportfraud.ftc.gov", "ic3.gov", "irs.gov", "ssa.gov"],
    localCountryCodes: ["+1"],
    senderConventions: ["Government agencies do not demand gift cards", "Banks do not ask for an OTP by text"],
    reporting: [
      { label: "FTC fraud reporting", value: "reportfraud.ftc.gov", url: "https://reportfraud.ftc.gov" },
      { label: "Forward suspicious texts", value: "7726" },
      { label: "FBI Internet Crime Complaint Center", value: "ic3.gov", url: "https://www.ic3.gov" },
    ],
  },
  uk: {
    id: "uk", name: "United Kingdom", lastVerified: "2026-11-21",
    scamTypes: ["bank verification", "delivery fee", "tax refund", "TV licence", "government benefit", "road charge"],
    brands: [...paymentBrands, ...deliveryBrands,
      { name: "Royal Mail", domains: ["royalmail.com"] },
      { name: "Evri", domains: ["evri.com"] },
      { name: "HMRC", domains: ["gov.uk"] },
      { name: "DVLA", domains: ["gov.uk"] },
      { name: "NHS", domains: ["nhs.uk"] },
    ],
    officialDomains: ["gov.uk", "actionfraud.police.uk", "phishing.gov.uk"],
    localCountryCodes: ["+44"],
    senderConventions: ["Government departments do not request card details by text", "Banks do not ask for an OTP by text"],
    reporting: [
      { label: "Forward suspicious texts", value: "7726" },
      { label: "Suspicious email reporting", value: "report@phishing.gov.uk" },
      { label: "Action Fraud", value: "actionfraud.police.uk", url: "https://www.actionfraud.police.uk" },
    ],
  },
  generic: {
    id: "generic", name: "Other region", lastVerified: "2026-11-21",
    scamTypes: ["bank verification", "delivery", "government impersonation", "prize", "job offer"],
    brands: [...paymentBrands, ...deliveryBrands], officialDomains: [], localCountryCodes: [],
    senderConventions: ["Use contact details from an official app, card or website"],
    reporting: [{ label: "Local cybercrime authority", value: "Use your official government cybercrime reporting service" }],
  },
};

export function getRegionPack(region: RegionId): RegionPack {
  return regionPacks[region];
}
