import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Heart, Activity, Users, Search, PlusCircle } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col-reverse lg:flex-row items-center gap-12">

          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              Give the Gift of <br />
              <span className="text-red-600">Life</span> Today
            </h1>
            <p className="text-lg lg:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              HemoCare Hub BD connects blood donors with patients in need. Join our community to save lives, find doctors, and access emergency healthcare services across Bangladesh.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transform hover:-translate-y-1 transition-all duration-200 text-center flex items-center justify-center gap-2">
                <Heart size={20} />
                Become a Donor
              </Link>
              <Link to="/donors" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 font-bold rounded-xl shadow-sm hover:bg-slate-50 hover:text-red-600 transition-all duration-200 text-center flex items-center justify-center gap-2">
                <Search size={20} />
                Find Blood
              </Link>
            </div>
          </div>

          {/* Hero Illustration/Image */}
          <div className="flex-1 relative">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            <img
              src="https://www.hfh.com.vn/app/uploads/2025/10/inline-images_lac_04501-jpg-scaled.webp"
              alt="Doctor and Patient"
              className="relative rounded-3xl shadow-2xl z-10 w-full object-cover h-[400px] lg:h-[500px]"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-red-600 font-semibold tracking-wide uppercase">Our Services</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Why Choose HemoCare Hub?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center mb-6">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Extensive Donor Network</h3>
              <p className="text-slate-600">
                Connect with thousands of verified donors across the country ready to help in emergencies.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                <PlusCircle size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Doctor Directory</h3>
              <p className="text-slate-600">
                Find specialists and general practitioners near you with our comprehensive doctor database.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6">
                <Activity size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Hospital Information</h3>
              <p className="text-slate-600">
                Get details about services, emergency contacts, and locations of top hospitals in Bangladesh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Healing Video Section */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">See How We Save Lives</h2>
              <p className="text-slate-300 mb-8 text-lg">
                Watch our inspiring stories of donors and patients. Every drop counts, and your contribution can bring a smile to someone's face.
              </p>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold">1</div>
                  <p>Register as a donor in 2 minutes.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold">2</div>
                  <p>Get notified when someone needs blood near you.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold">3</div>
                  <p>Donate and become a hero.</p>
                </div>
              </div>
            </div>

            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/AD91HwaDo9E"
                title="HemoCare Hub BD Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
          <p className="text-red-100 text-lg mb-8">
            Join the HemoCare Hub BD community today. Whether you want to donate blood or need medical assistance, we are here for you.
          </p>
          <Link to="/contact" className="inline-block bg-white text-red-600 font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-slate-100 transition-colors">
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
