import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { ArrowRight, BarChart3, Users, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Track Your Running Journey
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Upload your CSV running data and get instant insights with beautiful visualizations
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Visual Analytics</CardTitle>
              <CardDescription>
                Beautiful charts and graphs to visualize your running performance over time
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Per-Runner Stats</CardTitle>
              <CardDescription>
                Track individual performance with detailed statistics for each runner
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>
                Monitor improvements with averages, minimums, and maximums across all runs
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CSV Format Guide */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>CSV Format Requirements</CardTitle>
            <CardDescription>
              Your CSV file should contain the following columns:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 rounded-md p-4 font-mono text-sm text-gray-100">
              <div className="text-green-400">date,person,miles run</div>
              <div className="text-gray-300">2024-01-15,John Doe,5.2</div>
              <div className="text-gray-300">2024-01-16,Jane Smith,3.8</div>
              <div className="text-gray-300">2024-01-17,John Doe,4.5</div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>• <strong>date</strong>: Date in YYYY-MM-DD format</p>
              <p>• <strong>person</strong>: Name of the runner</p>
              <p>• <strong>miles run</strong>: Distance in miles (numeric)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}