import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Heart, MapPin, Calendar, Info, AlertTriangle, Mail, Phone, MessageCircle } from 'lucide-react';
import { Pet } from '@/context/AuthContext';


interface PetDetailsModalProps {
  pet: Pet | null;
  open: boolean;
  onClose: () => void;
}

const PetDetailsModal = ({ pet, open, onClose }: PetDetailsModalProps) => {
  if (!pet) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{pet.name}</DialogTitle>
          <DialogDescription>
            {pet.breed} • {pet.age} • {pet.gender}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pet Image */}
          <div className="relative">
            <img
              src={pet.imageUrl}
              alt={`${pet.name} - ${pet.breed}`}
              className="w-full h-64 object-cover rounded-lg"
            />
            <Badge className="absolute top-3 left-3 bg-white text-black font-medium">
              {pet.type}
            </Badge>
          </div>

          {/* Safety Warning Banner */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle size={20} />
              <span className="font-semibold">ADOPTION SAFETY WARNING</span>
            </div>
            <p className="text-sm text-red-600 mt-1">
              All adoptions occur entirely at your own risk. Platform accepts NO responsibility for meetings, pet health, or outcomes.
            </p>
          </div>

          {/* Pet Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Info size={16} className="text-gray-500" />
                <span className="font-medium">Breed:</span>
                <span>{pet.breed}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-500" />
                <span className="font-medium">Age:</span>
                <span>{pet.age}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart size={16} className="text-gray-500" />
                <span className="font-medium">Gender:</span>
                <span>{pet.gender}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-500" />
                <span className="font-medium">Location:</span>
                <span>{pet.location}</span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-3">
              <div>
                <span className="font-medium text-sm text-gray-700">Personality:</span>
                <p className="text-sm text-gray-600 mt-1">
                  Friendly, energetic, and loves to play. Great with children and other pets.
                </p>
              </div>
              <div>
                <span className="font-medium text-sm text-gray-700">Special Needs:</span>
                <p className="text-sm text-gray-600 mt-1">
                  Up to date on vaccinations. Spayed/neutered.
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">About {pet.name}</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {pet.name} is a wonderful {pet.breed.toLowerCase()} looking for a loving forever home. 
              They are {pet.age} old and have a gentle, friendly personality. This sweet pet would 
              make a great addition to any family and is ready to bring joy and companionship to 
              their new home.
            </p>
          </div>

          {/* Liability Disclaimer */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">IMPORTANT LEGAL DISCLAIMER</h4>
            <ul className="text-xs text-yellow-700 space-y-1">
              <li>• You are solely responsible for verifying all pet information</li>
              <li>• Platform is not responsible for pet health, behavior, or medical costs</li>
              <li>• All adoption arrangements are between users only</li>
              <li>• Meet in public places and bring trusted companions</li>
              <li>• Platform accepts no liability for any adoption outcomes</li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-3">
            <h3 className="font-semibold">Contact Owner</h3>
            <p className="text-sm text-gray-600">
              Interested in adopting {pet.name}? Contact the owner to learn more and arrange a meeting.
            </p>
            
            <div className="space-y-3">
              {pet.ownerName && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Owner: </span>
                  <span className="text-sm">{pet.ownerName}</span>
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                {pet.ownerEmail && (
                  <a 
                    href={`mailto:${pet.ownerEmail}`}
                    className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Mail size={16} className="text-blue-600" />
                    <span className="text-sm text-blue-700">{pet.ownerEmail}</span>
                  </a>
                )}
                
                {pet.ownerPhone && (
                  <a 
                    href={`tel:${pet.ownerPhone}`}
                    className="flex items-center gap-2 p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Phone size={16} className="text-green-600" />
                    <span className="text-sm text-green-700">{pet.ownerPhone}</span>
                  </a>
                )}
                
                {pet.ownerWhatsapp && (
                  <a 
                    href={`https://wa.me/${pet.ownerWhatsapp.replace(/[^\d+]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <MessageCircle size={16} className="text-green-600" />
                    <span className="text-sm text-green-700">WhatsApp: {pet.ownerWhatsapp}</span>
                  </a>
                )}
              </div>
            </div>
            
            {/* Additional Safety Reminders */}
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
              <h4 className="font-medium text-blue-800 text-sm mb-1">Safety Checklist Before Meeting:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>✓ Verify owner identity and pet ownership documents</li>
                <li>✓ Meet in a public place during daylight hours</li>
                <li>✓ Bring a trusted friend or family member</li>
                <li>✓ Trust your instincts - if something feels wrong, leave</li>
                <li>✓ Be prepared with adoption paperwork and identification</li>
              </ul>
            </div>
          </div>

          {/* Terms Reference */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              By contacting this owner, you agree to our{' '}
              <a href="/terms" className="text-adoptables-blue hover:underline">
                Terms & Conditions
              </a>{' '}
              and complete liability waiver.
            </p>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PetDetailsModal;