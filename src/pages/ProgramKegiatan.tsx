import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getPrograms } from "../services/program.service";
import type { Program } from "../services/program.service";
import { Card, Skeleton, Input } from "@heroui/react";
import {
  BookOpen,
  ChevronRight,
  Search,
  Sparkles,
  Target,
  Activity,
  Users,
  FileText,
  LayoutDashboard,
  Home as HomeIcon,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/partials/Navbar";
import Footer from "../components/partials/Footer";
import HeroHeader from "../components/HeroHeader";

const BIDANG_ICONS: Record<string, React.ReactNode> = {
  Sekretariat: <FileText size={24} />,
  Penatalayanan: <LayoutDashboard size={24} />,
  Kategorial: <Users size={24} />,
  "Pemberdayaan Jemaat": <Activity size={24} />,
  "Rumah Tangga, Sarana, dan Prasarana": <HomeIcon size={24} />,
  BP2K2: <ShieldCheck size={24} />,
  Kebendaharaan: <Wallet size={24} />,
};

const ProgramKegiatanPage: React.FC = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await getPrograms();
        setPrograms(res || []);
      } catch (error) {
        console.error("Gagal mengambil data program:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const filteredPrograms = programs.filter(
    (item) =>
      item.nama_program.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bidang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jenis_kegiatan.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Group by Bidang
  const groupedPrograms = filteredPrograms.reduce(
    (acc, curr) => {
      if (!acc[curr.bidang]) acc[curr.bidang] = [];
      acc[curr.bidang].push(curr);
      return acc;
    },
    {} as Record<string, Program[]>,
  );

  const handleNavigateToDetail = (bidang: string) => {
    navigate(`/program/${encodeURIComponent(bidang)}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header Section */}
      <HeroHeader
        title="Program & Aksi Nyata"
        subtitle="Mewujudkan visi gereja melalui berbagai bidang pelayanan untuk pertumbuhan iman dan kesejahteraan jemaat GMMI."
        breadcrumbLabel="Kembali ke Beranda"
        breadcrumbLink="/"
      />

      <main className="container mx-auto px-6 -mt-16 relative z-20 pb-32">
        {/* Search & Filter */}
        <Card className="p-3 rounded-[2.5rem] shadow-2xl border-none mb-20 max-w-5xl mx-auto bg-white">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              isClearable
              className="w-full"
              placeholder="Cari nama program atau bidang..."
              startContent={
                <Search className="text-gmmi-gold ml-2" size={24} />
              }
              value={searchTerm}
              onValueChange={setSearchTerm}
              size="lg"
              radius="full"
              variant="flat"
              classNames={{
                inputWrapper: "bg-neutral-100 h-16 text-lg group-data-[focus=true]:bg-white group-data-[focus=true]:border-gmmi-navy transition-all border-2 border-transparent",
                input: "text-gmmi-navy placeholder:text-slate-400 font-medium",
              }}
            />
            <div className="flex items-center gap-4 px-8 bg-neutral-100 rounded-full shrink-0">
              <span className="text-gmmi-navy font-black text-xs uppercase tracking-widest">
                {Object.keys(groupedPrograms).length} Bidang Terkait
              </span>
            </div>
          </div>
        </Card>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            Array(6)
              .fill(0)
              .map((_, i) => (
                <Card
                  key={i}
                  className="p-10 rounded-[3rem] border border-neutral-100 h-[300px] flex flex-col justify-between"
                  radius="lg"
                >
                  <div className="space-y-4">
                    <Skeleton className="w-1/3 h-6 rounded-full" />
                    <Skeleton className="w-full h-10 rounded-xl" />
                    <Skeleton className="w-full h-20 rounded-2xl" />
                  </div>
                  <Skeleton className="w-full h-12 rounded-2xl" />
                </Card>
              ))
          ) : Object.keys(groupedPrograms).length > 0 ? (
            Object.entries(groupedPrograms).map(([bidang, progs], index) => (
              <motion.div
                key={bidang}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  isPressable
                  onPress={() => handleNavigateToDetail(bidang)}
                  className="p-10 hover:shadow-[0_50px_100px_-20px_rgba(212,175,55,0.15)] transition-all duration-700 bg-white border border-neutral-100 rounded-[3.5rem] group h-full flex flex-col justify-between"
                  radius="lg"
                >
                  <div className="space-y-8 w-full text-left">
                    <div className="flex justify-between items-start">
                      <div className="px-5 py-2 bg-gmmi-navy text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-gmmi-navy/10 group-hover:bg-gmmi-gold transition-colors">
                        {progs.length} Program
                      </div>
                      <div className="w-14 h-14 bg-neutral-50 rounded-[1.5rem] flex items-center justify-center text-neutral-400 group-hover:bg-gmmi-gold/10 group-hover:text-gmmi-gold transition-all duration-500 group-hover:scale-110">
                        {BIDANG_ICONS[bidang] || <Target size={24} />}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-3xl font-bold text-gmmi-navy group-hover:text-gmmi-gold transition-colors leading-tight tracking-tight">
                        {bidang}
                      </h3>
                      <p className="text-neutral-400 text-sm font-light leading-relaxed">
                        Klik untuk melihat detail seluruh rencana kerja di
                        bidang {bidang.toLowerCase()}.
                      </p>
                    </div>
                  </div>

                  <div className="pt-8 flex items-center justify-between w-full">
                    <div className="flex -space-x-3">
                      {progs.slice(0, 3).map((_, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full bg-neutral-100 border-2 border-white flex items-center justify-center text-gmmi-gold shadow-sm"
                        >
                          <Sparkles size={14} />
                        </div>
                      ))}
                      {progs.length > 3 && (
                        <div className="w-10 h-10 rounded-full bg-gmmi-navy border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                          +{progs.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gmmi-gold font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2">
                      Buka Detail <ChevronRight size={14} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-40">
              <div className="w-32 h-32 bg-neutral-50 rounded-[4rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                <BookOpen size={48} className="text-neutral-200" />
              </div>
              <h3 className="text-3xl font-bold text-gmmi-navy mb-4">
                Program tidak ditemukan
              </h3>
              <p className="text-slate-400 max-w-md mx-auto text-lg font-light leading-relaxed">
                Silakan cari dengan kata kunci lain atau lihat program kami yang
                tersedia.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Bidang Pelayanan */}
      <section className="bg-neutral-50 py-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-32 opacity-[0.03] rotate-12">
          <Sparkles size={400} />
        </div>
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gmmi-navy tracking-tight">
              Arah Pelayanan
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto font-light">
              Fokus utama pelayanan GMMI dalam mewujudkan gereja yang berdampak.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Pewartaan",
                desc: "Menyebarluaskan Firman Tuhan melalui berbagai kanal komunikasi.",
                color: "bg-blue-500",
                icon: <FileText size={20} />,
              },
              {
                title: "Persekutuan",
                desc: "Membangun relasi antar jemaat yang berakar pada kasih Kristus.",
                color: "bg-purple-500",
                icon: <Users size={20} />,
              },
              {
                title: "Pelayanan",
                desc: "Aksi nyata kepedulian sosial untuk sesama yang membutuhkan.",
                color: "bg-emerald-500",
                icon: <Activity size={20} />,
              },
              {
                title: "Penatalayanan",
                desc: "Manajemen dan pengelolaan sumber daya gereja yang akuntabel.",
                color: "bg-gmmi-gold",
                icon: <LayoutDashboard size={20} />,
              },
            ].map((bid, i) => (
              <Card
                key={i}
                className="p-10 rounded-[3rem] border-none shadow-xl hover:shadow-2xl transition-all duration-500 group"
              >
                <div
                  className={`w-12 h-12 ${bid.color} rounded-2xl mb-8 flex items-center justify-center text-white shadow-lg`}
                >
                  {bid.icon}
                </div>
                <h4 className="text-2xl font-bold text-gmmi-navy mb-4">
                  {bid.title}
                </h4>
                <p className="text-slate-500 font-light leading-relaxed">
                  {bid.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProgramKegiatanPage;
