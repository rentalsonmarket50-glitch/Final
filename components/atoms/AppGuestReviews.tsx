'use client';

import { FC, useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface IReview {
  name: string;
  location: string;
  date: string;
  text: string;
  rating: number;
}

const reviews: IReview[] = [
  {
    name: 'Anita Desai',
    location: 'Mumbai',
    date: 'November 2025',
    text: 'Amazing experience! The property was exactly as described and the host was very helpful. Would definitely recommend to anyone looking for a great stay.',
    rating: 5,
  },
  {
    name: 'Vikram Mehta',
    location: 'Delhi',
    date: 'October 2025',
    text: 'Great location, clean and comfortable. The host went above and beyond to make sure we had everything we needed. Would definitely book again!',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    location: 'Bangalore',
    date: 'September 2025',
    text: 'Perfect stay for our family vacation. The property was spacious, well-maintained, and had all the amenities we needed. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Rajesh Kumar',
    location: 'Pune',
    date: 'August 2025',
    text: 'Excellent service and beautiful property. The location was perfect and the host was very accommodating. Will definitely return!',
    rating: 5,
  },
];

const AppGuestReviews: FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = reviews.length;
  const slidesToShow = 2; // Show 2 cards on desktop, 1 on mobile

  // Auto slide functionality
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayIntervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
      }, 4000); // Change slide every 4 seconds
    }

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [isAutoPlaying, totalSlides]);

  // Scroll to current index
  useEffect(() => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth / slidesToShow;
      scrollContainerRef.current.scrollTo({
        left: currentIndex * cardWidth,
        behavior: 'smooth',
      });
    }
  }, [currentIndex, slidesToShow]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
  };

  const goToNext = () => {
    goToSlide((currentIndex + 1) % totalSlides);
  };

  return (
    <section className="my-16 py-12 bg-white">
      <div className="container">
        {/* Title Section */}
        <div className="mb-12 pb-4 relative">
          <div className="absolute left-0 bottom-0 w-24 h-1 bg-gray-900"></div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-2">
            What our guests say
          </h2>
          <p className="text-lg text-gray-600 mt-2">
            Real reviews from real travelers
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 -translate-x-4 md:-translate-x-6"
            aria-label="Previous review"
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 translate-x-4 md:translate-x-6"
            aria-label="Next review"
          >
            <ChevronRightIcon className="h-6 w-6 text-gray-700" />
          </button>

          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth px-2"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {reviews.map((review, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full md:w-[calc(50%-12px)] snap-center"
              >
                {/* Review Card */}
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow h-full">
                  {/* Review Text */}
                  <p className="text-gray-700 text-base leading-relaxed mb-6">
                    {review.text}
                  </p>

                  {/* Client Info */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-600 font-semibold text-lg">
                        {review.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h6 className="text-gray-900 font-semibold text-base mb-1">
                        {review.name}
                      </h6>
                      <p className="text-gray-500 text-sm">
                        {review.location} · {review.date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2.5 rounded-full transition-all ${
                currentIndex === index
                  ? 'w-8 bg-gray-900'
                  : 'w-2.5 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default AppGuestReviews;
