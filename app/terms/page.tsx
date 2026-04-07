import LegalPageLayout from "../components/LegalPageLayout";

export default function TermsOfService() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="April 2026" active="terms">
      <p>
        By using Travelyx-AI, you agree to these terms. If you do not agree, you should not continue using the platform.
      </p>

      <section>
        <h2 className="mb-3 text-xl font-bold text-white">1. Usage</h2>
        <p>
          Travelyx-AI is intended for travel planning support. You may use the service for personal or internal planning purposes, subject to these terms.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold text-white">2. User Responsibilities</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Do not misuse the service or attempt unauthorized access</li>
          <li>Do not republish or resell platform content without permission</li>
          <li>Review travel details independently before making bookings</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold text-white">3. AI Content Accuracy</h2>
        <p>
          Travelyx-AI generates travel plans using AI. Suggested costs, durations, and recommendations are estimates and should be verified with official travel providers before purchase or booking.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold text-white">4. Liability</h2>
        <p>
          To the maximum extent permitted by law, Travelyx is not liable for loss, inconvenience, or travel decisions made based on generated itinerary content.
        </p>
      </section>
    </LegalPageLayout>
  );
}
