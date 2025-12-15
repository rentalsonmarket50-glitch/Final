'use client';

import { useState } from 'react';
import { IContactForm } from '../typings';
import { toast } from 'sonner';
import { propertyQueriesKvApi } from '../utils/kvClient';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ContactFormProps {
  propertyId?: string;
  propertyTitle?: string;
  propertyDescription?: string;
  onClose: () => void;
  onSubmitSuccess?: () => void;
  inline?: boolean; // If true, renders inline without modal overlay
}

export const ContactForm = ({ 
  propertyId, 
  propertyTitle, 
  propertyDescription,
  onClose,
  onSubmitSuccess,
  inline = false
}: ContactFormProps) => {
  const [formData, setFormData] = useState<IContactForm>({
    firstName: '',
    lastName: '',
    phone: '',
    requirementType: '',
    propertyType: '',
    purpose: '',
    location: '',
    budget: '',
    propertyId,
    propertyTitle,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit to CRM (Vtiger WebForm) - Don't wait for response due to no-cors
      try {
        const crmFormData = new FormData();
        crmFormData.append('__vtrftk', 'sid:1bb652ce2c5cd4c2106304a2911d36d18c4cd1fe,1765267866');
        crmFormData.append('publicid', '7b2f54ee9785f7921f068fe2bb6b6f43');
        crmFormData.append('urlencodeenable', '1');
        crmFormData.append('name', 'ROM Form');
        crmFormData.append('firstname', formData.firstName);
        crmFormData.append('lastname', formData.lastName);
        crmFormData.append('mobile', formData.phone);
        crmFormData.append('cf_1274', formData.budget);
        crmFormData.append('cf_1276', formData.requirementType === 'rental' ? 'Rental' : 'Purchase');
        crmFormData.append('cf_1278', formData.propertyType);
        crmFormData.append('cf_1280', formData.purpose === 'commercial' ? 'Commercial' : 'Residential');
        crmFormData.append('cf_1282', formData.location);

        fetch('https://crm.base2brand.com/modules/Webforms/capture.php', {
          method: 'POST',
          body: crmFormData,
          mode: 'no-cors',
        }).catch((err) => console.log('CRM submission error (expected with no-cors):', err));

        console.log('CRM submission initiated with data:', {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          requirement: formData.requirementType,
          propertyType: formData.propertyType,
          purpose: formData.purpose,
          location: formData.location,
          budget: formData.budget,
        });
      } catch (crmError) {
        console.error('CRM submission error:', crmError);
      }

      // Submit to KV Store API (Property Queries)
      console.log('Submitting Property Query to KV Store API...');
      const queryData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: `${formData.firstName} ${formData.lastName}`,
        email: '', 
        phone: formData.phone,
        subject: `Requirement: ${formData.requirementType} - ${formData.propertyType}`,
        message: `Requirement Type: ${formData.requirementType}\nProperty Type: ${formData.propertyType}\nPurpose: ${formData.purpose}\nPreferred Location: ${formData.location}\nBudget: ${formData.budget}${propertyDescription ? `\n\nProperty Details: ${propertyDescription}` : ''}`,
        queryType: formData.requirementType || 'General',
        requirementType: formData.requirementType,
        propertyType: formData.propertyType,
        purpose: formData.purpose,
        location: formData.location,
        budget: formData.budget,
        propertyId: propertyId,
        propertyTitle: propertyTitle,
        propertyDescription: propertyDescription,
        type: 'general',
        status: 'Pending',
      };

      const result = await propertyQueriesKvApi.create(queryData);
      console.log('Property Queries KV API response:', result);

      if (result.success) {
        toast.success('Thank you! We will contact you soon.', {
          description: 'Your query has been submitted successfully.',
        });
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          requirementType: '',
          propertyType: '',
          purpose: '',
          location: '',
          budget: '',
          propertyId,
          propertyTitle,
        });
        
        onSubmitSuccess?.();
        onClose();
      } else {
        console.error('KV API submission failed:', result);
        toast.error('Failed to submit inquiry', {
          description: result.error || 'Please try again later.',
        });
      }
    } catch (error) {
      console.error('Error submitting query:', error);
      toast.error('Failed to submit inquiry', {
        description: 'Please check console for details and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = (
    <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 ${inline ? 'w-full' : 'max-w-2xl w-full'} ${inline ? '' : 'max-h-[90vh]'} flex flex-col relative`}>
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary to-red-600 rounded-t-2xl p-6 text-white relative">
          {!inline && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors z-10"
              aria-label="Close form"
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          )}
          <h3 className={`text-2xl font-bold mb-2 ${!inline ? 'pr-10' : ''}`}>Interested in this property?</h3>
          {propertyTitle && (
            <p className="text-sm text-white text-opacity-90">
              <span className="font-semibold">{propertyTitle}</span>
            </p>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 lg:p-8">
          {propertyDescription && (
            <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{propertyDescription}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} id="contact-form" className="space-y-5">
          {/* First Name & Last Name - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Enter first name"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Enter last name"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
              pattern="[0-9]{10}"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
            />
            <p className="text-xs text-gray-500 mt-1">Enter 10 digit mobile number</p>
          </div>

          {/* Requirement Type & Property Type - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="requirementType" className="block text-sm font-medium text-gray-700 mb-2">
                Requirement <span className="text-red-500">*</span>
              </label>
              <select
                id="requirementType"
                name="requirementType"
                value={formData.requirementType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white text-gray-900 appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="" className="text-gray-500">Select requirement type</option>
                <option value="rental" className="text-gray-900">Rental</option>
                <option value="purchase" className="text-gray-900">Purchase</option>
              </select>
            </div>

            <div>
              <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white text-gray-900 appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="" className="text-gray-500">Select property type</option>
                <option value="1bhk" className="text-gray-900">1 BHK</option>
                <option value="2bhk" className="text-gray-900">2 BHK</option>
                <option value="3bhk" className="text-gray-900">3 BHK</option>
                <option value="4bhk" className="text-gray-900">4 BHK</option>
                <option value="independent" className="text-gray-900">Independent House</option>
                <option value="duplex" className="text-gray-900">Duplex</option>
                <option value="plot" className="text-gray-900">Plot</option>
              </select>
            </div>
          </div>

          {/* Purpose & Location - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
                Purpose <span className="text-red-500">*</span>
              </label>
              <select
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white text-gray-900 appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="" className="text-gray-500">Select purpose</option>
                <option value="commercial" className="text-gray-900">Commercial</option>
                <option value="residential" className="text-gray-900">Residential</option>
              </select>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g., Mohali, Chandigarh, Kharar"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Preferred Budget */}
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Budget <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              required
              placeholder="Enter your budget (e.g., ₹15,000/month)"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
            />
          </div>
          </form>
        </div>

        {/* Sticky Footer with Submit Button */}
        <div className="border-t-2 border-gray-200 bg-gradient-to-b from-gray-50 to-white p-6 lg:p-8 rounded-b-2xl">
          <button
            type="submit"
            form="contact-form"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-primary to-red-600 text-white py-4 px-6 rounded-xl hover:from-red-600 hover:to-primary transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-bold text-base transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Inquiry'
            )}
          </button>
          <p className="text-xs text-center text-gray-500 mt-3">
            By submitting, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
  );

  if (inline) {
    return formContent;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      {formContent}
    </div>
  );
};

export default ContactForm;

