import React, { useEffect, useState } from 'react';
import { getHospitals } from '../services/storageService';
import { Hospital } from '../types';
import { MapPin, Phone, CheckCircle } from 'lucide-react';

const Hospitals: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const data = await getHospitals();
        setHospitals(data);
      } catch (error) {
        console.error("Failed to fetch hospitals", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Hospital Directory</h1>
          <p className="mt-2 text-slate-500">Find the best medical care facilities near you.</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-slate-500">Loading hospitals...</p>
            </div>
          ) : hospitals.map((hospital) => (
            <div key={hospital.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row">
              <div className="md:w-64 h-48 md:h-auto relative">
                <img
                  src={hospital.image}
                  alt={hospital.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{hospital.name}</h3>
                  <div className="flex items-start gap-2 text-slate-600 mb-4">
                    <MapPin size={18} className="mt-1 text-red-500 shrink-0" />
                    <span>{hospital.address}</span>
                  </div>

                  <div className="mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Services</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {hospital.services.map((service, idx) => (
                        <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          <CheckCircle size={12} className="mr-1" />
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
                  <a href={`tel:${hospital.phone}`} className="flex items-center gap-2 text-white bg-red-600 hover:bg-red-700 px-5 py-2.5 rounded-lg font-medium transition-colors">
                    <Phone size={18} />
                    Emergency: {hospital.phone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hospitals;
