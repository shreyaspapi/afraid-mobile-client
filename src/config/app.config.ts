/**
 * Application Configuration
 * Central place for all app-wide configuration constants
 */

export const AppConfig = {
  // API Configuration
  api: {
    defaultTimeout: 10000, // 10 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },

  // GraphQL Configuration
  graphql: {
    defaultPollInterval: 5000, // 5 seconds - for real-time dashboard updates
    fetchPolicy: 'cache-and-network' as const,
  },

  // Storage Keys
  storage: {
    keys: {
      serverIP: '@unraid_server_ip',
      apiKey: '@unraid_api_key',
      isAuthenticated: '@unraid_is_authenticated',
    },
  },

  // UI Configuration
  ui: {
    animationDuration: 300,
    toastDuration: 3000,
  },

  // Feature Flags (for future use)
  features: {
    enableNotifications: true,
    enableRealTimeUpdates: true,
    enableDarkMode: true,
  },
} as const;

export type AppConfigType = typeof AppConfig;

