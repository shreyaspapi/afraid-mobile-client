/**
 * Storage Service
 * Handles all secure storage operations using AsyncStorage
 * Provides abstraction layer for credential management
 */

import { AppConfig } from '@/src/config/app.config';
import type { UnraidCredentials } from '@/src/types/unraid.types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEMO_MODE_KEY = '@unraid:demo_mode';

class StorageService {
  /**
   * Demo mode management
   */
  async isDemoMode(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(DEMO_MODE_KEY);
      const isDemo = value === 'true';
      console.log('Storage: isDemoMode check:', isDemo);
      return isDemo;
    } catch (error) {
      console.error('Storage: isDemoMode error:', error);
      return false;
    }
  }

  async setDemoMode(enabled: boolean): Promise<void> {
    console.log('Storage: setDemoMode:', enabled);
    await AsyncStorage.setItem(DEMO_MODE_KEY, enabled ? 'true' : 'false');
    global.__DEMO_MODE__ = enabled;
    console.log('Storage: Demo mode set, global flag:', global.__DEMO_MODE__);
  }

  async clearDemoMode(): Promise<void> {
    console.log('Storage: clearDemoMode');
    await AsyncStorage.removeItem(DEMO_MODE_KEY);
    global.__DEMO_MODE__ = false;
  }

  /**
   * Server management (multi-server)
   */
  async getServers(): Promise<Array<{ id: string; name: string; serverIP: string; apiKey: string }>> {
    try {
      const raw = await AsyncStorage.getItem(AppConfig.storage.keys.servers);
      if (!raw) return [];
      const servers = JSON.parse(raw);
      if (Array.isArray(servers)) return servers;
      return [];
    } catch {
      return [];
    }
  }

  async saveServers(servers: Array<{ id: string; name: string; serverIP: string; apiKey: string }>): Promise<void> {
    await AsyncStorage.setItem(AppConfig.storage.keys.servers, JSON.stringify(servers));
  }

  async setActiveServer(server: { serverIP: string; apiKey: string }): Promise<void> {
    await this.saveCredentials({ serverIP: server.serverIP, apiKey: server.apiKey });
  }

  /**
   * App settings
   */
  async getSettings<T = any>(): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(AppConfig.storage.keys.settings);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  async updateSettings(partial: Record<string, any>): Promise<void> {
    const current = (await this.getSettings<Record<string, any>>()) || {};
    const next = { ...current, ...partial };
    await AsyncStorage.setItem(AppConfig.storage.keys.settings, JSON.stringify(next));
  }

  /**
   * Cached dashboard data for offline fallback
   */
  async saveLastDashboard(payload: any): Promise<void> {
    try {
      await AsyncStorage.setItem(AppConfig.storage.keys.lastDashboard, JSON.stringify(payload));
    } catch {}
  }

  async getLastDashboard<T = any>(): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(AppConfig.storage.keys.lastDashboard);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }
  /**
   * Save Unraid credentials securely
   */
  async saveCredentials(credentials: UnraidCredentials): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [AppConfig.storage.keys.serverIP, credentials.serverIP],
        [AppConfig.storage.keys.apiKey, credentials.apiKey],
        [AppConfig.storage.keys.isAuthenticated, 'true'],
      ]);
    } catch (error) {
      throw new Error(`Failed to save credentials: ${error}`);
    }
  }

  /**
   * Retrieve stored credentials
   */
  async getCredentials(): Promise<UnraidCredentials | null> {
    try {
      const values = await AsyncStorage.multiGet([
        AppConfig.storage.keys.serverIP,
        AppConfig.storage.keys.apiKey,
      ]);

      const serverIP = values[0][1];
      const apiKey = values[1][1];

      if (!serverIP || !apiKey) {
        return null;
      }

      return { serverIP, apiKey };
    } catch (error) {
      console.error('Failed to retrieve credentials:', error);
      return null;
    }
  }

  /**
   * Get server IP only
   */
  async getServerIP(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(AppConfig.storage.keys.serverIP);
    } catch (error) {
      console.error('Failed to retrieve server IP:', error);
      return null;
    }
  }

  /**
   * Get API key only
   */
  async getApiKey(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(AppConfig.storage.keys.apiKey);
    } catch (error) {
      console.error('Failed to retrieve API key:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(AppConfig.storage.keys.isAuthenticated);
      return value === 'true';
    } catch (error) {
      return false;
    }
  }

  /**
   * Clear all stored credentials (logout)
   */
  async clearCredentials(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        AppConfig.storage.keys.serverIP,
        AppConfig.storage.keys.apiKey,
        AppConfig.storage.keys.isAuthenticated,
      ]);
    } catch (error) {
      throw new Error(`Failed to clear credentials: ${error}`);
    }
  }

  /**
   * Update server IP
   */
  async updateServerIP(serverIP: string): Promise<void> {
    try {
      await AsyncStorage.setItem(AppConfig.storage.keys.serverIP, serverIP);
    } catch (error) {
      throw new Error(`Failed to update server IP: ${error}`);
    }
  }

  /**
   * Update API key
   */
  async updateApiKey(apiKey: string): Promise<void> {
    try {
      await AsyncStorage.setItem(AppConfig.storage.keys.apiKey, apiKey);
    } catch (error) {
      throw new Error(`Failed to update API key: ${error}`);
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();

