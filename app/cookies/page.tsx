import LegalPageLayout from "../components/LegalPageLayout";

export default function CookiePolicy() {
  return (
    <LegalPageLayout title="Cookie Policy" lastUpdated="April 2026" active="cookies">
      <p>
        This Cookie Policy explains how Travelyx-AI uses cookies and similar technologies to keep the app working properly and securely.
      </p>

      <section>
        <h2 className="mb-3 text-xl font-bold text-white">1. What Cookies Are</h2>
        <p>
          Cookies are small data files stored on your device that help websites remember information such as login state and preferences.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold text-white">2. How We Use Cookies</h2>
        <p>
          Travelyx primarily uses secure authentication cookies so users can sign in and access protected dashboard features without re-authenticating on every page.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold text-white">3. The Cookies We Set</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Account-related cookies for sign up and session handling</li>
          <li>Login-related cookies to maintain authenticated access</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold text-white">4. Disabling Cookies</h2>
        <p>
          You can disable cookies in your browser settings, but doing so may prevent login functionality and reduce access to protected app features.
        </p>
      </section>
    </LegalPageLayout>
  );
}
