import React, { useEffect, useState } from 'react';
import { getDoctors } from '../../services/storageService';
import { api } from '../../services/api';
import { Doctor } from '../../types';
import { Trash2, Plus, Edit } from 'lucide-react';
import Toast from '../../components/Toast';

const ManageDoctors: React.FC = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Doctor>>({ name: '', specialist: '', hospital: '', phone: '', image: 'https://picsum.photos/100/100', useCentralContact: false });

    // Toast State
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
    };

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const data = await getDoctors();
            setDoctors(data);
        } catch (e) {
            console.error(e);
            showToast("Failed to fetch doctors", 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete?')) return;
        try {
            await api.delete(`/doctors/${id}`);
            showToast("Doctor deleted successfully");
            fetchDoctors();
        } catch (error) {
            console.error("Delete failed:", error);
            showToast("Failed to delete. Make sure backend is running.", 'error');
        }
    };

    const handleEdit = (doc: Doctor) => {
        setEditingId(doc.id);
        setFormData({
            name: doc.name,
            specialist: doc.specialist,
            hospital: doc.hospital,
            phone: doc.phone || '',
            image: doc.image || 'https://picsum.photos/100/100',
            useCentralContact: doc.useCentralContact || false
        });
        setShowModal(true);
    };

    const handleAddNew = () => {
        setEditingId(null);
        setFormData({ name: '', specialist: '', hospital: '', phone: '', image: 'https://picsum.photos/100/100', useCentralContact: false });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/doctors/${editingId}`, formData);
                showToast("Doctor updated successfully");
            } else {
                await api.post('/doctors', formData);
                showToast("Doctor added successfully");
            }
            setShowModal(false);
            fetchDoctors();
        } catch (err) {
            console.error(err);
            showToast(editingId ? "Failed to update doctor" : "Failed to add doctor", 'error');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Manage Doctors</h1>
                <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                    <Plus size={18} /> Add Doctor
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Specialist</th>
                            <th className="px-6 py-4">Hospital</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? <tr><td colSpan={4} className="p-8 text-center">Loading...</td></tr> : doctors.map((doc) => (
                            <tr key={doc.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{doc.name}</td>
                                <td className="px-6 py-4">{doc.specialist}</td>
                                <td className="px-6 py-4">{doc.hospital}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleEdit(doc)} className="text-blue-600 p-2 hover:bg-blue-50 rounded-lg mr-2" title="Edit">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(doc.id)} className="text-red-600 p-2 hover:bg-red-50 rounded-lg" title="Delete">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-96">
                        <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Doctor' : 'Add New Doctor'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input placeholder="Name" className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            <input placeholder="Specialist" className="w-full border p-2 rounded" value={formData.specialist} onChange={e => setFormData({ ...formData, specialist: e.target.value })} required />
                            <input placeholder="Hospital" className="w-full border p-2 rounded" value={formData.hospital} onChange={e => setFormData({ ...formData, hospital: e.target.value })} required />
                            <input placeholder="Phone" className="w-full border p-2 rounded" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
                            <input placeholder="Image URL (e.g., specific link)" className="w-full border p-2 rounded" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                            {formData.image && <img src={formData.image} alt="Preview" className="w-16 h-16 rounded-full object-cover mt-2" />}

                            <label className="flex items-center space-x-2 cursor-pointer border p-2 rounded hover:bg-slate-50">
                                <input
                                    type="checkbox"
                                    checked={formData.useCentralContact || false}
                                    onChange={e => setFormData({ ...formData, useCentralContact: e.target.checked })}
                                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                />
                                <span className="text-sm text-slate-700">Use Central Appointment Number</span>
                            </label>

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

export default ManageDoctors;
