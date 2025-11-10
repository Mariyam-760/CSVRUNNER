import { RunRecord, OverallMetrics, RunnerStatistics } from '@/types';

/**
 * Computes overall statistics across all run records
 */
export function calculateOverallMetrics(records: RunRecord[]): OverallMetrics {
  if (records.length === 0) {
    return {
      totalRuns: 0,
      totalMiles: 0,
      averageMilesPerRun: 0,
      minimumMiles: 0,
      maximumMiles: 0,
      uniqueRunners: 0,
    };
  }

  const totalMiles = records.reduce((sum, record) => sum + record.milesRun, 0);
  const milesArray = records.map(r => r.milesRun);
  const uniqueRunners = new Set(records.map(r => r.person.toLowerCase())).size;

  return {
    totalRuns: records.length,
    totalMiles: parseFloat(totalMiles.toFixed(2)),
    averageMilesPerRun: parseFloat((totalMiles / records.length).toFixed(2)),
    minimumMiles: Math.min(...milesArray),
    maximumMiles: Math.max(...milesArray),
    uniqueRunners,
  };
}

/**
 * Computes per-runner statistics from run records
 */
export function calculateRunnerStats(records: RunRecord[]): RunnerStatistics[] {
  const runnerMap = new Map<string, number[]>();

  // Group miles by runner (case-insensitive)
  records.forEach(record => {
    const normalizedName = record.person.trim();
    const key = normalizedName.toLowerCase();
    
    if (!runnerMap.has(key)) {
      runnerMap.set(key, []);
    }
    runnerMap.get(key)!.push(record.milesRun);
  });

  // Calculate stats for each runner
  const stats: RunnerStatistics[] = [];
  
  runnerMap.forEach((miles, key) => {
    const totalMiles = miles.reduce((sum, m) => sum + m, 0);
    const runnerName = records.find(r => r.person.toLowerCase() === key)?.person || key;
    
    stats.push({
      runnerName,
      totalMiles: parseFloat(totalMiles.toFixed(2)),
      averageMiles: parseFloat((totalMiles / miles.length).toFixed(2)),
      minimumMiles: Math.min(...miles),
      maximumMiles: Math.max(...miles),
      runCount: miles.length,
    });
  });

  // Sort by total miles descending
  return stats.sort((a, b) => b.totalMiles - a.totalMiles);
}