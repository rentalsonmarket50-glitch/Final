'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface PropertyQueryFormProps {
  propertyId?: string;
  propertyTitle?: string;
  propertyDescription?: string;
  propertyUrl?: string;
  inline?: boolean;
  onSubmitSuccess?: () => void;
}

export const PropertyQueryForm = ({ 
  propertyId, 
  propertyTitle, 
  propertyDescription,
  propertyUrl,
  inline = false,
  onSubmitSuccess 
}: PropertyQueryFormProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      // Submit to CRM (Vtiger WebForm)
      try {
        const crmFormData = new FormData();
        crmFormData.append('__vtrftk', 'sid:1bb652ce2c5cd4c2106304a2911d36d18c4cd1fe,1765267866');
        crmFormData.append('publicid', '7b2f54ee9785f7921f068fe2bb6b6f43');
        crmFormData.append('urlencodeenable', '1');
        crmFormData.append('name', 'ROM Form');
        crmFormData.append('firstname', formData.firstName);
        crmFormData.append('lastname', formData.lastName);
        crmFormData.append('mobile', formData.phone);

        fetch('https://crm.base2brand.com/modules/Webforms/capture.php', {
          method: 'POST',
          body: crmFormData,
          mode: 'no-cors',
        }).catch((err) => console.log('CRM submission error (expected with no-cors):', err));

        console.log('CRM submission initiated with data:', {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        });
      } catch (crmError) {
        console.error('CRM submission error:', crmError);
      }

      // Submit to Supabase backend
      console.log('Submitting to Supabase backend...');
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5f9a91cf/queries`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            name: `${formData.firstName} ${formData.lastName}`,
            email: '', 
            phone: formData.phone,
            message: `Property Query${propertyDescription ? `\n\nProperty Details: ${propertyDescription}` : ''}${propertyUrl ? `\n\nProperty URL: ${propertyUrl}` : ''}`,
            propertyId: propertyId,
            propertyUrl: propertyUrl,
            type: propertyId ? 'property' : 'general',
          }),
        }
      );

      console.log('Supabase response status:', response.status);
      const result = await response.json();
      console.log('Supabase response data:', result);

      if (result.success) {
        toast.success('Thank you! We will contact you soon.', {
          description: 'Your query has been submitted successfully.',
        });
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
        });
        
        onSubmitSuccess?.();
      } else {
        console.error('Supabase submission failed:', result);
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
        <h3 className="text-2xl font-bold mb-2">Property Query</h3>
        {propertyTitle && (
          <p className="text-sm text-white text-opacity-90">
            <span className="font-semibold">{propertyTitle}</span>
          </p>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1 p-6 lg:p-8">
        <form onSubmit={handleSubmit} id="property-query-form" className="space-y-5">
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
        </form>
      </div>

      {/* Sticky Footer with Submit Button */}
      <div className="border-t-2 border-gray-200 bg-gradient-to-b from-gray-50 to-white p-6 lg:p-8 rounded-b-2xl">
        <button
          type="submit"
          form="property-query-form"
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
            'Submit Query'
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

export default PropertyQueryForm;

