import { Calendar, RefreshCw, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { leadService } from '../api/leadService';
import { Card, CardContent } from '../components/ui/card';

const Dashboard = () => {
  const [counts, setCounts] = useState({
    assignedCount: 0,
    followUpCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await leadService.getLeadCounts();
      setCounts(data);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err.message || 'Failed to load dashboard data');
      // Set fallback data when API fails
      setCounts({ assignedCount: 0, followUpCount: 0 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-96"></div>
          </div>
          
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">
                Welcome back! Here's what's happening with your leads today.
              </p>
            </div>
            <button 
              onClick={loadDashboardData}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
          {/* Total Leads Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Leads</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                      {counts.assignedCount?.toLocaleString() || 0}
                    </p>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">All assigned leads</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Follow Ups Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Follow Ups</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                      {counts.followUpCount?.toLocaleString() || 0}
                    </p>
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Pending follow-ups</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-xl">
                  <Calendar className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Summary */}
        {/* <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{counts.assignedCount || 0}</p>
                <p className="text-xs text-gray-600 mt-1">Total Leads</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{counts.followUpCount || 0}</p>
                <p className="text-xs text-gray-600 mt-1">Follow Ups</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {((counts.followUpCount / Math.max(counts.assignedCount, 1)) * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-gray-600 mt-1">Follow Up Rate</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{counts.assignedCount - counts.followUpCount || 0}</p>
                <p className="text-xs text-gray-600 mt-1">Other Leads</p>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default Dashboard;