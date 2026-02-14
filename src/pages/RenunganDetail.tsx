import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRenunganById } from "../services/renungan.service";
import Navbar from "../components/partials/Navbar";
import Footer from "../components/partials/Footer";

import { Button, Image, Spinner } from "@heroui/react";
import { ChevronLeft, Calendar, Share2, Clock, Quote } from "lucide-react";
import { motion } from "framer-motion";

type RenunganData = {
  id: number;
  judul: string;
  isi: string;
  tanggal: string;
  gambar: string | null;
};

const RenunganDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [renungan, setRenungan] = useState<RenunganData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRenungan = async () => {
      try {
        if (id) {
          const data = await getRenunganById(parseInt(id));
          setRenungan(Array.isArray(data) ? data[0] : data);
        }
      } catch (error) {
        console.error("Failed to fetch renungan detail", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRenungan();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (!renungan) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <Navbar />
        <div className="text-center space-y-4">
          <Quote size={48} className="text-neutral-300 mx-auto" />
          <h2 className="text-2xl font-bold text-gmmi-navy">
            Renungan Tidak Ditemukan
          </h2>
          <Button as={Link} to="/renungan" variant="flat" color="primary">
            Kembali ke Daftar Renungan
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(renungan.tanggal).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-neutral-50/30">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-32 pb-32 bg-gmmi-navy text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10">
          <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gmmi-gold rounded-full blur-[150px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              as={Link}
              to="/renungan"
              variant="light"
              className="mb-8 text-gmmi-gold/80 hover:text-gmmi-gold font-bold uppercase tracking-widest pl-0 gap-2"
            >
              <ChevronLeft size={16} /> Kembali
            </Button>

            <div className="max-w-4xl">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full flex items-center gap-2 border border-white/10">
                  <Calendar size={14} className="text-gmmi-gold" />
                  <span className="text-xs font-bold uppercase tracking-wide">
                    {formattedDate}
                  </span>
                </div>
                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full flex items-center gap-2 border border-white/10">
                  <Clock size={14} className="text-gmmi-gold" />
                  <span className="text-xs font-bold uppercase tracking-wide">
                    Renungan Mingguan
                  </span>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-8">
                {renungan.judul}
              </h1>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <main className="container mx-auto px-6 -mt-20 relative z-20 pb-24">
        <div className="bg-white rounded-[3rem] shadow-xl shadow-gmmi-navy/5 p-8 md:p-16 max-w-5xl mx-auto border border-white">
          {renungan.gambar && (
            <div className="mb-12 rounded-[2rem] overflow-hidden shadow-lg">
              <Image
                src={`${import.meta.env.VITE_API_URL || "http://localhost:3000"}${renungan.gambar}`}
                alt={renungan.judul}
                className="w-full h-auto object-cover max-h-[500px]"
                width="100%"
              />
            </div>
          )}

          <article className="prose prose-lg md:prose-xl max-w-none text-slate-600 prose-headings:text-gmmi-navy prose-p:leading-relaxed prose-img:rounded-3xl prose-a:text-gmmi-gold">
            <div className="whitespace-pre-wrap font-serif text-lg md:text-xl leading-8 selection:bg-gmmi-gold/20">
              {renungan.isi}
            </div>
          </article>

          <div className="mt-16 pt-10 border-t border-neutral-100 flex justify-between items-center">
            <span className="text-sm text-neutral-400 font-medium">
              Bagikan renungan ini:
            </span>
            <div className="flex gap-4">
              <Button
                isIconOnly
                radius="full"
                variant="flat"
                className="bg-neutral-100 text-gmmi-navy hover:bg-gmmi-gold hover:text-white transition-colors"
              >
                <Share2 size={18} />
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RenunganDetail;
