import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Save, Settings } from 'lucide-react';

import Toast from '../../components/Toast';

const GeneralSettings: React.FC = () => {
    const [settings, setSettings] = useState({ centralPhone: '' });
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/settings');
            // Ensure we handle defaults if fields are missing
            setSettings({ centralPhone: res.centralPhone || '' });
        } catch (error) {
            console.error("Failed to fetch settings", error);
            setToast({ message: "Failed to fetch settings", type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSave = async () => {
        try {
            await api.put('/settings', settings);
            setToast({ message: "Settings saved successfully!", type: 'success' });
        } catch (error) {
            console.error("Failed to save settings", error);
            setToast({ message: "Failed to save settings.", type: 'error' });
        }
    };

    return (
        <div>
            <div className="flex items-center gap-3 mb-8">
                <Settings className="text-slate-800" size={32} />
                <h1 className="text-2xl font-bold text-slate-800">General Settings</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-2xl">
                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h2>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Central Appointment Number
                        </label>
                        <p className="text-sm text-slate-500 mb-3">
                            This number will be used for doctors who have "Use Central Contact" enabled.
                        </p>
                        <input
                            type="text"
                            value={settings.centralPhone}
                            onChange={(e) => setSettings({ ...settings, centralPhone: e.target.value })}
                            placeholder="+880 1234 567890"
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-slate-800 text-white px-6 py-2.5 rounded-lg hover:bg-slate-900 transition-colors font-medium"
                        >
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default GeneralSettings;
