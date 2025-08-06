
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
}

export interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  gender: string;
  location: string;
  imageUrl: string;
  personality?: string;
  description?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  ownerWhatsapp?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  wishlist: Pet[];
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  requireAuth: () => boolean;
  addToWishlist: (pet: Pet) => void;
  removeFromWishlist: (petId: string) => void;
  isInWishlist: (petId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [wishlist, setWishlist] = useState<Pet[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    // Load wishlist from localStorage
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock user data
        const userData = {
          id: '1',
          name: 'John Doe',
          email: email,
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        resolve();
      }, 1000);
    });
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock user data
        const userData = {
          id: '1',
          name: name,
          email: email,
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const requireAuth = (): boolean => {
    if (!isAuthenticated) {
      toast.error('Please sign in to continue');
      navigate('/auth');
      return false;
    }
    return true;
  };
  
  // Wishlist functions
  const addToWishlist = (pet: Pet) => {
    if (!isAuthenticated) {
      navigate('/auth');
      toast.error('Please login to add pets to your wishlist');
      return;
    }
    
    // Check if pet is already in wishlist
    if (!wishlist.some(item => item.id === pet.id)) {
      const updatedWishlist = [...wishlist, pet];
      setWishlist(updatedWishlist);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      toast.success(`${pet.name} added to your wishlist!`);
    }
  };
  
  const removeFromWishlist = (petId: string) => {
    const updatedWishlist = wishlist.filter(pet => pet.id !== petId);
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    toast.success('Pet removed from your wishlist');
  };
  
  const isInWishlist = (petId: string): boolean => {
    return wishlist.some(pet => pet.id === petId);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      wishlist,
      login, 
      register, 
      logout,
      requireAuth,
      addToWishlist,
      removeFromWishlist,
      isInWishlist
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
