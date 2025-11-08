import { Card } from '@/src/components/ui/card';
import { ErrorMessage } from '@/src/components/ui/error-message';
import { LoadingScreen } from '@/src/components/ui/loading-screen';
import { GET_VMS, START_VM, STOP_VM } from '@/src/graphql/queries';
import { useTheme } from '@/src/providers/theme-provider';
import { DemoDataService } from '@/src/services/demo-data.service';
import { useMutation, useQuery } from '@apollo/client/react';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface VMItem {
  id: string;
  name?: string;
  state: string;
}

export function VMsScreen() {
  const { isDark } = useTheme();
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    setIsDemoMode(DemoDataService.isDemoMode());
  }, []);

  const queryResult = useQuery<{ vms: { domain?: VMItem[]; domains?: VMItem[] } }>(GET_VMS, {
    pollInterval: 10000,
    notifyOnNetworkStatusChange: true,
    skip: isDemoMode,
  });

  // Use demo data if in demo mode
  const { loading, error, data, refetch } = isDemoMode
    ? {
        loading: false,
        error: undefined,
        data: DemoDataService.getVMsData(),
        refetch: async () => ({ data: DemoDataService.getVMsData() }),
      }
    : queryResult;

  const [startVM, { loading: starting }] = useMutation(START_VM);
  const [stopVM, { loading: stopping }] = useMutation(STOP_VM);

  if (loading && !data) {
    return <LoadingScreen message="Loading virtual machines..." />;
  }

  if (error && !data) {
    return <ErrorMessage message={error.message || 'Failed to load VMs'} onRetry={() => refetch()} />;
  }

  const vms: VMItem[] = (data?.vms?.domain || data?.vms?.domains || []) as VMItem[];

  const onStart = async (id: string) => {
    if (isDemoMode) {
      Alert.alert('Demo Mode', 'VM start operation is disabled in demo mode');
      return;
    }
    try {
      await startVM({ variables: { id } });
      await refetch();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to start VM');
    }
  };

  const onStop = async (id: string) => {
    if (isDemoMode) {
      Alert.alert('Demo Mode', 'VM stop operation is disabled in demo mode');
      return;
    }
    try {
      await stopVM({ variables: { id } });
      await refetch();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to stop VM');
    }
  };

  const renderItem = ({ item }: { item: VMItem }) => {
    const isRunning = item.state?.toLowerCase() === 'running';
    return (
      <Card>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: isDark ? '#ffffff' : '#000000' }]}>{item.name || item.id}</Text>
            <Text style={[styles.sub, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>{item.state}</Text>
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
            Virtual Machines
          </Text>
        }
        data={vms}
        keyExtractor={(vm) => vm.id}
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
          <Text style={[styles.empty, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>No VMs found</Text>
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


