import React, { useEffect, useState } from 'react';
import { getDonors } from '../../services/storageService';
import { api } from '../../services/api';
import { Donor } from '../../types';
import { Check, X } from 'lucide-react';

const DonorApproval: React.FC = () => {
    const [pendingDonors, setPendingDonors] = useState<Donor[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDonors = async () => {
        setLoading(true);
        try {
            const data = await getDonors();
            // Filter only pending donors (not approved)
            setPendingDonors(data.filter(d => d.isApproved === false || d.isApproved === undefined));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonors();
    }, []);

    const handleApprove = async (donor: Donor) => {
        try {
            await api.put(`/donors/${donor.id}`, { ...donor, isApproved: true });
            setPendingDonors(prev => prev.filter(d => d.id !== donor.id));
        } catch (error) {
            console.error("Failed to approve donor", error);
            alert("Failed to approve donor");
        }
    };

    const handleReject = async (id: string) => {
        if (!window.confirm("Are you sure you want to reject (delete) this request?")) return;
        try {
            await api.delete(`/donors/${id}`);
            setPendingDonors(prev => prev.filter(d => d.id !== id));
        } catch (error) {
            console.error("Failed to reject donor", error);
            alert("Failed to reject donor");
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-8">Pending Approvals</h1>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Blood Group</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4">Address</th>
                                <th className="px-6 py-4">Submitted</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center">Loading...</td>
                                </tr>
                            ) : pendingDonors.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No pending approvals</td>
                                </tr>
                            ) : pendingDonors.map((donor) => (
                                <tr key={donor.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{donor.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-1 rounded bg-red-50 text-red-700 text-xs font-bold">
                                            {donor.bloodGroup}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{donor.phone}</td>
                                    <td className="px-6 py-4 truncate max-w-xs">{donor.address}</td>
                                    <td className="px-6 py-4">
                                        {/* Fallback if createdAt is not available or handled differently */}
                                        Today
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button
                                            onClick={() => handleApprove(donor)}
                                            className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 transition font-medium"
                                        >
                                            <Check size={16} /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(donor.id)}
                                            className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 transition font-medium"
                                        >
                                            <X size={16} /> Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DonorApproval;
