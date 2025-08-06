
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Heart, Star, HandCoins } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center">
      {/* Background image with overlay */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ 
        backgroundImage: 'url(https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80)',
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-adoptables-dark/90 to-adoptables-dark/40"></div>
      </div>
      
      {/* Hero content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl animate-fade-in">
          <div className="inline-flex items-center bg-adoptables-accent/20 px-4 py-2 rounded-full mb-6">
            <Star size={18} className="text-adoptables-accent mr-2" />
            <span className="text-white font-medium">Find your forever friend today</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Find Your <span className="text-adoptables-accent">Forever</span> Friend
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Every pet deserves a loving home. Browse our adoptable friends and find the perfect companion to bring joy to your life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/pets">
              <Button className="w-full sm:w-auto text-lg bg-adoptables-blue hover:bg-adoptables-teal py-6 px-8 rounded-xl shadow-lg shadow-adoptables-blue/20 transition-all duration-300 hover:shadow-adoptables-teal/30 hover:-translate-y-1">
                <Search size={20} className="mr-2" /> Find a Pet
              </Button>
            </Link>
            <Link to="/missing?report=true">
              <Button variant="outline" className="w-full sm:w-auto text-lg bg-white text-adoptables-dark border-white py-6 px-8 rounded-xl hover:bg-white/90 shadow-lg shadow-white/10 transition-all duration-300 hover:-translate-y-1">
                <Heart size={20} className="mr-2" /> Report Missing
              </Button>
            </Link>
            <Link to="/donate">
              <Button variant="outline" className="w-full sm:w-auto text-lg bg-red-500 text-white border-red-500 py-6 px-8 rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all duration-300 hover:-translate-y-1">
                <HandCoins size={20} className="mr-2" /> Make a Change
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Wave shape divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" fill="#ffffff">
          <path d="M0,64L80,74.7C160,85,320,107,480,96C640,85,800,43,960,32C1120,21,1280,43,1360,53.3L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
