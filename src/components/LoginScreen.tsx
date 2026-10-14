import React, { useState } from 'react';
import { UserAccount, PartnerProfile } from '../types';
import { authenticateCredentials, getStoredAccounts } from '../lib/auth';
import { Heart, Lock, User, Eye, EyeOff, ShieldCheck, Sparkles, Key, RotateCcw } from 'lucide-react';
import heroImg from '../assets/images/couple_hero_banner_1791938246946.jpg';

interface LoginScreenProps {
  onLoginSuccess: (user: UserAccount) => void;
  profile: PartnerProfile;
  onResetSanctuary?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  profile,
  onResetSanctuary,
}) => {
  const accounts = getStoredAccounts();
  const [username, setUsername] = useState(accounts[0]?.username || 'alex');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setIsLoading(true);
    setErrorMsg(null);

    const result = await authenticateCredentials(username, password);
    setIsLoading(false);

    if (result.success && result.user) {
      onLoginSuccess(result.user);
    } else {
      setErrorMsg(result.error || 'Authentication failed. Please check your credentials.');
    }
  };

  const fillQuickCredentials = (user: UserAccount) => {
    setUsername(user.username);
    setPassword('');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-center items-center px-4 py-8 sm:py-12">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white border border-[#e8e2d8] rounded-3xl overflow-hidden shadow-xl">
        {/* Left Side: Visual Sanctuary & Couple Branding */}
        <div className="relative bg-[#1c1917] p-6 sm:p-10 flex flex-col justify-between text-white overflow-hidden min-h-[190px] sm:min-h-[260px] md:min-h-[540px]">
          <img
            src={heroImg}
            alt="Couple at sunset"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          {/* Top Wordmark */}
          <div className="relative z-10 flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-white">
              Everus
            </span>
            <Heart className="w-4 h-4 text-[#c85a54] fill-[#c85a54]" />
          </div>

          {/* Bottom Love Message */}
          <div className="relative z-10 space-y-2 sm:space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full bg-white/10 backdrop-blur-xs text-[#fcd34d] text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Private Sanctuary</span>
            </div>

            <h2 className="font-serif text-xl sm:text-3xl font-bold leading-tight">
              A space created just for {profile.name1} & {profile.name2}
            </h2>

            <p className="hidden sm:block text-xs sm:text-sm text-[#e0d7cd] italic font-light">
              "Every second since January 6th, 2026 belongs to us. Only the two of us have access to our shared stories."
            </p>
          </div>
        </div>

        {/* Right Side: Secure Authentication Form */}
        <div className="p-6 sm:p-10 flex flex-col justify-center space-y-5 sm:space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-[#c85a54]">
              <Lock className="w-3.5 h-3.5" />
              <span>Secure Authentication</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c2420]">
              Welcome Back
            </h1>
            <p className="text-xs text-[#6e635b]">
              Please sign in with your personal credentials to view our shared memories.
            </p>
          </div>

          {/* Quick Account Selector */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-[#8c827a] uppercase tracking-wider">
              Select Your Account:
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {accounts.map((acc) => {
                const isSelected = username.toLowerCase() === acc.username.toLowerCase();
                const isHer = acc.id === 'partner2';

                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => fillQuickCredentials(acc)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[50px] ${
                      isSelected
                        ? 'border-[#c85a54] bg-[#fdf8f7] ring-1 ring-[#c85a54]'
                        : 'border-[#ede7de] hover:border-[#ded5c7] bg-[#faf8f5]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#2c2420]">
                        {acc.displayName}
                      </span>
                      {isHer ? (
                        <Heart className="w-3.5 h-3.5 text-[#c85a54] fill-current" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-[#5d524a]" />
                      )}
                    </div>
                    <span className="text-[11px] text-[#8c827a] mt-0.5 font-mono">
                      @{acc.username}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8c827a] absolute left-3 top-3.5 sm:top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 sm:py-2 text-base sm:text-sm border border-[#ded6cb] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c85a54]/20 focus:border-[#c85a54] bg-[#faf8f5]"
                  placeholder="Enter username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-[#8c827a] hover:text-[#2c2420] flex items-center gap-1 cursor-pointer min-h-[36px]"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>

              <div className="relative">
                <Key className="w-4 h-4 text-[#8c827a] absolute left-3 top-3.5 sm:top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 sm:py-2 text-base sm:text-sm border border-[#ded6cb] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c85a54]/20 focus:border-[#c85a54] bg-[#faf8f5]"
                  placeholder="Enter your private password"
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 text-xs font-semibold text-white bg-[#c85a54] hover:bg-[#b34842] rounded-xl transition-colors shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Verifying...' : 'Unlock Our Sanctuary'}</span>
            </button>
          </form>

          {/* Privacy & GitHub Safety Guarantee */}
          <div className="p-3 bg-[#faf6f0] border border-[#ede7de] rounded-xl text-[11px] text-[#6e635b] space-y-1">
            <div className="font-semibold text-[#2c2420] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
              <span>GitHub Privacy Protection:</span>
            </div>
            <p className="text-[10px] text-[#7a7068] leading-relaxed">
              Passwords and uploaded photos are stored exclusively in this browser's private local storage.
              <strong> Zero credentials or personal photos are stored in the code repository or visible on GitHub.</strong>
            </p>

            {onResetSanctuary && (
              <div className="pt-1 text-right">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Reset couple accounts and re-create your passwords?')) {
                      onResetSanctuary();
                    }
                  }}
                  className="text-[10px] text-[#c85a54] hover:underline flex items-center gap-1 ml-auto cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset / Change Passwords Setup</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
