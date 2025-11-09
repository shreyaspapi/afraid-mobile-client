import { Card } from '@/src/components/ui/card';
import { ErrorMessage } from '@/src/components/ui/error-message';
import { LoadingScreen } from '@/src/components/ui/loading-screen';
import { GET_VMS, START_VM, STOP_VM } from '@/src/graphql/queries';
import { usePollingInterval } from '@/src/hooks/usePollingInterval';
import { useTheme } from '@/src/providers/theme-provider';
import { DemoDataService } from '@/src/services/demo-data.service';
import { useMutation, useQuery } from '@apollo/client/react';
import {
  Button as UiButton,
  Form as UiForm,
  Host as UiHost,
  HStack as UiHStack,
  Image as UiImage,
  Section as UiSection,
  Spacer as UiSpacer,
  Text as UiText,
  VStack as UiVStack,
} from '@expo/ui/swift-ui';
import React, { useEffect, useMemo, useState } from 'react';
import { ActionSheetIOS, Alert, FlatList, Platform, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface VMItem {
  id: string;
  name?: string;
  state: string;
}

export function VMsScreen() {
  const { isDark } = useTheme();
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { pollingInterval } = usePollingInterval();

  useEffect(() => {
    setIsDemoMode(DemoDataService.isDemoMode());
  }, []);

  // Always call useQuery hook (Rules of Hooks - must be unconditional)
  const queryResult = useQuery<{ vms: { domain?: VMItem[]; domains?: VMItem[] } }>(GET_VMS, {
    pollInterval: pollingInterval,
    notifyOnNetworkStatusChange: true,
    skip: isDemoMode,
  });

  // Always call mutation hooks (Rules of Hooks - must be unconditional)
  const [startVM, { loading: starting }] = useMutation(START_VM);
  const [stopVM, { loading: stopping }] = useMutation(STOP_VM);

  // Use demo data if in demo mode (after all hooks are called)
  const { loading, error, data, refetch } = isDemoMode
    ? {
        loading: false,
        error: undefined,
        data: DemoDataService.getVMsData(),
        refetch: async () => ({ data: DemoDataService.getVMsData() }),
      }
    : queryResult;

  // Extract VMs data before any early returns (Rules of Hooks)
  const vms: VMItem[] = (data?.vms?.domain || data?.vms?.domains || []) as VMItem[];

  // Calculate totals before any early returns (Rules of Hooks)
  const totals = useMemo(() => {
    const total = vms.length;
    const running = vms.filter((vm) => vm.state?.toLowerCase() === 'running').length;
    const stopped = total - running;
    return { total, running, stopped };
  }, [vms]);

  if (loading && !data) {
    return <LoadingScreen message="Loading virtual machines..." />;
  }

  if (error && !data) {
    return <ErrorMessage message={error.message || 'Failed to load VMs'} onRetry={() => refetch()} />;
  }

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

  const showActionsFor = (item: VMItem) => {
    const isRunning = item.state?.toLowerCase() === 'running';
    const options = [isRunning ? 'Stop' : 'Start', 'Cancel'];
    const destructiveButtonIndex = isRunning ? 0 : undefined;
    const cancelButtonIndex = 1;
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
        title: item.name || item.id,
      },
      async (buttonIndex) => {
        if (buttonIndex === 0) {
          if (isRunning) {
            await onStop(item.id);
          } else {
            await onStart(item.id);
          }
        }
      }
    );
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

  // iOS: Use SwiftUI-based UI for native feel
  if (Platform.OS === 'ios') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#000000' : '#f2f2f7' }} edges={['top']}>
        <UiHost style={{ flex: 1, backgroundColor: isDark ? '#000000' : '#f2f2f7' }}>
          <UiForm>
            <UiSection title="Overview">
              <UiHStack spacing={12}>
                <UiVStack spacing={4}>
                  <UiText size={22}>{totals.total.toString()}</UiText>
                  <UiText size={13}>Total</UiText>
                </UiVStack>
                <UiSpacer />
                <UiVStack spacing={4}>
                  <UiText size={22} color="green">{totals.running.toString()}</UiText>
                  <UiText size={13}>Running</UiText>
                </UiVStack>
                <UiSpacer />
                <UiVStack spacing={4}>
                  <UiText size={22} color="red">{totals.stopped.toString()}</UiText>
                  <UiText size={13}>Stopped</UiText>
                </UiVStack>
              </UiHStack>
            </UiSection>

            <UiSection title="Virtual Machines">
              {vms.length === 0 ? <UiText size={15}>No VMs found</UiText> : null}
              {vms.map((item) => {
                const isRunning = item.state?.toLowerCase() === 'running';
                return (
                  <UiHStack key={item.id} spacing={12}>
										<UiText size={12} color={isRunning ? 'green' : 'red'}>●</UiText>
                    <UiText size={17}>{item.name || item.id}</UiText>
                    <UiSpacer />
                    <UiText size={15}>{item.state}</UiText>
                    <UiButton onPress={() => showActionsFor(item)}>
                      <UiImage systemName="ellipsis.circle" />
                    </UiButton>
                  </UiHStack>
                );
              })}
            </UiSection>
          </UiForm>
        </UiHost>
      </SafeAreaView>
    );
  }

  // Android and other platforms: existing React Native UI
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: isDark ? '#000000' : '#f2f2f7' }]}
      edges={['top']}
    >
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


