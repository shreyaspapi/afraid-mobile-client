/**
 * GraphQL Query Definitions
 * All GraphQL queries for the Unraid API
 */

import { gql } from '@apollo/client';

/**
 * Query system information including OS, CPU, and Memory
 */
export const GET_SYSTEM_INFO = gql`
  query GetSystemInfo {
    info {
      os {
        platform
        distro
        release
        uptime
      }
      cpu {
        manufacturer
        brand
        cores
        threads
        flags
      }
    }
    metrics {
      cpu {
        percentTotal
        cpus {
          percentTotal
          percentUser
          percentSystem
        }
      }
      memory {
        total
        used
        free
        available
      }
    }
  }
`;

/**
 * Query array/storage status
 */
export const GET_ARRAY_STATUS = gql`
  query GetArrayStatus {
    array {
      state
      capacity {
        disks {
          total
          used
          free
        }
      }
      disks {
        name
        size
        status
        temp
        device
        fsType
      }
    }
  }
`;

/**
 * Query Docker containers
 */
export const GET_DOCKER_CONTAINERS = gql`
  query GetDockerContainers {
    docker {
      containers(skipCache: false) {
        id
        names
        image
        state
        status
        autoStart
        ports {
          privatePort
          publicPort
          type
        }
        created
      }
    }
  }
`;

/**
 * Combined dashboard query for efficiency
 */
export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    info {
      time
      os {
        platform
        distro
        release
        uptime
        hostname
        kernel
      }
      cpu {
        manufacturer
        brand
        cores
        threads
        speed
        flags
      }
      baseboard {
        manufacturer
        model
        version
        memMax
        memSlots
      }
      devices {
        network {
          iface
          model
          vendor
          mac
          virtual
          speed
          dhcp
        }
      }
      versions {
        core {
          unraid
          api
          kernel
        }
      }
    }
    metrics {
      cpu {
        percentTotal
        cpus {
          percentTotal
          percentUser
          percentSystem
          percentIdle
        }
      }
      memory {
        total
        used
        free
        available
        percentTotal
      }
    }
    array {
      state
      capacity {
        disks {
          total
          used
          free
        }
      }
      disks {
        name
        size
        status
        temp
        device
        fsType
        type
      }
      boot {
        name
        size
        fsSize
        fsFree
        fsUsed
      }
    }
    shares {
      name
      size
      used
      free
      comment
    }
    vars {
      name
      version
    }
    registration {
      type
      state
    }
  }
`;

/**
 * Lightweight health check query
 */
export const HEALTH_CHECK = gql`
  query HealthCheck {
    info {
      os {
        platform
      }
    }
  }
`;

