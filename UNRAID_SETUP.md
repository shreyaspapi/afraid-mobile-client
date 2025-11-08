# Unraid Mobile App - Setup Guide

This is a production-ready Expo mobile application for monitoring and managing your Unraid server. Built with TypeScript, Apollo Client, and React Native.

## 🏗️ Architecture Overview

The app follows a modular, service-oriented architecture with clear separation of concerns:

```
src/
├── components/       # Reusable UI components
│   └── ui/          # Base UI components (Card, ProgressBar, etc.)
├── config/          # App configuration
├── graphql/         # GraphQL queries and mutations
├── hooks/           # Custom React hooks for data fetching
├── lib/             # Third-party library configurations
├── providers/       # Context providers (Apollo, Auth)
├── screens/         # Screen components
├── services/        # Business logic services
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## 📋 Prerequisites

1. **Unraid Server** with API enabled
2. **Network Access** - Your mobile device must be on the same network as your Unraid server
3. **Node.js** 18+ and pnpm installed
4. **Expo CLI** installed globally

## 🚀 Getting Started

### 1. Install Dependencies

Already done! But if you need to reinstall:

```bash
pnpm install
```

### 2. Configure Your Unraid Server

On your Unraid server, generate an API key:

```bash
unraid-api apikey --create
```

Follow the prompts to create a key for your mobile app. Save this key securely!

### 3. Update GraphQL Code Generator (Optional)

Edit `codegen.ts` and replace `YOUR_UNRAID_IP` with your actual server IP:

```typescript
schema: 'http://192.168.1.100:3001/graphql',
```

Then generate TypeScript types:

```bash
pnpm run codegen
```

### 4. Start the Development Server

```bash
pnpm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan the QR code with Expo Go app for physical device

### 5. Login to Your Server

When the app launches:

1. Enter your server IP address (e.g., `192.168.1.100:3001`)
2. Enter the API key you generated
3. Tap "Connect"

The app will validate your credentials and connect to your Unraid server.

## 🏛️ Key Services & Components

### Services Layer

**Storage Service** (`src/services/storage.service.ts`)
- Handles secure credential storage using AsyncStorage
- Manages API keys and server configuration
- Provides abstraction for all storage operations

**Auth Service** (`src/services/auth.service.ts`)
- Manages authentication flow
- Validates credentials against the server
- Handles login/logout operations

### GraphQL Integration

**Apollo Client** (`src/lib/apollo-client.ts`)
- Configured with authentication middleware
- Automatic API key injection in headers
- Error handling and retry logic
- Cache management

**Custom Hooks** (`src/hooks/useUnraidQuery.ts`)
- Type-safe data fetching hooks
- Automatic polling for real-time updates
- Built-in error handling

### UI Components

All UI components support light/dark themes automatically:

- `Card` - Container for grouped information
- `StatItem` - Label-value pairs for statistics
- `ProgressBar` - Visual progress with percentage
- `LoadingScreen` - Full-screen loading state
- `ErrorMessage` - Error display with retry option

## 📱 Features

### Dashboard Screen

Real-time monitoring of:
- **System Information** - Platform, uptime, CPU specs
- **CPU Usage** - Current load with user/system breakdown
- **Memory Usage** - Used/free/total with visual progress
- **Array Status** - Storage capacity and disk health
- **Disk Information** - Individual disk status and temperatures

### Automatic Updates

The dashboard polls for updates every 5 seconds by default. This can be customized in `src/config/app.config.ts`:

```typescript
graphql: {
  defaultPollInterval: 5000, // milliseconds
}
```

### Pull to Refresh

Swipe down on the dashboard to manually refresh data.

## 🔧 Configuration

### App Configuration

Edit `src/config/app.config.ts` to customize:

```typescript
export const AppConfig = {
  api: {
    defaultTimeout: 10000,
    retryAttempts: 3,
  },
  graphql: {
    defaultPollInterval: 5000,
  },
  // ... more options
};
```

### TypeScript Code Generation

The app includes GraphQL Code Generator for automatic type generation:

1. Update `codegen.ts` with your server URL
2. Run `pnpm run codegen`
3. Types will be generated in `src/gql/`

This provides full TypeScript autocomplete for all GraphQL queries!

## 🎨 Customization

### Adding New Queries

1. Define the query in `src/graphql/queries.ts`:

```typescript
export const GET_NEW_DATA = gql`
  query GetNewData {
    # your query
  }
`;
```

2. Create a hook in `src/hooks/useUnraidQuery.ts`:

```typescript
export function useNewData() {
  return useQuery(GET_NEW_DATA, {
    pollInterval: AppConfig.graphql.defaultPollInterval,
  });
}
```

3. Use it in your component:

```typescript
const { data, loading, error } = useNewData();
```

### Adding New Screens

1. Create screen in `src/screens/`
2. Add route in `app/(tabs)/`
3. Update navigation as needed

## 🧪 Testing Connection

To test your connection:

1. Ensure your Unraid server is running
2. Check that the GraphQL endpoint is accessible:
   ```bash
   curl http://YOUR_SERVER_IP:3001/graphql
   ```
3. Enable GraphQL Playground on Unraid to test queries
4. Use the same queries in your app

## 📚 API Reference

### Main GraphQL Queries

**System Info**
```graphql
query GetSystemInfo {
  info {
    os { platform, uptime }
    cpu { brand, cores, usage { currentLoad } }
    mem { total, used, free }
  }
}
```

**Array Status**
```graphql
query GetArrayStatus {
  array {
    state
    capacity { disks { total, used, free } }
    disks { name, size, status, temp }
  }
}
```

**Docker Containers**
```graphql
query GetDockerContainers {
  dockerContainers {
    id, names, state, status
  }
}
```

## 🔒 Security

- API keys are stored securely using AsyncStorage
- Credentials are never logged or exposed
- All API calls use encrypted connections (when HTTPS is configured)
- Authentication is required before accessing any data

## 🐛 Troubleshooting

### Cannot Connect to Server

1. Verify server IP and port
2. Check network connectivity
3. Ensure Unraid API is running
4. Verify API key is correct

### No Data Showing

1. Check GraphQL queries match your Unraid API version
2. Verify API key has correct permissions
3. Check console for error messages

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules
pnpm install
```

## 📖 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [React Native Documentation](https://reactnative.dev/)
- [Unraid API Documentation](https://docs.unraid.net/api/)

## 🚢 Building for Production

### iOS

```bash
eas build --platform ios
```

### Android

```bash
eas build --platform android
```

Make sure to configure `eas.json` first. See [Expo EAS documentation](https://docs.expo.dev/build/introduction/).

## 🤝 Contributing

This is a professional-grade codebase following best practices:

- **Type Safety** - Full TypeScript coverage
- **Modular Design** - Clear separation of concerns
- **Service Layer** - Business logic separated from UI
- **Error Handling** - Comprehensive error management
- **Code Documentation** - Every file has clear documentation

Feel free to extend and customize based on your needs!

## 📝 License

MIT

---

**Built with ❤️ for Unraid users**

