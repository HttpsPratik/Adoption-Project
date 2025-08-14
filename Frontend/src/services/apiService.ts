// src/services/apiService.ts - Updated for Vite
import { Pet, ContactMessage, ContactInfo, Shelter, ApiResponse, PetFilters, PetImage } from '../types/api';

class ApiService {
  private baseURL: string;

  constructor() {
    // Vite uses import.meta.env instead of process.env
    this.baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
  }

  // Helper method for making requests with proper typing
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add CSRF token if available
    const csrfToken = this.getCSRFToken();
    if (csrfToken && config.headers) {
      (config.headers as Record<string, string>)['X-CSRFToken'] = csrfToken;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text() as unknown as T;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private getCSRFToken(): string | null {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.request<{ status: string; message: string }>('/health/');
  }

  // Pet API methods
  async getPets(filters: PetFilters = {}): Promise<ApiResponse<Pet>> {
    const queryString = new URLSearchParams(
      Object.entries(filters)
        .filter(([_, value]) => value !== undefined && value !== '')
        .map(([key, value]) => [key, String(value)])
    ).toString();
    
    const endpoint = queryString ? `/pets/?${queryString}` : '/pets/';
    return this.request<ApiResponse<Pet>>(endpoint);
  }

  async getPet(id: number): Promise<Pet> {
    return this.request<Pet>(`/pets/${id}/`);
  }

  async createPet(petData: Omit<Pet, 'id' | 'owner' | 'created_at' | 'updated_at' | 'location_display' | 'is_missing' | 'is_available_for_adoption'>): Promise<Pet> {
    return this.request<Pet>('/pets/', {
      method: 'POST',
      body: JSON.stringify(petData),
    });
  }

  // Missing pets API methods
  async getMissingPets(filters: PetFilters = {}): Promise<ApiResponse<Pet>> {
    const queryString = new URLSearchParams(
      Object.entries(filters)
        .filter(([_, value]) => value !== undefined && value !== '')
        .map(([key, value]) => [key, String(value)])
    ).toString();
    
    const endpoint = queryString ? `/pets/missing/?${queryString}` : '/pets/missing/';
    return this.request<ApiResponse<Pet>>(endpoint);
  }

  async reportMissingPet(petData: Omit<Pet, 'id' | 'owner' | 'created_at' | 'updated_at' | 'location_display' | 'is_missing' | 'is_available_for_adoption'>): Promise<Pet> {
    return this.request<Pet>('/pets/missing/', {
      method: 'POST',
      body: JSON.stringify(petData),
    });
  }

  // Contact API methods
  async sendContactMessage(messageData: Omit<ContactMessage, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<{ message: string; data: ContactMessage }> {
    return this.request<{ message: string; data: ContactMessage }>('/contact/message/', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async getContactInfo(): Promise<ContactInfo> {
    return this.request<ContactInfo>('/contact/info/');
  }

  // Shelter API methods
  async getShelters(params: Record<string, string> = {}): Promise<ApiResponse<Shelter>> {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/shelters/?${queryString}` : '/shelters/';
    return this.request<ApiResponse<Shelter>>(endpoint);
  }

  async getShelter(id: number): Promise<Shelter> {
    return this.request<Shelter>(`/shelters/${id}/`);
  }
}

export default new ApiService();