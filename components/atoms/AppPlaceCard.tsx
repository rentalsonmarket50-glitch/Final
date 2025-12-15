import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
// icons
import { HeartIcon } from '@heroicons/react/24/outline';

const AppPlaceCard = ({ data }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Validate and get image URL
  const getValidImageUrl = (img: any): string => {
    // Handle null, undefined, empty string
    if (!img) return '/assets/hero.jpg';
    
    // Convert to string and trim
    const imgStr = String(img).trim();
    
    // Check for invalid values
    if (!imgStr || 
        imgStr === '[]' || 
        imgStr === 'null' || 
        imgStr === 'undefined' ||
        imgStr === '[object Object]' ||
        imgStr.toLowerCase() === 'null' ||
        imgStr.toLowerCase() === 'undefined') {
      return '/assets/hero.jpg';
    }
    
    // Must start with /, http://, or https://
    if (imgStr.startsWith('/') || imgStr.startsWith('http://') || imgStr.startsWith('https://')) {
      return imgStr;
    }
    
    // If it doesn't start with valid prefix, return default
    return '/assets/hero.jpg';
  };

  // Ensure we always have a valid image URL
  const imageUrl = getValidImageUrl(data?.img || data?.images?.[0]);

  // Calculate total price for stay (2 nights for location sections)
  const nights = 2;
  const priceString = data?.price ? String(data.price) : '₹0';
  const priceMatch = priceString.match(/₹?([\d,]+)/);
  const pricePerNight = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0;
  const totalPrice = pricePerNight * nights;
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(totalPrice);

  // Format dates (if available)
  const checkInDate = data?.checkIn || '20 Dec';
  const checkOutDate = data?.checkOut || '25 Dec';

  const listingId = data?.id || '1';
  const listingUrl = `/listing/${listingId}`;

  return (
    <Link href={listingUrl}>
      <div className="mb-8 cursor-pointer group">
        {/* Image Container */}
        <div className="relative w-full h-64 md:h-72 rounded-xl overflow-hidden mb-3">
          <Image
            src={imageUrl}
            alt={data?.title || 'Property'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="rounded-xl transition-transform duration-300 group-hover:scale-105"
            placeholder="blur"
            blurDataURL={imageUrl}
            quality={80}
          />

          {/* Heart Icon */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform z-10"
          >
            <HeartIcon
              className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
            />
          </button>

          {/* Guest Favourite Badge */}
          {data.isGuestFavourite && (
            <div className="absolute top-3 left-3 bg-white px-3 py-1 rounded-full text-xs font-semibold shadow-md z-10">
              Guest favourite
            </div>
          )}

          {/* Image Pagination Dots */}
          {data?.images && Array.isArray(data.images) && data.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
              {data.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImageIndex(index);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1">
          {/* Title */}
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {data?.title || 'Property'}
          </h3>

          {/* Description */}
          {data?.description && (
            <p className="text-sm text-gray-500 line-clamp-2">{data.description}</p>
          )}

          {/* Location */}
          <p className="text-sm text-gray-500 truncate">{data?.location || 'Location not specified'}</p>

          {/* Price */}
          <div className="flex items-center justify-end pt-2">
            <div className="text-right">
              <div className="flex items-baseline gap-1">
                <span className="text-base font-semibold">{formattedPrice}</span>
                <span className="text-sm text-gray-500">/month</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AppPlaceCard;
