import type { Signal, Tactic } from "./types";

type TextRule = {
  id: string;
  tactic: Tactic;
  pattern: RegExp;
  weight: number;
  confidence: number;
  explanation: string;
  allowNegated?: boolean;
};
const rule = (
  id: string,
  tactic: Tactic,
  pattern: RegExp,
  weight: number,
  explanation: string,
  confidence = 0.86,
  allowNegated = false,
): TextRule => ({ id, tactic, pattern, weight, explanation, confidence, allowNegated });

const rules: TextRule[] = [
  rule("urgency.deadline", "urgency", /\b(?:urgent|immediately|right now|act now|within (?:\d+|one|two) (?:hours?|days?|minutes?)|last chance|expires? (?:today|tonight|now)|today only)\b/gi, 18, "A short deadline pressures you to act before checking the sender."),
  rule("threat.account", "threat of loss", /\b(?:account (?:has been |is |will be )?(?:blocked|suspended|closed|locked)|card (?:has been |is |will be )?(?:blocked|suspended)|service (?:will be )?disconnect(?:ed|ion)|electricity (?:will be )?disconnect(?:ed|ion)|legal action|arrest warrant|digital arrest|sim (?:will be )?blocked|number (?:will be )?disconnect(?:ed|ion)|kyc (?:has )?expired)\b/gi, 26, "The message threatens loss of money, access or a service to create fear."),
  rule("payment.request", "payment demand", /\b(?:pay\s+(?:rs\.?|inr|£|\$|₹|usd|gbp)\s?\d[\d,]*(?:\.\d{1,2})?|pay\s+\d+(?:\.\d+)?\s*(?:rs\.?|inr|£|\$|₹)|send\s+(?:money|rs\.?|inr|£|\$|₹)|transfer\s+(?:rs\.?|inr|£|\$|₹|usd)|processing fee|release fee|redelivery fee|customs fee|refundable deposit|collect request|gift cards?|scan (?:this |the )?qr (?:code )?to (?:receive|get|claim)|make (?:a )?payment)\b/gi, 27, "A payment or transfer is requested before you can verify the claim."),
  rule("credential.request", "credential or OTP request", /\b(?:share|send|enter|provide|verify|confirm|give|update)\s+(?:me\s+|us\s+|your\s+|the\s+|bank\s+|card\s+)*(?:otp|one[- ]time password|cvv|pin|password|card (?:number|details)|login details|aadhaar (?:number|details)|ssn|social security number)\b/gi, 38, "Passwords, PINs and one-time codes can give another person access to your account."),
  rule("credential.harvest", "credential or OTP request", /\b(?:verify (?:your )?(?:account|identity|details)|confirm (?:your )?(?:account|identity|details)|log ?in to (?:restore|unlock|verify))\b/gi, 23, "The wording directs you to enter account information, which can be collected by a fake page."),
  rule("authority.named", "authority pressure", /\b(?:cbi|police|customs|court|trai|income tax department|hmrc|irs|reserve bank|rbi|government)\b/gi, 13, "A trusted authority is named to make the demand feel official. Confirm it independently."),
  rule("offer.prize", "too-good-to-be-true", /\b(?:you(?: have|'?ve)? won|winner|lottery|jackpot|cash prize|free (?:iphone|gift|money)|guaranteed (?:income|returns?)|earn\s+(?:rs\.?|inr|£|\$|₹)\s?\d|daily income|work from home and earn|claim your (?:reward|refund|benefit|prize))\b/gi, 27, "An unexpected reward or guaranteed return is used to create interest in the next step."),
  rule("offer.tasks", "too-good-to-be-true", /\b(?:tasks? (?:to earn|for commission)|like (?:and subscribe|videos)|prepaid task|part[- ]time job.{0,30}commission)\b/gi, 25, "Simple online tasks and promised commission can lead to a demand for an upfront payment."),
  rule("secrecy.demand", "secrecy", /\b(?:keep (?:this|it) (?:secret|confidential)|do not tell (?:anyone|your bank)|don't tell (?:anyone|your bank)|do not contact (?:the )?(?:bank|police)|stay on (?:the )?line|keep this between us)\b/gi, 17, "Secrecy isolates you from people who could check the claim or interrupt the scam."),
  rule("impersonation.relative", "impersonation", /\b(?:(?:mom|mum|dad|son|daughter|brother|sister).{0,35}(?:new number|lost my phone|need money)|new number.{0,30}(?:mom|mum|dad))\b/gi, 25, "The sender claims to be someone you know. Check through the person's existing number first."),
  rule("delivery.hold", "threat of loss", /\b(?:parcel (?:is )?(?:held|on hold|pending)|package (?:is )?(?:held|on hold)|customs (?:holding|held)|redelivery required)\b/gi, 19, "A held parcel is used as a reason to request a small payment or personal details."),
  rule("offer.refund", "too-good-to-be-true", /\b(?:tax refund.{0,60}(?:claim|click|link|verify)|refund.{0,30}(?:processing fee|click here))\b/gi, 25, "An unexpected refund is tied to a claim, link or verification step."),
  rule("threat.loan", "threat of loss", /\b(?:loan.{0,40}(?:harass|contact list|shame|defame)|repay.{0,20}(?:today|now).{0,30}(?:contact list|photos))\b/gi, 27, "The message uses harassment or exposure to force a payment. Preserve evidence and seek official help."),
  rule("impersonation.support", "impersonation", /\b(?:support (?:number|helpline).{0,40}(?:call|dial)|customer care number.{0,30}(?:call|dial))\b/gi, 24, "An unsolicited support number can connect you to an impersonator rather than the real provider."),
  rule("impersonation.kyc", "impersonation", /\b(?:kyc|aadhaar|pan) (?:update|verification|re-?verification|expired|blocked)\b/gi, 21, "Identity or account verification is used to make a request for details appear routine."),
  rule("payment.toll", "payment demand", /\b(?:traffic challan|toll (?:balance|payment|fee)|fastag (?:blocked|blacklisted|expired))\b/gi, 19, "A toll or traffic charge can be imitated to push you towards a fake payment page."),
];

function negated(input: string, index: number): boolean {
  const before = input.slice(Math.max(0, index - 36), index);
  return /\b(?:do not|don't|never)\b[^.!?\n]{0,36}$/i.test(before);
}

export function runTextRules(input: string): Signal[] {
  const signals: Signal[] = [];
  for (const item of rules) {
    let count = 0;
    for (const match of input.matchAll(item.pattern)) {
      const index = match.index ?? 0;
      if (!item.allowNegated && negated(input, index)) continue;
      if (count >= 3) break;
      signals.push({
        id: `${item.id}.${count + 1}`,
        tactic: item.tactic,
        weight: item.weight,
        confidence: item.confidence,
        quote: match[0],
        span: { start: index, end: index + match[0].length },
        explanation: item.explanation,
        source: "text",
      });
      count += 1;
    }
  }
  return signals;
}
