import { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { company, notifications as allNotifications } from '@/data/mockData';
import type { PageKey } from '@/components/Sidebar';

interface TopBarProps {
  onMenuClick: () => void;
  onNavigate: (page: PageKey) => void;
  notificationCount: number;
  onLogout: () => void;
}

export function TopBar({ onMenuClick, onNavigate, notificationCount, onLogout }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const searchResults = [
    { label: 'Fire NOC', page: 'approvals' as PageKey },
    { label: 'MSEDCL Application', page: 'approvals' as PageKey },
    { label: 'Factory License', page: 'approvals' as PageKey },
    { label: 'Environmental Clearance', page: 'approvals' as PageKey },
    { label: 'Compliance Report', page: 'compliance' as PageKey },
    { label: 'Approval Navigator', page: 'navigator' as PageKey },
    { label: 'Government Services', page: 'services' as PageKey },
    { label: 'AI Assistant', page: 'ai-assistant' as PageKey },
    { label: 'AI Insights', page: 'ai-insights' as PageKey },
  ];

  const filteredResults = searchQuery
    ? searchResults.filter((r) => r.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleResultClick = (page: PageKey) => {
    onNavigate(page);
    setSearchQuery('');
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="flex items-center gap-3 px-4 sm:px-6 py-3">
        <button onClick={onMenuClick} className="lg:hidden text-gray-600 hover:text-gray-900">
          <Menu size={22} />
        </button>

        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search approvals, documents, services…"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
            className="input-field pl-10 py-2"
          />
          {searchOpen && filteredResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 card shadow-lg py-2 z-30 animate-slide-up">
              {filteredResults.map((result) => (
                <button
                  key={result.label}
                  onClick={() => handleResultClick(result.page)}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Search size={14} className="text-gray-400" />
                  {result.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => onNavigate('notifications')}
            className="relative p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 pr-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-sm font-semibold">
                RS
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">Rajesh</span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>

            {profileOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 card shadow-lg py-2 z-30 animate-slide-up">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{company.owner}</p>
                  <p className="text-xs text-gray-500">{company.email}</p>
                </div>
                <button
                  onClick={() => {
                    onNavigate('profile');
                    setProfileOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={16} /> Profile
                </button>
                <button
                  onClick={() => {
                    onNavigate('profile');
                    setProfileOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings size={16} /> Settings
                </button>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
