import { Tabs } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  if (Platform.OS === 'ios') {
    // Use native system tabs with Liquid Glass design on iOS
    return (
      <NativeTabs>
        <NativeTabs.Trigger name="index">
          <Icon sf="house.fill" />
          <Label>Dashboard</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="docker">
          <Icon sf="shippingbox.fill" />
          <Label>Docker</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="vms">
          <Icon sf="desktopcomputer" />
          <Label>VMs</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="servers">
          <Icon sf="antenna.radiowaves.left.and.right" />
          <Label>Servers</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="explore">
          <Icon sf="gearshape.fill" />
          <Label>Settings</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  // Keep existing JavaScript tabs for Android and other platforms
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="docker"
        options={{
          title: 'Docker',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="shippingbox.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="vms"
        options={{
          title: 'VMs',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="desktopcomputer" color={color} />,
        }}
      />
      <Tabs.Screen
        name="servers"
        options={{
          title: 'Servers',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="antenna.radiowaves.left.and.right" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
