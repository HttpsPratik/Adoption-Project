
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Search, Upload, MapPin, Calendar, AlertCircle, Phone, Mail, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PetCard, { Pet } from '@/components/pets/PetCard';

const MissingPage = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [showReportForm, setShowReportForm] = useState(false);
  const [missingPets, setMissingPets] = useState<Pet[]>([
    {
      id: '5',
      name: 'Buddy',
      type: 'Dog',
      breed: 'Labrador',
      age: '3 years',
      gender: 'Male',
      location: 'Greenfield Park, Seattle, WA',
      imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      ownerEmail: 'owner@example.com',
      ownerPhone: '+1234567890',
      ownerWhatsapp: '+1234567890',
    },
    {
      id: '6',
      name: 'Simba',
      type: 'Cat',
      breed: 'Persian',
      age: '2 years',
      gender: 'Male',
      location: 'Downtown, Portland, OR',
      imageUrl: 'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80',
      ownerEmail: 'owner2@example.com',
      ownerPhone: '+0987654321',
    },
    {
      id: '7',
      name: 'Daisy',
      type: 'Dog',
      breed: 'Shih Tzu',
      age: '1 year',
      gender: 'Female',
      location: 'Riverside Park, New York, NY',
      imageUrl: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80',
      ownerEmail: 'owner3@example.com',
      ownerPhone: '+1122334455',
      ownerWhatsapp: '+1122334455',
    },
    {
      id: '8',
      name: 'Milo',
      type: 'Cat',
      breed: 'Bengal',
      age: '4 years',
      gender: 'Male',
      location: 'Central Park, Chicago, IL',
      imageUrl: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      ownerEmail: 'owner4@example.com',
      ownerPhone: '+5566778899',
    },
  ]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Your report has been submitted successfully!');
  };
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-adoptables-gray py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center justify-center p-2 bg-adoptables-accent/20 rounded-full mb-4">
              <AlertTriangle size={24} className="text-adoptables-accent" />
            </div>
            <h1 className="text-4xl font-bold font-heading mb-4">Missing Pets</h1>
            <p className="text-gray-600">
              We understand the stress of losing a pet. Our community-driven system helps reunite lost pets with their families through timely reporting and searching.
            </p>
          </div>
          
          {/* New Banner for Missing Pet Submission */}
          <div className="max-w-4xl mx-auto mb-10 bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <AlertTriangle size={28} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Have You Lost Your Pet?</h3>
                  <p className="text-gray-600">
                    Report your missing pet to our community and increase your chances of finding them.
                  </p>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-amber-500 hover:bg-amber-600 text-white" 
                  >
                    Report Missing Pet
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Report Your Missing Pet</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="pet-name">Pet's Name</Label>
                        <Input
                          id="pet-name"
                          placeholder="Enter your pet's name"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="pet-type">Pet Type</Label>
                        <Select>
                          <SelectTrigger id="pet-type">
                            <SelectValue placeholder="Select pet type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dog">Dog</SelectItem>
                            <SelectItem value="cat">Cat</SelectItem>
                            <SelectItem value="bird">Bird</SelectItem>
                            <SelectItem value="small-animal">Small Animal</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="pet-breed">Breed</Label>
                        <Input
                          id="pet-breed"
                          placeholder="Enter breed (if known)"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="pet-color">Color/Markings</Label>
                        <Input
                          id="pet-color"
                          placeholder="Color and distinctive markings"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="last-seen-date">Last Seen Date</Label>
                        <Input
                          id="last-seen-date"
                          type="date"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="last-seen-location">Last Seen Location</Label>
                        <Input
                          id="last-seen-location"
                          placeholder="Address, neighborhood, or landmark"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="pet-description">Description</Label>
                        <Textarea
                          id="pet-description"
                          placeholder="Describe your pet, including size, age, any medical conditions, and behavior"
                          rows={4}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="pet-photo">Upload Photo</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <div className="flex flex-col items-center">
                            <Upload className="h-10 w-10 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">
                              Drag and drop an image, or <span className="text-adoptables-blue">browse</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              (Max file size: 5MB, Formats: JPG, PNG)
                            </p>
                          </div>
                          <input id="pet-photo" type="file" className="hidden" accept="image/*" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contact-name">Your Name</Label>
                        <Input
                          id="contact-name"
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">Email Address</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contact-phone">Phone Number</Label>
                        <Input
                          id="contact-phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contact-whatsapp">WhatsApp (optional)</Label>
                        <Input
                          id="contact-whatsapp"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-center pt-4">
                      <Button 
                        type="submit" 
                        className="px-8 py-6 bg-adoptables-blue hover:bg-adoptables-dark text-lg"
                      >
                        Submit Report
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <div className="max-w-6xl mx-auto"> {/* Increased max width to accommodate more cards per row */}
            <h2 className="text-2xl font-bold mb-6">Search Missing Pets</h2>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search by location, breed, color..."
                  className="pl-10"
                />
              </div>
              <Button className="bg-adoptables-blue hover:bg-adoptables-dark">
                <Search size={18} className="mr-2" /> Search
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"> {/* Changed from md:grid-cols-2 to lg:grid-cols-4 */}
              {missingPets.map((pet) => (
                <Card key={pet.id} className="overflow-hidden">
                  <div className="flex flex-col">
                    <div className="h-48"> {/* Fixed height for image */}
                      <img
                        src={pet.imageUrl}
                        alt={`Missing ${pet.type.toLowerCase()} - ${pet.name}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        <AlertCircle size={16} className="text-red-500 mr-2" />
                        <span className="text-red-500 font-medium text-sm">Missing Pet</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{pet.name}</h3>
                      
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center text-sm">
                          <span className="font-medium mr-2">Type:</span> {pet.type}
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="font-medium mr-2">Breed:</span> {pet.breed}
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="font-medium mr-2">Age:</span> {pet.age}
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-500 mb-4 text-xs">
                        <MapPin size={14} className="mr-1 flex-shrink-0" />
                        <span className="truncate">Last seen: {pet.location}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-3 mb-3">
                        <span className="text-xs font-medium">Contact:</span>
                        {pet.ownerEmail && (
                          <a href={`mailto:${pet.ownerEmail}`} 
                            className="text-blue-600 hover:text-blue-800"
                            title="Email owner">
                            <Mail size={16} />
                          </a>
                        )}
                        {pet.ownerPhone && (
                          <a href={`tel:${pet.ownerPhone}`} 
                            className="text-green-600 hover:text-green-800"
                            title="Call owner">
                            <Phone size={16} />
                          </a>
                        )}
                        {pet.ownerWhatsapp && (
                          <a href={`https://wa.me/${pet.ownerWhatsapp.replace(/[^\d+]/g, '')}`} target="_blank" rel="noopener noreferrer"
                            className="text-green-500 hover:text-green-700"
                            title="WhatsApp">
                            <MessageCircle size={16} />
                          </a>
                        )}
                      </div>
                      
                      <Button className="w-full mt-2 bg-adoptables-accent hover:brightness-90 text-sm py-1 h-9">
                        I've Seen This Pet
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button variant="outline" className="border-adoptables-blue text-adoptables-blue hover:bg-adoptables-light">
                Load More
              </Button>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto mt-12 p-6 bg-adoptables-light rounded-xl">
            <h3 className="text-xl font-bold mb-4">Tips for Finding a Missing Pet</h3>
            <ul className="space-y-2 list-disc pl-6">
              <li>Search your home thoroughly first, including any small hiding spots.</li>
              <li>Check with neighbors and ask them to check garages, sheds, and under porches.</li>
              <li>Create flyers with clear photos and distribute them around your neighborhood.</li>
              <li>Visit local animal shelters and check their websites regularly.</li>
              <li>Post on social media and local community groups.</li>
              <li>Leave out food, water, and something that smells like home (your clothing, pet's bed).</li>
              <li>Search during quieter times of day (early morning, late evening) when there's less activity.</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MissingPage;
