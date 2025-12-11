import React, { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
// typings
import { IExploreNearby, ILiveAnywhere } from 'typings';
// utils
import {
  getExploreNearby,
  getLiveAnywhere,
  getLocationListings,
  getPreLaunchProperties,
} from 'utils/data';

interface IHomeDataProps {
  exploreNearby: IExploreNearby[];
  liveAnywhere: ILiveAnywhere[];
  locationListings: any;
  preLaunchProperties: any[];
}

const Home: FC<IHomeDataProps> = ({
  exploreNearby,
  liveAnywhere,
  locationListings,
  preLaunchProperties,
}) => {
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
        {/* Location-based sections */}
        {locationListings?.chandigarh && (
          <AppLocationSection
            title="Available in Chandigarh this weekend"
            listings={locationListings.chandigarh}
          />
        )}
        {locationListings?.gurgaon && (
          <AppLocationSection
            title="Stay in Gurgaon District"
            listings={locationListings.gurgaon}
          />
        )}
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

export const getStaticProps = async () => {
  const exploreNearby = await getExploreNearby();
  const liveAnywhere = await getLiveAnywhere();
  const locationListings = await getLocationListings();
  const preLaunchProperties = await getPreLaunchProperties();

  return {
    props: {
      exploreNearby,
      liveAnywhere,
      locationListings,
      preLaunchProperties,
    },
  };
};

export default Home;
