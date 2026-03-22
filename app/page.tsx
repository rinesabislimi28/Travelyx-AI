import AIForm from "./ai/AIForm";
import ProtectedRoute from "./components/ProtectedRoute";

/**
 * Main Page Component
 * -------------------
 * This is the root landing page, accessible only after login.
 * It strictly wraps the AIForm component inside a <ProtectedRoute>
 * to ensure that only authenticated users can access the OpenAI/Groq API.
 */
export default function Page() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen w-full bg-slate-900">
        <AIForm />
      </main>
    </ProtectedRoute>
  );
}