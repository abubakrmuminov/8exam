# Kitchen - Recipe Sharing Platform

A modern, minimal web app for sharing and discovering cooking recipes. Built with React, TypeScript, TailwindCSS, shadcn/ui, and Firebase.

## Features

- **Authentication**: Sign up/login with email/password or Google OAuth
- **Recipe Management**: Create, view, and delete recipes
- **Real-time Updates**: Recipes sync in real-time across devices
- **Responsive Design**: Beautiful, handcrafted design that works on all devices
- **Dynamic Inputs**: Add multiple ingredients and photos to recipes
- **Customization**: Change background colors for personalization

## Tech Stack

- React 18
- TypeScript
- TailwindCSS
- shadcn/ui components
- Firebase (Authentication + Firestore)
- Redux Toolkit for state management
- React Toastify for notifications
- Vite for fast development

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Google providers)
3. Create a Firestore database
4. Copy your Firebase config and add it to `.env`:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Firestore Security Rules

Add these security rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /recipes/{recipeId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── app/
│   ├── Auth/
│   │   └── AuthSlice.ts       # Redux auth slice
│   └── store.ts               # Redux store
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── AuthForm.tsx           # Authentication form
│   ├── Dashboard.tsx          # User dashboard
│   ├── RecipeCard.tsx         # Recipe card component
│   ├── RecipeForm.tsx         # Create recipe form
│   ├── RecipeModal.tsx        # Recipe details modal
│   └── RecipesList.tsx        # Recipes list with real-time sync
├── firebase/
│   └── config.ts              # Firebase configuration
├── hooks/
│   ├── useGoogle.js           # Google OAuth hook
│   ├── useLogin.js            # Login hook
│   ├── useRegister.js         # Registration hook
│   └── useResetPassword.js    # Password reset hook
├── types/
│   └── index.ts               # TypeScript types
├── App.tsx                    # Main app component
└── main.tsx                   # App entry point
```

## Features Breakdown

### Authentication
- Email/password sign up and login
- Google OAuth integration
- Password reset functionality
- Persistent authentication state

### Recipe Management
- Create recipes with:
  - Name and cooking time
  - Multiple ingredients (dynamic list)
  - Multiple photo URLs (dynamic list)
  - Detailed cooking method
- View recipe details in a modal
- Delete recipes
- Real-time synchronization

### UI/UX
- Clean, minimal design with warm color palette
- Smooth animations and transitions
- Rounded corners and soft shadows
- Hover effects and visual feedback
- Skeleton loaders for better UX
- Toast notifications for user actions
- Responsive grid layout
- Background color customization

## Design Philosophy

Kitchen follows a "handcrafted" design approach with:
- Warm, inviting colors (orange, amber, beige)
- Generous white space
- Rounded corners (rounded-2xl)
- Soft shadows for depth
- Smooth transitions (transition-all)
- High-quality stock photos from Pexels
- Intuitive, user-friendly interface

## License

MIT
