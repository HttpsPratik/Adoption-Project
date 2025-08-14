
import { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, X, User, Heart, Home, Search, AlertTriangle, HeartHandshake, Info, Mail, Shield } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/pets', label: 'Adopt', icon: <Search size={20} /> },
    { path: '/missing', label: 'Missing Pets', icon: <AlertTriangle size={20} /> },
    { path: '/rescue', label: 'Rescue', icon: <Shield size={20} /> },
    { path: '/donate', label: 'Donate', icon: <HeartHandshake size={20} /> },
    { path: '/contact', label: 'Contact', icon: <Mail size={20} /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-adoptables-blue flex items-center justify-center">
            <Heart size={24} className="text-white" />
          </div>
          <span className="text-2xl font-heading font-bold text-adoptables-dark hidden sm:inline">
            Adoptables
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-adoptables-blue' 
                    : 'text-gray-600 hover:text-adoptables-blue hover:bg-adoptables-light'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-3">
          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-adoptables-blue">
              <Heart size={20} />
            </Button>
          </Link>
          <Link to="/auth">
            <Button className="bg-adoptables-blue hover:bg-adoptables-dark">
              <User size={18} className="mr-2" /> Sign In
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 hover:text-adoptables-blue"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white pt-16 animate-fade-in">
          <div className="container mx-auto px-4 py-8">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg text-lg font-medium ${
                    isActive(item.path)
                      ? 'bg-adoptables-light text-adoptables-blue'
                      : 'text-gray-600'
                  }`}
                  onClick={closeMenu}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </NavLink>
              ))}
              <div className="border-t border-gray-200 my-4"></div>
              <Link 
                to="/wishlist" 
                className="flex items-center px-4 py-3 rounded-lg text-lg font-medium text-gray-600"
                onClick={closeMenu}
              >
                <Heart size={20} />
                <span className="ml-3">Wishlist</span>
              </Link>
              <Link 
                to="/auth" 
                className="flex items-center px-4 py-3 rounded-lg text-lg font-medium bg-adoptables-blue text-white"
                onClick={closeMenu}
              >
                <User size={20} />
                <span className="ml-3">Sign In / Register</span>
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-6 h-16">
          {navItems.slice(0, 6).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center h-full relative ${
                  isActive ? 'text-adoptables-blue' : 'text-gray-500'
                }`
              }
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label.split(' ')[0]}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
