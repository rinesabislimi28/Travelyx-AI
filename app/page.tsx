/**
 * Landing Page Component (app/page.tsx)
 * ---------------------------------------
 * Serves as the public-facing entry point of Travelyx-AI.
 * Features a modern, fully responsive UI utilizing Tailwind CSS gradients, 
 * glassmorphism effects, and highly optimized layouts for both desktop and mobile.
 */
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafcff] text-slate-800 selection:bg-indigo-500/30 font-sans overflow-x-hidden relative">
      
      {/* Dynamic Vibrant Mesh Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-80">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-400/30 blur-[120px] rounded-full animate-blob mix-blend-multiply"></div>
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-pink-400/30 blur-[120px] rounded-full animate-blob animation-delay-2000 mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-emerald-300/30 blur-[120px] rounded-full animate-blob animation-delay-4000 mix-blend-multiply"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 group cursor-pointer max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Travelyx-AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20 px-5 py-2 rounded-full transition-all">
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-bold mb-8 shadow-sm">
           ✨ Llama 3 Powered App
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 md:mb-8 leading-tight text-slate-900 px-2">
          Your Personal  <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
            AI Travel Agent
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-12 font-medium">
          Tell us your budget and travel style. In just 5 seconds, our AI will generate a complete Day 1 to Day 7 itinerary with activities, simulated costs, and local tips mapped out for you.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 relative z-20">
          <Link href="/login" className="px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 text-white rounded-full font-black text-lg shadow-[0_0_30px_-5px_rgba(168,85,247,0.5)] hover:shadow-[0_0_50px_-5px_rgba(168,85,247,0.9)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 group">
            Start Planning For Free
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Hero Visual Mockup */}
        <div className="mt-20 relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200 group">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10 h-full w-full pointer-events-none"></div>
          
          <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] relative">
            <Image 
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80" 
              alt="Travel Planning Mockup" 
              fill
              priority
              className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-1000"
            />
          </div>
          
          {/* Overlay UI Badge */}
          <div className="absolute bottom-8 left-8 right-8 z-20 flex justify-between items-end">
             <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl hidden sm:block">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                 </div>
                 <div>
                   <p className="text-white font-bold text-sm">Trip to Japan Generated</p>
                   <p className="text-slate-300 text-xs">7 Days • $2,500 Budget</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-slate-200/60">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-slate-900">How it Works</h2>
          <p className="text-slate-500 text-lg font-medium">Your personal AI travel agent gets it done in 3 simple steps.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>
          
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center relative z-10 group">
            <div className="w-24 h-24 rounded-full bg-white border-2 border-indigo-100 flex items-center justify-center text-3xl mb-6 shadow-xl shadow-indigo-500/10 text-indigo-600 font-black group-hover:scale-110 group-hover:border-indigo-400 transition-all duration-300">1</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Tell us your goal</h3>
            <p className="text-slate-500">Enter your budget, desired duration, and travel style (e.g., adventure, cultural).</p>
          </div>
          
          {/* Step 2 */}
          <div className="flex flex-col items-center text-center relative z-10 group">
            <div className="w-24 h-24 rounded-full bg-white border-2 border-purple-100 flex items-center justify-center text-3xl mb-6 shadow-xl shadow-purple-500/10 text-purple-600 font-black group-hover:scale-110 group-hover:border-purple-400 transition-all duration-300">2</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">AI creates the plan</h3>
            <p className="text-slate-500">Our Llama 3 AI builds a complete day-by-day intelligent itinerary in seconds.</p>
          </div>
          
          {/* Step 3 */}
          <div className="flex flex-col items-center text-center relative z-10 group">
            <div className="w-24 h-24 rounded-full bg-white border-2 border-pink-100 flex items-center justify-center text-3xl mb-6 shadow-xl shadow-pink-500/10 text-pink-500 font-black group-hover:scale-110 group-hover:border-pink-400 transition-all duration-300">3</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Review & Export</h3>
            <p className="text-slate-500">Check your daily activities, view simulated costs, and cleanly export to a PDF document!</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 bg-slate-100/50 border-t border-slate-200 py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-slate-900">Why use Travelyx-AI?</h2>
            <p className="text-slate-500 text-lg font-medium">Everything you need to orchestrate the perfect journey.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="group glass-panel hover-float rounded-[2rem] p-8 border-t-4 border-t-indigo-400 relative overflow-hidden">
              <div className="absolute top-[-50%] right-[-50%] w-[100%] h-[100%] bg-indigo-400/10 blur-[50px] rounded-full"></div>
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 shadow-sm transition-all border border-indigo-200">
                <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 relative z-10">Lightning Fast</h3>
              <p className="text-slate-500 leading-relaxed font-medium relative z-10">
                Generate full 7-day itineraries categorized by morning, afternoon, and evening in just seconds powered by Groq API.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group glass-panel hover-float rounded-[2rem] p-8 border-t-4 border-t-purple-400 relative overflow-hidden">
              <div className="absolute top-[-50%] right-[-50%] w-[100%] h-[100%] bg-purple-400/10 blur-[50px] rounded-full"></div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 shadow-sm transition-all border border-purple-200">
                <svg className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 relative z-10">Smart Budgeting</h3>
              <p className="text-slate-500 leading-relaxed font-medium relative z-10">
                Receive instant simulated estimations for flights, hotels, and daily activities to ensure your trip fits your wallet perfectly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group glass-panel hover-float rounded-[2rem] p-8 border-t-4 border-t-pink-400 relative overflow-hidden">
              <div className="absolute top-[-50%] right-[-50%] w-[100%] h-[100%] bg-pink-400/10 blur-[50px] rounded-full"></div>
              <div className="w-14 h-14 bg-gradient-to-br from-pink-100 to-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 shadow-sm transition-all border border-pink-200">
                <svg className="w-7 h-7 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 relative z-10">Export & Go</h3>
              <p className="text-slate-500 leading-relaxed font-medium relative z-10">
                Save your trips automatically to your account or beautifully export them as PDF documents to share with friends and family.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 border-t border-slate-200 bg-gradient-to-b from-indigo-50 to-purple-50 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 drop-shadow-sm">Ready to let AI guide your next adventure?</h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium">Join thousands of travelers who are saving hours of research by letting our intelligent algorithms do the heavy lifting.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-black transition-all hover:-translate-y-1 shadow-2xl shadow-slate-900/20 group">
            Create Your Free Account
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="relative z-10 bg-slate-50 border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/20">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </div>
                <span className="text-xl font-extrabold text-slate-800">Travelyx-AI</span>
              </div>
              <p className="text-slate-500 text-sm max-w-sm leading-relaxed font-medium">
                The next generation of travel planning. Built for modern explorers and forward-thinking travel agencies.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-slate-800 font-extrabold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-slate-500 font-semibold">
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">How it Works</Link></li>
                <li><Link href="/login" className="hover:text-indigo-600 transition-colors">Log In</Link></li>
              </ul>
            </div>
            
            {/* Legal Links */}
            <div>
              <h4 className="text-slate-800 font-extrabold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-500 font-semibold">
                <li><span className="hover:text-indigo-600 transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-indigo-600 transition-colors cursor-pointer">Terms of Service</span></li>
                <li><span className="hover:text-indigo-600 transition-colors cursor-pointer">Cookie Policy</span></li>
              </ul>
            </div>
            
          </div>
          
          <div className="border-t border-slate-200/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 font-medium text-sm">
              © {new Date().getFullYear()} Travelyx-AI. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              {/* Dummy Social Icons */}
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </div>
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:text-indigo-600 hover:border-indigo-200 transition-all cursor-pointer shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}