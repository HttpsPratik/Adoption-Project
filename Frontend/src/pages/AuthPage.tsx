
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthForm from '@/components/auth/AuthForm';
import { PawPrint, Shield, User, Heart } from 'lucide-react';

const AuthPage = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-adoptables-gray py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl font-bold font-heading mb-6">Welcome to Adoptables</h1>
                <p className="text-gray-600 mb-8">
                  Sign in or create an account to save your favorite pets, track adoption applications, and more.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="mt-1 mr-4">
                      <Heart size={24} className="text-adoptables-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">Save Your Favorites</h3>
                      <p className="text-gray-600">
                        Create a wishlist of pets you're interested in and receive updates about them.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mt-1 mr-4">
                      <PawPrint size={24} className="text-adoptables-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">Track Applications</h3>
                      <p className="text-gray-600">
                        Keep track of your adoption applications and their status in one place.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mt-1 mr-4">
                      <User size={24} className="text-adoptables-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">Personalized Experience</h3>
                      <p className="text-gray-600">
                        Receive pet recommendations based on your preferences and previous interests.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mt-1 mr-4">
                      <Shield size={24} className="text-adoptables-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1">Secure & Private</h3>
                      <p className="text-gray-600">
                        Your information is kept secure and will never be shared with third parties.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <AuthForm />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AuthPage;
