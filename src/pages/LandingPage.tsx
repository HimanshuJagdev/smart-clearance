import {
  ArrowRight,
  Compass,
  FileText,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  TrendingDown,
  Eye,
  Layers,
  Zap,
  Building2,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { CircularProgress } from '@/components/CircularProgress';

interface LandingPageProps {
  onGetStarted: () => void;
  onExplore: () => void;
}

const features = [
  {
    icon: Compass,
    title: 'Approval Navigator',
    description: 'Find exactly which approvals your project needs based on industry type and location.',
    color: 'from-brand-500 to-brand-700',
  },
  {
    icon: FileText,
    title: 'Smart Document Processing',
    description: 'Upload once and let AI extract key information automatically from your documents.',
    color: 'from-accent-500 to-accent-700',
  },
  {
    icon: Sparkles,
    title: 'AI Delay Prediction',
    description: 'Predict potential approval delays and understand the factors driving them.',
    color: 'from-warning-400 to-warning-600',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance Tracking',
    description: 'Monitor upcoming deadlines and maintain full regulatory compliance effortlessly.',
    color: 'from-success-400 to-success-600',
  },
];

const whyReasons = [
  { icon: Layers, title: 'One Unified Platform', description: 'Replace multiple government portals with a single, centralized dashboard.' },
  { icon: TrendingDown, title: 'Reduced Approval Complexity', description: 'Navigate complex multi-department workflows with clear, guided steps.' },
  { icon: Eye, title: 'Transparent Application Tracking', description: 'See exactly where each application stands and what happens next.' },
  { icon: FileText, title: 'Intelligent Document Management', description: 'OCR-powered extraction reduces manual data entry and errors.' },
  { icon: ShieldCheck, title: 'Proactive Compliance Monitoring', description: 'Never miss a deadline with automated alerts and reminders.' },
  { icon: Zap, title: 'Faster Approvals', description: 'AI-powered predictions help you address issues before they cause delays.' },
];

export function LandingPage({ onGetStarted, onExplore }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
          <Logo />
          <div className="flex items-center gap-3">
            <button onClick={onExplore} className="btn-ghost hidden sm:flex">
              Explore Platform
            </button>
            <button onClick={onGetStarted} className="btn-primary">
              Get Started <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden grid-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 via-white to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 mb-6">
                <Building2 size={14} className="text-brand-600" />
                <span className="text-xs font-semibold text-brand-700">Smart India Hackathon 2026</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                Streamline Industrial <span className="text-gradient">Approvals</span> & Compliance
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
                Manage approvals, documents, compliance and government services from one intelligent platform.
              </p>
              <p className="mt-3 text-sm font-medium text-brand-600">
                One Platform. Every Approval. Zero Confusion.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button onClick={onGetStarted} className="btn-primary text-base px-6 py-3">
                  Get Started <ArrowRight size={18} />
                </button>
                <button onClick={onExplore} className="btn-secondary text-base px-6 py-3">
                  Explore Platform
                </button>
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="relative animate-scale-in">
              <div className="card p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Good Morning, Rajesh</p>
                    <p className="text-xs text-gray-400">Industrial approval overview</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-sm font-semibold">
                    RS
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="card p-3 bg-gray-50 border-gray-100">
                    <p className="text-xs text-gray-500">Total Approvals</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                  <div className="card p-3 bg-gray-50 border-gray-100">
                    <p className="text-xs text-gray-500">Approved</p>
                    <p className="text-2xl font-bold text-success-600">7</p>
                  </div>
                  <div className="card p-3 bg-gray-50 border-gray-100">
                    <p className="text-xs text-gray-500">In Progress</p>
                    <p className="text-2xl font-bold text-brand-600">3</p>
                  </div>
                  <div className="card p-3 bg-gray-50 border-gray-100">
                    <p className="text-xs text-gray-500">Action Required</p>
                    <p className="text-2xl font-bold text-warning-600">2</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 card p-4 bg-gradient-to-br from-brand-50 to-accent-50 border-brand-100">
                  <CircularProgress value={72} size={90} strokeWidth={8} />
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Overall Approval Progress</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-600">Approved: 7</p>
                      <p className="text-xs text-gray-600">In Progress: 3</p>
                      <p className="text-xs text-gray-600">Pending Action: 2</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-brand-200 to-accent-200 rounded-full blur-2xl opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Platform Features</h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage industrial approvals in one place.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="card card-hover p-6 animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why SmartClearance */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Why SmartClearance?</h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
              Built for industry owners who need clarity, speed, and control over their approval processes.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyReasons.map((reason, i) => {
              const Icon = reason.icon;
              return (
                <div
                  key={reason.title}
                  className="card p-6 animate-slide-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-brand-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{reason.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{reason.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="relative overflow-hidden card p-8 sm:p-12 bg-gradient-to-br from-brand-600 to-brand-800 border-0 text-center">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Ready to simplify your approvals?</h2>
            <p className="mt-3 text-brand-100 max-w-2xl mx-auto">
              Join SmartClearance and manage every industrial approval from a single, intelligent platform.
            </p>
            <button
              onClick={onGetStarted}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-700 font-semibold text-base hover:bg-brand-50 transition-all duration-200 active:scale-[0.98]"
            >
              Get Started Now <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="inline-flex rounded-lg bg-white px-3 py-2 mb-4">
                <Logo size={32} />
              </div>
              <p className="text-sm leading-relaxed">
                One Platform. Every Approval. Zero Confusion.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>Approval Navigator</li>
                <li>Document Center</li>
                <li>AI Insights</li>
                <li>Compliance Tracking</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Services</h4>
              <ul className="space-y-2 text-sm">
                <li>Government Services</li>
                <li>Application Tracking</li>
                <li>OCR Processing</li>
                <li>Delay Prediction</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">About</h4>
              <ul className="space-y-2 text-sm">
                <li>Smart India Hackathon 2026</li>
                <li>Prototype Demo</li>
                <li>Built with React & FastAPI</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs">© 2026 SmartClearance. Prototype for Smart India Hackathon.</p>
            <div className="flex items-center gap-1.5 text-xs">
              <CheckCircle2 size={14} className="text-success-500" />
              Demo data — no real government API connected
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
