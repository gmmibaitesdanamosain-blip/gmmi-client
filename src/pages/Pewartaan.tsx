import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getWarta } from "../services/dashboard.services";
import { Card, Skeleton, Input } from "@heroui/react";
import { Megaphone, ChevronRight, Search, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/partials/Navbar";
import Footer from "../components/partials/Footer";
import HeroHeader from "../components/HeroHeader";

type Warta = {
  id: string;
  judul: string;
  tempat_jemaat: string;
  tanggal_ibadah: string;
  tema_khotbah: string;
};

const Pewartaan: React.FC = () => {
  const [warta, setWarta] = useState<Warta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchWarta = async () => {
      try {
        const res = await getWarta();
        setWarta(res?.data || []);
      } catch (error) {
        console.error("Gagal mengambil data warta:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWarta();
  }, []);

  const filteredWarta = warta.filter(
    (item) =>
      item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tema_khotbah.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header Section */}
      <HeroHeader
        title="Warta Jemaat"
        subtitle="Informasi terkini mengenai kegiatan, pelayanan, dan berita terbaru dari keluarga besar Gereja Masehi Musafir Indonesia."
        breadcrumbLabel="Kembali ke Beranda"
        breadcrumbLink="/"
      />

      <main className="container mx-auto px-6 py-16">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <Input
            isClearable
            className="w-full md:max-w-md"
            placeholder="Cari warta atau tema khotbah..."
            startContent={<Search className="text-neutral-400" size={18} />}
            value={searchTerm}
            onValueChange={setSearchTerm}
            size="lg"
            radius="full"
          />
          <p className="text-neutral-400 text-sm font-medium">
            Menampilkan {filteredWarta.length} warta terbaru
          </p>
        </div>

        {/* Warta Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(6)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="p-8 space-y-4 rounded-3xl" radius="lg">
                  <Skeleton className="w-1/3 h-4 rounded-lg" />
                  <Skeleton className="w-full h-8 rounded-lg" />
                  <Skeleton className="w-full h-24 rounded-lg" />
                </Card>
              ))
          ) : filteredWarta.length > 0 ? (
            filteredWarta.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  as={Link}
                  to={`/pewartaan/${item.id}`}
                  className="p-8 hover:shadow-2xl transition-all border border-neutral-100 group bg-white hover:border-gmmi-gold/30 hover:-translate-y-2 duration-500 rounded-[2.5rem]"
                  radius="lg"
                  isPressable
                >
                  <div className="flex flex-col h-full space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="px-4 py-1.5 bg-gmmi-navy text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                        {new Date(item.tanggal_ibadah).toLocaleDateString(
                          "id-ID",
                          { day: "numeric", month: "long", year: "numeric" },
                        )}
                      </div>
                      <div className="p-2 bg-gmmi-gold/10 rounded-xl text-gmmi-gold">
                        <Megaphone size={18} />
                      </div>
                    </div>

                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold text-gmmi-navy group-hover:text-gmmi-gold transition-colors leading-tight mb-4">
                        {item.judul}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-neutral-500 text-sm italic font-light">
                          <MapPin size={14} className="text-gmmi-gold" />
                          {item.tempat_jemaat}
                        </div>
                        <p className="text-neutral-400 text-sm line-clamp-3 leading-relaxed font-light">
                          Tema: {item.tema_khotbah}
                        </p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-neutral-50 flex items-center justify-between group">
                      <span className="text-xs font-bold text-gmmi-navy uppercase tracking-widest underline decoration-gmmi-gold/30 decoration-2 underline-offset-4">
                        Baca Selengkapnya
                      </span>
                      <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center group-hover:bg-gmmi-gold group-hover:text-white transition-all">
                        <ChevronRight size={18} />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-32 bg-neutral-50 rounded-[3.5rem] border-2 border-dashed border-neutral-200">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Megaphone className="w-10 h-10 text-neutral-200" />
              </div>
              <h3 className="text-xl font-bold text-gmmi-navy mb-2">
                Belum ada warta
              </h3>
              <p className="text-neutral-400 max-w-xs mx-auto">
                Kami akan segera memperbarui informasi warta untuk Anda.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer Background Decoration */}
      <div className="h-64 bg-gradient-to-t from-neutral-50 to-white w-full"></div>
      <Footer />
    </div>
  );
};

export default Pewartaan;
