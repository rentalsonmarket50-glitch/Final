'use client';

import { FC, useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { HeartIcon } from '@heroicons/react/24/outline';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import ContactForm from '../ContactForm';

interface IPreLaunchProperty {
  id: string;
  img: string;
  title: string;
  description: string;
  location: string;
  price: string;
  star?: number;
  reviews?: number;
}

interface IAppPreLaunchProps {
  properties: IPreLaunchProperty[];
}

const AppPreLaunch: FC<IAppPreLaunchProps> = ({ properties }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<IPreLaunchProperty | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const propertiesPerView = 3;
  const totalSlides = Math.ceil(properties.length / propertiesPerView);

  // Auto slide functionality
  useEffect(() => {
    if (isAutoPlaying && properties.length > propertiesPerView) {
      autoPlayIntervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
      }, 4000); // Change slide every 4 seconds
    }

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [isAutoPlaying, totalSlides, properties.length]);

  // Scroll to current index
  useEffect(() => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth / propertiesPerView;
      scrollContainerRef.current.scrollTo({
        left: currentIndex * cardWidth * propertiesPerView,
        behavior: 'smooth',
      });
    }
  }, [currentIndex, propertiesPerView]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
  };

  const goToNext = () => {
    goToSlide((currentIndex + 1) % totalSlides);
  };

  return (
    <section className="my-12 py-8">
      <div className="container">
        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Pre-launch
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {properties.length > propertiesPerView && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-2 shadow-lg hover:shadow-xl transition-all hover:scale-110 -translate-x-4"
                aria-label="Previous properties"
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-2 shadow-lg hover:shadow-xl transition-all hover:scale-110 translate-x-4"
                aria-label="Next properties"
              >
                <ChevronRightIcon className="h-5 w-5 text-gray-700" />
              </button>
            </>
          )}

          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {properties.map((property, index) => (
              <div
                key={property.id || index}
                className="flex-shrink-0 w-full md:w-[calc(33.333%-11px)] snap-center"
              >
                <div 
                  onClick={() => setSelectedProperty(property)}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                >
                    {/* Image */}
                    <div className="relative w-full h-48 md:h-56 overflow-hidden">
                      <Image
                        src={property.img}
                        alt={property.title}
                        fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: 'cover' }}
                        className="group-hover:scale-105 transition-transform duration-300"
                        placeholder="blur"
                        blurDataURL={property.img}
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                        e.stopPropagation();
                        }}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform z-10"
                      >
                        <HeartIcon className="h-5 w-5 text-gray-700" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
                        {property.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {property.description}
                      </p>
                      <p className="text-sm text-gray-500 mb-3">{property.location}</p>
                    <div className="flex items-center justify-end">
                        <div className="text-right">
                          <span className="text-base font-semibold text-gray-900">
                            {property.price}
                          </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Navigation */}
        {properties.length > propertiesPerView && (
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(totalSlides)].map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === index
                    ? 'w-8 bg-gray-900'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Contact Form Modal */}
      {selectedProperty && (
        <ContactForm
          propertyId={selectedProperty.id}
          propertyTitle={selectedProperty.title}
          propertyDescription={selectedProperty.description}
          onClose={() => setSelectedProperty(null)}
          onSubmitSuccess={() => setSelectedProperty(null)}
        />
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default AppPreLaunch;

