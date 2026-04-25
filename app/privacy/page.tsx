import LegalPageLayout from "../components/LegalPageLayout";

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="April 2026" active="privacy">
      <p>
        At Travelyx-AI, one of our main priorities is the privacy of our users. This Privacy Policy explains what data we collect, how we use it, and how we protect it.
      </p>

      <section>
        <h2 className="mb-3 text-xl font-bold text-[var(--foreground)]">1. Information We Collect</h2>
        <p>
          When you create an account, we may collect details such as your full name, email address, and the travel preferences you submit while using the app.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold text-[var(--foreground)]">2. How We Use Your Information</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Provide and maintain the Travelyx platform</li>
          <li>Generate itineraries and improve the travel planning experience</li>
          <li>Understand product usage and prevent misuse</li>
          <li>Communicate account or security-related updates</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold text-[var(--foreground)]">3. Third-Party Services</h2>
        <p>
          Some itinerary generation relies on external AI services. Travel preferences may be processed through those services, but the goal is to avoid sending unnecessary personally identifiable information.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold text-[var(--foreground)]">4. Data Security</h2>
        <p>
          We use Supabase authentication and Row Level Security (RLS) to help keep account and trip data restricted to the appropriate user.
        </p>
      </section>
    </LegalPageLayout>
  );
}
