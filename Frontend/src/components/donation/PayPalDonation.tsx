
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DonationTerms from './DonationTerms';

interface PayPalDonationProps {
  onSuccess: () => void;
}

const PayPalDonation: React.FC<PayPalDonationProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAgreed) {
      alert('You must agree to the terms and conditions before donating.');
      return;
    }
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <DonationTerms agreed={termsAgreed} onAgreementChange={setTermsAgreed} />
      
      <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="paypal-email">PayPal Email</Label>
            <Input
              id="paypal-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="paypal-amount">Donation Amount (USD)</Label>
            <Input
              id="paypal-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount in USD"
              min="1"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isProcessing || !termsAgreed}
          >
            {isProcessing ? "Processing..." : "Donate with PayPal"}
          </Button>
        </form>
      </CardContent>
    </Card>
    </div>
  );
};

export default PayPalDonation;
