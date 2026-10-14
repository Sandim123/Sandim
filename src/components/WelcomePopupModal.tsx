import React, { useState, useEffect } from 'react';
import { PartnerWelcomeMessage, PartnerProfile } from '../types';
import { acknowledgeWelcomeMessage, recordMessageSeen } from '../lib/auth';
import confetti from 'canvas-confetti';
import { Heart, X, Send, Sparkles, MessageCircle, Calendar } from 'lucide-react';

interface WelcomePopupModalProps {
  message: PartnerWelcomeMessage;
  profile: PartnerProfile;
  onClose: () => void;
  onReplySent?: (reply: string) => void;
}

const QUICK_REPLIES = [
  'I love you so much! 💕',
  'You made my whole day 🥰',
  'Can’t wait for our date! ✨',
  'Counting down every second with you ❤️',
];

export const WelcomePopupModal: React.FC<WelcomePopupModalProps> = ({
  message,
  profile,
  onClose,
  onReplySent,
}) => {
  const [customReply, setCustomReply] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [replySent, setReplySent] = useState(false);

  useEffect(() => {
    // Record view count
    recordMessageSeen(message.id);

    // Trigger sweet romantic celebration
    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#c85a54', '#f4a261', '#e76f51', '#fecdd3', '#ffd166'],
    });
  }, [message.id]);

  const handleSendReply = (textToSend: string) => {
    if (!textToSend.trim()) return;
    acknowledgeWelcomeMessage(message.id, textToSend.trim());
    if (onReplySent) onReplySent(textToSend.trim());
    setReplySent(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const authorName = profile.name1; // Him

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-300">
      <div className="relative max-w-lg w-full bg-[#faf7f2] border-2 border-[#c85a54]/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-[#2c2420] overflow-hidden">
        {/* Subtle romantic corner decoration */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#c85a54]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#d97706]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close message"
          className="absolute top-4 right-4 p-2 text-[#8c827a] hover:text-[#2c2420] rounded-full hover:bg-black/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Ribbon */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcedeb] text-[#c85a54] text-xs font-semibold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-[#c85a54] animate-bounce" />
            <span>A Message Waiting For You</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2c2420] leading-snug">
            {message.title || 'A Sweet Note For You'}
          </h2>

          <div className="text-xs text-[#8c827a] flex items-center justify-center gap-1.5">
            <span>Written with love by <strong className="text-[#c85a54]">{authorName}</strong></span>
          </div>
        </div>

        {/* Optional Attached Photo */}
        {message.photoUrl && (
          <div className="rounded-2xl overflow-hidden border border-[#ede7de] max-h-56 bg-black">
            <img
              src={message.photoUrl}
              alt="Surprise photo"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Love Note Body */}
        <div className="bg-white border border-[#e8e2d8] rounded-2xl p-5 sm:p-6 shadow-xs">
          <p className="font-serif text-base sm:text-lg text-[#3c342f] leading-relaxed whitespace-pre-line italic">
            "{message.message}"
          </p>
        </div>

        {/* Reply Section */}
        {replySent ? (
          <div className="p-3 bg-[#e7f4ed] text-[#1b7a4b] text-center rounded-xl font-semibold text-xs animate-in zoom-in-95">
            ✓ Your love reply was delivered to {authorName}!
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-xs text-[#6e635b]">
              <span className="font-semibold flex items-center gap-1 text-[#2c2420]">
                <MessageCircle className="w-3.5 h-3.5 text-[#c85a54]" />
                Send a quick reply to {authorName}:
              </span>
              {!isReplying && (
                <button
                  onClick={() => setIsReplying(true)}
                  className="text-[#c85a54] hover:underline cursor-pointer"
                >
                  Write custom note
                </button>
              )}
            </div>

            {/* Quick response buttons */}
            {!isReplying ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_REPLIES.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendReply(reply)}
                    className="px-3 py-2 text-xs font-medium bg-white hover:bg-[#fff5f4] text-[#4a4038] hover:text-[#c85a54] border border-[#e8e2d8] hover:border-[#c85a54]/40 rounded-xl transition-all text-left shadow-2xs"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  rows={2}
                  placeholder={`Write your sweet response to ${authorName}...`}
                  value={customReply}
                  onChange={(e) => setCustomReply(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#ded6cb] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c85a54] bg-white"
                  autoFocus
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setIsReplying(false)}
                    className="px-3 py-1 text-xs text-[#8c827a] hover:text-[#2c2420]"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => handleSendReply(customReply)}
                    disabled={!customReply.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#c85a54] hover:bg-[#b34842] disabled:opacity-50 rounded-lg shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reply</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Dismiss Button */}
        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 text-xs font-semibold text-[#6e635b] hover:text-[#2c2420] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
          >
            Enter Our Sanctuary →
          </button>
        </div>
      </div>
    </div>
  );
};
