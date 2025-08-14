
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-adoptables-dark text-white pt-12 pb-20 md:pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                <Heart size={24} className="text-adoptables-blue" />
              </div>
              <span className="text-2xl font-heading font-bold">Adoptables</span>
            </div>
            <p className="text-gray-300 mt-2">
              Finding forever homes for pets in need. Your next best friend is waiting.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="https://facebook.com" className="text-white hover:text-adoptables-accent" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" className="text-white hover:text-adoptables-accent" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" className="text-white hover:text-adoptables-accent" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://youtube.com" className="text-white hover:text-adoptables-accent" aria-label="YouTube">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div className="md:ml-8">
            <h3 className="text-lg font-bold mb-4 font-heading">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/pets" className="text-gray-300 hover:text-white">Adopt a Pet</Link></li>
              <li><Link to="/missing" className="text-gray-300 hover:text-white">Missing Pets</Link></li>
              <li><Link to="/donate" className="text-gray-300 hover:text-white">Donate</Link></li>
              <li><Link to="/rescue" className="text-gray-300 hover:text-white">Rescue Operations</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 font-heading">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Pet Care Guides</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Adoption Process</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Success Stories</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Volunteer</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">FAQs</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 font-heading">Contact Us</h3>
            <address className="not-italic text-gray-300 space-y-2">
              <p>123 Rescue Lane</p>
              <p>Animal City, AC 12345</p>
              <p className="mt-2">Phone: (555) 123-4567</p>
              <p>Email: info@adoptables.org</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Adoptables. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
            <Link to="/terms" className="text-gray-400 hover:text-white">Terms & Conditions</Link>
            <a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a>
          </div>
          <div className="mt-2 text-center text-xs text-gray-500">
            Not responsible for user interactions or outcomes
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
