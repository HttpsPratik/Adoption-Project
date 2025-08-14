// src/pages/ContactPage.tsx - Updated to connect with Django
import React, { useState, useEffect } from 'react';
import { ContactMessage, ContactInfo } from '../types/api';
import ApiService from '../services/apiService';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, AlertCircle } from 'lucide-react';

type SubjectType = 'general' | 'adoption' | 'missing' | 'shelter' | 'donation' | 'volunteer' | 'other';

interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  subject: SubjectType;
  message: string;
}

const ContactPage: React.FC = () => {
  // Contact form state
  const [formData, setFormData] = useState<ContactFormState>({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  });
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  // Contact info state
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [contactLoading, setContactLoading] = useState<boolean>(true);
  const [contactError, setContactError] = useState<string | null>(null);

  const subjectOptions: { value: SubjectType; label: string }[] = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'adoption', label: 'Pet Adoption' },
    { value: 'missing', label: 'Missing Pet Report' },
    { value: 'shelter', label: 'Shelter Partnership' },
    { value: 'donation', label: 'Donation Question' },
    { value: 'volunteer', label: 'Volunteer Opportunity' },
    { value: 'other', label: 'Other' }
  ];

  // Fetch contact info on component mount
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setContactLoading(true);
        setContactError(null);
        const data = await ApiService.getContactInfo();
        setContactInfo(data);
      } catch (err) {
        setContactError(err instanceof Error ? err.message : 'Failed to fetch contact info');
      } finally {
        setContactLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form
  const validateForm = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.message.trim()) errors.message = 'Message is required';
    if (formData.message.length < 10) errors.message = 'Message must be at least 10 characters';
    
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormError(Object.values(validationErrors)[0]);
      return;
    }

    setFormLoading(true);
    setFormError('');

    try {
      const messageData: Omit<ContactMessage, 'id' | 'status' | 'created_at' | 'updated_at'> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        subject: formData.subject,
        message: formData.message.trim()
      };

      await ApiService.sendContactMessage(messageData);
      setFormSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'general',
        message: ''
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600">
            Have a question or want to help? We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Send Us a Message</h2>
            
            {formSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="text-green-600 text-4xl mb-4">✓</div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Message Sent Successfully!</h3>
                <p className="text-green-600 mb-4">Thank you for contacting us. We'll get back to you soon!</p>
                <button
                  onClick={() => setFormSuccess(false)}
                  className="text-green-600 hover:text-green-800 underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+977-XXXXXXXXXX"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {subjectOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your message here..."
                  />
                </div>
                
                {formError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                    {formError}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {formLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Contact Information</h2>
            
            {contactLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ) : contactError ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                  <p className="text-yellow-800">
                    Unable to load contact information. Please check your connection.
                  </p>
                </div>
                <div className="mt-4 text-gray-600">
                  <p className="font-medium">For immediate assistance:</p>
                  <p>Phone: +977-1-4234567</p>
                  <p>Email: info@adoptapet.np</p>
                </div>
              </div>
            ) : contactInfo ? (
              <div className="space-y-6">
                {/* Organization Info */}
                <div>
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">
                    {contactInfo.organization_name}
                  </h3>
                  {contactInfo.tagline && (
                    <p className="text-gray-600 italic">{contactInfo.tagline}</p>
                  )}
                </div>

                {/* Phone Numbers */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Primary: 
                        <a 
                          href={`tel:${contactInfo.phone_primary}`} 
                          className="ml-2 text-blue-600 hover:underline"
                        >
                          {contactInfo.phone_primary}
                        </a>
                      </p>
                      {contactInfo.phone_secondary && (
                        <p className="text-sm text-gray-600">Secondary: 
                          <a 
                            href={`tel:${contactInfo.phone_secondary}`} 
                            className="ml-2 text-blue-600 hover:underline"
                          >
                            {contactInfo.phone_secondary}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email Addresses */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium break-all">
                        <a 
                          href={`mailto:${contactInfo.email_primary}`} 
                          className="text-blue-600 hover:underline"
                        >
                          {contactInfo.email_primary}
                        </a>
                      </p>
                      {contactInfo.email_secondary && (
                        <p className="text-sm text-gray-600 break-all">
                          <a 
                            href={`mailto:${contactInfo.email_secondary}`} 
                            className="text-blue-600 hover:underline"
                          >
                            {contactInfo.email_secondary}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Address:</p>
                    <div className="text-gray-600">
                      <p>{contactInfo.address_line_1}</p>
                      {contactInfo.address_line_2 && <p>{contactInfo.address_line_2}</p>}
                      <p>
                        {contactInfo.city}, {contactInfo.district}
                      </p>
                      <p>
                        {contactInfo.province}
                        {contactInfo.postal_code && ` ${contactInfo.postal_code}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Office Hours */}
                {contactInfo.office_hours && (
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Office Hours:</p>
                      <p className="text-gray-600 whitespace-pre-line">{contactInfo.office_hours}</p>
                    </div>
                  </div>
                )}

                {/* Emergency Contact */}
                {contactInfo.emergency_phone && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                      <p className="font-medium text-red-800 mb-2">24/7 Emergency (Lost Pets):</p>
                    </div>
                    <a 
                      href={`tel:${contactInfo.emergency_phone}`}
                      className="text-red-600 hover:underline font-semibold text-lg block ml-7"
                    >
                      {contactInfo.emergency_phone}
                    </a>
                  </div>
                )}

                {/* Social Media */}
                <div>
                  <p className="font-medium mb-3">Follow Us:</p>
                  <div className="flex space-x-4">
                    {contactInfo.facebook_url && (
                      <a 
                        href={contactInfo.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        aria-label="Facebook"
                      >
                        <Facebook className="w-6 h-6" />
                      </a>
                    )}
                    {contactInfo.instagram_url && (
                      <a 
                        href={contactInfo.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:text-pink-800 transition-colors"
                        aria-label="Instagram"
                      >
                        <Instagram className="w-6 h-6" />
                      </a>
                    )}
                    {contactInfo.twitter_url && (
                      <a 
                        href={contactInfo.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-600 transition-colors"
                        aria-label="Twitter"
                      >
                        <Twitter className="w-6 h-6" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-600">
                <p>Contact information will be loaded from the backend.</p>
                <div className="mt-4">
                  <p className="font-medium">For immediate assistance:</p>
                  <p>Phone: +977-1-4234567</p>
                  <p>Email: info@adoptapet.np</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;