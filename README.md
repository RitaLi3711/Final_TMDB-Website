[link to website](curious-tiramisu-a01711.netlify.app)

curious-tiramisu-a01711.netlify.app

## 🎯 Purpose

- Manage global state using React Context
- Build and organize feature-based views
- Implement cart and favorites functionality
- Work with date-based calculations for dynamic pricing
- Persist user data in local storage across browser sessions
- Structure a scalable front-end application using components, hooks and utilities

## ☑️ Task

1. Create a `.env` file in the root folder of this project and add your TMDB API key to the `VITE_TMDB_API_KEY` environment variable
2. Paste your firebaseConfig data from Firebase Console into the firebase `index.js` file
3. Migrate Assignment 5 code to this starter project
4. Create a SignInView that allows users to register or login by email and/or Google OAuth
5. **Only** The following information should be saved on local storage:
   - Favorites
   - Cart
6. The following information **must** be saved on Firestore:
   - Genre Preferences
   - Purchases
7. Users should be able to view the following options in SettingsView:
   - Display name (updates user's Google Auth profile)
   - Avatar (updates user's Google Auth profile)
   - Password (only available for users logged in via email)
   - Genre preferences (saves to Firestore when the Save button is pressed)
   - Purchases (shows past purchases)
8. When the user presses the Purchase button in CartView:
   - They should see the `Dialog` component to confirm or reject their purchase
   - If the purchase is confirmed, they should be redirected to SuccessView
9. Implement a route guard so that only authorized users can access private routes
10. Ensure that the website does not lose any data when the browser is refreshed
