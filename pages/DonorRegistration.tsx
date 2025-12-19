import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDonor } from '../services/storageService';
import { BloodGroup } from '../types';
import { CheckCircle } from 'lucide-react';

const DonorRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'A+' as BloodGroup,
    phone: '',
    address: '',
    lastDonationDate: '',
    isAvailableForEmergency: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, isAvailableForEmergency: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.age) return;

    setIsSubmitting(true);
    try {
      await addDonor({
        ...formData,
        age: parseInt(formData.age),
        gender: formData.gender as 'Male' | 'Female' | 'Other',
      });
      setSubmitted(true);
      setTimeout(() => {
        navigate('/donors');
      }, 2000);
    } catch (error) {
      console.error("Failed to register donor", error);
      // Optional: Show error message to user
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
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Successful!</h2>
          <p className="text-slate-600 mb-6">Thank you for registering. Your profile is pending admin approval and will appear on the donor list once approved.</p>
          <p className="text-sm text-slate-400">Redirecting to donor list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="bg-red-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white">Donor Registration</h1>
            <p className="text-red-100 text-sm mt-1">Fill in your details to become a blood donor.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Name */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  placeholder="e.g. Rahim Uddin"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  required
                  min="18"
                  max="65"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  placeholder="18-65"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  placeholder="017xxxxxxxx"
                />
              </div>

              {/* Address */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <textarea
                  name="address"
                  rows={3}
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  placeholder="Street, Area, City"
                />
              </div>

              {/* Last Donation Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Donation (Optional)</label>
                <input
                  type="date"
                  name="lastDonationDate"
                  value={formData.lastDonationDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>

              {/* Emergency Availability */}
              <div className="col-span-2 flex items-center">
                <input
                  type="checkbox"
                  id="isAvailableForEmergency"
                  name="isAvailableForEmergency"
                  checked={formData.isAvailableForEmergency}
                  onChange={handleCheckboxChange}
                  className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="isAvailableForEmergency" className="ml-2 block text-sm text-slate-700">
                  I am available for emergency donations.
                </label>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Registering...' : 'Register as Donor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonorRegistration;
