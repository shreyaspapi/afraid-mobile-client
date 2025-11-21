import { Card } from '@/src/components/ui/card';
import { ErrorMessage } from '@/src/components/ui/error-message';
import { LoadingScreen } from '@/src/components/ui/loading-screen';
import { GET_NOTIFICATIONS } from '@/src/graphql/queries';
import { usePollingInterval } from '@/src/hooks/usePollingInterval';
import { useLocalization } from '@/src/providers/localization-provider';
import { useTheme } from '@/src/providers/theme-provider';
import { DemoDataService } from '@/src/services/demo-data.service';
import { useQuery } from '@apollo/client/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Linking, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type NotificationTypeValue = 'UNREAD' | 'ARCHIVE';
type NotificationImportanceValue = 'ALERT' | 'WARNING' | 'INFO';
type ImportanceFilter = NotificationImportanceValue | 'ALL';

interface NotificationCounts {
  info: number;
  warning: number;
  alert: number;
  total: number;
}

interface NotificationItem {
  id: string;
  title: string;
  subject: string;
  description: string;
  importance: NotificationImportanceValue;
  type: NotificationTypeValue;
  link?: string | null;
  timestamp?: string | null;
  formattedTimestamp?: string | null;
}

interface NotificationsQueryData {
  notifications: {
    overview: {
      unread: NotificationCounts;
      archive: NotificationCounts;
    };
    list: NotificationItem[];
  };
}

type NotificationOverview = NotificationsQueryData['notifications']['overview'];

interface NotificationFilterInput {
  type: NotificationTypeValue;
  offset: number;
  limit: number;
  importance?: NotificationImportanceValue;
}

const TYPE_COLORS: Record<NotificationTypeValue, string> = {
  UNREAD: '#0a84ff',
  ARCHIVE: '#8e8e93',
};

const IMPORTANCE_COLORS: Record<NotificationImportanceValue, string> = {
  ALERT: '#ff453a',
  WARNING: '#ff9f0a',
  INFO: '#32ade6',
};

export function NotificationsScreen() {
  const { isDark } = useTheme();
  const { t } = useLocalization();
  const { pollingInterval } = usePollingInterval();

  const [selectedType, setSelectedType] = useState < NotificationTypeValue > ('UNREAD');
  const [importanceFilter, setImportanceFilter] = useState < ImportanceFilter > ('ALL');
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    setIsDemoMode(DemoDataService.isDemoMode());
  }, []);

  const filterInput = useMemo < NotificationFilterInput > (() => {
    const filter: NotificationFilterInput = {
      type: selectedType,
      offset: 0,
      limit: 50,
    };
    if (importanceFilter !== 'ALL') {
      filter.importance = importanceFilter;
    }
    return filter;
  }, [selectedType, importanceFilter]);

  const queryResult = useQuery < NotificationsQueryData > (GET_NOTIFICATIONS, {
    variables: { filter: filterInput },
    pollInterval: pollingInterval,
    notifyOnNetworkStatusChange: true,
    skip: isDemoMode,
  });

  const demoData = useMemo < NotificationsQueryData | null > (() => {
    if (!isDemoMode) {
      return null;
    }
    const raw = DemoDataService.getNotificationsData();
    const filteredList = raw.notifications.list
      .filter(
        (item) =>
          item.type === selectedType &&
          (importanceFilter === 'ALL' || item.importance === importanceFilter)
      )
      .slice(filterInput.offset, filterInput.offset + filterInput.limit);

    return {
      notifications: {
        overview: raw.notifications.overview,
        list: filteredList,
      },
    };
  }, [filterInput.limit, filterInput.offset, importanceFilter, isDemoMode, selectedType]);

  const notificationsPayload = isDemoMode ? demoData?.notifications : queryResult.data?.notifications;

  const [renderedNotifications, setRenderedNotifications] = useState < NotificationItem[] > (
    () => notificationsPayload?.list ?? []
  );
  const [overviewState, setOverviewState] = useState < NotificationOverview | null > (
    () => notificationsPayload?.overview ?? null
  );

  useEffect(() => {
    if (!notificationsPayload) {
      return;
    }

    const nextList = notificationsPayload.list ?? [];
    setRenderedNotifications((previous) =>
      haveNotificationListsChanged(previous, nextList) ? nextList : previous
    );

    setOverviewState((previous) =>
      haveOverviewChanged(previous, notificationsPayload.overview) ? notificationsPayload.overview : previous
    );
  }, [notificationsPayload]);

  const loading = isDemoMode ? false : queryResult.loading;
  const error = isDemoMode ? undefined : queryResult.error;
  const networkStatus = isDemoMode ? 7 : queryResult.networkStatus;
  const isRefetching = !isDemoMode && networkStatus === 4;

  const notifications = renderedNotifications;
  const overview = overviewState ?? notificationsPayload?.overview ?? null;
  const hasInitialData = Boolean(notificationsPayload) || notifications.length > 0 || !!overview;
  const activeCounts =
    selectedType === 'UNREAD' ? overview?.unread : overview?.archive;

  const handleRefresh = useCallback(async () => {
    if (isDemoMode) {
      return;
    }
    await queryResult.refetch({ filter: filterInput });
  }, [filterInput, isDemoMode, queryResult]);

  const handleOpenLink = useCallback(async (link?: string | null) => {
    if (!link) return;
    try {
      await Linking.openURL(link);
    } catch (err) {
      console.warn('Failed to open link', err);
    }
  }, []);

  const renderChip = useCallback((
    key: string,
    label: string,
    color: string,
    selected: boolean,
    onPress: () => void
  ) => {
    const selectedTextColor = color === TYPE_COLORS.ARCHIVE ? '#000000' : '#ffffff';
    const textColor = selected ? selectedTextColor : color;
    const backgroundColor = selected ? color : 'transparent';
    const borderColor = color;

    return (
      <TouchableOpacity
        key={key}
        onPress={onPress}
        activeOpacity={0.7}
        style={[
          styles.chip,
          {
            borderColor,
            backgroundColor,
          },
        ]}
      >
        <Text style={[styles.chipLabel, { color: textColor }]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  }, []);

  const keyExtractor = useCallback((item: NotificationItem) => item.id, []);

  const renderNotificationItem = useCallback(({ item }: { item: NotificationItem }) => {
    const importanceColor = IMPORTANCE_COLORS[item.importance] || '#8e8e93';
    const timestamp =
      item.formattedTimestamp ??
      (item.timestamp ? new Date(item.timestamp).toLocaleString() : t('notifications.unknownTime'));

    return (
      <Card>
        <View style={styles.listItemHeader}>
          <View
            style={[
              styles.severityDot,
              {
                backgroundColor: importanceColor,
              },
            ]}
          />
          <Text
            style={[
              styles.notificationTitle,
              { color: isDark ? '#ffffff' : '#000000' },
            ]}
          >
            {item.title}
          </Text>
        </View>
        <View style={styles.subjectRow}>
          <Text
            style={[
              styles.notificationSubject,
              { color: isDark ? '#8e8e93' : '#6e6e73' },
            ]}
          >
            {item.subject}
          </Text>
          <View
            style={[
              styles.importancePill,
              {
                borderColor: importanceColor,
                backgroundColor: `${importanceColor}1A`,
              },
            ]}
          >
            <Text style={[styles.importanceText, { color: importanceColor }]}>
              {(item.importance || 'INFO').toLowerCase()}
            </Text>
          </View>
        </View>
        <Text
          style={[
            styles.notificationDescription,
            { color: isDark ? '#d1d1d6' : '#3a3a3c' },
          ]}
        >
          {item.description}
        </Text>
        <View style={styles.notificationFooter}>
          <Text
            style={[
              styles.timestamp,
              { color: isDark ? '#8e8e93' : '#6e6e73' },
            ]}
          >
            {timestamp}
          </Text>
          {item.link ? (
            <TouchableOpacity onPress={() => handleOpenLink(item.link)}>
              <Text style={styles.linkText}>{t('notifications.open')}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </Card>
    );
  }, [handleOpenLink, isDark, t]);

  const summaryCard = useMemo(() => (
    <Card>
      <Text
        style={[
          styles.summaryTitle,
          { color: isDark ? '#8e8e93' : '#6e6e73' },
        ]}
      >
        {selectedType === 'UNREAD' ? t('notifications.unread') : t('notifications.archived')} {t('notifications.summary')}
      </Text>
      <View style={styles.summaryRow}>
        <Text
          style={[
            styles.summaryValue,
            { color: isDark ? '#ffffff' : '#000000' },
          ]}
        >
          {activeCounts?.total ?? 0}
        </Text>
        <Text
          style={[
            styles.summaryCaption,
            { color: isDark ? '#8e8e93' : '#6e6e73' },
          ]}
        >
          {t('notifications.totalNotifications')}
        </Text>
      </View>
      <View style={styles.summaryBreakdown}>
        <View
          style={[
            styles.summaryItem,
            {
              backgroundColor: isDark ? '#1c1c1e' : '#f8f9fb',
              borderColor: isDark ? '#2c2c2e' : '#e5e5ea',
            },
          ]}
        >
          <View
            style={[styles.summaryDot, { backgroundColor: IMPORTANCE_COLORS.INFO }]}
          />
          <Text
            style={[
              styles.summaryLabel,
              { color: isDark ? '#8e8e93' : '#6e6e73' },
            ]}
          >
            {t('notifications.info')}
          </Text>
          <Text
            style={[
              styles.summaryCount,
              { color: isDark ? '#ffffff' : '#000000' },
            ]}
          >
            {activeCounts?.info ?? 0}
          </Text>
        </View>
        <View
          style={[
            styles.summaryItem,
            {
              backgroundColor: isDark ? '#1c1c1e' : '#f8f9fb',
              borderColor: isDark ? '#2c2c2e' : '#e5e5ea',
            },
          ]}
        >
          <View
            style={[
              styles.summaryDot,
              { backgroundColor: IMPORTANCE_COLORS.WARNING },
            ]}
          />
          <Text
            style={[
              styles.summaryLabel,
              { color: isDark ? '#8e8e93' : '#6e6e73' },
            ]}
          >
            {t('notifications.warnings')}
          </Text>
          <Text
            style={[
              styles.summaryCount,
              { color: isDark ? '#ffffff' : '#000000' },
            ]}
          >
            {activeCounts?.warning ?? 0}
          </Text>
        </View>
        <View
          style={[
            styles.summaryItem,
            {
              backgroundColor: isDark ? '#1c1c1e' : '#f8f9fb',
              borderColor: isDark ? '#2c2c2e' : '#e5e5ea',
            },
          ]}
        >
          <View
            style={[styles.summaryDot, { backgroundColor: IMPORTANCE_COLORS.ALERT }]}
          />
          <Text
            style={[
              styles.summaryLabel,
              { color: isDark ? '#8e8e93' : '#6e6e73' },
            ]}
          >
            {t('notifications.alerts')}
          </Text>
          <Text
            style={[
              styles.summaryCount,
              { color: isDark ? '#ffffff' : '#000000' },
            ]}
          >
            {activeCounts?.alert ?? 0}
          </Text>
        </View>
      </View>
    </Card>
  ), [activeCounts, isDark, selectedType, t]);

  const filterControls = useMemo(() => (
    <>
      <View style={styles.chipRow}>
        {renderChip(
          'type-unread',
          t('notifications.unread'),
          TYPE_COLORS.UNREAD,
          selectedType === 'UNREAD',
          () => setSelectedType('UNREAD')
        )}
        {renderChip(
          'type-archive',
          t('notifications.archived'),
          TYPE_COLORS.ARCHIVE,
          selectedType === 'ARCHIVE',
          () => setSelectedType('ARCHIVE')
        )}
      </View>
      <View style={styles.chipRow}>
        {[
          { key: 'ALL' as ImportanceFilter, label: t('notifications.all'), color: '#007aff' },
          { key: 'ALERT' as ImportanceFilter, label: t('notifications.alerts'), color: IMPORTANCE_COLORS.ALERT },
          { key: 'WARNING' as ImportanceFilter, label: t('notifications.warnings'), color: IMPORTANCE_COLORS.WARNING },
          { key: 'INFO' as ImportanceFilter, label: t('notifications.info'), color: IMPORTANCE_COLORS.INFO },
        ].map(({ key, label, color }) => (
          renderChip(
            `importance-${key.toLowerCase()}`,
            label,
            color,
            importanceFilter === key,
            () => setImportanceFilter(key)
          )
        ))}
      </View>
    </>
  ), [importanceFilter, renderChip, selectedType, t]);

  const listHeaderComponent = useMemo(() => (
    <>
      <Text
        style={[
          styles.title,
          { color: isDark ? '#ffffff' : '#000000' },
        ]}
      >
        {t('notifications.title')}
      </Text>
      <Text
        style={[
          styles.subtitle,
          { color: isDark ? '#8e8e93' : '#6e6e73' },
        ]}
      >
        {t('notifications.subtitle')}
      </Text>
      <View style={{ height: 12 }} />
      {summaryCard}
      {filterControls}
    </>
  ), [filterControls, isDark, summaryCard, t]);

  // Early returns must come after all hooks
  if (!hasInitialData && !isDemoMode && loading) {
    return <LoadingScreen message="Loading notifications..." />;
  }

  if (error && !hasInitialData) {
    return (
      <ErrorMessage
        message={error.message || t('notifications.errorLoadingNotifications')}
        onRetry={handleRefresh}
      />
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#000000' : '#f2f2f7' },
      ]}
      edges={['top']}
    >
      <FlatList
        key={`${selectedType}-${importanceFilter}`}
        data={notifications}
        keyExtractor={keyExtractor}
        renderItem={renderNotificationItem}
        style={[
          styles.container,
          { backgroundColor: isDark ? '#000000' : '#f2f2f7' },
        ]}
        contentContainerStyle={styles.content}

        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor="#007aff"
          />
        }
        ListHeaderComponent={listHeaderComponent}
        ListEmptyComponent={
          <Text
            style={[
              styles.empty,
              { color: isDark ? '#8e8e93' : '#6e6e73' },
            ]}
          >
            {t('notifications.noNotificationsFiltered')}
          </Text>
        }
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </SafeAreaView>
  );
}

function haveNotificationListsChanged(previous: NotificationItem[], next: NotificationItem[]) {
  if (previous === next) {
    return false;
  }

  if (previous.length !== next.length) {
    return true;
  }

  for (let i = 0; i < next.length; i++) {
    const prevItem = previous[i];
    const nextItem = next[i];

    if (!prevItem || !nextItem) {
      return true;
    }

    if (
      prevItem.id !== nextItem.id ||
      prevItem.type !== nextItem.type ||
      prevItem.importance !== nextItem.importance ||
      prevItem.title !== nextItem.title ||
      prevItem.subject !== nextItem.subject ||
      prevItem.description !== nextItem.description ||
      prevItem.link !== nextItem.link ||
      prevItem.timestamp !== nextItem.timestamp ||
      prevItem.formattedTimestamp !== nextItem.formattedTimestamp
    ) {
      return true;
    }
  }

  return false;
}

function haveOverviewChanged(previous: NotificationOverview | null, next?: NotificationOverview | null) {
  if (previous === next) {
    return false;
  }

  if (!previous || !next) {
    return true;
  }

  const fields: Array<keyof NotificationCounts> = ['info', 'warning', 'alert', 'total'];

  for (const field of fields) {
    if (
      previous.unread[field] !== next.unread[field] ||
      previous.archive[field] !== next.archive[field]
    ) {
      return true;
    }
  }

  return false;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  summaryCaption: {
    fontSize: 14,
  },
  summaryBreakdown: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  summaryItem: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  summaryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  summaryCount: {
    fontSize: 18,
    fontWeight: '600',
  },
  listItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  severityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  notificationSubject: {
    fontSize: 13,
    flex: 1,
  },
  importancePill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  importanceText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  notificationDescription: {
    fontSize: 13,
    marginTop: 12,
    lineHeight: 18,
  },
  notificationFooter: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#007aff',
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 15,
  },
});

