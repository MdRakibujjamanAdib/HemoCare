import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { LayoutDashboard, Users, Stethoscope, Building, LogOut, Check, Settings, HandHeart, Heart } from 'lucide-react';

const AdminLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/admin/login');
            }
            setLoading(false);
        });
        return unsubscribe;
    }, [auth, navigate]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/admin/login');
    };

    if (loading) {
        return <div className="h-screen flex items-center justify-center">Loading...</div>;
    }

    const isActive = (path: string) => location.pathname === path;
    const linkClass = (path: string) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive(path) ? 'bg-red-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`;

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 fixed h-full z-10 hidden md:block">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-red-600">HemoCare Admin</h1>
                </div>
                <nav className="px-4 space-y-2 mt-4">
                    <Link to="/admin/dashboard" className={linkClass('/admin/dashboard')}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/admin/approvals" className={linkClass('/admin/approvals')}>
                        <Check size={20} />
                        <span>Donor Approvals</span>
                    </Link>
                    <Link to="/admin/donation-requests" className={linkClass('/admin/donation-requests')}>
                        <HandHeart size={20} />
                        <span>Donation Requests</span>
                    </Link>
                    <Link to="/admin/manage-donations" className={linkClass('/admin/manage-donations')}>
                        <Heart size={20} />
                        <span>Manage Donations</span>
                    </Link>
                    <Link to="/admin/donors" className={linkClass('/admin/donors')}>
                        <Users size={20} />
                        <span>Manage Donors</span>
                    </Link>
                    <Link to="/admin/doctors" className={linkClass('/admin/doctors')}>
                        <Stethoscope size={20} />
                        <span>Manage Doctors</span>
                    </Link>
                    <Link to="/admin/hospitals" className={linkClass('/admin/hospitals')}>
                        <Building size={20} />
                        <span>Manage Hospitals</span>
                    </Link>
                </nav>
                <div className="px-4 mt-4">
                    <div className="h-px bg-slate-100 my-2"></div>
                    <Link to="/admin/settings" className={linkClass('/admin/settings')}>
                        <Settings size={20} />
                        <span>General Settings</span>
                    </Link>
                </div>
                <div className="absolute bottom-0 w-full p-4 border-t border-slate-100">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 w-full transition-colors">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
