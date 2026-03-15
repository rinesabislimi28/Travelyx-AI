import AIForm from "./ai/AIForm";

/**
 * Main Page Component
 * ----------------------------
 * Renders the AIForm component for the travel planner
 */
export default function Page() {
  return (
    <main className="min-h-screen flex justify-center items-start bg-slate-100">
      <AIForm />
    </main>
  );
}