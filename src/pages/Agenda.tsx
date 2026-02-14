import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    getJadwal
} from '../services/dashboard.services';
import {
    Card,
    Skeleton,
    Input
} from "@heroui/react";
import {
    Calendar,
    Clock,
    MapPin,
    ChevronRight,
    Search,
    Sparkles,
    User
} from 'lucide-react';
import Navbar from '../components/partials/Navbar';
import Footer from '../components/partials/Footer';
import HeroHeader from '../components/HeroHeader';


type Jadwal = {
    id: string;
    judul: string;
    tanggal: string;
    waktu: string;
    lokasi: string;
    penanggung_jawab: string;
    status: string;
};

const AgendaPage: React.FC = () => {
    const [jadwal, setJadwal] = useState<Jadwal[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchJadwal = async () => {
            try {
                const data = await getJadwal();
                setJadwal(data?.data || []);
            } catch (error) {
                console.error("Gagal mengambil data jadwal:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJadwal();
    }, []);

    const filteredJadwal = jadwal
        .filter(item => item.status === 'aktif') // Only show active items
        .filter(item =>
            item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.lokasi.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Header Section */}
            <HeroHeader
                title="Agenda & Jadwal"
                subtitle="Temukan informasi lengkap mengenai jadwal ibadah raya, kegiatan kategorial, dan agenda pelayanan GMMI."
                breadcrumbLabel="Beranda"
                breadcrumbLink="/"
            />

            <main className="container mx-auto px-6 -mt-12 relative z-20 pb-24">
                {/* Search Bar Premium */}
                <Card className="p-2 rounded-[2rem] shadow-2xl border-none mb-16 max-w-4xl mx-auto">
                    <Input
                        isClearable
                        className="w-full"
                        placeholder="Cari agenda atau lokasi kegiatan..."
                        startContent={<Search className="text-gmmi-gold ml-4" size={24} />}
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                        size="lg"
                        radius="full"
                        variant="flat"
                        classNames={{
                            inputWrapper: "bg-transparent h-16 text-lg"
                        }}
                    />
                </Card>

                {/* Timeline Grid */}
                <div className="max-w-6xl mx-auto">
                    {loading ? (
                        <div className="space-y-8">
                            {Array(4).fill(0).map((_, i) => (
                                <Card key={i} className="p-10 rounded-[3rem] border border-neutral-100" radius="lg">
                                    <div className="flex flex-col md:flex-row gap-10">
                                        <Skeleton className="w-32 h-32 rounded-[2rem] shrink-0" />
                                        <div className="space-y-4 w-full pt-4">
                                            <Skeleton className="w-1/4 h-4 rounded-lg" />
                                            <Skeleton className="w-3/4 h-8 rounded-lg" />
                                            <Skeleton className="w-1/2 h-4 rounded-lg" />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : filteredJadwal.length > 0 ? (
                        <div className="space-y-10 relative">
                            {/* Vertical Line Decoration */}
                            <div className="absolute left-[60px] top-10 bottom-10 w-px bg-neutral-100 hidden lg:block"></div>

                            {filteredJadwal.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card
                                        className="p-1 group hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 bg-white border border-neutral-100 rounded-[3.5rem] overflow-hidden"
                                        radius="lg"
                                    >
                                        <div className="flex flex-col lg:flex-row items-center p-8 gap-10">
                                            {/* Date Box */}
                                            <div className="w-36 h-36 bg-gmmi-navy rounded-[2.5rem] flex flex-col items-center justify-center text-white shrink-0 shadow-2xl shadow-gmmi-navy/20 relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                                <div className="absolute top-0 left-0 w-full h-1 bg-gmmi-gold"></div>
                                                <span className="text-4xl font-black">{new Date(item.tanggal).getDate()}</span>
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gmmi-gold">
                                                    {new Date(item.tanggal).toLocaleDateString('id-ID', { month: 'short' })}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 mt-1">{new Date(item.tanggal).getFullYear()}</span>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-grow space-y-6 text-center lg:text-left">
                                                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-neutral-50 rounded-full text-[10px] font-black text-gmmi-navy uppercase tracking-widest border border-neutral-100">
                                                        <Clock size={12} className="text-gmmi-gold" />
                                                        {item.waktu} WIB
                                                    </div>
                                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-neutral-50 rounded-full text-[10px] font-black text-gmmi-navy uppercase tracking-widest border border-neutral-100">
                                                        <MapPin size={12} className="text-gmmi-gold" />
                                                        {item.lokasi}
                                                    </div>
                                                </div>

                                                <h3 className="text-3xl font-bold text-gmmi-navy group-hover:text-gmmi-gold transition-colors leading-tight tracking-tight">
                                                    {item.judul}
                                                </h3>

                                                <div className="flex flex-col md:flex-row items-center justify-center lg:justify-between gap-6 pt-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center border border-neutral-100">
                                                            <User size={16} className="text-neutral-400" />
                                                        </div>
                                                        <div className="flex flex-col text-left">
                                                            <span className="text-[8px] font-black text-neutral-300 uppercase tracking-widest">Penanggung Jawab</span>
                                                            <span className="text-sm font-bold text-neutral-500">{item.penanggung_jawab || "Majelis Jemaat"}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-12 h-12 rounded-2xl bg-gmmi-gold/10 flex items-center justify-center text-gmmi-gold group-hover:bg-gmmi-gold group-hover:text-white transition-all cursor-pointer">
                                                            <ChevronRight size={24} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-40">
                            <div className="w-32 h-32 bg-neutral-50 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
                                <Calendar size={48} className="text-neutral-200" />
                            </div>
                            <h3 className="text-3xl font-bold text-gmmi-navy mb-4">Agenda tidak ditemukan</h3>
                            <p className="text-slate-400 max-w-md mx-auto text-lg font-light">
                                Coba gunakan kata kunci pencarian lain atau kembali lagi nanti.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {/* Support Box */}
            <section className="bg-neutral-50 py-32">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="p-10 rounded-[3rem] border-none shadow-xl bg-white space-y-6">
                            <div className="w-16 h-16 bg-gmmi-gold/10 rounded-2xl flex items-center justify-center text-gmmi-gold">
                                <Clock size={32} />
                            </div>
                            <h4 className="text-2xl font-bold text-gmmi-navy">Tepat Waktu</h4>
                            <p className="text-slate-500 font-light leading-relaxed">
                                Mohon hadir 15 menit sebelum kegiatan dimulai untuk mempersiapkan hati dalam persekutuan.
                            </p>
                        </Card>
                        <Card className="p-10 rounded-[3rem] border-none shadow-xl bg-white space-y-6">
                            <div className="w-16 h-16 bg-gmmi-navy/5 rounded-2xl flex items-center justify-center text-gmmi-navy">
                                <MapPin size={32} />
                            </div>
                            <h4 className="text-2xl font-bold text-gmmi-navy">Lokasi Kegiatan</h4>
                            <p className="text-slate-500 font-light leading-relaxed">
                                Sebagian besar kegiatan dilaksanakan di Gedung Gereja GMMI, kecuali disebutkan lokasi lain.
                            </p>
                        </Card>
                        <Card className="p-10 rounded-[3rem] border-none shadow-xl bg-white space-y-6">
                            <div className="w-16 h-16 bg-gmmi-gold/10 rounded-2xl flex items-center justify-center text-gmmi-gold">
                                <Sparkles size={32} />
                            </div>
                            <h4 className="text-2xl font-bold text-gmmi-navy">Informasi Tambahan</h4>
                            <p className="text-slate-500 font-light leading-relaxed">
                                Hubungi sekretariat gereja jika Anda memerlukan informasi lebih detail mengenai agenda tersebut.
                            </p>
                        </Card>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};


export default AgendaPage;
