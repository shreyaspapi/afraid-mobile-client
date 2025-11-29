/**
 * Login Screen
 * Handles user authentication with Unraid server
 */

import { AlertDialog } from '@/src/components/ui/alert-dialog';
import { useLocalization } from '@/src/providers/localization-provider';
import { useTheme } from '@/src/providers/theme-provider';
import { authService } from '@/src/services/auth.service';
import { storageService } from '@/src/services/storage.service';
import type { UnraidCredentials } from '@/src/types/unraid.types';
import { Image } from 'expo-image';
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
import {
  Button as PaperButton,
  Divider as PaperDivider,
  Text as PaperText,
  TextInput as PaperTextInput,
  useTheme as usePaperTheme,
} from 'react-native-paper';

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
  const paperTheme = usePaperTheme();

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

  const handleDemoMode = () => {
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
  };

  if (Platform.OS !== 'ios') {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[
          styles.container,
          { backgroundColor: paperTheme.colors.background },
        ]}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.logo}
              contentFit="contain"
            />
            <PaperText variant="headlineMedium" style={{ color: paperTheme.colors.onBackground, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
              {t('login.title')}
            </PaperText>
            <PaperText variant="bodyLarge" style={{ color: paperTheme.colors.onSurfaceVariant, textAlign: 'center', maxWidth: 300 }}>
              {t('login.subtitle')}
            </PaperText>
          </View>

          <View style={styles.form}>
            <PaperTextInput
              mode="outlined"
              label={t('login.serverIP')}
              placeholder="http://192.168.1.x"
              value={serverIP}
              onChangeText={setServerIP}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              style={{ marginBottom: 8, backgroundColor: paperTheme.colors.surface }}
              left={<PaperTextInput.Icon icon="server" />}
            />
            <PaperText variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginBottom: 16, marginLeft: 4 }}>
              {t('login.serverIPHint')}
            </PaperText>

            <PaperTextInput
              mode="outlined"
              label={t('login.apiKey')}
              placeholder="••••••••••••••••"
              value={apiKey}
              onChangeText={setApiKey}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              style={{ marginBottom: 8, backgroundColor: paperTheme.colors.surface }}
              left={<PaperTextInput.Icon icon="key" />}
            />
            <PaperText variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, marginBottom: 24, marginLeft: 4 }}>
              {t('login.apiKeyHint')}
            </PaperText>

            <PaperButton
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={{ borderRadius: 8, paddingVertical: 6 }}
              labelStyle={{ fontSize: 16, fontWeight: '600' }}
            >
              {t('login.connect')}
            </PaperButton>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 32 }}>
               <PaperDivider style={{ flex: 1 }} />
               <PaperText variant="labelMedium" style={{ marginHorizontal: 16, color: paperTheme.colors.onSurfaceVariant }}>
                 {t('login.or')}
               </PaperText>
               <PaperDivider style={{ flex: 1 }} />
            </View>

            <PaperButton
              mode="outlined"
              onPress={handleDemoMode}
              style={{ borderRadius: 8, borderColor: paperTheme.colors.outline }}
              labelStyle={{ color: paperTheme.colors.primary }}
            >
              {t('login.tryDemo')}
            </PaperButton>
          </View>

           <View style={styles.footer}>
              <PaperText variant="bodySmall" style={{ color: paperTheme.colors.onSurfaceVariant, textAlign: 'center', opacity: 0.7 }}>
                {t('login.footer')}
              </PaperText>
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
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.logo}
            contentFit="contain"
          />
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
              placeholder="http://192.168.1.x"
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
                  borderColor: isDark ? '#38383a' : '#e5e5ea',
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
              placeholder="••••••••••••••••"
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
                  borderColor: isDark ? '#38383a' : '#e5e5ea',
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
            onPress={handleDemoMode}
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
    padding: 24,
    justifyContent: 'center',
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    marginBottom: 48,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 24,
    borderRadius: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: '80%',
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
    marginTop: 6,
  },
  button: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 32,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 12,
    fontWeight: '600',
    position: 'absolute',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  demoButton: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
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
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.6,
  },
});

