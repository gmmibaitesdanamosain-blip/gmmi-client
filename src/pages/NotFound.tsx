import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { Home, ArrowLeft, AlertCircle } from "lucide-react";
import Navbar from "../components/partials/Navbar";
import Footer from "../components/partials/Footer";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center relative overflow-hidden py-20 px-6">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gmmi-navy/5 -skew-x-12 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gmmi-gold/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container mx-auto max-w-4xl relative z-10 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative inline-block mb-4"
          >
            <h1 className="text-[150px] md:text-[200px] font-serif font-bold text-gmmi-navy/5 leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gmmi-gold/10 rounded-full flex items-center justify-center text-gmmi-gold animate-pulse">
                <AlertCircle className="w-12 h-12 md:w-16 md:h-16" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gmmi-navy text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
              <AlertCircle className="w-3.5 h-3.5 text-gmmi-gold" />
              Halaman Tidak Ditemukan
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-gmmi-navy tracking-tight">
              Jalan Buntu?
            </h2>

            <p className="text-lg text-neutral-600 font-light leading-relaxed max-w-xl mx-auto">
              Sepertinya halaman yang Anda cari tidak tersedia atau telah
              dipindahkan. Jangan khawatir, mari kembali ke jalan yang benar.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <Button
              as={Link}
              to="/"
              size="lg"
              className="bg-gmmi-navy text-white font-semibold px-8 py-6 rounded-2xl hover:bg-gmmi-navy/90 hover:scale-105 transition-all shadow-xl shadow-gmmi-navy/20 flex items-center gap-3"
            >
              <Home className="w-5 h-5" />
              Kembali ke Beranda
            </Button>

            <Button
              as="button"
              onClick={() => window.history.back()}
              variant="flat"
              size="lg"
              className="bg-white text-gmmi-navy border border-neutral-200 font-semibold px-8 py-6 rounded-2xl hover:bg-neutral-50 transition-all flex items-center gap-3"
            >
              <ArrowLeft className="w-5 h-5" />
              Halaman Sebelumnya
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
