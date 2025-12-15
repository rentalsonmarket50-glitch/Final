import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../../utils/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ 
      success: false, 
      error: 'Property ID is required' 
    });
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
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch property', 
        details: error.message 
      });
    }

    if (!data) {
      return res.status(404).json({ 
        success: false, 
        error: 'Property not found' 
      });
    }

    // Parse images
    const images = [];
    if (data.main_image) images.push(data.main_image);
    if (data.primary_image && !images.includes(data.primary_image)) {
      images.push(data.primary_image);
    }
    if (data.other_images) {
      const otherImgs = typeof data.other_images === 'string' 
        ? data.other_images.split(',').map((img: string) => img.trim()) 
        : data.other_images;
      otherImgs.forEach((img: string) => {
        if (img && !images.includes(img)) images.push(img);
      });
    }

    // Parse amenities
    let amenities = [];
    if (data.amenities) {
      amenities = typeof data.amenities === 'string' 
        ? JSON.parse(data.amenities) 
        : data.amenities;
    }

    // Parse furnishings
    let furnishings = [];
    if (data.furnishings) {
      furnishings = typeof data.furnishings === 'string' 
        ? JSON.parse(data.furnishings) 
        : data.furnishings;
    }

    // Parse additional rooms
    let additionalRooms = [];
    if (data.additional_rooms) {
      additionalRooms = typeof data.additional_rooms === 'string' 
        ? JSON.parse(data.additional_rooms) 
        : data.additional_rooms;
    }

    // Format response
    const formattedData = {
      id: data.id,
      title: data.property_title || data.title || '',
      propertyType: data.property_type || '',
      bhkType: data.bhk_type || '',
      price: data.price || '0',
      maintenanceCharges: data.maintenance_charges || data.maintenance_fee || '',
      city: data.city || '',
      locality: data.locality || '',
      societyName: data.society_name || '',
      landmark: data.landmark || '',
      pincode: data.pincode || data.zipcode || '',
      builtUpArea: data.built_up_area || data.area_sqft || '',
      carpetArea: data.carpet_area || data.area_sqm || '',
      propertyAge: data.property_age || data.age_of_property || '',
      propertyStatus: data.property_status || data.possession_status || '',
      totalFloors: data.total_floors || '',
      yourFloor: data.your_floor || data.floor_number || '',
      facingDirection: data.facing_direction || '',
      postingType: data.posting_type || data.listing_type || '',
      furnishingType: data.furnishing_type || data.furnished_status || '',
      mainImage: images[0] || null,
      images: images,
      floorPlan: data.floor_plan || null,
      amenities: amenities || [],
      furnishings: furnishings || [],
      additionalRooms: additionalRooms || [],
      carParking: data.car_parking || data.parking_spaces || '',
      bikeParking: data.bike_parking || '',
      ownerName: data.owner_name || '',
      ownerMobile: data.owner_mobile || '',
      ownerEmail: data.owner_email || '',
      ownerWhatsapp: data.owner_whatsapp || '',
      description: data.description || '',
      reraApproved: data.rera_approved || false,
      reraNumber: data.rera_number || '',
      registryAvailable: data.registry_available || false,
      loanAvailable: data.loan_available || false,
      taxPaid: data.tax_paid || false,
      mapLink: data.map_link || '',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      // Include all other fields
      ...data,
    };

    return res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}

