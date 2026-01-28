import React, { useEffect, useState } from 'react';
import { getHospitals } from '../../services/storageService';
import { api } from '../../services/api';
import { Hospital } from '../../types';
import { Trash2, Plus, Edit } from 'lucide-react';
import Toast from '../../components/Toast';

const ManageHospitals: React.FC = () => {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', address: '', phone: '', image: 'https://picsum.photos/200/150', services: '' });

    // Toast State
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
    };

    const fetchHospitals = async () => {
        setLoading(true);
        try {
            const data = await getHospitals();
            setHospitals(data);
        } catch (e) {
            console.error(e);
            showToast("Failed to fetch hospitals", 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHospitals();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete?')) return;
        try {
            await api.delete(`/hospitals/${id}`);
            showToast("Hospital deleted successfully");
            fetchHospitals();
        } catch (error) {
            console.error(error);
            showToast("Failed to delete. Check backend server.", 'error');
        }
    };

    const handleEdit = (hosp: Hospital) => {
        setEditingId(hosp.id);
        setFormData({
            name: hosp.name,
            address: hosp.address,
            phone: hosp.phone || '',
            image: hosp.image || 'https://picsum.photos/200/150',
            services: hosp.services.join(', ')
        });
        setShowModal(true);
    };

    const handleAddNew = () => {
        setEditingId(null);
        setFormData({ name: '', address: '', phone: '', image: 'https://picsum.photos/200/150', services: '' });
        setShowModal(true);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                services: formData.services.split(',').map(s => s.trim())
            };

            if (editingId) {
                await api.put(`/hospitals/${editingId}`, payload);
                showToast("Hospital updated successfully");
            } else {
                await api.post('/hospitals', payload);
                showToast("Hospital added successfully");
            }
            setShowModal(false);
            fetchHospitals();
        } catch (err) {
            console.error(err);
            showToast(editingId ? "Failed to update hospital" : "Failed to add hospital", 'error');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Manage Hospitals</h1>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                    <Plus size={18} /> Add Hospital
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Address</th>
                            <th className="px-6 py-4">Phone</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? <tr><td colSpan={4} className="p-8 text-center">Loading...</td></tr> : hospitals.map((hosp) => (
                            <tr key={hosp.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{hosp.name}</td>
                                <td className="px-6 py-4 truncate max-w-xs">{hosp.address}</td>
                                <td className="px-6 py-4">{hosp.phone}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleEdit(hosp)} className="text-blue-600 p-2 hover:bg-blue-50 rounded-lg mr-2"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(hosp.id)} className="text-red-600 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-96">
                        <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Hospital' : 'Add New Hospital'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input placeholder="Name" className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            <input placeholder="Address" className="w-full border p-2 rounded" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required />
                            <input placeholder="Phone" className="w-full border p-2 rounded" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
                            <input placeholder="Image URL (e.g., specific link)" className="w-full border p-2 rounded" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                            {formData.image && <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded mt-2" />}
                            <input placeholder="Services (comma separated)" className="w-full border p-2 rounded" value={formData.services} onChange={e => setFormData({ ...formData, services: e.target.value })} required />
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

export default ManageHospitals;
