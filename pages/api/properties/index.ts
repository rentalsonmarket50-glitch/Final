import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { property_type, city, locality, posting_type, min_price, max_price, furnishing, status, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('properties')
      .select('*')
      .eq('status', 'Approved') // Only approved properties
      .order('created_at', { ascending: false });

    // Apply filters
    if (property_type) {
      query = query.eq('property_type', property_type);
    }
    if (city) {
      query = query.eq('city', city);
    }
    if (locality) {
      query = query.ilike('locality', `%${locality}%`);
    }
    if (posting_type) {
      query = query.eq('posting_type', posting_type);
    }
    if (furnishing) {
      query = query.eq('furnishing_type', furnishing);
    }
    if (status) {
      query = query.eq('property_status', status);
    }

    // Price filter (if price is stored as numeric, adjust accordingly)
    if (min_price || max_price) {
      // Note: This assumes price is stored as text. Adjust based on your actual schema
      // You may need to cast or parse the price field
    }

    query = query.range(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string) - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch properties', details: error.message });
    }

    return res.status(200).json({
      properties: data || [],
      total: count || 0,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });
  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

