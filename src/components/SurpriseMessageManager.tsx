import React, { useState } from 'react';
import { PartnerWelcomeMessage, PartnerProfile } from '../types';
import { getStoredWelcomeMessage, saveWelcomeMessage } from '../lib/auth';
import { WelcomePopupModal } from './WelcomePopupModal';
import {
  Sparkles,
  Heart,
  Eye,
  Check,
  Save,
  MessageCircle,
  X,
  Bell,
  Clock,
} from 'lucide-react';

interface SurpriseMessageManagerProps {
  profile: PartnerProfile;
  onClose: () => void;
  onMessageSaved?: (msg: PartnerWelcomeMessage) => void;
}

export const SurpriseMessageManager: React.FC<SurpriseMessageManagerProps> = ({
  profile,
  onClose,
  onMessageSaved,
}) => {
  const [currentMsg, setCurrentMsg] = useState<PartnerWelcomeMessage>(getStoredWelcomeMessage);

  const [title, setTitle] = useState(currentMsg.title);
  const [message, setMessage] = useState(currentMsg.message);
  const [isEnabled, setIsEnabled] = useState(currentMsg.isEnabled);
  const [frequency, setFrequency] = useState<PartnerWelcomeMessage['frequency']>(
    currentMsg.frequency || 'every_session'
  );
  const [photoUrl, setPhotoUrl] = useState(currentMsg.photoUrl || '');
  const [theme, setTheme] = useState<PartnerWelcomeMessage['theme']>(currentMsg.theme || 'romantic');

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: PartnerWelcomeMessage = {
      ...currentMsg,
      id: `wm-${Date.now()}`,
      title: title.trim(),
      message: message.trim(),
      isEnabled,
      frequency,
      photoUrl: photoUrl.trim() || undefined,
      theme,
      // If updating with a new message, reset acknowledgment so she sees it fresh!
      acknowledgedAt: undefined,
    };

    saveWelcomeMessage(updated);
    setCurrentMsg(updated);
    if (onMessageSaved) onMessageSaved(updated);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const previewMessageObj: PartnerWelcomeMessage = {
    ...currentMsg,
    title: title.trim() || 'A Sweet Note For You',
    message: message.trim() || 'Your message preview...',
    photoUrl: photoUrl.trim() || undefined,
    theme,
    isEnabled,
    frequency,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#e8e2d8] space-y-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#f0eae1]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#c85a54]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Surprise Welcome Pop-up</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#2c2420]">
              Pop-up Message for {profile.name2}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8c827a] hover:text-[#2c2420] rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#6e635b]">
          Whenever <strong>{profile.name2}</strong> logs in with her account, this message will pop up
          instantly in a romantic modal with confetti and an option for her to send a sweet reply back to you.
        </p>

        {/* Existing Status / Reply Banner */}
        {currentMsg.responseNote && (
          <div className="p-3.5 bg-[#fcedeb] border border-[#fecdd3] rounded-2xl text-xs space-y-1">
            <div className="font-semibold text-[#c85a54] flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4" />
              <span>Her Latest Reply to Your Message:</span>
            </div>
            <p className="text-[#3c342f] italic font-serif text-sm">
              "{currentMsg.responseNote}"
            </p>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Active toggle */}
          <div className="flex items-center justify-between p-3.5 bg-[#faf8f5] border border-[#ede7de] rounded-xl">
            <div>
              <div className="text-xs font-semibold text-[#2c2420]">Enable Welcome Pop-up</div>
              <div className="text-[11px] text-[#8c827a]">Show message right after she logs into her account</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#c85a54]"></div>
            </label>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
              Popup Heading *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Good Morning My Queen 💕, Surprise For Tonight!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-[#ded6cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c85a54]/20 focus:border-[#c85a54] bg-[#faf8f5]"
            />
          </div>

          {/* Message content */}
          <div>
            <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
              Your Message / Surprise Announcement *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Write what you want her to read the moment she opens the website..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-[#ded6cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c85a54]/20 focus:border-[#c85a54] bg-[#faf8f5] font-serif leading-relaxed"
            />
          </div>

          {/* Frequency & Theme */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                Display Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as PartnerWelcomeMessage['frequency'])}
                className="w-full px-3 py-1.5 text-xs border border-[#ded6cb] rounded-lg bg-[#faf8f5]"
              >
                <option value="every_session">Every time she logs in</option>
                <option value="once_until_acknowledged">Once (until she reads & replies)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                Attach Photo URL (Optional)
              </label>
              <input
                type="text"
                placeholder="Image link or data URL"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#ded6cb] rounded-lg bg-[#faf8f5]"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#f0eae1]">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#2c2420] bg-[#efeae3] hover:bg-[#e4ddd3] rounded-lg transition-colors border border-[#ded6cb] cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#c85a54]" />
              <span>Preview As Her</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#6e635b] hover:text-[#2c2420]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#c85a54] hover:bg-[#b34842] rounded-lg shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Pop-up Message</span>
              </button>
            </div>
          </div>

          {saveSuccess && (
            <div className="p-2.5 rounded-lg bg-[#e7f4ed] text-[#1b7a4b] text-xs font-semibold text-center">
              ✓ Pop-up message updated! She will see it right when she logs in.
            </div>
          )}
        </form>

        {/* Live Preview Modal */}
        {isPreviewOpen && (
          <WelcomePopupModal
            message={previewMessageObj}
            profile={profile}
            onClose={() => setIsPreviewOpen(false)}
          />
        )}
      </div>
    </div>
  );
};
