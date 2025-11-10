import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { OverallMetrics } from '@/types';
import { TrendingUp, Activity, Users, Target, Award, MapPin } from 'lucide-react';

interface SummaryCardsProps {
  metrics: OverallMetrics;
}

export function SummaryCards({ metrics }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Runs',
      value: metrics.totalRuns.toLocaleString(),
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Miles',
      value: metrics.totalMiles.toFixed(1),
      icon: MapPin,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Average Miles',
      value: metrics.averageMilesPerRun.toFixed(2),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Minimum Miles',
      value: metrics.minimumMiles.toFixed(1),
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Maximum Miles',
      value: metrics.maximumMiles.toFixed(1),
      icon: Award,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Unique Runners',
      value: metrics.uniqueRunners.toString(),
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}