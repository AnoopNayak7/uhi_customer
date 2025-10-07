# Google Authentication Setup Guide

This guide will help you set up Google OAuth authentication for your UrbanHouseIn application.

## Prerequisites

- Google Cloud Console account
- Next.js application with NextAuth.js installed
- Backend API that supports Google OAuth

## Step 1: Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)
5. Copy the Client ID and Client Secret

## Step 2: Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# Your existing API configuration
NEXT_PUBLIC_API_URL=your_api_url_here
```

**Important:** 
- Generate a secure `NEXTAUTH_SECRET` using: `openssl rand -base64 32`
- For production, update `NEXTAUTH_URL` to your actual domain

## Step 3: Backend API Integration

Your backend needs to support the following Google OAuth endpoints:

### Required Endpoints:

1. **Check Google User**
   ```
   GET /auth/google/check-user?email={email}
   ```

2. **Create Google User**
   ```
   POST /auth/google/create-user
   Body: {
     email: string,
     firstName: string,
     lastName: string,
     googleId: string,
     profilePicture?: string
   }
   ```

3. **Get Google User**
   ```
   GET /auth/google/user?email={email}
   ```

### Backend Implementation Example (Node.js/Express):

```javascript
// Check if Google user exists
app.get('/auth/google/check-user', async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email, authProvider: 'google' });
    res.json({ exists: !!user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new Google user
app.post('/auth/google/create-user', async (req, res) => {
  try {
    const { email, firstName, lastName, googleId, profilePicture } = req.body;
    
    const user = new User({
      email,
      firstName,
      lastName,
      googleId,
      profilePicture,
      authProvider: 'google',
      isVerified: true,
      role: 'user'
    });
    
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get Google user data
app.get('/auth/google/user', async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email, authProvider: 'google' });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          googleId: user.googleId,
          profilePicture: user.profilePicture,
          authProvider: user.authProvider
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

## Step 4: Database Schema Updates

Update your user model to support Google OAuth:

```javascript
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String },
  phone: { type: String }, // Optional for Google users
  role: { type: String, enum: ['user', 'builder', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  
  // Google OAuth fields
  googleId: { type: String, unique: true, sparse: true },
  profilePicture: { type: String },
  authProvider: { type: String, enum: ['email', 'google'], default: 'email' },
  
  // Other existing fields...
}, { timestamps: true });
```

## Step 5: Testing the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/auth/login` or `/auth/signup`

3. Click the "Continue with Google" button

4. Complete the Google OAuth flow

5. Verify that the user is created in your database and logged in

## Step 6: Production Deployment

1. Update your Google Cloud Console OAuth settings with production URLs
2. Set environment variables in your production environment
3. Ensure your backend API is deployed and accessible
4. Test the complete flow in production

## Features Implemented

✅ **Modern Google Login Button**: Clean, accessible design with loading states
✅ **NextAuth.js Integration**: Secure OAuth flow with proper session management
✅ **Dual Authentication**: Supports both email/OTP and Google OAuth
✅ **Type Safety**: Full TypeScript support with proper type definitions
✅ **Error Handling**: Comprehensive error handling and user feedback
✅ **Responsive Design**: Works seamlessly on mobile and desktop
✅ **Security**: Proper token management and session handling

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI"**
   - Ensure your redirect URI in Google Console matches exactly
   - Check for trailing slashes and protocol (http vs https)

2. **"Client ID not found"**
   - Verify your environment variables are set correctly
   - Restart your development server after changing env vars

3. **"User creation failed"**
   - Check your backend API endpoints
   - Verify database connection and user model

4. **"Session not syncing"**
   - Check NextAuth configuration
   - Verify the auth provider setup

### Debug Mode:

Enable NextAuth debug mode by adding to your `.env.local`:
```env
NEXTAUTH_DEBUG=true
```

This will provide detailed logs in your console for troubleshooting.

## Security Considerations

1. **Environment Variables**: Never commit sensitive keys to version control
2. **HTTPS**: Always use HTTPS in production
3. **Token Expiry**: Implement proper JWT token expiry
4. **Rate Limiting**: Add rate limiting to your auth endpoints
5. **Input Validation**: Validate all user inputs on the backend

## Support

If you encounter any issues, check:
1. Browser console for client-side errors
2. Server logs for backend errors
3. Google Cloud Console for OAuth configuration issues
4. Network tab for API call failures
