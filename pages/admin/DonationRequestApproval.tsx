import React, { useEffect, useState } from 'react';
import { getDonationRequests, approveDonationRequest, deleteDonationRequest } from '../../services/storageService';
import { DonationRequest } from '../../types';
import { Check, X, Eye } from 'lucide-react';

const DonationRequestApproval: React.FC = () => {
    const [pendingRequests, setPendingRequests] = useState<DonationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<DonationRequest | null>(null);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await getDonationRequests();
            // Filter only pending requests (not approved)
            setPendingRequests(data.filter(r => r.isApproved === false || r.isApproved === undefined));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (request: DonationRequest) => {
        try {
            await approveDonationRequest(request.id);
            setPendingRequests(prev => prev.filter(r => r.id !== request.id));
            setSelectedRequest(null);
            alert("Donation request approved successfully!");
        } catch (error) {
            console.error("Failed to approve request", error);
            alert("Failed to approve request");
        }
    };

    const handleReject = async (id: string) => {
        if (!window.confirm("Are you sure you want to reject (delete) this request?")) return;
        try {
            await deleteDonationRequest(id);
            setPendingRequests(prev => prev.filter(r => r.id !== id));
            setSelectedRequest(null);
            alert("Donation request rejected successfully!");
        } catch (error) {
            console.error("Failed to reject request", error);
            alert("Failed to reject request");
        }
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
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Donation Request Approvals</h1>
                <p className="text-slate-600 text-sm mt-1">
                    Review and approve donation requests from patients needing financial assistance
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Full Name</th>
                                <th className="px-6 py-4">Mobile Number</th>
                                <th className="px-6 py-4">Description Preview</th>
                                <th className="px-6 py-4">Submitted</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center">Loading...</td>
                                </tr>
                            ) : pendingRequests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                        No pending donation requests
                                    </td>
                                </tr>
                            ) : pendingRequests.map((request) => (
                                <tr key={request.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {request.fullName}
                                    </td>
                                    <td className="px-6 py-4">{request.mobileNumber}</td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <div className="truncate text-slate-600">
                                            {request.description.substring(0, 50)}
                                            {request.description.length > 50 ? '...' : ''}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {formatDate(request.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedRequest(request)}
                                                className="flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition font-medium"
                                            >
                                                <Eye size={16} /> View
                                            </button>
                                            <button
                                                onClick={() => handleApprove(request)}
                                                className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-200 transition font-medium"
                                            >
                                                <Check size={16} /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(request.id)}
                                                className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 transition font-medium"
                                            >
                                                <X size={16} /> Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
                                <label className="block text-sm font-medium text-slate-500 mb-1">Submitted On</label>
                                <p className="text-lg font-semibold text-slate-900">{formatDate(selectedRequest.createdAt)}</p>
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

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => handleApprove(selectedRequest)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition font-medium"
                                >
                                    <Check size={18} /> Approve Request
                                </button>
                                <button
                                    onClick={() => handleReject(selectedRequest.id)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition font-medium"
                                >
                                    <X size={18} /> Reject Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationRequestApproval;
