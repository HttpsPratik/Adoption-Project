import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Shield, Heart, Scale } from 'lucide-react';

const TermsPage = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart size={32} className="text-adoptables-blue" />
              <h1 className="text-4xl font-bold font-heading">Terms & Conditions</h1>
            </div>
            <p className="text-xl text-gray-600">Adopt Me Platform - Legal Agreement</p>
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-600 font-semibold">
                <AlertTriangle size={20} />
                <span>CRITICAL: READ ALL TERMS BEFORE USING PLATFORM</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Card className="mb-8">
            <CardContent className="p-8 space-y-8">
              
              {/* Platform Purpose */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Heart size={24} className="text-adoptables-blue" />
                  <h2 className="text-2xl font-bold">PLATFORM PURPOSE</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Adopt Me is a 100% FREE platform exclusively designed for pet adoption and rescue services. We exist to connect loving families with pets in need of homes.
                </p>
              </section>

              {/* Prohibited Activities */}
              <section className="bg-red-50 p-6 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={24} className="text-red-600" />
                  <h2 className="text-2xl font-bold text-red-600">STRICTLY PROHIBITED - NO SELLING ALLOWED</h2>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• The sale, trade, or monetary exchange of animals is STRICTLY PROHIBITED</li>
                  <li>• Any listings containing prices, payment terms, or commercial language will be automatically removed</li>
                  <li>• Users attempting to sell pets may be reported to local authorities</li>
                  <li>• This includes any form of "rehoming fees" or "adoption donations" beyond legitimate shelter fees</li>
                </ul>
              </section>

              {/* Disclaimer */}
              <section className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-4">
                  <Shield size={24} className="text-yellow-600" />
                  <h2 className="text-2xl font-bold text-yellow-800">COMPLETE PLATFORM DISCLAIMER & LIMITATION OF LIABILITY</h2>
                </div>
                <div className="space-y-3 text-gray-700">
                  <p className="font-semibold">Adopt Me is SOLELY a listing platform that connects users - WE ARE NOT RESPONSIBLE FOR ANYTHING THAT HAPPENS on this platform</p>
                  <ul className="space-y-1 text-sm">
                    <li>• We are NOT responsible for any injuries, damages, losses, disputes, or incidents that occur between users</li>
                    <li>• We are NOT responsible for pet health issues, behavioral problems, medical expenses, or veterinary costs</li>
                    <li>• We are NOT responsible for fraud, scams, misrepresentation, or deceptive practices by users</li>
                    <li>• We are NOT responsible for meeting arrangements, transportation, or any physical interactions between users</li>
                    <li>• We are NOT responsible for the accuracy of pet information, photos, descriptions, or user profiles</li>
                    <li>• We are NOT responsible for failed adoptions, returned pets, or unsuccessful matches</li>
                    <li>• We are NOT responsible for any emotional distress, financial losses, or legal issues arising from platform use</li>
                    <li>• We are NOT responsible for data breaches, account security, or privacy violations</li>
                    <li>• We are NOT responsible for platform downtime, technical issues, or lost communications</li>
                    <li>• ALL INTERACTIONS, TRANSACTIONS, AND OUTCOMES OCCUR ENTIRELY AT USER'S OWN RISK</li>
                  </ul>
                </div>
              </section>

              {/* User Risks */}
              <section className="bg-red-100 p-6 rounded-lg border-2 border-red-300">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={24} className="text-red-700" />
                  <h2 className="text-2xl font-bold text-red-700">USER ASSUMES ALL RISKS</h2>
                </div>
                <div className="space-y-3 text-gray-800">
                  <p className="font-semibold">By using this platform, you acknowledge and accept that:</p>
                  <ul className="space-y-1">
                    <li>• You use this service entirely at your own risk and discretion</li>
                    <li>• You are solely responsible for verifying pet information, user credentials, and making safe decisions</li>
                    <li>• You waive any claims against Adopt Me for any damages, losses, or incidents</li>
                    <li>• You agree to hold Adopt Me harmless from any legal action or liability</li>
                    <li>• Any disputes must be resolved directly between users without platform involvement</li>
                  </ul>
                </div>
              </section>

              {/* User Responsibilities */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Shield size={24} className="text-adoptables-blue" />
                  <h2 className="text-2xl font-bold">USER RESPONSIBILITIES</h2>
                </div>
                <ul className="space-y-1 text-gray-700">
                  <li>• Provide truthful and accurate information in all listings</li>
                  <li>• Conduct your own due diligence on pets and other users</li>
                  <li>• Meet in safe, public locations and bring trusted companions</li>
                  <li>• Verify pet ownership and legal transfer rights</li>
                  <li>• Handle all adoption paperwork and legal requirements independently</li>
                  <li>• Treat all users with respect and professionalism</li>
                  <li>• Report suspicious or inappropriate behavior immediately</li>
                </ul>
              </section>

              {/* Content Moderation */}
              <section>
                <h2 className="text-2xl font-bold mb-4">CONTENT MODERATION</h2>
                <ul className="space-y-1 text-gray-700">
                  <li>• All pet listings are user-generated content - we do not verify accuracy</li>
                  <li>• Posts containing fake information, inappropriate content, or commercial language will be removed without notice</li>
                  <li>• We reserve the right to remove any content or ban users without explanation</li>
                  <li>• Content moderation is provided as a courtesy - we make no guarantees about platform safety</li>
                  <li>• Users are responsible for their own safety and security when using this platform</li>
                </ul>
              </section>

              {/* No Warranties */}
              <section className="bg-gray-100 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">NO WARRANTIES OR GUARANTEES</h2>
                <p className="text-gray-700 mb-3">Adopt Me provides this service "AS IS" without any warranties, guarantees, or promises of:</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Platform availability or functionality</li>
                  <li>• User safety or security</li>
                  <li>• Pet quality, health, or suitability</li>
                  <li>• Successful adoptions or positive outcomes</li>
                  <li>• Data protection or privacy safeguards</li>
                </ul>
              </section>

              {/* Contact & Reporting */}
              <section>
                <h2 className="text-2xl font-bold mb-4">CONTACT & REPORTING</h2>
                <ul className="space-y-1 text-gray-700">
                  <li>• Report suspected violations via our report system (we may or may not take action)</li>
                  <li>• Platform issues should be directed to our support (response not guaranteed)</li>
                  <li>• Emergency situations should be handled by contacting local authorities directly</li>
                  <li>• We are not liable for delayed responses or failure to address reports</li>
                </ul>
              </section>

              {/* Legal Jurisdiction */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Scale size={24} className="text-adoptables-blue" />
                  <h2 className="text-2xl font-bold">LEGAL JURISDICTION</h2>
                </div>
                <ul className="space-y-1 text-gray-700">
                  <li>• These terms are governed by [Your Local Laws]</li>
                  <li>• Any legal disputes must be resolved in [Your Local Courts]</li>
                  <li>• Users agree to binding arbitration for any claims under $10,000</li>
                  <li>• Platform owner reserves right to modify these terms at any time</li>
                </ul>
              </section>

              {/* Final Disclaimer */}
              <section className="bg-red-600 text-white p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">FINAL DISCLAIMER</h2>
                <p className="font-semibold text-lg leading-relaxed">
                  ADOPT ME AND ITS OWNERS, OPERATORS, AND AFFILIATES DISCLAIM ALL LIABILITY FOR ANY HARM, DAMAGE, LOSS, OR LEGAL ISSUES ARISING FROM PLATFORM USE. BY USING THIS PLATFORM, YOU ACKNOWLEDGE THESE RISKS AND AGREE TO USE THE SERVICE ENTIRELY AT YOUR OWN RISK.
                </p>
                <p className="mt-4 font-medium">
                  By clicking "I Agree" or using Adopt Me, you confirm you have read, understood, and agree to these terms and acknowledge this is a FREE adoption platform with NO LIABILITY ACCEPTED by platform operators.
                </p>
              </section>

            </CardContent>
          </Card>

          {/* Agreement Button */}
          <div className="text-center">
            <Button className="bg-adoptables-blue hover:bg-adoptables-dark text-white px-8 py-3 text-lg">
              I Have Read and Agree to These Terms
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Agreement constitutes acceptance of all terms and liability waivers
            </p>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
};

export default TermsPage;