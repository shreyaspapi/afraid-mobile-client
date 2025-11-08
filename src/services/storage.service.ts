/**
 * Storage Service
 * Handles all secure storage operations using AsyncStorage
 * Provides abstraction layer for credential management
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig } from '@/src/config/app.config';
import type { UnraidCredentials } from '@/src/types/unraid.types';

class StorageService {
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

