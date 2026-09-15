import { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Chrome, ArrowRight, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/Logo';

interface LoginPageProps {
  onLogin: () => void;
  onBack: () => void;
}

export function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [email, setEmail] = useState('rajesh@shreeindustries.in');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative flex flex-col justify-between p-12 text-white">
          <button onClick={onBack} className="flex items-center gap-2 text-brand-200 hover:text-white transition-colors text-sm">
            <ArrowLeft size={16} /> Back to home
          </button>
          <div>
            <div className="inline-flex rounded-lg bg-white px-3 py-2">
              <Logo size={36} />
            </div>
            <h1 className="mt-8 text-4xl font-bold leading-tight">
              One Platform.<br />Every Approval.<br />Zero Confusion.
            </h1>
            <p className="mt-4 text-brand-100 text-lg leading-relaxed max-w-md">
              Manage industrial approvals, documents, compliance, and government services from one intelligent platform.
            </p>
            <div className="mt-8 space-y-3">
              {['Approval Navigator', 'Smart Document Processing', 'AI Delay Prediction', 'Compliance Tracking'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-brand-300" />
                  <span className="text-brand-100">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-brand-300">© 2026 SmartClearance — Smart India Hackathon Prototype</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6">
              <ArrowLeft size={16} /> Back to home
            </button>
            <Logo size={32} />
          </div>

          <h2 className="text-2xl font-bold text-gray-900">{isSignup ? 'Create your account' : 'Welcome back'}</h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignup
              ? 'Start managing your industrial approvals today.'
              : 'Sign in to your SmartClearance account.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.in"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isSignup && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" defaultChecked />
                  Remember me
                </label>
                <button type="button" className="text-brand-600 hover:text-brand-700 font-medium">
                  Forgot password?
                </button>
              </div>
            )}

            <button type="submit" className="btn-primary w-full text-base py-3">
              {isSignup ? 'Create Account' : 'Login'} <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            onClick={onLogin}
            className="mt-4 btn-secondary w-full text-base py-3"
          >
            <Chrome size={18} /> Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-brand-600 hover:text-brand-700 font-semibold"
            >
              {isSignup ? 'Sign in' : 'Create Account'}
            </button>
          </p>

          <div className="mt-6 card p-3 bg-brand-50 border-brand-100">
            <p className="text-xs text-brand-700 text-center">
              Demo mode: any credentials will work. Pre-filled for convenience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
