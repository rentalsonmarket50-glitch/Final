// Property Types
export enum PropertyType {
  FLAT_APARTMENT = 'Flat / Apartment',
  INDEPENDENT_HOUSE = 'Independent House / Villa',
  BUILDER_FLOOR = 'Builder Floor',
  PLOT_LAND = 'Plot / Land',
  COMMERCIAL = 'Commercial',
  FARMHOUSE = 'Farmhouse',
  ROOM = 'Room',
  PG = 'PG',
}

// Furnishing Types
export enum FurnishingType {
  FULLY_FURNISHED = 'Fully Furnished',
  SEMI_FURNISHED = 'Semi Furnished',
  UNFURNISHED = 'Unfurnished',
}

// Construction Status
export enum ConstructionStatus {
  READY_TO_MOVE = 'Ready to Move',
  UNDER_CONSTRUCTION = 'Under Construction',
}

// Posted By
export enum PostedBy {
  OWNER = 'Owner',
  BROKER = 'Broker',
}

// BHK Options
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

// Floor Options
export enum FloorType {
  GROUND = 'Ground Floor',
  FIRST = '1st Floor',
  SECOND = '2nd Floor',
  THIRD = '3rd Floor',
  FOURTH_PLUS = '4+ Floors',
}

// Facing Options
export enum FacingType {
  EAST = 'East',
  NORTH = 'North',
  WEST = 'West',
  SOUTH = 'South',
}

// Commercial Categories
export enum CommercialCategory {
  OFFICE_SPACE = 'Office Space',
  WAREHOUSE_GODOWN = 'Warehouse / Godown',
  SHOP_SHOWROOM = 'Shop / Showroom',
  COMMERCIAL_PLOT = 'Commercial Plot',
}

// Room Types
export enum RoomType {
  SINGLE = 'Single',
  DOUBLE = 'Double',
  TRIPLE = 'Triple',
}

// PG Occupancy Types
export enum PGOccupancyType {
  SINGLE = 'Single',
  DOUBLE = 'Double',
  TRIPLE = 'Triple',
  FOUR_SHARING = 'Four Sharing',
}

// Plot Types
export enum PlotType {
  RESIDENTIAL_PLOT = 'Residential Plot',
  COMMERCIAL_PLOT = 'Commercial Plot',
  AGRICULTURAL_LAND = 'Agricultural Land',
}

// Common Amenities
export enum CommonAmenity {
  POWER_BACKUP = 'Power Backup',
  LIFT = 'Lift',
  SECURITY = 'Security',
  CCTV = 'CCTV',
  GYM = 'Gym',
  SWIMMING_POOL = 'Swimming Pool',
  PARK = 'Park',
  KIDS_PLAY_AREA = 'Kids Play Area',
  VISITOR_PARKING = 'Visitor Parking',
  FIRE_SAFETY = 'Fire Safety',
}

// Filter Interface
export interface IFilterState {
  // Universal Filters
  propertyType: PropertyType | '';
  location: {
    city: string;
    locality: string;
    nearbyLandmarks: string;
    pincode: string;
  };
  priceRange: {
    min: number;
    max: number;
  };
  furnishing: FurnishingType | '';
  constructionStatus: ConstructionStatus | '';
  postedBy: PostedBy | '';
  amenities: CommonAmenity[];
  
  // Property Type Specific Filters
  bhk?: BHKType | '';
  floor?: FloorType | '';
  facing?: FacingType | '';
  parking?: {
    cars: number;
    bikes: boolean;
  };
  plotSize?: {
    min: number;
    max: number;
    unit: 'sqft' | 'sqyard' | 'acre';
  };
  waterSupply?: 'Borewell' | 'Municipal' | 'Both' | '';
  floors?: 'Single Floor' | 'Duplex' | 'Triplex' | '';
  lift?: boolean;
  modularKitchen?: boolean;
  roadWidth?: '10 ft' | '20 ft' | '30 ft' | '40 ft+' | '';
  boundaryWall?: boolean;
  roomType?: RoomType | '';
  attachedBathroom?: boolean;
  kitchenAccess?: boolean;
  wifi?: boolean;
  electricityIncluded?: boolean;
  airCoolerAC?: boolean;
  pgOccupancy?: PGOccupancyType | '';
  foodIncluded?: boolean;
  housekeeping?: boolean;
  laundry?: boolean;
  commercialCategory?: CommercialCategory | '';
  carpetArea?: number;
  cabinsCount?: number;
  workstations?: number;
  washrooms?: number;
  pantry?: boolean;
  ceilingHeight?: number;
  loadingDock?: boolean;
  powerLoad?: string;
  truckParking?: boolean;
  frontage?: number;
  
  // Advanced Filters
  newlyListed?: boolean;
  verifiedListings?: boolean;
  negotiablePrice?: boolean;
  reraApproved?: boolean;
  petFriendly?: boolean;
  immediateMoveIn?: boolean;
}

