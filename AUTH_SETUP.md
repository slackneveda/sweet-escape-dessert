# Sweet Escape Dessert Website - Authentication Setup

## Google OAuth Setup

This application includes Google OAuth authentication. To enable it:

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `http://localhost:5173` (for Vite dev server)
     - Your production domain (when deployed)

### 2. Update Configuration

1. Copy your OAuth Client ID from Google Cloud Console
2. Open `src/config/google-oauth.ts`
3. Replace `"your-google-client-id.apps.googleusercontent.com"` with your actual Client ID

### 3. Demo Credentials

For testing without Google OAuth, you can use these demo credentials:

- **Admin**: admin@sweetdelights.com / admin123
- **User**: any@email.com / password123

## Features

### Current Authentication System

- ✅ Google OAuth login
- ✅ Traditional email/password login
- ✅ User dashboard with personalized content
- ✅ Persistent login sessions
- ✅ Dashboard-only access (no separate profile/admin pages)

### User Flow

1. **Login Page** (`/login`): Users can sign in with Google or email/password
2. **Dashboard** (`/dashboard`): Personalized user dashboard accessible only after login
3. **Navbar**: Shows "Sign In" button when logged out, user name when logged in
4. **Protected Routes**: Dashboard requires authentication, redirects to login if not authenticated

### Navigation

- **Public Pages**: Home, Menu, Featured, Orders, Contact
- **Authenticated Pages**: Dashboard (shows after login)
- **Removed Pages**: Profile, Admin (as requested)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will run on `http://localhost:5173`

## Notes

- Google OAuth requires HTTPS in production
- Make sure to add your production domain to Google Cloud Console authorized origins
- User data is stored in localStorage for persistence
- Admin functionality has been removed as requested
