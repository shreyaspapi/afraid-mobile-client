/**
 * Enhanced Dashboard Screen
 * UniFi-inspired design with improved layout and visuals
 */

import { Card } from '@/src/components/ui/card';
import { CircularProgress } from '@/src/components/ui/circular-progress';
import { ErrorMessage } from '@/src/components/ui/error-message';
import { LoadingScreen } from '@/src/components/ui/loading-screen';
import { MetricCard } from '@/src/components/ui/metric-card';
import { ProgressBar } from '@/src/components/ui/progress-bar';
import { useDashboardData } from '@/src/hooks/useUnraidQuery';
import { useTheme } from '@/src/providers/theme-provider';
import { calculatePercentage, formatBytes, formatUptime } from '@/src/utils/formatters';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export function DashboardScreen() {
  const { isDark } = useTheme();
  const { loading, error, data, refetch } = useDashboardData();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    processor: true,
    network: false,
    shares: false,
    disks: true,
  });

  if (loading && !data) {
    return <LoadingScreen message="Loading system information..." />;
  }

  if (error && !data) {
    return (
      <ErrorMessage
        message={error.message || 'Failed to load system information'}
        onRetry={() => refetch()}
      />
    );
  }

  const systemInfo = data?.info;
  const arrayInfo = data?.array;
  const metrics = data?.metrics;
  const shares = data?.shares;
  const vars = data?.vars;

  // Get memory info from metrics
  const memoryInfo = metrics?.memory;
  const memoryPercentage = memoryInfo?.percentTotal || 
    (memoryInfo ? calculatePercentage(Number(memoryInfo.used), Number(memoryInfo.total)) : 0);

  // Get CPU usage from metrics
  const cpuMetrics = metrics?.cpu;
  const cpuUsage = cpuMetrics?.percentTotal || 0;

  // Calculate disk usage percentage
  const diskPercentage = arrayInfo
    ? calculatePercentage(
        Number(arrayInfo.capacity.disks.used),
        Number(arrayInfo.capacity.disks.total)
      )
    : 0;

  // Calculate flash device usage
  const flashDisk = arrayInfo?.boot;
  const flashPercentage = flashDisk?.fsSize
    ? calculatePercentage(Number(flashDisk.fsUsed), Number(flashDisk.fsSize))
    : 0;

  // Format current time
  const currentTime = systemInfo?.time ? new Date(systemInfo.time) : new Date();
  const timeString = currentTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  // Get unassigned devices
  const allDisks = arrayInfo?.disks || [];
  const unassignedDisks = allDisks.filter(disk => 
    disk.status === 'DISK_NP' || (disk.type === 'DATA' && disk.status !== 'DISK_OK')
  );

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#000000' : '#f2f2f7' },
      ]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={() => refetch()}
          tintColor={isDark ? '#007aff' : '#007aff'}
        />
      }
    >
      {/* Compact Server Header */}
      {systemInfo && (
        <View style={styles.headerSection}>
          <View style={styles.serverRow}>
            <Text style={[styles.serverName, { color: isDark ? '#ffffff' : '#000000' }]}>
              {vars?.name || systemInfo.os.hostname || 'Unraid Server'}
            </Text>
            <Text style={[styles.timeText, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
              {timeString}
            </Text>
          </View>
          {systemInfo.os.uptime !== undefined && (
            <Text style={[styles.uptimeText, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
              Uptime: {formatUptime(systemInfo.os.uptime)} • {systemInfo.os.distro || 'Unraid'} {vars?.version || ''}
            </Text>
          )}
        </View>
      )}

      {/* Quick Metrics Row */}
      {metrics && (
        <View style={styles.metricsRow}>
          <MetricCard
            label="RAM"
            value={memoryPercentage.toFixed(0)}
            unit="%"
            subtitle={memoryInfo ? formatBytes(Number(memoryInfo.used)) : ''}
            status={memoryPercentage > 90 ? 'critical' : memoryPercentage > 75 ? 'warning' : 'good'}
          />
          <MetricCard
            label="CPU"
            value={cpuUsage.toFixed(0)}
            unit="%"
            subtitle={`${systemInfo?.cpu.cores || 0} cores`}
            status={cpuUsage > 90 ? 'critical' : cpuUsage > 75 ? 'warning' : 'good'}
          />
          <MetricCard
            label="ARRAY"
            value={diskPercentage.toFixed(0)}
            unit="%"
            subtitle={arrayInfo ? formatBytes(Number(arrayInfo.capacity.disks.used)) : ''}
            status={diskPercentage > 90 ? 'critical' : diskPercentage > 75 ? 'warning' : 'good'}
          />
        </View>
      )}

      {/* System Overview with Circular Progress */}
      {metrics && (
        <Card>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
              System Overview
            </Text>
          </View>
          
          <View style={styles.circularProgressRow}>
            <CircularProgress
              percentage={memoryPercentage}
              label="RAM usage"
              size={85}
            />
            <CircularProgress
              percentage={flashPercentage}
              label="Flash"
              size={85}
            />
            <CircularProgress
              percentage={diskPercentage}
              label="Storage"
              size={85}
            />
            <CircularProgress
              percentage={cpuUsage}
              label="CPU"
              size={85}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: isDark ? '#2c2c2e' : '#e5e5ea' }]} />

          <View style={styles.statsGrid}>
            {memoryInfo && (
              <View style={styles.statColumn}>
                <Text style={[styles.statLabel, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
                  Total RAM
                </Text>
                <Text style={[styles.statValue, { color: isDark ? '#ffffff' : '#000000' }]}>
                  {formatBytes(Number(memoryInfo.total))}
                </Text>
              </View>
            )}
            {arrayInfo && (
              <View style={styles.statColumn}>
                <Text style={[styles.statLabel, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
                  Array Status
                </Text>
                <Text style={[styles.statValue, { color: '#34c759' }]}>
                  {arrayInfo.state}
                </Text>
              </View>
            )}
          </View>
        </Card>
      )}

      {/* Motherboard - Compact */}
      {systemInfo?.baseboard && (
        <Card>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
              Motherboard
            </Text>
          </View>
          <Text style={[styles.compactValue, { color: isDark ? '#ffffff' : '#000000' }]}>
            {systemInfo.baseboard.manufacturer} {systemInfo.baseboard.model}
          </Text>
          {systemInfo.baseboard.version && (
            <Text style={[styles.compactSubtext, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
              {systemInfo.baseboard.version}
            </Text>
          )}
        </Card>
      )}

      {/* Processor - Collapsible */}
      {systemInfo && cpuMetrics && (
        <Card>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('processor')}
          >
            <View>
              <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
                Processor
              </Text>
              <Text style={[styles.compactSubtext, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
                {systemInfo.cpu.brand}
              </Text>
            </View>
            <Text style={[styles.expandIcon, { color: isDark ? '#007aff' : '#007aff' }]}>
              {expandedSections.processor ? '−' : '+'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.processorSummary}>
            <Text style={[styles.loadText, { color: isDark ? '#ffffff' : '#000000' }]}>
              Load: <Text style={{ color: '#34c759' }}>{cpuUsage.toFixed(1)}%</Text>
            </Text>
          </View>

          {expandedSections.processor && cpuMetrics.cpus && cpuMetrics.cpus.length > 0 && (
            <View style={styles.coresContainer}>
              <View style={[styles.divider, { backgroundColor: isDark ? '#2c2c2e' : '#e5e5ea' }]} />
              {cpuMetrics.cpus.slice(0, 12).map((core, index) => (
                <View key={index} style={styles.coreItem}>
                  <Text style={[styles.coreLabel, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
                    CPU {index}
                  </Text>
                  <View style={styles.coreProgress}>
                    <View
                      style={[
                        styles.coreProgressBar,
                        {
                          width: `${Math.min(core.percentTotal, 100)}%`,
                          backgroundColor: core.percentTotal > 80 ? '#ff3b30' : 
                                         core.percentTotal > 50 ? '#ff9500' : '#34c759',
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.corePercentage, { color: isDark ? '#ffffff' : '#000000' }]}>
                    {core.percentTotal.toFixed(0)}%
                  </Text>
                </View>
              ))}
            </View>
          )}
        </Card>
      )}

      {/* Network Interfaces - Collapsible */}
      {systemInfo?.devices?.network && systemInfo.devices.network.length > 0 && (
        <Card>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('network')}
          >
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
              Network Interfaces ({systemInfo.devices.network.length})
            </Text>
            <Text style={[styles.expandIcon, { color: isDark ? '#007aff' : '#007aff' }]}>
              {expandedSections.network ? '−' : '+'}
            </Text>
          </TouchableOpacity>

          {expandedSections.network && (
            <View style={styles.interfacesContainer}>
              {systemInfo.devices.network.map((iface, index) => (
                <View key={index} style={styles.interfaceRow}>
                  <View style={styles.interfaceInfo}>
                    <Text style={[styles.interfaceName, { color: isDark ? '#ffffff' : '#000000' }]}>
                      {iface.iface}
                    </Text>
                    {iface.model && (
                      <Text style={[styles.interfaceDetail, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
                        {iface.model}
                      </Text>
                    )}
                  </View>
                  {iface.speed && (
                    <Text style={[styles.interfaceSpeed, { color: '#34c759' }]}>
                      {iface.speed}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </Card>
      )}

      {/* Shares - Collapsible */}
      {shares && shares.length > 0 && (
        <Card>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('shares')}
          >
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
              Shares ({shares.length})
            </Text>
            <Text style={[styles.expandIcon, { color: isDark ? '#007aff' : '#007aff' }]}>
              {expandedSections.shares ? '−' : '+'}
            </Text>
          </TouchableOpacity>

          {expandedSections.shares && (
            <View style={styles.sharesContainer}>
              {shares.map((share, index) => (
                <View key={index} style={styles.shareRow}>
                  <View style={styles.shareInfo}>
                    <Text style={[styles.shareName, { color: isDark ? '#ffffff' : '#000000' }]}>
                      {share.name}
                    </Text>
                    {share.size && (
                      <Text style={[styles.shareSize, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
                        {formatBytes(Number(share.used || 0))} / {formatBytes(Number(share.size))}
                      </Text>
                    )}
                  </View>
                  {share.used !== undefined && share.size && (
                    <View style={styles.shareProgress}>
                      <View
                        style={[
                          styles.shareProgressBar,
                          {
                            width: `${calculatePercentage(Number(share.used), Number(share.size))}%`,
                            backgroundColor: '#007aff',
                          },
                        ]}
                      />
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </Card>
      )}

      {/* Array Disks - Collapsible */}
      {arrayInfo && arrayInfo.disks && arrayInfo.disks.length > 0 && (
        <Card>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection('disks')}
          >
            <View>
              <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
                Array Disks ({arrayInfo.disks.length})
              </Text>
              <Text style={[styles.compactSubtext, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
                {formatBytes(Number(arrayInfo.capacity.disks.used))} of {formatBytes(Number(arrayInfo.capacity.disks.total))} used
              </Text>
            </View>
            <Text style={[styles.expandIcon, { color: isDark ? '#007aff' : '#007aff' }]}>
              {expandedSections.disks ? '−' : '+'}
            </Text>
          </TouchableOpacity>

          <ProgressBar
            percentage={diskPercentage}
            label=""
            hideLabel
            height={6}
          />

          {expandedSections.disks && (
            <View style={styles.disksContainer}>
              <View style={[styles.divider, { backgroundColor: isDark ? '#2c2c2e' : '#e5e5ea' }]} />
              {arrayInfo.disks.map((disk, index) => (
                <View key={index} style={styles.diskRow}>
                  <View style={styles.diskInfo}>
                    <View style={styles.diskHeader}>
                      <Text style={[styles.diskName, { color: isDark ? '#ffffff' : '#000000' }]}>
                        {disk.name}
                      </Text>
                      <View style={[
                        styles.statusIndicator,
                        {
                          backgroundColor: disk.status === 'DISK_OK' ? '#34c759' :
                                         disk.status === 'DISK_NP' ? '#8e8e93' : '#ff3b30',
                        },
                      ]} />
                    </View>
                    <View style={styles.diskDetails}>
                      <Text style={[styles.diskDetail, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
                        {formatBytes(Number(disk.size || 0))}
                      </Text>
                      {disk.temp && (
                        <Text style={[styles.diskDetail, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
                          {disk.temp}°C
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </Card>
      )}

      {/* Unassigned Devices */}
      {unassignedDisks.length > 0 && (
        <Card>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
              Unassigned Devices
            </Text>
          </View>
          <View style={styles.unassignedContainer}>
            {unassignedDisks.map((disk, index) => (
              <View key={index} style={styles.unassignedRow}>
                <Text style={[styles.unassignedDevice, { color: isDark ? '#ffffff' : '#000000' }]}>
                  {disk.device || disk.name}
                </Text>
                <Text style={[styles.unassignedTemp, { color: isDark ? '#8e8e93' : '#6e6e73' }]}>
                  {disk.temp ? `${disk.temp}°C` : '—'}
                </Text>
              </View>
            ))}
          </View>
        </Card>
      )}
    </ScrollView>
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
  headerSection: {
    marginBottom: 16,
  },
  serverRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  serverName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  uptimeText: {
    fontSize: 13,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  expandIcon: {
    fontSize: 24,
    fontWeight: '300',
  },
  circularProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statColumn: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  compactValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  compactSubtext: {
    fontSize: 13,
    marginTop: 2,
  },
  processorSummary: {
    marginBottom: 8,
  },
  loadText: {
    fontSize: 14,
  },
  coresContainer: {
    marginTop: 8,
  },
  coreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  coreLabel: {
    fontSize: 11,
    width: 50,
  },
  coreProgress: {
    flex: 1,
    height: 4,
    backgroundColor: '#38383a',
    borderRadius: 2,
    overflow: 'hidden',
  },
  coreProgressBar: {
    height: '100%',
    borderRadius: 2,
  },
  corePercentage: {
    fontSize: 11,
    width: 35,
    textAlign: 'right',
  },
  interfacesContainer: {
    gap: 12,
    marginTop: 8,
  },
  interfaceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  interfaceInfo: {
    flex: 1,
  },
  interfaceName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  interfaceDetail: {
    fontSize: 12,
  },
  interfaceSpeed: {
    fontSize: 14,
    fontWeight: '600',
  },
  sharesContainer: {
    gap: 12,
    marginTop: 8,
  },
  shareRow: {
    gap: 8,
  },
  shareInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  shareName: {
    fontSize: 15,
    fontWeight: '500',
  },
  shareSize: {
    fontSize: 12,
  },
  shareProgress: {
    height: 4,
    backgroundColor: '#38383a',
    borderRadius: 2,
    overflow: 'hidden',
  },
  shareProgressBar: {
    height: '100%',
    borderRadius: 2,
  },
  disksContainer: {
    marginTop: 8,
  },
  diskRow: {
    marginBottom: 12,
  },
  diskInfo: {
    gap: 4,
  },
  diskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  diskName: {
    fontSize: 15,
    fontWeight: '500',
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  diskDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  diskDetail: {
    fontSize: 12,
  },
  unassignedContainer: {
    gap: 8,
  },
  unassignedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  unassignedDevice: {
    fontSize: 14,
  },
  unassignedTemp: {
    fontSize: 14,
  },
});
