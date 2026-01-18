import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent! We will contact you shortly.");
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold text-slate-900">Get in Touch</h1>
          <p className="mt-2 text-slate-500">We'd love to hear from you. Send us a message.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h3>
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-red-100 p-3 rounded-lg text-red-600">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900">Our Location</h4>
                            <p className="text-slate-600">123 Health Avenue, Dhanmondi,<br/>Dhaka 1209, Bangladesh</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                            <Phone size={24} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900">Phone Support</h4>
                            <p className="text-slate-600">+880 1410-805031</p>
                            <p className="text-slate-500 text-sm">Mon - Fri, 9am - 6pm</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-green-100 p-3 rounded-lg text-green-600">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-900">Email</h4>
                            <p className="text-slate-600">hemocarehubbd@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                    <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                    <textarea
                        name="message"
                        rows={4}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-slate-900 text-white font-bold py-3 px-4 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                    <Send size={18} />
                    Send Message
                </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
