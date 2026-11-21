import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";

export const metadata: Metadata = { title: "Privacy" };
export default function PrivacyPage() {
  return (
    <main>
      <PageHero title="Privacy">
        <p>
          ScamShield is designed to analyse a message without creating a report or account
          record.
        </p>
      </PageHero>
      <div className="container prose-page">
        <section>
          <h2>Default analysis</h2>
          <p>
            Your message is processed for the current result only. It is not saved in a
            database or browser store. Closing or refreshing the page removes the in-page
            result. Anonymous case IDs identify the current result but do not create a
            saved case.
          </p>
        </section>
        <section>
          <h2>AI providers</h2>
          <p>
            If Gemini or Bedrock is configured, the server masks codes, card-like numbers,
            identity-like numbers and phone numbers before sending text. The report shows
            the exact redacted payload. Without a provider, message text is not sent to
            AI.
          </p>
        </section>
        <section>
          <h2>Threat sources</h2>
          <p>
            Only extracted URLs can be sent to enabled threat sources. Message text is not
            sent to them. Results can be cached by URL hash for up to one hour. Source
            responses can be unavailable or wrong.
          </p>
        </section>
        <section>
          <h2>Screenshots</h2>
          <p>
            Images are processed in memory and discarded after the check. PNG, JPEG and
            WebP files up to 5MB are accepted after checking their signatures. Without a
            vision provider, upload is rejected and you can paste the text instead. Images
            are not stored unless a future save option explicitly says so.
          </p>
        </section>
        <section>
          <h2>Saving and accounts</h2>
          <p>
            Saving is hidden when no account service is configured. If enabled later, only
            your chosen report fields are stored. Redacted message text is stored only
            with your separate opt-in. You can delete your saved reports.
          </p>
        </section>
        <section>
          <h2>Analytics and monitoring</h2>
          <p>
            Optional analytics use an allow-list of event names and properties. Message
            text, URLs and screenshots are never included. Error monitoring follows the
            same restriction. These integrations stay off without configuration.
          </p>
        </section>
      </div>
    </main>
  );
}
