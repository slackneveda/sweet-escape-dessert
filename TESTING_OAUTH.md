# Testing Google OAuth Without Real Credentials

Since you want to see the Google OAuth button in action, here's a temporary solution for testing:

## Option 1: Use Test Client ID (Demo Only)

For testing purposes only, you can temporarily use this demo client ID in `src/config/google-oauth.ts`:

```typescript
CLIENT_ID: "1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com",
```

**Important**: This won't actually work for authentication, but it will show you the Google OAuth button.

## Option 2: Set Up Real Google OAuth (Recommended)

Follow these steps to get it working properly:

### Quick Setup (5 minutes):

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a project** (if you don't have one)
3. **Enable Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized JavaScript origins: `http://localhost:5001`
5. **Copy the Client ID** and update `src/config/google-oauth.ts`

### What You'll Get:

- ✅ Real Google authentication
- ✅ User profile info (name, email, picture)
- ✅ Secure login flow
- ✅ Professional appearance

## Current Status

Right now you'll see a setup message instead of the Google button. Once you add a real Client ID, you'll get the beautiful Google OAuth experience!

The app is ready - just needs the Google credentials to activate the authentication. 🚀
