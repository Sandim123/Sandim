import React from 'react';
import { PartnerProfile, UserAccount } from '../types';
import {
  Heart,
  Sparkles,
  Settings,
  LogOut,
  User,
  Home,
  Clock,
  Camera,
  Calendar,
  BookOpen,
  CheckSquare,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'overview' | 'counter' | 'photos' | 'calendar' | 'journal' | 'bucket';
  setActiveTab: (tab: 'overview' | 'counter' | 'photos' | 'calendar' | 'journal' | 'bucket') => void;
  profile: PartnerProfile;
  currentUser: UserAccount;
  onLogout: () => void;
  onOpenSettings: () => void;
  onOpenSurpriseManager: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  currentUser,
  onLogout,
  onOpenSettings,
  onOpenSurpriseManager,
}) => {
  const isHim = currentUser.id === 'partner1';

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#faf8f5]/92 backdrop-blur-md border-b border-[#e7e1d8] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-8 h-14 sm:h-16">
            {/* Zone 1: Brand Wordmark (Single text element in display face) */}
            <button
              onClick={() => setActiveTab('overview')}
              className="text-left group flex items-center gap-2 focus:outline-none cursor-pointer min-h-[44px]"
            >
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#2c2420] group-hover:text-[#9f3a38] transition-colors whitespace-nowrap shrink-0">
                Everus
              </span>
              <Heart className="w-4 h-4 text-[#c85a54] fill-[#c85a54] opacity-80 group-hover:scale-110 transition-transform" />
            </button>

            {/* Zone 2: Desktop 4-5 Concise Single-line Nav Links with subtle hover underlines */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[#6e635b]">
              <button
                onClick={() => setActiveTab('overview')}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
                  activeTab === 'overview'
                    ? 'text-[#2c2420] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#c85a54]'
                    : 'hover:text-[#2c2420]'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('counter')}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
                  activeTab === 'counter'
                    ? 'text-[#2c2420] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#c85a54]'
                    : 'hover:text-[#2c2420]'
                }`}
              >
                Our Timer
              </button>
              <button
                onClick={() => setActiveTab('photos')}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
                  activeTab === 'photos'
                    ? 'text-[#2c2420] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#c85a54]'
                    : 'hover:text-[#2c2420]'
                }`}
              >
                Photo Album
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
                  activeTab === 'calendar'
                    ? 'text-[#2c2420] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#c85a54]'
                    : 'hover:text-[#2c2420]'
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => setActiveTab('journal')}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
                  activeTab === 'journal'
                    ? 'text-[#2c2420] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#c85a54]'
                    : 'hover:text-[#2c2420]'
                }`}
              >
                Secret Journal
              </button>
              <button
                onClick={() => setActiveTab('bucket')}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
                  activeTab === 'bucket'
                    ? 'text-[#2c2420] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#c85a54]'
                    : 'hover:text-[#2c2420]'
                }`}
              >
                Bucket List
              </button>
            </nav>

            {/* Zone 3: Action Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Pop-up for Her button (when he is logged in) */}
              {isHim && (
                <button
                  onClick={onOpenSurpriseManager}
                  title="Configure pop-up message for her"
                  className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-[#8c4642] bg-[#fcedeb] hover:bg-[#fae2e0] border border-[#f5cfcc] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[38px] sm:min-h-[34px]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#c85a54]" />
                  <span className="hidden sm:inline">Pop-up For Her</span>
                  <span className="sm:hidden">Popup</span>
                </button>
              )}

              {/* Authenticated User Badge */}
              <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-xs text-[#5d524a] bg-[#efeae3] rounded-lg border border-[#ded6cb] whitespace-nowrap shrink-0 max-w-[120px] sm:max-w-none truncate min-h-[34px]">
                {currentUser.id === 'partner2' ? (
                  <Heart className="w-3.5 h-3.5 text-[#c85a54] fill-current shrink-0" />
                ) : (
                  <User className="w-3.5 h-3.5 text-[#c85a54] shrink-0" />
                )}
                <span className="font-semibold text-[#2c2420] truncate">{currentUser.displayName}</span>
              </div>

              {/* Settings button (min 44px tap target on mobile) */}
              <button
                onClick={onOpenSettings}
                title="Couple settings & passwords"
                aria-label="Couple settings"
                className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center text-[#6e635b] hover:text-[#2c2420] hover:bg-[#efeae3] rounded-lg transition-colors shrink-0 cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Logout button (min 44px tap target on mobile) */}
              <button
                onClick={onLogout}
                title="Log out of sanctuary"
                aria-label="Log out"
                className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center text-[#6e635b] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Ergonomic Mobile Bottom Navigation Tab Bar (iOS / Android thumb ergonomics) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#faf8f5]/96 backdrop-blur-lg border-t border-[#e2dbce] shadow-lg px-2 pb-[env(safe-area-inset-bottom,0.5rem)]"
      >
        <div className="grid grid-cols-6 items-center h-16">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              activeTab === 'overview' ? 'text-[#c85a54]' : 'text-[#8c827a] hover:text-[#2c2420]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-0.5">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('counter')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              activeTab === 'counter' ? 'text-[#c85a54]' : 'text-[#8c827a] hover:text-[#2c2420]'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-0.5">Timer</span>
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              activeTab === 'photos' ? 'text-[#c85a54]' : 'text-[#8c827a] hover:text-[#2c2420]'
            }`}
          >
            <Camera className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-0.5">Photos</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              activeTab === 'calendar' ? 'text-[#c85a54]' : 'text-[#8c827a] hover:text-[#2c2420]'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-0.5">Dates</span>
          </button>

          <button
            onClick={() => setActiveTab('journal')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              activeTab === 'journal' ? 'text-[#c85a54]' : 'text-[#8c827a] hover:text-[#2c2420]'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-0.5">Journal</span>
          </button>

          <button
            onClick={() => setActiveTab('bucket')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              activeTab === 'bucket' ? 'text-[#c85a54]' : 'text-[#8c827a] hover:text-[#2c2420]'
            }`}
          >
            <CheckSquare className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight mt-0.5">Bucket</span>
          </button>
        </div>
      </nav>
    </>
  );
};
