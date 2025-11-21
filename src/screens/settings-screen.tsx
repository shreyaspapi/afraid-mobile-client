/**
 * Settings Screen
 * App settings and account management with dark mode toggle
 */

import { AlertDialog } from '@/src/components/ui/alert-dialog';
import { Card } from '@/src/components/ui/card';
import { AppConfig } from '@/src/config/app.config';
import { usePollingInterval } from '@/src/hooks/usePollingInterval';
import { useAuth } from '@/src/providers/auth-provider';
import { useLocalization } from '@/src/providers/localization-provider';
import { useTheme } from '@/src/providers/theme-provider';
import { useApolloClient } from '@apollo/client/react';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// Conditionally import native SwiftUI components only on iOS
let UiButton: any;
let UiForm: any;
let UiHost: any;
let UiHStack: any;
let UiImage: any;
let UiSection: any;
let UiSpacer: any;
let UiSwitch: any;
let UiText: any;

if (Platform.OS === 'ios') {
  const swiftUIModule = require('@expo/ui/swift-ui');
  UiButton = swiftUIModule.Button;
  UiForm = swiftUIModule.Form;
  UiHost = swiftUIModule.Host;
  UiHStack = swiftUIModule.HStack;
  UiImage = swiftUIModule.Image;
  UiSection = swiftUIModule.Section;
  UiSpacer = swiftUIModule.Spacer;
  UiSwitch = swiftUIModule.Switch;
  UiText = swiftUIModule.Text;
}

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
  const { locale, setLocale, availableLocales } = useLocalization();
  const { t } = useLocalization();
  const apolloClient = useApolloClient();
  const { pollingInterval, updatePollingInterval } = usePollingInterval();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [showLogoutErrorAlert, setShowLogoutErrorAlert] = useState(false);
  const [logoutErrorMessage, setLogoutErrorMessage] = useState('');
  const insets = useSafeAreaInsets();
  const bottomTabPadding = useAdaptiveBottomTabPadding();
  const router = useRouter();

  const performLogout = async () => {
    setIsLoggingOut(true);
    try {
      await apolloClient.clearStore();
      console.log('Apollo cache cleared');
      await logout();
      console.log('Logout successful');
      await checkAuth();
      console.log('Auth state re-checked');
    } catch (error: any) {
      console.error('Logout error:', error);
      if (Platform.OS === 'web') {
        setLogoutErrorMessage(error?.message || t('settings.logoutError'));
        setShowLogoutErrorAlert(true);
      } else {
        Alert.alert(t('common.error'), `${t('settings.logoutError')}: ${error?.message || t('errors.generic')}`);
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      setShowLogoutAlert(true);
      return;
    }
    Alert.alert(t('settings.logout'), t('settings.logoutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('settings.logout'),
        style: 'destructive',
        onPress: performLogout,
      },
    ]);
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
      t('settings.pollingFrequency') || 'Polling Frequency',
      t('settings.pollingDescription') || 'How often should the app refresh data automatically?',
      [
        ...options.map((option) => ({
          text: option.label,
          onPress: async () => {
            try {
              await updatePollingInterval(option.value);
              Alert.alert(t('common.ok'), `${t('settings.pollingUpdated')} ${option.label.toLowerCase()}`);
            } catch (error: any) {
              Alert.alert(t('common.error'), error.message || t('settings.updateError'));
            }
          },
        })),
        { text: t('common.cancel'), style: 'cancel' },
      ]
    );
  };

  const getPollingIntervalLabel = () => {
    const currentValue = pollingInterval || AppConfig.graphql.defaultPollInterval;
    const option = AppConfig.graphql.pollingIntervalOptions.find(opt => opt.value === currentValue);
    return option?.label || '5 seconds';
  };

  const handleLanguageChange = () => {
    setShowLanguageModal(true);
  };

  const handleLanguageSelect = async (code: string, name: string) => {
    try {
      await setLocale(code as any);
      setShowLanguageModal(false);
      Alert.alert(t('common.ok'), `${t('settings.languageChanged')} ${name}`);
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || t('errors.generic'));
    }
  };

  const getCurrentLanguageName = () => {
    return availableLocales[locale] || 'English';
  };

  const languageModal = (
    <Modal
      visible={showLanguageModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowLanguageModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: isDark ? '#1c1c1e' : '#ffffff' }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
              {t('settings.selectLanguage')}
            </Text>
            <TouchableOpacity
              onPress={() => setShowLanguageModal(false)}
              style={styles.closeButton}
            >
              <Text style={[styles.closeButtonText, { color: isDark ? '#0a84ff' : '#007aff' }]}>
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.languageList}>
            {Object.entries(availableLocales).map(([code, name]) => (
              <TouchableOpacity
                key={code}
                style={[
                  styles.languageOption,
                  {
                    backgroundColor: code === locale ? (isDark ? '#2c2c2e' : '#f2f2f7') : 'transparent',
                    borderBottomColor: isDark ? '#2c2c2e' : '#e5e5ea'
                  }
                ]}
                onPress={() => handleLanguageSelect(code, name)}
              >
                <Text style={[
                  styles.languageText,
                  {
                    color: isDark ? '#ffffff' : '#000000',
                    fontWeight: code === locale ? '600' : '400'
                  }
                ]}>
                  {name}
                </Text>
                {code === locale && (
                  <Text style={[styles.checkmark, { color: isDark ? '#0a84ff' : '#007aff' }]}>
                    ✓
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  if (Platform.OS === 'ios' && UiHost) {
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

            <UiSection title={t('settings.language') || 'Language'}>
              <UiButton onPress={handleLanguageChange}>
                <UiHStack spacing={8}>
                  <UiImage systemName="globe" />
                  <UiText size={17}>{t('settings.language') || 'Language'}</UiText>
                  <UiSpacer />
                  <UiText size={17}>{getCurrentLanguageName()}</UiText>
                  <UiImage systemName="chevron.right" />
                </UiHStack>
              </UiButton>
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
                <UiText size={17}>{t('settings.currentTheme')}</UiText>
                <UiSpacer />
                <UiText size={17}>{isDark ? t('settings.dark') : t('settings.light')}</UiText>
              </UiHStack>
            </UiSection>

            <UiSection title={t('settings.actions') || 'Actions'}>
              <UiButton
                onPress={() => {
                  Alert.alert(
                    t('settings.clearCache') || 'Clear Cache',
                    t('settings.clearCacheDescription') || 'This will clear all cached data and refresh from the server.',
                    [
                      { text: t('common.cancel'), style: 'cancel' },
                      {
                        text: t('common.delete'),
                        onPress: async () => {
                          await apolloClient.clearStore();
                          Alert.alert(t('common.ok'), t('settings.cacheCleared'));
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
        {languageModal}
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
        {t('settings.settingsTitle')}
      </Text>

      {/* Appearance */}
      <Card>
        <Text style={[styles.cardTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
          {t('settings.appearance')}
        </Text>
        
        {/* Auto Mode */}
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: isDark ? '#ffffff' : '#000000' }]}>
              {t('settings.automatic')}
            </Text>
            <Text style={[styles.settingDescription, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
              {t('settings.followSystemTheme')}
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
                  {t('settings.darkMode')}
                </Text>
                <Text style={[styles.settingDescription, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
                  {t('settings.useDarkTheme')}
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

      {/* Language */}
      <Card>
        <Text style={[styles.cardTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
          {t('settings.language') || 'Language'}
        </Text>
        <TouchableOpacity 
          style={styles.infoRow}
          onPress={handleLanguageChange}
          activeOpacity={0.7}
        >
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: isDark ? '#ffffff' : '#000000' }]}>
              {t('settings.language') || 'Language'}
            </Text>
            <Text style={[styles.settingDescription, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
              {t('settings.selectLanguage') || 'Select your preferred language'}
            </Text>
          </View>
          <Text style={[styles.value, { color: isDark ? '#007aff' : '#007aff' }]}>
            {getCurrentLanguageName()}
          </Text>
        </TouchableOpacity>
      </Card>

      {/* Server Information */}
      <Card>
        <Text style={[styles.cardTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
          {t('settings.serverInformation')}
        </Text>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
            {t('settings.serverIP')}
          </Text>
          <Text
            style={[styles.value, { color: isDark ? '#ffffff' : '#000000' }]}
            numberOfLines={1}
          >
            {credentials?.serverIP || t('settings.notConnected')}
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: isDark ? '#38383a' : '#e5e5e5' }]} />
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
            {t('settings.connectionStatus')}
          </Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: '#34c759' }]} />
            <Text style={[styles.value, { color: '#34c759' }]}>
              {t('settings.connected')}
            </Text>
          </View>
        </View>
      </Card>

        {/* Server Management */}
        <Card>
          <TouchableOpacity style={styles.infoRow} onPress={() => router.push('/servers')} activeOpacity={0.7}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: isDark ? '#ffffff' : '#000000' }]}>
                {t('servers.title')}
              </Text>
              <Text style={[styles.settingDescription, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
                {t('settings.manageSavedServers')}
              </Text>
            </View>
            <Text style={[styles.value, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>›</Text>
          </TouchableOpacity>
        </Card>

      {/* App Information */}
      <Card>
        <Text style={[styles.cardTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
          {t('settings.appInformation')}
        </Text>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
            {t('settings.version')}
          </Text>
          <Text style={[styles.value, { color: isDark ? '#ffffff' : '#000000' }]}>
            1.0.0
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: isDark ? '#38383a' : '#e5e5e5' }]} />
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
            {t('settings.currentTheme')}
          </Text>
          <Text style={[styles.value, { color: isDark ? '#ffffff' : '#000000' }]}>
            {isDark ? t('settings.dark') : t('settings.light')}
          </Text>
        </View>
      </Card>

      {/* Refresh Settings */}
      <Card>
        <Text style={[styles.cardTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
          {t('settings.dataRefresh')}
        </Text>
        
        {/* Polling Frequency */}
        <TouchableOpacity 
          style={styles.infoRow}
          onPress={handlePollingIntervalChange}
          activeOpacity={0.7}
        >
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: isDark ? '#ffffff' : '#000000' }]}>
              {t('settings.pollingFrequency')}
            </Text>
            <Text style={[styles.settingDescription, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
              {t('settings.howOftenRefreshData')}
            </Text>
          </View>
          <Text style={[styles.value, { color: isDark ? '#007aff' : '#007aff' }]}>
            {getPollingIntervalLabel()}
          </Text>
        </TouchableOpacity>
        
        <View style={[styles.divider, { backgroundColor: isDark ? '#38383a' : '#e5e5e5' }]} />
        
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
            {t('settings.manualRefresh')}
          </Text>
          <Text style={[styles.value, { color: isDark ? '#ffffff' : '#000000' }]}>
            {t('settings.pullToRefresh')}
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
            {t('settings.clearCache')}
          </Text>
        </TouchableOpacity>
        
        <View style={[styles.divider, { backgroundColor: isDark ? '#38383a' : '#e5e5e5' }]} />
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          <Text style={[styles.actionButtonText, { color: '#ff3b30' }]}>
            {isLoggingOut ? t('settings.loggingOut') : t('settings.logout')}
          </Text>
        </TouchableOpacity>
      </Card>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: isDark ? '#48484a' : '#8e8e93' }]}>
          {t('settings.unraidMobileApp')}
        </Text>
        <Text style={[styles.footerText, { color: isDark ? '#48484a' : '#8e8e93' }]}>
          {t('settings.builtWith')}
        </Text>
      </View>
    </ScrollView>

    {Platform.OS === 'web' && (
      <AlertDialog
        visible={showLogoutAlert}
        title={t('settings.logout')}
        message={t('settings.logoutConfirm')}
        buttons={[
          { text: t('common.cancel') || 'Cancel', style: 'cancel', onPress: () => setShowLogoutAlert(false) },
          {
            text: t('settings.logout'),
            style: 'destructive',
            onPress: async () => {
              setShowLogoutAlert(false);
              await performLogout();
            },
          },
        ]}
        onDismiss={() => setShowLogoutAlert(false)}
      />
    )}

    {Platform.OS === 'web' && (
      <AlertDialog
        visible={showLogoutErrorAlert}
        title={t('common.error') || 'Error'}
        message={logoutErrorMessage}
        buttons={[
          { text: t('common.ok') || 'OK', style: 'default', onPress: () => setShowLogoutErrorAlert(false) },
        ]}
        onDismiss={() => setShowLogoutErrorAlert(false)}
      />
    )}

    {languageModal}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5ea',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: '400',
  },
  languageList: {
    maxHeight: 400,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  languageText: {
    fontSize: 16,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '600',
  },
});
