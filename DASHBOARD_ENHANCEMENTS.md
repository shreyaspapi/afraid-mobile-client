# Dashboard Enhancements - UniFi-Inspired Design

## Overview
The mobile dashboard has been completely redesigned to include all features from the Unraid web dashboard, taking inspiration from the UniFi mobile app's clean and modern design.

## New Features Implemented

### 1. **Server Header Section**
- Real-time clock display
- Server name and type
- System uptime information
- Registration status

### 2. **System Metrics with Circular Progress Indicators**
- RAM usage with circular progress
- Flash device usage
- Array storage usage
- CPU load
- Color-coded indicators (green < 75%, orange < 90%, red ≥ 90%)

### 3. **Motherboard Information**
- Manufacturer and model details
- Board version
- Memory slot information

### 4. **Detailed Processor Section**
- Overall CPU load display
- Per-core CPU usage with visual bars
- Distinguishes between P-Cores and E-Cores
- Real-time usage percentages

### 5. **Network Interfaces Section**
- Lists all network interfaces (bond0, eth0, wlan0, etc.)
- Shows connection speed
- Displays MAC addresses
- Interface model information

### 6. **Shares Section**
- Lists all user shares
- Shows usage statistics
- Progress bars for share capacity
- Share descriptions/comments

### 7. **Enhanced Array Section**
- Overall storage capacity
- Individual disk information
- Disk temperatures
- Status indicators (color-coded)

### 8. **Unassigned Devices Section**
- Lists devices not assigned to the array
- Shows device status
- Temperature monitoring

### 9. **System Information Section**
- Platform and distribution
- Kernel version
- Unraid version
- CPU details

## Technical Changes

### New Components
- **`CircularProgress`** (`src/components/ui/circular-progress.tsx`)
  - Circular progress indicator using SVG
  - Percentage display
  - Color-coded based on usage levels
  - Customizable size and colors

### Updated Components
- **`ProgressBar`** - Added `hideLabel` prop for cleaner display in some contexts

### GraphQL Query Enhancements
Added queries for:
- Motherboard information (`baseboard`)
- Network interfaces (`devices.network`)
- System versions (`versions`)
- Shares data
- Server variables (`vars`)
- Registration information
- Boot/flash disk details
- Per-core CPU metrics with idle percentage

### Type Definitions Updated
Extended TypeScript interfaces in `unraid.types.ts`:
- `Baseboard` - Motherboard information
- `NetworkInterface` - Network interface details
- `Versions` - System version information
- `Share` - Share information
- `Vars` - System variables
- `Registration` - Registration details
- `CPUCore` - Enhanced CPU core metrics

## Installation

To complete the setup, you need to install the new dependency:

```bash
# Using pnpm (recommended)
pnpm install

# OR using npm
npm install

# OR using Expo
npx expo install
```

## Design Philosophy

The new dashboard follows these design principles inspired by the UniFi app:

1. **Clean Card-Based Layout** - Each section is contained in a clean card with proper spacing
2. **Circular Progress Indicators** - Visual at-a-glance system health
3. **Color Coding** - Consistent color scheme for status and alerts
   - Green: Good/Normal (< 75%)
   - Orange: Warning (75-90%)
   - Red: Critical (≥ 90%)
4. **Information Hierarchy** - Important info is prominent, details are accessible
5. **Dark Mode Support** - Full dark mode implementation
6. **Pull-to-Refresh** - Easy data refresh with native pull gesture

## Layout Structure

```
Dashboard
├── Server Header (Time, Name, Uptime)
├── System Metrics (4 Circular Progress Indicators)
├── Motherboard Info
├── Processor Details (Overall + Per-Core)
├── Network Interfaces
├── Shares
├── Array Status & Disks
├── Unassigned Devices
└── System Information
```

## Color Scheme

### Light Mode
- Background: `#f2f2f7`
- Cards: `#ffffff`
- Primary Text: `#000000`
- Secondary Text: `#6e6e73`

### Dark Mode
- Background: `#000000`
- Cards: `#1c1c1e`
- Primary Text: `#ffffff`
- Secondary Text: `#8e8e93`

### Status Colors
- Success/Normal: `#34c759`
- Warning: `#ff9500`
- Critical/Error: `#ff3b30`
- Info: `#007aff`

## Testing

After installation, test the following:
1. Pull-to-refresh functionality
2. Circular progress indicators display correctly
3. All sections populate with data from your Unraid server
4. Dark mode toggle works correctly
5. Scroll performance is smooth

## Future Enhancements

Potential additions:
- User management section
- Docker container quick actions
- VM management
- Real-time notifications
- Charts for historical data
- Network traffic graphs
- Disk I/O statistics

## Notes

- The dashboard will show "N/A" for any data not available from your Unraid server
- Some sections (like Shares or Unassigned Devices) will only appear if data is available
- All time displays use your device's locale settings
- Temperature displays are in Celsius

## Troubleshooting

If you encounter issues:

1. **Missing data**: Ensure your Unraid API key has proper permissions
2. **Circular progress not showing**: Make sure `react-native-svg` is installed
3. **GraphQL errors**: Verify your Unraid server is accessible and the API is enabled
4. **Type errors**: Run the codegen script to regenerate types: `pnpm run codegen`

