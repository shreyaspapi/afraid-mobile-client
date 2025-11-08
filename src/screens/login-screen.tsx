/**
 * Login Screen
 * Handles user authentication with Unraid server
 */

import { useTheme } from '@/src/providers/theme-provider';
import { authService } from '@/src/services/auth.service';
import { storageService } from '@/src/services/storage.service';
import type { UnraidCredentials } from '@/src/types/unraid.types';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface LoginScreenProps {
  onSuccess: () => void;
}

export function LoginScreen({ onSuccess }: LoginScreenProps) {
  const [serverIP, setServerIP] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const { isDark } = useTheme();

  const validateInputs = (): boolean => {
    if (!serverIP.trim()) {
      Alert.alert('Error', 'Please enter your Unraid server IP address');
      return false;
    }

    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter your API key');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      const credentials: UnraidCredentials = {
        serverIP: serverIP.trim(),
        apiKey: apiKey.trim(),
      };

      const result = await authService.login(credentials);

      if (result.success) {
        // Trigger Apollo Client recreation by calling onSuccess
        // The ApolloProvider will recreate the client with new credentials
        onSuccess();
      } else {
        Alert.alert('Connection Failed', result.error || 'Unable to connect to Unraid server');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[
        styles.container,
        { backgroundColor: isDark ? '#000000' : '#f2f2f7' },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? '#ffffff' : '#000000' }]}>
            Connect to Unraid
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
            Enter your server details to get started
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
              Server IP Address
            </Text>
            <TextInput
              placeholder="http://192.168.21.1:3001/graphql"
              placeholderTextColor={isDark ? '#48484a' : '#c7c7cc'}
              value={serverIP}
              onChangeText={setServerIP}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
                  color: isDark ? '#ffffff' : '#000000',
                  borderColor: isDark ? '#38383a' : '#c7c7cc',
                },
              ]}
            />
            <Text style={[styles.hint, { color: isDark ? '#48484a' : '#8e8e93' }]}>
              Enter complete URL (e.g., http://192.168.21.1:3001/graphql)
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
              API Key
            </Text>
            <TextInput
              placeholder="Enter your API key"
              placeholderTextColor={isDark ? '#48484a' : '#c7c7cc'}
              value={apiKey}
              onChangeText={setApiKey}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
                  color: isDark ? '#ffffff' : '#000000',
                  borderColor: isDark ? '#38383a' : '#c7c7cc',
                },
              ]}
            />
            <Text style={[styles.hint, { color: isDark ? '#48484a' : '#8e8e93' }]}>
              Generate an API key using: unraid-api apikey --create
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: loading ? '#48484a' : '#007aff' },
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Connect</Text>
            )}
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: isDark ? '#38383a' : '#c7c7cc' }]}>
            <Text style={[styles.dividerText, { backgroundColor: isDark ? '#000000' : '#f2f2f7', color: isDark ? '#8e8e93' : '#6e6e73' }]}>
              OR
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.demoButton,
              {
                backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
                borderColor: isDark ? '#38383a' : '#c7c7cc',
              },
            ]}
            onPress={async () => {
              Alert.alert(
                'Demo Mode',
                'Demo mode allows you to explore the app interface without connecting to a real Unraid server.\n\nNote: All data will be simulated and no real operations will be performed.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Try Demo',
                    onPress: async () => {
                      setLoading(true);
                      try {
                        console.log('Login: Enabling demo mode...');
                        // Enable demo mode
                        await storageService.setDemoMode(true);
                        console.log('Login: Demo mode enabled, triggering auth check...');
                        
                        // Trigger app reload with demo data
                        onSuccess();
                        console.log('Login: Auth check triggered');
                      } catch (error: any) {
                        console.error('Login: Failed to enable demo mode:', error);
                        Alert.alert('Error', 'Failed to enable demo mode');
                      } finally {
                        setLoading(false);
                      }
                    }
                  }
                ]
              );
            }}
          >
            <Text style={[styles.demoButtonText, { color: isDark ? '#ffffff' : '#007aff' }]}>
              Try Demo Mode
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: isDark ? '#48484a' : '#8e8e93' }]}>
            Make sure your device is on the same network as your Unraid server
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 24,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 12,
    fontWeight: '600',
    position: 'absolute',
  },
  demoButton: {
    height: 50,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    textAlign: 'center',
  },
});

