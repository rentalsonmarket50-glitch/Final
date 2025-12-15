import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface ImageGalleryModalProps {
  images: string[];
  initialIndex?: number;
  title?: string;
  onClose: () => void;
}

export const ImageGalleryModal = ({
  images,
  initialIndex = 0,
  title,
  onClose,
}: ImageGalleryModalProps) => {
  // Validate and filter images
  const isValidImageUrl = (url: any): boolean => {
    if (!url) return false;
    const urlStr = String(url).trim();
    if (!urlStr || urlStr === '[]' || urlStr === 'null' || urlStr === 'undefined' || urlStr === '[object Object]') {
      return false;
    }
    return urlStr.startsWith('/') || urlStr.startsWith('http://') || urlStr.startsWith('https://');
  };

  const validImages = Array.isArray(images) 
    ? images.filter(img => isValidImageUrl(img)).map(img => String(img).trim())
    : ['/assets/hero.jpg'];
  
  const safeImages = validImages.length > 0 ? validImages : ['/assets/hero.jpg'];
  const safeInitialIndex = Math.min(initialIndex, safeImages.length - 1);
  
  const [currentIndex, setCurrentIndex] = useState(safeInitialIndex);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [safeImages.length, onClose]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-95 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 md:p-6 text-white">
        <div className="flex items-center gap-4">
          <h2 className="text-lg md:text-xl font-semibold">
            {title || 'Photo Gallery'}
          </h2>
          <span className="text-sm text-gray-300">
            {currentIndex + 1} / {safeImages.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
          aria-label="Close gallery"
        >
          <XMarkIcon className="h-6 w-6 md:h-8 md:w-8" />
        </button>
      </div>

      {/* Main Image Container */}
      <div className="flex-1 relative flex items-center justify-center p-4 md:p-8">
        {/* Previous Button */}
        {safeImages.length > 1 && (
          <button
            onClick={goToPrevious}
            className="absolute left-4 md:left-8 p-3 md:p-4 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition-all z-10 backdrop-blur-sm"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="h-6 w-6 md:h-8 md:w-8 text-white" />
          </button>
        )}

        {/* Main Image */}
        <div className="relative w-full h-full max-w-7xl mx-auto">
          <Image
            src={safeImages[currentIndex] || '/assets/hero.jpg'}
            alt={`${title || 'Gallery'} image ${currentIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
            style={{ objectFit: 'contain' }}
            className="transition-opacity duration-300"
            priority
            quality={90}
          />
        </div>

        {/* Next Button */}
        {safeImages.length > 1 && (
          <button
            onClick={goToNext}
            className="absolute right-4 md:right-8 p-3 md:p-4 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition-all z-10 backdrop-blur-sm"
            aria-label="Next image"
          >
            <ChevronRightIcon className="h-6 w-6 md:h-8 md:w-8 text-white" />
          </button>
        )}
      </div>

      {/* Thumbnail Strip */}
      {safeImages.length > 1 && (
        <div className="border-t border-gray-700 bg-black bg-opacity-50 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-2">
              {safeImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? 'border-white scale-110'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-200 hover:scale-110"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ImageGalleryModal;

