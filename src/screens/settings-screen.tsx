/**
 * Settings Screen
 * App settings and account management with dark mode toggle
 */

import { Card } from '@/src/components/ui/card';
import { AppConfig } from '@/src/config/app.config';
import { usePollingInterval } from '@/src/hooks/usePollingInterval';
import { useAuth } from '@/src/providers/auth-provider';
import { useTheme } from '@/src/providers/theme-provider';
import { useApolloClient } from '@apollo/client/react';
import {
  Button as UiButton,
  Form as UiForm,
  Host as UiHost,
  HStack as UiHStack,
  Image as UiImage,
  Section as UiSection,
  Spacer as UiSpacer,
  Switch as UiSwitch,
  Text as UiText,
} from '@expo/ui/swift-ui';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

function useAdaptiveBottomTabPadding() {
  const insets = useSafeAreaInsets();
  // With NativeTabs on iOS, there is no React Navigation Bottom Tabs context.
  if (Platform.OS === 'ios') {
    return insets.bottom;
  }
  try {
    // Dynamically require to avoid initializing the hook on iOS.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { useBottomTabBarHeight } = require('@react-navigation/bottom-tabs');
    const height: number = useBottomTabBarHeight();
    return height + insets.bottom;
  } catch {
    return insets.bottom;
  }
}

export function SettingsScreen() {
  const { theme, isDark, setTheme } = useTheme();
  const { logout, credentials, checkAuth } = useAuth();
  const apolloClient = useApolloClient();
  const { pollingInterval, updatePollingInterval } = usePollingInterval();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const insets = useSafeAreaInsets();
  const bottomTabPadding = useAdaptiveBottomTabPadding();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              // Clear Apollo cache first
              await apolloClient.clearStore();
              console.log('Apollo cache cleared');
              
              // Logout (clears credentials and sets isAuthenticated to false)
              await logout();
              console.log('Logout successful');
              
              // Force re-check auth state
              await checkAuth();
              console.log('Auth state re-checked');
            } catch (error: any) {
              console.error('Logout error:', error);
              Alert.alert(
                'Error', 
                `Failed to logout: ${error?.message || 'Unknown error'}`
              );
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  const handleDarkModeToggle = async (value: boolean) => {
    await setTheme(value ? 'dark' : 'light');
  };

  const handleAutoModeToggle = async (value: boolean) => {
    await setTheme(value ? 'auto' : (isDark ? 'dark' : 'light'));
  };

  const handlePollingIntervalChange = () => {
    const options = AppConfig.graphql.pollingIntervalOptions;
    const currentIndex = options.findIndex(opt => opt.value === (pollingInterval || AppConfig.graphql.defaultPollInterval));
    
    Alert.alert(
      'Polling Frequency',
      'How often should the app refresh data automatically?',
      [
        ...options.map((option) => ({
          text: option.label,
          onPress: async () => {
            try {
              await updatePollingInterval(option.value);
              Alert.alert('Success', `Polling frequency updated to ${option.label.toLowerCase()}`);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to update polling frequency');
            }
          },
        })),
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const getPollingIntervalLabel = () => {
    const currentValue = pollingInterval || AppConfig.graphql.defaultPollInterval;
    const option = AppConfig.graphql.pollingIntervalOptions.find(opt => opt.value === currentValue);
    return option?.label || '5 seconds';
  };

  if (Platform.OS === 'ios') {
    // Native iOS-styled Settings using Expo UI (SwiftUI)
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: isDark ? '#000000' : '#f2f2f7' }]}
        edges={['top']}
      >
        <UiHost style={{ flex: 1 }}>
          <UiForm>
            <UiSection title="Appearance">
              <UiHStack spacing={8}>
                <UiImage systemName="aqi.medium" />
                <UiText size={17}>Appearance</UiText>
                <UiSpacer />
                <UiSwitch value={isDark} onValueChange={() => {}} />
              </UiHStack>
            </UiSection>

            <UiSection title="Management">
              <UiButton onPress={() => router.push('/servers')}>
                <UiHStack spacing={8}>
                  <UiImage systemName="server.rack" />
                  <UiText size={17}>Servers</UiText>
                  <UiSpacer />
                  <UiImage systemName="chevron.right" />
                </UiHStack>
              </UiButton>
            </UiSection>

            <UiSection title="Data Refresh">
              <UiButton onPress={handlePollingIntervalChange}>
                <UiHStack spacing={8}>
                  <UiImage systemName="speedometer" />
                  <UiText size={17}>Polling Frequency</UiText>
                  <UiSpacer />
                  <UiText size={17}>{getPollingIntervalLabel()}</UiText>
                </UiHStack>
              </UiButton>
              <UiHStack spacing={8}>
                <UiImage systemName="arrow.clockwise" />
                <UiText size={17}>Manual Refresh</UiText>
                <UiSpacer />
                <UiText size={17}>Pull to refresh</UiText>
              </UiHStack>
            </UiSection>

            <UiSection title="Server Information">
              <UiHStack spacing={8}>
                <UiImage systemName="network" />
                <UiText size={17}>Server IP</UiText>
                <UiSpacer />
                <UiText size={17}>{credentials?.serverIP || 'Not connected'}</UiText>
              </UiHStack>
              <UiHStack spacing={8}>
                <UiImage systemName="checkmark.circle.fill" />
                <UiText size={17}>Connection Status</UiText>
                <UiSpacer />
                <UiText size={17}>Connected</UiText>
              </UiHStack>
              <UiHStack spacing={8}>
                <UiImage systemName="info.circle" />
                <UiText size={17}>Version</UiText>
                <UiSpacer />
                <UiText size={17}>1.0.0</UiText>
              </UiHStack>
              <UiHStack spacing={8}>
                <UiImage systemName="paintbrush.fill" />
                <UiText size={17}>Current Theme</UiText>
                <UiSpacer />
                <UiText size={17}>{isDark ? 'Dark' : 'Light'}</UiText>
              </UiHStack>
            </UiSection>

            <UiSection title="Actions">
              <UiButton
                onPress={() => {
                  Alert.alert(
                    'Clear Cache',
                    'This will clear all cached data and refresh from the server.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Clear',
                        onPress: async () => {
                          await apolloClient.clearStore();
                          Alert.alert('Success', 'Cache cleared successfully');
                        },
                      },
                    ]
                  );
                }}
              >
                <UiHStack spacing={8}>
                  <UiImage systemName="trash" />
                  <UiText size={17}>Clear Cache</UiText>
                  <UiSpacer />
                </UiHStack>
              </UiButton>
              <UiButton onPress={handleLogout} disabled={isLoggingOut}>
                <UiHStack spacing={8}>
                  <UiImage systemName="rectangle.portrait.and.arrow.right" />
                  <UiText size={17}>{isLoggingOut ? 'Logging out...' : 'Logout'}</UiText>
                  <UiSpacer />
                </UiHStack>
              </UiButton>
            </UiSection>
          </UiForm>
        </UiHost>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#000000' : '#f2f2f7' },
      ]}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: 16 + bottomTabPadding,
          },
        ]}
        contentInsetAdjustmentBehavior={Platform.select({ ios: 'automatic', default: undefined }) as any}
        keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: isDark ? '#ffffff' : '#000000' }]}>
        Settings
      </Text>

      {/* Appearance */}
      <Card>
        <Text style={[styles.cardTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
          Appearance
        </Text>
        
        {/* Auto Mode */}
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: isDark ? '#ffffff' : '#000000' }]}>
              Automatic
            </Text>
            <Text style={[styles.settingDescription, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
              Follow system theme settings
            </Text>
          </View>
          <Switch
            value={theme === 'auto'}
            onValueChange={handleAutoModeToggle}
            trackColor={{ false: '#767577', true: '#34c759' }}
            thumbColor={isDark ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
          />
        </View>

        {theme !== 'auto' && (
          <>
            <View style={[styles.divider, { backgroundColor: isDark ? '#38383a' : '#e5e5e5' }]} />
            
            {/* Dark Mode */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingLabel, { color: isDark ? '#ffffff' : '#000000' }]}>
                  Dark Mode
                </Text>
                <Text style={[styles.settingDescription, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
                  Use dark theme
                </Text>
              </View>
              <Switch
                value={theme === 'dark'}
                onValueChange={handleDarkModeToggle}
                trackColor={{ false: '#767577', true: '#34c759' }}
                thumbColor={isDark ? '#f4f3f4' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
              />
            </View>
          </>
        )}
      </Card>

      {/* Server Information */}
      <Card>
        <Text style={[styles.cardTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
          Server Information
        </Text>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
            Server IP
          </Text>
          <Text
            style={[styles.value, { color: isDark ? '#ffffff' : '#000000' }]}
            numberOfLines={1}
          >
            {credentials?.serverIP || 'Not connected'}
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: isDark ? '#38383a' : '#e5e5e5' }]} />
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
            Connection Status
          </Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: '#34c759' }]} />
            <Text style={[styles.value, { color: '#34c759' }]}>
              Connected
            </Text>
          </View>
        </View>
      </Card>

        {/* Server Management */}
        <Card>
          <TouchableOpacity style={styles.infoRow} onPress={() => router.push('/servers')} activeOpacity={0.7}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: isDark ? '#ffffff' : '#000000' }]}>
                Servers
              </Text>
              <Text style={[styles.settingDescription, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
                Manage saved servers
              </Text>
            </View>
            <Text style={[styles.value, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>›</Text>
          </TouchableOpacity>
        </Card>

      {/* App Information */}
      <Card>
        <Text style={[styles.cardTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
          App Information
        </Text>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
            Version
          </Text>
          <Text style={[styles.value, { color: isDark ? '#ffffff' : '#000000' }]}>
            1.0.0
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: isDark ? '#38383a' : '#e5e5e5' }]} />
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
            Current Theme
          </Text>
          <Text style={[styles.value, { color: isDark ? '#ffffff' : '#000000' }]}>
            {isDark ? 'Dark' : 'Light'}
          </Text>
        </View>
      </Card>

      {/* Refresh Settings */}
      <Card>
        <Text style={[styles.cardTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
          Data Refresh
        </Text>
        
        {/* Polling Frequency */}
        <TouchableOpacity 
          style={styles.infoRow}
          onPress={handlePollingIntervalChange}
          activeOpacity={0.7}
        >
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: isDark ? '#ffffff' : '#000000' }]}>
              Polling Frequency
            </Text>
            <Text style={[styles.settingDescription, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
              How often to refresh data automatically
            </Text>
          </View>
          <Text style={[styles.value, { color: isDark ? '#007aff' : '#007aff' }]}>
            {getPollingIntervalLabel()}
          </Text>
        </TouchableOpacity>
        
        <View style={[styles.divider, { backgroundColor: isDark ? '#38383a' : '#e5e5e5' }]} />
        
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
            Manual Refresh
          </Text>
          <Text style={[styles.value, { color: isDark ? '#ffffff' : '#000000' }]}>
            Pull to refresh
          </Text>
        </View>
      </Card>

      {/* Actions */}
      <Card>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            Alert.alert(
              'Clear Cache',
              'This will clear all cached data and refresh from the server.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Clear',
                  onPress: async () => {
                    await apolloClient.clearStore();
                    Alert.alert('Success', 'Cache cleared successfully');
                  },
                },
              ]
            );
          }}
        >
          <Text style={[styles.actionButtonText, { color: isDark ? '#ffffff' : '#007aff' }]}>
            Clear Cache
          </Text>
        </TouchableOpacity>
        
        <View style={[styles.divider, { backgroundColor: isDark ? '#38383a' : '#e5e5e5' }]} />
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          <Text style={[styles.actionButtonText, { color: '#ff3b30' }]}>
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Text>
        </TouchableOpacity>
      </Card>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: isDark ? '#48484a' : '#8e8e93' }]}>
          Unraid Mobile App
        </Text>
        <Text style={[styles.footerText, { color: isDark ? '#48484a' : '#8e8e93' }]}>
          Built with React Native & Expo
        </Text>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'right',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  actionButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    gap: 4,
  },
  footerText: {
    fontSize: 13,
  },
  serverField: {
    marginBottom: 12,
  },
  serverLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
  },
  serverInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
  },
  serverPrimaryBtn: {
    marginTop: 4,
    marginBottom: 12,
    backgroundColor: '#007aff',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 10,
  },
  serverPrimaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  serverEmptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 8,
  },
  serverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  serverNameText: {
    fontSize: 15,
    fontWeight: '600',
  },
  serverUrlText: {
    fontSize: 12,
  },
  serverActions: {
    flexDirection: 'row',
    gap: 8,
  },
  serverActionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d1d6',
  },
  serverActionText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
