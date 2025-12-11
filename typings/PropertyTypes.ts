// Property Listing Form Types

export enum PropertyCategory {
  FLAT_APARTMENT = 'Flat/Apartment',
  INDEPENDENT_HOUSE = 'Independent House/Villa',
  BUILDER_FLOOR = 'Builder Floor',
  PLOT_LAND = 'Plot/Land',
  COMMERCIAL = 'Commercial',
  FARMHOUSE = 'Farmhouse',
  ROOM = 'Room',
  PG = 'PG',
}

export enum PostingType {
  SELL = 'Sell',
  RENT = 'Rent',
}

export enum BHKType {
  STUDIO = 'Studio',
  ONE_BHK = '1 BHK',
  TWO_BHK = '2 BHK',
  THREE_BHK = '3 BHK',
  THREE_PLUS_ONE_BHK = '3+1 BHK',
  FOUR_BHK = '4 BHK',
  FOUR_PLUS_ONE_BHK = '4+1 BHK',
  FIVE_BHK = '5 BHK',
  SIX_BHK = '6 BHK',
  SEVEN_BHK = '7 BHK',
  EIGHT_BHK = '8 BHK',
  NINE_BHK = '9 BHK',
}

export enum PropertyStatus {
  READY_TO_MOVE = 'Ready to Move',
  UNDER_CONSTRUCTION = 'Under Construction',
}

export enum FacingDirection {
  NORTH = 'North',
  EAST = 'East',
  WEST = 'West',
  SOUTH = 'South',
  NORTH_EAST = 'North-East',
  NORTH_WEST = 'North-West',
  SOUTH_EAST = 'South-East',
  SOUTH_WEST = 'South-West',
}

export enum FurnishingType {
  FULLY_FURNISHED = 'Fully Furnished',
  SEMI_FURNISHED = 'Semi Furnished',
  UNFURNISHED = 'Unfurnished',
}

// Furnishing Items
export const FULLY_FURNISHED_ITEMS = [
  'Bed',
  'Mattress',
  'Sofa',
  'Wardrobe',
  'Fridge',
  'TV',
  'Washing Machine',
  'Modular Kitchen',
  'AC',
  'Geyser',
  'Wifi',
  'Curtains',
  'Dining Table',
  'Microwave',
  'RO',
  'Chimney',
  'Gas Stove',
];

export const SEMI_FURNISHED_ITEMS = [
  'Wardrobe',
  'Modular Kitchen',
  'Lights',
  'Fans',
  'Geyser',
  'Curtains',
  'RO (optional)',
  'AC (optional)',
];

export const UNFURNISHED_ITEMS = ['Lights', 'Fans', 'Basic Fittings', 'Geyser (optional)'];

// Society Amenities
export enum SocietyAmenity {
  LIFT = 'Lift',
  SECURITY_GUARD = 'Security Guard',
  CCTV = 'CCTV',
  POWER_BACKUP = 'Power Backup',
  GYM = 'Gym',
  SWIMMING_POOL = 'Swimming Pool',
  PARK = 'Park',
  KIDS_PLAY_AREA = 'Kids Play Area',
  CLUB_HOUSE = 'Club House',
  COMMUNITY_HALL = 'Community Hall',
  FIRE_SAFETY = 'Fire Safety',
  VISITOR_PARKING = 'Visitor Parking',
}

export enum ParkingType {
  OPEN = 'Open',
  COVERED = 'Covered',
}

export enum AdditionalRoom {
  STUDY_ROOM = 'Study Room',
  STORE_ROOM = 'Store Room',
  SERVANT_ROOM = 'Servant Room',
  POOJA_ROOM = 'Pooja Room',
}

// Property Data Interface
export interface IPropertyData {
  // Basic Info
  id: string;
  propertyCategory: PropertyCategory;
  postingType: PostingType;
  propertyTitle: string;
  description: string;
  bhkType?: BHKType;
  price: number;
  maintenanceCharges?: number;
  builtUpArea: number; // in sq ft
  carpetArea: number; // in sq ft
  propertyAge?: number; // in years
  propertyStatus: PropertyStatus;
  totalFloors?: number;
  yourFloor?: number; // For Flat/Builder Floor
  facingDirection?: FacingDirection;

  // Location Details
  location: {
    city: string;
    locality: string;
    societyName?: string; // For flats
    landmark?: string;
    pincode: string;
    googleMapLink?: string;
    coordinates?: {
      lat: number;
      long: number;
    };
  };

  // Furnishing
  furnishingType: FurnishingType;
  furnishingItems?: string[]; // Auto-populated based on furnishing type

  // Society/Building Amenities
  societyAmenities: SocietyAmenity[];

  // Parking
  carParking?: {
    type: ParkingType;
    count: number;
  };
  bikeParking?: boolean;

  // Additional Rooms
  additionalRooms?: AdditionalRoom[];

  // Legal Information
  legalInfo: {
    reraApproved: boolean;
    reraNumber?: string;
    registryAvailable: boolean;
    loanAvailable: boolean;
    taxPaid: boolean;
  };

  // Media
  images: string[];
  videos?: string[];
  floorPlan?: string;

  // Owner/Broker Details
  contact: {
    name: string;
    mobile: string;
    whatsapp?: string;
    email?: string;
    isOwner: boolean; // true for Owner, false for Broker
  };
}

