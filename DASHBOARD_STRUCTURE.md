# Dashboard Structure Reference

## Component Hierarchy

```
DashboardScreen
│
├─ ScrollView (with RefreshControl)
│  │
│  ├─ Server Header Section
│  │  ├─ Server Name + Subtitle
│  │  ├─ Time Display (32px)
│  │  └─ Uptime Info
│  │
│  ├─ System Metrics Card
│  │  ├─ Card Title: "SYSTEM"
│  │  └─ 4 CircularProgress Components
│  │     ├─ RAM Usage
│  │     ├─ Flash Device
│  │     ├─ Array Storage
│  │     └─ CPU Load
│  │
│  ├─ Motherboard Card
│  │  ├─ Card Title: "MOTHERBOARD"
│  │  └─ StatItems
│  │     ├─ Manufacturer
│  │     ├─ Model
│  │     └─ Version
│  │
│  ├─ Processor Card
│  │  ├─ Card Title: "PROCESSOR"
│  │  ├─ Card Subtitle: CPU Brand
│  │  ├─ Overall Load Display
│  │  └─ Per-Core Usage
│  │     └─ Horizontal Progress Bars
│  │        ├─ CPU 0 (P-Core)
│  │        ├─ CPU 1 (P-Core)
│  │        ├─ ...
│  │        └─ CPU N (E-Core)
│  │
│  ├─ Network Interfaces Card
│  │  ├─ Card Title: "INTERFACE"
│  │  └─ Interface List
│  │     ├─ bond0
│  │     │  ├─ Speed
│  │     │  ├─ Model
│  │     │  └─ MAC
│  │     ├─ eth0
│  │     └─ ...
│  │
│  ├─ Shares Card
│  │  ├─ Card Title: "SHARES"
│  │  ├─ Card Subtitle: Share Count
│  │  └─ Share List
│  │     ├─ Share 1
│  │     │  ├─ Name + Size
│  │     │  ├─ Comment
│  │     │  └─ ProgressBar (usage)
│  │     ├─ Share 2
│  │     └─ ...
│  │
│  ├─ Array Card
│  │  ├─ Card Title: "ARRAY"
│  │  ├─ Card Subtitle: State
│  │  ├─ Overall Storage ProgressBar
│  │  ├─ StatItems (Used/Total/Free)
│  │  └─ Disk List
│  │     ├─ Disk 1
│  │     │  ├─ Name + Status
│  │     │  └─ Size + Temp
│  │     ├─ Disk 2
│  │     └─ ...
│  │
│  ├─ Unassigned Devices Card (conditional)
│  │  ├─ Card Title: "UNASSIGNED"
│  │  ├─ Table Header
│  │  │  ├─ DEVICE
│  │  │  ├─ STATUS
│  │  │  └─ TEMP
│  │  └─ Device List
│  │     ├─ Device 1
│  │     ├─ Device 2
│  │     └─ ...
│  │
│  └─ System Information Card
│     ├─ Card Title: "SYSTEM INFORMATION"
│     └─ StatItems
│        ├─ Platform
│        ├─ Kernel
│        ├─ Unraid Version
│        └─ CPU Details
```

## Visual Layout Guide

```
┌─────────────────────────────────────┐
│ 📱 TOWER                            │
│    Media server                      │
│                                      │
│    11:40 pm                         │
│    Fri 7 Nov 2025, PST              │
│                                      │
│    UPTIME                           │
│    2 hours, 28 minutes              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ SYSTEM                               │
│ Memory: 16 GiB DDR5                 │
│                                      │
│  ◯ 5%    ◯ 2%    ◯ 1%    ◯ 2%      │
│  RAM     Flash   Array   CPU        │
│  usage   device  storage load       │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ MOTHERBOARD                          │
│                                      │
│ Manufacturer: ASUSTeK COMPUTER INC.  │
│ Model: ROG STRIX B760-F GAMING WIFI │
│ Version: Rev 1.xx                   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ PROCESSOR                            │
│ 13th Gen Intel® Core™ i5-13600KF   │
│                                      │
│ Overall Load: 0%                    │
│                                      │
│ Core Usage                          │
│ CPU 0 (P-Core) ▓░░░░░░░░░░ 0%      │
│ CPU 2 (P-Core) ▓░░░░░░░░░░ 0%      │
│ CPU 4 (P-Core) ▓░░░░░░░░░░ 0%      │
│ ...                                  │
│ CPU 12 (E-Core) ▓░░░░░░░░░░ 0%     │
│ CPU 13 (E-Core) ▓░░░░░░░░░░ 1%     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ INTERFACE                            │
│                                      │
│ bond0                    1 Gbps     │
│ fault-tolerance (active-backup)     │
│ MAC: xx:xx:xx:xx:xx:xx              │
│ ─────────────────────────────────   │
│ eth0                     1 Gbps     │
│ full duplex, mtu 1500               │
│ MAC: xx:xx:xx:xx:xx:xx              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ SHARES                               │
│ Share count: 3                       │
│                                      │
│ Documents                  1.2 TB   │
│ Personal documents                   │
│ ▓▓▓▓▓▓▓░░░░░░░░░░░░░ 45%           │
│ ─────────────────────────────────   │
│ Media                      5.8 TB   │
│ Movies and TV shows                  │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░ 78%           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ARRAY                                │
│ State: STARTED                       │
│                                      │
│ Storage                              │
│ ▓▓▓░░░░░░░░░░░░░░░░░ 15.2%         │
│                                      │
│ Used: 2.5 TB  Total: 16.4 TB       │
│ Free: 13.9 TB                        │
│                                      │
│ Disks                                │
│ ─────────────────────────────────   │
│ Parity    DISK_OK    8 TB   44°C   │
│ Disk 1    DISK_OK    8 TB   42°C   │
│ Disk 2    DISK_OK    4 TB   39°C   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ UNASSIGNED                           │
│                                      │
│ DEVICE  STATUS      TEMP             │
│ ─────────────────────────────────   │
│ Dev 1   unassigned  44°C            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ SYSTEM INFORMATION                   │
│                                      │
│ Platform: Linux - Unraid            │
│ Kernel: 6.12.0-Unraid               │
│ Unraid Version: 7.0.0               │
│ CPU: 13th Gen Intel Core i5 (20)   │
└─────────────────────────────────────┘
```

## Color Code Reference

### Progress Indicators
```
Green   ━━━━━ < 75%   Normal/Good
Orange  ━━━━━ 75-90%  Warning
Red     ━━━━━ > 90%   Critical
```

### Status Colors
```
Green   ● DISK_OK       Disk operating normally
Red     ● DISK_ERROR    Disk error
Gray    ● DISK_NP       Disk not present
```

### Text Hierarchy
```
Primary   ████████  Headings, important values
Secondary ▓▓▓▓▓▓▓▓  Labels, descriptions
Tertiary  ░░░░░░░░  Metadata, timestamps
```

## Responsive Breakpoints

The dashboard uses a single-column layout optimized for mobile:

```
Mobile (320-428px)
├─ Full width cards
├─ 4 circular indicators in row
├─ Stacked information
└─ Touch-friendly spacing

Tablet (429-768px)
├─ Same layout as mobile
├─ Larger touch targets
└─ More breathing room
```

## Data Flow

```
User Opens App
      ↓
Dashboard Loads
      ↓
GraphQL Query (GET_DASHBOARD_DATA)
      ↓
┌─────────────────────────────────┐
│ Unraid Server GraphQL API       │
└─────────────────────────────────┘
      ↓
Response Received
      ↓
┌─────────────────────────────────┐
│ Parse & Transform Data          │
│ ├─ Calculate percentages        │
│ ├─ Format bytes                 │
│ ├─ Format uptime                │
│ └─ Filter unassigned devices    │
└─────────────────────────────────┘
      ↓
Render Components
      ↓
┌─────────────────────────────────┐
│ Display Dashboard               │
│ ├─ CircularProgress × 4         │
│ ├─ ProgressBar × N              │
│ ├─ StatItem × N                 │
│ └─ Cards × 10                   │
└─────────────────────────────────┘
      ↓
User Pulls to Refresh
      ↓
Re-fetch Data → Update Display
```

## State Management

```typescript
// Dashboard state is managed by Apollo Client
const { loading, error, data, refetch } = useDashboardData();

// Loading States
loading && !data → Show LoadingScreen
loading && data  → Show RefreshControl

// Error States  
error && !data  → Show ErrorMessage
error && data   → Show data + error toast

// Success State
data → Render full dashboard
```

## Component Props Flow

```
DashboardScreen
│
├─ CircularProgress
│  ├─ percentage: number (calculated)
│  ├─ label: string
│  ├─ size?: number (default 90)
│  └─ color?: string (auto if not set)
│
├─ ProgressBar
│  ├─ percentage: number (calculated)
│  ├─ label?: string
│  ├─ hideLabel?: boolean
│  └─ height?: number (default 8)
│
├─ StatItem
│  ├─ label: string
│  ├─ value: string | number
│  └─ unit?: string
│
└─ Card
   ├─ children: ReactNode
   └─ style?: ViewStyle
```

## Performance Considerations

```
Optimization Strategies:
├─ Combined GraphQL query (single request)
├─ Conditional rendering (hide empty sections)
├─ Memoized calculations (percentages)
├─ Efficient re-renders (React best practices)
└─ Pull-to-refresh (user-initiated updates)

Future Optimizations:
├─ React.memo for expensive components
├─ useMemo for complex calculations
├─ useCallback for event handlers
└─ FlatList for very long lists
```

## Accessibility Features

```
✓ High contrast colors
✓ Readable font sizes (min 11px)
✓ Clear labels and descriptions
✓ Touch-friendly tap targets (min 44px)
✓ Screen reader compatible
✓ Color is not the only indicator
```

## Error Handling Flow

```
GraphQL Query Error
      ↓
Has existing data?
      ├─ Yes → Show data + error toast
      └─ No  → Show ErrorMessage component
                    ↓
              User taps Retry
                    ↓
              refetch() called
                    ↓
              Back to normal flow
```

---

## Quick Reference

### File Locations
```
Dashboard Screen:     src/screens/dashboard-screen.tsx
Circular Progress:    src/components/ui/circular-progress.tsx
Progress Bar:         src/components/ui/progress-bar.tsx
Card:                 src/components/ui/card.tsx
Stat Item:            src/components/ui/stat-item.tsx
GraphQL Queries:      src/graphql/queries.ts
Type Definitions:     src/types/unraid.types.ts
```

### Key Functions
```typescript
calculatePercentage(used, total)  // Returns 0-100
formatBytes(bytes)                 // Returns "1.5 GB"
formatUptime(seconds)              // Returns "2 hours, 28 minutes"
```

### Important Constants
```typescript
COLORS = {
  success: '#34c759',
  warning: '#ff9500',
  error: '#ff3b30',
  info: '#007aff'
}

THRESHOLDS = {
  warning: 75,
  critical: 90
}
```

