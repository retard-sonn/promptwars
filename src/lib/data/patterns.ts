import type { RegionId, Tactic } from "@/lib/analysis/types";

export type District = "Banks" | "Delivery" | "Government";
export type ScamPattern = {
  slug: string;
  name: string;
  district: District;
  region: RegionId;
  tactics: Tactic[];
  example: string;
  explanation: string;
  advice: string;
};
export const patterns: ScamPattern[] = [
  {
    slug: "bank-kyc-update",
    name: "Bank KYC update",
    district: "Banks",
    region: "in",
    tactics: ["impersonation", "urgency", "credential or OTP request"],
    example:
      "HDFC: Your KYC update is urgent. Verify your account at https://hdfc-verify.example/kyc.",
    explanation:
      "A routine identity check is used to move you to a fake verification page.",
    advice:
      "Use the bank's official app or visit a branch. Do not use the supplied link.",
  },
  {
    slug: "card-blocked",
    name: "Card blocked",
    district: "Banks",
    region: "uk",
    tactics: ["threat of loss", "credential or OTP request"],
    example:
      "Your bank card is blocked. Enter your OTP now at https://card-unblock.test/verify.",
    explanation:
      "Fear of losing card access is paired with a request for a code that can authorise access.",
    advice:
      "Call the number on the back of your card. Never share an OTP with a caller or page.",
  },
  {
    slug: "upi-collect-request",
    name: "UPI collect request",
    district: "Banks",
    region: "in",
    tactics: ["payment demand", "urgency"],
    example: "UPI collect request of Rs 4,999 is waiting. Act now to approve it.",
    explanation:
      "A collect request takes money from you. It is not a payment being sent to you.",
    advice: "Reject unexpected collect requests and check the payee in your UPI app.",
  },
  {
    slug: "delivery-fee",
    name: "Delivery fee",
    district: "Delivery",
    region: "uk",
    tactics: ["payment demand", "impersonation"],
    example:
      "Royal Mail parcel is held. Pay £1.45 redelivery fee at https://royalmail-redelivery.example/pay.",
    explanation:
      "A small fee lowers your guard before a fake page collects card details.",
    advice: "Track the parcel using a reference in the official app or website.",
  },
  {
    slug: "customs-parcel",
    name: "Customs parcel",
    district: "Delivery",
    region: "in",
    tactics: ["authority pressure", "payment demand", "threat of loss"],
    example:
      "Customs held your package. Pay Rs 99 customs fee immediately at https://customs-clearance.test/pay.",
    explanation:
      "An authority and a held parcel create pressure to pay without checking.",
    advice: "Contact the carrier and customs through official contact details.",
  },
  {
    slug: "toll-traffic-fine",
    name: "Toll or traffic fine",
    district: "Government",
    region: "us",
    tactics: ["payment demand", "urgency"],
    example:
      "Your toll balance is overdue. Act now and pay at https://short.example/toll42.",
    explanation:
      "A plausible small debt is used to rush a payment through a shortened link.",
    advice: "Check your toll or challan account through the official transport service.",
  },
  {
    slug: "electricity-disconnection",
    name: "Electricity disconnection",
    district: "Government",
    region: "in",
    tactics: ["threat of loss", "urgency", "payment demand"],
    example:
      "Your electricity will be disconnected tonight. Pay Rs 1,240 immediately to continue service.",
    explanation: "The threat of losing an essential service creates immediate pressure.",
    advice:
      "Check the bill in your electricity provider's official app or customer service.",
  },
  {
    slug: "tax-refund",
    name: "Tax refund",
    district: "Government",
    region: "uk",
    tactics: ["too-good-to-be-true", "authority pressure"],
    example:
      "HMRC: Your tax refund is waiting. Claim your refund at https://hmrc-refund.example/claim.",
    explanation:
      "An unexpected refund encourages you to share banking or identity details.",
    advice: "Sign in to your official tax account yourself. Do not use the message link.",
  },
  {
    slug: "government-benefit",
    name: "Government benefit",
    district: "Government",
    region: "in",
    tactics: ["too-good-to-be-true", "authority pressure"],
    example:
      "Government benefit approved for your family. Claim your benefit today only at https://benefit-grant.test/apply.",
    explanation: "A benefit offer is tied to an urgent claim page.",
    advice: "Check eligibility through the official department, not a message link.",
  },
  {
    slug: "prize-lottery",
    name: "Prize or lottery",
    district: "Banks",
    region: "in",
    tactics: ["too-good-to-be-true", "urgency"],
    example:
      "You have won a cash prize of Rs 25,00,000 in the lottery. Act now to receive it.",
    explanation:
      "A large unexpected prize prepares you for a fee or personal-information request.",
    advice: "Do not pay a fee to release a prize you did not enter to win.",
  },
  {
    slug: "whatsapp-job-tasks",
    name: "Job task scam on WhatsApp",
    district: "Banks",
    region: "in",
    tactics: ["too-good-to-be-true", "payment demand"],
    example:
      "WhatsApp part-time job: complete tasks for commission and earn Rs 5000 daily from home.",
    explanation:
      "Small initial rewards can lead to larger prepaid tasks that never return your money.",
    advice: "Do not deposit money for paid tasks. Verify the employer independently.",
  },
  {
    slug: "loan-app-harassment",
    name: "Loan app harassment",
    district: "Banks",
    region: "in",
    tactics: ["threat of loss", "payment demand"],
    example:
      "Your loan repayment is overdue. Repay today or we will defame you to your contact list.",
    explanation:
      "Threats of exposure are used to force payment and stop you seeking help.",
    advice: "Preserve evidence, contact the lender formally and report the harassment.",
  },
  {
    slug: "impersonated-relative",
    name: "Impersonated relative",
    district: "Banks",
    region: "in",
    tactics: ["impersonation", "urgency", "payment demand"],
    example:
      "Hi Mum, this is my new number. I need money urgently. Please send Rs 8,000 now.",
    explanation: "A familiar name and a new number make an urgent payment feel personal.",
    advice:
      "Call the person's existing number or another family member before sending money.",
  },
  {
    slug: "digital-arrest",
    name: "Digital arrest call script",
    district: "Government",
    region: "in",
    tactics: ["authority pressure", "threat of loss", "secrecy"],
    example:
      "CBI has ordered your digital arrest. Keep this confidential and stay on the line while the officer verifies you.",
    explanation:
      "A fake investigation uses fear and isolation to control your next action.",
    advice:
      "End the call and contact the agency through an official number. Police do not conduct digital arrests.",
  },
  {
    slug: "fake-support-number",
    name: "Fake support number",
    district: "Government",
    region: "us",
    tactics: ["impersonation", "urgency", "payment demand"],
    example:
      "Apple support number: call this support helpline immediately and buy gift cards to remove the virus.",
    explanation:
      "An unsolicited number connects you to someone posing as technical support.",
    advice:
      "Find support through the provider's official site. Never pay support with gift cards.",
  },
  {
    slug: "qr-payment-trap",
    name: "QR code payment trap",
    district: "Banks",
    region: "in",
    tactics: ["payment demand", "too-good-to-be-true"],
    example:
      "You won a reward. Scan this QR code to receive Rs 2,000 in your bank account.",
    explanation:
      "Scanning a payment QR can authorise money leaving your account, not entering it.",
    advice:
      "Check the payee and action in your payment app before approving any QR request.",
  },
];
export function patternBySlug(slug: string) {
  return patterns.find((pattern) => pattern.slug === slug);
}
export function districtCount(district: District) {
  return patterns.filter((pattern) => pattern.district === district).length;
}
