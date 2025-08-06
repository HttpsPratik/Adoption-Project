
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { Pet } from '@/context/AuthContext';

export interface SearchFilterProps {
  pets: Pet[];
  onFilterChange: (filtered: Pet[]) => void;
}

const SearchFilter = ({ pets, onFilterChange }: SearchFilterProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterBreed, setFilterBreed] = useState<string | null>(null);
  const [filterGender, setFilterGender] = useState<string | null>(null);

  // Get unique types, breeds and genders for filters
  const petTypes = Array.from(new Set(pets.map(pet => pet.type)));
  const petBreeds = Array.from(new Set(pets.map(pet => pet.breed)));
  const petGenders = Array.from(new Set(pets.map(pet => pet.gender)));
  
  // Filter pets when any filter changes
  useEffect(() => {
    filterPets();
  }, [searchTerm, filterType, filterBreed, filterGender]);
  
  const filterPets = () => {
    let filteredPets = [...pets];
    
    // Filter by search term
    if (searchTerm) {
      filteredPets = filteredPets.filter(
        pet =>
          pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply filters
    if (filterType) {
      filteredPets = filteredPets.filter(pet => pet.type === filterType);
    }
    
    if (filterBreed) {
      filteredPets = filteredPets.filter(pet => pet.breed === filterBreed);
    }
    
    if (filterGender) {
      filteredPets = filteredPets.filter(pet => pet.gender === filterGender);
    }
    
    onFilterChange(filteredPets);
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setFilterType(null);
    setFilterBreed(null);
    setFilterGender(null);
    onFilterChange(pets);
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search input */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search by name, breed, location..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Filter selects */}
        <div className="flex flex-col sm:flex-row gap-4 lg:w-2/3">
          <div className="flex-1">
            <Select value={filterType || ""} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Pet type" />
              </SelectTrigger>
              <SelectContent>
                {petTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <Select value={filterBreed || ""} onValueChange={setFilterBreed}>
              <SelectTrigger>
                <SelectValue placeholder="Breed" />
              </SelectTrigger>
              <SelectContent>
                {petBreeds.map((breed) => (
                  <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <Select value={filterGender || ""} onValueChange={setFilterGender}>
              <SelectTrigger>
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                {petGenders.map((gender) => (
                  <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Reset filters button */}
      {(searchTerm || filterType || filterBreed || filterGender) && (
        <div className="flex justify-end mt-4">
          <Button 
            variant="outline"
            onClick={resetFilters} 
            className="flex items-center text-sm"
          >
            <X size={16} className="mr-2" />
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
