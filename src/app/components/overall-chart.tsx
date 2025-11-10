'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { RunRecord } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface OverallChartProps {
  data: RunRecord[];
}

export function OverallChart({ data }: OverallChartProps) {
  // Group data by date and sum miles
  const dateMap = new Map<string, number>();
  
  data.forEach(record => {
    const existing = dateMap.get(record.date) || 0;
    dateMap.set(record.date, existing + record.milesRun);
  });

  // Convert to chart data and sort by date
  const chartData = Array.from(dateMap.entries())
    .map(([date, miles]) => ({
      date,
      miles: parseFloat(miles.toFixed(2)),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-10); // Show last 10 dates

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Daily Running Activity</CardTitle>
        <CardDescription>
          Total miles run per day (last 10 days)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                className="text-xs"
                label={{ value: 'Miles', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar 
                dataKey="miles" 
                fill="#3b82f6" 
                radius={[8, 8, 0, 0]}
                name="Total Miles"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}