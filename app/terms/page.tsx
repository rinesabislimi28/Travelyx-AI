import Link from "next/link";

export default function TermsOfService() {
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
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 drop-shadow-sm">Terms of Service</h1>
          <p className="text-sm font-bold text-slate-400 mb-10 w-max uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">Last Updated: April 2026</p>
          
          <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed space-y-6">
            <p>Welcome to Travelyx-AI. By accessing this application, we assume you accept these terms and conditions. Do not continue to use Travelyx-AI if you do not agree to take all of the terms and conditions stated on this page.</p>
            
            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4 border-b pb-2">1. License & Usage</h2>
            <p>Unless otherwise stated, Travelyx-AI and/or its licensors own the intellectual property rights for all material on Travelyx. All intellectual property rights are reserved. You may access this for your own personal use subjected to restrictions set in these terms and conditions.</p>
            
            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4 border-b pb-2">2. User Responsibilities</h2>
            <p>Users must not:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Republish material from Travelyx-AI</li>
              <li>Sell, rent or sub-license material from Travelyx-AI</li>
              <li>Reproduce, duplicate or copy material from Travelyx-AI</li>
              <li>Redistribute content without attribution</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4 border-b pb-2">3. Accuracy of AI Generated Content</h2>
            <p>Travelyx-AI utilizes advanced Artificial Intelligence (Llama 3) to generate travel itineraries. While we strive for accuracy, the simulated costs, suggested durations, and venue availabilities are strictly estimates. We do not guarantee the real-time accuracy of flights, hotels, or activity prices. Always verify with official vendors before booking.</p>

            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4 border-b pb-2">4. Disclaimers</h2>
            <p>To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. We will not be liable for any loss or damage of any nature resulted from travel decisions made using our platform.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
