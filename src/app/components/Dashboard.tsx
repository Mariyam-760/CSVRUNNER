'use client'

import React, { useState, useMemo } from 'react';
import Papa from 'papaparse';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Upload, AlertCircle, Users, TrendingUp, Activity, Target } from 'lucide-react';

// Types
interface RunData {
  date: string;
  person: string;
  milesRun: number;
}

interface PersonStats {
  person: string;
  totalMiles: number;
  averageMiles: number;
  minMiles: number;
  maxMiles: number;
  runs: number;
}

export default function Dashboard() {
  const [data, setData] = useState<RunData[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<string>('');

  // Parse and validate CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setData([]);
    setSelectedPerson('');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          // Validate headers
          const headers = results.meta.fields || [];
          const requiredHeaders = ['date', 'person', 'miles run'];
          const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
          
          if (missingHeaders.length > 0) {
            throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
          }

          // Validate and parse data
          const parsedData: RunData[] = [];
          
          results.data.forEach((row: any, index: number) => {
            // Check for empty rows
            if (!row.date || !row.person || row['miles run'] === undefined || row['miles run'] === '') {
              throw new Error(`Row ${index + 1}: Empty or missing values`);
            }

            // Validate date format
            const date = row.date.trim();
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(date) || isNaN(Date.parse(date))) {
              throw new Error(`Row ${index + 1}: Invalid date format "${date}". Expected YYYY-MM-DD`);
            }

            // Validate miles run is a number
            const miles = parseFloat(row['miles run']);
            if (isNaN(miles) || miles < 0) {
              throw new Error(`Row ${index + 1}: "miles run" must be a valid positive number, got "${row['miles run']}"`);
            }

            parsedData.push({
              date,
              person: row.person.trim(),
              milesRun: miles
            });
          });

          if (parsedData.length === 0) {
            throw new Error('CSV file is empty');
          }

          setData(parsedData);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      error: (err) => {
        setError(`Failed to parse CSV: ${err.message}`);
        setLoading(false);
      }
    });
  };

  // Calculate overall stats
  const overallStats = useMemo(() => {
    if (data.length === 0) return null;
    
    const totalMiles = data.reduce((sum, row) => sum + row.milesRun, 0);
    const miles = data.map(row => row.milesRun);
    
    return {
      totalMiles: totalMiles.toFixed(2),
      averageMiles: (totalMiles / data.length).toFixed(2),
      minMiles: Math.min(...miles).toFixed(2),
      maxMiles: Math.max(...miles).toFixed(2),
      totalRuns: data.length
    };
  }, [data]);

  // Calculate per-person stats
  const personStats = useMemo(() => {
    if (data.length === 0) return [];
    
    const statsByPerson = new Map<string, PersonStats>();
    
    data.forEach(row => {
      const existing = statsByPerson.get(row.person);
      
      if (existing) {
        existing.totalMiles += row.milesRun;
        existing.runs += 1;
        existing.minMiles = Math.min(existing.minMiles, row.milesRun);
        existing.maxMiles = Math.max(existing.maxMiles, row.milesRun);
      } else {
        statsByPerson.set(row.person, {
          person: row.person,
          totalMiles: row.milesRun,
          averageMiles: 0,
          minMiles: row.milesRun,
          maxMiles: row.milesRun,
          runs: 1
        });
      }
    });
    
    // Calculate averages
    const stats = Array.from(statsByPerson.values());
    stats.forEach(stat => {
      stat.averageMiles = stat.totalMiles / stat.runs;
    });
    
    return stats.sort((a, b) => b.totalMiles - a.totalMiles);
  }, [data]);

  // Get unique persons for dropdown
  const persons = useMemo(() => {
    return Array.from(new Set(data.map(row => row.person))).sort();
  }, [data]);

  // Prepare chart data for overall view
  const overallChartData = useMemo(() => {
    return personStats.map(stat => ({
      name: stat.person,
      'Total Miles': parseFloat(stat.totalMiles.toFixed(2)),
      'Average Miles': parseFloat(stat.averageMiles.toFixed(2))
    }));
  }, [personStats]);

  // Prepare chart data for person view
  const personChartData = useMemo(() => {
    if (!selectedPerson) return [];
    
    return data
      .filter(row => row.person === selectedPerson)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(row => ({
        date: row.date,
        miles: row.milesRun
      }));
  }, [data, selectedPerson]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Activity className="w-10 h-10 text-indigo-600" />
            CSV Runner Dashboard
          </h1>
          <p className="text-gray-600">Upload your running data and track performance</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 text-gray-400 mb-2" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">CSV file with headers: date, person, miles run</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".csv"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
              <div>
                <h3 className="text-red-800 font-semibold">Error</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Processing CSV...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && data.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Data Yet</h3>
            <p className="text-gray-500">Upload a CSV file to get started</p>
          </div>
        )}

        {/* Dashboard Content */}
        {data.length > 0 && !loading && (
          <>
            {/* View Toggle */}
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <span className="font-semibold text-gray-700">View:</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedPerson('')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      !selectedPerson
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Overall Dashboard
                  </button>
                  <select
                    value={selectedPerson}
                    onChange={(e) => setSelectedPerson(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Person</option>
                    {persons.map(person => (
                      <option key={person} value={person}>{person}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Overall Dashboard */}
            {!selectedPerson && overallStats && (
              <>
                {/* Overall Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm font-medium">Total Miles</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{overallStats.totalMiles}</p>
                      </div>
                      <Target className="w-10 h-10 text-blue-500" />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm font-medium">Average Miles</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{overallStats.averageMiles}</p>
                      </div>
                      <TrendingUp className="w-10 h-10 text-green-500" />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm font-medium">Min Miles</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{overallStats.minMiles}</p>
                      </div>
                      <Activity className="w-10 h-10 text-orange-500" />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-sm font-medium">Max Miles</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{overallStats.maxMiles}</p>
                      </div>
                      <Activity className="w-10 h-10 text-purple-500" />
                    </div>
                  </div>
                </div>

                {/* Overall Chart */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Total Miles by Person</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={overallChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Total Miles" fill="#4f46e5" />
                      <Bar dataKey="Average Miles" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Per-Person Stats Table */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Runner Statistics</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Person</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Miles</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Average Miles</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Min Miles</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Max Miles</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-700">Runs</th>
                        </tr>
                      </thead>
                      <tbody>
                        {personStats.map((stat, index) => (
                          <tr key={stat.person} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                            <td className="py-3 px-4 font-medium text-gray-900">{stat.person}</td>
                            <td className="py-3 px-4 text-right text-gray-700">{stat.totalMiles.toFixed(2)}</td>
                            <td className="py-3 px-4 text-right text-gray-700">{stat.averageMiles.toFixed(2)}</td>
                            <td className="py-3 px-4 text-right text-gray-700">{stat.minMiles.toFixed(2)}</td>
                            <td className="py-3 px-4 text-right text-gray-700">{stat.maxMiles.toFixed(2)}</td>
                            <td className="py-3 px-4 text-right text-gray-700">{stat.runs}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Person Dashboard */}
            {selectedPerson && (
              <>
                {(() => {
                  const personStat = personStats.find(s => s.person === selectedPerson);
                  return personStat ? (
                    <>
                      {/* Person Stats Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-gray-500 text-sm font-medium">Total Miles</p>
                              <p className="text-3xl font-bold text-gray-900 mt-1">{personStat.totalMiles.toFixed(2)}</p>
                            </div>
                            <Target className="w-10 h-10 text-blue-500" />
                          </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-gray-500 text-sm font-medium">Average Miles</p>
                              <p className="text-3xl font-bold text-gray-900 mt-1">{personStat.averageMiles.toFixed(2)}</p>
                            </div>
                            <TrendingUp className="w-10 h-10 text-green-500" />
                          </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-gray-500 text-sm font-medium">Min Miles</p>
                              <p className="text-3xl font-bold text-gray-900 mt-1">{personStat.minMiles.toFixed(2)}</p>
                            </div>
                            <Activity className="w-10 h-10 text-orange-500" />
                          </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-lg p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-gray-500 text-sm font-medium">Max Miles</p>
                              <p className="text-3xl font-bold text-gray-900 mt-1">{personStat.maxMiles.toFixed(2)}</p>
                            </div>
                            <Activity className="w-10 h-10 text-purple-500" />
                          </div>
                        </div>
                      </div>

                      {/* Person Chart */}
                      <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Running Progress for {selectedPerson}</h2>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={personChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="miles" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </>
                  ) : null;
                })()}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}