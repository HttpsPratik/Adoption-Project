
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, DollarSign, CheckCircle2 } from 'lucide-react';
import EsewaKhalti from '@/components/donation/EsewaKhalti';
import NepalBanks from '@/components/donation/NepalBanks';
import PayPalDonation from '@/components/donation/PayPalDonation';

const DonationPage = () => {
  const [donationSuccess, setDonationSuccess] = useState(false);
  
  const handleDonationSuccess = () => {
    setDonationSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Reset after some time
    setTimeout(() => {
      setDonationSuccess(false);
    }, 10000);
  };
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-adoptables-gray pb-24">
        {/* Hero Section */}
        <section className="py-16 bg-adoptables-dark text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center p-2 bg-white/20 rounded-full mb-4">
              <Heart size={28} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Support Our Mission</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Your donations help us rescue, rehabilitate, and rehome animals in need across Nepal.
              Every contribution makes a difference.
            </p>
          </div>
        </section>
        
        {/* Success Message */}
        {donationSuccess && (
          <div className="container mx-auto px-4 py-6">
            <div className="bg-green-100 border border-green-200 text-green-800 rounded-lg p-4 flex items-start">
              <CheckCircle2 className="text-green-600 mr-3 mt-0.5" size={20} />
              <div>
                <h3 className="font-bold">Thank You for Your Donation!</h3>
                <p>Your generous contribution will help animals in need. We've sent a confirmation to your email.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Donation Options */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-10">Make a Donation</h2>
              
              <Tabs defaultValue="esewa-khalti" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="esewa-khalti">eSewa / Khalti</TabsTrigger>
                  <TabsTrigger value="bank-transfer">Bank Transfer</TabsTrigger>
                  <TabsTrigger value="paypal">PayPal</TabsTrigger>
                </TabsList>
                
                <TabsContent value="esewa-khalti" className="mt-6">
                  <EsewaKhalti onSuccess={handleDonationSuccess} />
                </TabsContent>
                
                <TabsContent value="bank-transfer" className="mt-6">
                  <NepalBanks onSuccess={handleDonationSuccess} />
                </TabsContent>
                
                <TabsContent value="paypal" className="mt-6">
                  <PayPalDonation onSuccess={handleDonationSuccess} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
        
        {/* Impact Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Your Donation Makes a Difference</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-adoptables-light rounded-full mb-4">
                      <DollarSign size={32} className="text-adoptables-blue" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">NPR 1,000</h3>
                    <p className="text-gray-600">
                      Provides food and basic medical care for one rescued animal for a week.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-adoptables-light rounded-full mb-4">
                      <DollarSign size={32} className="text-adoptables-blue" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">NPR 5,000</h3>
                    <p className="text-gray-600">
                      Covers vaccination, deworming, and spay/neuter surgery for one animal.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-adoptables-light rounded-full mb-4">
                      <DollarSign size={32} className="text-adoptables-blue" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">NPR 10,000+</h3>
                    <p className="text-gray-600">
                      Enables us to conduct emergency rescues and provide specialized medical treatment.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Transparency Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Our Commitment to Transparency</h2>
            <p className="text-gray-600 mb-6">
              We are committed to using donations efficiently and transparently. 85% of all donations go directly to animal care, 
              while only 15% is used for administrative costs and awareness programs.
            </p>
            <p className="text-gray-600">
              For questions about donations or to receive our annual financial report, please contact us at 
              <span className="text-adoptables-blue font-semibold"> donations@adoptables.org</span>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default DonationPage;
