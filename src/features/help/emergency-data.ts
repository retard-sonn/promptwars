import { getRegionPack } from "@/lib/analysis/regions";
import type { RegionId } from "@/lib/analysis/types";

export const emergencyOptions = [
  ["clicked", "Clicked a link"],
  ["password", "Entered a password"],
  ["otp", "Shared an OTP"],
  ["paid", "Paid money"],
  ["app", "Installed an app"],
  ["id", "Shared an ID document"],
] as const;
export type EmergencyAction = (typeof emergencyOptions)[number][0];
type Steps = { hour: string[]; day: string[]; week: string[] };
const steps: Record<EmergencyAction, Steps> = {
  clicked: {
    hour: [
      "Close the page and do not enter more information.",
      "Check your browser downloads and remove anything unexpected.",
    ],
    day: ["Run a reputable device scan and review recent browser permissions."],
    week: ["Watch for new messages that refer to the link or your details."],
  },
  password: {
    hour: [
      "Change the password from a clean device, then change it anywhere it was reused.",
      "Sign out other sessions where the provider offers that control.",
    ],
    day: ["Turn on multi-factor authentication and review account recovery details."],
    week: ["Review login alerts and account activity for anything you do not recognise."],
  },
  otp: {
    hour: [
      "Contact the bank or provider through an official number and say that a code was shared.",
      "Ask them to protect the account and review recent transactions.",
    ],
    day: ["Review account activity and change any reused passwords."],
    week: ["Watch for payment, SIM-swap and account-recovery attempts."],
  },
  paid: {
    hour: [
      "Call the bank, card issuer or payment provider now and ask about freezing or recalling the payment.",
      "Preserve the receipt, payee details, message and call logs.",
    ],
    day: [
      "Complete the provider's fraud report and use the official regional reporting channel.",
    ],
    week: ["Follow up the dispute and monitor statements for further charges."],
  },
  app: {
    hour: [
      "Disconnect the device if someone has remote access, then uninstall the unknown app.",
      "Do not open the app to check whether it works.",
    ],
    day: [
      "Run a reputable device scan, review app permissions and change important passwords from a clean device.",
    ],
    week: [
      "Watch for account alerts and unexpected accessibility or device-admin changes.",
    ],
  },
  id: {
    hour: [
      "Contact the document issuer and your bank if the document can be used for financial checks.",
      "Keep a record of exactly which document and details were shared.",
    ],
    day: [
      "Use the official regional reporting channel and ask about available identity monitoring or credit protections.",
    ],
    week: [
      "Watch for new accounts, SIM-swap attempts and official letters you do not recognise.",
    ],
  },
};
export function buildChecklist(actions: EmergencyAction[], region: RegionId): Steps {
  const priority: EmergencyAction[] = ["paid", "otp", "app", "password", "id", "clicked"];
  const selected = priority.filter((action) => actions.includes(action));
  const pack = getRegionPack(region);
  return {
    hour: [
      ...selected.flatMap((action) => steps[action].hour),
      ...pack.reporting
        .slice(0, 1)
        .map((channel) => `${channel.label}: ${channel.value}.`),
    ],
    day: [
      ...selected.flatMap((action) => steps[action].day),
      ...pack.reporting.slice(1).map((channel) => `${channel.label}: ${channel.value}.`),
    ],
    week: selected.flatMap((action) => steps[action].week),
  };
}
