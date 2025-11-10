'use client';

import { useState } from 'react';
import { CsvUpload } from '../components/csv-upload';
import { ErrorAlert } from '../components/error-alert';
import { SummaryCards } from '../components/summary-cards';
import { OverallChart } from '../components/overall-chart';
import { PersonChart } from '../components/person-chart';
import { parseCsvFile } from '@/lib/parseCsv';
import { validateRunRecords } from '@/lib/validateCsv';
import { calculateOverallMetrics, calculateRunnerStats } from '@/lib/computerMetrics';
import { RunRecord, OverallMetrics, RunnerStatistics } from '@/types';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [runRecords, setRunRecords] = useState<RunRecord[]>([]);
  const [overallMetrics, setOverallMetrics] = useState<OverallMetrics | null>(null);
  const [runnerStats, setRunnerStats] = useState<RunnerStatistics[]>([]);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setErrors([]);
    setRunRecords([]);
    setOverallMetrics(null);
    setRunnerStats([]);

    try {
      // Parse CSV file
      const records = await parseCsvFile(file);

      // Validate records
      const validation = validateRunRecords(records);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      // Calculate metrics
      const overall = calculateOverallMetrics(records);
      const stats = calculateRunnerStats(records);

      // Update state
      setRunRecords(records);
      setOverallMetrics(overall);
      setRunnerStats(stats);
    } catch (error) {
      if (error instanceof Error) {
        setErrors([error.message]);
      } else {
        setErrors(['An unexpected error occurred while processing the file']);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Running Analytics Dashboard</h1>
          <p className="text-gray-600">Upload your CSV file to view detailed running statistics and visualizations</p>
        </div>

        {/* Upload Section */}
        <div className="mb-8 max-w-2xl mx-auto">
          <CsvUpload onFileSelect={handleFileUpload} isLoading={isLoading} />
        </div>

        {/* Error Display */}
        {errors.length > 0 && (
          <div className="mb-8">
            <ErrorAlert errors={errors} />
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Processing your CSV file...</p>
          </div>
        )}

        {/* Dashboard Content */}
        {!isLoading && overallMetrics && runRecords.length > 0 && (
          <div className="space-y-8">
            {/* Overall Metrics Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Overall Statistics</h2>
              <SummaryCards metrics={overallMetrics} />
            </section>

            {/* Charts Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Visualizations</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <OverallChart data={runRecords} />
                <PersonChart runnerStats={runnerStats} />
              </div>
            </section>

            {/* Data Table Section */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Detailed Runner Breakdown</h2>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Runner Name
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Total Miles
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Avg Miles
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Min Miles
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Max Miles
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Total Runs
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {runnerStats.map((stat, index) => (
                        <tr key={stat.runnerName} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {stat.runnerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                            {stat.totalMiles.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                            {stat.averageMiles.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                            {stat.minimumMiles.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                            {stat.maximumMiles.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                            {stat.runCount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !overallMetrics && errors.length === 0 && (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <div className="max-w-md mx-auto">
              <div className="mb-4 text-gray-400">
                <svg
                  className="mx-auto h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Yet</h3>
              <p className="text-gray-600 mb-4">
                Upload a CSV file above to start analyzing your running data
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}