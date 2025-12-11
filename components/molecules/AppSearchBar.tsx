import React, { FC, FocusEvent, FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
// components
import AppSearchOptionButton from '@/components/atoms/AppSearchOptionButton';
import AppDateRange from '@/components/atoms/AppDateRange';
import AppCounter from '@/components/atoms/AppCounter';
import AppSearchOptionWrapper from '@/components/atoms/AppSearchOptionWrapper';
// data
import { useDataContext } from 'hooks/useDataContext';
import { DATA_ACTION_TYPES } from 'context/actionTypes';
// styles
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
// icons
import { ChevronRightIcon } from '@heroicons/react/24/outline';
// typings
import { EHeaderOpions } from 'typings';
// utils
import { formatCheckDate, formatRangeDate, formatGuests } from 'utils';

enum ESearchMenu {
  LOCATION = 'location',
  PROPERTY_TYPE = 'propertyType',
  SELECT = 'select',
}

interface IAppSearchBarProps {
  menu: EHeaderOpions | null;
  isActiveHeader: boolean;
  searchPage?: boolean;
  closeSearch?: () => void;
}

const AppSearchBar: FC<IAppSearchBarProps> = ({
  menu,
  isActiveHeader,
  closeSearch,
  searchPage,
}) => {
  const router = useRouter();
  const [searchMenu, setSearchMenu] = useState<ESearchMenu | null>(null);
  // data
  const [{ location, checkIn, checkOut, guests, propertyType, furnishing }, dispatch] =
    useDataContext();
  // handler
  const handleOnBlur = (event?: FocusEvent<HTMLElement>) => {
    const { relatedTarget } = event || {};
    if (!relatedTarget) {
      setSearchMenu(null);
      return;
    }
    const relatedTargetClassList = Array.from((relatedTarget as Element)?.classList);
    const result = relatedTargetClassList.some((className) => {
      const prefix = ['rdr', 'btn'];
      if (prefix.includes(className.slice(0, 3))) return true;
    });
    if (!result) setSearchMenu(null);
  };

  const resetDate = () => {
    dispatch({
      type: DATA_ACTION_TYPES.RESET_DATES,
    });
    handleOnBlur();
  };

  const handleOnSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!location) {
      setSearchMenu(ESearchMenu.LOCATION);
      return;
    }
    if (searchPage) closeSearch();
    setSearchMenu(null);

    router.push({
      pathname: '/search',
      query: {
        location,
        propertyType,
        furnishing,
        checkIn: checkIn?.toISOString(),
        checkOut: checkOut?.toISOString(),
        guests: JSON.stringify(guests),
      },
    });
  };

  const dateRangeStyle =
    'left-4 right-4 searchbar:left-auto searchbar:right-1/2 searchbar:translate-x-1/2 searchbar:w-[850px]';

  return (
    <>
      <div className={`${isActiveHeader ? 'visible' : 'invisible'} px-4`}>
        <div
          className={`${
            !isActiveHeader && 'translate-y-[-75px] transform scale-50 opacity-0 z-[100]'
          } max-w-[850px] mx-auto mt-2 rounded-full bg-white border border-gray-200 duration-300 hidden md:flex`}
        >
          <form
            action="/search"
            className={`${
              menu === EHeaderOpions.FIND_EXPERIENCES
                ? 'grid-cols-2'
                : 'grid-cols-[0.8fr,0.7fr,auto] lg:grid-cols-[1fr,0.7fr,auto]'
            } grid flex-grow`}
            onSubmit={handleOnSubmit}
          >
            {/* location */}
            <AppSearchOptionButton
              separator
              relative
              type="inputText"
              title="Location"
              placeholder="Where are you going?"
              active={searchMenu === ESearchMenu.LOCATION}
              value={location}
              onChange={({ target }) =>
                dispatch({ type: DATA_ACTION_TYPES.SET_LOCATION, payload: target.value })
              }
              onFocus={() => setSearchMenu(ESearchMenu.LOCATION)}
              onBlur={handleOnBlur}
              onClear={() => {
                dispatch({ type: DATA_ACTION_TYPES.SET_LOCATION, payload: '' });
                handleOnBlur();
              }}
            >
              <AppSearchOptionWrapper className="left-0">
                <div className="py-4">
                  <h2 className="mb-4 text-xs font-bold">GO ANYWHERE, ANYTIME</h2>
                  <button className="flex justify-between w-[436px] px-6 py-4 border border-gray-200 rounded-full shadow-md text-primary">
                    <span className="font-bold">I&apos;m flexible</span>{' '}
                    <ChevronRightIcon className="h-6" />
                  </button>
                </div>
              </AppSearchOptionWrapper>
            </AppSearchOptionButton>

            {menu === EHeaderOpions.PLACES_TO_STAY ? (
              <>
                {/* Property Type */}
                <AppSearchOptionButton
                  separator
                  relative
                  title="Property Type"
                  placeholder="Select property type"
                  active={searchMenu === ESearchMenu.PROPERTY_TYPE}
                  value={propertyType}
                  onFocus={() => setSearchMenu(ESearchMenu.PROPERTY_TYPE)}
                  onBlur={handleOnBlur}
                  onClear={() => {
                    dispatch({ type: DATA_ACTION_TYPES.SET_PROPERTY_TYPE, payload: '' });
                    handleOnBlur();
                  }}
                >
                  <AppSearchOptionWrapper className="left-0 w-64">
                    <div className="py-2">
                      {['House/Flat', 'PG', 'Room', 'Commercial'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            dispatch({
                              type: DATA_ACTION_TYPES.SET_PROPERTY_TYPE,
                              payload: type,
                            });
                            handleOnBlur();
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors ${
                            propertyType === type ? 'bg-gray-100 font-semibold' : ''
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </AppSearchOptionWrapper>
                </AppSearchOptionButton>
                {/* Select (Furnishing) */}
                <AppSearchOptionButton
                  relative
                  withSearch
                  title="Select"
                  placeholder="Select furnishing"
                  active={searchMenu === ESearchMenu.SELECT}
                  value={furnishing}
                  onFocus={() => setSearchMenu(ESearchMenu.SELECT)}
                  onBlur={handleOnBlur}
                  onClear={() => {
                    dispatch({ type: DATA_ACTION_TYPES.SET_FURNISHING, payload: '' });
                    handleOnBlur();
                  }}
                  isSearch={!!searchMenu}
                  onSearch={() => setSearchMenu(ESearchMenu.LOCATION)}
                >
                  <AppSearchOptionWrapper className="right-0 w-64">
                    <div className="py-2">
                      {['Any', 'Furnished', 'Semi Furnished', 'Unfurnished'].map(
                        (option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              dispatch({
                                type: DATA_ACTION_TYPES.SET_FURNISHING,
                                payload: option,
                              });
                              handleOnBlur();
                            }}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors ${
                              furnishing === option ? 'bg-gray-100 font-semibold' : ''
                            }`}
                          >
                            {option}
                          </button>
                        )
                      )}
                    </div>
                  </AppSearchOptionWrapper>
                </AppSearchOptionButton>
              </>
            ) : (
              <AppSearchOptionButton
                withSearch
                title="Date"
                placeholder="Add when you want to go"
                active={searchMenu === ESearchMenu.SELECT}
                value={formatRangeDate(checkIn, checkOut)}
                onFocus={() => setSearchMenu(ESearchMenu.SELECT)}
                onBlur={handleOnBlur}
                onClear={resetDate}
                isSearch={!!searchMenu}
              >
                {/* date picker */}
                <AppSearchOptionWrapper className={dateRangeStyle}>
                  {searchMenu === ESearchMenu.SELECT && <AppDateRange />}
                </AppSearchOptionWrapper>
              </AppSearchOptionButton>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default AppSearchBar;
