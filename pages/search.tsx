import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
// components
import AppFooter from '@/components/atoms/AppFooter';
import AppHead from '@/components/atoms/AppHead';
import AppHeader from '@/components/organisms/AppHeader';
import AppPlaceCard from '@/components/atoms/AppPlaceCard';
import PropertyFilters from '@/components/PropertyFilters';
// utils
import { formatGuests, formatRangeDate } from 'utils';
import { useDataContext } from 'hooks/useDataContext';
import { DATA_ACTION_TYPES } from 'context/actionTypes';
import { IFilterState } from '../typings/FilterTypes';

// Map database property to AppPlaceCard format
const mapPropertyToCardData = (property: any) => {
  // Get first image
  const images = [];
  if (property.main_image) images.push(property.main_image);
  if (property.primary_image && !images.includes(property.primary_image)) images.push(property.primary_image);
  if (property.other_images) {
    const otherImgs = typeof property.other_images === 'string' 
      ? property.other_images.split(',').map((img: string) => img.trim()) 
      : property.other_images;
    otherImgs.forEach((img: string) => {
      if (img && !images.includes(img)) images.push(img);
    });
  }
  const mainImage = images[0] || '/assets/hero.jpg';

  // Format price
  const price = property.price 
    ? (typeof property.price === 'number' 
        ? `₹${new Intl.NumberFormat('en-IN').format(property.price)}` 
        : property.price.toString())
    : '₹0';

  // Format location
  const locationParts = [
    property.locality,
    property.city,
  ].filter(Boolean);
  const location = locationParts.join(', ');

  return {
    id: property.id.toString(),
    img: mainImage,
    images: images,
    title: property.property_title || property.title || 'Property',
    description: property.description || '',
    location: location,
    price: price,
    isGuestFavourite: false,
  };
};

const Search = () => {
  const router = useRouter();
  const query = router.query;
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  // data
  const [location, setLocation] = useState<string>('');
  const [checkIn, setCheckIn] = useState<Date>(null);
  const [checkOut, setCheckOut] = useState<Date>(null);
  const [guests, setGuests] = useState<Object>();
  const [{ filters }, dispatch] = useDataContext();

  useEffect(() => {
    setLocation(query.location?.toString());
    if (query.checkIn) setCheckIn(new Date(query.checkIn?.toString()));
    if (query.checkOut) setCheckOut(new Date(query.checkOut?.toString()));
    if (query.guests) setGuests(JSON.parse(query.guests?.toString()));
  }, [query]);

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        // Apply filters
        if (filters?.propertyType) params.append('property_type', filters.propertyType);
        if (filters?.location?.city) params.append('city', filters.location.city);
        if (filters?.location?.locality) params.append('locality', filters.location.locality);
        if (filters?.furnishing) params.append('furnishing', filters.furnishing);
        if (filters?.constructionStatus) params.append('status', filters.constructionStatus);
        
        // Use location from query if available
        if (location) params.append('city', location);

        const response = await fetch(`/api/properties?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const data = await response.json();
        const mappedResults = data.properties.map(mapPropertyToCardData);
        setSearchResults(mappedResults);
        setTotalCount(data.total || 0);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters, location]);


  return (
    <div className="flex flex-col min-h-screen">
      <AppHead />
      <AppHeader searchPage query={{ location, checkIn, checkOut, guests }} />
      <main className="flex-grow mt-[86px]">
        {/* left - cards */}
        <div className="px-4 py-8 duration-500 lg:py-12 lg:px-7 overflow-y-auto max-w-7xl mx-auto">
          {/* Header with count and prices tag */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold md:text-2xl lg:text-3xl">
              {loading ? 'Loading...' : `${totalCount || searchResults.length} homes in ${location || 'Chandigarh'}`}
            </h1>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-medium bg-pink-100 text-pink-700 rounded-full">
                Prices include all fees
              </span>
            </div>
          </div>
          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setIsFiltersOpen(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-full hover:border-gray-900 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters
              {(filters?.propertyType ||
                filters?.location?.city ||
                filters?.priceRange?.min ||
                filters?.furnishing ||
                filters?.amenities?.length > 0) && (
                <span className="px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                  {[
                    filters?.propertyType,
                    filters?.location?.city,
                    filters?.furnishing,
                    filters?.amenities?.length > 0 ? `${filters.amenities.length} amenities` : null,
                  ]
                    .filter(Boolean)
                    .length}
                </span>
              )}
            </button>
          </div>

          {/* Listings Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-gray-600">Loading properties...</p>
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <p className="text-gray-600 text-lg mb-4">No properties found</p>
                <p className="text-gray-500">Try adjusting your filters</p>
              </div>
            </div>
          ) : (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((result) => (
                <AppPlaceCard key={result.id} data={result} />
              ))}
            </section>
          )}
        </div>
      </main>
      {/* footer */}
      <AppFooter />

      {/* Property Filters Modal */}
      <PropertyFilters
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        filters={filters}
        onFilterChange={(updatedFilters: IFilterState) => {
          dispatch({ type: DATA_ACTION_TYPES.SET_FILTER_STATE, payload: updatedFilters });
        }}
        onApplyFilters={() => {
          // Filters are already applied via useEffect that watches the filters state
          setIsFiltersOpen(false);
        }}
      />
    </div>
  );
};

export default Search;
