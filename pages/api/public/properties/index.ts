import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../../utils/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const { 
      limit = 10, 
      offset = 0, 
      city, 
      propertyType, 
      postingType 
    } = req.query;

    let query = supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .in('status', ['Approved', 'Published', 'Active']) // Multiple status values
      .order('created_at', { ascending: false });

    // Apply filters
    if (city) {
      query = query.ilike('city', `%${city}%`);
    }
    if (propertyType) {
      query = query.eq('property_type', propertyType);
    }
    if (postingType) {
      query = query.eq('posting_type', postingType);
    }

    // Pagination
    const limitNum = parseInt(limit as string, 10);
    const offsetNum = parseInt(offset as string, 10);
    query = query.range(offsetNum, offsetNum + limitNum - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch properties', 
        details: error.message 
      });
    }

    // Format response
    const formattedData = (data || []).map((property: any) => {
      // Parse images
      const images = [];
      if (property.main_image) images.push(property.main_image);
      if (property.primary_image && !images.includes(property.primary_image)) {
        images.push(property.primary_image);
      }
      if (property.other_images) {
        const otherImgs = typeof property.other_images === 'string' 
          ? property.other_images.split(',').map((img: string) => img.trim()) 
          : property.other_images;
        otherImgs.forEach((img: string) => {
          if (img && !images.includes(img)) images.push(img);
        });
      }

      // Parse amenities
      let amenities = [];
      if (property.amenities) {
        amenities = typeof property.amenities === 'string' 
          ? JSON.parse(property.amenities) 
          : property.amenities;
      }

      return {
        id: property.id,
        title: property.property_title || property.title || '',
        propertyType: property.property_type || '',
        bhkType: property.bhk_type || '',
        price: property.price || '0',
        city: property.city || '',
        locality: property.locality || '',
        builtUpArea: property.built_up_area || property.area_sqft || '',
        carpetArea: property.carpet_area || property.area_sqm || '',
        mainImage: images[0] || null,
        images: images,
        amenities: amenities || [],
        ownerName: property.owner_name || '',
        ownerMobile: property.owner_mobile || '',
        ownerEmail: property.owner_email || '',
        ownerWhatsapp: property.owner_whatsapp || '',
        description: property.description || '',
        postingType: property.posting_type || property.listing_type || '',
        furnishingType: property.furnishing_type || property.furnished_status || '',
        propertyStatus: property.property_status || property.possession_status || '',
        createdAt: property.created_at,
        // Include all other fields
        ...property,
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedData,
      pagination: {
        total: count || 0,
        limit: limitNum,
        offset: offsetNum,
        hasMore: (count || 0) > offsetNum + limitNum,
      },
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

