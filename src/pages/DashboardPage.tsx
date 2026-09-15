import {
  FileCheck2,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { CircularProgress } from '@/components/CircularProgress';
import { StatusBadge } from '@/components/StatusBadge';
import { ProgressBar } from '@/components/Stepper';
import { dashboardStats, applications, complianceItems } from '@/data/mockData';
import type { PageKey } from '@/components/Sidebar';
import type { ApprovalStatus } from '@/data/mockData';

interface DashboardPageProps {
  onNavigate: (page: PageKey) => void;
  onViewApplication: (id: string) => void;
}

const statCards = [
  { label: 'Total Approvals', value: dashboardStats.total, icon: FileCheck2, color: 'text-brand-600', bg: 'bg-brand-50', border: 'border-brand-100' },
  { label: 'Approved', value: dashboardStats.approved, icon: CheckCircle2, color: 'text-success-600', bg: 'bg-success-50', border: 'border-success-100' },
  { label: 'In Progress', value: dashboardStats.inProgress, icon: Clock, color: 'text-accent-600', bg: 'bg-accent-50', border: 'border-accent-100' },
  { label: 'Action Required', value: dashboardStats.actionRequired, icon: AlertCircle, color: 'text-warning-600', bg: 'bg-warning-50', border: 'border-warning-100' },
];

const progressBreakdown = [
  { label: 'Approved', value: 7, color: 'bg-success-500' },
  { label: 'In Progress', value: 3, color: 'bg-brand-500' },
  { label: 'Pending Action', value: 2, color: 'bg-warning-500' },
];

export function DashboardPage({ onNavigate, onViewApplication }: DashboardPageProps) {
  const activeApplications = applications.filter((a) => a.status !== 'approved').slice(0, 4);
  const upcomingCompliance = complianceItems.filter((c) => c.status !== 'completed').slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Good Morning, Rajesh</h1>
        <p className="text-gray-600 mt-1">Here's your industrial approval overview.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`card p-5 border ${stat.border} card-hover`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon size={20} className={stat.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Approval Progress */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Overall Approval Progress</h2>
          <p className="text-xs text-gray-500 mb-4">Across all active applications</p>
          <div className="flex flex-col items-center">
            <CircularProgress value={dashboardStats.overallProgress} size={140} strokeWidth={12} />
            <div className="w-full mt-6 space-y-3">
              {progressBreakdown.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Applications */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900">Active Applications</h2>
              <p className="text-xs text-gray-500">Currently in progress</p>
            </div>
            <button onClick={() => onNavigate('approvals')} className="btn-ghost text-brand-600">
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {activeApplications.map((app) => (
              <div
                key={app.id}
                onClick={() => onViewApplication(app.id)}
                className="flex items-center gap-4 p-3 rounded-xl border border-gray-200 hover:border-brand-200 hover:bg-brand-50/30 transition-all cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{app.name}</p>
                  <p className="text-xs text-gray-500 truncate">{app.department}</p>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-1 w-28">
                  <ProgressBar value={app.progress} />
                  <span className="text-xs text-gray-500">{app.progress}%</span>
                </div>
                <StatusBadge status={app.status} />
                <button
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    app.status === 'query'
                      ? 'bg-warning-50 text-warning-700 hover:bg-warning-100'
                      : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewApplication(app.id);
                  }}
                >
                  {app.status === 'query' ? 'Respond' : 'View'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button onClick={() => onNavigate('navigator')} className="flex items-center gap-3 w-full p-3 rounded-xl border border-gray-200 hover:border-brand-200 hover:bg-brand-50/30 transition-all text-left">
              <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center">
                <FileCheck2 size={18} className="text-brand-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Find Required Approvals</p>
                <p className="text-xs text-gray-500">Use the Approval Navigator</p>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </button>
            <button onClick={() => onNavigate('documents')} className="flex items-center gap-3 w-full p-3 rounded-xl border border-gray-200 hover:border-brand-200 hover:bg-brand-50/30 transition-all text-left">
              <div className="w-9 h-9 rounded-lg bg-accent-50 flex items-center justify-center">
                <FileText size={18} className="text-accent-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Upload Documents</p>
                <p className="text-xs text-gray-500">Smart OCR extraction</p>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </button>
            <button onClick={() => onNavigate('ai-insights')} className="flex items-center gap-3 w-full p-3 rounded-xl border border-gray-200 hover:border-brand-200 hover:bg-brand-50/30 transition-all text-left">
              <div className="w-9 h-9 rounded-lg bg-warning-50 flex items-center justify-center">
                <TrendingUp size={18} className="text-warning-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">AI Delay Prediction</p>
                <p className="text-xs text-gray-500">Check approval risk factors</p>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </button>
            <button onClick={() => onNavigate('compliance')} className="flex items-center gap-3 w-full p-3 rounded-xl border border-gray-200 hover:border-brand-200 hover:bg-brand-50/30 transition-all text-left">
              <div className="w-9 h-9 rounded-lg bg-success-50 flex items-center justify-center">
                <ShieldCheck size={18} className="text-success-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Compliance Center</p>
                <p className="text-xs text-gray-500">Check upcoming deadlines</p>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900">Upcoming Compliance Deadlines</h2>
              <p className="text-xs text-gray-500">Stay ahead of regulatory requirements</p>
            </div>
            <button onClick={() => onNavigate('compliance')} className="btn-ghost text-brand-600">
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {upcomingCompliance.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-200">
                <div className={`w-1 h-10 rounded-full ${
                  item.status === 'overdue' ? 'bg-error-500' : 'bg-warning-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${item.status === 'overdue' ? 'text-error-600' : 'text-gray-700'}`}>
                    {item.dueDate}
                  </p>
                  <p className={`text-xs ${item.status === 'overdue' ? 'text-error-500' : 'text-gray-400'}`}>
                    {item.status === 'overdue' ? 'Overdue' : 'Upcoming'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
