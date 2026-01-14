import React, { useEffect, useState } from 'react';
import { getDonationRequests, deleteDonationRequest } from '../../services/storageService';
import { DonationRequest } from '../../types';
import { Trash2, Eye, X, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

const ManageDonationRequests: React.FC = () => {
    const [requests, setRequests] = useState<DonationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<DonationRequest | null>(null);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await getDonationRequests();
            // Only show approved donation requests
            setRequests(data.filter(r => r.isApproved === true));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this donation request?')) return;
        try {
            await deleteDonationRequest(id);
            setRequests(prev => prev.filter(r => r.id !== id));
            alert("Donation request deleted successfully!");
        } catch (error) {
            console.error("Failed to delete request", error);
            alert("Failed to delete request");
        }
    };

    const handleExport = () => {
        const exportData = requests.map(({ id, createdAt, isApproved, ...rest }) => rest);
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Donation Requests");
        XLSX.writeFile(wb, `donation_requests_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        } catch {
            return 'N/A';
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Manage Donation Requests</h1>
                    <p className="text-slate-600 text-sm mt-1">
                        View and manage approved donation requests
                    </p>
                </div>
                <button
                    onClick={handleExport}
                    disabled={requests.length === 0}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Download size={18} />
                    Export to Excel
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {requests.length === 0 && !loading ? (
                    <div className="p-8 text-center text-slate-500">
                        No approved donation requests yet
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Full Name</th>
                                    <th className="px-6 py-4">Mobile Number</th>
                                    <th className="px-6 py-4">Description Preview</th>
                                    <th className="px-6 py-4">Approved Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center">Loading...</td>
                                    </tr>
                                ) : requests.map((request) => (
                                    <tr key={request.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {request.fullName}
                                        </td>
                                        <td className="px-6 py-4">{request.mobileNumber}</td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <div className="truncate text-slate-600">
                                                {request.description.substring(0, 60)}
                                                {request.description.length > 60 ? '...' : ''}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {formatDate(request.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedRequest(request)}
                                                    className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 transition font-medium"
                                                >
                                                    <Eye size={16} /> View
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(request.id)}
                                                    className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 transition font-medium"
                                                >
                                                    <Trash2 size={16} /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* View Details Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Donation Request Details</h2>
                            <button 
                                onClick={() => setSelectedRequest(null)}
                                className="text-white hover:text-blue-100"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-500 mb-1">Full Name</label>
                                <p className="text-lg font-semibold text-slate-900">{selectedRequest.fullName}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-500 mb-1">Mobile Number</label>
                                <p className="text-lg font-semibold text-slate-900">{selectedRequest.mobileNumber}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-500 mb-1">Approved On</label>
                                <p className="text-lg font-semibold text-slate-900">{formatDate(selectedRequest.createdAt)}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-500 mb-1">Status</label>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                                    ✓ Approved
                                </span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-500 mb-1">
                                    Medical/Financial Situation Description
                                </label>
                                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                    <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">
                                        {selectedRequest.description}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    onClick={() => setSelectedRequest(null)}
                                    className="flex-1 bg-slate-200 text-slate-700 px-4 py-3 rounded-lg hover:bg-slate-300 transition font-medium"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        handleDelete(selectedRequest.id);
                                        setSelectedRequest(null);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition font-medium"
                                >
                                    <Trash2 size={18} /> Delete Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageDonationRequests;
