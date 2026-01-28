import React, { useState, useEffect } from 'react';
import { getDonors } from '../services/storageService';
import { Donor, BloodGroup } from '../types';
import { Search, MapPin, Phone, User, Droplet } from 'lucide-react';

const DonorList: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const data = await getDonors();
        setDonors(data);
        setFilteredDonors(data);
      } catch (error) {
        console.error("Failed to fetch donors", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, []);

  useEffect(() => {
    let result = donors;

    if (selectedBloodGroup !== 'All') {
      result = result.filter(d => d.bloodGroup === selectedBloodGroup);
    }

    // Filter by Approval Status (Show only approved donors)
    result = result.filter(d => d.isApproved === true);

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(d =>
        d.address.toLowerCase().includes(lowerTerm) ||
        d.name.toLowerCase().includes(lowerTerm)
      );
    }

    setFilteredDonors(result);
  }, [selectedBloodGroup, searchTerm, donors]);

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 text-center md:text-left md:flex md:justify-between md:items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Find a Blood Donor</h1>
            <p className="mt-2 text-slate-500">Search for heroes in your area.</p>
          </div>
          <div className="mt-4 md:mt-0 text-sm text-slate-400">
            Showing {filteredDonors.length} donors
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4">

            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:placeholder-slate-500 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="Search by location or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Blood Group Dropdown */}
            <div className="w-full md:w-48">
              <select
                value={selectedBloodGroup}
                onChange={(e) => setSelectedBloodGroup(e.target.value as BloodGroup | 'All')}
                className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-lg"
              >
                <option value="All">All Blood Groups</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-slate-500">Loading donors...</p>
            </div>
          ) : filteredDonors.length > 0 ? (
            filteredDonors.map((donor) => (
              <div key={donor.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 overflow-hidden group">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-50 text-red-600 p-2 rounded-full group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                        <User size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{donor.name}</h3>
                        <p className="text-sm text-slate-500">{donor.age} Yrs • {donor.gender}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold bg-red-100 text-red-700">
                        {donor.bloodGroup}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                      <MapPin size={16} className="mt-0.5 text-slate-400" />
                      <span>{donor.address}</span>
                    </div>
                    {donor.lastDonationDate && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Droplet size={14} className="text-slate-400" />
                        <span>Last Donated: {donor.lastDonationDate}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${donor.isAvailableForEmergency
                      ? 'text-green-600 bg-green-50'
                      : 'text-slate-500 bg-slate-100'
                      }`}>
                      {donor.isAvailableForEmergency ? 'Available for donation' : 'Unavailable'}
                    </span>
                    <a href={`tel:${donor.phone}`} className="ml-auto inline-flex items-center gap-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors">
                      <Phone size={14} />
                      Call Now
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="inline-block p-4 rounded-full bg-slate-100 mb-4">
                <Search size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No donors found</h3>
              <p className="text-slate-500 mt-1">Try adjusting your filters or search term.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorList;
