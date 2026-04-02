import Link from "next/link";

export default function CookiePolicy() {
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
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 drop-shadow-sm">Cookie Policy</h1>
          <p className="text-sm font-bold text-slate-400 mb-10 w-max uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">Last Updated: April 2026</p>
          
          <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed space-y-6">
            <p>This is the Cookie Policy for Travelyx-AI. It explains what cookies are, how we use them, and your choices regarding cookies.</p>
            
            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4 border-b pb-2">1. What Are Cookies</h2>
            <p>As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies.</p>
            
            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4 border-b pb-2">2. How We Use Cookies</h2>
            <p>We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. We heavily rely on secure cookies provided by Supabase strictly for user authentication sessions so you do not have to log in repeatedly.</p>
            
            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4 border-b pb-2">3. The Cookies We Set</h2>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Account related cookies:</strong> If you create an account with us then we will use cookies for the management of the signup process and general administration.</li>
              <li><strong>Login related cookies:</strong> We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4 border-b pb-2">4. Disabling Cookies</h2>
            <p>You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling login cookies will prevent your ability to access the Travelyx Dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
