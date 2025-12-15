import React, { FC } from 'react';
// components
import AppHead from '@/components/atoms/AppHead';
import AppHeader from '@/components/organisms/AppHeader';
import AppHero from '@/components/atoms/AppHero';
import AppSection from '@/components/atoms/AppSection';
import AppBanner from '@/components/atoms/AppBanner';
import AppFooter from '@/components/atoms/AppFooter';
import AppNearby from '@/components/atoms/AppNearby';
import AppHowItWorks from '@/components/atoms/AppHowItWorks';
import AppGuestReviews from '@/components/atoms/AppGuestReviews';
import AppLocationSection from '@/components/atoms/AppLocationSection';
import AppPreLaunch from '@/components/atoms/AppPreLaunch';
import AppPlaceCard from '@/components/atoms/AppPlaceCard';
// typings
import { IExploreNearby, ILiveAnywhere } from 'typings';
// utils
import {
  getExploreNearby,
  getLiveAnywhere,
  getPreLaunchProperties,
} from 'utils/data';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface IHomeDataProps {
  exploreNearby: IExploreNearby[];
  liveAnywhere: ILiveAnywhere[];
  preLaunchProperties: any[];
  properties: any[];
  recentProperties: any[];
  mohaliProperties: any[];
  kuraliProperties: any[];
  mohaliLocationProperties: any[];
  allApiData: any[]; // For Featured Properties
}

// Map database property to card format
const mapPropertyToCardData = (property: any) => {
  if (!property) {
    console.warn('mapPropertyToCardData: property is null/undefined');
    return null;
  }

  try {
    const images = [];
    
    // Helper function to validate image URL
    const isValidImageUrl = (url: any): boolean => {
      if (!url) return false;
      const urlStr = String(url).trim();
      if (!urlStr || urlStr === '[]' || urlStr === 'null' || urlStr === 'undefined') return false;
      // Must start with /, http://, or https://
      return urlStr.startsWith('/') || urlStr.startsWith('http://') || urlStr.startsWith('https://');
    };
    
    // Handle Public API format (mainImage) and Supabase format (main_image)
    const mainImg = property.mainImage || property.main_image;
    if (mainImg && isValidImageUrl(mainImg)) {
      const imgStr = String(mainImg).trim();
      if (imgStr && imgStr !== '[]' && imgStr !== 'null' && imgStr !== 'undefined') {
        images.push(imgStr);
      }
    }
    
    const primaryImg = property.primary_image || property.primaryImage;
    if (primaryImg && isValidImageUrl(primaryImg)) {
      const imgStr = String(primaryImg).trim();
      if (imgStr && imgStr !== '[]' && imgStr !== 'null' && imgStr !== 'undefined' && !images.includes(imgStr)) {
        images.push(imgStr);
      }
    }
    
    // Handle other_images (can be string or array)
    const otherImages = property.other_images || property.otherImages || property.images;
    if (otherImages) {
      let otherImgs: string[] = [];
      if (typeof otherImages === 'string') {
        const trimmed = otherImages.trim();
        // Skip if it's just "[]" or invalid
        if (trimmed && trimmed !== '[]' && trimmed !== 'null' && trimmed !== 'undefined') {
          // Handle string format (comma-separated or JSON array string)
          if (trimmed.startsWith('[')) {
            try {
              const parsed = JSON.parse(trimmed);
              otherImgs = Array.isArray(parsed) ? parsed.filter((img: any) => img && String(img).trim()) : [];
            } catch {
              // If parsing fails, treat as comma-separated
              otherImgs = trimmed.split(',').map((img: string) => img.trim()).filter(Boolean);
            }
          } else {
            otherImgs = trimmed.split(',').map((img: string) => img.trim()).filter(Boolean);
          }
        }
      } else if (Array.isArray(otherImages)) {
        otherImgs = otherImages.filter((img: any) => img && String(img).trim());
      }
      
      // Filter and add valid images
      otherImgs.forEach((img: any) => {
        const imgStr = String(img).trim();
        if (isValidImageUrl(imgStr) && imgStr !== '[]' && !images.includes(imgStr)) {
          images.push(imgStr);
        }
      });
    }
    
    // Always use a valid default image if no images found
    // Ensure mainImage is always a valid string, never an array or invalid value
    const mainImage = images.length > 0 && isValidImageUrl(images[0]) 
      ? images[0] 
      : '/assets/hero.jpg';

    // Format price
    let price = '₹0';
    if (property.price) {
      if (typeof property.price === 'number') {
        price = `₹${new Intl.NumberFormat('en-IN').format(property.price)}`;
      } else {
        const priceStr = property.price.toString().replace(/[^0-9.]/g, '');
        if (priceStr) {
          const priceNum = parseFloat(priceStr);
          if (!isNaN(priceNum)) {
            price = `₹${new Intl.NumberFormat('en-IN').format(priceNum)}`;
          } else {
            price = property.price.toString();
          }
        } else {
          price = property.price.toString();
        }
      }
    }

    const locationParts = [
      property.locality,
      property.city,
    ].filter(Boolean);
    const location = locationParts.join(', ') || 'Location not specified';

    // Final validation - ensure img is always a valid string
    const finalImg = isValidImageUrl(mainImage) ? mainImage : '/assets/hero.jpg';
    const finalImages = images.length > 0 
      ? images.filter(img => isValidImageUrl(img))
      : [finalImg];
    
    const mapped = {
      id: property.id ? property.id.toString() : `property-${Date.now()}-${Math.random()}`,
      img: finalImg, // Always a valid URL string
      images: finalImages, // Array of valid image URLs
      title: property.title || property.property_title || property.propertyTitle || 'Property',
      description: property.description || '',
      location: location,
      price: price,
      isGuestFavourite: false,
    };
    
    return mapped;
  } catch (error) {
    console.error('Error mapping property:', error, property);
    return null;
  }
};

const Home: FC<IHomeDataProps> = ({
  exploreNearby,
  liveAnywhere,
  preLaunchProperties,
  properties,
  recentProperties,
  mohaliProperties: mohaliProps,
  kuraliProperties: kuraliProps,
  mohaliLocationProperties: mohaliLocationProps,
  allApiData = [],
}) => {
  // Debug logging - Check raw data first
  console.log('=== RAW DATA DEBUG ===');
  console.log('Properties:', properties);
  console.log('Recent Properties:', recentProperties);
  console.log('Mohali Properties:', mohaliProps);
  
  // Map properties to card format
  const propertyCards = properties.map(mapPropertyToCardData).filter(Boolean);
  
  // Remove duplicates from recent properties based on ID
  const uniqueRecentProperties = recentProperties.filter((prop, index, self) => {
    const id = prop?.id?.toString() || prop?.property_id?.toString();
    if (!id) return false;
    return index === self.findIndex((p) => (p?.id?.toString() || p?.property_id?.toString()) === id);
  });

  // Map recent properties (last 10)
  const recentPropertyCards = uniqueRecentProperties
    .map((prop, index) => {
      console.log(`Mapping recent property ${index}:`, prop);
      return mapPropertyToCardData(prop);
    })
    .filter((card) => {
      const isValid = card !== null && card !== undefined;
      if (!isValid) {
        console.warn('Filtered out invalid card');
      }
      return isValid;
    });
  
  // Remove duplicates from mapped cards based on card ID
  const uniqueRecentCards = recentPropertyCards.filter((card, index, self) => {
    return index === self.findIndex((c) => c?.id === card?.id);
  });
  
  // Map Mohali properties (last 10)
  const mohaliPropertyCards = mohaliProps.map(mapPropertyToCardData).filter(Boolean);
  
  // Map Kurali properties
  const kuraliPropertyCards = kuraliProps.map(mapPropertyToCardData).filter(Boolean);
  
  // Map Mohali location properties
  const mohaliLocationCards = mohaliLocationProps.map(mapPropertyToCardData).filter(Boolean);

  // Debug logging
  console.log('=== MAPPED PROPERTIES DEBUG ===');
  console.log('Recent Properties Input Count:', recentProperties.length);
  console.log('Unique Recent Properties Count:', uniqueRecentProperties.length);
  console.log('Recent Properties Input:', recentProperties);
  console.log('Recent Property Cards Count:', recentPropertyCards.length);
  console.log('Unique Recent Cards Count:', uniqueRecentCards.length);
  console.log('Recent Property Cards:', recentPropertyCards);
  console.log('Property Cards Count:', propertyCards.length);
  console.log('Mohali Property Cards Count:', mohaliPropertyCards.length);
  console.log('Kurali Property Cards Count:', kuraliPropertyCards.length);
  console.log('Mohali Location Cards Count:', mohaliLocationCards.length);
  
  // Group properties by city for location sections (use KV Store data)
  const propertiesByCity: { [key: string]: any[] } = {};
  
  // Add Mohali location section
  if (mohaliLocationCards.length > 0) {
    propertiesByCity['Mohali'] = mohaliLocationCards;
  }
  
  // Add Kurali location section
  if (kuraliPropertyCards.length > 0) {
    propertiesByCity['Kurali'] = kuraliPropertyCards;
  }
  
  // Add other cities from general properties
  propertyCards.forEach((card) => {
    const city = card.location.split(',')[1]?.trim() || 'Other';
    if (city !== 'Mohali' && city !== 'Kurali') {
      if (!propertiesByCity[city]) {
        propertiesByCity[city] = [];
      }
      propertiesByCity[city].push(card);
    }
  });

  return (
    <>
      <AppHead />
      <AppHeader exploreNearby={exploreNearby} />
      <main>
        {/* hero */}
        <AppHero />
        
        {/* explore nearby section */}
        <AppSection
          title="Explore Nearby"
          className="grid grid-cols-2 lg:gap-x-4 gap-x-1 gap-y-2 sm:grid-cols-3 lg:grid-cols-4"
        >
          {exploreNearby.map((data, index) => (
            <AppNearby key={index} data={data} />
          ))}
        </AppSection>

        {/* Pre-launch section */}
        {preLaunchProperties && preLaunchProperties.length > 0 && (
          <AppPreLaunch properties={preLaunchProperties} />
        )}

        {/* Recent Added Properties Section */}
        <section className="my-12">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
              Recent Added Properties
              <span className="text-sm font-normal text-gray-500 ml-2">
                (Last 365 Days)
              </span>
            </h2>
            {uniqueRecentCards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {uniqueRecentCards.map((property) => (
                  <AppPlaceCard key={property.id} data={property} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Property Added Yet
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    There are no properties available at the moment. Check back later for new listings.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Available Property on Mohali Section */}
        <section className="my-12">
          <div className="container">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
              Available Property on Mohali
            </h2>
            {mohaliPropertyCards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mohaliPropertyCards.map((property) => (
                  <AppPlaceCard key={property.id} data={property} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No Property Available in Mohali
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    There are no properties available in Mohali at the moment. Check back later for new listings in this area.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Featured Properties Section - Public API se */}
        {allApiData.length > 0 && (
          <AppSection
            title="Featured Properties"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {allApiData.slice(0, 8).map((property) => {
              const card = mapPropertyToCardData(property);
              return card ? <AppPlaceCard key={card.id} data={card} /> : null;
            })}
          </AppSection>
        )}

        {/* Location-based sections - Public API se */}
        {/* Available in Mohali */}
        {mohaliLocationCards.length > 0 && (
          <AppLocationSection
            title="Available in Mohali"
            listings={mohaliLocationCards.slice(0, 4)}
          />
        )}

        {/* Available in Kurali */}
        {kuraliPropertyCards.length > 0 && (
          <AppLocationSection
            title="Available in Kurali"
            listings={kuraliPropertyCards.slice(0, 4)}
          />
        )}

        {/* Other location sections */}
        {Object.keys(propertiesByCity).map((city) => {
          const cityProperties = propertiesByCity[city];
          if (cityProperties.length === 0 || city === 'Mohali' || city === 'Kurali') return null;
          
          return (
            <AppLocationSection
              key={city}
              title={`Available in ${city}`}
              listings={cityProperties.slice(0, 4)}
            />
          );
        })}

        {/* How it works section */}
        <AppHowItWorks />
        
        {/* Guest reviews section */}
        <AppGuestReviews />
        
        {/* bottom banner */}
        <AppBanner />
      </main>
      {/* footer */}
      <AppFooter />
    </>
  );
};

export const getServerSideProps = async () => {
  try {
    // Static data
  const exploreNearby = await getExploreNearby();
  const liveAnywhere = await getLiveAnywhere();
  const preLaunchProperties = await getPreLaunchProperties();

    // API Configuration
    const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-b2101d4d/api/public`;

    // Helper function to fetch properties from public API
    const fetchPropertiesFromAPI = async (params: {
      limit?: number;
      offset?: number;
      city?: string;
      propertyType?: string;
      postingType?: string;
    } = {}) => {
      try {
        const queryParams = new URLSearchParams({
          limit: String(params.limit || 200),
          offset: String(params.offset || 0),
        });
        if (params.city) queryParams.append('city', params.city);
        if (params.propertyType) queryParams.append('propertyType', params.propertyType);
        if (params.postingType) queryParams.append('postingType', params.postingType);

        const response = await fetch(`${API_BASE}/properties?${queryParams}`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
      } catch (error) {
        console.error('Error fetching from public API:', error);
        return { success: false, data: [], error };
      }
    };

    // Dynamic data - Fetch properties from Public API
    let recentApiData: any[] = [];
    let mohaliApiData: any[] = [];
    let kuraliApiData: any[] = [];
    let allApiData: any[] = [];

    try {
      console.log('=== FETCHING FROM PUBLIC API ===');
      
      // Fetch all properties (limit 200 to get enough for filtering)
      const allPropertiesResult = await fetchPropertiesFromAPI({
        limit: 200,
        offset: 0,
      });

      console.log('=== PUBLIC API RAW RESPONSE ===');
      console.log('API Result Success:', allPropertiesResult.success);
      console.log('API Result Data Type:', typeof allPropertiesResult.data);
      console.log('API Result Data Length:', Array.isArray(allPropertiesResult.data) ? allPropertiesResult.data.length : 'Not an array');

      if (allPropertiesResult.success && allPropertiesResult.data) {
        allApiData = Array.isArray(allPropertiesResult.data) ? allPropertiesResult.data : [];
        
        console.log('=== PUBLIC API DATA PARSED ===');
        console.log('Total Properties from Public API:', allApiData.length);
        console.log('First Property Sample:', allApiData[0]);
        console.log('All Properties IDs:', allApiData.map((p: any) => ({ id: p.id, title: p.title || p.property_title, created_at: p.created_at || p.createdAt, status: p.status })));
        
        // Sort by created_at DESC to ensure newest first (in case API doesn't sort)
        allApiData.sort((a: any, b: any) => {
          const dateA = new Date(a.created_at || a.createdAt || 0).getTime();
          const dateB = new Date(b.created_at || b.createdAt || 0).getTime();
          return dateB - dateA; // Newest first
        });
        
        // Filter properties from last 365 days
        const today = new Date();
        const oneYearAgo = new Date(today);
        oneYearAgo.setDate(oneYearAgo.getDate() - 365);
        
        const recentPropertiesLast365Days = allApiData.filter((prop: any) => {
          const createdDate = new Date(prop.created_at || prop.createdAt || 0);
          return createdDate >= oneYearAgo && createdDate <= today;
        });
        
        console.log('=== DATE FILTERING ===');
        console.log('Today:', today.toISOString());
        console.log('One Year Ago:', oneYearAgo.toISOString());
        console.log('Total Properties:', allApiData.length);
        console.log('Properties from Last 365 Days:', recentPropertiesLast365Days.length);
        console.log('First 15 Properties (Last 365 Days):', recentPropertiesLast365Days.slice(0, 15).map((p: any) => ({ 
          id: p.id, 
          title: p.title || p.property_title, 
          created_at: p.created_at || p.createdAt,
          daysAgo: Math.floor((today.getTime() - new Date(p.created_at || p.createdAt || 0).getTime()) / (1000 * 60 * 60 * 24)),
          status: p.status 
        })));
        
        // Get last 15 properties from the last 365 days for "Recent Added Properties"
        recentApiData = recentPropertiesLast365Days.slice(0, 15);

        // Filter Mohali properties for "Available Property on Mohali"
        mohaliApiData = allApiData.filter((prop: any) => {
          const city = (prop.city || '').toLowerCase();
          const locality = (prop.locality || '').toLowerCase();
          return (
            city.includes('mohali') ||
            locality.includes('mohali') ||
            city.includes('kharar') ||
            locality.includes('kharar')
          );
        }).slice(0, 10);

        // Filter Kurali properties for "Available in Kurali"
        kuraliApiData = allApiData.filter((prop: any) => {
          const city = (prop.city || '').toLowerCase();
          const locality = (prop.locality || '').toLowerCase();
          return (
            city.includes('kurali') ||
            locality.includes('kurali')
          );
        }).slice(0, 10);

        console.log('=== PUBLIC API FILTERED DATA ===');
        console.log('Recent API Properties:', recentApiData.length);
        console.log('Mohali API Properties:', mohaliApiData.length);
        console.log('Kurali API Properties:', kuraliApiData.length);
        console.log('All API Properties:', allApiData.length);
      } else {
        console.warn('Public API returned no data or success was false.');
        console.warn('API Result:', allPropertiesResult);
      }
    } catch (error) {
      console.error('=== ERROR FETCHING FROM PUBLIC API ===');
      console.error('Error Type:', (error as Error).constructor.name);
      console.error('Error Message:', (error as Error).message);
      console.error('Error Stack:', (error as Error).stack);
      console.error('Full Error:', error);
    }

    // Fallback: Direct Supabase query if API fails
    // Also check ALL statuses to see what's in the database
    const { data: allStatusData } = await supabase
      .from('properties')
      .select('id, property_title, status, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
    
    console.log('=== ALL PROPERTIES IN DATABASE (Last 10) ===');
    console.log('Properties with all statuses:', allStatusData);
    
    // Calculate date range for last 365 days
    const todayDate = new Date();
    const oneYearAgoDate = new Date(todayDate);
    oneYearAgoDate.setDate(oneYearAgoDate.getDate() - 365);
    const oneYearAgoISO = oneYearAgoDate.toISOString();
    
    console.log('=== DATE FILTER FOR SUPABASE ===');
    console.log('Today:', todayDate.toISOString());
    console.log('One Year Ago:', oneYearAgoISO);
    
    // Fetch properties from last 365 days with status = 'Active'
    const { data: recentData, error: recentError } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'Active')
      .gte('created_at', oneYearAgoISO) // Greater than or equal to one year ago
      .lte('created_at', todayDate.toISOString()) // Less than or equal to today
      .order('created_at', { ascending: false })
      .limit(20); // Get up to 20 for filtering
    
    console.log('=== SUPABASE FALLBACK (Status = Active, Last 365 Days) ===');
    console.log('Recent Data Count:', recentData?.length || 0);
    console.log('Recent Data:', recentData?.map((p: any) => ({ 
      id: p.id, 
      title: p.property_title, 
      status: p.status,
      created_at: p.created_at,
      daysAgo: Math.floor((todayDate.getTime() - new Date(p.created_at || 0).getTime()) / (1000 * 60 * 60 * 24))
    })));

    const { data: mohaliData, error: mohaliError } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'Active')
      .or('city.ilike.%Mohali%,locality.ilike.%Mohali%,city.ilike.%Kharar%,locality.ilike.%Kharar%,city.ilike.%Kurali%,locality.ilike.%Kurali%')
      .order('created_at', { ascending: false })
      .limit(10);

    const { data: allData, error: allError } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'Active')
      .order('created_at', { ascending: false })
      .limit(20);

    // Helper function to remove duplicates based on property ID
    const removeDuplicates = (properties: any[]): any[] => {
      const seen = new Set();
      return properties.filter((prop: any) => {
        const id = prop.id?.toString() || prop.property_id?.toString();
        if (!id || seen.has(id)) {
          return false;
        }
        seen.add(id);
        return true;
      });
    };

    // Combine Public API data with Supabase fallback (Public API takes priority, NO STATIC DATA)
    // Remove duplicates based on property ID
    const allPropertiesCombined = allApiData.length > 0 
      ? removeDuplicates([...allApiData, ...(allData || [])])
      : [...(allData || [])];
    
    console.log('=== FINAL DATA COMBINATION ===');
    console.log('Static Properties (EXCLUDED):', 0);
    console.log('Public API Properties:', allApiData.length);
    console.log('Supabase Fallback:', (allData || []).length);
    console.log('Total Combined (After Removing Duplicates):', allPropertiesCombined.length);
    
    // Filter Supabase fallback data by last 365 days (already filtered in query, but ensure sorting)
    const recentDataLast365Days = (recentData || []).sort((a: any, b: any) => {
      const dateA = new Date(a.created_at || a.createdAt || 0).getTime();
      const dateB = new Date(b.created_at || b.createdAt || 0).getTime();
      return dateB - dateA; // Newest first
    });

    // Recent Added Properties - Show 15 properties from last 365 days (ONLY Public API or Supabase, NO STATIC)
    // Remove duplicates when combining API and Supabase data
    const recentPropertiesCombined = removeDuplicates(
      recentApiData.length > 0
        ? [
            ...recentApiData.slice(0, 15),
            ...recentDataLast365Days.slice(0, Math.max(0, 15 - recentApiData.length))
          ]
        : [
            ...recentDataLast365Days.slice(0, 15)
          ]
    ).slice(0, 15);
    
    console.log('=== RECENT PROPERTIES FINAL ===');
    console.log('Recent Properties Combined (Last 365 Days):', recentPropertiesCombined.length);
    console.log('Recent Properties Details:', recentPropertiesCombined.map((p: any) => ({
      id: p.id,
      title: p.title || p.property_title,
      created_at: p.created_at || p.createdAt,
      daysAgo: Math.floor((todayDate.getTime() - new Date(p.created_at || p.createdAt || 0).getTime()) / (1000 * 60 * 60 * 24))
    })));
    
    // Available Property on Mohali - Show 10 properties (ONLY Public API or Supabase, NO STATIC)
    // Remove duplicates when combining API and Supabase data
    const mohaliPropertiesCombined = removeDuplicates(
      mohaliApiData.length > 0
        ? [
            ...mohaliApiData,
            ...(mohaliData || [])
          ]
        : [
            ...(mohaliData || [])
          ]
    ).slice(0, 10);

    // Available in Kurali - Show properties from Public API (NO STATIC)
    const kuraliPropertiesCombined = [
      ...kuraliApiData
    ].slice(0, 10);

    // Available in Mohali (for location section) - Show properties from Public API (NO STATIC)
    const mohaliLocationProperties = [
      ...mohaliApiData
    ].slice(0, 4);

    console.log('=== COMBINED PROPERTIES DEBUG ===');
    console.log('Recent Properties Combined Count:', recentPropertiesCombined.length);
    console.log('Recent Properties Combined:', recentPropertiesCombined);

    // Debug logging
    console.log('=== PROPERTIES FETCH DEBUG ===');
    console.log('Public API - Recent Properties Count:', recentApiData.length);
    console.log('Public API - Mohali Properties Count:', mohaliApiData.length);
    console.log('Public API - Kurali Properties Count:', kuraliApiData.length);
    console.log('Public API - All Properties Count:', allApiData.length);
    console.log('Supabase Fallback - Recent Properties Count:', recentData?.length || 0);
    console.log('Supabase Fallback - Mohali Properties Count:', mohaliData?.length || 0);
    console.log('Supabase Fallback - All Properties Count:', allData?.length || 0);
    
    if (recentError) {
      console.error('Error fetching recent properties from Supabase (fallback):', recentError);
    }
    if (mohaliError) {
      console.error('Error fetching Mohali properties from Supabase (fallback):', mohaliError);
    }
    if (allError) {
      console.error('Error fetching all properties from Supabase (fallback):', allError);
    }

  return {
    props: {
      exploreNearby,
      liveAnywhere,
      preLaunchProperties,
        properties: allPropertiesCombined,
        recentProperties: recentPropertiesCombined,
        mohaliProperties: mohaliPropertiesCombined,
        kuraliProperties: kuraliPropertiesCombined,
        mohaliLocationProperties: mohaliLocationProperties,
        allApiData: allApiData, // For Featured Properties
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        exploreNearby: [],
        liveAnywhere: [],
        preLaunchProperties: [],
        properties: [],
        recentProperties: [],
        mohaliProperties: [],
        kuraliProperties: [],
        mohaliLocationProperties: [],
        allApiData: [],
      },
    };
  }
};

export default Home;
