# Connection Test Guide

## Problem
Your login is timing out when trying to connect to:
- Server: `http://192.168.21.1/graphql`
- API Key: `89a7ae67e300c9c05441cec0951930de654058ac61bde7f23a3625cec8568781`

## Two Ways to Test

### Option 1: Node.js Test Script (For Desktop/Laptop)

Run from your computer (must be on same network as Unraid):

```bash
node test-connection.js
```

**Note**: This test may fail if your computer is not on the same network (192.168.21.x) as your Unraid server. Use Option 2 for mobile device testing.

### Option 2: React Native Test Screen (Recommended)

Use this to test directly from your mobile device, which will be on the same network.

#### Step 1: Export the test screen

Add this to your `app/index.tsx` or create a new route:

```typescript
import { ConnectionTestScreen } from '@/src/screens/connection-test-screen';

// Add to your navigation or render directly for testing
export default function TestRoute() {
  return <ConnectionTestScreen />;
}
```

Or temporarily modify your login screen to show the test:

```typescript
// In src/screens/login-screen.tsx, add at the top:
import { ConnectionTestScreen } from '@/src/screens/connection-test-screen';

// Replace the LoginScreen component temporarily with:
export function LoginScreen({ onSuccess }: LoginScreenProps) {
  return <ConnectionTestScreen />;
}
```

#### Step 2: Run your app
```bash
npx expo start
```

#### Step 3: Press "Run Connection Test"
The screen will test both URLs:
- `http://192.168.21.1:3001/graphql` (with port)
- `http://192.168.21.1/graphql` (without port)

#### Step 4: Check results
- ✅ **Success**: Use the URL shown in the green success box
- ❌ **Failed**: See troubleshooting below

## Common Issues & Solutions

### 1. Port Missing
**Problem**: URL might need port 3001

**Fix**: The test automatically tries both:
- `http://192.168.21.1:3001/graphql` ✅ (most common)
- `http://192.168.21.1/graphql`

If the first one works, use: `http://192.168.21.1:3001/graphql`

### 2. Unraid API Not Running
**Problem**: The API service might not be started

**Fix**:
```bash
# SSH into your Unraid server
ssh root@192.168.21.1

# Check API status
systemctl status unraid-api

# If not running, start it
systemctl start unraid-api

# Enable on boot
systemctl enable unraid-api
```

### 3. Network Connection
**Problem**: Device not on same network

**Fix**:
- Ensure mobile device WiFi is connected to same network
- Check device IP is in 192.168.21.x range
- Try disabling mobile data, use WiFi only

### 4. Firewall Blocking
**Problem**: Firewall blocking port 3001

**Fix** (on Unraid server):
```bash
# Check if port 3001 is listening
netstat -tlnp | grep 3001

# Check firewall rules
iptables -L -n

# Temporarily disable firewall (testing only!)
systemctl stop firewalld
```

### 5. Wrong API Key
**Problem**: API key expired or invalid

**Fix**:
```bash
# SSH into Unraid
ssh root@192.168.21.1

# Create new API key
unraid-api apikey --create

# Copy the new key to your app
```

## Verify Server Manually

### From Command Line (on your computer):
```bash
# Test if server is reachable
ping 192.168.21.1

# Test if port 3001 is open
curl http://192.168.21.1:3001/graphql

# Test GraphQL query
curl -X POST http://192.168.21.1:3001/graphql \
  -H "Content-Type: application/json" \
  -H "x-api-key: 89a7ae67e300c9c05441cec0951930de654058ac61bde7f23a3625cec8568781" \
  -d '{"query":"{ info { os { platform }}}"}'
```

### From Web Browser:
1. Open: `http://192.168.21.1:3001`
2. Should see Unraid API info or GraphQL Playground
3. If you see connection refused/timeout, API is not running

## Expected Success

When connection works, you should see:

```json
{
  "data": {
    "info": {
      "os": {
        "platform": "linux",
        "__typename": "OSInfo"
      },
      "__typename": "Info"
    }
  }
}
```

## Next Steps After Successful Test

1. **Copy the working URL** from the green success box
2. **Update your credentials** in the login screen
3. **Test login** in the actual app

## Still Having Issues?

Check:
1. ✅ Unraid server is powered on
2. ✅ Unraid API service is running
3. ✅ Mobile device on same network (192.168.21.x)
4. ✅ Port 3001 is correct (check Unraid API config)
5. ✅ API key is valid and not expired
6. ✅ Firewall allows connections to port 3001
7. ✅ Server URL format: `http://IP:PORT/graphql`

## Clean Up After Testing

Once you find the working URL:

1. Remove the test screen import from your login screen
2. Keep `test-connection.js` and `connection-test-screen.tsx` for future troubleshooting
3. Update your login with the correct URL format

---

**Pro Tip**: The most common issue is missing the `:3001` port in the URL. Always use:
```
http://192.168.21.1:3001/graphql
```

