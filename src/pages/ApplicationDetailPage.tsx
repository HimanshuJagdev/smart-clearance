import { ArrowLeft, FileText, CheckCircle2, AlertCircle, Eye, Building2, Calendar, Clock } from 'lucide-react';
import { StatusBadge, StatusDot } from '@/components/StatusBadge';
import { ProgressBar, Breadcrumb } from '@/components/Stepper';
import { applications } from '@/data/mockData';

interface ApplicationDetailPageProps {
  applicationId: string;
  onBack: () => void;
  onViewDocuments: () => void;
}

export function ApplicationDetailPage({ applicationId, onBack, onViewDocuments }: ApplicationDetailPageProps) {
  const app = applications.find((a) => a.id === applicationId);

  if (!app) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Application not found.</p>
        <button onClick={onBack} className="btn-primary mt-4">Back to Approvals</button>
      </div>
    );
  }

  const detailItems = [
    { icon: Building2, label: 'Department', value: app.department },
    { icon: FileText, label: 'Application ID', value: app.id },
    { icon: Calendar, label: 'Submission Date', value: app.submittedDate },
    { icon: Clock, label: 'Last Updated', value: app.lastUpdated },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="mb-3">
          <Breadcrumb items={['My Approvals', app.name]} />
        </div>
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={16} /> Back to Approvals
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{app.name}</h1>
              <StatusBadge status={app.status} />
            </div>
            <p className="text-gray-600 mt-1">{app.department}</p>
          </div>
          <button onClick={onViewDocuments} className="btn-secondary">
            <Eye size={16} /> View Documents
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Details */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Application Details</h2>
          <div className="space-y-4">
            {detailItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-sm font-medium text-gray-900">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Progress</span>
              <span className="font-semibold text-gray-900">{app.progress}%</span>
            </div>
            <ProgressBar value={app.progress} />
            <p className="text-xs text-gray-500 mt-2">Current stage: <span className="font-medium text-gray-700">{app.currentStage}</span></p>
          </div>
        </div>

        {/* Timeline */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-4">Application Timeline</h2>
          <div className="relative">
            {app.timeline.map((step, index) => (
              <div key={step.label} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <StatusDot status={step.status} />
                  {index < app.timeline.length - 1 && (
                    <div className={`w-0.5 h-10 ${step.status === 'done' ? 'bg-brand-500' : 'bg-gray-200'}`} />
                  )}
                </div>
                <div className="pb-4">
                  <p className={`text-sm font-medium ${
                    step.status === 'done' ? 'text-gray-900' :
                    step.status === 'current' ? 'text-brand-700' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </p>
                  {step.date && (
                    <p className={`text-xs mt-0.5 ${
                      step.status === 'current' ? 'text-brand-500' : 'text-gray-400'
                    }`}>
                      {step.date}
                    </p>
                  )}
                  {step.status === 'current' && (
                    <span className="inline-flex items-center gap-1 mt-1 text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
                      In Progress
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Required Action */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className={`card p-4 ${
              app.status === 'query' ? 'bg-warning-50 border-warning-200' : 'bg-brand-50 border-brand-100'
            }`}>
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className={`flex-shrink-0 ${app.status === 'query' ? 'text-warning-600' : 'text-brand-600'}`} />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Required Action</p>
                  <p className="text-sm text-gray-700 mt-0.5">{app.nextAction}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submitted Documents */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Submitted Documents</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {app.documents.map((doc) => (
            <div key={doc.name} className="card p-4 border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <FileText size={16} className="text-gray-500" />
                </div>
                {doc.verified ? (
                  <CheckCircle2 size={16} className="text-success-500" />
                ) : (
                  <Clock size={16} className="text-warning-500" />
                )}
              </div>
              <p className="text-sm font-medium text-gray-900">{doc.name}</p>
              <p className={`text-xs mt-1 ${doc.verified ? 'text-success-600' : 'text-warning-600'}`}>
                {doc.verified ? 'Verified' : 'Pending Verification'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
