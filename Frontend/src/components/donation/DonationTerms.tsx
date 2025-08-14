import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, FileText } from 'lucide-react';

interface DonationTermsProps {
  agreed: boolean;
  onAgreementChange: (agreed: boolean) => void;
}

const DonationTerms = ({ agreed, onAgreementChange }: DonationTermsProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Terms Agreement Checkbox */}
      <div className="flex items-start space-x-2 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <Checkbox
          id="terms"
          checked={agreed}
          onCheckedChange={(checked) => onAgreementChange(checked as boolean)}
          className="mt-1"
        />
        <div className="flex-1">
          <label htmlFor="terms" className="text-sm font-medium text-amber-800 cursor-pointer">
            I agree to the Donation Terms & Conditions
          </label>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="link" 
                className="p-0 h-auto text-amber-700 hover:text-amber-900 underline text-sm"
              >
                <FileText size={14} className="mr-1" />
                Read Full Terms & Conditions
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle size={24} />
                  DONATION TERMS & CONDITIONS
                </DialogTitle>
                <DialogDescription>
                  Please read these terms carefully before making any donation
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 text-sm">
                
                {/* Main Disclaimer */}
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-bold text-red-800 mb-2">🚨 CRITICAL LEGAL DISCLAIMER 🚨</h3>
                  <p className="text-red-700 font-semibold">
                    BY MAKING A DONATION, YOU ACKNOWLEDGE AND AGREE TO ALL TERMS BELOW WITH NO EXCEPTIONS
                  </p>
                </div>

                {/* No Refund Policy */}
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-bold text-yellow-800 mb-2">❌ STRICT NO REFUND POLICY</h3>
                  <ul className="text-yellow-700 space-y-1">
                    <li>• ALL DONATIONS ARE FINAL AND NON-REFUNDABLE under any circumstances</li>
                    <li>• No exceptions will be made for any reason whatsoever</li>
                    <li>• Disputes, chargebacks, or refund requests will be rejected immediately</li>
                    <li>• You waive all rights to claim refunds through banks, payment processors, or legal channels</li>
                    <li>• Technical errors, duplicate payments, or mistaken amounts are YOUR responsibility</li>
                  </ul>
                </div>

                {/* Owner Rights */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-bold text-blue-800 mb-2">💰 UNRESTRICTED DONATION USE</h3>
                  <ul className="text-blue-700 space-y-1">
                    <li>• The platform owner has COMPLETE DISCRETION over how donations are used</li>
                    <li>• Donations may be used for ANY purpose including personal expenses, business costs, or other activities</li>
                    <li>• NO GUARANTEE that donations will be used specifically for animal welfare</li>
                    <li>• No financial reporting or accountability is provided to donors</li>
                    <li>• Donations may be combined with other funds and used as the owner sees fit</li>
                    <li>• You have NO CONTROL or say in how your donation is utilized</li>
                  </ul>
                </div>

                {/* Donor Responsibility */}
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h3 className="font-bold text-purple-800 mb-2">📋 DONOR RESPONSIBILITIES & RISKS</h3>
                  <ul className="text-purple-700 space-y-1">
                    <li>• YOU ARE SOLELY RESPONSIBLE for verifying the legitimacy of this platform</li>
                    <li>• YOU ASSUME ALL RISKS associated with online donations</li>
                    <li>• Platform accepts NO LIABILITY for fraud, scams, or misuse of funds</li>
                    <li>• You are responsible for tax implications and reporting in your jurisdiction</li>
                    <li>• You must verify your legal capacity to make donations</li>
                    <li>• Payment processing fees are non-refundable even if donated by mistake</li>
                  </ul>
                </div>

                {/* No Services Guarantee */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h3 className="font-bold text-gray-800 mb-2">⚠️ NO SERVICE GUARANTEES</h3>
                  <ul className="text-gray-700 space-y-1">
                    <li>• NO GUARANTEE of animal rescue services or outcomes</li>
                    <li>• NO PROMISE that any animals will actually be helped</li>
                    <li>• Platform may cease operations at any time without notice</li>
                    <li>• No ongoing communication or updates guaranteed to donors</li>
                    <li>• Donation receipts are provided as courtesy only, not legal documents</li>
                  </ul>
                </div>

                {/* Legal Waiver */}
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-bold text-red-800 mb-2">⚖️ COMPLETE LEGAL WAIVER</h3>
                  <ul className="text-red-700 space-y-1">
                    <li>• You WAIVE ALL LEGAL RIGHTS to pursue claims against the platform or owner</li>
                    <li>• You HOLD HARMLESS the platform from any legal action or liability</li>
                    <li>• Any disputes must be resolved in [Owner"s Local Jurisdiction] under local laws</li>
                    <li>• You agree to binding arbitration for claims under $10,000</li>
                    <li>• Platform owner reserves right to modify these terms at any time</li>
                    <li>• These terms supersede any previous agreements or representations</li>
                  </ul>
                </div>

                {/* Tax Disclaimer */}
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h3 className="font-bold text-orange-800 mb-2">💸 TAX & RECEIPT DISCLAIMER</h3>
                  <ul className="text-orange-700 space-y-1">
                    <li>• NO GUARANTEE of tax deductibility for your donation</li>
                    <li>• Platform is NOT a registered charity or tax-exempt organization</li>
                    <li>• You are responsible for determining tax implications yourself</li>
                    <li>• Donation receipts are informational only, not official tax documents</li>
                    <li>• Consult your tax advisor before claiming any deductions</li>
                  </ul>
                </div>

                {/* Final Warning */}
                <div className="p-4 bg-black text-white rounded-lg">
                  <h3 className="font-bold mb-2">🛑 FINAL WARNING - READ CAREFULLY</h3>
                  <p className="font-semibold">
                    By proceeding with your donation, you confirm that you have read, understood, and VOLUNTARILY AGREE to ALL terms above. 
                    You acknowledge this is a GIFT with NO EXPECTATION of services, refunds, or specific use of funds. 
                    PROCEED ONLY if you accept these terms completely.
                  </p>
                </div>

              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Warning Message */}
      {!agreed && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          <AlertTriangle size={16} className="inline mr-2" />
          You must agree to the terms and conditions before making a donation.
        </div>
      )}
    </div>
  );
};

export default DonationTerms;