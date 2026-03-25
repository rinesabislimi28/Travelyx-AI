# Reflection - Supabase Authentication

## What did you learn about authentication?
During the implementation of Supabase Auth, I learned the core concepts of user authentication and session management. I learned that modern authentication relies on tokens (like JWT) to securely verify identity. Supabase provides ready-to-use and highly functional methods for registering users via `supabase.auth.signUp()` and logging them in with `supabase.auth.signInWithPassword()`. These functions significantly simplify the process by securely managing password storage, data validation, and the creation of an active, secure user session behind the scenes.

## How does React manage user state?
To manage user state in React and make it accessible throughout the application (without prop-drilling), I used the **React Context API** alongside the `useState` Hook. 
Through `AuthContext`, we wrap our entire application. To keep this state synchronized, we use the `useEffect` Hook. Inside `useEffect`, the `supabase.auth.getSession()` method is first called to retrieve the current session from local storage (forming a *persistent session* that survives page reloads). 
Additionally, intertwined with this is the `supabase.auth.onAuthStateChange()` method, which acts as a listener to capture any authentication state changes in real-time (e.g., when the user logs in or out), automatically updating the global user state. This allows for the easy implementation of *Protected Routes*, which check the user's presence and redirect them to the `/login` page if they are not authenticated.

## What security risks must you take into consideration?
During this project, I learned that authentication comes with several fundamental security risks that must be avoided:
1. **Insecure Storage and API Key Exposure:** API keys (`anon/public keys`) must be managed carefully in `.env.local` or `.env` files, and secret keys (service role keys) should never be exposed on the Front-End or committed to GitHub. The environment variables file must absolutely be included in `.gitignore`.
2. **Access Control (Protected Routes vs Backend Security):** Protecting routes from unauthorized access solely on the React Front-End is not enough and does not provide primary security against hackers. Any critical server request or database access policies (*Supabase RLS - Row Level Security*) must strictly verify tokens and permissions (`supabase.auth.getUser()`). If only the Front-End is secured, data remains exposed if accessed directly (e.g., through tools like Postman).
3. **Validation and Encryption:** Data from user inputs (such as email or password) must always be validated beforehand (e.g., password must be at least 6 characters). Requests and authentications between the client and server should never occur over unencrypted networks, but continuously over the "HTTPS" protocol.
