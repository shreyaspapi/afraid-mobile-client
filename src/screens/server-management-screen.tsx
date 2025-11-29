import { Card } from '@/src/components/ui/card';
import { useServerManagement } from '@/src/hooks/useServerManagement';
import { useLocalization } from '@/src/providers/localization-provider';
import { useTheme } from '@/src/providers/theme-provider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {
  Dialog,
  Divider,
  IconButton,
  Button as PaperButton,
  Card as PaperCard,
  Text as PaperText,
  TextInput as PaperTextInput,
  Portal,
  Surface,
  useTheme as usePaperTheme
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

// Conditionally import native SwiftUI components only on iOS
let UiButton: any;
let UiForm: any;
let UiHost: any;
let UiHStack: any;
let UiSection: any;
let UiSpacer: any;
let UiText: any;

if (Platform.OS === 'ios') {
  const swiftUIModule = require('@expo/ui/swift-ui');
  UiButton = swiftUIModule.Button;
  UiForm = swiftUIModule.Form;
  UiHost = swiftUIModule.Host;
  UiHStack = swiftUIModule.HStack;
  UiSection = swiftUIModule.Section;
  UiSpacer = swiftUIModule.Spacer;
  UiText = swiftUIModule.Text;
}

export function ServerManagementScreen() {
  const { isDark } = useTheme();
  const { t } = useLocalization();
  const paperTheme = usePaperTheme();
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const {
    servers,
    name,
    serverIP,
    apiKey,
    busy,
    setName,
    setServerIP,
    setApiKey,
    addServer,
    removeServer,
    makeActive,
  } = useServerManagement();

  const handleRemoveServer = (id: string, serverName: string) => {
    if (Platform.OS === 'ios') {
      Alert.alert('Remove Server', `Are you sure you want to remove ${serverName}?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeServer(id) },
      ]);
    } else {
      setShowDeleteDialog(id);
    }
  };

  const serverToDelete = servers.find((s) => s.id === showDeleteDialog);

  // iOS: Use SwiftUI-based UI for native feel
  if (Platform.OS === 'ios' && UiHost) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#000000' : '#f2f2f7' }} edges={['top']}>
        {/* RN Add Server form outside of UiHost to avoid mixing views */}
        <View style={{ padding: 16 }}>
          <Card>
            <Text style={[styles.title, { color: isDark ? '#ffffff' : '#000000' }]}>Add Server</Text>
            <View style={styles.field}>
              <Text style={[styles.label, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>Name</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: isDark ? '#ffffff' : '#000000',
                    backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
                    borderColor: isDark ? '#38383a' : '#c7c7cc',
                  },
                ]}
                placeholder="My Unraid"
                placeholderTextColor={isDark ? '#6e6e73' : '#8e8e93'}
                value={name}
                onChangeText={setName}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.field}>
              <Text style={[styles.label, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>Server URL</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: isDark ? '#ffffff' : '#000000',
                    backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
                    borderColor: isDark ? '#38383a' : '#c7c7cc',
                  },
                ]}
                placeholder="http://192.168.1.100:3001/graphql"
                placeholderTextColor={isDark ? '#6e6e73' : '#8e8e93'}
                value={serverIP}
                onChangeText={setServerIP}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <View style={styles.field}>
              <Text style={[styles.label, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>API Key</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: isDark ? '#ffffff' : '#000000',
                    backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
                    borderColor: isDark ? '#38383a' : '#c7c7cc',
                  },
                ]}
                placeholder="API key"
                placeholderTextColor={isDark ? '#6e6e73' : '#8e8e93'}
                value={apiKey}
                onChangeText={setApiKey}
                autoCapitalize="none"
                secureTextEntry
              />
            </View>
            <TouchableOpacity
              style={[styles.primaryBtn, { opacity: busy ? 0.5 : 1 }]}
              disabled={busy}
              onPress={addServer}
            >
              <Text style={styles.primaryBtnText}>Add Server</Text>
            </TouchableOpacity>
          </Card>
        </View>
        {/* SwiftUI list for saved servers */}
        <UiHost style={{ flex: 1, backgroundColor: isDark ? '#000000' : '#f2f2f7' }}>
          <UiForm>
            <UiSection title="Saved Servers">
              {servers.length === 0 ? (
                <UiText size={15}>No saved servers</UiText>
              ) : (
                servers.map((item) => (
                  <UiHStack key={item.id} spacing={8}>
                    <UiText size={17}>{item.name}</UiText>
                    <UiSpacer />
                    <UiButton onPress={() => makeActive(item)}>
                      <UiText size={15} color="#007aff">
                        Make Active
                      </UiText>
                    </UiButton>
                    <UiButton onPress={() => handleRemoveServer(item.id, item.name)}>
                      <UiText size={15} color="#ff3b30">
                        Remove
                      </UiText>
                    </UiButton>
                  </UiHStack>
                ))
              )}
            </UiSection>
          </UiForm>
        </UiHost>
      </SafeAreaView>
    );
  }

  // Android and Web: Material Design 3 UI
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: paperTheme.colors.background }} edges={['top']}>
      <FlatList
        style={{ flex: 1, backgroundColor: paperTheme.colors.background }}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <PaperText variant="headlineMedium" style={{ fontWeight: 'bold', marginBottom: 8 }}>
              {t('servers.title') || 'Servers'}
            </PaperText>
            <PaperText variant="bodyMedium" style={{ color: paperTheme.colors.onSurfaceVariant, marginBottom: 20 }}>
              {t('servers.description') || 'Manage your saved Unraid servers'}
            </PaperText>

            {/* Add Server Card */}
            <Surface style={styles.addServerCard} elevation={2}>
              <PaperText variant="titleMedium" style={{ fontWeight: '600', marginBottom: 16 }}>
                Add New Server
              </PaperText>

              <PaperTextInput
                mode="outlined"
                label="Server Name"
                placeholder="My Unraid Server"
                value={name}
                onChangeText={setName}
                style={styles.paperInput}
                left={<PaperTextInput.Icon icon="tag" />}
              />

              <PaperTextInput
                mode="outlined"
                label="Server URL"
                placeholder="http://192.168.1.100:3001/graphql"
                value={serverIP}
                onChangeText={setServerIP}
                style={styles.paperInput}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                left={<PaperTextInput.Icon icon="server" />}
              />

              <PaperTextInput
                mode="outlined"
                label="API Key"
                placeholder="Your API key"
                value={apiKey}
                onChangeText={setApiKey}
                style={styles.paperInput}
                autoCapitalize="none"
                secureTextEntry
                left={<PaperTextInput.Icon icon="key" />}
              />

              <PaperButton
                mode="contained"
                onPress={addServer}
                loading={busy}
                disabled={busy}
                style={styles.addButton}
                icon="plus"
              >
                Add Server
              </PaperButton>
            </Surface>

            <PaperText variant="titleMedium" style={{ fontWeight: '600', marginTop: 24, marginBottom: 12 }}>
              Saved Servers
            </PaperText>
          </View>
        }
        data={servers}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => (
          <PaperCard style={styles.serverCard} mode="elevated">
            <PaperCard.Content>
              <View style={styles.serverHeader}>
                <View style={styles.serverIconContainer}>
                  <MaterialCommunityIcons name="server" size={28} color={paperTheme.colors.primary} />
                </View>
                <View style={styles.serverInfo}>
                  <PaperText variant="titleMedium" style={{ fontWeight: '600' }}>
                    {item.name}
                  </PaperText>
                  <PaperText
                    variant="bodySmall"
                    style={{ color: paperTheme.colors.onSurfaceVariant }}
                    numberOfLines={1}
                  >
                    {item.serverIP}
                  </PaperText>
                </View>
                <IconButton
                  icon="dots-vertical"
                  onPress={() => {}}
                  disabled={busy}
                />
              </View>

              <Divider style={{ marginVertical: 12 }} />

              <View style={styles.serverActions}>
                <PaperButton
                  mode="contained"
                  onPress={() => makeActive(item)}
                  disabled={busy}
                  compact
                  icon="check"
                  style={styles.serverActionButton}
                >
                  Make Active
                </PaperButton>
                <PaperButton
                  mode="outlined"
                  onPress={() => handleRemoveServer(item.id, item.name)}
                  disabled={busy}
                  compact
                  icon="delete"
                  textColor="#ff3b30"
                  style={[styles.serverActionButton, { borderColor: '#ff3b30' }]}
                >
                  Remove
                </PaperButton>
              </View>
            </PaperCard.Content>
          </PaperCard>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <Surface style={styles.emptyCard} elevation={1}>
            <MaterialCommunityIcons name="server-off" size={48} color={paperTheme.colors.onSurfaceVariant} />
            <PaperText
              variant="bodyLarge"
              style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 12, textAlign: 'center' }}
            >
              No servers saved yet
            </PaperText>
            <PaperText
              variant="bodySmall"
              style={{ color: paperTheme.colors.onSurfaceVariant, marginTop: 4, textAlign: 'center' }}
            >
              Add your first server above
            </PaperText>
          </Surface>
        }
      />

      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog visible={!!showDeleteDialog} onDismiss={() => setShowDeleteDialog(null)}>
          <Dialog.Title>Remove Server</Dialog.Title>
          <Dialog.Content>
            <PaperText variant="bodyMedium">
              Are you sure you want to remove "{serverToDelete?.name}"? This action cannot be undone.
            </PaperText>
          </Dialog.Content>
          <Dialog.Actions>
            <PaperButton onPress={() => setShowDeleteDialog(null)}>Cancel</PaperButton>
            <PaperButton
              textColor="#ff3b30"
              onPress={() => {
                if (showDeleteDialog) {
                  removeServer(showDeleteDialog);
                  setShowDeleteDialog(null);
                }
              }}
            >
              Remove
            </PaperButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  // iOS styles
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  primaryBtn: {
    marginTop: 8,
    backgroundColor: '#007aff',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 14,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  // Paper styles
  addServerCard: {
    borderRadius: 20,
    padding: 20,
  },
  paperInput: {
    marginBottom: 12,
  },
  addButton: {
    marginTop: 8,
    borderRadius: 12,
  },
  serverCard: {
    borderRadius: 16,
  },
  serverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serverIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#007aff15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  serverInfo: {
    flex: 1,
  },
  serverActions: {
    flexDirection: 'row',
    gap: 8,
  },
  serverActionButton: {
    flex: 1,
    borderRadius: 10,
  },
  emptyCard: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
