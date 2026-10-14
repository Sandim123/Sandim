import React, { useState, useRef } from 'react';
import { PhotoMemory, PartnerProfile } from '../types';
import { LightboxModal } from './LightboxModal';
import { formatDatePretty } from '../lib/dateUtils';
import {
  Upload,
  Heart,
  Image as ImageIcon,
  MapPin,
  Calendar,
  Plus,
  Filter,
  Check,
  X,
} from 'lucide-react';

interface PhotoGalleryProps {
  photos: PhotoMemory[];
  onAddPhoto: (photo: Omit<PhotoMemory, 'id' | 'createdAt'>) => void;
  onDeletePhoto: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  profile: PartnerProfile;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  onAddPhoto,
  onDeletePhoto,
  onToggleFavorite,
  profile,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Upload modal form state
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<PhotoMemory['category']>('dates');
  const [tagsInput, setTagsInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter photos
  const filteredPhotos = photos.filter((p) => {
    if (activeCategory === 'favorites') return p.isFavorite;
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  // Handle client-side image compression
  const processImageFile = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1600;
        const MAX_HEIGHT = 1600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setPreviewUrl(compressedDataUrl);
        }
        setIsProcessing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl || !title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onAddPhoto({
      title: title.trim(),
      caption: caption.trim() || undefined,
      imageUrl: previewUrl,
      date,
      location: location.trim() || undefined,
      uploadedBy: profile.activeUser,
      category,
      isFavorite: false,
      tags: tags.length > 0 ? tags : undefined,
    });

    // Reset form
    setTitle('');
    setCaption('');
    setLocation('');
    setTagsInput('');
    setPreviewUrl(null);
    setIsUploadOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header section with Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#e7e1d8]">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-[#c85a54]">
            Visual Chronicle
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#2c2420]">
            Our Shared Photo Album
          </h2>
          <p className="text-xs sm:text-sm text-[#6e635b] mt-1">
            {photos.length} captured memories together since January 6th, 2026
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#c85a54] hover:bg-[#b34842] rounded-lg transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Photos</span>
        </button>
      </div>

      {/* Category Filter Bar (Functional segmented buttons per frontend-design rule) */}
      <div className="flex items-center gap-1.5 p-1 bg-[#efeae3] rounded-lg overflow-x-auto">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeCategory === 'all'
              ? 'bg-white text-[#2c2420] shadow-xs font-semibold'
              : 'text-[#6e635b] hover:text-[#2c2420]'
          }`}
        >
          All Memories ({photos.length})
        </button>
        <button
          onClick={() => setActiveCategory('favorites')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
            activeCategory === 'favorites'
              ? 'bg-white text-[#c85a54] shadow-xs font-semibold'
              : 'text-[#6e635b] hover:text-[#2c2420]'
          }`}
        >
          <Heart className="w-3 h-3 fill-current" />
          Favorites ({photos.filter((p) => p.isFavorite).length})
        </button>
        <button
          onClick={() => setActiveCategory('trips')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeCategory === 'trips'
              ? 'bg-white text-[#2c2420] shadow-xs font-semibold'
              : 'text-[#6e635b] hover:text-[#2c2420]'
          }`}
        >
          Trips & Getaways
        </button>
        <button
          onClick={() => setActiveCategory('dates')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeCategory === 'dates'
              ? 'bg-white text-[#2c2420] shadow-xs font-semibold'
              : 'text-[#6e635b] hover:text-[#2c2420]'
          }`}
        >
          Date Nights
        </button>
        <button
          onClick={() => setActiveCategory('everyday')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeCategory === 'everyday'
              ? 'bg-white text-[#2c2420] shadow-xs font-semibold'
              : 'text-[#6e635b] hover:text-[#2c2420]'
          }`}
        >
          Everyday Joy
        </button>
        <button
          onClick={() => setActiveCategory('celebrations')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeCategory === 'celebrations'
              ? 'bg-white text-[#2c2420] shadow-xs font-semibold'
              : 'text-[#6e635b] hover:text-[#2c2420]'
          }`}
        >
          Celebrations
        </button>
      </div>

      {/* Bento & Masonry Photo Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="bg-white border border-[#e8e2d8] rounded-2xl p-12 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#f4ece3] text-[#c85a54] flex items-center justify-center mx-auto">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#2c2420]">
              No photos in this category yet
            </h3>
            <p className="text-xs text-[#6e635b]">
              Upload a snapshot of your favorite moments together to keep them here forever.
            </p>
          </div>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#c85a54] hover:bg-[#b34842] rounded-lg transition-colors cursor-pointer"
          >
            Upload First Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPhotos.map((photo, index) => {
            // Give featured or first items a wider bento feel on larger screens
            const isFeatured = index === 0;

            return (
              <div
                key={photo.id}
                onClick={() => setLightboxIndex(index)}
                className={`group relative bg-white border border-[#e8e2d8] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col ${
                  isFeatured ? 'sm:col-span-2 lg:col-span-2' : ''
                }`}
              >
                {/* Image slot with zero-broken-image fallback container */}
                <div
                  className={`relative w-full bg-[#2a2420] overflow-hidden ${
                    isFeatured ? 'h-72 sm:h-96' : 'h-64 sm:h-72'
                  }`}
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />

                  {/* Gradient Scrim for media overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Top-Right Favorite button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(photo.id);
                    }}
                    title={photo.isFavorite ? 'Unfavorite' : 'Add to favorites'}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        photo.isFavorite
                          ? 'fill-[#c85a54] text-[#c85a54]'
                          : 'text-white/80 hover:text-white'
                      }`}
                    />
                  </button>

                  {/* Bottom Image Overlay Content */}
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white space-y-1.5">
                    {/* Unboxed Metadata per anti-pill rule */}
                    <div className="flex items-center gap-2 text-[11px] text-[#e0d7cd] tracking-wide">
                      <span>{formatDatePretty(photo.date)}</span>
                      {photo.location && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#fca5a5]" />
                            {photo.location}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug group-hover:text-[#fcd34d] transition-colors">
                      {photo.title}
                    </h3>

                    {photo.caption && (
                      <p className="text-xs text-[#cfc7be] line-clamp-2 leading-relaxed font-light">
                        {photo.caption}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <LightboxModal
          photos={filteredPhotos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(newIdx) => setLightboxIndex(newIdx)}
          onToggleFavorite={onToggleFavorite}
          onDeletePhoto={onDeletePhoto}
          profile={profile}
        />
      )}

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-[#e8e2d8] space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0eae1]">
              <h3 className="font-serif text-xl font-bold text-[#2c2420]">
                Add a Shared Memory
              </h3>
              <button
                onClick={() => {
                  setIsUploadOpen(false);
                  setPreviewUrl(null);
                }}
                className="p-1.5 text-[#8c827a] hover:text-[#2c2420] rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* Image Drag/Drop or Select Area */}
              <div>
                <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1.5">
                  Choose Photo
                </label>

                {previewUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-[#ded6cb] h-48 bg-black flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt="Upload preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setPreviewUrl(null)}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full text-xs"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#ded6cb] hover:border-[#c85a54] rounded-xl p-6 text-center cursor-pointer transition-colors bg-[#faf8f5]"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-full bg-[#f2ece3] text-[#c85a54] flex items-center justify-center mx-auto mb-2">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-[#2c2420]">
                      {isProcessing ? 'Optimizing photo...' : 'Click to browse or drop an image here'}
                    </p>
                    <p className="text-[11px] text-[#8c827a] mt-0.5">
                      High-resolution photos are automatically optimized and saved to your private album.
                    </p>
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                  Memory Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., That funny picnic in the park"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-[#ded6cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c85a54]/20 focus:border-[#c85a54] bg-[#faf8f5]"
                />
              </div>

              {/* Caption / Story */}
              <div>
                <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                  Story / What happened?
                </label>
                <textarea
                  rows={3}
                  placeholder="What made this moment special? What did you say to each other?"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-[#ded6cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c85a54]/20 focus:border-[#c85a54] bg-[#faf8f5]"
                />
              </div>

              {/* Date & Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                    Date of Memory
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-[#ded6cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c85a54]/20 focus:border-[#c85a54] bg-[#faf8f5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Central Park / Paris"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-[#ded6cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c85a54]/20 focus:border-[#c85a54] bg-[#faf8f5]"
                  />
                </div>
              </div>

              {/* Category & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PhotoMemory['category'])}
                    className="w-full px-3.5 py-2 text-sm border border-[#ded6cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c85a54]/20 focus:border-[#c85a54] bg-[#faf8f5]"
                  >
                    <option value="dates">Date Nights</option>
                    <option value="trips">Trips & Getaways</option>
                    <option value="everyday">Everyday Joy</option>
                    <option value="celebrations">Celebrations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5d524a] uppercase tracking-wider mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="sunset, laugh, cafe"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-[#ded6cb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c85a54]/20 focus:border-[#c85a54] bg-[#faf8f5]"
                  />
                </div>
              </div>

              {/* Submit / Cancel */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0eae1]">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#6e635b] hover:text-[#2c2420] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!previewUrl || !title.trim()}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#c85a54] hover:bg-[#b34842] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  Save to Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
