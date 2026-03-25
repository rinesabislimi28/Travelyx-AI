import AIForm from "../ai/AIForm";
import ProtectedRoute from "../components/ProtectedRoute";

/**
 * Dashboard Page Component
 * ------------------------
 * This is the main application interface, accessible only after login.
 * It strictly wraps the AIForm component inside a <ProtectedRoute>
 * to ensure that only authenticated users can access the AI features.
 */
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen w-full bg-slate-900">
        <AIForm />
      </main>
    </ProtectedRoute>
  );
}
