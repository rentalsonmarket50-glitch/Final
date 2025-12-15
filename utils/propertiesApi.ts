import { supabase } from './supabase/client';

interface GetAllParams {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  propertyType?: string;
  status?: string; // 'published' or 'unpublished'
  postingType?: string; // 'Sell' or 'Rent'
  filter?: Record<string, any>;
}

interface PropertyResponse {
  id: number;
  title: string;
  propertyType: string;
  postingType: string;
  price: string;
  bhk: string;
  area: string;
  locality: string;
  city: string;
  status: string;
  mainImage: string;
  otherImages: string[];
  createdAt: string;
  [key: string]: any;
}

interface PaginationResponse {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface ApiResponse {
  data: PropertyResponse[];
  pagination: PaginationResponse;
}

// Map database property to API response format
const mapDbPropertyToResponse = (dbProperty: any): PropertyResponse => {
  // Parse images
  const images = [];
  if (dbProperty.main_image) images.push(dbProperty.main_image);
  if (dbProperty.primary_image && !images.includes(dbProperty.primary_image)) {
    images.push(dbProperty.primary_image);
  }
  if (dbProperty.other_images) {
    const otherImgs = typeof dbProperty.other_images === 'string' 
      ? dbProperty.other_images.split(',').map((img: string) => img.trim()).filter((img: string) => img) 
      : Array.isArray(dbProperty.other_images) ? dbProperty.other_images : [];
    otherImgs.forEach((img: string) => {
      if (img && !images.includes(img)) images.push(img);
    });
  }

  // Format price
  let price = '₹0';
  if (dbProperty.price) {
    if (typeof dbProperty.price === 'number') {
      price = `₹${new Intl.NumberFormat('en-IN').format(dbProperty.price)}`;
    } else {
      const priceStr = dbProperty.price.toString().replace(/[^0-9.]/g, '');
      if (priceStr) {
        const priceNum = parseFloat(priceStr);
        if (!isNaN(priceNum)) {
          price = `₹${new Intl.NumberFormat('en-IN').format(priceNum)}`;
        } else {
          price = dbProperty.price.toString();
        }
      } else {
        price = dbProperty.price.toString();
      }
    }
  }

  // Format area
  const area = dbProperty.built_up_area || dbProperty.area_sqft || dbProperty.carpet_area || '0';
  const areaStr = typeof area === 'number' ? area.toString() : area;

  return {
    id: dbProperty.id,
    title: dbProperty.property_title || dbProperty.title || 'Property',
    propertyType: dbProperty.property_type || '',
    postingType: dbProperty.posting_type || dbProperty.listing_type || 'Sell',
    price: price,
    bhk: dbProperty.bhk_type || '',
    area: areaStr,
    locality: dbProperty.locality || '',
    city: dbProperty.city || '',
    status: dbProperty.status || dbProperty.verification_status || 'Pending',
    mainImage: images[0] || '/assets/hero.jpg',
    otherImages: images.slice(1),
    createdAt: dbProperty.created_at || new Date().toISOString(),
    // Include all other fields
    ...dbProperty,
  };
};

export const propertiesApi = {
  async getAll(params: GetAllParams = {}): Promise<ApiResponse> {
    const {
      page = 1,
      limit = 20,
      search = '',
      city = '',
      propertyType = '',
      status = '',
      postingType = '',
      filter = {},
    } = params;

    try {
      let query = supabase
        .from('properties')
        .select('*', { count: 'exact' });

      // Apply filters
      if (status) {
        // Map 'published' to 'Approved' and 'unpublished' to 'Pending'
        const statusValue = status === 'published' ? 'Approved' : status === 'unpublished' ? 'Pending' : status;
        query = query.eq('status', statusValue);
      }

      if (city) {
        query = query.ilike('city', `%${city}%`);
      }

      if (propertyType) {
        query = query.eq('property_type', propertyType);
      }

      if (postingType) {
        query = query.eq('posting_type', postingType);
      }

      // Search filter (search in title, description, locality, city)
      if (search) {
        query = query.or(
          `property_title.ilike.%${search}%,description.ilike.%${search}%,locality.ilike.%${search}%,city.ilike.%${search}%`
        );
      }

      // Apply additional filters
      if (filter && Object.keys(filter).length > 0) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (typeof value === 'string' && value.includes('%')) {
              query = query.ilike(key, value);
            } else {
              query = query.eq(key, value);
            }
          }
        });
      }

      // Order by created_at (most recent first)
      query = query.order('created_at', { ascending: false });

      // Pagination
      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }

      // Map database properties to response format
      const mappedData = (data || []).map(mapDbPropertyToResponse);

      return {
        data: mappedData,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil((count || 0) / limit),
          totalItems: count || 0,
          itemsPerPage: limit,
        },
      };
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<PropertyResponse> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('Property not found');
      }

      return mapDbPropertyToResponse(data);
    } catch (error: any) {
      console.error('Error fetching property:', error);
      throw error;
    }
  },

  async updateStatus(id: number, status: string): Promise<void> {
    try {
      // Map status values
      const statusValue = status === 'published' ? 'Approved' : status === 'unpublished' ? 'Pending' : status;
      
      const { error } = await supabase
        .from('properties')
        .update({ status: statusValue })
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }
    } catch (error: any) {
      console.error('Error updating property status:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }
    } catch (error: any) {
      console.error('Error deleting property:', error);
      throw error;
    }
  },
};

