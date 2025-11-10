// Core data types for CSV Runner Dashboard

export interface RunRecord {
  date: string;
  person: string;
  milesRun: number;
}

export interface RunnerStatistics {
  runnerName: string;
  totalMiles: number;
  averageMiles: number;
  minimumMiles: number;
  maximumMiles: number;
  runCount: number;
}

export interface OverallMetrics {
  totalRuns: number;
  totalMiles: number;
  averageMilesPerRun: number;
  minimumMiles: number;
  maximumMiles: number;
  uniqueRunners: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ChartDataPoint {
  name: string;
  value: number;
  label?: string;
}

export interface DailyRunData {
  date: string;
  miles: number;
  runs: number;
}