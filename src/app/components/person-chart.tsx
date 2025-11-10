'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { RunnerStatistics } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PersonChartProps {
  runnerStats: RunnerStatistics[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export function PersonChart({ runnerStats }: PersonChartProps) {
  const [viewMode, setViewMode] = useState<'total' | 'average'>('total');

  const chartData = runnerStats.map((stat) => ({
    name: stat.runnerName,
    value: viewMode === 'total' ? stat.totalMiles : stat.averageMiles,
  }));

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Runner Performance</CardTitle>
            <CardDescription>
              {viewMode === 'total' ? 'Total miles' : 'Average miles'} by runner
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('total')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                viewMode === 'total'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Total
            </button>
            <button
              onClick={() => setViewMode('average')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                viewMode === 'average'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Average
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `${value.toFixed(2)} miles`}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Runner Stats Table */}
        <div className="mt-6 space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Detailed Statistics</h4>
          <div className="max-h-60 overflow-y-auto">
            {runnerStats.map((stat, index) => (
              <div
                key={stat.runnerName}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm font-medium text-gray-700">{stat.runnerName}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {stat.totalMiles.toFixed(1)} mi | {stat.runCount} runs | avg {stat.averageMiles.toFixed(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}