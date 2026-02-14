import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, ArrowLeft } from 'lucide-react';

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gmmi-gold/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gmmi-navy/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Left Side: Immersive Brand Experience */}
      <div className="hidden lg:flex relative bg-gmmi-navy items-center justify-center p-16 overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544427920-c49ccfb85579?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            className="w-full h-full object-cover opacity-10 scale-105"
            alt="Church Background"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gmmi-navy via-gmmi-navy/95 to-gmmi-navy/90"></div>

          {/* Animated Glows */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gmmi-gold/5 rounded-full blur-[100px] animate-pulse"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center space-y-10 max-w-lg"
        >
          {/* Logo Container with Elevation */}
          <div className="inline-flex relative group">
            <div className="absolute -inset-4 bg-gmmi-gold/20 rounded-[2.5rem] blur-2xl group-hover:bg-gmmi-gold/30 transition duration-700"></div>
            <div className="relative p-6 rounded-[2.5rem] bg-white/10 border border-white/20 backdrop-blur-2xl shadow-2xl flex items-center justify-center">
              <img src="/img/LOGO GMMI.png" alt="Logo GMMI" className="w-20 h-20 object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl font-black text-white tracking-tighter leading-none">
              Portal <span className="text-gmmi-gold">GMMI</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium leading-relaxed px-6">
              Sistem Manajemen Terpadu Gereja Masehi Musafir Indonesia. Kelola jemaat dan pelayanan dengan standar kelas dunia.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="pt-8 grid grid-cols-2 gap-6 px-4">
            <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md group hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-gmmi-gold/20 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <Shield className="text-gmmi-gold w-6 h-6" />
              </div>
              <p className="text-xl font-black text-white">SECURE</p>
              <p className="text-[10px] text-slate-500 uppercase mt-1 tracking-[0.2em] font-bold">End-to-End Encryption</p>
            </div>
            <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md group hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-gmmi-gold/20 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                <Zap className="text-gmmi-gold w-6 h-6" />
              </div>
              <p className="text-xl font-black text-white">FAST</p>
              <p className="text-[10px] text-slate-500 uppercase mt-1 tracking-[0.2em] font-bold">Real-time Performance</p>
            </div>
          </div>
        </motion.div>

        {/* Footer Credit */}
        <div className="absolute bottom-12 left-0 w-full text-center">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">GMMI Digital Ecosystem &copy; 2026</p>
        </div>
      </div>

      {/* Right Side: Elegant Form Area */}
      <div className="flex items-center justify-center p-6 md:p-12 lg:p-20 relative z-10">
        <div className="w-full max-w-md space-y-10">
          {/* Mobile Header (Hidden on large screens) */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden flex flex-col items-center text-center space-y-4 mb-10"
          >
            <div className="bg-gmmi-navy p-4 rounded-3xl shadow-2xl relative">
              <div className="absolute -inset-2 bg-gmmi-gold/20 rounded-[2rem] blur-xl opacity-50"></div>
              <img src="/img/LOGO GMMI.png" alt="Logo GMMI" className="w-12 h-12 object-contain relative z-10" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gmmi-navy tracking-tighter">Portal GMMI</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Sistem Administrasi Pusat</p>
            </div>
          </motion.div>

          {/* Form Content */}
          <div className="relative">
            {children}
          </div>

          {/* Bottom Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white shadow-sm border border-slate-100 text-sm font-bold text-slate-600 hover:text-gmmi-navy hover:shadow-md transition-all duration-300 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Beranda Utama
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;