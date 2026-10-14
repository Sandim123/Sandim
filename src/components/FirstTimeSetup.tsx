import React, { useState } from 'react';
import { UserAccount, PartnerProfile } from '../types';
import { initializeSanctuaryAccounts } from '../lib/auth';
import { Heart, Lock, ShieldCheck, Sparkles, Key, User, ArrowRight } from 'lucide-react';
import heroImg from '../assets/images/couple_hero_banner_1791938246946.jpg';

interface FirstTimeSetupProps {
  onSetupComplete: (accounts: UserAccount[]) => void;
  profile: PartnerProfile;
}

export const FirstTimeSetup: React.FC<FirstTimeSetupProps> = ({ onSetupComplete, profile }) => {
  const [username1, setUsername1] = useState('alex');
  const [displayName1, setDisplayName1] = useState(profile.name1 || 'Alex');
  const [password1, setPassword1] = useState('');

  const [username2, setUsername2] = useState('maya');
  const [displayName2, setDisplayName2] = useState(profile.name2 || 'Maya');
  const [password2, setPassword2] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!username1.trim() || !username2.trim()) {
      setErrorMsg('Both usernames are required.');
      return;
    }
    if (username1.trim().toLowerCase() === username2.trim().toLowerCase()) {
      setErrorMsg('Each partner must have a unique username.');
      return;
    }
    if (!password1 || password1.length < 4 || !password2 || password2.length < 4) {
      setErrorMsg('Passwords must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const accounts = await initializeSanctuaryAccounts(
        { username: username1, displayName: displayName1, password: password1 },
        { username: username2, displayName: displayName2, password: password2 }
      );
      onSetupComplete(accounts);
    } catch (err) {
      setErrorMsg('Failed to initialize accounts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoPasswords = () => {
    setPassword1('forever2026');
    setPassword2('always2026');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-center items-center px-4 py-8 sm:py-12">
      <div className="max-w-4xl w-full bg-white border border-[#e8e2d8] rounded-3xl overflow-hidden shadow-xl">
        {/* Header Ribbon */}
        <div className="relative bg-[#1c1917] p-6 sm:p-8 text-white overflow-hidden">
          <img
            src={heroImg}
            alt="Couple at sunset"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />

          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[#fcd34d] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sanctuary Setup</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
              Create Your Couple Passwords
            </h1>

            <p className="text-xs sm:text-sm text-[#e0d7cd] max-w-xl font-light">
              Choose your personal usernames and secret passwords.
              Everything is encrypted in your device's private browser database — 
              <strong> zero passwords or photos are ever saved in the source code or exposed on GitHub</strong>.
            </p>
          </div>
        </div>

        {/* Setup Form */}
        <form onSubmit={handleSetup} className="p-6 sm:p-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Partner 1 Setup */}
            <div className="p-4 sm:p-5 bg-[#faf8f5] border border-[#ded6cb] rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#2c2420] pb-1 border-b border-[#ded6cb]/60">
                <User className="w-4 h-4 text-[#c85a54]" />
                <span>Account 1: For You</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                  Your Display Name
                </label>
                <input
                  type="text"
                  required
                  value={displayName1}
                  onChange={(e) => setDisplayName1(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#ded6cb] rounded-xl bg-white"
                  placeholder="e.g. Alex"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                  Your Login Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-[#8c827a] font-mono">@</span>
                  <input
                    type="text"
                    required
                    value={username1}
                    onChange={(e) => setUsername1(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 text-sm font-mono border border-[#ded6cb] rounded-xl bg-white"
                    placeholder="e.g. alex"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                  Your Secret Password *
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-[#8c827a] absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="Choose your password"
                    value={password1}
                    onChange={(e) => setPassword1(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-[#ded6cb] rounded-xl bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Partner 2 Setup */}
            <div className="p-4 sm:p-5 bg-[#faf8f5] border border-[#ded6cb] rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#2c2420] pb-1 border-b border-[#ded6cb]/60">
                <Heart className="w-4 h-4 text-[#c85a54] fill-current" />
                <span>Account 2: For Her</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                  Her Display Name
                </label>
                <input
                  type="text"
                  required
                  value={displayName2}
                  onChange={(e) => setDisplayName2(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#ded6cb] rounded-xl bg-white"
                  placeholder="e.g. Maya"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                  Her Login Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-[#8c827a] font-mono">@</span>
                  <input
                    type="text"
                    required
                    value={username2}
                    onChange={(e) => setUsername2(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 text-sm font-mono border border-[#ded6cb] rounded-xl bg-white"
                    placeholder="e.g. maya"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                  Her Secret Password *
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-[#8c827a] absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="Choose her password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-[#ded6cb] rounded-xl bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* GitHub Privacy Guarantee Badge */}
          <div className="p-3.5 bg-[#e7f4ed] border border-[#a8dfc2] rounded-2xl flex items-start gap-2.5 text-xs text-[#1b7a4b]">
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Public GitHub Safety Guarantee:</span>
              <p className="text-[11px] opacity-90 mt-0.5">
                These credentials will NEVER be committed to Git. Only the browser on your computer or phone stores the cryptographic salted hash.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold text-center">
              {errorMsg}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleQuickDemoPasswords}
              className="text-xs text-[#8c827a] hover:text-[#2c2420] underline cursor-pointer"
            >
              Use sample passwords (forever2026 / always2026)
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-7 py-3 text-xs font-semibold text-white bg-[#c85a54] hover:bg-[#b34842] rounded-xl transition-colors shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Creating Sanctuary...' : 'Initialize Our Sanctuary'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
