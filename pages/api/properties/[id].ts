import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabase/client';
import { IPropertyData, PropertyCategory, PostingType, PropertyStatus, FurnishingType, FacingDirection } from '../../../typings/PropertyTypes';

// Map database property to IPropertyData interface
const mapDbPropertyToPropertyData = (dbProperty: any): IPropertyData => {
  // Parse JSONB fields
  const furnishings = dbProperty.furnishings ? (typeof dbProperty.furnishings === 'string' ? JSON.parse(dbProperty.furnishings) : dbProperty.furnishings) : [];
  const amenities = dbProperty.amenities ? (typeof dbProperty.amenities === 'string' ? JSON.parse(dbProperty.amenities) : dbProperty.amenities) : [];
  const additionalRooms = dbProperty.additional_rooms ? (typeof dbProperty.additional_rooms === 'string' ? JSON.parse(dbProperty.additional_rooms) : dbProperty.additional_rooms) : [];
  
  // Parse images
  const images = [];
  if (dbProperty.main_image) images.push(dbProperty.main_image);
  if (dbProperty.primary_image && !images.includes(dbProperty.primary_image)) images.push(dbProperty.primary_image);
  if (dbProperty.other_images) {
    const otherImgs = typeof dbProperty.other_images === 'string' ? dbProperty.other_images.split(',').map((img: string) => img.trim()) : dbProperty.other_images;
    otherImgs.forEach((img: string) => {
      if (img && !images.includes(img)) images.push(img);
    });
  }
  if (images.length === 0) images.push('/assets/hero.jpg'); // Default image

  // Parse parking
  let carParking = undefined;
  if (dbProperty.car_parking || dbProperty.parking_spaces || dbProperty.parking) {
    let parkingCount = 0;
    if (dbProperty.parking_spaces) {
      parkingCount = parseInt(dbProperty.parking_spaces) || 0;
    } else if (dbProperty.parking) {
      parkingCount = parseInt(dbProperty.parking) || 0;
    } else if (dbProperty.car_parking) {
      // If car_parking is a string like "2 Car Parking" or "Yes", parse it
      const parkingStr = dbProperty.car_parking.toString();
      const numMatch = parkingStr.match(/\d+/);
      parkingCount = numMatch ? parseInt(numMatch[0]) : (parkingStr.toLowerCase().includes('yes') ? 1 : 0);
    }
    
    if (parkingCount > 0) {
      carParking = {
        type: dbProperty.car_parking?.toString().toLowerCase().includes('covered') ? 'Covered' : 'Open',
        count: parkingCount,
      };
    }
  }

  return {
    id: dbProperty.id.toString(),
    propertyCategory: (dbProperty.property_type as PropertyCategory) || PropertyCategory.FLAT_APARTMENT,
    postingType: (dbProperty.posting_type === 'Rent' ? PostingType.RENT : PostingType.SELL) || PostingType.RENT,
    propertyTitle: dbProperty.property_title || dbProperty.title || '',
    description: dbProperty.description || '',
    bhkType: dbProperty.bhk_type as any,
    price: dbProperty.price ? (typeof dbProperty.price === 'number' ? dbProperty.price : parseFloat(dbProperty.price.toString().replace(/[^0-9.]/g, '') || '0')) : 0,
    maintenanceCharges: dbProperty.maintenance_charges ? (typeof dbProperty.maintenance_charges === 'number' ? dbProperty.maintenance_charges : parseFloat(dbProperty.maintenance_charges.toString().replace(/[^0-9.]/g, '') || '0')) : (dbProperty.maintenance_fee || undefined),
    builtUpArea: dbProperty.built_up_area ? (typeof dbProperty.built_up_area === 'number' ? dbProperty.built_up_area : parseFloat(dbProperty.built_up_area.toString().replace(/[^0-9.]/g, '') || '0')) : (dbProperty.area_sqft || 0),
    carpetArea: dbProperty.carpet_area ? (typeof dbProperty.carpet_area === 'number' ? dbProperty.carpet_area : parseFloat(dbProperty.carpet_area.toString().replace(/[^0-9.]/g, '') || '0')) : (dbProperty.area_sqm ? dbProperty.area_sqm * 10.764 : 0),
    propertyAge: dbProperty.property_age ? parseInt(dbProperty.property_age) : dbProperty.age_of_property,
    propertyStatus: (dbProperty.property_status === 'Ready to Move' || dbProperty.possession_status === 'Ready to Move' ? PropertyStatus.READY_TO_MOVE : PropertyStatus.UNDER_CONSTRUCTION) || PropertyStatus.READY_TO_MOVE,
    totalFloors: dbProperty.total_floors ? parseInt(dbProperty.total_floors) : undefined,
    yourFloor: dbProperty.your_floor ? parseInt(dbProperty.your_floor) : dbProperty.floor_number,
    facingDirection: dbProperty.facing_direction as FacingDirection,
    location: {
      city: dbProperty.city || '',
      locality: dbProperty.locality || '',
      societyName: dbProperty.society_name,
      landmark: dbProperty.landmark,
      pincode: dbProperty.pincode || dbProperty.zipcode || '',
      googleMapLink: dbProperty.map_link,
      coordinates: undefined, // Will need to extract from map_link if available
    },
    furnishingType: (dbProperty.furnishing_type || dbProperty.furnished_status) as FurnishingType || FurnishingType.UNFURNISHED,
    furnishingItems: furnishings,
    societyAmenities: amenities || [],
    carParking: carParking,
    bikeParking: dbProperty.bike_parking === 'Yes' || dbProperty.bike_parking === 'true',
    additionalRooms: additionalRooms as any,
    legalInfo: {
      reraApproved: dbProperty.rera_approved || false,
      reraNumber: dbProperty.rera_number,
      registryAvailable: dbProperty.registry_available || false,
      loanAvailable: dbProperty.loan_available || false,
      taxPaid: dbProperty.tax_paid || false,
    },
    images: images,
    videos: [],
    floorPlan: dbProperty.floor_plan,
    contact: {
      name: dbProperty.owner_name || '',
      mobile: dbProperty.owner_mobile || '',
      whatsapp: dbProperty.owner_whatsapp,
      email: dbProperty.owner_email,
      isOwner: true,
    },
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Property ID is required' });
  }

  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', parseInt(id))
      .in('status', ['Approved', 'Published', 'Active']) // Multiple status values
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch property', details: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const propertyData = mapDbPropertyToPropertyData(data);
    return res.status(200).json(propertyData);
  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

