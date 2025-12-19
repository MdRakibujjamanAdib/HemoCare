import React, { useEffect, useState } from 'react';
import { getDoctors } from '../services/storageService';
import { Doctor } from '../types';
import { Stethoscope, Building, Phone } from 'lucide-react';

const Doctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({ centralPhone: '', useCentralPhone: false });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);

        // Fetch Settings
        const settingsRes = await fetch('http://localhost:5000/api/settings'); // Direct fetch since public
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSettings(settingsData);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Doctor Directory</h1>
          <p className="mt-2 text-slate-500">Expert medical professionals ready to assist you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p className="text-slate-500">Loading doctors...</p>
            </div>
          ) : doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
              <div className="aspect-square w-full bg-slate-200 overflow-hidden relative group">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col text-center">
                <h3 className="text-lg font-bold text-slate-900">{doctor.name}</h3>
                <div className="flex items-center justify-center gap-1 text-teal-600 font-medium text-sm mt-1 mb-4">
                  <Stethoscope size={14} />
                  <span>{doctor.specialist}</span>
                </div>

                <div className="mt-auto space-y-3">
                  <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
                    <Building size={14} />
                    <span>{doctor.hospital}</span>
                  </div>
                  <a
                    href={`tel:${doctor.useCentralContact && settings.centralPhone ? settings.centralPhone : doctor.phone}`}
                    className="block w-full py-2 px-4 border border-teal-600 text-teal-600 hover:bg-teal-50 rounded-lg font-medium transition-colors text-sm"
                  >
                    Book Appointment
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

export default Doctors;
