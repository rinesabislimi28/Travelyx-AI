# Demo Plan: Travelyx-AI ✈️

**Duration:** 5–7 minutes  
**Presenter:** Rinesa Bislimi

---

## 1. What is the project and who is it for? (1 min)
- **What it is:** Travelyx-AI is an advanced, AI-powered travel planning platform.
- **Target Audience:** Modern travelers looking for rapid, personalized itineraries based on their specific budget, party size (e.g., Solo, Couple, Family), and travel style. It also serves small travel agencies looking to automate trip generation.
- **Value Proposition:** It saves hours of manual research. Instead of browsing multiple blogs, the AI returns a structured day-by-day itinerary (Morning/Afternoon/Evening) and automatically calculates the total budget estimate for the entire group.

## 2. Main Flow to Demonstrate (Live Demo) (3 min)
This is the core flow I will present during the live demo:
1. **Authentication:** I will log into the system to demonstrate the secure authentication layer via Supabase.
2. **Trip Generation (Core Feature):** 
   - I will open the AI form and input realistic data: Departure from Prishtina, Destination Paris, 3 days, Budget 1500 EUR.
   - I will highlight the new dynamic inputs: "Romantic" travel style, "2 people (Couple)", and the "Summer" season.
   - I will click "Generate" to demonstrate the live integration with the Groq API (Llama-3 model).
3. **Result Analysis:** 
   - I will showcase the generated Route Map and the Financial Analysis block, explaining how it accurately calculates the total group costs and daily food expenses.
   - I will scroll down to present the structured Morning, Afternoon, and Evening activities.
4. **Dashboard & Database Persistence:** 
   - I will navigate to the "Dashboard" to prove that the newly generated trip was automatically saved to the Supabase database. I will open the saved trip to show that all metadata (badges for Season, Party Size, and Style) persists perfectly.

## 3. Technical Aspects to Explain Briefly (1.5 min)
I will briefly highlight these three engineering decisions to demonstrate technical depth:
- **JSONB Architecture:** I will explain how the entire itinerary and dynamic variables (style, party size, season) are injected and stored in a single `JSONB` column in PostgreSQL (Supabase). This ensures high performance and schema flexibility.
- **Intelligent Geographic Validation:** I implemented an AI-driven strict validation system. If a user enters a fake or gibberish location (e.g., "ahahah"), the AI intercepts it and returns a strict JSON error object, safely blocking the UI generation without crashing the app.
- **Prompt Engineering for Budgeting:** To prevent LLM hallucination with math, I implemented a hidden System Prompt that strictly enforces the AI to calculate the total combined cost for all travelers (not per person), ensuring the final financial UI is perfectly accurate.

## 4. Pre-Demo Checklist (0.5 min)
- **Live URL:** Verified the Vercel production link is fully accessible and loads quickly.
- **Test Account:** Created a dedicated test account (`rinesabislimi28@gmail.com`) to bypass registration time during the demo.
- **Validation Testing:** Attempted to input fake destinations to ensure the AI validation successfully catches and blocks them.
- **UI/UX:** Verified that Dark Mode, responsive layouts, and itinerary animations render perfectly without breaking.

## 5. Plan B (Fallback Strategy)
In case of a university network failure or if the Groq API experiences downtime during the 5-minute presentation window:
- **Fallback 1 (Saved Trips):** I will navigate directly to my Dashboard to showcase pre-generated trips. Since these are fetched directly from the Supabase database, they do not require a live connection to the AI engine.
- **Fallback 2 (Local Media):** I have a folder on my laptop containing high-quality screenshots of the full generation process and loading states, ready to present offline.
- **Code Walkthrough:** I will open VS Code to briefly walk through the Next.js `app/api/chat/route.js` architecture and the System Prompt logic. This demonstrates my engineering knowledge regardless of internet connectivity.
