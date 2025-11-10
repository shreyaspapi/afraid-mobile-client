/**
 * Login Screen
 * Handles user authentication with Unraid server
 */

import { AlertDialog, type AlertButton } from '@/src/components/ui/alert-dialog';
import { useLocalization } from '@/src/providers/localization-provider';
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
  const [showDemoAlert, setShowDemoAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { isDark } = useTheme();
  const { t } = useLocalization();

  const validateInputs = (): boolean => {
    if (!serverIP.trim()) {
      Alert.alert(t('common.error'), t('login.errorNoServerIP'));
      return false;
    }

    if (!apiKey.trim()) {
      Alert.alert(t('common.error'), t('login.errorNoApiKey'));
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
        Alert.alert(t('login.connectionFailed'), result.error || t('login.connectionFailedMessage'));
      }
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || t('errors.generic'));
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
            {t('login.title')}
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
            {t('login.subtitle')}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
              {t('login.serverIP')}
            </Text>
            <TextInput
              placeholder={t('login.serverIPPlaceholder')}
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
              {t('login.serverIPHint')}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
              {t('login.apiKey')}
            </Text>
            <TextInput
              placeholder={t('login.apiKeyPlaceholder')}
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
              {t('login.apiKeyHint')}
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
              <Text style={styles.buttonText}>{t('login.connect')}</Text>
            )}
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: isDark ? '#38383a' : '#c7c7cc' }]}>
            <Text style={[styles.dividerText, { backgroundColor: isDark ? '#000000' : '#f2f2f7', color: isDark ? '#8e8e93' : '#6e6e73' }]}>
              {t('login.or')}
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
            onPress={() => {
              if (Platform.OS === 'web') {
                setShowDemoAlert(true);
              } else {
                Alert.alert(
                  t('login.demoModeTitle'),
                  t('login.demoModeMessage'),
                  [
                    { text: t('common.cancel'), style: 'cancel' },
                    {
                      text: t('login.demoModeButton'),
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
                          Alert.alert(t('common.error'), t('login.demoModeError'));
                        } finally {
                          setLoading(false);
                        }
                      }
                    }
                  ]
                );
              }
            }}
          >
            <Text style={[styles.demoButtonText, { color: isDark ? '#ffffff' : '#007aff' }]}>
              {t('login.tryDemo')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: isDark ? '#48484a' : '#8e8e93' }]}>
            {t('login.footer')}
          </Text>
        </View>
      </View>

      {Platform.OS === 'web' && (
        <AlertDialog
          visible={showDemoAlert}
          title={t('login.demoModeTitle')}
          message={t('login.demoModeMessage')}
          buttons={[
            { text: t('common.cancel'), style: 'cancel', onPress: () => setShowDemoAlert(false) },
            {
              text: t('login.demoModeButton'),
              style: 'default',
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
                  setShowDemoAlert(false);
                  setErrorMessage(error?.message || t('login.demoModeError'));
                  setShowErrorAlert(true);
                } finally {
                  setLoading(false);
                }
              }
            }
          ]}
          onDismiss={() => setShowDemoAlert(false)}
        />
      )}

      {Platform.OS === 'web' && (
        <AlertDialog
          visible={showErrorAlert}
          title={t('common.error')}
          message={errorMessage}
          buttons={[
            { text: t('common.ok') || 'OK', style: 'default', onPress: () => setShowErrorAlert(false) }
          ]}
          onDismiss={() => setShowErrorAlert(false)}
        />
      )}
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

