/**
 * Utility functions for formatting data
 */

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format uptime in seconds to human-readable format
 * Can handle both seconds (number) and ISO date strings
 */
export function formatUptime(input: number | string): string {
  let seconds: number;
  
  // If input is a string (ISO date), calculate seconds from now
  if (typeof input === 'string') {
    const bootTime = new Date(input).getTime();
    const now = Date.now();
    seconds = Math.floor((now - bootTime) / 1000);
  } else {
    seconds = input;
  }

  // Handle invalid values
  if (isNaN(seconds) || seconds < 0) {
    return '0m';
  }

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.length > 0 ? parts.join(' ') : '0m';
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Calculate percentage from used and total
 */
export function calculatePercentage(used: number, total: number): number {
  if (total === 0) return 0;
  return (used / total) * 100;
}

