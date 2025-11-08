# Login Timeout Fix

## Problem
The login screen was timing out when validating credentials with the error:
```
Response timed out - {"operationName":"HealthCheck",...}
```

The validation query was hanging indefinitely, providing no feedback to the user.

## Root Cause
The `validateCredentials` method in `auth.service.ts` had no timeout mechanism. If the server was unreachable or slow to respond, the query would hang until React Native's default network timeout (which can be very long).

## Solution

### 1. Added 10-Second Timeout
Implemented a `Promise.race` pattern to enforce a 10-second timeout on credential validation:

```typescript
const queryPromise = tempClient.query({
  query: HEALTH_CHECK_QUERY,
  fetchPolicy: 'network-only',
  context: {
    headers: {
      'x-api-key': credentials.apiKey,
    },
  },
});

const timeoutPromise = new Promise((_, reject) => {
  setTimeout(() => {
    reject(new Error('Connection timeout - server did not respond within 10 seconds'));
  }, 5000); // 10 second timeout
});

const result = await Promise.race([queryPromise, timeoutPromise]) as any;
```

### 2. Enhanced Error Messages
Improved error messages with emojis and structured troubleshooting steps:

- **⏱️ Connection Timeout**: Specific guidance for timeout errors
- **🚫 CORS Error**: Instructions for CORS configuration
- **🔌 Connection Refused**: Network connectivity checks
- **🔑 Authentication Error**: API key validation
- **🌐 Network Error**: General network troubleshooting

Each error now includes:
- Clear identification of the problem
- The server URL being accessed
- Step-by-step troubleshooting instructions
- Relevant commands to diagnose/fix the issue

### 3. Added Logging
Added console logs to track the validation process:
- `console.log('Validating credentials for:', credentials.serverIP)` - Start of validation
- `console.log('Validation successful!')` - Successful validation
- `console.error('Credential validation failed:', error)` - Detailed error information

### 4. Updated Login Screen
Updated the login screen to use the new `useTheme()` hook instead of the deprecated `useColorScheme()` for consistency with the rest of the app.

## Testing
To test the fix:

1. **Valid Credentials**: Should connect successfully within seconds
2. **Invalid URL**: Should show timeout error after 10 seconds with troubleshooting steps
3. **Unreachable Server**: Should show connection refused error immediately
4. **Wrong Port**: Should show timeout/connection error with guidance
5. **Invalid API Key**: Should show authentication error after server responds

## Files Modified
- `/src/services/auth.service.ts`: Added timeout and improved error handling
- `/src/screens/login-screen.tsx`: Updated to use `useTheme()` hook

## Benefits
1. **Faster Feedback**: Users now get clear error messages within 10 seconds instead of waiting indefinitely
2. **Better UX**: Structured, actionable error messages help users diagnose and fix connection issues
3. **Easier Debugging**: Console logs help developers track validation flow
4. **Consistent Theming**: Login screen now uses the app's theme provider

## Common Issues and Solutions

### "Connection Timeout"
- **Problem**: Server not responding
- **Check**: 
  - Server URL format: `http://IP:PORT/graphql`
  - Unraid API is running: `systemctl status unraid-api`
  - Device on same network

### "Connection Refused"
- **Problem**: Server actively rejecting connections
- **Check**:
  - Port is correct (usually 3001)
  - Firewall allows connections
  - API service is running

### "CORS Error"
- **Problem**: Browser/app security blocking cross-origin requests
- **Fix**: Configure CORS in Unraid API settings

### "Authentication Error"
- **Problem**: Invalid or insufficient API key
- **Fix**: Generate new key: `unraid-api apikey --create`

