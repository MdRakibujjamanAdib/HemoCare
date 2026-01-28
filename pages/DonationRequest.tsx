import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDonationRequest } from '../services/storageService';
import { CheckCircle } from 'lucide-react';

const DonationRequest: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.mobileNumber || !formData.description) return;

    setIsSubmitting(true);
    try {
      await addDonationRequest(formData);
      setSubmitted(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error("Failed to submit donation request", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full animate-fade-in">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Request Submitted Successfully!</h2>
          <p className="text-slate-600 mb-6">
            Thank you for submitting your donation request. Our admin team will review it and get back to you soon.
          </p>
          <p className="text-sm text-slate-400">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="bg-blue-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white">Donation Request</h1>
            <p className="text-blue-100 text-sm mt-1">
              Submit your request if you need financial assistance for medical treatment.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Privacy Notice:</strong> Your information will remain confidential and will only be visible to our admin team for review.
              </p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Enter your full name"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mobile Number <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                name="mobileNumber"
                required
                value={formData.mobileNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="017xxxxxxxx"
              />
            </div>

            {/* Brief Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Brief Description of Medical/Financial Situation <span className="text-red-600">*</span>
              </label>
              <textarea
                name="description"
                rows={6}
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Please describe your medical condition and financial situation in detail. Include information about the treatment needed and estimated costs if possible."
              />
              <p className="text-xs text-slate-500 mt-1">
                Please provide as much detail as possible to help us understand your situation better.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Donation Request'}
              </button>
            </div>

            {/* Additional Info */}
            <div className="pt-2 text-center">
              <p className="text-xs text-slate-500">
                By submitting this form, you agree to our privacy policy and confirm that the information provided is accurate.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonationRequest;
