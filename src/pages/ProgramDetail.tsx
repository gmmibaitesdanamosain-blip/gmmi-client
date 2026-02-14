import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  getPrograms,
  exportExcel,
  exportWord,
} from "../services/program.service";
import type { Program } from "../services/program.service";
import {
  Card,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Skeleton,
  Divider,
  Chip,
} from "@heroui/react";
import {
  ArrowLeft,
  FileText,
  Download,
  Calendar,
  Info,
  Target,
} from "lucide-react";
import Navbar from "../components/partials/Navbar";
import Footer from "../components/partials/Footer";

const ProgramDetailPage: React.FC = () => {
  const { bidang } = useParams<{ bidang: string }>();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState<"excel" | "word" | null>(
    null,
  );

  useEffect(() => {
    const fetchPrograms = async () => {
      if (!bidang) return;
      try {
        const res = await getPrograms({ bidang });
        setPrograms(res || []);
      } catch (error) {
        console.error("Gagal mengambil data detail program:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, [bidang]);

  const handleExportExcel = async () => {
    if (!bidang) return;
    setExportLoading("excel");
    try {
      const blob = await exportExcel(bidang);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Program_Kerja_${bidang}.xlsx`;
      a.click();
    } catch (error) {
      console.error("Export Excel failed", error);
    } finally {
      setExportLoading(null);
    }
  };

  const handleExportWord = async () => {
    if (!bidang) return;
    setExportLoading("word");
    try {
      const blob = await exportWord(bidang);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Program_Kerja_${bidang}.docx`;
      a.click();
    } catch (error) {
      console.error("Export Word failed", error);
    } finally {
      setExportLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header Section */}
      <section className="relative pt-32 pb-48 overflow-hidden bg-gmmi-navy">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gmmi-gold/10 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-white/5 rounded-full blur-[120px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <Link
              to="/program"
              className="inline-flex items-center gap-2 text-gmmi-gold/80 hover:text-gmmi-gold transition-colors text-sm font-bold uppercase tracking-[0.3em]"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-end gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gmmi-gold">
                  <Target className="w-6 h-6" />
                  <span className="text-xs font-black uppercase tracking-[0.4em]">
                    Detail Rencana Kerja
                  </span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase">
                  {bidang}
                </h1>
              </div>

              <div className="flex gap-4">
                <Button
                  onPress={handleExportExcel}
                  isLoading={exportLoading === "excel"}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl h-14 px-8 backdrop-blur-md border border-white/10"
                  startContent={
                    !exportLoading && (
                      <Download size={20} className="text-gmmi-gold" />
                    )
                  }
                >
                  Export Excel
                </Button>
                <Button
                  onPress={handleExportWord}
                  isLoading={exportLoading === "word"}
                  className="bg-gmmi-gold text-gmmi-navy font-bold rounded-2xl h-14 px-8 hover:bg-yellow-400 transition-all shadow-xl shadow-gmmi-gold/20"
                  startContent={!exportLoading && <FileText size={20} />}
                >
                  Export Word
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="container mx-auto px-6 -mt-32 relative z-20 pb-32">
        <Card className="p-8 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border-none bg-white">
          <Table
            aria-label="Tabel Program Kerja"
            className="min-h-[400px]"
            classNames={{
              th: "bg-neutral-50 text-gmmi-navy font-black text-[10px] uppercase tracking-[0.2em] py-6 px-8 border-none",
              td: "py-6 px-8 text-neutral-600 font-light",
              wrapper: "shadow-none p-0",
            }}
          >
            <TableHeader>
              <TableColumn>PROGRAM</TableColumn>
              <TableColumn>SUB BIDANG</TableColumn>
              <TableColumn>JENIS KEGIATAN</TableColumn>
              <TableColumn>PELAKSANAAN</TableColumn>
              <TableColumn>BIAYA</TableColumn>
              <TableColumn>KETERANGAN</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={
                loading ? null : "Belum ada data program untuk bidang ini."
              }
              items={programs}
            >
              {loading
                ? Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="w-4/5 h-4 rounded-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="w-1/2 h-4 rounded-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="w-full h-4 rounded-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="w-1/2 h-4 rounded-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="w-1/3 h-4 rounded-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="w-2/3 h-4 rounded-full" />
                        </TableCell>
                      </TableRow>
                    ))
                : (item) => (
                    <TableRow
                      key={item.id}
                      className="border-b border-neutral-50 last:border-none hover:bg-neutral-50/50 transition-colors"
                    >
                      <TableCell>
                        <span className="font-bold text-gmmi-navy text-lg tracking-tight">
                          {item.nama_program}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Chip
                          variant="flat"
                          className="bg-gmmi-navy/5 text-gmmi-navy font-bold text-[10px] uppercase px-3"
                        >
                          {item.sub_bidang || "Utama"}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs leading-relaxed">
                          {item.jenis_kegiatan}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gmmi-gold" />
                          <span className="text-xs font-bold uppercase">
                            {item.waktu_pelaksanaan}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-black text-gmmi-navy">
                          {Number(item.rencana_biaya) > 0
                            ? `Rp ${Number(item.rencana_biaya).toLocaleString("id-ID")}`
                            : "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs text-xs italic text-neutral-400">
                          {item.keterangan || "-"}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
            </TableBody>
          </Table>
        </Card>

        {/* Footer Info */}
        <div className="mt-16 bg-neutral-50 rounded-[2.5rem] p-12 flex flex-col md:flex-row justify-between items-center gap-8 border border-neutral-100">
          <div className="flex items-center gap-6">
            <div className="bg-gmmi-gold/10 p-4 rounded-2xl text-gmmi-gold">
              <Info size={32} />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-gmmi-navy">
                Informasi Tambahan
              </h4>
              <p className="text-neutral-500 font-light">
                Seluruh anggaran yang tertera merupakan estimasi awal rencana
                kerja tahunan.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-10">
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
                Total Program
              </p>
              <p className="text-3xl font-black text-gmmi-navy">
                {programs.length}
              </p>
            </div>
            <Divider orientation="vertical" className="h-12" />
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
                Total Anggaran
              </p>
              <p className="text-3xl font-black text-gmmi-gold">
                Rp{" "}
                {programs
                  .reduce(
                    (acc, curr) => acc + Number(curr.rencana_biaya || 0),
                    0,
                  )
                  .toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProgramDetailPage;
