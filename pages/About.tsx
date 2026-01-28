import React from 'react';
import { Target, Flag, Heart } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">About Us</h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500">
            Learn more about the mission and vision behind HemoCare Hub BD.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="prose prose-lg text-slate-600">
             <h3 className="text-2xl font-bold text-slate-800 mb-4">Our Story</h3>
             <p className="mb-4">
               HemoCare Hub BD was founded with a singular purpose: to bridge the gap between blood donors and patients in need across Bangladesh. We recognized that in critical moments, finding a compatible blood donor can be a daunting task.
             </p>
             <p>
               Our platform serves as a centralized hub, not just for blood donation, but as a comprehensive healthcare directory connecting people with doctors and hospitals quickly and efficiently.
             </p>
          </div>
          <div className="relative h-64 md:h-auto rounded-2xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Medical Team" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Our Mission</h3>
            <p className="text-slate-600">
              To ensure that no life is lost due to the unavailability of blood. We strive to create a reliable network of voluntary donors available 24/7.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Flag size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Our Vision</h3>
            <p className="text-slate-600">
              A healthier Bangladesh where digital healthcare solutions empower every citizen to access timely medical aid and resources.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Core Values</h3>
            <p className="text-slate-600">
              Compassion, Integrity, and Service. We believe in the power of community and the sanctity of every human life.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default About;
