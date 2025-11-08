/**
 * Custom hooks for Unraid GraphQL queries
 * Provides type-safe, reusable hooks for data fetching
 */

import { useQuery } from '@apollo/client/react';
import { AppConfig } from '@/src/config/app.config';
import {
  GET_SYSTEM_INFO,
  GET_ARRAY_STATUS,
  GET_DOCKER_CONTAINERS,
  GET_DASHBOARD_DATA,
} from '@/src/graphql/queries';
import type {
  SystemInfoResponse,
  ArrayStatusResponse,
  DockerContainersResponse,
  DashboardData,
} from '@/src/types/unraid.types';

/**
 * Hook to fetch system information
 */
export function useSystemInfo(pollInterval?: number) {
  return useQuery<SystemInfoResponse>(GET_SYSTEM_INFO, {
    pollInterval: pollInterval ?? AppConfig.graphql.defaultPollInterval,
    notifyOnNetworkStatusChange: true,
  });
}

/**
 * Hook to fetch array/storage status
 */
export function useArrayStatus(pollInterval?: number) {
  return useQuery<ArrayStatusResponse>(GET_ARRAY_STATUS, {
    pollInterval: pollInterval ?? AppConfig.graphql.defaultPollInterval,
    notifyOnNetworkStatusChange: true,
  });
}

/**
 * Hook to fetch Docker containers
 */
export function useDockerContainers(pollInterval?: number) {
  return useQuery<DockerContainersResponse>(GET_DOCKER_CONTAINERS, {
    pollInterval: pollInterval ?? AppConfig.graphql.defaultPollInterval,
    notifyOnNetworkStatusChange: true,
  });
}

/**
 * Hook to fetch all dashboard data in a single query
 * More efficient than multiple separate queries
 */
export function useDashboardData(pollInterval?: number) {
  return useQuery<DashboardData>(GET_DASHBOARD_DATA, {
    pollInterval: pollInterval ?? AppConfig.graphql.defaultPollInterval,
    notifyOnNetworkStatusChange: true,
  });
}

/**
 * Hook to fetch system info without polling (one-time fetch)
 */
export function useSystemInfoOnce() {
  return useQuery<SystemInfoResponse>(GET_SYSTEM_INFO, {
    fetchPolicy: 'network-only',
  });
}

