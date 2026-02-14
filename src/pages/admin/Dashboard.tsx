import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getSummary } from "../../services/admin.service";
import { Card, CardBody, Skeleton, Button, Progress } from "@heroui/react";
import {
  Megaphone,
  BookOpen,
  Calendar,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Users,
  FileText,
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
  Target,
  CheckCircle2,
  Plus,
  Download,
  TrendingDown,
  ListTodo,
} from "lucide-react";
import { AuthContext } from "../../contexts/AuthContext";
import { motion } from "framer-motion";

type SummaryData = {
  totalAnnouncements: number;
  totalWarta: number;
  upcomingServices: number;
  lastUpdateAnnouncements: string;
  lastUpdateWarta: string;
  lastUpdateJadwal: string;
  recentActivities: { id: string; type: string; title: string; date: string }[];
  income?: number;
  expense?: number;
  recentFinance?: any[];
  totalPrograms?: number;
  totalJemaat?: number;
  activePrograms?: number;
};

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext)!;
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSummary();
        setData(result);
      } catch (error) {
        console.error("Error fetching summary:", error);
        setData({
          totalAnnouncements: 0,
          totalWarta: 0,
          upcomingServices: 0,
          lastUpdateAnnouncements: "-",
          lastUpdateWarta: "-",
          lastUpdateJadwal: "-",
          recentActivities: [],
          income: 0,
          expense: 0,
          totalPrograms: 0,
          totalJemaat: 0,
          activePrograms: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-32 md:h-40 rounded-[2rem]" />
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Skeleton className="h-[300px] md:h-[400px] rounded-[2.5rem]" />
          <Skeleton className="h-[300px] md:h-[400px] rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  const balance = (data?.income || 0) - (data?.expense || 0);
  const balancePercentage = data?.income ? (balance / data.income) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white p-4 md:p-6 lg:p-8 space-y-6 md:space-y-10">
      {/* Header Section - Responsive */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-gmmi-navy p-2 md:p-3 rounded-2xl">
              <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-gmmi-gold" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-black text-gmmi-navy tracking-tight">
                Dashboard Admin Majelis
              </h1>
              <p className="text-xs md:text-sm text-gray-500 font-medium">
                Selamat datang, {user?.name || "Admin"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <Button
            as={Link}
            to="/admin/arsip"
            className="bg-gmmi-navy text-white font-bold rounded-xl md:rounded-2xl h-12 md:h-14 px-4 md:px-8 shadow-lg shadow-gmmi-navy/20 flex-1 sm:flex-none"
            startContent={<FileText className="w-4 h-4 md:w-5 md:h-5" />}
          >
            <span className="hidden sm:inline">Laporan Arsip</span>
            <span className="sm:hidden">Arsip</span>
          </Button>
        </div>
      </motion.header>

      {/* Quick Stats Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Pengumuman Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Link to="/admin/pengumuman">
            <Card className="bg-gradient-to-br from-gmmi-navy to-gmmi-navy/90 text-white p-2 rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-gmmi-navy/20 relative overflow-hidden group hover:scale-105 transition-transform duration-300 cursor-pointer">
              <div className="absolute -right-8 -top-8 bg-white/5 w-32 h-32 md:w-40 md:h-40 rounded-full blur-3xl group-hover:bg-gmmi-gold/10 transition-colors duration-700"></div>
              <CardBody className="p-4 md:p-6 lg:p-8 space-y-3 md:space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="bg-white/10 p-2 md:p-3 rounded-xl md:rounded-2xl backdrop-blur-md">
                    <Megaphone className="w-4 h-4 md:w-6 md:h-6 text-gmmi-gold" />
                  </div>
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] md:text-sm font-bold text-gray-300 uppercase tracking-widest">
                    Pengumuman
                  </p>
                  <h3 className="text-2xl md:text-4xl font-extrabold mt-1">
                    {data?.totalAnnouncements || 0}
                  </h3>
                </div>
                <p className="text-[9px] md:text-xs text-gray-400 font-medium italic">
                  Update: {data?.lastUpdateAnnouncements}
                </p>
              </CardBody>
            </Card>
          </Link>
        </motion.div>

        {/* Warta Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/admin/warta">
            <Card className="bg-white p-2 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-lg relative overflow-hidden group hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <CardBody className="p-4 md:p-6 lg:p-8 space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="bg-blue-50 p-2 md:p-3 rounded-xl md:rounded-2xl">
                    <BookOpen className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
                  </div>
                  <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 text-gray-300 group-hover:text-gmmi-gold transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Warta Jemaat
                  </p>
                  <h3 className="text-2xl md:text-4xl font-extrabold text-gmmi-navy mt-1">
                    {data?.totalWarta || 0}
                  </h3>
                </div>
                <p className="text-[9px] md:text-xs text-gray-400 font-medium italic">
                  Update: {data?.lastUpdateWarta}
                </p>
              </CardBody>
            </Card>
          </Link>
        </motion.div>

        {/* Jadwal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link to="/admin/jadwal">
            <Card className="bg-white p-2 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-lg relative overflow-hidden group hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <CardBody className="p-4 md:p-6 lg:p-8 space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="bg-red-50 p-2 md:p-3 rounded-xl md:rounded-2xl">
                    <Calendar className="w-4 h-4 md:w-6 md:h-6 text-red-600" />
                  </div>
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500 animate-pulse"></div>
                </div>
                <div>
                  <p className="text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Jadwal
                  </p>
                  <h3 className="text-2xl md:text-4xl font-extrabold text-gmmi-navy mt-1">
                    {data?.upcomingServices || 0}
                  </h3>
                </div>
                <p className="text-[9px] md:text-xs text-gray-400 font-medium italic">
                  Update: {data?.lastUpdateJadwal}
                </p>
              </CardBody>
            </Card>
          </Link>
        </motion.div>

        {/* Program Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-gmmi-gold to-yellow-500 text-white p-2 rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-gmmi-gold/20 relative overflow-hidden group hover:scale-105 transition-transform duration-300 cursor-pointer">
            <div className="absolute -right-8 -top-8 bg-white/10 w-32 h-32 md:w-40 md:h-40 rounded-full blur-3xl"></div>
            <CardBody className="p-4 md:p-6 lg:p-8 space-y-3 md:space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="bg-white/20 p-2 md:p-3 rounded-xl md:rounded-2xl backdrop-blur-md">
                  <Target className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <Activity className="w-3 h-3 md:w-4 md:h-4 text-white/80" />
              </div>
              <div>
                <p className="text-[10px] md:text-sm font-bold text-white/90 uppercase tracking-widest">
                  Program Aktif
                </p>
                <h3 className="text-2xl md:text-4xl font-extrabold mt-1">
                  {data?.activePrograms || 0}
                </h3>
              </div>
              <p className="text-[9px] md:text-xs text-white/80 font-medium italic">
                Total: {data?.totalPrograms || 0} program
              </p>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Finance Overview */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Finance Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-lg overflow-hidden">
              <div className="p-4 md:p-6 lg:p-8 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-50 p-2 md:p-3 rounded-xl md:rounded-2xl">
                    <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-2xl font-bold text-gmmi-navy">
                      Ringkasan Keuangan
                    </h2>
                    <p className="text-[10px] md:text-xs text-gray-400 font-medium">
                      Bulan ini
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    color="success"
                    variant="flat"
                    size="sm"
                    className="font-bold rounded-xl text-xs"
                    startContent={<Download size={14} />}
                    onPress={() => {
                      import("../../services/keuangan.service").then((m) =>
                        m.exportTransactions(),
                      );
                    }}
                  >
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                  <Button
                    as={Link}
                    to="/admin/keuangan"
                    size="sm"
                    variant="light"
                    color="primary"
                    className="font-bold text-xs"
                    endContent={<ArrowUpRight size={14} />}
                  >
                    Detail
                  </Button>
                </div>
              </div>

              <CardBody className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
                {/* Financial Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                  <Card className="bg-emerald-50/50 border-emerald-100 shadow-sm border rounded-xl md:rounded-2xl">
                    <CardBody className="p-3 md:p-6 flex flex-row items-center gap-3 md:gap-4">
                      <div className="p-2 md:p-3 bg-emerald-500 text-white rounded-xl md:rounded-2xl">
                        <TrendingUp size={20} className="md:w-6 md:h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] md:text-[10px] uppercase font-black text-emerald-600 tracking-widest">
                          Pemasukan
                        </p>
                        <h4 className="text-base md:text-2xl font-black text-emerald-800 truncate">
                          Rp {(data?.income || 0).toLocaleString("id-ID")}
                        </h4>
                      </div>
                    </CardBody>
                  </Card>

                  <Card className="bg-rose-50/50 border-rose-100 shadow-sm border rounded-xl md:rounded-2xl">
                    <CardBody className="p-3 md:p-6 flex flex-row items-center gap-3 md:gap-4">
                      <div className="p-2 md:p-3 bg-rose-500 text-white rounded-xl md:rounded-2xl">
                        <TrendingDown size={20} className="md:w-6 md:h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] md:text-[10px] uppercase font-black text-rose-600 tracking-widest">
                          Pengeluaran
                        </p>
                        <h4 className="text-base md:text-2xl font-black text-rose-800 truncate">
                          Rp {(data?.expense || 0).toLocaleString("id-ID")}
                        </h4>
                      </div>
                    </CardBody>
                  </Card>

                  <Card className="bg-blue-50/50 border-blue-100 shadow-sm border rounded-xl md:rounded-2xl">
                    <CardBody className="p-3 md:p-6 flex flex-row items-center gap-3 md:gap-4">
                      <div className="p-2 md:p-3 bg-blue-500 text-white rounded-xl md:rounded-2xl">
                        <Sparkles size={20} className="md:w-6 md:h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] md:text-[10px] uppercase font-black text-blue-600 tracking-widest">
                          Saldo
                        </p>
                        <h4 className="text-base md:text-2xl font-black text-blue-800 truncate">
                          Rp {balance.toLocaleString("id-ID")}
                        </h4>
                      </div>
                    </CardBody>
                  </Card>
                </div>

                {/* Balance Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm font-bold text-gray-600">
                      Efisiensi Keuangan
                    </span>
                    <span className="text-xs md:text-sm font-black text-gmmi-navy">
                      {balancePercentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={balancePercentage}
                    className="h-2 md:h-3"
                    classNames={{
                      indicator:
                        balancePercentage > 50
                          ? "bg-emerald-500"
                          : "bg-amber-500",
                    }}
                  />
                </div>

                {/* Recent Transactions Table - Responsive */}
                <div className="overflow-x-auto -mx-4 md:mx-0">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="px-3 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Tanggal
                        </th>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Keterangan
                        </th>
                        <th className="px-3 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                          Nominal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {data?.recentFinance && data.recentFinance.length > 0 ? (
                        data.recentFinance.slice(0, 5).map((row: any) => (
                          <tr
                            key={row.id}
                            className="hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-3 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold text-gmmi-navy">
                              {new Date(row.tanggal).toLocaleDateString(
                                "id-ID",
                                { day: "numeric", month: "short" },
                              )}
                            </td>
                            <td className="px-3 md:px-6 py-3 md:py-4 text-[10px] md:text-xs text-slate-600 font-medium truncate max-w-[200px]">
                              {row.keterangan}
                            </td>
                            <td
                              className={`px-3 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-black text-right ${row.masuk > 0 ? "text-emerald-600" : "text-rose-500"}`}
                            >
                              {row.masuk > 0
                                ? `+ Rp ${row.masuk.toLocaleString("id-ID")}`
                                : `- Rp ${row.keluar.toLocaleString("id-ID")}`}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="p-6 md:p-8 text-center text-gray-400 text-xs"
                          >
                            Belum ada data keuangan.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Quick Actions & Activities */}
        <div className="space-y-4 md:space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-lg overflow-hidden">
              <div className="p-4 md:p-6 border-b border-gray-100">
                <h3 className="text-base md:text-lg font-bold text-gmmi-navy flex items-center gap-2">
                  <Plus className="w-4 h-4 md:w-5 md:h-5 text-gmmi-gold" />
                  Aksi Cepat
                </h3>
              </div>
              <CardBody className="p-4 md:p-6 space-y-2 md:space-y-3">
                <Button
                  as={Link}
                  to="/admin/pengumuman"
                  className="w-full justify-start bg-gmmi-navy text-white font-bold rounded-xl md:rounded-2xl h-12 md:h-14 shadow-lg shadow-gmmi-navy/20"
                  startContent={<Megaphone className="w-4 h-4 md:w-5 md:h-5" />}
                >
                  Buat Pengumuman
                </Button>
                <Button
                  as={Link}
                  to="/admin/program"
                  className="w-full justify-start bg-white border-2 border-gmmi-navy text-gmmi-navy font-bold rounded-xl md:rounded-2xl h-12 md:h-14"
                  startContent={<ListTodo className="w-4 h-4 md:w-5 md:h-5" />}
                >
                  Lihat Program
                </Button>
              </CardBody>
            </Card>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-lg overflow-hidden">
              <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-base md:text-lg font-bold text-gmmi-navy flex items-center gap-2">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-gmmi-gold" />
                  Aktivitas Terkini
                </h3>
                <Button
                  as={Link}
                  to="/admin/arsip"
                  variant="light"
                  size="sm"
                  className="font-bold text-gmmi-gold text-xs"
                >
                  Semua
                </Button>
              </div>
              <CardBody className="p-4 md:p-6 space-y-3 md:space-y-4 max-h-[400px] overflow-y-auto">
                {data?.recentActivities && data.recentActivities.length > 0 ? (
                  data.recentActivities.slice(0, 5).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-gray-50/50 rounded-xl md:rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div
                        className={`p-2 md:p-3 rounded-xl shrink-0 ${
                          activity.type === "announcement"
                            ? "bg-amber-50 text-amber-600"
                            : activity.type === "warta"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-red-50 text-red-600"
                        }`}
                      >
                        {activity.type === "announcement" ? (
                          <Megaphone className="w-3 h-3 md:w-4 md:h-4" />
                        ) : activity.type === "warta" ? (
                          <BookOpen className="w-3 h-3 md:w-4 md:h-4" />
                        ) : (
                          <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gmmi-navy text-xs md:text-sm group-hover:text-gmmi-gold transition-colors truncate">
                          {activity.title}
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400 font-medium mt-0.5">
                          {activity.date}
                        </p>
                      </div>
                      <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 md:py-8 text-gray-400 text-xs md:text-sm">
                    <Activity className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 opacity-20" />
                    Belum ada aktivitas terkini
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Bottom Stats - Responsive */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4"
      >
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl md:rounded-2xl shadow-lg">
          <CardBody className="p-4 md:p-6 text-center">
            <Users className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 opacity-80" />
            <h4 className="text-xl md:text-3xl font-black">
              {data?.totalJemaat || 0}
            </h4>
            <p className="text-[9px] md:text-xs font-bold opacity-90 uppercase tracking-widest">
              Total Jemaat
            </p>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl md:rounded-2xl shadow-lg">
          <CardBody className="p-4 md:p-6 text-center">
            <Target className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 opacity-80" />
            <h4 className="text-xl md:text-3xl font-black">
              {data?.totalPrograms || 0}
            </h4>
            <p className="text-[9px] md:text-xs font-bold opacity-90 uppercase tracking-widest">
              Program
            </p>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-xl md:rounded-2xl shadow-lg">
          <CardBody className="p-4 md:p-6 text-center">
            <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 opacity-80" />
            <h4 className="text-xl md:text-3xl font-black">
              {data?.activePrograms || 0}
            </h4>
            <p className="text-[9px] md:text-xs font-bold opacity-90 uppercase tracking-widest">
              Aktif
            </p>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl md:rounded-2xl shadow-lg">
          <CardBody className="p-4 md:p-6 text-center">
            <PieChart className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 opacity-80" />
            <h4 className="text-xl md:text-3xl font-black">
              {(
                ((data?.activePrograms || 0) / (data?.totalPrograms || 1)) *
                100
              ).toFixed(0)}
              %
            </h4>
            <p className="text-[9px] md:text-xs font-bold opacity-90 uppercase tracking-widest">
              Progres
            </p>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
