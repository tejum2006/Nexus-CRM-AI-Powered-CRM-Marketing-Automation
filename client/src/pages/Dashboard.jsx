import React, { useState, useEffect } from 'react';
import {
  Users, Megaphone, Tags, Sparkles,
  ArrowUpRight, ArrowDownRight, Clock, TrendingUp
} from 'lucide-react';
import Skeleton from '../components/ui/Skeleton';
import CustomerGrowthChart from '../components/dashboard/CustomerGrowthChart';
import CampaignPerformanceChart from '../components/dashboard/CampaignPerformanceChart';
import SegmentDistributionChart from '../components/dashboard/SegmentDistributionChart';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import * as dashboardService from '../services/dashboardService';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getDashboardAnalytics();
        if (data.success) setAnalytics(data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const stats = [
    {
      title: 'Total Customers',
      value: analytics?.totalCustomers ?? 0,
      change: '+12%',
      positive: true,
      icon: Users,
      color: 'text-[var(--brand-primary)]',
      bg: 'bg-[var(--brand-primary)]/10'
    },
    {
      title: 'Active Customers',
      value: analytics?.activeCustomers ?? 0,
      change: '+4%',
      positive: true,
      icon: TrendingUp,
      color: 'text-[var(--status-success)]',
      bg: 'bg-[var(--status-success)]/10'
    },
    {
      title: 'Campaigns',
      value: analytics?.totalCampaigns ?? 0,
      change: '+4%',
      positive: true,
      icon: Megaphone,
      color: 'text-[var(--brand-premium)]',
      bg: 'bg-[var(--brand-premium)]/10'
    },
    {
      title: 'Segments',
      value: analytics?.segmentDistribution?.length ?? 0,
      change: '-2%',
      positive: false,
      icon: Tags,
      color: 'text-[var(--text-tertiary)]',
      bg: 'bg-[var(--bg-surface-hover)]'
    },
  ];

  return (
    <div className="page-scroll">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="heading-1 mb-1">Dashboard</h1>
          <p className="text-body">
            Welcome back,{' '}
            <span className="text-[var(--text-primary)] font-medium">
              {user?.name?.split(' ')[0] || 'User'}
            </span>
            . Here's your overview.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="card" style={{ padding: '28px' }}>
              {loading ? (
                <>
                  <div className="flex justify-between mb-4">
                    <Skeleton className="w-20 h-3" />
                    <Skeleton className="w-8 h-8 rounded-lg" />
                  </div>
                  <Skeleton className="w-16 h-8 mb-2" />
                  <Skeleton className="w-28 h-3" />
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <p className="text-label">{stat.title}</p>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bg}`}>
                      <stat.icon size={16} className={stat.color} />
                    </div>
                  </div>
                  <div className="mb-2">
                    <span className="heading-2">
                      {stat.value.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-0.5 text-xs font-semibold ${stat.positive ? 'text-[var(--status-success)]' : 'text-[var(--status-error)]'}`}>
                      {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {stat.change}
                    </span>
                    <span className="text-small">vs last month</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Growth */}
          <div className="card lg:col-span-2" style={{ padding: '32px' }}>
            <h3 className="heading-3 mb-6">Customer Growth</h3>
            {loading ? (
              <Skeleton className="w-full h-[260px] rounded-xl" />
            ) : (
              <CustomerGrowthChart data={analytics?.customerGrowth} />
            )}
          </div>

          {/* Campaign Performance */}
          <div className="card" style={{ padding: '32px' }}>
            <h3 className="heading-3 mb-6">Campaign Performance</h3>
            {loading ? (
              <Skeleton className="w-full h-[260px] rounded-xl" />
            ) : (
              <CampaignPerformanceChart data={analytics?.campaignPerformance} />
            )}
          </div>

          {/* Audience Segments */}
          <div className="card" style={{ padding: '32px' }}>
            <h3 className="heading-3 mb-6">Audience Segments</h3>
            {loading ? (
              <Skeleton className="w-full h-[260px] rounded-xl" />
            ) : (
              <SegmentDistributionChart data={analytics?.segmentDistribution} />
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card" style={{ padding: '32px' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="heading-3">Recent Activity</h3>
            <button
              onClick={() => navigate('/campaigns')}
              className="text-sm font-medium text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] transition-colors"
            >
              View all
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="w-1/3 h-4 mb-2" />
                    <Skeleton className="w-1/5 h-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : !analytics?.recentActivity?.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-[var(--text-tertiary)]">
              <Clock size={32} className="mb-4 opacity-30" />
              <p className="text-sm">No recent activity yet.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {analytics.recentActivity.map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-start gap-4 p-3 rounded-lg transition-colors hover:bg-[var(--bg-surface-hover)]"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-[var(--bg-surface-hover)] text-[var(--text-secondary)]">
                    {activity.type.includes('campaign')
                      ? <Megaphone size={16} />
                      : activity.type.includes('customer')
                      ? <Users size={16} />
                      : <Sparkles size={16} className="text-[var(--brand-premium)]" />}
                  </div>
                  <div className="flex-1 min-w-0 mt-0.5">
                    <p className="text-sm font-medium text-white truncate">
                      {activity.title}{' '}
                      <span className="font-normal text-[var(--text-tertiary)]">· {activity.userName}</span>
                    </p>
                    <p className="flex items-center gap-1.5 mt-1 text-xs text-[var(--text-tertiary)]">
                      <Clock size={12} className="text-[var(--brand-primary)]" />
                      {new Date(activity.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
