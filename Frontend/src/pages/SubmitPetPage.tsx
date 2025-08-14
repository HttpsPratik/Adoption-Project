
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PetSubmissionForm from '@/components/pets/PetSubmissionForm';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const SubmitPetPage = () => {
  const { isAuthenticated, requireAuth } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  if (!isAuthenticated && !requireAuth()) {
    return null; // The requireAuth function handles navigation to auth page
  }
  
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-adoptables-gray py-8 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold font-heading mb-2">Submit a Pet for Adoption</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Help find a loving home for your pet by submitting their details below.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8">
            <PetSubmissionForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default SubmitPetPage;
