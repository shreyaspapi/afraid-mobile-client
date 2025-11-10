import { useAuth } from '@/src/providers/auth-provider';
import { storageService } from '@/src/services/storage.service';
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export type SavedServer = {
  id: string;
  name: string;
  serverIP: string;
  apiKey: string;
};

function generateId(): string {
  return 'srv_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function useServerManagement() {
  const { login, checkAuth } = useAuth();
  const [servers, setServers] = useState<SavedServer[]>([]);
  const [name, setName] = useState('');
  const [serverIP, setServerIP] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [busy, setBusy] = useState(false);

  const loadServers = useCallback(async () => {
    const list = await storageService.getServers();
    setServers(list as SavedServer[]);
  }, []);

  useEffect(() => {
    loadServers();
  }, [loadServers]);

  const addServer = useCallback(async () => {
    if (!name.trim() || !serverIP.trim() || !apiKey.trim()) {
      Alert.alert('Missing info', 'Please fill all fields.');
      return;
    }
    setBusy(true);
    try {
      const list = await storageService.getServers();
      const next: SavedServer[] = [
        ...list,
        { id: generateId(), name: name.trim(), serverIP: serverIP.trim(), apiKey: apiKey.trim() },
      ];
      await storageService.saveServers(next);
      setName('');
      setServerIP('');
      setApiKey('');
      setServers(next);
    } catch (error) {
      console.error('Failed to add server', error);
      Alert.alert('Error', 'Failed to add server');
    } finally {
      setBusy(false);
    }
  }, [apiKey, name, serverIP]);

  const removeServer = useCallback(
    async (id: string) => {
      setBusy(true);
      try {
        const list = await storageService.getServers();
        const next = list.filter((server: SavedServer) => server.id !== id);
        await storageService.saveServers(next);
        setServers(next);
      } catch (error) {
        console.error('Failed to remove server', error);
        Alert.alert('Error', 'Failed to remove server');
      } finally {
        setBusy(false);
      }
    },
    []
  );

  const makeActive = useCallback(
    async (server: SavedServer) => {
      setBusy(true);
      try {
        await login({ serverIP: server.serverIP, apiKey: server.apiKey });
        await checkAuth();
        Alert.alert('Active server updated', `Now using ${server.name}`);
      } catch (error: any) {
        console.error('Failed to switch server', error);
        Alert.alert('Error', error?.message || 'Failed to switch server');
      } finally {
        setBusy(false);
      }
    },
    [checkAuth, login]
  );

  return {
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
    reload: loadServers,
  };
}

