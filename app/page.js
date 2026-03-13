import AIForm from "./ai/AIForm";

export default function Page() {
  return (
    <main className="min-h-screen p-8 flex justify-center items-start bg-gray-100">
      {/* Main AI travel planner form */}
      <AIForm />
    </main>
  );
}