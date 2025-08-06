
import React, { useState, useEffect } from 'react';
import { Pet, PetFilters, ApiResponse } from '../types/api';
import ApiService from '../services/apiService';
import { MapPin, Heart, Calendar, Phone, Search, Filter } from 'lucide-react';

const AdoptPage: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PetFilters>({});
  const [totalCount, setTotalCount] = useState<number>(0);

  // Fetch pets from Django backend
  const fetchPets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: ApiResponse<Pet> = await ApiService.getPets(filters);
      setPets(response.results || []);
      setTotalCount(response.count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pets');
      console.error('Error fetching pets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key: keyof PetFilters, value: string | boolean | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }));
  };

  // Handle adopt button click
  const handleAdopt = (pet: Pet) => {
    // TODO: Implement adoption request modal/form
    alert(`Adoption request for ${pet.name} will be implemented with a proper form`);
  };

  // Format age display
  const getAgeDisplay = (ageInMonths: number): string => {
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;
    if (years === 0) return `${months} months`;
    if (months === 0) return `${years} years`;
    return `${years}y ${months}m`;
  };

  // Get image URL
  const getImageUrl = (imageUrl?: string): string => {
    if (!imageUrl) return '/placeholder.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${process.env.REACT_APP_MEDIA_URL}${imageUrl}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading adorable pets...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600 max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
          <p className="mb-4">Error loading pets: {error}</p>
          <p className="text-sm text-gray-600 mb-6">
            Make sure your Django server is running at http://127.0.0.1:8000
          </p>
          <button 
            onClick={fetchPets}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Find Your Perfect Companion</h1>
          <p className="text-lg text-gray-600">
            Browse through our {totalCount} loving pets waiting for their forever homes
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filter Pets
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Pet Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pet Type</label>
              <select
                value={filters.pet_type || ''}
                onChange={(e) => handleFilterChange('pet_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="dog">Dogs</option>
                <option value="cat">Cats</option>
                <option value="bird">Birds</option>
                <option value="rabbit">Rabbits</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Size Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
              <select
                value={filters.size || ''}
                onChange={(e) => handleFilterChange('size', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Sizes</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="extra_large">Extra Large</option>
              </select>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={filters.gender || ''}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>

            {/* Province Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
              <select
                value={filters.province || ''}
                onChange={(e) => handleFilterChange('province', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Provinces</option>
                <option value="province_1">Province 1</option>
                <option value="madhesh">Madhesh Province</option>
                <option value="bagmati">Bagmati Province</option>
                <option value="gandaki">Gandaki Province</option>
                <option value="lumbini">Lumbini Province</option>
                <option value="karnali">Karnali Province</option>
                <option value="sudurpashchim">Sudurpashchim Province</option>
              </select>
            </div>
          </div>

          {/* Search and Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={filters.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search by name, breed, or location..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-end space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.is_vaccinated || false}
                  onChange={(e) => handleFilterChange('is_vaccinated', e.target.checked || undefined)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Vaccinated only</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.is_neutered || false}
                  onChange={(e) => handleFilterChange('is_neutered', e.target.checked || undefined)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Neutered only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Pet Grid */}
        {pets && pets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map(pet => (
              <div key={pet.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={getImageUrl(pet.image)}
                    alt={pet.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.jpg';
                    }}
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                      Available
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{pet.name}</h3>
                    <span className="text-sm text-gray-500 capitalize">{pet.pet_type}</span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="font-medium">Breed:</span>
                        <p className="text-gray-800">{pet.breed || 'Mixed'}</p>
                      </div>
                      <div>
                        <span className="font-medium">Age:</span>
                        <p className="text-gray-800">{getAgeDisplay(pet.age)}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="font-medium">Size:</span>
                        <p className="text-gray-800 capitalize">{pet.size.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <span className="font-medium">Gender:</span>
                        <p className="text-gray-800 capitalize">{pet.gender}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                      <span className="text-gray-800">{pet.location_display}</span>
                    </div>
                    
                    {pet.is_vaccinated && (
                      <div className="flex items-center">
                        <span className="text-green-600 text-sm">✓ Vaccinated</span>
                      </div>
                    )}
                  </div>
                  
                  {pet.description && (
                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                      {pet.description}
                    </p>
                  )}
                  
                  <div className="mt-4">
                    <button
                      onClick={() => handleAdopt(pet)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Adopt Me
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🐕</div>
            <p className="text-gray-600 text-lg mb-2">No pets found matching your criteria.</p>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search terms.</p>
            <button
              onClick={() => setFilters({})}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdoptPage;