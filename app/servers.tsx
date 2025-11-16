import { SavedServer, useServerManagement } from '@/src/hooks/useServerManagement';
import { useLocalization } from '@/src/providers/localization-provider';
import { useTheme } from '@/src/providers/theme-provider';
import { useNavigation, useRouter } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ServersRoute() {
  const router = useRouter();
  const navigation = useNavigation();
  const { isDark } = useTheme();
  const { t } = useLocalization();
  const { servers, busy, makeActive, removeServer } = useServerManagement();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t('servers.title'),
      // keep native back button on the left
      headerRight: () => (
        <TouchableOpacity onPress={() => router.push('/add-server')} style={{ paddingHorizontal: 12 }}>
          <Text style={{ color: '#007aff', fontWeight: '600', fontSize: 16 }}>+</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, router]);

  const renderItem = ({ item }: { item: SavedServer }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.serverName, { color: isDark ? '#ffffff' : '#000000' }]}>{item.name}</Text>
          <Text style={[styles.serverUrl, { color: isDark ? '#8e8e93' : '#6e6e73' }]} numberOfLines={1}>
            {item.serverIP}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            disabled={busy}
            onPress={() => makeActive(item)}
          >
            <Text style={[styles.actionText, { color: '#007aff' }]}>{t('servers.makeActive')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            disabled={busy}
            onPress={() => removeServer(item.id)}
          >
            <Text style={[styles.actionText, { color: '#ff3b30' }]}>{t('servers.remove')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#f2f2f7' }]} edges={['top']}>
      <FlatList
        style={[styles.container, { backgroundColor: isDark ? '#000000' : '#f2f2f7' }]}
        contentContainerStyle={styles.content}
        data={servers}
        keyExtractor={(s) => s.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
            {t('servers.noSavedServers')}
          </Text>
        }
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e5ea',
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
    backgroundColor: '#ffffff',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
  },
});


