import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardBody, Button, Skeleton, Chip } from "@heroui/react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  BookOpen,
  Music,
  Heart,
  Users,
  Info,
  Clock,
  User,
  Phone,
} from "lucide-react";
import { getPewartaanById } from "../services/pewartaan.service";
import Navbar from "../components/partials/Navbar";
import Footer from "../components/partials/Footer";

const PewartaanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchDetail(parseInt(id));
    }
  }, [id]);

  const fetchDetail = async (wartaId: number) => {
    try {
      const res = await getPewartaanById(wartaId);
      if (res.success) {
        setData(res.data);
      }
    } catch (error) {
      console.error("Gagal mengambil detail warta:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container mx-auto px-6 pt-32 pb-20 space-y-8">
          <Skeleton className="h-12 w-3/4 rounded-xl" />
          <Skeleton className="h-64 w-full rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-6 pt-40 text-center">
          <h2 className="text-2xl font-bold text-gmmi-navy">
            Warta tidak ditemukan
          </h2>
          <Button className="mt-4" onClick={() => navigate("/pewartaan")}>
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />

      {/* Premium Header */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gmmi-navy">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gmmi-gold/10 -skew-x-12 translate-x-1/2"></div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Link
              to="/pewartaan"
              className="inline-flex items-center gap-2 text-gmmi-gold/80 hover:text-gmmi-gold transition-colors text-sm font-bold uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Warta
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight max-w-4xl">
              {data.judul}
            </h1>
            <div className="flex flex-wrap gap-4 items-center pt-2">
              <Chip
                startContent={<Calendar size={14} />}
                variant="flat"
                className="bg-white/10 text-white border-white/20"
              >
                {data.hari}, {formatDate(data.tanggal_ibadah)}
              </Chip>
              <Chip
                startContent={<MapPin size={14} />}
                variant="flat"
                className="bg-gmmi-gold/20 text-gmmi-gold border-gmmi-gold/30 underline decoration-gmmi-gold/30"
              >
                {data.tempat_jemaat}
              </Chip>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="container mx-auto px-6 -mt-10 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Theme Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-4">
                <CardBody className="p-8 space-y-6">
                  <div className="flex items-center gap-3 text-gmmi-gold">
                    <BookOpen size={24} />
                    <h3 className="text-xl font-bold uppercase tracking-widest text-gmmi-navy">
                      Thema Khotbah
                    </h3>
                  </div>
                  <h2 className="text-3xl font-serif italic font-bold text-gmmi-navy leading-relaxed">
                    "{data.tema_khotbah}"
                  </h2>
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 italic text-slate-600">
                    <p className="font-bold text-gmmi-gold mb-2 uppercase tracking-widest text-[10px]">
                      Ayat Firman Tuhan
                    </p>
                    <p className="text-lg">{data.ayat_firman}</p>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Tata Ibadah Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
                  <Music size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gmmi-navy">
                  Tata Ibadah
                </h3>
              </div>
              <div className="space-y-4">
                {data.tata_ibadah?.map((item: any, idx: number) => (
                  <motion.div
                    key={item.id || idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-all">
                      <CardBody className="p-6">
                        <div className="flex gap-6 items-start">
                          <div className="w-10 h-10 rounded-full bg-gmmi-navy text-white flex items-center justify-center font-bold shrink-0">
                            {item.urutan}
                          </div>
                          <div className="flex-grow space-y-3">
                            <div className="flex justify-between items-start">
                              <h4 className="text-xl font-bold text-gmmi-navy">
                                {item.nama_bagian}
                              </h4>
                              {item.keterangan && (
                                <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
                                  {item.keterangan}
                                </span>
                              )}
                            </div>
                            {item.judul_pujian && (
                              <div className="flex items-center gap-2 text-gmmi-gold font-bold italic">
                                <Music size={14} />
                                <span>{item.judul_pujian}</span>
                              </div>
                            )}
                            {item.isi_konten && (
                              <p className="text-slate-600 leading-relaxed whitespace-pre-line font-light">
                                {item.isi_konten}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Pokok Doa */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                  <Heart size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gmmi-navy">
                  Pokok Doa Syafaat
                </h3>
              </div>
              <Card className="rounded-[2.5rem] border border-neutral-100 shadow-sm">
                <CardBody className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.pokok_doa?.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex gap-4 items-start p-4 hover:bg-slate-50 rounded-2xl transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-gmmi-gold mt-2 shrink-0"></div>
                      <div>
                        <p className="font-bold text-gmmi-navy uppercase tracking-tighter">
                          {item.kategori}
                        </p>
                        <p className="text-slate-500 text-sm font-light">
                          {item.keterangan}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardBody>
              </Card>
            </section>
          </div>

          {/* Right Column: Information Tables */}
          <div className="lg:col-span-4 space-y-8">
            {/* Info Jemaat Summary */}
            <Card className="rounded-[2.5rem] bg-gmmi-navy text-white p-4 shadow-2xl">
              <CardBody className="p-6 space-y-8">
                <div className="flex items-center gap-3">
                  <Users className="text-gmmi-gold" size={24} />
                  <h3 className="text-xl font-bold tracking-tight">
                    Keluarga Jemaat
                  </h3>
                </div>

                <div className="space-y-6">
                  {/* Jemaat Ultah */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gmmi-gold">
                      HUT Minggu Ini
                    </p>
                    {data.jemaat_ultah?.length > 0 ? (
                      data.jemaat_ultah.map((j: any, i: number) => (
                        <div
                          key={i}
                          className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/10"
                        >
                          <span className="font-medium text-sm">
                            {j.nama_jemaat}
                          </span>
                          <span className="text-[10px] opacity-60 italic">
                            {j.tanggal
                              ? new Date(j.tanggal).getDate()
                              : ""}{" "}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-white/40 italic">
                        Tidak ada data.
                      </p>
                    )}
                  </div>

                  {/* Sakit/Pemulihan/Lansia Simplified */}
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    {["jemaat_sakit", "pemulihan", "lansia"].map((key) => (
                      <div key={key}>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gmmi-gold mb-2">
                          {key.replace("_", " ")}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {data[key]?.length > 0 ? (
                            data[key].map((j: any, i: number) => (
                              <Chip
                                key={i}
                                size="sm"
                                variant="flat"
                                className="bg-white/10 text-white text-[10px]"
                              >
                                {j.nama_jemaat}
                              </Chip>
                            ))
                          ) : (
                            <span className="text-[10px] text-white/40 italic">
                              Tidak ada data.
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Pelayanan Sektor Table */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                  <Clock size={20} />
                </div>
                <h4 className="font-bold text-gmmi-navy">Pelayanan Sektor</h4>
              </div>
              <div className="space-y-3">
                {data.pelayanan_sektor?.map((s: any, i: number) => (
                  <Card
                    key={i}
                    className="rounded-3xl border border-neutral-100 shadow-sm overflow-hidden group"
                  >
                    <div className="bg-gmmi-navy p-3 flex justify-between items-center group-hover:bg-gmmi-gold transition-colors duration-500">
                      <span className="text-xs font-black text-white uppercase tracking-widest">
                        Sektor {s.nomor_sektor}
                      </span>
                      <div className="flex gap-2">
                        {s.nomor_hp && (
                          <a
                            href={`https://wa.me/${s.nomor_hp}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-white hover:text-gmmi-navy"
                          >
                            <Phone size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                    <CardBody className="p-4 text-sm space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400 text-[10px] font-bold uppercase">
                          Tempat
                        </span>
                        <span className="font-bold text-gmmi-navy">
                          {s.tempat}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400 text-[10px] font-bold uppercase">
                          Pemimpin
                        </span>
                        <span className="font-medium text-slate-600">
                          {s.pemimpin}
                        </span>
                      </div>
                      {s.liturgos && (
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-400 text-[10px] font-bold uppercase">
                            Liturgos
                          </span>
                          <span className="font-medium text-slate-600">
                            {s.liturgos}
                          </span>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </div>
            </section>

            {/* Pelayanan Kategorial Table */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                  <Users size={20} />
                </div>
                <h4 className="font-bold text-gmmi-navy">
                  Pelayanan Kategorial
                </h4>
              </div>
              <div className="space-y-3">
                {data.pelayanan_kategorial?.map((k: any, i: number) => (
                  <Card
                    key={i}
                    className="rounded-3xl border border-neutral-100 shadow-sm"
                  >
                    <CardBody className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <p className="font-black text-gmmi-navy uppercase tracking-tighter text-sm">
                          {k.kategori_pelayanan}
                        </p>
                        <Chip
                          size="sm"
                          variant="flat"
                          color="success"
                          className="text-[8px] h-5"
                        >
                          {k.tempat}
                        </Chip>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                          <Clock size={12} />
                          <span>
                            {new Date(k.tanggal_waktu).toLocaleString("id-ID", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                          <User size={12} />
                          <span>
                            {k.pemimpin} / {k.liturgos_petugas}
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </section>

            {/* Info Ibadah Table */}
            <section className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                    <Info size={20} />
                  </div>
                  <h4 className="font-bold text-gmmi-navy">
                    Jadwal Ibadah Lainnya
                  </h4>
                </div>
              </div>
              <div className="space-y-3">
                {data.info_ibadah?.map((ib: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-neutral-100"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex flex-col items-center justify-center shrink-0">
                      <span className="text-gmmi-navy font-black text-sm">
                        {new Date(ib.tanggal).getDate()}
                      </span>
                      <span className="text-[8px] text-neutral-400 font-bold uppercase">
                        {new Date(ib.tanggal).toLocaleString("id-ID", {
                          month: "short",
                        })}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-bold text-gmmi-navy">
                        {ib.jenis_ibadah}
                      </p>
                      <p className="text-[10px] text-neutral-400 italic font-light">
                        {ib.sektor ? `Sektor: ${ib.sektor}` : ""} • Pkl {ib.jam}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-500">
                        {ib.pemimpin}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* CTA Help */}
      <section className="bg-gmmi-navy py-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gmmi-gold/5 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-6 text-center relative z-10 space-y-6">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Butuh Informasi Lebih Lengkap?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Silakan hubungi sekretariat GMMI atau majelis jemaat untuk informasi
            pelayanan dan kegiatan lainnya.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button
              as="a"
              href="https://wa.me/your-church-number"
              target="_blank"
              className="bg-gmmi-gold text-gmmi-navy font-bold h-14 px-8 rounded-2xl"
              startContent={<Phone size={18} />}
            >
              Hubungi Sekretariat
            </Button>
            <Button
              onClick={() => navigate("/pewartaan")}
              variant="bordered"
              className="border-white/20 text-white font-bold h-14 px-8 rounded-2xl hover:bg-white/5"
            >
              Daftar Warta Lainnya
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PewartaanDetail;
