import { Card } from '@/src/components/ui/card';
import { useAuth } from '@/src/providers/auth-provider';
import { useTheme } from '@/src/providers/theme-provider';
import { storageService } from '@/src/services/storage.service';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';

type SavedServer = { id: string; name: string; serverIP: string; apiKey: string };

export function ServerManagementScreen() {
  const { isDark } = useTheme();
  const { login, checkAuth } = useAuth();
  const [servers, setServers] = useState<SavedServer[]>([]);
  const [name, setName] = useState('');
  const [serverIP, setServerIP] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [busy, setBusy] = useState(false);

  const loadServers = async () => {
    const list = await storageService.getServers();
    setServers(list as SavedServer[]);
  };

  useEffect(() => {
    loadServers();
  }, []);

  const addServer = async () => {
    if (!name.trim() || !serverIP.trim() || !apiKey.trim()) {
      Alert.alert('Missing info', 'Please fill all fields.');
      return;
    }
    setBusy(true);
    try {
      const list = await storageService.getServers();
      const next = [...list, { id: uuidv4(), name: name.trim(), serverIP: serverIP.trim(), apiKey: apiKey.trim() }];
      await storageService.saveServers(next);
      setName('');
      setServerIP('');
      setApiKey('');
      await loadServers();
    } finally {
      setBusy(false);
    }
  };

  const removeServer = async (id: string) => {
    setBusy(true);
    try {
      const list = await storageService.getServers();
      const next = list.filter((s: SavedServer) => s.id !== id);
      await storageService.saveServers(next);
      await loadServers();
    } finally {
      setBusy(false);
    }
  };

  const makeActive = async (server: SavedServer) => {
    setBusy(true);
    try {
      // Save as current credentials; Apollo will rebuild through auth state
      await login({ serverIP: server.serverIP, apiKey: server.apiKey });
      await checkAuth();
      Alert.alert('Active server updated', `Now using ${server.name}`);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to switch server');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        style={[styles.container, { backgroundColor: isDark ? '#000000' : '#f2f2f7' }]}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <Text style={[styles.pageTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
              Servers
            </Text>
            <Card>
              <Text style={[styles.title, { color: isDark ? '#ffffff' : '#000000' }]}>Add Server</Text>
            <View style={styles.field}>
              <Text style={[styles.label, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>Name</Text>
              <TextInput
                style={[styles.input, { color: isDark ? '#ffffff' : '#000000' }]}
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
                style={[styles.input, { color: isDark ? '#ffffff' : '#000000' }]}
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
                style={[styles.input, { color: isDark ? '#ffffff' : '#000000' }]}
                placeholder="API key"
                placeholderTextColor={isDark ? '#6e6e73' : '#8e8e93'}
                value={apiKey}
                onChangeText={setApiKey}
                autoCapitalize="none"
                secureTextEntry
              />
            </View>
            <TouchableOpacity style={styles.primaryBtn} disabled={busy} onPress={addServer}>
              <Text style={styles.primaryBtnText}>Add Server</Text>
            </TouchableOpacity>
          </Card>
          </>
        }
        data={servers}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => (
          <Card>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.serverName, { color: isDark ? '#ffffff' : '#000000' }]}>{item.name}</Text>
                <Text style={[styles.serverUrl, { color: isDark ? '#8e8e93' : '#6e6e73' }]} numberOfLines={1}>
                  {item.serverIP}
                </Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn} disabled={busy} onPress={() => makeActive(item)}>
                  <Text style={[styles.actionText, { color: '#007aff' }]}>Make Active</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} disabled={busy} onPress={() => removeServer(item.id)}>
                  <Text style={[styles.actionText, { color: '#ff3b30' }]}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  field: {
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#38383a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  primaryBtn: {
    marginTop: 8,
    backgroundColor: '#007aff',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: 10,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  serverName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  serverUrl: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5ea',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
});


