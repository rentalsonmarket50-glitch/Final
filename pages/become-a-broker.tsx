import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import AppHead from '@/components/atoms/AppHead';
import AppHeader from '@/components/organisms/AppHeader';
import AppFooter from '@/components/atoms/AppFooter';
import { brokersKvApi } from '../utils/kvClient';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';

const BecomeABroker = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    primaryMobile: '',
    alternateMobile: '',
    email: '',
    profilePhoto: '',
    agencyName: '',
    officeAddress: '',
    city: '',
    workingAreas: '',
    reraNumber: '',
    gstNumber: '',
    companyLogo: '',
    aadhaarCard: '',
    panCard: '',
    visitingCard: '',
    selfie: '',
    contactMode: 'Call',
    workingHours: '',
    teamSize: '',
    propertyTypes: [] as string[],
    services: [] as string[],
    averageDealSize: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxGroup = (name: string, value: string) => {
    setFormData((prev: any) => {
      const current = prev[name] || [];
      const updated = current.includes(value)
        ? current.filter((item: string) => item !== value)
        : [...current, value];
      return { ...prev, [name]: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await brokersKvApi.create(formData);
      toast.success('Broker registration submitted successfully!', {
        description: 'We will contact you soon for verification.',
      });
      
      // Reset form
      setFormData({
        fullName: '',
        primaryMobile: '',
        alternateMobile: '',
        email: '',
        profilePhoto: '',
        agencyName: '',
        officeAddress: '',
        city: '',
        workingAreas: '',
        reraNumber: '',
        gstNumber: '',
        companyLogo: '',
        aadhaarCard: '',
        panCard: '',
        visitingCard: '',
        selfie: '',
        contactMode: 'Call',
        workingHours: '',
        teamSize: '',
        propertyTypes: [],
        services: [],
        averageDealSize: '',
      });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error: any) {
      console.error('Error saving broker:', error);
      toast.error('Failed to submit registration', {
        description: error.message || 'Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHead />
      <AppHeader />
      <main className="mt-[86px] py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Become a Broker</h1>
              </div>
            </div>

            {/* Personal Details */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">1. Personal Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Enter full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="primaryMobile"
                    value={formData.primaryMobile}
                    onChange={handleChange}
                    required
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alternate Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="alternateMobile"
                    value={formData.alternateMobile}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="email@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Agency / Business Details */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">2. Agency / Business Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agency / Brokerage Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="agencyName"
                    value={formData.agencyName}
                    onChange={handleChange}
                    required
                    placeholder="Enter agency name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Mohali"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Office Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="officeAddress"
                    value={formData.officeAddress}
                    onChange={handleChange}
                    required
                    rows={2}
                    placeholder="Enter complete office address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Working Areas / Localities
                  </label>
                  <input
                    type="text"
                    name="workingAreas"
                    value={formData.workingAreas}
                    onChange={handleChange}
                    placeholder="e.g., Sector 70, 76, 82"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RERA Registration Number
                  </label>
                  <input
                    type="text"
                    name="reraNumber"
                    value={formData.reraNumber}
                    onChange={handleChange}
                    placeholder="e.g., PBRERA123456"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Number
                  </label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    placeholder="Optional"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Communication Preferences */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">3. Communication Preferences</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Mode of Contact
                  </label>
                  <select
                    name="contactMode"
                    value={formData.contactMode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Call">Call</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Working Hours
                  </label>
                  <input
                    type="text"
                    name="workingHours"
                    value={formData.workingHours}
                    onChange={handleChange}
                    placeholder="e.g., 9 AM - 6 PM"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Agents in Your Team
                  </label>
                  <input
                    type="number"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleChange}
                    placeholder="e.g., 5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">4. Service Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Types of Properties You Handle
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Residential', 'Commercial', 'Plots'].map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.propertyTypes.includes(type)}
                        onChange={() => handleCheckboxGroup('propertyTypes', type)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Types of Services You Provide
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Rent', 'Sale', 'Lease'].map((service) => (
                    <label key={service} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service)}
                        onChange={() => handleCheckboxGroup('services', service)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{service}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Average Deal Size (Optional)
                </label>
                <input
                  type="text"
                  name="averageDealSize"
                  value={formData.averageDealSize}
                  onChange={handleChange}
                  placeholder="e.g., ₹50 Lakhs - 1 Crore"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Submit Button - Sticky at bottom */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 -mx-4 -mb-8 mt-8 shadow-lg">
              <div className="max-w-4xl mx-auto flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium shadow-md"
                >
                  <CheckIcon className="w-5 h-5" />
                  {loading ? 'Submitting...' : 'Submit Registration'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
      <AppFooter />
    </div>
  );
};

export default BecomeABroker;

