/**
 * Settings Screen
 * App settings and account management with dark mode toggle
 */

import { Card } from '@/src/components/ui/card';
import { useAuth } from '@/src/providers/auth-provider';
import { useTheme } from '@/src/providers/theme-provider';
import { useApolloClient } from '@apollo/client/react';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export function SettingsScreen() {
  const { theme, isDark, setTheme } = useTheme();
  const { logout, credentials, checkAuth } = useAuth();
  const apolloClient = useApolloClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

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
            paddingBottom: 16 + tabBarHeight + insets.bottom,
          },
        ]}
        contentInsetAdjustmentBehavior={Platform.OS === 'ios' ? 'automatic' : undefined}
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
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
            Auto Refresh
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
});
