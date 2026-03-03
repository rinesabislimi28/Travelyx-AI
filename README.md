# 🌍 Travelyx-AI

Travelyx-AI is an AI-powered travel planning platform designed for travel agencies and modern travelers.

It uses Artificial Intelligence to generate personalized travel itineraries, suggest destinations, estimate budgets, and help agencies manage clients efficiently.

Built with **Next.js**, **Supabase**, **Vercel AI SDK**, and **OpenAI GPT-4**, this project focuses on delivering a functional and scalable MVP within 12–13 weeks.

---

## 🚀 Project Vision

Travelyx-AI aims to:

- Automate travel itinerary generation using AI
- Provide personalized destination recommendations
- Help agencies manage clients digitally
- Offer travelers an interactive AI assistant
- Simulate a smart travel booking ecosystem

This project is developed as a complete academic MVP with real AI integration and scalable architecture.

---

## 🛠 Tech Stack

- **Frontend:** Next.js (App Router)
- **Backend & Database:** Supabase
- **Authentication:** Supabase Auth (Email & OAuth)
- **AI Integration:** OpenAI GPT-4 via Vercel AI SDK
- **Hosting:** Vercel
- **PDF Generation:** Server-side export
- **Maps (Optional MVP):** Embedded map links

---

## 👤 User Roles

### 1️⃣ Travelers (End Users)

Travelers can:

- Register and log in
- Set travel preferences (budget, duration, travel style)
- Generate AI-powered destination suggestions
- Generate personalized day-by-day itineraries
- Modify itineraries manually
- Estimate trip budgets (simulated pricing system)
- Chat with AI travel assistant
- Save trips to their profile
- Export itineraries as PDF
- Leave trip feedback

---

### 2️⃣ Travel Agencies

Agencies can:

- Register as agency accounts
- Access a dedicated dashboard
- Manage client profiles
- Generate travel packages using AI
- Create custom itineraries
- View basic analytics (most selected destinations, budgets)
- Save and manage agency-created packages

---

## ✨ Core MVP Features (12–13 Week Realistic Scope)

### 🔹 AI Destination Recommendation

- Suggests destinations based on:
  - Budget
  - Trip duration
  - Travel style (Adventure, Relaxation, Culture, Nature, Party)
- Provides:
  - Key attractions
  - Suggested activities
  - Best time to visit
  - Short travel description

---

### 🔹 Smart Itinerary Generator

- Generates day-by-day itinerary (e.g., 3–7 days)
- Each day includes:
  - Morning activity
  - Afternoon activity
  - Evening suggestion
- Optimized using GPT-4 logic
- Editable by user
- Stored in database
- Exportable as PDF

---

### 🔹 Budget Estimator (Simulated)

⚠️ No real flight APIs required for MVP.

- Simulated flight price estimation
- Simulated hotel price ranges
- Estimated daily activity costs
- Automatic total trip cost calculation

This keeps the system realistic and achievable within timeline.

---

### 🔹 AI Travel Chat Assistant

- Real-time conversational AI
- Ask questions like:
  - “What are the best restaurants in Rome?”
  - “What can I do on a rainy day?”
- Can regenerate itinerary sections
- Context-aware using trip data

---

### 🔹 Agency Dashboard

- View registered clients
- Create AI travel packages
- Edit itineraries manually
- Save reusable package templates
- View basic analytics:
  - Most selected destinations
  - Average trip duration
  - Popular travel styles

---

### 🔹 Trip Management System

- Create multiple trips
- Save draft itineraries
- Edit or delete trips
- Trip history tracking

---

### 🔹 Feedback & Rating System

- Users can rate completed trips
- Store feedback in database
- Simple satisfaction score system

---

## 🧠 AI Capabilities (OpenAI GPT-4)

GPT-4 is used to:

- Generate structured itineraries
- Suggest destinations
- Provide contextual recommendations
- Power conversational travel assistant
- Analyze user preferences

Prompt engineering ensures consistent JSON responses for itinerary generation.

---

## 🗂 Database Structure (Supabase)

Main Tables:

- users
- agencies
- trips
- itineraries
- itinerary_days
- activities
- feedback
- saved_packages

Role-based access control is implemented.

---

## 🔐 Security & Architecture

- Secure authentication via Supabase
- Protected API routes
- Server-side AI calls
- Role-based user access
- Environment variable protection
- Clean scalable folder structure

---

## 📅 Development Timeline (12–13 Weeks)

### Week 1–2
- Requirements finalization
- UI/UX wireframes
- Database schema design

### Week 3–4
- Authentication setup
- Supabase integration
- Role-based system (Traveler / Agency)

### Week 5–6
- AI integration (GPT-4)
- Destination recommendation engine
- Structured itinerary generator

### Week 7–8
- Trip saving system
- Budget estimator logic
- PDF export feature

### Week 9–10
- AI Chat Assistant
- Agency dashboard
- Package management

### Week 11
- Feedback & rating system
- Basic analytics dashboard
- Performance optimization

### Week 12–13
- Testing & bug fixing
- UI improvements
- Deployment on Vercel
- Final documentation

---

## 💰 Monetization Strategy (Conceptual for MVP)

- Agency subscription model (simulated)
- Premium itinerary generation tier
- Commission-ready architecture (future integration)
- Scalable SaaS architecture for expansion

---

## 📈 Future Enhancements (Post-MVP)

- Real flight API integration (Amadeus, Skyscanner)
- Stripe payment integration
- Real booking confirmation system
- Multi-language AI support
- Mobile app version
- Smart price prediction AI
- Advanced analytics & reporting

---

## 🎯 Why Travelyx-AI?

✔ Real AI integration  
✔ Fully functional MVP  
✔ Scalable SaaS architecture  
✔ Real-world agency use case  
✔ Achievable in 12–13 weeks  
✔ Strong academic + startup potential  

---

## 🧑‍💻 Authors

Developed as an advanced project within the Advanced Programming course, 12–13 weeks using modern AI-driven architecture and full-stack development practices.

---

> Travelyx-AI — Smart Travel Planning Powered by Artificial Intelligence ✈️