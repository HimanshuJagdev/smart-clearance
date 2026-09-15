import { useState } from 'react';
import { Compass, Check, ArrowRight, ArrowLeft, MapPin, Building2, IndianRupee, FileCheck2, Clock } from 'lucide-react';
import { Stepper, ProgressBar } from '@/components/Stepper';
import { StatusBadge } from '@/components/StatusBadge';
import {
  industryTypes,
  states,
  districts,
  industrialAreas,
  navigatorApprovals,
} from '@/data/mockData';
import type { ApprovalStatus } from '@/data/mockData';

export function ApprovalNavigatorPage() {
  const [step, setStep] = useState(0);
  const [industryType, setIndustryType] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [investment, setInvestment] = useState('');
  const [land, setLand] = useState('');
  const [employees, setEmployees] = useState('');
  const [electricity, setElectricity] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState<typeof navigatorApprovals | null>(null);

  const steps = ['Industry Type', 'Location', 'Project Details', 'Results'];
  const canProceed =
    step === 0 ? industryType :
    step === 1 ? selectedState && selectedDistrict && selectedArea :
    step === 2 ? investment && land && employees && electricity :
    true;

  const handleFind = () => {
    setResults(navigatorApprovals);
    setStep(3);
  };

  const handleReset = () => {
    setStep(0);
    setIndustryType('');
    setSelectedState('');
    setSelectedDistrict('');
    setSelectedArea('');
    setInvestment('');
    setLand('');
    setEmployees('');
    setElectricity('');
    setCategory('');
    setResults(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <Compass size={22} className="text-brand-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Approval Navigator</h1>
            <p className="text-gray-600">Find exactly which approvals your project needs.</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <Stepper steps={steps.slice(0, 3)} currentStep={step < 3 ? step : 2} />

        {/* Step 1: Industry Type */}
        {step === 0 && (
          <div className="mt-8 animate-slide-up">
            <h2 className="font-semibold text-gray-900 mb-1">Select Industry Type</h2>
            <p className="text-sm text-gray-500 mb-4">Choose the category that best describes your project.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {industryTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setIndustryType(type)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    industryType === type
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <Building2 size={20} className={industryType === type ? 'text-brand-600' : 'text-gray-400'} />
                  <p className={`text-sm font-medium mt-2 ${industryType === type ? 'text-brand-700' : 'text-gray-700'}`}>
                    {type}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 1 && (
          <div className="mt-8 animate-slide-up">
            <h2 className="font-semibold text-gray-900 mb-1">Select Project Location</h2>
            <p className="text-sm text-gray-500 mb-4">Where is your project located?</p>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setSelectedDistrict('');
                      setSelectedArea('');
                    }}
                    className="input-field pl-9 appearance-none"
                  >
                    <option value="">Select state</option>
                    {states.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">District</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setSelectedArea('');
                  }}
                  disabled={!selectedState}
                  className="input-field appearance-none disabled:opacity-50"
                >
                  <option value="">Select district</option>
                  {selectedState && districts[selectedState]?.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Industrial Area</label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  disabled={!selectedDistrict}
                  className="input-field appearance-none disabled:opacity-50"
                >
                  <option value="">Select area</option>
                  {selectedDistrict && industrialAreas[selectedDistrict]?.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Project Details */}
        {step === 2 && (
          <div className="mt-8 animate-slide-up">
            <h2 className="font-semibold text-gray-900 mb-1">Project Details</h2>
            <p className="text-sm text-gray-500 mb-4">Tell us about your project scope.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Investment Amount (₹ Crore)</label>
                <div className="relative">
                  <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={investment} onChange={(e) => setInvestment(e.target.value)} placeholder="8.5" className="input-field pl-9" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Land Requirement (acres)</label>
                <input type="text" value={land} onChange={(e) => setLand(e.target.value)} placeholder="5" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Number of Employees</label>
                <input type="text" value={employees} onChange={(e) => setEmployees(e.target.value)} placeholder="125" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Electricity Requirement (kW)</label>
                <input type="text" value={electricity} onChange={(e) => setElectricity(e.target.value)} placeholder="500" className="input-field" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Project Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field appearance-none">
                  <option value="">Select category</option>
                  <option>Green Category (Low Pollution)</option>
                  <option>Orange Category (Moderate Pollution)</option>
                  <option>Red Category (High Pollution)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        {step < 3 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => step > 0 && setStep(step - 1)}
              disabled={step === 0}
              className="btn-secondary disabled:opacity-40"
            >
              <ArrowLeft size={16} /> Back
            </button>
            {step < 2 ? (
              <button
                onClick={() => canProceed && setStep(step + 1)}
                disabled={!canProceed}
                className="btn-primary disabled:opacity-40"
              >
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleFind}
                disabled={!canProceed}
                className="btn-primary disabled:opacity-40"
              >
                <FileCheck2 size={16} /> Find Required Approvals
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {step === 3 && results && (
        <div className="space-y-6 animate-slide-up">
          <div className="card p-5 bg-gradient-to-br from-brand-50 to-accent-50 border-brand-100">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="font-semibold text-gray-900">Required Approvals</h2>
                <p className="text-sm text-gray-600 mt-0.5">
                  Based on: {industryType} • {selectedArea}, {selectedDistrict}, {selectedState}
                </p>
              </div>
              <button onClick={handleReset} className="btn-secondary">
                Start Over
              </button>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Overall Progress</span>
                <span className="font-semibold text-brand-700">0% — Not Started</span>
              </div>
              <ProgressBar value={0} />
            </div>
          </div>

          <div className="space-y-4">
            {results.map((approval, index) => {
              const Icon = Check;
              return (
                <div key={index} className="card p-5 card-hover">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-success-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="font-semibold text-gray-900">{approval.category}</h3>
                        <StatusBadge status={approval.status as ApprovalStatus} />
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{approval.department}</p>
                      <div className="mt-3 grid sm:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Required Documents</p>
                          <div className="flex flex-wrap gap-1.5">
                            {approval.documents.map((doc) => (
                              <span key={doc} className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                                {doc}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Estimated Stage</p>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <Clock size={12} /> {approval.estimatedStage}
                          </div>
                        </div>
                      </div>
                      <button className="btn-secondary mt-3 text-xs py-1.5 px-3">
                        Track <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
