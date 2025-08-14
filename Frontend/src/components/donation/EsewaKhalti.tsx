
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import DonationTerms from './DonationTerms';

interface EsewaKhaltiProps {
  onSuccess: () => void;
}

const EsewaKhalti: React.FC<EsewaKhaltiProps> = ({ onSuccess }) => {
  const [method, setMethod] = useState('esewa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);

  const handlePaymentClick = (e: React.FormEvent) => {
    e.preventDefault();
    setShowTermsDialog(true);
  };

  const handleTermsAgree = () => {
    setTermsAgreed(true);
    setShowTermsDialog(false);
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardContent className="pt-6">
          <Tabs value={method} onValueChange={setMethod}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="esewa" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">eSewa</TabsTrigger>
              <TabsTrigger value="khalti" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Khalti</TabsTrigger>
            </TabsList>
            
            <TabsContent value="esewa">
              <form onSubmit={handlePaymentClick} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="esewa-phone">eSewa ID / Mobile Number</Label>
                  <Input
                    id="esewa-phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="98XXXXXXXX"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="esewa-amount">Donation Amount (NPR)</Label>
                  <Input
                    id="esewa-amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount in NPR"
                    min="100"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-green-500 hover:bg-green-600"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Pay with eSewa"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="khalti">
              <form onSubmit={handlePaymentClick} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="khalti-phone">Khalti ID / Mobile Number</Label>
                  <Input
                    id="khalti-phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="98XXXXXXXX"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="khalti-amount">Donation Amount (NPR)</Label>
                  <Input
                    id="khalti-amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount in NPR"
                    min="100"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Pay with Khalti"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Terms and Conditions Dialog */}
      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Terms & Conditions</DialogTitle>
            <DialogDescription>
              Please review and accept the terms and conditions to proceed with your donation.
            </DialogDescription>
          </DialogHeader>
          <DonationTerms agreed={termsAgreed} onAgreementChange={setTermsAgreed} />
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowTermsDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleTermsAgree}
              disabled={!termsAgreed}
              className="bg-green-500 hover:bg-green-600"
            >
              Agree & Proceed to Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EsewaKhalti;
