import { projectId, publicAnonKey } from './supabase/info';

// Use the correct function name - check if it's make-server-b2101d4d or make-server-5f9a91cf
const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-b2101d4d`;

// Generic KV API client
class KvApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('KV API Request:', url);
    console.log('KV API Options:', { method: options.method || 'GET', headers: options.headers });
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          ...options.headers,
        },
      });

      console.log('KV API Response Status:', response.status);
      console.log('KV API Response OK:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('KV API Error Response:', errorText);
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { error: errorText || `HTTP ${response.status}` };
        }
        throw new Error(error.error || error.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('KV API Response Data:', data);
      return data;
    } catch (error: any) {
      console.error('KV API Request Error:', error);
      throw error;
    }
  }

  async get(key: string) {
    return this.request(`/kv/${encodeURIComponent(key)}`);
  }

  async set(key: string, value: any) {
    return this.request(`/kv/${encodeURIComponent(key)}`, {
      method: 'POST',
      body: JSON.stringify({ value }),
    });
  }

  async delete(key: string) {
    return this.request(`/kv/${encodeURIComponent(key)}`, {
      method: 'DELETE',
    });
  }

  async getByPrefix(prefix: string) {
    return this.request(`/kv/prefix/${encodeURIComponent(prefix)}`);
  }

  async mget(keys: string[]) {
    return this.request('/kv/mget', {
      method: 'POST',
      body: JSON.stringify({ keys }),
    });
  }
}

// Create base client
const kvClient = new KvApiClient(API_BASE_URL, publicAnonKey);

// Generic API wrapper for a specific entity type
function createEntityApi(entityType: string) {
  const getCounterKey = () => `counter:${entityType}`;
  const getEntityKey = (id: number) => `${entityType}:${id}`;

  return {
    async getAll(params: {
      search?: string;
      filter?: Record<string, any>;
      page?: number;
      limit?: number;
      status?: string;
    } = {}) {
      const { search, filter, page = 1, limit = 10, status } = params;
      
      // Get all keys with prefix
      const result = await kvClient.getByPrefix(`${entityType}:`);
      console.log(`KV Store getAll for ${entityType} - Raw Result:`, result);
      
      // Response format can be:
      // 1. Direct array: [{ key, value }, ...]
      // 2. Object with data: { data: [{ key, value }, ...] }
      // 3. Object with success: { success: true, data: [...] }
      let allItems: any[] = [];
      
      if (Array.isArray(result)) {
        allItems = result;
      } else if (result && result.data) {
        allItems = Array.isArray(result.data) ? result.data : [];
      } else if (result && Array.isArray(result)) {
        allItems = result;
      }
      
      console.log(`KV Store ${entityType} - Raw Items Count:`, allItems.length);
      console.log(`KV Store ${entityType} - First Item Sample:`, allItems[0]);
      
      // Parse JSON values
      let items = allItems.map((item: any, index: number) => {
        try {
          // Handle different response formats
          let value;
          if (item.value !== undefined) {
            value = item.value;
          } else if (item && typeof item === 'object' && !Array.isArray(item)) {
            value = item;
          } else {
            value = item;
          }
          
          // If value is a string, try to parse as JSON
          if (typeof value === 'string') {
            try {
              return JSON.parse(value);
            } catch {
              return value;
            }
          }
          
          return value;
        } catch (error) {
          console.error(`Error parsing item ${index}:`, error, item);
          return item.value !== undefined ? item.value : item;
        }
      });
      
      console.log(`KV Store ${entityType} - Parsed Items Count:`, items.length);

      // Apply filters
      if (status) {
        // Check multiple status formats: 'published', 'Published', 'Approved', etc.
        const statusLower = status.toLowerCase();
        const beforeFilter = items.length;
        items = items.filter((item: any) => {
          const itemStatus = (item.status || '').toLowerCase();
          // Match exact status or allow 'approved'/'published' interchangeably
          // Also include items without status if filter is 'published'
          return itemStatus === statusLower || 
                 (statusLower === 'published' && (itemStatus === 'approved' || itemStatus === 'published' || !itemStatus)) ||
                 (statusLower === 'approved' && (itemStatus === 'approved' || itemStatus === 'published'));
        });
        console.log(`After status filter (${status}): ${beforeFilter} -> ${items.length} items`);
      }

      if (search) {
        const searchLower = search.toLowerCase();
        items = items.filter((item: any) => {
          const searchableFields = [
            item.name,
            item.firstName,
            item.lastName,
            item.phone,
            item.email,
            item.message,
            item.propertyTitle,
            item.location,
          ].filter(Boolean);
          return searchableFields.some((field: string) =>
            field.toLowerCase().includes(searchLower)
          );
        });
      }

      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            items = items.filter((item: any) => item[key] === value);
          }
        });
      }

      // Pagination
      const total = items.length;
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedItems = items.slice(start, end);

      return {
        success: true,
        data: paginatedItems,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    },

    async create(data: any) {
      // Get next ID from counter
      let counter = 0;
      try {
        const counterResult = await kvClient.get(getCounterKey());
        // Handle different response formats
        const counterValue = counterResult.data?.value || counterResult.value || counterResult.data || counterResult || '0';
        counter = parseInt(typeof counterValue === 'string' ? counterValue : String(counterValue), 10);
      } catch {
        // Counter doesn't exist, start from 0
      }

      const newId = counter + 1;
      
      // Increment counter
      await kvClient.set(getCounterKey(), newId.toString());

      // Create entity
      const entityData = {
        id: newId,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await kvClient.set(getEntityKey(newId), entityData);

      return {
        success: true,
        data: entityData,
      };
    },

    async update(id: number, data: any) {
      // Get existing entity
      const existing = await kvClient.get(getEntityKey(id));
      // Handle different response formats
      let existingData;
      if (existing.data?.value !== undefined) {
        existingData = typeof existing.data.value === 'string' 
          ? JSON.parse(existing.data.value) 
          : existing.data.value;
      } else if (existing.value !== undefined) {
        existingData = typeof existing.value === 'string' 
          ? JSON.parse(existing.value) 
          : existing.value;
      } else if (existing.data) {
        existingData = typeof existing.data === 'string' 
          ? JSON.parse(existing.data) 
          : existing.data;
      } else {
        existingData = existing;
      }

      // Merge with updates
      const updatedData = {
        ...existingData,
        ...data,
        id,
        updatedAt: new Date().toISOString(),
      };

      await kvClient.set(getEntityKey(id), updatedData);

      return {
        success: true,
        data: updatedData,
      };
    },

    async delete(id: number) {
      await kvClient.delete(getEntityKey(id));
      return { success: true };
    },

    async getById(id: number) {
      const result = await kvClient.get(getEntityKey(id));
      // Handle different response formats
      let data;
      if (result.data?.value !== undefined) {
        data = typeof result.data.value === 'string' 
          ? JSON.parse(result.data.value) 
          : result.data.value;
      } else if (result.value !== undefined) {
        data = typeof result.value === 'string' 
          ? JSON.parse(result.value) 
          : result.value;
      } else if (result.data) {
        data = typeof result.data === 'string' 
          ? JSON.parse(result.data) 
          : result.data;
      } else {
        data = result;
      }
      
      return {
        success: true,
        data,
      };
    },
  };
}

// Export APIs
export const propertyQueriesKvApi = createEntityApi('property_query');
export const generalQueriesKvApi = createEntityApi('general_query');
export const brokersKvApi = createEntityApi('broker');
export const propertiesKvApi = createEntityApi('property');
export const preLaunchKvApi = createEntityApi('pre_launch');

// Export base client if needed
export { kvClient };

