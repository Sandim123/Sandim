import React, { useState } from 'react';
import { PartnerProfile, UserAccount } from '../types';
import { exportSanctuaryData, importSanctuaryData } from '../lib/storage';
import {
  getStoredAccounts,
  updateUserPassword,
  updateAccountDetails,
} from '../lib/auth';
import {
  X,
  Heart,
  Shield,
  Download,
  Upload,
  Check,
  AlertCircle,
  Key,
  User,
  AtSign,
  Save,
} from 'lucide-react';

interface ProfileModalProps {
  profile: PartnerProfile;
  currentUser: UserAccount;
  onSaveProfile: (profile: PartnerProfile) => void;
  onClose: () => void;
  onDataReload: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  currentUser,
  onSaveProfile,
  onClose,
  onDataReload,
}) => {
  const [name1, setName1] = useState(profile.name1);
  const [name2, setName2] = useState(profile.name2);
  const [nickname1, setNickname1] = useState(profile.nickname1 || '');
  const [nickname2, setNickname2] = useState(profile.nickname2 || '');
  const [startDate, setStartDate] = useState(
    profile.relationshipStartDate.split('T')[0] || '2026-01-06'
  );
  const [anniversaryNote, setAnniversaryNote] = useState(profile.anniversaryNote || '');
  const [pinLockEnabled, setPinLockEnabled] = useState(profile.pinLockEnabled);
  const [pinCode, setPinCode] = useState(profile.pinCode || '1234');

  const [activeTab, setActiveTab] = useState<'profile' | 'credentials' | 'security' | 'backup'>(
    'credentials'
  );
  const [backupMessage, setBackupMessage] = useState<string | null>(null);

  // Accounts & Credentials state
  const [accounts, setAccounts] = useState<UserAccount[]>(getStoredAccounts);

  // Username form state
  const acc1 = accounts.find((a) => a.id === 'partner1') || accounts[0];
  const acc2 = accounts.find((a) => a.id === 'partner2') || accounts[1];

  const [username1, setUsername1] = useState(acc1.username);
  const [username2, setUsername2] = useState(acc2.username);
  const [displayName1, setDisplayName1] = useState(acc1.displayName);
  const [displayName2, setDisplayName2] = useState(acc2.displayName);
  const [usernameStatus, setUsernameStatus] = useState<string | null>(null);

  // Password change state
  const [targetAccount, setTargetAccount] = useState<'partner1' | 'partner2'>(currentUser.id);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      name1: name1.trim() || 'Alex',
      name2: name2.trim() || 'Maya',
      nickname1: nickname1.trim() || undefined,
      nickname2: nickname2.trim() || undefined,
      relationshipStartDate: `${startDate}T00:00:00`,
      anniversaryNote: anniversaryNote.trim() || undefined,
      pinLockEnabled,
      pinCode: pinCode.trim() || '1234',
    });
    onClose();
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameStatus(null);

    // Update Partner 1 username
    const res1 = updateAccountDetails('partner1', username1, displayName1);
    if (!res1.success) {
      setUsernameStatus(`Error for ${acc1.displayName}: ${res1.error}`);
      return;
    }

    // Update Partner 2 username
    const res2 = updateAccountDetails('partner2', username2, displayName2);
    if (!res2.success) {
      setUsernameStatus(`Error for ${acc2.displayName}: ${res2.error}`);
      return;
    }

    // Update profile names in tandem
    onSaveProfile({
      ...profile,
      name1: displayName1.trim() || profile.name1,
      name2: displayName2.trim() || profile.name2,
    });

    setAccounts(getStoredAccounts());
    setUsernameStatus('✓ Usernames updated successfully! You can now log in with these handles.');
    setTimeout(() => {
      onDataReload();
    }, 500);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      setPasswordStatus('Password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus('Passwords do not match.');
      return;
    }

    const success = await updateUserPassword(targetAccount, newPassword);
    if (success) {
      const targetUser = accounts.find((a) => a.id === targetAccount);
      setPasswordStatus(`✓ Password updated for ${targetUser?.displayName}!`);
      setNewPassword('');
      setConfirmPassword('');
      setAccounts(getStoredAccounts());
    } else {
      setPasswordStatus('Error updating password.');
    }
  };

  const handleDownloadBackup = () => {
    const json = exportSanctuaryData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `our_shared_sanctuary_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupMessage('Backup file downloaded successfully!');
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importSanctuaryData(content);
      if (success) {
        setBackupMessage('Data restored successfully! Refreshing view...');
        setTimeout(() => {
          onDataReload();
          onClose();
        }, 1000);
      } else {
        setBackupMessage('Error: Invalid backup file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-[#e8e2d8] space-y-5 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-[#f0eae1]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#c85a54] fill-current" />
            <h3 className="font-serif text-xl font-bold text-[#2c2420]">
              Account & Couple Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8c827a] hover:text-[#2c2420] rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-1 p-1 bg-[#efeae3] rounded-xl overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('credentials')}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'credentials' ? 'bg-white text-[#2c2420] shadow-xs' : 'text-[#6e635b]'
            }`}
          >
            Usernames & Passwords
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'profile' ? 'bg-white text-[#2c2420] shadow-xs' : 'text-[#6e635b]'
            }`}
          >
            Couple Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'security' ? 'bg-white text-[#2c2420] shadow-xs' : 'text-[#6e635b]'
            }`}
          >
            Journal PIN
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('backup')}
            className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'backup' ? 'bg-white text-[#2c2420] shadow-xs' : 'text-[#6e635b]'
            }`}
          >
            Backup & Sync
          </button>
        </div>

        {/* Tab 1: Usernames & Passwords */}
        {activeTab === 'credentials' && (
          <div className="space-y-6">
            {/* Subsection A: Change Usernames */}
            <div className="space-y-4">
              <div className="p-3 bg-[#faf6f0] border border-[#ede7de] rounded-xl text-xs space-y-1">
                <div className="font-semibold text-[#2c2420] flex items-center gap-1.5">
                  <AtSign className="w-4 h-4 text-[#c85a54]" />
                  <span>Customize Your Login Usernames</span>
                </div>
                <p className="text-[#6e635b]">
                  You can change both usernames to your real names, nicknames, or email handles.
                </p>
              </div>

              <form onSubmit={handleUsernameSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Account 1 (Him) */}
                  <div className="p-3.5 bg-[#faf8f5] border border-[#ded6cb] rounded-2xl space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#2c2420]">
                      <User className="w-3.5 h-3.5 text-[#c85a54]" />
                      <span>Account 1 ({acc1.displayName})</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                        Username (for login) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-2 text-xs text-[#8c827a] font-mono">@</span>
                        <input
                          type="text"
                          required
                          value={username1}
                          onChange={(e) => setUsername1(e.target.value)}
                          className="w-full pl-6 pr-3 py-1.5 text-xs font-mono border border-[#ded6cb] rounded-lg bg-white"
                          placeholder="e.g. alex or myname"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        required
                        value={displayName1}
                        onChange={(e) => setDisplayName1(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-[#ded6cb] rounded-lg bg-white"
                      />
                    </div>
                  </div>

                  {/* Account 2 (Her) */}
                  <div className="p-3.5 bg-[#faf8f5] border border-[#ded6cb] rounded-2xl space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#2c2420]">
                      <Heart className="w-3.5 h-3.5 text-[#c85a54] fill-current" />
                      <span>Account 2 ({acc2.displayName})</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                        Username (for login) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-2 text-xs text-[#8c827a] font-mono">@</span>
                        <input
                          type="text"
                          required
                          value={username2}
                          onChange={(e) => setUsername2(e.target.value)}
                          className="w-full pl-6 pr-3 py-1.5 text-xs font-mono border border-[#ded6cb] rounded-lg bg-white"
                          placeholder="e.g. maya or hername"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        required
                        value={displayName2}
                        onChange={(e) => setDisplayName2(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-[#ded6cb] rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>

                {usernameStatus && (
                  <div
                    className={`p-2.5 rounded-xl text-xs font-medium ${
                      usernameStatus.includes('✓')
                        ? 'bg-[#e7f4ed] text-[#1b7a4b]'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {usernameStatus}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2 text-xs font-semibold text-white bg-[#c85a54] hover:bg-[#b34842] rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Usernames</span>
                </button>
              </form>
            </div>

            {/* Subsection B: Change Passwords */}
            <div className="pt-4 border-t border-[#f0eae1] space-y-3">
              <div className="text-xs font-bold text-[#2c2420] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#d97706]" />
                <span>Change Account Password</span>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                    Select Account
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {accounts.map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => setTargetAccount(acc.id)}
                        className={`p-2 rounded-xl border text-xs font-medium flex items-center justify-between cursor-pointer ${
                          targetAccount === acc.id
                            ? 'border-[#c85a54] bg-[#fcedeb] text-[#c85a54] font-semibold'
                            : 'border-[#ede7de] bg-[#faf8f5] text-[#2c2420]'
                        }`}
                      >
                        <span className="truncate">{acc.displayName} (@{acc.username})</span>
                        {targetAccount === acc.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="At least 4 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-[#ded6cb] rounded-lg bg-[#faf8f5]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-[#ded6cb] rounded-lg bg-[#faf8f5]"
                    />
                  </div>
                </div>

                {passwordStatus && (
                  <div
                    className={`p-2.5 rounded-xl text-xs font-medium ${
                      passwordStatus.includes('✓')
                        ? 'bg-[#e7f4ed] text-[#1b7a4b]'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {passwordStatus}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2 text-xs font-semibold text-[#2c2420] bg-[#efeae3] hover:bg-[#e4ddd3] border border-[#ded6cb] rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  Update Password
                </button>
              </form>
            </div>

            {/* GitHub Privacy Protection Guarantee */}
            <div className="p-3 bg-[#e7f4ed] border border-[#a8dfc2] rounded-2xl flex items-start gap-2.5 text-xs text-[#1b7a4b]">
              <Shield className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold">Public GitHub Privacy Safe</span>
                <p className="text-[11px] opacity-90 leading-relaxed">
                  All photos you upload and passwords you create are stored strictly in this browser’s private database.
                  Nothing is written to git source code or visible when your repository is published on GitHub.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Couple Profile Info */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSubmitProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={name1}
                  onChange={(e) => setName1(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-[#ded6cb] rounded-lg bg-[#faf8f5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                  Her Name
                </label>
                <input
                  type="text"
                  required
                  value={name2}
                  onChange={(e) => setName2(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-[#ded6cb] rounded-lg bg-[#faf8f5]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                  Your Nickname
                </label>
                <input
                  type="text"
                  placeholder="e.g., My Love"
                  value={nickname1}
                  onChange={(e) => setNickname1(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-[#ded6cb] rounded-lg bg-[#faf8f5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                  Her Nickname
                </label>
                <input
                  type="text"
                  placeholder="e.g., Honey"
                  value={nickname2}
                  onChange={(e) => setNickname2(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-[#ded6cb] rounded-lg bg-[#faf8f5]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                Official Relationship Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-[#ded6cb] rounded-lg bg-[#faf8f5]"
              />
              <p className="text-[11px] text-[#8c827a] mt-0.5">
                Default: January 6th, 2026. The live relationship counter counts upwards from this day.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                Anniversary Motto / Love Note
              </label>
              <input
                type="text"
                placeholder="The day my whole world became brighter."
                value={anniversaryNote}
                onChange={(e) => setAnniversaryNote(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-[#ded6cb] rounded-lg bg-[#faf8f5]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0eae1]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#6e635b] hover:text-[#2c2420] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-[#c85a54] hover:bg-[#b34842] rounded-lg shadow-xs cursor-pointer"
              >
                Save Couple Settings
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Security & Journal PIN */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="p-3 bg-[#faf6f0] border border-[#ede7de] rounded-xl text-xs space-y-1">
              <div className="font-semibold text-[#2c2420] flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#c85a54]" />
                <span>Protect Private Journal Memories</span>
              </div>
              <p className="text-[#6e635b]">
                When enabled, opening the journal tab requires entering a 4-digit PIN code so you can safely share your screen or phone.
              </p>
            </div>

            <label className="flex items-center gap-2 text-sm text-[#2c2420] cursor-pointer">
              <input
                type="checkbox"
                checked={pinLockEnabled}
                onChange={(e) => setPinLockEnabled(e.target.checked)}
                className="rounded text-[#c85a54] focus:ring-[#c85a54]"
              />
              <span className="font-medium">Require PIN to open Private Journal</span>
            </label>

            {pinLockEnabled && (
              <div>
                <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                  Secret 4-Digit PIN Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-32 px-3 py-1.5 text-center text-lg font-bold tracking-widest border border-[#ded6cb] rounded-lg bg-[#faf8f5]"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0eae1]">
              <button
                type="button"
                onClick={() => {
                  onSaveProfile({
                    ...profile,
                    pinLockEnabled,
                    pinCode,
                  });
                  onClose();
                }}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#c85a54] hover:bg-[#b34842] rounded-lg shadow-xs cursor-pointer"
              >
                Save Security Settings
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Backup */}
        {activeTab === 'backup' && (
          <div className="space-y-4 text-xs">
            <p className="text-[#6e635b]">
              You can export all photos, journal letters, calendar events, and bucket list items into a single backup JSON file, or restore from a previous backup.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleDownloadBackup}
                className="p-4 border border-[#ded6cb] rounded-xl text-center hover:border-[#c85a54] bg-[#faf8f5] transition-colors space-y-2 cursor-pointer"
              >
                <Download className="w-5 h-5 mx-auto text-[#c85a54]" />
                <div className="font-semibold text-[#2c2420]">Download Backup JSON</div>
                <div className="text-[11px] text-[#8c827a]">Save a copy of all our memories</div>
              </button>

              <label className="p-4 border border-[#ded6cb] rounded-xl text-center hover:border-[#c85a54] bg-[#faf8f5] transition-colors space-y-2 cursor-pointer block">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
                <Upload className="w-5 h-5 mx-auto text-[#d97706]" />
                <div className="font-semibold text-[#2c2420]">Restore from Backup</div>
                <div className="text-[11px] text-[#8c827a]">Import memories from another device</div>
              </label>
            </div>

            {backupMessage && (
              <div className="p-2.5 rounded-lg bg-[#e7f4ed] text-[#1b7a4b] font-medium text-center">
                {backupMessage}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
