
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import DonationTerms from './DonationTerms';

interface NepalBankProps {
  onSuccess: () => void;
}

const NepalBanks: React.FC<NepalBankProps> = ({ onSuccess }) => {
  const [bank, setBank] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
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
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bank-select">Select Bank</Label>
              <Select value={bank} onValueChange={setBank} required>
                <SelectTrigger id="bank-select">
                  <SelectValue placeholder="Select a bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nabil">Nabil Bank</SelectItem>
                  <SelectItem value="nic">NIC Asia Bank</SelectItem>
                  <SelectItem value="global">Global IME Bank</SelectItem>
                  <SelectItem value="nmb">NMB Bank</SelectItem>
                  <SelectItem value="everest">Everest Bank</SelectItem>
                  <SelectItem value="himalayan">Himalayan Bank</SelectItem>
                  <SelectItem value="standard">Standard Chartered</SelectItem>
                  <SelectItem value="citizens">Citizens Bank</SelectItem>
                  <SelectItem value="kumari">Kumari Bank</SelectItem>
                  <SelectItem value="laxmi">Laxmi Bank</SelectItem>
                  <SelectItem value="mega">Mega Bank</SelectItem>
                  <SelectItem value="prabhu">Prabhu Bank</SelectItem>
                  <SelectItem value="prime">Prime Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="account-name">Account Holder Name</Label>
              <Input
                id="account-name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Enter account holder name"
                required
              />
            </div>

            <div>
              <Label htmlFor="account-number">Account Number</Label>
              <Input
                id="account-number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter account number"
                required
              />
            </div>

            <div>
              <Label htmlFor="amount">Donation Amount (NPR)</Label>
              <Input
                id="amount"
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
              className="w-full bg-adoptables-blue hover:bg-adoptables-dark"
              disabled={isProcessing || !termsAgreed}
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>Complete Donation</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
    </div>
  );
};

export default NepalBanks;
