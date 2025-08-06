
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { Heart, Calendar, BellRing, Upload, LogOut, Settings, PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import PetCard from '@/components/pets/PetCard';
import { Link, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout, wishlist, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };
  
  const handleSignOut = () => {
    logout();
    navigate('/');
  };
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-adoptables-gray py-16">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <div className="bg-white rounded-xl shadow-sm mb-8">
            <div className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" alt={user?.name} />
                <AvatarFallback className="text-2xl bg-adoptables-blue text-white">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold font-heading mb-2">{user?.name || 'User Name'}</h1>
                <p className="text-gray-600 mb-4">{user?.email || 'user@example.com'}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-adoptables-light text-adoptables-blue">
                    <Heart size={14} className="mr-1" /> Pet Lover
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <Calendar size={14} className="mr-1" /> Joined April 2025
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center"
                  onClick={handleSignOut}
                >
                  <LogOut size={16} className="mr-2" /> Sign Out
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center text-gray-500"
                >
                  <Settings size={16} className="mr-2" /> Settings
                </Button>
              </div>
            </div>
          </div>
          
          {/* Profile Content */}
          <Tabs defaultValue="profile" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="wishlist">My Wishlist</TabsTrigger>
              <TabsTrigger value="mypets">My Pets</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
                      <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="full-name">Full Name</Label>
                            <Input
                              id="full-name"
                              defaultValue={user?.name || 'User Name'}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              defaultValue={user?.email || 'user@example.com'}
                              disabled
                            />
                            <p className="text-xs text-gray-500">Email cannot be changed</p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="Enter your phone number"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              placeholder="City, State"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bio">About Me</Label>
                          <Textarea
                            id="bio"
                            placeholder="Tell us about yourself and your interest in pet adoption"
                            rows={4}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="profile-photo">Profile Photo</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <div className="flex flex-col items-center">
                              <Upload className="h-10 w-10 text-gray-400 mb-2" />
                              <p className="text-sm text-gray-500">
                                Drag and drop an image, or <span className="text-adoptables-blue">browse</span>
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                (Max file size: 2MB, Formats: JPG, PNG)
                              </p>
                            </div>
                            <input id="profile-photo" type="file" className="hidden" accept="image/*" />
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            className="bg-adoptables-blue hover:bg-adoptables-dark"
                          >
                            Save Changes
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <BellRing size={20} className="text-adoptables-blue mr-3" />
                            <span>Email Notifications</span>
                          </div>
                          <Button variant="outline" size="sm">Manage</Button>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                            New pets matching your preferences
                          </p>
                          <p className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                            Updates on pets in your wishlist
                          </p>
                          <p className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                            Application status changes
                          </p>
                          <p className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-gray-300 mr-2"></span>
                            Newsletters and general updates
                          </p>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 mt-6 pt-6">
                        <h3 className="font-bold mb-4">Account Security</h3>
                        <Button variant="outline" className="w-full mb-3">
                          Change Password
                        </Button>
                        <Button variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive/10">
                          Delete Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="wishlist">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
                  
                  {wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlist.map((pet) => (
                        <PetCard key={pet.id} pet={pet} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Heart size={48} className="text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
                      <p className="text-gray-600 mb-6">
                        Save pets you're interested in by clicking the heart icon on pet listings.
                      </p>
                      <Link to="/pets">
                        <Button className="bg-adoptables-blue hover:bg-adoptables-dark">
                          Browse Pets
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="mypets">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">My Pets for Adoption</h2>
                    <Button className="bg-adoptables-blue hover:bg-adoptables-dark flex items-center">
                      <PlusCircle size={16} className="mr-2" />
                      Add Pet for Adoption
                    </Button>
                  </div>
                  
                  <div className="text-center py-12">
                    <PlusCircle size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No pets listed yet</h3>
                    <p className="text-gray-600 mb-6">
                      You haven't listed any pets for adoption. Add your first pet to help them find a loving home.
                    </p>
                    <Button className="bg-adoptables-blue hover:bg-adoptables-dark">
                      Add a Pet for Adoption
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProfilePage;
