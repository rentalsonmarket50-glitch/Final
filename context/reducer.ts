import { DATA_ACTION_TYPES } from './actionTypes';
import { initialState } from './store';

export const dataReducer = (state, action) => {
  const { type, payload } = action;
  const { adults, children, infants } = state.guests;
  switch (type) {
    case DATA_ACTION_TYPES.SET_LOCATION:
      return { ...state, location: payload };

    case DATA_ACTION_TYPES.SET_CHECK_IN:
      return { ...state, checkIn: payload };

    case DATA_ACTION_TYPES.SET_CHECK_OUT:
      return { ...state, checkOut: payload };

    case DATA_ACTION_TYPES.SET_GUESTS:
      return { ...state, guests: payload };

    case DATA_ACTION_TYPES.RESET_DATES:
      return { ...state, checkOut: null, checkIn: null };

    case DATA_ACTION_TYPES.RESET_GUESTS:
      return { ...state, guests: initialState.guests };

    case DATA_ACTION_TYPES.INCREASE_ADULTS:
      if (adults >= 16) return state;
      return { ...state, guests: { ...state.guests, adults: adults + 1 } };

    case DATA_ACTION_TYPES.INCREASE_CHILDREN:
      if (children >= 5) return state;
      if (adults <= 0) {
        return {
          ...state,
          guests: { ...state.guests, children: children + 1, adults: adults + 1 },
        };
      }
      return { ...state, guests: { ...state.guests, children: children + 1 } };

    case DATA_ACTION_TYPES.INCREASE_INFANTS:
      if (infants >= 5) return state;
      if (adults <= 0) {
        return {
          ...state,
          guests: { ...state.guests, infants: infants + 1, adults: adults + 1 },
        };
      }
      return { ...state, guests: { ...state.guests, infants: infants + 1 } };

    case DATA_ACTION_TYPES.DECREASE_ADULTS:
      if (adults <= 0) return state;
      if (adults <= 1 && (children >= 1 || infants >= 1)) return state;
      return { ...state, guests: { ...state.guests, adults: adults - 1 } };

    case DATA_ACTION_TYPES.DECREASE_CHILDREN:
      if (children <= 0) return state;
      return { ...state, guests: { ...state.guests, children: children - 1 } };

    case DATA_ACTION_TYPES.DECREASE_INFANTS:
      if (infants <= 0) return state;
      return { ...state, guests: { ...state.guests, infants: infants - 1 } };

    case DATA_ACTION_TYPES.SET_PROPERTY_TYPE:
      return { ...state, propertyType: payload };

    case DATA_ACTION_TYPES.SET_FURNISHING:
      return { ...state, furnishing: payload };

    case DATA_ACTION_TYPES.SET_FILTER_STATE:
      return { ...state, filters: payload };

    case DATA_ACTION_TYPES.RESET_FILTERS:
      return { ...state, filters: initialState.filters };

    case DATA_ACTION_TYPES.SET_PRICE_RANGE:
      return {
        ...state,
        filters: { ...state.filters, priceRange: payload },
      };

    case DATA_ACTION_TYPES.SET_CONSTRUCTION_STATUS:
      return {
        ...state,
        filters: { ...state.filters, constructionStatus: payload },
      };

    case DATA_ACTION_TYPES.SET_POSTED_BY:
      return {
        ...state,
        filters: { ...state.filters, postedBy: payload },
      };

    case DATA_ACTION_TYPES.TOGGLE_AMENITY:
      const amenities = state.filters.amenities || [];
      const updatedAmenities = amenities.includes(payload)
        ? amenities.filter((a) => a !== payload)
        : [...amenities, payload];
      return {
        ...state,
        filters: { ...state.filters, amenities: updatedAmenities },
      };

    case DATA_ACTION_TYPES.SET_BHK:
      return {
        ...state,
        filters: { ...state.filters, bhk: payload },
      };

    case DATA_ACTION_TYPES.SET_FLOOR:
      return {
        ...state,
        filters: { ...state.filters, floor: payload },
      };

    case DATA_ACTION_TYPES.SET_FACING:
      return {
        ...state,
        filters: { ...state.filters, facing: payload },
      };

    case DATA_ACTION_TYPES.SET_PARKING:
      return {
        ...state,
        filters: { ...state.filters, parking: payload },
      };

    default:
      return state;
  }
};
