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
      sub: 'All time',
    },
    {
      title: 'Active Customers',
      value: analytics?.activeCustomers ?? 0,
      change: '+4%',
      positive: true,
      icon: TrendingUp,
      sub: 'Currently active',
    },
    {
      title: 'Campaigns',
      value: analytics?.totalCampaigns ?? 0,
      change: '+4%',
      positive: true,
      icon: Megaphone,
      sub: 'Total campaigns',
    },
    {
      title: 'Segments',
      value: analytics?.segmentDistribution?.length ?? 0,
      change: '-2%',
      positive: false,
      icon: Tags,
      sub: 'Audience segments',
    },
  ];

  return (
    <div className="page-enter">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="text-display mb-1">Dashboard</h1>
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
        <div className="stat-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              {loading ? (
                <>
                  <div className="flex justify-between mb-4">
                    <Skeleton className="w-20 h-3" />
                    <Skeleton className="w-7 h-7 rounded-lg" />
                  </div>
                  <Skeleton className="w-16 h-8 mb-2" />
                  <Skeleton className="w-28 h-3" />
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <p className="text-label">{stat.title}</p>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'var(--gold-dim)', border: '1px solid var(--gold-border)' }}>
                      <stat.icon size={14} style={{ color: 'var(--gold)' }} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <span className="text-[30px] font-bold tracking-tight leading-none"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--text-primary)' }}>
                      {stat.value.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-0.5 text-[12px] font-semibold ${stat.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                      {stat.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {stat.change}
                    </span>
                    <span className="text-caption">vs last month</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Growth — spans full width */}
          <div className="card p-6 lg:col-span-2">
            <h3 className="text-heading mb-5">Customer Growth</h3>
            {loading ? (
              <Skeleton className="w-full h-[260px] rounded-lg" />
            ) : (
              <CustomerGrowthChart data={analytics?.customerGrowth} />
            )}
          </div>

          {/* Campaign Performance */}
          <div className="card p-6">
            <h3 className="text-heading mb-5">Campaign Performance</h3>
            {loading ? (
              <Skeleton className="w-full h-[260px] rounded-lg" />
            ) : (
              <CampaignPerformanceChart data={analytics?.campaignPerformance} />
            )}
          </div>

          {/* Audience Segments */}
          <div className="card p-6">
            <h3 className="text-heading mb-5">Audience Segments</h3>
            {loading ? (
              <Skeleton className="w-full h-[260px] rounded-lg" />
            ) : (
              <SegmentDistributionChart data={analytics?.segmentDistribution} />
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-heading">Recent Activity</h3>
            <button
              onClick={() => navigate('/campaigns')}
              className="text-[12.5px] font-medium transition-colors"
              style={{ color: 'var(--gold-light)' }}
            >
              View all
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-9 h-9 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="w-1/3 h-3.5 mb-1.5" />
                    <Skeleton className="w-1/5 h-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : !analytics?.recentActivity?.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-[var(--text-muted)]">
              <Clock size={28} className="mb-3 opacity-30" />
              <p className="text-caption">No recent activity yet.</p>
            </div>
          ) : (
            <div className="space-y-px">
              {analytics.recentActivity.map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-[var(--bg-hover)]"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: 'var(--bg-active)', border: '1px solid var(--border)' }}>
                    {activity.type.includes('campaign')
                      ? <Megaphone size={13} style={{ color: 'var(--text-muted)' }} />
                      : activity.type.includes('customer')
                      ? <Users size={13} style={{ color: 'var(--text-muted)' }} />
                      : <Sparkles size={13} style={{ color: 'var(--gold)' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-medium text-[var(--text-primary)] truncate">
                      {activity.title}{' '}
                      <span className="font-normal text-[var(--text-muted)]">· {activity.userName}</span>
                    </p>
                    <p className="flex items-center gap-1 mt-0.5 text-caption">
                      <Clock size={11} />
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
