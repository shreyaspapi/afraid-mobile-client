# API Key Header Fix

## Problem
The login request was sending the `x-api-key` header incorrectly. Instead of sending the API key value, it was sending the entire GraphQL query body:

### ❌ Wrong (Before):
```
x-api-key: {"operationName":"HealthCheck","variables":{},"extensions":{"clientLibrary":{"name":"@apollo/client","version":"4.0.9"}},"query":"query HealthCheck {\n info {\n os {\n platform\n __typename\n }\n __typename\n }\n}"}
```

### ✅ Correct (After):
```
x-api-key: 89a7ae67e300c9c05441cec0951930de654058ac61bde7f23a3625cec8568781
Content-Type: application/json
```

## Root Cause
The issue was caused by duplicate and conflicting header configurations in the Apollo Client setup:

1. **HttpLink** - Setting headers at the link level
2. **AuthLink middleware** - Setting headers through context
3. **Query context** - Setting headers again in the query call

This created a conflict where the headers were being overridden or mixed up.

## Solution

### 1. Simplified Header Configuration (`auth.service.ts`)

**Removed** the redundant `authLink` middleware and set headers directly in the `HttpLink`:

```typescript
const httpLink = new HttpLink({
  uri,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
  },
});

// Simplified client creation
return new ApolloClient({
  link: from([errorLink, httpLink]),  // No authLink
  cache: new InMemoryCache(),
  // ...
});
```

### 2. Removed Duplicate Header in Query Context

**Before**:
```typescript
const result = await tempClient.query({
  query: HEALTH_CHECK_QUERY,
  fetchPolicy: 'network-only',
  context: {
    headers: {
      'x-api-key': credentials.apiKey,  // ❌ Duplicate
    },
  },
});
```

**After**:
```typescript
const result = await tempClient.query({
  query: HEALTH_CHECK_QUERY,
  fetchPolicy: 'network-only',
  // ✅ No context needed - headers set in HttpLink
});
```

### 3. Added Debug Logging

Added console logs to track header configuration:

```typescript
console.log('Creating temp client with:');
console.log('  URI:', uri);
console.log('  API Key:', apiKey.substring(0, 10) + '...');
```

## Files Modified

1. **`src/services/auth.service.ts`**
   - Simplified `createTempApolloClient` function
   - Removed `authLink` middleware
   - Set headers directly in `HttpLink`
   - Removed duplicate header in query context
   - Added debug logging

2. **`src/screens/connection-test-screen.tsx`**
   - Added debug logging for test requests

## Testing

To verify the fix:

1. **Check Browser DevTools**:
   - Open Network tab
   - Filter by "graphql"
   - Look at Request Headers
   - `x-api-key` should show the actual API key, not the query body

2. **Check Console Logs**:
```
Creating temp client with:
  URI: http://192.168.21.1:3001/graphql
  API Key: 89a7ae67e3...
Validating credentials for: http://192.168.21.1:3001/graphql
```

3. **Expected Network Request**:
```
POST http://192.168.21.1:3001/graphql
Headers:
  Content-Type: application/json
  x-api-key: 89a7ae67e300c9c05441cec0951930de654058ac61bde7f23a3625cec8568781
  
Body:
  {"operationName":"HealthCheck","query":"...","variables":{}}
```

## Why This Happened

Apollo Client allows headers to be set at multiple levels:
- **Link level**: Static headers for all requests
- **Context level**: Dynamic headers per request
- **Middleware level**: Headers set through custom logic

When these are used together incorrectly, they can conflict or override each other in unexpected ways. The safest approach for static headers (like API keys) is to set them directly in the `HttpLink`.

## Best Practice

For authentication headers that don't change per request:
- ✅ **DO**: Set in `HttpLink` headers
- ❌ **DON'T**: Use multiple middleware layers
- ❌ **DON'T**: Override in query context unless necessary

For dynamic headers (like user session tokens):
- ✅ **DO**: Use `authLink` middleware to fetch from storage
- ✅ **DO**: Keep it simple with a single middleware

## Remaining Issues to Check

Even with the header fix, you might still see connection issues:

1. **Port Number**: Ensure URL includes `:3001`
   ```
   ✅ http://192.168.21.1:3001/graphql
   ❌ http://192.168.21.1/graphql
   ```

2. **Network**: Device must be on same network (192.168.21.x)

3. **API Service**: Ensure Unraid API is running
   ```bash
   systemctl status unraid-api
   ```

Use the connection test screen to verify which URL works!

## Next Steps

1. Clear app cache/data
2. Run the connection test screen
3. Try logging in with the correct URL format
4. Check console logs for debug information
5. Verify headers in browser DevTools (if web) or React Native Debugger

---

**Note**: The main Apollo Client (`src/lib/apollo-client.ts`) still uses the `authLink` middleware because it needs to dynamically fetch the API key from storage. This is the correct approach for the main client.

