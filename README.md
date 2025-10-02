# SmartEvent Organiser – Mobile (Expo + TypeScript)

Opinionated Expo Router mobile client for the SmartEvent platform.  
Provides event listing, creation/editing, and AI‑assisted description generation via the backend API.

---

## 1. Tech Stack

- Expo (React Native, iOS / Android / Web)
- expo-router (file‑based routing + typed routes)
- react-native-paper (UI components)
- @supabase/supabase-js (public anon client only)
- Axios (API calls to custom Express backend)
- OpenAI (indirectly via server only)

---

## 2. Features

- Event list with pull‑to‑refresh
- Create / update event (title, datetime, location, status, description)
- AI description generation (calls backend /api/ai endpoint)
- Basic status badges (draft / published / ongoing)
- Typed routes experiment enabled
- Ready for auth wiring (placeholder contexts)

---

## 3. Directory Structure (relevant)

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

---

## 5. Running the App

Install deps:
```bash
npm install
```

## Learn more

To learn more about developing your project with Expo, look at the following resources:
