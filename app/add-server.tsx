import { useServerManagement } from '@/src/hooks/useServerManagement';
import { useTheme } from '@/src/providers/theme-provider';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddServerRoute() {
  const { isDark } = useTheme();
  const router = useRouter();
  const {
    name,
    serverIP,
    apiKey,
    busy,
    setName,
    setServerIP,
    setApiKey,
    addServer,
  } = useServerManagement();

  const handleAdd = async () => {
    try {
      await addServer();
      router.back();
    } catch (e: any) {
      Alert.alert('Failed to add server', e?.message ?? 'Unknown error');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#f2f2f7' }]} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.card}>
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
            onPress={handleAdd}
          >
            <Text style={styles.primaryBtnText}>{busy ? 'Working…' : 'Add Server'}</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e5ea',
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
});


