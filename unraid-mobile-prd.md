# Product Requirements Document (PRD)
# Unraid Mobile Monitoring App

**Version:** 1.0  
**Date:** November 8, 2025  
**Product Owner:** [Your Name]  
**Status:** Draft

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Product Vision & Goals](#product-vision--goals)
4. [Target Audience & User Personas](#target-audience--user-personas)
5. [Product Scope](#product-scope)
6. [Core Features & Functionality](#core-features--functionality)
7. [Technical Specifications](#technical-specifications)
8. [User Stories](#user-stories)
9. [Non-Functional Requirements](#non-functional-requirements)
10. [Success Metrics](#success-metrics)
11. [Timeline & Milestones](#timeline--milestones)
12. [Open Questions & Future Considerations](#open-questions--future-considerations)

---

## Executive Summary

The Unraid Mobile Monitoring App is a cross-platform mobile application designed to provide Unraid server owners with comprehensive, real-time monitoring and management capabilities on iOS and Android devices. Leveraging the official Unraid GraphQL API (available since Unraid OS v7.2), this app addresses the critical need for mobile-first server management, enabling users to monitor system health, manage Docker containers and VMs, control array operations, and receive push notifications for critical events—all from their mobile devices.

**Key Value Proposition:** While Unraid 7.2 introduced a responsive web interface, a native mobile app provides superior user experience through push notifications, offline data caching, biometric authentication, and optimized mobile-native interactions that web interfaces cannot match.

**Primary Goal:** Empower Unraid users to confidently manage and monitor their servers on-the-go, reducing response times to critical issues and improving overall server administration efficiency.

---

## Problem Statement

### Current Challenges

1. **Limited Mobile Experience:** Despite Unraid 7.2's responsive web UI, users still face limitations including:
   - No native push notifications for critical alerts
   - Suboptimal performance on mobile browsers
   - Need for VPN/remote access setup complexity
   - Lack of offline data caching
   - No biometric authentication support

2. **Delayed Issue Response:** Server administrators often discover critical issues (disk failures, high resource usage, Docker container crashes) only when they manually check the web interface, leading to prolonged downtime.

3. **Fragmented Third-Party Solutions:** Existing apps like ControlR and unMobile are either paid, feature-limited, or lack comprehensive API coverage.

4. **Monitoring Gaps:** Users running multiple Unraid servers need a unified monitoring solution that consolidates alerts and status information.

### User Pain Points (from research)

- "I've been dying for the mobile browser interface" - highlighting years of frustration with mobile access
- "I only became aware of failures when I happened to check the web interface"
- "There's no way someone would want to add a new SSD to their cache pool" - existing apps make assumptions about mobile use cases

---

## Product Vision & Goals

### Vision Statement

To become the definitive mobile companion for Unraid server administration, providing real-time visibility, proactive alerting, and seamless management capabilities that enable users to maintain optimal server health from anywhere.

### Primary Goals

1. **Comprehensive Monitoring:** Provide real-time insights into all critical server metrics (CPU, RAM, disk usage, temperatures, network, array status)
2. **Proactive Alerting:** Deliver instant push notifications for critical events (disk failures, high resource usage, security alerts)
3. **Essential Management:** Enable core management operations (start/stop array, Docker container management, VM controls)
4. **Superior UX:** Deliver a mobile-native experience that outperforms web interfaces through intuitive design and optimized performance
5. **Multi-Server Support:** Allow monitoring and management of multiple Unraid servers from a single app

### Secondary Goals

- Build an engaged community of contributors (open-source approach)
- Establish integration ecosystem with popular monitoring tools (Grafana, Prometheus)
- Achieve 90%+ feature parity with Unraid Connect's monitoring capabilities

---

## Target Audience & User Personas

### Primary Audience

**Demographics:**
- Home lab enthusiasts and self-hosters
- IT professionals managing personal/small business servers
- Media server administrators (Plex, Jellyfin users)
- Tech-savvy individuals running Unraid OS v6.12+

**Technical Proficiency:** Intermediate to Advanced
- Comfortable with server administration concepts
- Familiar with Docker and virtualization
- Understanding of networking basics

### User Personas

#### Persona 1: "The Remote Administrator"
**Name:** Alex Chen  
**Age:** 32  
**Role:** Software Developer  
**Background:** Runs a home Unraid server with 20+ Docker containers, multiple VMs, and 40TB storage  

**Goals:**
- Monitor server health during work hours
- Quickly restart crashed containers without logging into desktop
- Receive immediate alerts for disk issues
- Check storage capacity before downloading large files

**Pain Points:**
- Can't easily check server status while away from home
- Missed a disk failure that corrupted data
- VPN setup is cumbersome for quick checks

**Mobile Usage:** iPhone 15 Pro, checks app 5-10 times daily

---

#### Persona 2: "The Multi-Server Manager"
**Name:** Sarah Rodriguez  
**Age:** 45  
**Role:** Small Business IT Manager  
**Background:** Manages 3 Unraid servers across different locations for business operations  

**Goals:**
- Monitor all servers from single dashboard
- Receive consolidated alerts
- Perform emergency maintenance remotely
- Generate status reports for stakeholders

**Pain Points:**
- Logging into multiple web interfaces is time-consuming
- Misses critical alerts when off-site
- Needs proof of uptime for SLA compliance

**Mobile Usage:** Android (Samsung Galaxy S24), uses app throughout workday

---

#### Persona 3: "The Media Enthusiast"
**Name:** Mike Thompson  
**Age:** 28  
**Role:** Photographer/Content Creator  
**Background:** Uses Unraid for media storage, Plex streaming, and photo backup (12TB array)  

**Goals:**
- Ensure Plex is running smoothly
- Monitor storage for upcoming photo shoots
- Quick restart of media services when family reports issues
- Track bandwidth usage

**Pain Points:**
- Family complains about buffering but doesn't know what's wrong
- Runs out of storage unexpectedly
- Can't troubleshoot while traveling

**Mobile Usage:** iPad Pro + iPhone, checks app 2-3 times daily

---

## Product Scope

### In Scope (MVP - Phase 1)

#### Core Monitoring Features
- **System Dashboard:** Real-time CPU, RAM, network, disk I/O, temperatures
- **Array Status:** Disk health, parity status, array state (started/stopped)
- **Storage Overview:** Capacity, usage per disk/share, cache pool status
- **Docker Monitoring:** Container list, status, resource usage
- **VM Monitoring:** VM list, status, resource allocation
- **Notifications:** System-generated alerts from Unraid server

#### Essential Management
- **Array Operations:** Start/stop array, spin disks up/down
- **Docker Management:** Start, stop, restart containers
- **VM Management:** Start, stop, pause VMs
- **Quick Actions:** Predefined shortcuts for common tasks

#### User Experience
- **Multi-Server Support:** Add/manage up to 5 servers
- **Authentication:** API key-based authentication with biometric unlock
- **Push Notifications:** Critical alerts (disk failures, high temps, service down)
- **Offline Mode:** Cache last known state for viewing
- **Dark/Light Mode:** System theme support

#### Technical Foundation
- **API Integration:** Full GraphQL API integration using Unraid API v4.0+
- **Cross-Platform:** iOS 14+ and Android 8+ support
- **Secure Storage:** Encrypted API key storage
- **Error Handling:** Comprehensive error states and retry mechanisms

### Out of Scope (MVP)

**Phase 2+ Features:**
- Advanced VM/Docker operations (create, delete, configure)
- Plugin management
- User/share management
- File browser/upload capabilities
- Advanced analytics and historical graphs
- Parity check initiation and detailed progress
- Network configuration changes
- Flash backup management
- Integration with third-party monitoring (Grafana, Prometheus)
- Custom dashboard widgets
- Scheduled actions
- SSH terminal access
- Log viewer

**Explicitly Excluded:**
- Direct file access/management (security concerns)
- Full WebGUI replacement
- Plugin installation/removal
- BIOS-level operations
- Initial Unraid setup/configuration
- License management/purchase

---

## Core Features & Functionality

### Feature 1: Real-Time System Dashboard

**Description:** A comprehensive overview displaying critical server metrics at a glance.

**Components:**
- **Header:** Server name, status indicator (online/offline), last update timestamp
- **System Metrics Cards:**
  - CPU: Usage percentage, per-core breakdown, temperature
  - RAM: Used/Total, percentage, cache breakdown
  - Network: Upload/download speeds, total transferred
  - Uptime: Server uptime, last reboot time
- **Quick Stats:** Active containers, running VMs, array status
- **Pull-to-Refresh:** Manual refresh capability
- **Auto-Refresh:** Configurable intervals (15s, 30s, 1m, 5m)

**GraphQL Queries Used:**
```graphql
query SystemDashboard {
  info {
    os { uptime, release }
    cpu { manufacturer, brand, cores, usage, temp }
    mem { total, used, free, cache }
    network { interface, rx_bytes, tx_bytes, speed }
  }
  array { state, status }
  dockerContainers { id, state }
  vms { id, state }
}
```

**User Interaction:**
1. User opens app → Dashboard loads
2. Real-time metrics display with visual indicators
3. Tap metric card → Detailed view with history
4. Pull down → Manual refresh
5. Status issues → Visual alerts with quick action buttons

**Success Criteria:**
- Dashboard loads in < 2 seconds on 4G
- Updates every 30 seconds (configurable)
- Offline cached data displays when no connection
- Clear visual hierarchy guides attention to issues

---

### Feature 2: Array Management & Storage Monitoring

**Description:** Complete visibility into storage array health with essential control operations.

**Components:**
- **Array Overview:**
  - State: Started/Stopped
  - Parity status: Valid/Invalid/Sync in progress
  - Total capacity: Used/Free/Total across all disks
- **Disk List:**
  - Per-disk view: Name, size, usage %, temperature, status
  - Color-coded health indicators (green/yellow/red)
  - SMART status integration
- **Cache Pools:**
  - Multiple pool support
  - Usage statistics per pool
- **Shares:**
  - User shares list with size/usage
- **Controls:**
  - Start/Stop Array (with confirmation)
  - Spin Up/Down individual disks
  - View parity check status/history

**GraphQL Queries:**
```graphql
query ArrayStatus {
  array {
    state
    capacity { disks { total, used, free } }
    disks {
      name, size, status, temp, type
      smart { status, temperature }
    }
    parity { status, progress, errors }
  }
  shares {
    name, size, useCache, allocator
  }
}

mutation StartArray {
  arrayStart
}

mutation StopArray {
  arrayStop
}
```

**User Stories:**
- As a user, I want to see all disk temperatures at a glance so I can identify overheating issues
- As a user, I want to start/stop my array remotely for maintenance
- As a user, I want push notifications when disk usage exceeds 85%
- As a user, I want to see parity check progress without logging into WebGUI

**UI/UX Considerations:**
- Color-coded disk health (green=healthy, yellow=warning, red=critical)
- Confirmation dialogs for destructive actions (stop array)
- Loading states during array start (can take 30+ seconds)
- Offline mode: Display last known state with timestamp

---

### Feature 3: Docker Container Management

**Description:** Monitor and control Docker containers with detailed resource visibility.

**Components:**
- **Container List:**
  - Name, image, status (running/stopped/paused)
  - Autostart indicator
  - Resource usage: CPU %, RAM usage
  - Network stats
- **Container Details:**
  - Full status information
  - Port mappings
  - Volume mounts
  - Environment variables (view-only)
  - Logs (last 100 lines)
- **Actions:**
  - Start/Stop/Restart container
  - View logs
  - Quick access to container's WebUI (if available)
- **Filters:**
  - Show all/running/stopped
  - Sort by: Name, status, CPU, RAM

**GraphQL Queries:**
```graphql
query DockerContainers {
  dockerContainers {
    id
    names
    image
    state
    status
    autoStart
    ports { privatePort, publicPort, type }
    mounts { source, destination, mode }
    networks { name, ipAddress }
  }
}

mutation StartContainer($id: ID!) {
  dockerContainerStart(id: $id)
}

mutation StopContainer($id: ID!) {
  dockerContainerStop(id: $id)
}

mutation RestartContainer($id: ID!) {
  dockerContainerRestart(id: $id)
}
```

**User Stories:**
- As a user, I want to restart my Plex container when it becomes unresponsive
- As a user, I want to see which containers are consuming excessive CPU
- As a user, I want to quickly access container logs to troubleshoot issues
- As a user, I want push notifications when a critical container stops unexpectedly

**Priority Containers Detection:**
- Allow users to "favorite" critical containers
- Show favorites at top of list
- Enhanced notifications for favorited containers

---

### Feature 4: Virtual Machine Management

**Description:** Monitor and control VMs with resource allocation visibility.

**Components:**
- **VM List:**
  - Name, status (running/stopped/paused)
  - OS type and icon
  - Autostart status
  - Resource allocation: vCPUs, RAM
- **VM Details:**
  - Current resource usage
  - Disk usage
  - Network configuration
  - VNC/graphics info
- **Actions:**
  - Start/Stop/Pause/Resume VM
  - Force stop (with warning)
- **Filters:**
  - Show all/running/stopped
  - Sort by: Name, status, resource usage

**GraphQL Queries:**
```graphql
query VirtualMachines {
  vms {
    id
    name
    state
    autostart
    vcpus
    memory
    os_type
    disks { device, size, usage }
    network { bridge, mac }
  }
}

mutation StartVM($id: ID!) {
  vmStart(id: $id)
}

mutation StopVM($id: ID!) {
  vmStop(id: $id)
}
```

**User Stories:**
- As a user, I want to start my Windows VM remotely before RDP access
- As a user, I want to force stop a frozen VM
- As a user, I want to see if my VM has sufficient resources allocated
- As a user, I want notifications when VMs fail to start

---

### Feature 5: Push Notifications System

**Description:** Proactive alerting system for critical server events.

**Notification Categories:**

1. **Critical (Immediate):**
   - Disk failure/disabled
   - Array stopped unexpectedly
   - Parity check errors
   - Server offline/unreachable
   - High temperature warnings (>70°C)

2. **Warning (High Priority):**
   - Disk usage >85%
   - High CPU usage (>90% for 5+ min)
   - High RAM usage (>90%)
   - Container crashed (auto-restart failed)
   - VM stopped unexpectedly

3. **Info (Normal Priority):**
   - Parity check completed
   - Array started/stopped (manual)
   - Container/VM state changes (manual)
   - Plugin updates available
   - Server updates available

**Components:**
- **Notification Center:** In-app list of all notifications
- **Settings:** Per-category notification toggles
- **Do Not Disturb:** Quiet hours configuration
- **Multi-Server:** Separate notification channels per server
- **Actions:** Quick actions from notifications (e.g., "View Details", "Restart Container")

**Implementation:**
- Firebase Cloud Messaging (FCM) for both iOS/Android
- WebSocket connection for real-time updates when app is open
- Notification polling fallback (configurable interval)
- Badge counts for unread alerts

**User Stories:**
- As a user, I want immediate alerts when a disk fails so I can take action
- As a user, I want to customize which notifications I receive
- As a user, I want quiet hours so I don't get alerts at night
- As a user, I want to tap a notification and go directly to the relevant screen

---

### Feature 6: Multi-Server Management

**Description:** Manage multiple Unraid servers from a single app.

**Components:**
- **Server List:**
  - Server cards showing name, IP/hostname, status
  - Quick status indicators (all green/issues present)
  - Add/edit/remove servers
- **Server Configuration:**
  - Friendly name
  - Connection details (IP/hostname, port)
  - API key management
  - Test connection
  - SSL certificate validation
- **Server Switcher:**
  - Quick switch between servers
  - Dashboard shows current server
  - Notifications tagged by server

**Data Storage:**
- Encrypted local storage for API keys
- Server configurations stored locally
- Biometric authentication required for access

**User Stories:**
- As a user, I want to add my home and office servers
- As a user, I want to see a consolidated view of all servers' health
- As a user, I want server-specific notifications clearly labeled
- As a user, I want quick switching between servers without re-authentication

---

### Feature 7: Settings & Configuration

**Description:** App-level configuration and preferences.

**Settings Categories:**

1. **Servers:**
   - Add/edit/remove servers
   - Set default server
   - Connection test

2. **Notifications:**
   - Enable/disable per category
   - Quiet hours (start/end time)
   - Notification sounds
   - Badge counts

3. **Display:**
   - Theme: System/Light/Dark
   - Refresh interval: 15s/30s/1m/5m/Manual
   - Temperature units: Celsius/Fahrenheit
   - Data units: Binary (GiB)/Decimal (GB)

4. **Security:**
   - Biometric authentication toggle
   - Auto-lock timeout
   - API key visibility toggle
   - Clear cached data

5. **About:**
   - App version
   - API version compatibility
   - Open source licenses
   - Documentation links
   - Feedback/support

**User Stories:**
- As a user, I want to enable Face ID so I don't enter credentials repeatedly
- As a user, I want to set quiet hours so alerts don't wake me
- As a user, I want to choose dark mode to reduce eye strain
- As a user, I want to verify my API connection is working

---

## Technical Specifications

### Technology Stack

#### Mobile Framework
**Flutter 3.24+**
- **Rationale:** Single codebase for iOS/Android, excellent performance, rich widget library, strong community
- **State Management:** Riverpod (reactive, testable, scalable)
- **Navigation:** go_router (declarative routing, deep linking support)

#### API Integration
- **GraphQL Client:** graphql_flutter
- **HTTP Client:** dio (advanced features, interceptors, error handling)
- **WebSocket:** web_socket_channel (real-time updates)

#### Data & Storage
- **Local Database:** sqflite (structured data, query support) or Hive (lightweight, fast)
- **Secure Storage:** flutter_secure_storage (API keys, credentials)
- **Caching:** dio_cache_interceptor (API response caching)

#### Notifications
- **Push Notifications:** firebase_messaging (FCM)
- **Local Notifications:** flutter_local_notifications

#### UI/UX
- **Charts:** fl_chart (performance graphs, historical data)
- **Icons:** Material Icons + custom Unraid icons
- **Animations:** Flutter's built-in animation framework
- **Biometrics:** local_auth (Face ID, Touch ID, fingerprint)

#### Developer Tools
- **Error Tracking:** Sentry
- **Analytics:** Firebase Analytics (optional, privacy-focused)
- **Testing:** flutter_test, mockito, integration_test

### Architecture Pattern

**MVVM (Model-View-ViewModel)** with Clean Architecture principles

```
lib/
├── core/
│   ├── constants/
│   ├── error/
│   ├── network/
│   └── utils/
├── data/
│   ├── models/
│   ├── repositories/
│   └── datasources/
│       ├── remote/ (API calls)
│       └── local/ (Database)
├── domain/
│   ├── entities/
│   ├── repositories/ (interfaces)
│   └── usecases/
├── presentation/
│   ├── screens/
│   ├── widgets/
│   └── providers/ (Riverpod)
└── main.dart
```

**Benefits:**
- Clear separation of concerns
- Highly testable
- Scalable for future features
- Easier team collaboration

### API Integration Details

#### Authentication Flow
1. User inputs server URL and API key
2. App validates format
3. Test connection via GraphQL health query
4. Store encrypted credentials in secure storage
5. All subsequent requests include `x-api-key` header
6. Handle token expiration/rotation

#### Error Handling Strategy
- **Network Errors:** Retry with exponential backoff (3 attempts)
- **API Errors:** Parse GraphQL errors, display user-friendly messages
- **Timeout:** 30s default, configurable per query type
- **Offline Mode:** Catch exceptions, display cached data with indicator

#### Real-Time Updates
- **Primary:** GraphQL subscriptions (if supported by Unraid API)
- **Fallback:** Polling at configurable intervals
- **WebSocket:** For instant notifications when app is active
- **Push Notifications:** For alerts when app is backgrounded/closed

### Supported Unraid Versions

**Minimum:** Unraid OS v6.12.x (with Unraid Connect plugin installed)  
**Recommended:** Unraid OS v7.2+ (native API integration)  
**API Version:** Unraid API v4.0+

**Version Detection:**
- Query API version on connection
- Display compatibility warnings
- Feature gating for version-specific capabilities

### Platform Requirements

**iOS:**
- iOS 14.0+
- iPhone, iPad, iPod touch support
- Optimized for latest iOS versions

**Android:**
- Android 8.0 (API 26)+
- Phone and tablet layouts
- Material Design 3 compliance

### Performance Requirements

- **App Launch:** < 3 seconds to dashboard
- **API Requests:** < 2 seconds on 4G
- **Dashboard Refresh:** < 1 second
- **Memory Usage:** < 150MB typical
- **Battery Impact:** Minimal (< 5% over 8 hours with background refresh)
- **Offline Support:** Last 24 hours of data cached

### Security Requirements

1. **API Key Protection:**
   - Stored in platform keychain (iOS) / Android Keystore
   - Never logged or displayed unmasked
   - Encrypted at rest

2. **Communication:**
   - HTTPS/WSS only (TLS 1.2+)
   - Certificate validation
   - Optional self-signed cert support (with warning)

3. **Authentication:**
   - Biometric unlock (opt-in)
   - Auto-lock after inactivity
   - No credential storage in memory longer than needed

4. **Data Privacy:**
   - No telemetry without user consent
   - Local-only data storage
   - GDPR/privacy compliance

---

## User Stories

### Epic 1: Server Connection & Setup

**US-1.1:** As a new user, I want to add my first Unraid server by entering its IP and API key so I can start monitoring it  
**Acceptance Criteria:**
- Input fields for server name, IP/hostname, port, API key
- Connection test validates credentials
- Success message and redirect to dashboard
- Error messages for invalid inputs/failed connection

**US-1.2:** As a user, I want the app to auto-discover Unraid servers on my local network so I don't need to manually enter IPs  
**Acceptance Criteria:**
- Scan local network for Unraid servers (mDNS/Bonjour)
- Display list of discovered servers
- One-tap selection to add server

**US-1.3:** As a user with multiple servers, I want to add and switch between them easily  
**Acceptance Criteria:**
- Server switcher accessible from top navigation
- Visual indication of current server
- No re-authentication required when switching

---

### Epic 2: System Monitoring

**US-2.1:** As a user, I want to see real-time CPU and RAM usage so I know if my server is overloaded  
**Acceptance Criteria:**
- Dashboard shows CPU % and per-core breakdown
- RAM shows used/total with visual bar
- Updates every 30 seconds
- Color-coded warnings (yellow >80%, red >95%)

**US-2.2:** As a user, I want to monitor disk temperatures to prevent overheating  
**Acceptance Criteria:**
- Temperature displayed per disk in Celsius/Fahrenheit
- Warning indicator if temp >60°C
- Critical alert if temp >70°C
- Notification sent for sustained high temps

**US-2.3:** As a user, I want to see network upload/download speeds to identify bandwidth issues  
**Acceptance Criteria:**
- Current speeds displayed in Mbps/MB/s
- Total data transferred (session/all-time)
- Per-interface breakdown if multiple NICs

**US-2.4:** As a user, I want to view historical performance graphs to identify trends  
**Acceptance Criteria:**
- 1h/6h/24h/7d/30d time ranges
- Line graphs for CPU, RAM, network, disk I/O
- Pinch-to-zoom and pan support
- Export graph as image

---

### Epic 3: Array & Storage Management

**US-3.1:** As a user, I want to start my array remotely before accessing shares  
**Acceptance Criteria:**
- "Start Array" button visible when array is stopped
- Confirmation dialog with estimated time
- Progress indicator during startup
- Success notification when complete

**US-3.2:** As a user, I want to see which disks are nearing capacity so I can plan upgrades  
**Acceptance Criteria:**
- Disk list sorted by usage %
- Visual indicators at 75%, 85%, 95% thresholds
- Projected "days until full" calculation
- Tap disk for detailed usage by share

**US-3.3:** As a user, I want notifications when a disk fails so I can replace it immediately  
**Acceptance Criteria:**
- Push notification within 1 minute of failure detection
- Notification includes disk ID and bay number
- "View Details" action opens array status
- Critical priority (bypasses quiet hours)

**US-3.4:** As a user, I want to monitor parity check progress during scheduled checks  
**Acceptance Criteria:**
- Progress bar showing % complete
- Estimated time remaining
- Current speed (MB/s)
- Errors count (should be 0)
- Pause/resume capability (future)

---

### Epic 4: Docker Management

**US-4.1:** As a user, I want to restart a crashed Docker container to restore service  
**Acceptance Criteria:**
- Container list shows status (green=running, red=stopped)
- Tap container → "Restart" button
- Confirmation for containers with volumes
- Toast notification on success/failure

**US-4.2:** As a user, I want to see which containers are using excessive resources  
**Acceptance Criteria:**
- Sort containers by CPU or RAM usage
- Visual bars for resource consumption
- Warning indicator if using >80% of allocated resources
- Tap to view detailed metrics

**US-4.3:** As a user, I want to view container logs to troubleshoot issues  
**Acceptance Criteria:**
- Last 100/500/1000 lines selectable
- Auto-scroll to bottom
- Search/filter capability
- Copy log text
- Refresh to update

**US-4.4:** As a user, I want to quickly access a container's web interface  
**Acceptance Criteria:**
- Detect if container has WebUI port mapping
- "Open WebUI" button opens in-app browser or external
- Handle authentication if required

---

### Epic 5: VM Management

**US-5.1:** As a user, I want to start my Windows VM before initiating RDP  
**Acceptance Criteria:**
- VM list shows status and resource allocation
- "Start" button with estimated boot time
- Progress indicator during startup
- Notification when VM is ready

**US-5.2:** As a user, I want to force stop a frozen VM  
**Acceptance Criteria:**
- "Force Stop" option in VM menu
- Warning dialog explaining data loss risk
- Requires confirmation
- Success notification

**US-5.3:** As a user, I want to see VM resource usage to optimize allocation  
**Acceptance Criteria:**
- Current CPU/RAM usage vs. allocated
- Disk I/O metrics
- Network usage
- Utilization trend over time

---

### Epic 6: Notifications & Alerts

**US-6.1:** As a user, I want push notifications for disk failures even when the app is closed  
**Acceptance Criteria:**
- Background FCM listener active
- Notification displays within 60 seconds
- Tap notification opens relevant screen
- Works on iOS and Android

**US-6.2:** As a user, I want to configure quiet hours so I don't get alerts at night  
**Acceptance Criteria:**
- Set start/end times in settings
- Option to allow critical alerts (disk failures) to bypass
- Timezone-aware
- Visual indicator when DND is active

**US-6.3:** As a user, I want to see a history of all notifications  
**Acceptance Criteria:**
- In-app notification center
- Grouped by date
- Filter by category (critical/warning/info)
- Mark as read/unread
- Clear all option

**US-6.4:** As a user, I want different notification sounds for different alert types  
**Acceptance Criteria:**
- Sound picker per category
- Preview sound before saving
- Option for silent with vibration
- Separate settings for iOS/Android system sounds

---

### Epic 7: Multi-Server Management

**US-7.1:** As a user managing multiple servers, I want a unified dashboard showing all servers' health  
**Acceptance Criteria:**
- Grid/list view of all servers
- Status indicator per server (all green / warnings / critical)
- Key metrics summary (online/offline, disk usage, container status)
- Tap to switch to detailed dashboard

**US-7.2:** As a user, I want notifications clearly labeled by server  
**Acceptance Criteria:**
- Notification includes server name
- Different notification channels per server (Android)
- Filter notifications by server
- Server-specific notification settings

---

### Epic 8: Settings & Customization

**US-8.1:** As a user, I want to enable biometric authentication for security  
**Acceptance Criteria:**
- Toggle in settings
- Face ID/Touch ID/Fingerprint support
- Fallback to passcode if biometric fails
- Auto-lock after 5/15/30/60 minutes

**US-8.2:** As a user, I want to choose my preferred theme (dark/light)  
**Acceptance Criteria:**
- System default / Light / Dark options
- Instant theme switching
- Persists across app restarts
- Applies to all screens

**US-8.3:** As a user, I want to adjust auto-refresh intervals to save battery  
**Acceptance Criteria:**
- Options: 15s, 30s, 1m, 5m, Manual only
- Separate settings for foreground/background
- Disable background refresh option
- Battery impact warning for aggressive intervals

---

## Non-Functional Requirements

### Performance

- **Response Time:**
  - API calls: < 2 seconds on 4G LTE
  - Screen transitions: < 300ms
  - Dashboard refresh: < 1 second
  
- **Throughput:**
  - Support 100+ Docker containers without lag
  - Handle 24+ disk arrays
  - 10+ VMs performance

- **Scalability:**
  - Up to 5 servers per user (MVP)
  - Expandable to 20+ in future

### Reliability

- **Availability:**
  - App should function offline with cached data
  - Graceful degradation when server unreachable
  - 99.9% crash-free rate

- **Error Handling:**
  - All API errors handled gracefully
  - User-friendly error messages
  - Auto-retry for transient failures
  - Offline queue for mutations

### Usability

- **Accessibility:**
  - WCAG 2.1 Level AA compliance
  - Screen reader support
  - Minimum touch target: 44x44 points (iOS) / 48x48 dp (Android)
  - Color blindness-friendly palettes

- **Learnability:**
  - First-time user completes setup in < 5 minutes
  - Contextual help tooltips
  - Onboarding flow for new users

- **User Satisfaction:**
  - App Store rating target: 4.5+
  - NPS score: 50+

### Security

- **Authentication:**
  - API key validation before storage
  - Encrypted credential storage (AES-256)
  - Biometric authentication option
  - Auto-lock after inactivity

- **Data Protection:**
  - TLS 1.2+ for all network communication
  - Certificate pinning for production servers
  - No sensitive data in logs
  - Secure deletion of cached data

- **Privacy:**
  - No analytics without explicit consent
  - Local-only data storage
  - No third-party data sharing
  - GDPR/CCPA compliant

### Maintainability

- **Code Quality:**
  - 80%+ code coverage (unit + integration tests)
  - Linting: flutter_lints (strict)
  - Code review required for all PRs
  - Automated CI/CD pipeline

- **Documentation:**
  - Inline code comments for complex logic
  - API integration documentation
  - Architecture decision records (ADRs)
  - User-facing help documentation

### Compatibility

- **OS Versions:**
  - iOS: 14.0 - 18.x
  - Android: 8.0 (API 26) - 15 (API 35)

- **Unraid Versions:**
  - Minimum: 6.12.x (with plugin)
  - Recommended: 7.2+
  - API Version: v4.0+

- **Devices:**
  - Phones: 4.7" - 6.9" screens
  - Tablets: iPad, Android tablets (adaptive layouts)
  - Orientations: Portrait (primary), Landscape (supported)

### Localization

- **MVP Languages:** English only
- **Future:** Spanish, German, French, Simplified Chinese
- **Considerations:**
  - RTL language support architecture
  - Date/time formatting per locale
  - Number formatting (decimal vs. comma)

---

## Success Metrics

### Key Performance Indicators (KPIs)

#### Adoption Metrics
- **Downloads:** 5,000 in first 3 months
- **Active Users (DAU):** 1,500 after 6 months
- **Retention:** 60% 7-day retention, 40% 30-day retention
- **Server Connections:** Average 1.5 servers per user

#### Engagement Metrics
- **Session Frequency:** 3+ sessions per day per active user
- **Session Duration:** Average 2-3 minutes
- **Feature Usage:**
  - Dashboard views: 80% of sessions
  - Docker management: 40% of sessions
  - Notifications engaged: 70% click-through rate

#### Quality Metrics
- **Crash Rate:** < 0.5%
- **API Error Rate:** < 2%
- **App Store Rating:** 4.5+ stars
- **Load Time:** 90th percentile < 3 seconds

#### Support Metrics
- **GitHub Issues:** < 10 open bugs at any time
- **Response Time:** < 48 hours for critical issues
- **Community Contributions:** 5+ external contributors in first year

### Success Criteria (MVP Launch)

**Must Have (P0):**
- ✅ App available on iOS App Store and Google Play
- ✅ 0 critical bugs at launch
- ✅ Core monitoring (dashboard, array, Docker, VMs) functional
- ✅ Push notifications working
- ✅ Multi-server support (up to 5 servers)
- ✅ Passes Apple/Google review guidelines

**Should Have (P1):**
- 📊 Initial 500 downloads in first week
- 👥 50+ active beta testers providing feedback
- ⭐ 4.0+ average rating after first 100 reviews
- 📱 < 1% crash rate in production

**Nice to Have (P2):**
- 🎯 Featured in Unraid forums/newsletter
- 🔗 Integration with Unraid Connect (official endorsement)
- 📈 10% month-over-month user growth

### Monitoring & Analytics

**Technical Monitoring:**
- Firebase Crashlytics (crash reporting)
- Sentry (error tracking)
- Custom API performance metrics

**User Analytics (Opt-In):**
- Firebase Analytics (basic usage patterns)
- Screen view tracking
- Feature usage frequency
- User flow analysis

**Privacy-First Approach:**
- All analytics opt-in
- No PII collected
- Anonymized device identifiers
- Local-only data by default

---

## Timeline & Milestones

### Phase 1: MVP Development (Months 1-4)

#### Month 1: Foundation & Setup
**Week 1-2:**
- ✅ Project setup (Flutter, dependencies)
- ✅ Repository structure and CI/CD pipeline
- ✅ Design system and UI components library
- ✅ Unraid API client implementation

**Week 3-4:**
- ✅ Authentication flow (API key entry, validation)
- ✅ Server configuration and management
- ✅ Encrypted storage implementation
- ✅ Basic navigation structure

#### Month 2: Core Features
**Week 5-6:**
- 📊 Dashboard implementation (system metrics)
- 📊 Array status and disk monitoring
- 📊 Real-time data updates
- 📊 Pull-to-refresh and auto-refresh

**Week 7-8:**
- 🐳 Docker container list and details
- 🐳 Container management (start/stop/restart)
- 💻 VM list and details
- 💻 VM management (start/stop)

#### Month 3: Notifications & Polish
**Week 9-10:**
- 🔔 Push notification setup (FCM)
- 🔔 Notification center UI
- 🔔 Alert categories and settings
- 🔔 Quiet hours implementation

**Week 11-12:**
- 🎨 Dark/light theme implementation
- 🎨 Settings screen completion
- 🎨 Multi-server UI
- 🧪 Comprehensive testing (unit + integration)

#### Month 4: Beta & Launch Prep
**Week 13-14:**
- 🐛 Bug fixes from internal testing
- 📝 Documentation (user guide, API docs)
- 🧪 Beta release (TestFlight + Google Play Beta)
- 👥 Gather beta tester feedback

**Week 15-16:**
- 🔧 Address beta feedback
- ✅ App Store / Play Store submission preparation
- 📄 Privacy policy and terms of service
- 🚀 **MVP Launch**

### Phase 2: Enhancement & Growth (Months 5-8)

**Month 5-6:**
- 📊 Historical performance graphs
- 📈 Advanced analytics
- 🔍 Enhanced search and filtering
- 🏷️ Container/VM favoriting and tagging

**Month 7-8:**
- 🔌 Plugin status monitoring
- 📋 Parity check management
- 🗂️ User/share details (read-only)
- 🌐 Localization (Spanish, German)

### Phase 3: Advanced Features (Months 9-12)

**Month 9-10:**
- 🔧 Advanced Docker operations (logs, exec)
- 📁 Basic file browser (read-only)
- 🔗 Grafana/Prometheus integration
- 📊 Custom dashboard widgets

**Month 11-12:**
- 🤖 Automation/scheduled actions
- 💾 Flash backup viewing
- 🔐 Multi-user support
- 📱 Tablet-optimized layouts

---

## Open Questions & Future Considerations

### Open Questions (Require Research/Decision)

1. **Unraid API Limitations:**
   - ❓ Does the API support GraphQL subscriptions for real-time updates, or is polling required?
   - ❓ What is the rate limiting policy for the API?
   - ❓ Are there any undocumented API endpoints needed for full feature parity?

2. **Push Notification Architecture:**
   - ❓ Should we build a separate notification relay server, or can we poll the Unraid API directly?
   - ❓ How do we handle push notifications for users with no public IP (behind CGNAT)?
   - ❓ What's the optimal polling interval for background notifications without draining battery?

3. **Offline Mode:**
   - ❓ How much historical data should we cache locally?
   - ❓ Should we allow offline management operations (queued for execution when online)?

4. **Multi-Server Scalability:**
   - ❓ Should we set a hard limit on number of servers, or make it configurable?
   - ❓ How do we handle performance with 10+ servers polling simultaneously?

5. **Monetization (if applicable):**
   - ❓ Keep 100% free and open-source?
   - ❓ Freemium model (e.g., max 2 servers free, unlimited via IAP)?
   - ❓ Donation model with premium features as "thank you"?

### Future Considerations

#### Feature Enhancements
- **Widgets:** iOS/Android home screen widgets showing server status
- **Siri/Google Assistant:** Voice commands ("Hey Siri, restart my Plex container")
- **Wear OS/watchOS:** Apple Watch/Android watch complications
- **Shortcuts Integration:** iOS Shortcuts automation support
- **Tasker Integration:** Android automation via Tasker
- **Custom Alerts:** User-defined alert conditions and thresholds
- **Historical Analytics:** Long-term performance trend analysis
- **Backup/Restore:** App configuration backup to cloud

#### Integrations
- **Unraid Connect:** Deep integration with official platform
- **Monitoring Tools:** Grafana, Prometheus, InfluxDB dashboards
- **Notification Services:** Ntfy, Pushover, Slack, Discord webhooks
- **Home Automation:** Home Assistant, HomeBridge integrations
- **VPN:** Tailscale, WireGuard auto-configuration

#### Technical Improvements
- **WebSocket Support:** Real-time bidirectional communication
- **Offline Mutations:** Queue operations when offline, sync when reconnected
- **Optimistic Updates:** Instant UI feedback for mutations
- **Background Sync:** Smart background refresh based on usage patterns
- **Crash Analytics:** Opt-in detailed crash reporting
- **A/B Testing:** Feature flag system for gradual rollouts

#### Platform Expansion
- **Web App:** PWA for desktop browsers
- **Desktop Apps:** Electron/Tauri apps for Windows/macOS/Linux
- **Browser Extension:** Chrome/Firefox extension for quick access
- **CLI Tool:** Command-line interface for power users

### Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Unraid API changes break compatibility | High | Medium | Version detection, graceful degradation, community engagement |
| Low user adoption | High | Medium | Active marketing in Unraid forums, open-source community building |
| Push notification infrastructure costs | Medium | Low | Optimize polling, consider user-hosted relay option |
| App Store/Play Store rejection | High | Low | Follow guidelines strictly, beta test thoroughly |
| Security vulnerability discovered | Critical | Low | Security audit, bug bounty program, rapid patching |
| Competitor launches similar app | Medium | Medium | Focus on superior UX, open-source advantage, feature differentiation |

---

## Appendix

### Glossary

- **Array:** Unraid's storage system combining multiple disks with parity protection
- **Cache Pool:** Fast storage (typically SSDs) for write acceleration and appdata
- **Parity:** Redundancy disk allowing recovery from single/dual disk failures
- **Docker:** Container technology for running applications
- **VM:** Virtual Machine running full operating systems
- **Share:** User-defined storage shares accessible via network protocols
- **GraphQL:** Query language for APIs, used by Unraid API
- **FCM:** Firebase Cloud Messaging for push notifications
- **API Key:** Authentication credential for Unraid API access

### References

- [Unraid API Documentation](https://docs.unraid.net/unraid-api/)
- [Unraid API GitHub Repository](https://github.com/unraid/api)
- [Flutter Documentation](https://docs.flutter.dev/)
- [Material Design 3 Guidelines](https://m3.material.io/)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

### Related Projects

- **unMobile:** Open-source Flutter app by s3ppo ([GitHub](https://github.com/s3ppo/unraid_ui))
- **ControlR:** Commercial mobile app for Unraid
- **Unraid Connect:** Official cloud companion service
- **Unraid API MCP Server:** AI agent integration ([GitHub](https://github.com/jmagar/unraid-mcp))

---

## Approval & Sign-Off

**Product Owner:** _________________________ Date: _________  
**Technical Lead:** _________________________ Date: _________  
**Design Lead:** _________________________ Date: _________  
**Stakeholder:** _________________________ Date: _________

---

**Document Version:** 1.0  
**Last Updated:** November 8, 2025  
**Next Review:** January 1, 2026

---

## Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-08 | [Your Name] | Initial PRD creation |

