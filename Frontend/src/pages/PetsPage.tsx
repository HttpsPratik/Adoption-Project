import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PetCard, { Pet } from '@/components/pets/PetCard';
import PetDetailsModal from '@/components/pets/PetDetailsModal';
import { Button } from '@/components/ui/button';
import { PawPrint, Search, Filter, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const PetsPage = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [petType, setPetType] = useState('all');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showPetModal, setShowPetModal] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Mock data for pets
    const mockPets: Pet[] = [
      {
        id: '1',
        name: 'Max',
        type: 'Dog',
        breed: 'Golden Retriever',
        age: '2 years',
        gender: 'Male',
        location: 'Seattle, WA',
        imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1924&q=80',
      },
      {
        id: '2',
        name: 'Luna',
        type: 'Cat',
        breed: 'Siamese',
        age: '1 year',
        gender: 'Female',
        location: 'Portland, OR',
        imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1927&q=80',
      },
      {
        id: '3',
        name: 'Charlie',
        type: 'Dog',
        breed: 'Beagle',
        age: '3 years',
        gender: 'Male',
        location: 'San Francisco, CA',
        imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1994&q=80',
      },
      {
        id: '4',
        name: 'Bella',
        type: 'Cat',
        breed: 'Maine Coon',
        age: '4 years',
        gender: 'Female',
        location: 'Denver, CO',
        imageUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80',
      },
      {
        id: '5',
        name: 'Rocky',
        type: 'Dog',
        breed: 'German Shepherd',
        age: '5 years',
        gender: 'Male',
        location: 'Chicago, IL',
        imageUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f98c6e2e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z2VybWFuJTIwc2hlcGhlcmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
      },
      {
        id: '6',
        name: 'Milo',
        type: 'Cat',
        breed: 'Persian',
        age: '2 years',
        gender: 'Male',
        location: 'Austin, TX',
        imageUrl: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cGVyc2lhbiUyMGNhdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
      },
      {
        id: '7',
        name: 'Daisy',
        type: 'Dog',
        breed: 'Labrador',
        age: '1 year',
        gender: 'Female',
        location: 'New York, NY',
        imageUrl: 'https://images.unsplash.com/photo-1605897472359-85e4b94d685d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGxhYnJhZG9yfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
      },
      {
        id: '8',
        name: 'Leo',
        type: 'Cat',
        breed: 'Bengal',
        age: '3 years',
        gender: 'Male',
        location: 'Miami, FL',
        imageUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVuZ2FsJTIwY2F0fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
      },
      {
        id: '9',
        name: 'Stella',
        type: 'Dog',
        breed: 'Poodle',
        age: '4 years',
        gender: 'Female',
        location: 'Boston, MA',
        imageUrl: 'https://images.unsplash.com/photo-1585231474241-c8340c3b2c38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cG9vZGxlfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
      },
      {
        id: '10',
        name: 'Oliver',
        type: 'Cat',
        breed: 'Ragdoll',
        age: '2 years',
        gender: 'Male',
        location: 'Nashville, TN',
        imageUrl: 'https://images.unsplash.com/photo-1584930608757-20e79be35407?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmFnZG9sbCUyMGNhdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
      },
      {
        id: '11',
        name: 'Cooper',
        type: 'Dog',
        breed: 'Corgi',
        age: '3 years',
        gender: 'Male',
        location: 'Philadelphia, PA',
        imageUrl: 'https://images.unsplash.com/photo-1612536057342-14cb6d4a95e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29yZ2l8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
      },
      {
        id: '12',
        name: 'Lily',
        type: 'Cat',
        breed: 'Scottish Fold',
        age: '1 year',
        gender: 'Female',
        location: 'San Diego, CA',
        imageUrl: 'https://images.unsplash.com/photo-1596854372407-baba7fef6e51?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNjb3R0aXNoJTIwZm9sZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
      },
      {
        id: '13',
        name: 'Buddy',
        type: 'Dog',
        breed: 'Bulldog',
        age: '5 years',
        gender: 'Male',
        location: 'Dallas, TX',
        imageUrl: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVsbGRvZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
      },
      {
        id: '14',
        name: 'Sophie',
        type: 'Cat',
        breed: 'Sphynx',
        age: '2 years',
        gender: 'Female',
        location: 'Las Vegas, NV',
        imageUrl: 'https://images.unsplash.com/photo-1606478093633-6223dfe08af4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3BoeW54JTIwY2F0fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
      },
      {
        id: '15',
        name: 'Teddy',
        type: 'Dog',
        breed: 'Pomeranian',
        age: '2 years',
        gender: 'Male',
        location: 'Phoenix, AZ',
        imageUrl: 'https://images.unsplash.com/photo-1575535468632-345892291673?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9tZXJhbmlhbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
      },
      {
        id: '16',
        name: 'Chloe',
        type: 'Cat',
        breed: 'Abyssinian',
        age: '3 years',
        gender: 'Female',
        location: 'Minneapolis, MN',
        imageUrl: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YWJ5c3NpbmlhbiUyMGNhdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
      },
      {
        id: '17',
        name: 'Duke',
        type: 'Dog',
        breed: 'Boxer',
        age: '4 years',
        gender: 'Male',
        location: 'Atlanta, GA',
        imageUrl: 'https://images.unsplash.com/photo-1554692540-2343683e0128?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Ym94ZXIlMjBkb2d8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
      },
      {
        id: '18',
        name: 'Willow',
        type: 'Cat',
        breed: 'Russian Blue',
        age: '2 years',
        gender: 'Female',
        location: 'Detroit, MI',
        imageUrl: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cnVzc2lhbiUyMGJsdWUlMjBjYXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
      },
      {
        id: '19',
        name: 'Bailey',
        type: 'Dog',
        breed: 'Husky',
        age: '3 years',
        gender: 'Female',
        location: 'Denver, CO',
        imageUrl: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGh1c2t5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
      },
      {
        id: '20',
        name: 'Jasper',
        type: 'Cat',
        breed: 'Bombay',
        age: '1 year',
        gender: 'Male',
        location: 'Houston, TX',
        imageUrl: 'https://images.unsplash.com/photo-1570824104453-508955ab713e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmxhY2slMjBjYXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
      },
      {
        id: '21',
        name: 'Marley',
        type: 'Dog',
        breed: 'Australian Shepherd',
        age: '2 years',
        gender: 'Male',
        location: 'Sacramento, CA',
        imageUrl: 'https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXVzdHJhbGlhbiUyMHNoZXBoZXJkfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
      },
      {
        id: '22',
        name: 'Zoe',
        type: 'Cat',
        breed: 'Calico',
        age: '2 years',
        gender: 'Female',
        location: 'Seattle, WA',
        imageUrl: 'https://images.unsplash.com/photo-1568152950566-c1bf43f4ab28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FsaWNvJTIwY2F0fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
      }
    ];
    
    setPets(mockPets);
  }, []);
  
  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = petType === 'all' || pet.type.toLowerCase() === petType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const handleAdopt = (pet: Pet) => {
    setSelectedPet(pet);
    setShowPetModal(true);
  };
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-[#F1F0FB] to-white">
        {/* Hero Section */}
        <div className="relative bg-adoptables-dark py-16">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3')] bg-cover bg-center opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-adoptables-dark to-adoptables-dark/80"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight font-heading">
                Find Your Perfect <span className="text-adoptables-accent">Companion</span>
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Browse through our adorable pets waiting for their forever home. Each one has a unique personality and is ready to fill your life with joy and love.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-12 -mt-12 relative z-20">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    placeholder="Search by name, breed, location..."
                    className="pl-10 border-gray-200 focus:border-adoptables-blue"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                <Select value={petType} onValueChange={setPetType}>
                  <SelectTrigger className="w-[180px] border-gray-200">
                    <SelectValue placeholder="Pet Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Pets</SelectItem>
                    <SelectItem value="dog">Dogs</SelectItem>
                    <SelectItem value="cat">Cats</SelectItem>
                  </SelectContent>
                </Select>
                
                <Link to="/submit-pet">
                  <Button className="bg-green-500 hover:bg-green-600 text-white font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
                    <PawPrint size={18} />
                    Have Pet for Adoption
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Results Counter */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold font-heading text-gray-800">
              {filteredPets.length} Pets Available for Adoption
            </h2>
            <div className="hidden md:flex items-center text-sm text-gray-500">
              <Filter size={16} className="mr-1" /> 
              Showing: {petType === 'all' ? 'All Pets' : (petType === 'dog' ? 'Dogs' : 'Cats')}
            </div>
          </div>
          
          {/* Pet Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {filteredPets.length > 0 ? (
              filteredPets.map((pet) => (
                <div key={pet.id} className="group transform transition-all duration-300 hover:-translate-y-1">
                  <PetCard pet={pet} onAdopt={handleAdopt} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-adoptables-light rounded-xl border border-gray-100 shadow-inner">
                <div className="mb-4">
                  <PawPrint size={48} className="text-adoptables-blue mx-auto opacity-50" />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-700">No Pets Found</h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  We couldn't find any pets matching your search criteria. Try adjusting your filters or search term.
                </p>
                <Button 
                  onClick={() => {setSearchTerm(''); setPetType('all');}}
                  variant="outline" 
                  className="border-adoptables-blue text-adoptables-blue hover:bg-adoptables-light"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {filteredPets.length > 12 && (
            <div className="flex justify-center mt-8 mb-16">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="border-gray-200">Previous</Button>
                <Button size="sm" className="bg-adoptables-blue">1</Button>
                <Button variant="outline" size="sm" className="border-gray-200">2</Button>
                <Button variant="outline" size="sm" className="border-gray-200">Next</Button>
              </div>
            </div>
          )}
          
          {/* Adoption Call To Action */}
          <div className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] rounded-xl p-8 text-white text-center mb-12 shadow-lg">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Welcome a New Family Member?</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              By adopting, you're not just giving a pet a home, you're giving them a second chance at happiness. 
              Our adoption process is simple and supportive.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-white text-[#7E69AB] hover:bg-gray-100 shadow-md">
                Adoption Process
              </Button>
              <Button variant="outline" className="text-white border-white hover:bg-white/10">
                Adoption FAQs
              </Button>
            </div>
          </div>

          {/* Safety Footer Disclaimer */}
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-center text-red-700">
              <p className="font-semibold text-sm">Platform Liability Disclaimer</p>
              <p className="text-xs mt-1">
                All pet adoptions occur entirely at user's own risk. Platform accepts NO responsibility 
                for pet health, meetings, interactions, or outcomes. Users must verify all information independently.
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Pet Details Modal */}
      <PetDetailsModal
        pet={selectedPet}
        open={showPetModal}
        onClose={() => {
          setShowPetModal(false);
          setSelectedPet(null);
        }}
      />

      <Footer />
    </>
  );
};

export default PetsPage;
