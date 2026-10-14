import React, { useEffect } from 'react';
import { PhotoMemory, PartnerProfile } from '../types';
import { formatDatePretty } from '../lib/dateUtils';
import { X, ChevronLeft, ChevronRight, Heart, MapPin, Calendar, Download, Trash2 } from 'lucide-react';

interface LightboxModalProps {
  photos: PhotoMemory[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onToggleFavorite: (id: string) => void;
  onDeletePhoto: (id: string) => void;
  profile: PartnerProfile;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  photos,
  currentIndex,
  onClose,
  onNavigate,
  onToggleFavorite,
  onDeletePhoto,
  profile,
}) => {
  const currentPhoto = photos[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === 'ArrowRight' && currentIndex < photos.length - 1) onNavigate(currentIndex + 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, photos.length, onClose, onNavigate]);

  if (!currentPhoto) return null;

  const uploadedByName =
    currentPhoto.uploadedBy === 'partner1'
      ? profile.name1
      : currentPhoto.uploadedBy === 'partner2'
      ? profile.name2
      : 'Both of us';

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = currentPhoto.imageUrl;
    link.download = `${currentPhoto.title.toLowerCase().replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-6 transition-all">
      {/* Close button (min 44px tap target) */}
      <button
        onClick={onClose}
        aria-label="Close Lightbox"
        className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 w-11 h-11 flex items-center justify-center text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button (min 44px tap target) */}
      {currentIndex > 0 && (
        <button
          onClick={() => onNavigate(currentIndex - 1)}
          aria-label="Previous photo"
          className="absolute left-2 sm:left-6 z-50 w-11 h-11 flex items-center justify-center text-white/80 hover:text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next button (min 44px tap target) */}
      {currentIndex < photos.length - 1 && (
        <button
          onClick={() => onNavigate(currentIndex + 1)}
          aria-label="Next photo"
          className="absolute right-2 sm:right-6 z-50 w-11 h-11 flex items-center justify-center text-white/80 hover:text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Main card */}
      <div className="relative max-w-5xl w-full max-h-[92vh] flex flex-col md:flex-row bg-[#1c1917] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        {/* Left: Image Container */}
        <div className="flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[220px] sm:min-h-[300px] md:min-h-[500px]">
          <img
            src={currentPhoto.imageUrl}
            alt={currentPhoto.title}
            referrerPolicy="no-referrer"
            className="w-full h-full max-h-[70vh] md:max-h-[85vh] object-contain"
          />
        </div>

        {/* Right: Story details */}
        <div className="w-full md:w-80 lg:w-96 p-6 flex flex-col justify-between bg-[#1f1b18] text-[#f5f1eb] overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#d97706] font-semibold">
                Photo {currentIndex + 1} of {photos.length}
              </span>
              <button
                onClick={() => onToggleFavorite(currentPhoto.id)}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                title={currentPhoto.isFavorite ? 'Unfavorite' : 'Add to favorites'}
              >
                <Heart
                  className={`w-5 h-5 ${
                    currentPhoto.isFavorite
                      ? 'fill-[#c85a54] text-[#c85a54]'
                      : 'text-white/60 hover:text-white'
                  }`}
                />
              </button>
            </div>

            <h2 className="font-serif text-2xl font-bold text-white leading-snug">
              {currentPhoto.title}
            </h2>

            {currentPhoto.caption && (
              <p className="text-sm text-[#d4ccc2] leading-relaxed italic">
                "{currentPhoto.caption}"
              </p>
            )}

            <div className="space-y-2 pt-3 border-t border-white/10 text-xs text-[#a89d91]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#c85a54]" />
                <span>Captured: {formatDatePretty(currentPhoto.date)}</span>
              </div>

              {currentPhoto.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#c85a54]" />
                  <span>{currentPhoto.location}</span>
                </div>
              )}

              <div className="text-xs text-[#a89d91]">
                Uploaded by: <span className="font-medium text-white">{uploadedByName}</span>
              </div>

              {currentPhoto.tags && currentPhoto.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {currentPhoto.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] text-[#cfc7be] bg-white/10 px-2 py-0.5 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action buttons footer */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10">
            <button
              onClick={downloadImage}
              className="flex items-center gap-1.5 text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Save Photo</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to remove this photo from your shared album?')) {
                  onDeletePhoto(currentPhoto.id);
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 px-3 py-1.5 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
