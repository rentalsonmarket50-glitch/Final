import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    // Get total active properties
    const { count: totalCount, error: totalError } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Approved');

    if (totalError) {
      console.error('Supabase error:', totalError);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch statistics', 
        details: totalError.message 
      });
    }

    // Get count by property type
    const { data: propertyTypeData, error: propertyTypeError } = await supabase
      .from('properties')
      .select('property_type')
      .eq('status', 'Approved');

    const propertyTypeCount: { [key: string]: number } = {};
    if (propertyTypeData) {
      propertyTypeData.forEach((item: any) => {
        const type = item.property_type || 'Other';
        propertyTypeCount[type] = (propertyTypeCount[type] || 0) + 1;
      });
    }

    // Get count by posting type
    const { data: postingTypeData, error: postingTypeError } = await supabase
      .from('properties')
      .select('posting_type, listing_type')
      .eq('status', 'Approved');

    const postingTypeCount: { [key: string]: number } = {
      Sell: 0,
      Rent: 0,
    };

    if (postingTypeData) {
      postingTypeData.forEach((item: any) => {
        const type = item.posting_type || item.listing_type || 'Sell';
        if (type.toLowerCase() === 'rent') {
          postingTypeCount.Rent += 1;
        } else {
          postingTypeCount.Sell += 1;
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        total: totalCount || 0,
        byPropertyType: propertyTypeCount,
        byPostingType: postingTypeCount,
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

