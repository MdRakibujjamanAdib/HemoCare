import React, { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error';
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed bottom-4 right-4 flex items-center gap-2 px-6 py-4 rounded-lg shadow-lg text-white transform transition-all duration-300 z-50 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}>
            {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <span className="font-medium">{message}</span>
        </div>
    );
};

export default Toast;
