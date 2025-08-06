// src/types/api.ts
export interface Pet {
  id: number;
  name: string;
  pet_type: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  breed?: string;
  age: number;
  gender: 'male' | 'female' | 'unknown';
  size: 'small' | 'medium' | 'large' | 'extra_large';
  color?: string;
  description?: string;
  is_vaccinated: boolean;
  is_neutered: boolean;
  health_status?: string;
  province: string;
  district: string;
  city: string;
  detailed_address?: string;
  location_display: string;
  status: 'available' | 'adopted' | 'missing' | 'found' | 'fostered';
  is_active: boolean;
  last_seen_location?: string;
  last_seen_date?: string;
  reward_offered?: number;
  contact_phone?: string;
  contact_email?: string;
  owner: User;
  shelter?: number;
  image?: string;
  additional_images?: PetImage[];
  created_at: string;
  updated_at: string;
  is_missing: boolean;
  is_available_for_adoption: boolean;
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface PetImage {
  id: number;
  image: string;
  caption?: string;
  uploaded_at: string;
}

export interface ContactMessage {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  subject: 'general' | 'adoption' | 'missing' | 'shelter' | 'donation' | 'volunteer' | 'other';
  message: string;
  status?: 'new' | 'in_progress' | 'resolved' | 'closed';
  created_at?: string;
  updated_at?: string;
}

export interface ContactInfo {
  id: number;
  organization_name: string;
  tagline?: string;
  phone_primary: string;
  phone_secondary?: string;
  email_primary: string;
  email_secondary?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  district: string;
  province: string;
  postal_code?: string;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  youtube_url?: string;
  office_hours?: string;
  emergency_phone?: string;
}

export interface Shelter {
  id: number;
  name: string;
  description?: string;
  location: string;
  contact_phone: string;
  contact_email: string;
  website?: string;
  is_verified: boolean;
  created_at: string;
}

export interface ApiResponse<T> {
  count?: number;
  next?: string;
  previous?: string;
  results?: T[];
  data?: T;
  message?: string;
}

export interface PetFilters {
  pet_type?: string;
  size?: string;
  gender?: string;
  province?: string;
  district?: string;
  city?: string;
  is_vaccinated?: boolean;
  is_neutered?: boolean;
  search?: string;
  page?: number;
}