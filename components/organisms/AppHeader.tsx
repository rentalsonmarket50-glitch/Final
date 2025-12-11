import React, { FC, useEffect, useState } from 'react';
import Link from 'next/link';
// components
import AppLogo, { EAppLogo } from '@/components/atoms/AppLogo';
import AppSearchBar from '@/components/molecules/AppSearchBar';
import AppHeaderOption from '@/components/atoms/AppHeaderOption';
import AppSearchBarMobile from '@/components/molecules/AppSearchBarMobile';
// icons
import {
  GlobeAltIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
// typings
import { EHeaderOpions, IExploreNearby } from 'typings';
import { formatGuests, formatRangeDate } from 'utils';
// context

interface AppHeaderProps {
  exploreNearby?: IExploreNearby[];
  searchPage?: boolean;
  query?: any;
}

const AppHeader: FC<AppHeaderProps> = ({ exploreNearby, searchPage, query }) => {
  // On home page (searchPage === false): expanded at top, collapsed on scroll
  // On search page (searchPage === true): collapsed by default, expand on click
  // On listing page (searchPage === undefined): collapsed by default, expand on click
  const [isSnapTop, setIsSnapTop] = useState<boolean>(
    searchPage === false ? true : false
  );
  const [isActiveSearch, setIsActiveSearch] = useState<boolean>(
    searchPage === false ? true : false
  );
  const [activeMenu, setActiveMenu] = useState<EHeaderOpions | null>(
    EHeaderOpions.PLACES_TO_STAY
  );
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);

  const handleOnScroll = () => {
    const position = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    // Change threshold to 10px for more responsive effect
    if (position >= 10) {
      setIsSnapTop(false);
      setIsActiveSearch(false);
    } else {
      setIsSnapTop(true);
      setIsActiveSearch(true);
    }
  };

  const headerBehavior = () => {
    let style = [];
    if (!isSnapTop) {
      // Solid white background with shadow when scrolled
      style.push('bg-white shadow-lg');
    } else {
      // Transparent background when at top (home page only)
      if (searchPage === false) {
        style.push('bg-transparent');
      } else {
        style.push('bg-white shadow-lg');
      }
    }
    if (!isActiveSearch) style.push('h-[86px] pb-5');
    if (isActiveSearch) style.push('pb-8');
    // Smooth transition for background and shadow
    style.push('transition-all duration-300 ease-in-out');
    return style.join(' ');
  };

  useEffect(() => {
    // listen to scroll only on home page (searchPage === false)
    // On search page and listing page, don't auto-expand/collapse on scroll
    if (searchPage === false) {
      window.addEventListener('scroll', handleOnScroll, { passive: true });
      // Check initial scroll position
      handleOnScroll();
    } else {
      // On other pages, header should be solid
      setIsSnapTop(false);
    }
    return () => {
      if (searchPage === false) {
        window.removeEventListener('scroll', handleOnScroll);
      }
    };
  }, [searchPage]);

  return (
    <>
      <header
        className={`${headerBehavior()} z-50 fixed top-0 left-0 right-0 w-full pt-5`}
        style={{
          transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        }}
      >
        {/* header top */}
        <div
          className={`${
            searchPage ? 'px-7' : 'container'
          } hidden md:grid md:grid-cols-[auto,1fr,auto] xl:grid-cols-[1.5fr,3fr,1.5fr] 2xl:grid-cols-[1fr,3fr,1fr] items-start`}
        >
          {/* left side - logo */}
          <div className="flex items-center justify-center h-12">
            <Link href="/">
              <AppLogo
                className="hidden xl:block"
                type={EAppLogo.TEXT}
                isScrolled={!isSnapTop}
                isActiveHeader={isActiveSearch}
                isHomePage={searchPage === false}
              />
              <AppLogo
                className={`${isSnapTop ? 'text-white' : 'text-primary'} block xl:hidden`}
                type={EAppLogo.LOGO}
              />
            </Link>
          </div>
          {/* small search bar */}
          <button
            className={`${
              isActiveSearch && 'scale-[1.33] translate-y-[75px] opacity-0 z-[-50]'
            } ${
              searchPage ? 'pl-3' : 'pl-6'
            } relative flex items-center h-12 pr-2 mx-auto text-left transform bg-white border border-gray-200 rounded-full shadow-md cursor-pointer min-w-[320px] hover:shadow-lg md:absolute left-24 lg:left-auto lg:right-1/2 lg:translate-x-1/2 duration-200`}
            onClick={() => setIsActiveSearch(true)}
          >
            {searchPage ? (
              <span className="flex-grow text-sm font-medium tracking-wide text-gray-500">
                <span className="px-4 py-1 border-r border-gay-200">
                  {query.location || (
                    <span className="font-normal text-gray-300">Location</span>
                  )}
                </span>
                <span className="px-4 py-1 border-r border-gay-200">
                  {formatRangeDate(query.checkIn, query.checkOut) || (
                    <span className="font-normal text-gray-300">Add dates</span>
                  )}
                </span>
                <span className="px-4 py-1">
                  {formatGuests(query.guests, { noInfants: true }) || (
                    <span className="font-normal text-gray-300">Add guests</span>
                  )}
                </span>
              </span>
            ) : (
              <span className="flex-grow text-sm font-medium tracking-wide text-gray-500">
                Start your search
              </span>
            )}
            <MagnifyingGlassIcon className="h-8 p-2 ml-3 text-white rounded-full bg-primary" />
          </button>
          {/* middle side navigation */}
          <div className="relative flex flex-col items-center justify-center order-last col-span-2 xl:order-none xl:col-span-1">
            <div className="text-white">
              <AppHeaderOption
                isSnap={isSnapTop}
                isActiveHeader={isActiveSearch}
                active={activeMenu === EHeaderOpions.PLACES_TO_STAY}
                onClick={() => setActiveMenu(EHeaderOpions.PLACES_TO_STAY)}
              >
                Find the property
              </AppHeaderOption>
            </div>
          </div>
          {/* right side */}
          <div className="flex items-center justify-end">
            <Link
              href="/"
              className={`${
                isSnapTop
                  ? 'text-white hover:bg-white hover:bg-opacity-10'
                  : 'text-gray-500 hover:bg-gray-100 '
              } flex items-center h-10 px-3 mr-1 rounded-full `}
            >
              <GlobeAltIcon className="h-5" />
            </Link>
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center pl-3 pr-1 bg-white border border-gray-200 rounded-full h-11 hover:shadow-md transition-shadow"
              >
                <Bars3Icon className="h-5 mr-2 text-gray-300" />
                <UserCircleIcon className="h-10 text-gray-300" />
                <ChevronDownIcon className="h-4 w-4 text-gray-500 ml-1" />
              </button>
              
              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      href="/"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Become a broker
                    </Link>
                    <div className="border-t border-gray-200 my-1" />
                    <Link
                      href="/"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Sign up
                    </Link>
                    <Link
                      href="/"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Log in
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {/* main search bar */}
        <AppSearchBar
          menu={activeMenu}
          isActiveHeader={isActiveSearch}
          searchPage={searchPage}
          closeSearch={() => setIsActiveSearch(false)}
        />
        {/* mobile search bar */}
        <AppSearchBarMobile exploreNearby={exploreNearby || []} searchPage={searchPage} />
      </header>
      {/* background layer */}
      {isActiveSearch && !isSnapTop && (
        <div
          className="fixed inset-0 z-40 bg-transparent-black"
          onClick={() => setIsActiveSearch(false)}
        />
      )}
    </>
  );
};

export default AppHeader;
