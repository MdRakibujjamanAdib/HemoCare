import React, { useEffect, useState } from 'react';
import { getDonors, getDoctors, getHospitals } from '../../services/storageService';
import { Users, Stethoscope, Building } from 'lucide-react';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({ donors: 0, doctors: 0, hospitals: 0 });

    useEffect(() => {
        // We can use the public read functions for stats
        const fetchStats = async () => {
            const donors = await getDonors();
            const doctors = await getDoctors();
            const hospitals = await getHospitals();
            setStats({
                donors: donors.length,
                doctors: doctors.length,
                hospitals: hospitals.length,
            });
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl">
                        <Users size={32} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Total Donors</p>
                        <h3 className="text-3xl font-bold text-slate-900">{stats.donors}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-4 bg-teal-50 text-teal-600 rounded-xl">
                        <Stethoscope size={32} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Total Doctors</p>
                        <h3 className="text-3xl font-bold text-slate-900">{stats.doctors}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                        <Building size={32} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Total Hospitals</p>
                        <h3 className="text-3xl font-bold text-slate-900">{stats.hospitals}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
