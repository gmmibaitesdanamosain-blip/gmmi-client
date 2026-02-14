import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
} from "@heroui/react";
import {
  Wallet,
  FileSpreadsheet,
  TrendingUp,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  getTransactions,
  exportTransactions,
} from "../services/keuangan.service";
import Navbar from "../components/partials/Navbar";
import HeroHeader from "../components/HeroHeader";

const Keuangan: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getTransactions(filter.startDate, filter.endDate);
      if (data && data.data) {
        setTransactions(data.data);
        setSummary(data.summary);
      }
    } catch (error) {
      console.error("Failed to fetch finance report", error);
    } finally {
      setLoading(false);
    }
  };

  const formatRp = (val: any) => {
    if (!val) return "Rp 0";
    return `Rp ${parseFloat(val).toLocaleString("id-ID")}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 font-sans">
      <Navbar />

      {/* Header Section */}
      <HeroHeader
        title="Laporan Keuangan Jemaat"
        subtitle="Wujud keterbukaan dan tanggung jawab dalam pengelolaan kasih karunia Tuhan melalui persembahan jemaat GMMI Pusat."
        breadcrumbLabel="Kembali ke Beranda"
        breadcrumbLink="/"
      />

      <main className="container mx-auto px-6 -mt-16 relative z-20 pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={itemVariants}>
              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl shadow-gmmi-navy/5 rounded-[2.5rem] overflow-hidden group">
                <CardBody className="p-8 md:p-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-4 bg-gmmi-navy text-gmmi-gold rounded-2xl shadow-xl">
                      <Wallet className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                        Update Terakhir
                      </span>
                      <span className="text-sm font-bold text-gmmi-navy">
                        Februari 2026
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">
                      Saldo Akhir Kas
                    </p>
                    <h3 className="text-4xl md:text-5xl font-black text-gmmi-navy tracking-tighter">
                      {formatRp(summary?.saldo_akhir_kas)}
                    </h3>
                  </div>
                  <div className="mt-8 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-2 text-emerald-500">
                      <TrendingUp className="w-4 h-4" />
                      Tunai / On-hand
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-gmmi-navy border border-white/10 shadow-2xl shadow-gmmi-navy/20 rounded-[2.5rem] overflow-hidden group">
                <CardBody className="p-8 md:p-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-4 bg-white/10 text-gmmi-gold rounded-2xl shadow-xl backdrop-blur-md border border-white/5">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white/40 uppercase tracking-widest mb-2">
                      Saldo Akhir Bank
                    </p>
                    <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                      {formatRp(summary?.saldo_akhir_bank)}
                    </h3>
                  </div>
                  <div className="mt-8 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-2 text-gmmi-gold">
                      <FileSpreadsheet className="w-4 h-4" />
                      Rekening GMMI
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>

          {/* Filter & Table Section */}
          <div className="space-y-8">
            <motion.div
              variants={itemVariants}
              className="flex flex-col md:flex-row gap-4 items-end justify-between"
            >
              <div className="flex flex-col md:flex-row gap-4 items-end w-full md:w-auto">
                <div className="space-y-2 w-full md:w-48">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                    Dari Tanggal
                  </label>
                  <Input
                    type="date"
                    variant="bordered"
                    className="bg-white/50"
                    value={filter.startDate}
                    onValueChange={(v) =>
                      setFilter({ ...filter, startDate: v })
                    }
                  />
                </div>
                <div className="space-y-2 w-full md:w-48">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                    Sampai Tanggal
                  </label>
                  <Input
                    type="date"
                    variant="bordered"
                    className="bg-white/50"
                    value={filter.endDate}
                    onValueChange={(v) => setFilter({ ...filter, endDate: v })}
                  />
                </div>
                <Button
                  className="bg-gmmi-navy text-white font-bold uppercase tracking-widest h-11 px-6 rounded-xl"
                  onPress={fetchData}
                >
                  Filter Laporan
                </Button>
              </div>

              <Button
                color="success"
                variant="flat"
                className="font-black uppercase tracking-widest h-11 px-8 rounded-xl border border-emerald-100"
                startContent={<FileSpreadsheet size={18} />}
                onPress={() =>
                  exportTransactions(filter.startDate, filter.endDate)
                }
              >
                Download Excel
              </Button>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl shadow-gmmi-navy/5 rounded-[2.5rem] overflow-hidden">
                <CardBody className="p-0">
                  <Table
                    aria-label="Tabel Laporan Keuangan Digital"
                    removeWrapper
                    className="min-w-full"
                  >
                    <TableHeader>
                      <TableColumn className="bg-slate-50/50 py-6 font-black uppercase tracking-widest text-[10px]">
                        Tanggal
                      </TableColumn>
                      <TableColumn className="bg-slate-50/50 py-6 font-black uppercase tracking-widest text-[10px]">
                        Keterangan
                      </TableColumn>
                      <TableColumn className="bg-blue-50/50 py-6 font-black uppercase tracking-widest text-[10px] text-right">
                        Kas Masuk
                      </TableColumn>
                      <TableColumn className="bg-blue-50/50 py-6 font-black uppercase tracking-widest text-[10px] text-right">
                        Kas Keluar
                      </TableColumn>
                      <TableColumn className="bg-emerald-50/50 py-6 font-black uppercase tracking-widest text-[10px] text-right">
                        Bank Debit
                      </TableColumn>
                      <TableColumn className="bg-emerald-50/50 py-6 font-black uppercase tracking-widest text-[10px] text-right">
                        Bank Kredit
                      </TableColumn>
                    </TableHeader>
                    <TableBody
                      isLoading={loading}
                      emptyContent="Tidak ada data transaksi untuk periode ini."
                    >
                      {transactions.map((row) => (
                        <TableRow
                          key={row.id}
                          className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors"
                        >
                          <TableCell className="py-5 font-bold text-gmmi-navy">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-gmmi-gold" />
                              {new Date(row.tanggal).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-5 font-medium text-slate-600 max-w-[300px] line-clamp-1">
                            {row.keterangan}
                          </TableCell>
                          <TableCell className="py-5 text-right font-bold text-blue-600">
                            {formatRp(row.kas_penerimaan)}
                          </TableCell>
                          <TableCell className="py-5 text-right font-bold text-rose-500">
                            {formatRp(row.kas_pengeluaran)}
                          </TableCell>
                          <TableCell className="py-5 text-right font-bold text-emerald-600">
                            {formatRp(row.bank_debit)}
                          </TableCell>
                          <TableCell className="py-5 text-right font-bold text-rose-500">
                            {formatRp(row.bank_kredit)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Keuangan;
