# Demo Plan: Travelyx-AI ✈️

**Duration:** 5–7 minutes  
**Presenter:** Rinesa Bislimi  
**Live URL:** https://travelyx-ai.vercel.app  
**Link GitHub:** https://github.com/rinesabislimi28/Travelyx-AI  

---

## 1. What is the project and who is it for? (1 min)
- **What it is:** Travelyx-AI is an advanced, AI-powered travel planning platform integrated with real-time flight data.
- **Target Audience:** Modern travelers looking for rapid, personalized itineraries based on specific budgets, party sizes, and dates. It also serves small travel agencies looking to automate trip generation with live ticket estimations.
- **Value Proposition:** It saves hours of manual research by combining a structured day-by-day AI itinerary with live Skyscanner flight searches and an automated group budget calculator, all in one premium dashboard.

## 2. Main Flow to Demonstrate (Live Demo) (3 min)
This is the core flow I will present:
1. **Authentication:** I will log in to demonstrate the secure authentication layer via Supabase.
2. **Trip Generation (Core Feature):** 
   - I will input realistic data: Departure from Prishtina, Destination Paris (or Tokyo), 3 days, Budget 1500 EUR.
   - I will click "Search" to trigger two simultaneous processes: the Groq API (Llama-3) for the itinerary, and the RapidAPI (Skyscanner) for live flight tickets.
3. **Result Analysis:** 
   - I will showcase the **Flight Results** block first, showing real airline prices and durations.
   - I will explain the Financial Analysis block, which combines the live flight cost with the AI's hotel/food estimations for the *entire* group.
   - I will show the structured interactive days (Morning/Afternoon/Evening) and the direct link to Apple Maps routing.
4. **Dashboard & Database Persistence:** 
   - I will navigate to the Dashboard to prove the trip is auto-saved in PostgreSQL (Supabase) in a JSONB format, and demonstrate the "Favorite" (Star) feature which syncs directly with the database.

## 3. Technical Aspects to Explain Briefly (1.5 min)
I will highlight three key engineering decisions:
- **Dual API Integration & Smart Fallback:** The app simultaneously queries the Groq LLM and the Skyscanner API. To prevent demo failures due to API rate limits, I engineered a context-aware fallback mechanism: if the flight API quota is exceeded, the system reads the user's destination and injects realistic mock data (e.g., Emirates/Qatar for Asia vs WizzAir/easyJet for Europe).
- **JSONB Architecture:** The entire complex itinerary and flight metadata is structured and injected into a single `JSONB` column in PostgreSQL. This allows for high-speed retrieval in the Dashboard without complex relational joins.
- **Strict Prompt Engineering:** To prevent LLM hallucination, I implemented a hidden System Prompt that forces the AI to output pure JSON and strictly calculates the total combined cost for *all* travelers (not per person).

## 4. Pre-Demo Checklist (0.5 min)
- **Live URL:** Verified the Vercel production link is fully accessible, uses HTTPS, and routing works perfectly on mobile/desktop.
- **Test Account:** Created a dedicated test account (`rinesabislimi28@gmail.com`) to bypass registration time during the demo.
- **Validation Testing:** Verified the flight fallback triggers flawlessly without breaking the UI if API keys fail.
- **UI/UX:** Confirmed Dark Mode, animations, and the newly added Apple Maps integration are functional.

## 5. Plan B (Fallback Strategy)
In case of a university network failure or complete API downtime:
- **Fallback 1 (Saved Trips):** I will navigate to my Dashboard to showcase pre-generated trips fetched directly from Supabase (which doesn't rely on the AI engine).
- **Fallback 2 (Local Media):** I have a folder containing high-quality screenshots of the full generation process ready to present offline.
- **Code Walkthrough:** I will open VS Code to explain the Next.js API routes (`app/api/chat` and `app/api/flights`) and my error-handling/fallback strategies.
