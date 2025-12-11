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
import { getSearch } from 'utils/data';
import { useDataContext } from 'hooks/useDataContext';
import { DATA_ACTION_TYPES } from 'context/actionTypes';
import { IFilterState } from '../typings/FilterTypes';

const Search = ({ searchResults }) => {
  const router = useRouter();
  const query = router.query;
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(true);
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
              Over 1,000 homes in {location || 'Chandigarh'}
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
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((result) => (
              <AppPlaceCard key={result.long + result.lat} data={result} />
            ))}
          </section>
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
          // Apply filters logic here - you can filter searchResults based on filters
          console.log('Applying filters:', filters);
          // TODO: Implement actual filtering logic
        }}
      />
    </div>
  );
};

export const getServerSideProps = async () => {
  const searchResults = await getSearch();

  return {
    props: { searchResults },
  };
};

export default Search;
