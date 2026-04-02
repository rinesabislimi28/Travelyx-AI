import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans relative overflow-x-hidden">
      {/* Professional Dark Header Background */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-slate-900 rounded-b-[4rem] shadow-xl z-0"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-8 transition-colors font-bold text-sm bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/20 shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Home
        </Link>
        
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-200">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 drop-shadow-sm">Privacy Policy</h1>
          <p className="text-sm font-bold text-slate-400 mb-10 w-max uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">Last Updated: April 2026</p>
          
          <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed space-y-6">
            <p>At Travelyx-AI, accessible from our application, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Travelyx-AI and how we use it.</p>
            
            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4 border-b pb-2">1. Information We Collect</h2>
            <p>The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information. When you register for an Account, we may ask for your contact information, including items such as name and email address.</p>
            
            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4 border-b pb-2">2. How We Use Your Information</h2>
            <p>We use the information we collect in various ways, including to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Provide, operate, and maintain our application</li>
              <li>Improve, personalize, and expand our application</li>
              <li>Understand and analyze how you use our app</li>
              <li>Communicate with you, either directly or through one of our partners</li>
              <li>Find and prevent fraud</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4 border-b pb-2">3. Third-Party Services (AI)</h2>
            <p>Our core functionality relies on generating itineraries via external AI providers (Llama 3). The travel parameters you input (budget, style, duration) are processed by these APIs anonymously to return travel data. We do not send your personal identifieable information (PII) to these AI models.</p>

            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4 border-b pb-2">4. Data Security</h2>
            <p>We leverage industry-standard security measures including Supabase authentication and Row Level Security (RLS) to ensure that your saved trips and account details are strictly confidential and accessible only by you.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
