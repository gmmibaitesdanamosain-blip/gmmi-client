import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllRenungan } from "../services/renungan.service";
import { Card, Skeleton, Input, Image } from "@heroui/react";
import { BookOpen, Search, Calendar, ChevronRight, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/partials/Navbar";
import Footer from "../components/partials/Footer";
import HeroHeader from "../components/HeroHeader";

type RenunganData = {
  id: number;
  judul: string;
  isi: string;
  tanggal: string;
  gambar: string | null;
};

const Renungan: React.FC = () => {
  const [renunganList, setRenunganList] = useState<RenunganData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRenungan = async () => {
      try {
        const data = await getAllRenungan();
        setRenunganList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch renungan", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRenungan();
  }, []);

  const filteredRenungan = renunganList.filter(
    (item) =>
      item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.isi || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-neutral-50/50 font-sans">
      <Navbar />

      {/* Header Section */}
      <HeroHeader
        title="Renungan Mingguan"
        subtitle="Temukan kekuatan baru dan inspirasi rohani melalui firman Tuhan yang disajikan setiap minggu untuk pertumbuhan iman Anda."
        breadcrumbLabel="Kembali ke Beranda"
        breadcrumbLink="/"
      />

      <main className="container mx-auto px-6 -mt-16 relative z-20 pb-24">
        {/* Search & Stats Card */}
        <Card className="p-4 md:p-6 rounded-[2.5rem] bg-white/80 backdrop-blur-xl shadow-2xl shadow-gmmi-navy/5 border border-white/50 mb-16 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Input
              isClearable
              placeholder="Cari judul atau topik renungan..."
              startContent={
                <Search className="text-gmmi-gold ml-2" size={20} />
              }
              value={searchTerm}
              onValueChange={setSearchTerm}
              size="lg"
              radius="full"
              variant="flat"
              classNames={{
                inputWrapper:
                  "bg-neutral-50 hover:bg-neutral-100 transition-colors h-14",
              }}
              className="w-full"
            />
            <div className="flex items-center gap-3 px-6 py-2 bg-gmmi-navy text-white rounded-full shrink-0 h-14 shadow-lg shadow-gmmi-navy/20">
              <BookOpen size={18} className="text-gmmi-gold" />
              <span className="font-bold text-sm whitespace-nowrap">
                {filteredRenungan.length} Renungan
              </span>
            </div>
          </div>
        </Card>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {loading ? (
            Array(6)
              .fill(0)
              .map((_, i) => (
                <Card
                  key={i}
                  className="rounded-[2.5rem] overflow-hidden bg-white border border-neutral-100 shadow-sm h-[420px]"
                >
                  <Skeleton className="w-full h-[220px]" />
                  <div className="p-8 space-y-4">
                    <Skeleton className="w-1/3 h-4 rounded-full" />
                    <Skeleton className="w-full h-8 rounded-lg" />
                    <Skeleton className="w-full h-20 rounded-lg" />
                  </div>
                </Card>
              ))
          ) : filteredRenungan.length > 0 ? (
            filteredRenungan.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  as={Link}
                  to={`/renungan/${item.id}`}
                  className="h-full group hover:shadow-[0_25px_50px_-12px_rgba(212,175,55,0.15)] transition-all duration-500 border border-neutral-100 bg-white rounded-[2.5rem] overflow-hidden hover:-translate-y-2 flex flex-col"
                  isPressable
                >
                  {/* Image Section */}
                  <div className="relative h-[240px] overflow-hidden shrink-0">
                    {item.gambar ? (
                      <Image
                        src={item.gambar}
                        alt={item.judul}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000"
                        radius="none"
                        removeWrapper
                        width="100%"
                        height="100%"
                      />
                    ) : (
                      <div className="w-full h-full bg-gmmi-navy flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-gmmi-navy to-purple-900"></div>
                        <div className="absolute -bottom-10 -right-10 text-white/5 rotate-12">
                          <Quote size={150} />
                        </div>
                        <Quote
                          size={48}
                          className="text-gmmi-gold relative z-10"
                        />
                      </div>
                    )}

                    {/* Date Badge */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest text-gmmi-navy shadow-lg flex items-center gap-2">
                        <Calendar size={12} className="text-gmmi-gold" />
                        {new Date(item.tanggal).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 flex flex-col flex-grow justify-between">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-gmmi-navy group-hover:text-gmmi-gold transition-colors line-clamp-2 leading-tight">
                        {item.judul}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 font-light">
                        {item.isi}
                      </p>
                    </div>

                    <div className="pt-8 mt-auto flex items-center justify-between group/btn">
                      <span className="text-xs font-bold text-gmmi-gold uppercase tracking-widest group-hover/btn:underline decoration-2 underline-offset-4 transition-all">
                        Baca Selengkapnya
                      </span>
                      <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-gmmi-navy group-hover:bg-gmmi-navy group-hover:text-gmmi-gold transition-all duration-300 shadow-sm">
                        <ChevronRight size={18} />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-dashed border-neutral-200">
              <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-300">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-gmmi-navy mb-2">
                Renungan tidak ditemukan
              </h3>
              <p className="text-slate-400">
                Coba cari dengan kata kunci lain.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Renungan;
