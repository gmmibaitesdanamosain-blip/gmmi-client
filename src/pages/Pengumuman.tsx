import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getPengumuman } from "../services/dashboard.services";
import { Card, Skeleton, Input } from "@heroui/react";
import {
  ScrollText,
  Calendar,
  ChevronRight,
  Search,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/partials/Navbar";
import Footer from "../components/partials/Footer";
import HeroHeader from "../components/HeroHeader";

type Pengumuman = {
  id: string;
  isi: string;
  tanggal: string;
};

const PengumumanPage: React.FC = () => {
  const [pengumuman, setPengumuman] = useState<Pengumuman[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPengumuman = async () => {
      try {
        const res = await getPengumuman();
        setPengumuman(res || []);
      } catch (error) {
        console.error("Gagal mengambil data pengumuman:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPengumuman();
  }, []);

  const filteredPengumuman = pengumuman.filter((item) =>
    item.isi.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-neutral-50/30">
      <Navbar />

      {/* Header Section */}
      <HeroHeader
        title="Info & Pengumuman"
        subtitle="Sampaikanlah kabar baik itu kepada seluruh makhluk..."
        breadcrumbLabel="Kembali ke Beranda"
        breadcrumbLink="/"
      />

      <main className="container mx-auto px-6 py-16">
        {/* Search & Stats */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16">
          <div className="relative w-full md:max-w-md group">
            <Input
              isClearable
              className="w-full shadow-xl shadow-gmmi-navy/5"
              placeholder="Cari pengumuman..."
              startContent={<Search className="text-gmmi-gold" size={20} />}
              value={searchTerm}
              onValueChange={setSearchTerm}
              size="lg"
              radius="full"
              variant="bordered"
              classNames={{
                inputWrapper:
                  "bg-white border-neutral-100 group-hover:border-gmmi-gold/50 transition-colors h-16",
              }}
            />
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-neutral-100 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-gmmi-gold animate-pulse"></div>
            <p className="text-gmmi-navy text-sm font-black uppercase tracking-widest">
              {filteredPengumuman.length} Pengumuman Aktif
            </p>
          </div>
        </div>

        {/* Pengumuman List */}
        <div className="max-w-5xl mx-auto space-y-8">
          {loading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <Card
                  key={i}
                  className="p-10 space-y-4 rounded-[2.5rem]"
                  radius="lg"
                >
                  <Skeleton className="w-1/4 h-4 rounded-lg" />
                  <Skeleton className="w-full h-12 rounded-lg" />
                  <Skeleton className="w-1/2 h-4 rounded-lg" />
                </Card>
              ))
          ) : filteredPengumuman.length > 0 ? (
            filteredPengumuman.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="p-10 hover:shadow-2xl transition-all border border-neutral-100 group bg-white hover:border-gmmi-gold/20 overflow-hidden relative rounded-[3rem]"
                  radius="lg"
                >
                  <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 group-hover:rotate-12 transition-transform duration-700">
                    <ScrollText size={180} />
                  </div>

                  <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex flex-col items-center justify-center p-6 bg-gmmi-navy text-white rounded-[2rem] min-w-[120px] shadow-xl shadow-gmmi-navy/20">
                      <Calendar size={24} className="text-gmmi-gold mb-2" />
                      <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">
                        Update
                      </span>
                      <span className="text-xs font-bold">{item.tanggal}</span>
                    </div>

                    <div className="flex-grow space-y-4 pt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-px bg-gmmi-gold"></div>
                        <span className="text-[10px] font-black text-gmmi-gold uppercase tracking-[0.3em]">
                          Pengumuman Resmi
                        </span>
                      </div>
                      <p className="text-xl md:text-2xl text-gmmi-navy leading-relaxed font-medium">
                        "{item.isi}"
                      </p>
                    </div>

                    <div className="self-center md:self-auto pt-4 md:pt-0">
                      <div className="w-14 h-14 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-gmmi-gold group-hover:text-white transition-all shadow-inner group-hover:shadow-gmmi-gold/40 group-hover:scale-110">
                        <ChevronRight size={24} />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-32 bg-white rounded-[4rem] border border-neutral-100 shadow-sm leading-none">
              <div className="bg-neutral-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
                <ScrollText className="w-10 h-10 text-neutral-200" />
              </div>
              <h3 className="text-2xl font-bold text-gmmi-navy mb-3">
                Tidak ada pengumuman
              </h3>
              <p className="text-neutral-400">
                Belum ada pengumuman terbaru saat ini.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* CTA Section */}
      <section className="py-24 container mx-auto px-6">
        <Card className="bg-gmmi-gold p-16 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-gmmi-gold/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-20 opacity-10 rotate-45">
            <Sparkles size={200} className="text-gmmi-navy" />
          </div>
          <div className="relative z-10 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gmmi-navy tracking-tight">
              Tetap Terhubung dengan <br /> Kegiatan Gereja
            </h2>
            <p className="text-gmmi-navy/70 text-lg max-w-xl">
              Ikuti terus perkembangan pelayanan dan pengumuman terbaru melalui
              website resmi GMMI.
            </p>
          </div>
          <div className="relative z-10">
            <Link to="/#program">
              <div className="px-10 py-5 bg-gmmi-navy text-white rounded-2xl font-black uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-xl">
                Lihat Program Kerja
              </div>
            </Link>
          </div>
        </Card>
      </section>
      <Footer />
    </div>
  );
};

export default PengumumanPage;
