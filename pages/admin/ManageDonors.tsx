import React, { useEffect, useState } from 'react';
import { getDonors } from '../../services/storageService';
import { api } from '../../services/api';
import { Donor } from '../../types';
import { Trash2, Edit, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import Toast from '../../components/Toast';

const ManageDonors: React.FC = () => {
    const [donors, setDonors] = useState<Donor[]>([]);
    const [filteredDonors, setFilteredDonors] = useState<Donor[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [filterBloodGroup, setFilterBloodGroup] = useState<string>('All');
    const [formData, setFormData] = useState<Partial<Donor>>({
        name: '',
        bloodGroup: 'A+',
        phone: '',
        address: '',
        age: 18,
        gender: 'Male',
        lastDonation: '',
        isAvailableForEmergency: true
    });

    // Toast State
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
    };

    const fetchDonors = async () => {
        setLoading(true);
        try {
            const data = await getDonors();
            // Only show approved donors in the main manager. Pending ones are in /admin/approvals
            setDonors(data.filter(d => d.isApproved === true));
        } catch (e) {
            console.error(e);
            showToast("Failed to fetch donors", 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonors();
    }, []);

    useEffect(() => {
        if (filterBloodGroup === 'All') {
            setFilteredDonors(donors);
        } else {
            setFilteredDonors(donors.filter(d => d.bloodGroup === filterBloodGroup));
        }
    }, [donors, filterBloodGroup]);

    const handleExport = () => {
        // Filter out unavailable donors and exclude ID/CreatedAt
        const exportData = filteredDonors
            .filter(d => d.isAvailableForEmergency)
            .map(({ id, createdAt, ...rest }) => rest);

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Donors");
        XLSX.writeFile(wb, `donors_list_${filterBloodGroup}.xlsx`);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this donor?')) return;
        try {
            await api.delete(`/donors/${id}`);
            showToast("Donor deleted successfully");
            fetchDonors();
        } catch (error) {
            console.error("Failed to delete donor", error);
            showToast("Failed to delete donor. Ensure backend is running.", 'error');
        }
    };

    const handleToggleAvailability = async (donor: Donor) => {
        try {
            const updatedStatus = !donor.isAvailableForEmergency;
            await api.put(`/donors/${donor.id}`, { ...donor, isAvailableForEmergency: updatedStatus });
            // Optimistic update
            setDonors(prev => prev.map(d => d.id === donor.id ? { ...d, isAvailableForEmergency: updatedStatus } : d));
            showToast(`Donor availability updated to ${updatedStatus ? 'Available' : 'Unavailable'}`);
        } catch (error) {
            console.error("Failed to update availability", error);
            showToast("Failed to update availability. Check backend.", 'error');
        }
    };

    const handleEdit = (donor: Donor) => {
        setEditingId(donor.id);
        setFormData(donor);
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/donors/${editingId}`, formData);
                showToast("Donor updated successfully");
            }
            setShowModal(false);
            fetchDonors();
        } catch (err) {
            console.error(err);
            showToast("Failed to update donor", 'error');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Manage Donors</h1>
                <div className="flex gap-4">
                    <select
                        value={filterBloodGroup}
                        onChange={(e) => setFilterBloodGroup(e.target.value)}
                        className="border border-slate-300 rounded-lg px-4 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <option value="All">All Blood Groups</option>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                            <option key={bg} value={bg}>{bg}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        <Download size={18} /> Export List
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Blood Group</th>
                                <th className="px-6 py-4">Phone</th>
                                <th className="px-6 py-4">Address</th>
                                <th className="px-6 py-4">Availability</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center">Loading...</td>
                                </tr>
                            ) : filteredDonors.map((donor) => (
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
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleToggleAvailability(donor)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${donor.isAvailableForEmergency ? 'bg-green-600' : 'bg-slate-300'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${donor.isAvailableForEmergency ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                            <span className={`text-sm font-medium ${donor.isAvailableForEmergency ? 'text-green-700' : 'text-slate-500'}`}>
                                                {donor.isAvailableForEmergency ? 'Available' : 'Unavailable'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleEdit(donor)}
                                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors mr-2"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(donor.id)}
                                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-96 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Edit Donor</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input name="name" placeholder="Name" className="w-full border p-2 rounded" value={formData.name} onChange={handleChange} required />
                            <select name="bloodGroup" className="w-full border p-2 rounded" value={formData.bloodGroup} onChange={handleChange}>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                            </select>
                            <input name="phone" placeholder="Phone" className="w-full border p-2 rounded" value={formData.phone} onChange={handleChange} required />
                            <input name="address" placeholder="Address" className="w-full border p-2 rounded" value={formData.address} onChange={handleChange} required />
                            <input name="age" type="number" placeholder="Age" className="w-full border p-2 rounded" value={formData.age} onChange={handleChange} required />

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Last Donation Date</label>
                                <input
                                    name="lastDonationDate"
                                    type="date"
                                    className="w-full border p-2 rounded"
                                    value={formData.lastDonationDate || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default ManageDonors;
