
import { Heart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Pet } from "@/context/AuthContext";

const PetCard = ({ pet, onAdopt }: { pet: Pet; onAdopt?: (pet: Pet) => void }) => {
  const { addToWishlist, isInWishlist } = useAuth();
  const inWishlist = isInWishlist(pet.id);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="relative">
        <img 
          src={pet.imageUrl} 
          alt={`${pet.name} - ${pet.breed}`} 
          className="w-full h-48 object-cover"
        />
        <Badge className="absolute top-3 left-3 bg-white text-black font-medium">
          {pet.type}
        </Badge>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`absolute top-3 right-3 rounded-full bg-white ${inWishlist ? 'text-red-500' : 'text-gray-400'}`}
          onClick={() => addToWishlist(pet)}
        >
          <Heart fill={inWishlist ? "currentColor" : "none"} />
        </Button>
      </div>
      <CardContent className="p-4 flex-1">
        <h3 className="text-xl font-bold mb-2">{pet.name}</h3>
        
        <div className="space-y-1 mb-3">
          <div className="flex items-center text-sm">
            <span className="font-medium mr-2">Breed:</span> {pet.breed}
          </div>
          <div className="flex items-center text-sm">
            <span className="font-medium mr-2">Age:</span> {pet.age}
          </div>
          <div className="flex items-center text-sm">
            <span className="font-medium mr-2">Gender:</span> {pet.gender}
          </div>
        </div>
        
        <div className="flex items-center text-gray-500 mb-3 text-xs">
          <MapPin size={14} className="mr-1 flex-shrink-0" />
          <span className="truncate">{pet.location}</span>
        </div>

        {pet.personality && (
          <div className="mb-3">
            <span className="font-medium text-sm">Personality:</span>
            <p className="text-sm text-gray-600 mt-1">{pet.personality}</p>
          </div>
        )}

        {pet.description && (
          <div className="mb-3">
            <span className="font-medium text-sm">Description:</span>
            <p className="text-sm text-gray-600 mt-1">{pet.description}</p>
          </div>
        )}

        {pet.ownerName && (
          <div className="mb-3 p-2 bg-gray-50 rounded-md">
            <span className="font-medium text-sm">Contact Owner:</span>
            <div className="mt-1 space-y-1">
              <p className="text-sm">{pet.ownerName}</p>
              {pet.ownerEmail && (
                <p className="text-xs text-blue-600">{pet.ownerEmail}</p>
              )}
              {pet.ownerPhone && (
                <p className="text-xs text-green-600">{pet.ownerPhone}</p>
              )}
              {pet.ownerWhatsapp && (
                <p className="text-xs text-green-600">WhatsApp: {pet.ownerWhatsapp}</p>
              )}
            </div>
          </div>
        )}
        
        {/* Adoption Risk Disclaimer */}
        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
          ⚠️ Adopt at your own risk - Platform not responsible for outcomes
        </div>
      </CardContent>
      {onAdopt && (
        <CardFooter className="p-4 pt-0">
          <Button 
            className="bg-adoptables-blue hover:bg-adoptables-dark transition-all duration-300 flex items-center gap-2 shadow hover:shadow-lg w-full"
            onClick={() => onAdopt(pet)}
          >
            <Heart size={16} />
            Adopt Me
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export { type Pet };
export default PetCard;
