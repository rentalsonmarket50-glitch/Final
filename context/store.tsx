import { createContext, useReducer } from 'react';
import { dataReducer } from './reducer';
import { IFilterState } from '../typings/FilterTypes';

interface IInitialState {
  location: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: {
    adults: number;
    children: number;
    infants: number;
  };
  propertyType: string;
  furnishing: string;
  filters: IFilterState;
}

export const initialState: IInitialState = {
  location: '',
  checkIn: null,
  checkOut: null,
  guests: { adults: 0, children: 0, infants: 0 },
  propertyType: '',
  furnishing: '',
  filters: {
    propertyType: '',
    location: { city: '', locality: '', nearbyLandmarks: '', pincode: '' },
    priceRange: { min: 0, max: 0 },
    furnishing: '',
    constructionStatus: '',
    postedBy: '',
    amenities: [],
  },
};

export const DataContext = createContext(null);

export const ContextProvider = ({ children }) => (
  <DataContext.Provider value={useReducer(dataReducer, initialState)}>
    {children}
  </DataContext.Provider>
);
