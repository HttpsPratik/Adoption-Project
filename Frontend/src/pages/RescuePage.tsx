
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, PawPrint, Phone, MapPin, Globe, Mail, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

const RescuePage = () => {
  const [region, setRegion] = useState<string>("kathmandu");

  const vetHospitals = {
    kathmandu: [
      {
        name: "Animal Medical Center",
        address: "Chabahil, Kathmandu",
        phone: "+977-1-4481118",
        hours: "Open 24 hours",
        website: "www.animalmedicalcenter.com.np"
      },
      {
        name: "Central Veterinary Hospital",
        address: "Tripureshwor, Kathmandu",
        phone: "+977-1-4261940",
        hours: "8:00 AM - 6:00 PM",
        website: "www.cvh.gov.np"
      },
      {
        name: "Nepal Veterinary Clinic",
        address: "Kupondole, Lalitpur",
        phone: "+977-1-5550675",
        hours: "9:00 AM - 7:00 PM",
        website: "www.nepalvetclinic.org"
      }
    ],
    pokhara: [
      {
        name: "Pokhara Veterinary Hospital",
        address: "Lakeside, Pokhara",
        phone: "+977-61-463092",
        hours: "8:00 AM - 7:00 PM",
        website: "www.pokharavethospital.com"
      },
      {
        name: "Regional Veterinary Laboratory",
        address: "Ramghat, Pokhara",
        phone: "+977-61-520068",
        hours: "10:00 AM - 5:00 PM",
        website: "www.rvlpokhara.gov.np"
      }
    ],
    chitwan: [
      {
        name: "Chitwan Veterinary Hospital",
        address: "Bharatpur, Chitwan",
        phone: "+977-56-520318",
        hours: "8:00 AM - 6:00 PM",
        website: "www.chitwanvethospital.org"
      },
      {
        name: "Faculty of Animal Science, AFU",
        address: "Rampur, Chitwan",
        phone: "+977-56-591655",
        hours: "9:00 AM - 4:00 PM",
        website: "www.afu.edu.np"
      }
    ],
    biratnagar: [
      {
        name: "Biratnagar Animal Hospital",
        address: "Main Road, Biratnagar",
        phone: "+977-21-435672",
        hours: "8:00 AM - 7:00 PM",
        website: "www.biratnagaranimalhospital.org"
      },
      {
        name: "Eastern Regional Veterinary Center",
        address: "Tintoliya, Biratnagar",
        phone: "+977-21-438901",
        hours: "9:00 AM - 5:00 PM",
        website: "www.ervc.gov.np"
      }
    ],
    butwal: [
      {
        name: "Butwal Veterinary Center",
        address: "Devinagar, Butwal",
        phone: "+977-71-546281",
        hours: "8:00 AM - 6:00 PM",
        website: "www.butwalvetcenter.org"
      }
    ],
    dharan: [
      {
        name: "Dharan Animal Care",
        address: "Putali Line, Dharan",
        phone: "+977-25-520146",
        hours: "8:30 AM - 6:30 PM",
        website: "www.dharananimalcare.org"
      }
    ],
    nepalgunj: [
      {
        name: "Nepalgunj Veterinary Hospital",
        address: "Dhamboji, Nepalgunj",
        phone: "+977-81-520715",
        hours: "9:00 AM - 5:00 PM",
        website: "www.nepalgunjvethospital.org"
      }
    ]
  };

  const rescueShelters = {
    kathmandu: [
      {
        name: "Kathmandu Animal Treatment Centre (KAT)",
        address: "Budhanilkantha, Kathmandu",
        phone: "+977-1-4373169",
        email: "info@katcentre.org.np",
        website: "www.katcentre.org.np"
      },
      {
        name: "Sneha's Care Animal Shelter",
        address: "Lalitpur, Nepal",
        phone: "+977-9851166998",
        email: "info@snehacare.org",
        website: "www.snehacare.org"
      },
      {
        name: "Animal Nepal",
        address: "Chobhar, Kathmandu",
        phone: "+977-1-5538068",
        email: "animalnepal@gmail.com",
        website: "www.animalnepal.org"
      }
    ],
    pokhara: [
      {
        name: "Himalayan Animal Rescue Trust (HART)",
        address: "Pokhara, Nepal",
        phone: "+977-61-523395",
        email: "hart.pokhara@gmail.com",
        website: "www.hartnepal.org"
      }
    ],
    chitwan: [
      {
        name: "Chitwan Animal Shelter",
        address: "Bharatpur, Chitwan",
        phone: "+977-9845088843",
        email: "chitawnanimalrescue@gmail.com",
        website: "www.chitwananimalshelter.org"
      }
    ],
    biratnagar: [
      {
        name: "Biratnagar Animal Welfare",
        address: "Tintoliya, Biratnagar",
        phone: "+977-9852039561",
        email: "biratnagar.animalwelfare@gmail.com",
        website: "www.biratnagaranimalwelfare.org"
      }
    ],
    butwal: [
      {
        name: "Butwal Pet Rescue",
        address: "Golpark, Butwal",
        phone: "+977-9857028472",
        email: "butwalpetrescue@gmail.com",
        website: "www.butwalpetrescue.org"
      }
    ],
    dharan: [
      {
        name: "Dharan Animal Rescue Project",
        address: "Vijaypur, Dharan",
        phone: "+977-9842056723",
        email: "dharananimalrescue@gmail.com",
        website: "www.darp.org.np"
      }
    ],
    nepalgunj: [
      {
        name: "Western Nepal Animal Welfare",
        address: "Surkhet Road, Nepalgunj",
        phone: "+977-9858023456",
        email: "wnaw@gmail.com",
        website: "www.westernnepalanimal.org"
      }
    ]
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-adoptables-gray">
        {/* Hero Section */}
        <section className="py-16 bg-adoptables-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Animal Rescue Resources in Nepal</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Find information about veterinary hospitals and animal rescue shelters across Nepal to help animals in need.
            </p>
          </div>
        </section>
        
        {/* Region Selection */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto mb-10">
              <label htmlFor="region-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select Region
              </label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger id="region-select" className="w-full">
                  <SelectValue placeholder="Select a region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kathmandu">Kathmandu Valley</SelectItem>
                  <SelectItem value="pokhara">Pokhara</SelectItem>
                  <SelectItem value="chitwan">Chitwan</SelectItem>
                  <SelectItem value="biratnagar">Biratnagar</SelectItem>
                  <SelectItem value="butwal">Butwal</SelectItem>
                  <SelectItem value="dharan">Dharan</SelectItem>
                  <SelectItem value="nepalgunj">Nepalgunj</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Veterinary Hospitals */}
            <div className="mb-16">
              <div className="flex items-center mb-6">
                <Building2 className="text-adoptables-blue mr-3" size={28} />
                <h2 className="text-3xl font-bold">Veterinary Hospitals</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vetHospitals[region as keyof typeof vetHospitals]?.map((hospital, idx) => (
                  <Card key={idx} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <PawPrint className="text-adoptables-accent mr-2" size={20} />
                        <h3 className="text-xl font-bold">{hospital.name}</h3>
                      </div>
                      <div className="space-y-3 text-gray-600">
                        <div className="flex items-start">
                          <MapPin className="mr-2 mt-1 flex-shrink-0" size={16} />
                          <p>{hospital.address}</p>
                        </div>
                        <div className="flex items-start">
                          <Phone className="mr-2 mt-1 flex-shrink-0" size={16} />
                          <p>{hospital.phone}</p>
                        </div>
                        <div className="flex items-start">
                          <Clock className="mr-2 mt-1 flex-shrink-0" size={16} />
                          <p>{hospital.hours}</p>
                        </div>
                        <div className="flex items-start">
                          <Globe className="mr-2 mt-1 flex-shrink-0" size={16} />
                          <p className="text-adoptables-blue hover:underline">
                            <a href={`https://${hospital.website}`} target="_blank" rel="noopener noreferrer">
                              {hospital.website}
                            </a>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {vetHospitals[region as keyof typeof vetHospitals]?.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No veterinary hospitals found in this region. Please select another region.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Animal Rescue Shelters */}
            <div>
              <div className="flex items-center mb-6">
                <Building2 className="text-adoptables-accent mr-3" size={28} />
                <h2 className="text-3xl font-bold">Animal Rescue Shelters</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rescueShelters[region as keyof typeof rescueShelters]?.map((shelter, idx) => (
                  <Card key={idx} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <PawPrint className="text-adoptables-blue mr-2" size={20} />
                        <h3 className="text-xl font-bold">{shelter.name}</h3>
                      </div>
                      <div className="space-y-3 text-gray-600">
                        <div className="flex items-start">
                          <MapPin className="mr-2 mt-1 flex-shrink-0" size={16} />
                          <p>{shelter.address}</p>
                        </div>
                        <div className="flex items-start">
                          <Phone className="mr-2 mt-1 flex-shrink-0" size={16} />
                          <p>{shelter.phone}</p>
                        </div>
                        <div className="flex items-start">
                          <Mail className="mr-2 mt-1 flex-shrink-0" size={16} />
                          <p>{shelter.email}</p>
                        </div>
                        <div className="flex items-start">
                          <Globe className="mr-2 mt-1 flex-shrink-0" size={16} />
                          <p className="text-adoptables-blue hover:underline">
                            <a href={`https://${shelter.website}`} target="_blank" rel="noopener noreferrer">
                              {shelter.website}
                            </a>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {rescueShelters[region as keyof typeof rescueShelters]?.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-500">No animal rescue shelters found in this region. Please select another region.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Emergency Contact Information */}
            <div className="mt-16 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-adoptables-dark">Emergency Animal Rescue Helpline</h3>
              <p className="text-lg mb-3">For animal emergencies anywhere in Nepal, call:</p>
              <p className="text-2xl font-bold text-adoptables-accent mb-3">+977-9851-066998</p>
              <p className="text-gray-600">Available 24/7 for animal rescue emergencies</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default RescuePage;
