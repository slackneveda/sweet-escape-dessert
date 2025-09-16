// Google OAuth Configuration
// To enable Google OAuth login, you need to:
// 1. Go to Google Cloud Console (https://console.cloud.google.com/)
// 2. Create a new project or select an existing one
// 3. Enable the Google+ API
// 4. Create OAuth 2.0 credentials
// 5. Add your domain to authorized origins
// 6. Replace the CLIENT_ID below with your actual Google OAuth Client ID

export const GOOGLE_OAUTH_CONFIG = {
  // Replace this with your actual Google OAuth Client ID
  // Example: "123456789-abcdefghijklmnop.apps.googleusercontent.com"
  CLIENT_ID: "demo-client-id.apps.googleusercontent.com", // Temporary for testing
  
  // Optional: Configure additional OAuth settings
  SCOPES: ['openid', 'profile', 'email'],
  
  // For development, add your localhost URLs
  // For production, add your actual domain
  AUTHORIZED_ORIGINS: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5001',
    // Add your production domain here
    // 'https://yourdomain.com'
  ]
}

// Quick Setup Instructions:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project or select existing
// 3. Go to APIs & Services > Credentials
// 4. Click "Create Credentials" > "OAuth client ID"
// 5. Choose "Web application"
// 6. Add authorized JavaScript origins:
//    - http://localhost:5001 (for development)
//    - Your production domain (for deployment)
// 7. Copy the client ID and replace the CLIENT_ID above
// 8. Save this file and refresh your app
