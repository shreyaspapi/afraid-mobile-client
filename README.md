# AnRaid - Unraid Mobile Management App

A professional-grade React Native mobile application for monitoring and managing your Unraid server, built with Expo, TypeScript, Apollo Client, and GraphQL.

## ✨ Features

- **Real-time Dashboard** - Monitor system stats, CPU usage, memory, and storage
- **Secure Authentication** - API key-based authentication with AsyncStorage
- **GraphQL Integration** - Efficient data fetching with Apollo Client
- **Auto-refresh** - Real-time updates every 5 seconds with pull-to-refresh
- **Dark Mode** - Beautiful light and dark themes
- **Type-Safe** - Full TypeScript coverage with GraphQL code generation
- **Production Ready** - Follows senior-level engineering best practices

## 🏗️ Architecture

```
src/
├── components/       # Reusable UI components
│   └── ui/          # Base UI components
├── config/          # App configuration
├── graphql/         # GraphQL queries
├── hooks/           # Custom React hooks
├── lib/             # Third-party configs (Apollo)
├── providers/       # Context providers
├── screens/         # Screen components
├── services/        # Business logic layer
├── types/           # TypeScript definitions
└── utils/           # Helper functions
```

**Key Architectural Principles:**
- Service Layer Pattern for business logic
- Provider Pattern for state management
- Custom Hooks for data fetching
- Separation of Concerns
- Type Safety throughout

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Expo CLI
- Unraid server with API enabled

### Installation

1. **Install dependencies:**

```bash
pnpm install
```

2. **Start the development server:**

```bash
pnpm start
```

3. **Run on your device:**
   - iOS: Press `i` or scan QR code with Camera app
   - Android: Press `a` or scan QR code with Expo Go app

### Unraid Server Setup

On your Unraid server, generate an API key:

```bash
unraid-api apikey --create
```

Save this key - you'll need it to login to the app!

## 📱 Using the App

1. **Login:**
   - Enter your Unraid server IP (e.g., `192.168.1.100:3001`)
   - Enter your API key
   - Tap "Connect"

2. **Dashboard:**
   - View real-time system information
   - Monitor CPU, memory, and storage usage
   - Check disk health and temperatures
   - Pull down to refresh manually

3. **Settings:**
   - View server information
   - Logout from the app

## 🔧 Configuration

### Customizing Polling Interval

Edit `src/config/app.config.ts`:

```typescript
graphql: {
  defaultPollInterval: 5000, // milliseconds
}
```

### GraphQL Code Generation

1. Update `codegen.ts` with your server IP
2. Run: `pnpm run codegen`
3. Get full TypeScript autocomplete!

## 📚 Key Services

### Storage Service (`src/services/storage.service.ts`)
- Secure credential management
- AsyncStorage abstraction
- Multi-key operations

### Auth Service (`src/services/auth.service.ts`)
- Authentication flow
- Credential validation
- Login/logout management

### Apollo Client (`src/lib/apollo-client.ts`)
- GraphQL client configuration
- Authentication middleware
- Error handling
- Cache management

## 🎨 UI Components

All components support light/dark themes:

- **Card** - Container for grouped content
- **StatItem** - Label-value statistics display
- **ProgressBar** - Visual progress indicator
- **LoadingScreen** - Loading state
- **ErrorMessage** - Error display with retry

## 🛠️ Development Scripts

```bash
pnpm start          # Start Expo dev server
pnpm android        # Run on Android
pnpm ios            # Run on iOS
pnpm web            # Run on web
pnpm lint           # Run linter
pnpm codegen        # Generate GraphQL types
```

## 📖 Documentation

See [UNRAID_SETUP.md](./UNRAID_SETUP.md) for detailed setup instructions, API reference, troubleshooting, and advanced configuration.

## 🏛️ Project Structure Details

### Services Layer
Business logic separated from UI:
- **StorageService**: Credential management
- **AuthService**: Authentication logic

### Providers
Application-wide state management:
- **ApolloProvider**: GraphQL client
- **AuthProvider**: Authentication state

### Custom Hooks
Reusable data fetching:
- `useSystemInfo()` - System information
- `useArrayStatus()` - Storage array status
- `useDockerContainers()` - Docker containers
- `useDashboardData()` - Combined dashboard data

## 🔒 Security

- API keys stored securely in AsyncStorage
- No credentials in code or logs
- Authentication required for all API calls
- Automatic session management

## 🧪 Testing Your Setup

1. Verify Unraid server is accessible
2. Test GraphQL endpoint: `curl http://YOUR_IP:3001/graphql`
3. Enable GraphQL Playground on Unraid
4. Test queries in playground first

## 📦 Building for Production

### iOS

```bash
eas build --platform ios
```

### Android

```bash
eas build --platform android
```

Configure `eas.json` first. See [Expo EAS docs](https://docs.expo.dev/build/introduction/).

## 🤝 Code Quality

This project follows industry best practices:

- ✅ Full TypeScript coverage
- ✅ Modular architecture
- ✅ Service layer pattern
- ✅ Custom hooks for data fetching
- ✅ Error boundary implementation
- ✅ Comprehensive documentation
- ✅ ESLint configuration
- ✅ Type-safe GraphQL queries

## 🎯 Future Enhancements

Potential features to add:

- Docker container management (start/stop/restart)
- VM management
- Push notifications for alerts
- Historical data charts
- Multiple server support
- Share management
- User management

## 📝 License

MIT

## 🙏 Acknowledgments

Built with:
- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Apollo Client](https://www.apollographql.com/)
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)

---

**Made with ❤️ for the Unraid community**
