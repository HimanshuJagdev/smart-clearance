import { useState } from 'react';
import { ArrowRight, Search, Filter } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { ProgressBar } from '@/components/Stepper';
import { applications } from '@/data/mockData';
import type { ApprovalStatus } from '@/data/mockData';

interface MyApprovalsPageProps {
  onViewApplication: (id: string) => void;
}

const filterTabs: { label: string; value: ApprovalStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Under Review', value: 'review' },
  { label: 'Query Raised', value: 'query' },
  { label: 'Approved', value: 'approved' },
  { label: 'Pending', value: 'pending' },
];

export function MyApprovalsPage({ onViewApplication }: MyApprovalsPageProps) {
  const [filter, setFilter] = useState<ApprovalStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = applications.filter((app) => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch =
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.department.toLowerCase().includes(search.toLowerCase()) ||
      app.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Approvals</h1>
        <p className="text-gray-600 mt-1">Track all your industrial approval applications in one place.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, department, or ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-thin">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filter === tab.value
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Application list */}
      <div className="space-y-4">
        {filtered.map((app) => (
          <div
            key={app.id}
            className="card card-hover p-5 cursor-pointer"
            onClick={() => onViewApplication(app.id)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-gray-900">{app.name}</h3>
                  <StatusBadge status={app.status} />
                </div>
                <p className="text-sm text-gray-500">{app.department}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                  <span>ID: <span className="font-medium text-gray-700">{app.id}</span></span>
                  <span>Submitted: <span className="font-medium text-gray-700">{app.submittedDate}</span></span>
                  <span>Last Updated: <span className="font-medium text-gray-700">{app.lastUpdated}</span></span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-semibold text-gray-700">{app.progress}%</span>
                  </div>
                  <ProgressBar value={app.progress} />
                  <p className="text-xs text-gray-500 mt-1">{app.currentStage}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewApplication(app.id);
                  }}
                  className={`text-xs font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    app.status === 'query'
                      ? 'bg-warning-50 text-warning-700 hover:bg-warning-100'
                      : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                  }`}
                >
                  {app.status === 'query' ? 'Respond' : 'Track'} <ArrowRight size={12} className="inline ml-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <Filter size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No applications match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
