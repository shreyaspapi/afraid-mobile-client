import { Card } from '@/src/components/ui/card';
import { ErrorMessage } from '@/src/components/ui/error-message';
import { LoadingScreen } from '@/src/components/ui/loading-screen';
import { START_CONTAINER, STOP_CONTAINER } from '@/src/graphql/queries';
import { useDockerContainers } from '@/src/hooks/useUnraidQuery';
import { useTheme } from '@/src/providers/theme-provider';
import { DemoDataService } from '@/src/services/demo-data.service';
import { useMutation } from '@apollo/client/react';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ContainerItem {
  id: string;
  names?: string[];
  image?: string;
  state: string;
  status?: string;
  autoStart?: boolean;
}

export function DockerScreen() {
  const { isDark } = useTheme();
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    setIsDemoMode(DemoDataService.isDemoMode());
  }, []);

  const { loading, error, data, refetch } = useDockerContainers();
  const [startContainer, { loading: starting }] = useMutation(START_CONTAINER);
  const [stopContainer, { loading: stopping }] = useMutation(STOP_CONTAINER);

  const containers: ContainerItem[] = useMemo(() => {
    const a = data as any;
    // Support both shapes: docker.containers or dockerContainers
    return a?.docker?.containers || a?.dockerContainers || [];
  }, [data]);

  const friendlyError = useMemo(() => {
    if (!error) return null;
    const raw = (error.message || '').toLowerCase();
    // Common cases when Docker service is disabled or array stopped
    if (
      raw.includes('docker') &&
      (raw.includes('socket') || raw.includes('enoent') || raw.includes('unavailable'))
    ) {
      return 'Docker service is unavailable. Start the array and ensure Docker is enabled in Settings > Docker.';
    }
    // API key missing DOCKER read permission
    if (raw.includes('permission') || raw.includes('forbidden') || raw.includes('unauthorized')) {
      return 'Access denied for Docker. Check that your API key has DOCKER read permissions.';
    }
    return error.message || 'Failed to load containers';
  }, [error]);

  if (loading && !data) {
    return <LoadingScreen message="Loading containers..." />;
  }

  if (error && !data) {
    return <ErrorMessage message={friendlyError!} onRetry={() => refetch()} />;
  }

  const onStart = async (id: string) => {
    if (isDemoMode) {
      Alert.alert('Demo Mode', 'Container start operation is disabled in demo mode');
      return;
    }
    try {
      await startContainer({ variables: { id } });
      await refetch();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to start container');
    }
  };

  const onStop = async (id: string) => {
    if (isDemoMode) {
      Alert.alert('Demo Mode', 'Container stop operation is disabled in demo mode');
      return;
    }
    try {
      await stopContainer({ variables: { id } });
      await refetch();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to stop container');
    }
  };

  const onRestart = async (id: string) => {
    if (isDemoMode) {
      Alert.alert('Demo Mode', 'Container restart operation is disabled in demo mode');
      return;
    }
    try {
      // Graceful restart: stop then start
      await stopContainer({ variables: { id } });
      await startContainer({ variables: { id } });
      await refetch();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to restart container');
    }
  };

  const renderItem = ({ item }: { item: ContainerItem }) => {
    const isRunning = item.state?.toLowerCase() === 'running';
    return (
      <Card>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: isDark ? '#ffffff' : '#000000' }]}>
              {(item.names && item.names[0]) || item.id}
            </Text>
            {!!item.image && (
              <Text style={[styles.sub, { color: isDark ? '#8e8e93' : '#6e6e73' }]} numberOfLines={1}>
                {item.image}
              </Text>
            )}
            {!!item.status && (
              <Text style={[styles.sub, { color: isDark ? '#8e8e93' : '#6e6e73' }]} numberOfLines={1}>
                {item.status}
              </Text>
            )}
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, { borderColor: isDark ? '#38383a' : '#e5e5ea' }]}
              disabled={stopping || starting}
              onPress={() => (isRunning ? onStop(item.id) : onStart(item.id))}
            >
              <Text style={[styles.btnText, { color: isRunning ? '#ff3b30' : '#34c759' }]}>
                {isRunning ? 'Stop' : 'Start'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { borderColor: isDark ? '#38383a' : '#e5e5ea' }]}
              disabled={stopping || starting}
              onPress={() => onRestart(item.id)}
            >
              <Text style={[styles.btnText, { color: isDark ? '#ffffff' : '#000000' }]}>Restart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        style={[styles.container, { backgroundColor: isDark ? '#000000' : '#f2f2f7' }]}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <Text style={[styles.title, { color: isDark ? '#ffffff' : '#000000' }]}>
            Docker
          </Text>
        }
        data={containers}
        keyExtractor={(c) => c.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        refreshControl={
          <RefreshControl
            refreshing={!!loading}
            onRefresh={refetch}
            tintColor={isDark ? '#007aff' : '#007aff'}
          />
        }
        ListEmptyComponent={
          <Text style={[styles.empty, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>No containers found</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  sub: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  empty: {
    textAlign: 'center',
    marginTop: 24,
  },
});


