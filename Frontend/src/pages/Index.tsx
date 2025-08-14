
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import PetCard, { Pet } from '@/components/pets/PetCard';
import { ArrowRight, PawPrint, HeartHandshake, Search, AlertTriangle, Heart } from 'lucide-react';

const Index = () => {
  const [featuredPets, setFeaturedPets] = useState<Pet[]>([]);
  const [missingPets, setMissingPets] = useState<Pet[]>([]);

  useEffect(() => {
    // Mock data for featured pets
    const pets = [
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
      }
    ];
    
    setFeaturedPets(pets);
    
    // Mock data for missing pets
    const missing = [
      {
        id: '5',
        name: 'Buddy',
        type: 'Dog',
        breed: 'Labrador',
        age: '3 years',
        gender: 'Male',
        location: 'Kathmandu, Nepal',
        imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      },
      {
        id: '6',
        name: 'Simba',
        type: 'Cat',
        breed: 'Persian',
        age: '2 years',
        gender: 'Male',
        location: 'Pokhara, Nepal',
        imageUrl: 'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80',
      },
      {
        id: '7',
        name: 'Daisy',
        type: 'Dog',
        breed: 'Shih Tzu',
        age: '1 year',
        gender: 'Female',
        location: 'Lalitpur, Nepal',
        imageUrl: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80',
      },
      {
        id: '8',
        name: 'Milo',
        type: 'Cat',
        breed: 'Bengal',
        age: '4 years',
        gender: 'Male',
        location: 'Bhaktapur, Nepal',
        imageUrl: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      }
    ];
    
    setMissingPets(missing);
  }, []);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <Hero />
        
        {/* Missing Pets Section */}
        <section className="py-16 bg-adoptables-gray">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold font-heading">Missing Pets</h2>
              <div className="flex gap-4 items-center">
                <Link to="/missing" className="text-adoptables-blue hover:text-adoptables-dark flex items-center transition-colors">
                  View all missing pets <ArrowRight size={16} className="ml-1" />
                </Link>
                <Link to="/missing?report=true">
                  <Button 
                    variant="secondary" 
                    className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-2"
                  >
                    <AlertTriangle size={16} />
                    Report Missing Pet
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {missingPets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          </div>
        </section>
        
        {/* How it Works Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-heading">How Adoption Works</h2>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                Our mission is to make pet adoption simple, humane, and rewarding for both animals and humans.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-adoptables-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={28} className="text-adoptables-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2">1. Find a Pet</h3>
                <p className="text-gray-600">
                  Browse our listings to find the perfect companion for your home and lifestyle.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-adoptables-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <PawPrint size={28} className="text-adoptables-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2">2. Meet & Greet</h3>
                <p className="text-gray-600">
                  Schedule a meeting at our shelter to make sure it's a good match for everyone.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-adoptables-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <HeartHandshake size={28} className="text-adoptables-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2">3. Welcome Home</h3>
                <p className="text-gray-600">
                  Complete the adoption process and welcome your new family member home.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-10">
              <Link to="/pets">
                <Button className="bg-adoptables-blue hover:bg-adoptables-dark">
                  Start Your Adoption Journey
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Donation Banner - Replacing the Community Banner */}
        <section className="py-16 bg-amber-50 text-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <div className="flex items-center mb-3">
                  <Heart size={24} className="mr-2 text-red-500" />
                  <h2 className="text-2xl font-bold font-heading">Support Our Furry Friends</h2>
                </div>
                <p className="max-w-lg">
                  Your generous donation helps us rescue, care for, and rehome animals in need. 
                  Every contribution, no matter how small, makes a difference in a pet's life.
                </p>
              </div>
              <div>
                <Link to="/donate">
                  <Button className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg">
                    Donate Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Pets */}
        <section id="featured-pets" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-heading">Featured Pets</h2>
              <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                These adorable companions are looking for loving homes. Could one of them be your perfect match?
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredPets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Link to="/pets">
                <Button className="bg-adoptables-blue hover:bg-adoptables-dark text-white">
                  Adopt a Pet
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-adoptables-blue text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
              Ready to Find Your Forever Friend?
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8">
              Every pet deserves a loving home. Start your journey today and give a deserving animal a second chance.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/pets">
                <Button className="bg-white text-adoptables-blue hover:bg-gray-100 w-full sm:w-auto">
                  Find a Pet
                </Button>
              </Link>
              <Link to="/submit-pet">
                <Button variant="outline" className="border-white bg-transparent hover:bg-white/10 w-full sm:w-auto">
                  Submit Your Pet
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Index;
