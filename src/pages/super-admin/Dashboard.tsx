import React, { useEffect, useState, useContext } from "react";
import { Card, CardBody, Button, Skeleton } from "@heroui/react";
import { Link } from "react-router-dom";
import {
  ListTodo,
  Megaphone,
  Calendar,
  ArrowUpRight,
  FileText,
  TrendingUp,
  Users,
  Map,
  ShieldCheck,
  Database,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import { ChartTooltip } from "../../components/ChartTooltip";
import { Select, SelectItem } from "@heroui/react";
import { getSuperAdminSummary } from "../../services/superAdmin.service";
import { AuthContext } from "../../contexts/AuthContext";

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext)!;
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState<string>("all");

  // Colors for charts

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const dashboardData = await getSuperAdminSummary();
      setStats(dashboardData);
    } catch (error) {
      console.error("Failed to fetch dashboard summary", error);
      // Fallback data for demo/error state
      setStats({
        income: 0,
        expense: 0,
        archives: 0,
        activeWarta: 0,
        recentActivities: [],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
        </div>
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gmmi-navy">
            Super Admin Dashboard
          </h1>
          <p className="text-gray-500">
            Selamat datang, {user?.name || "Administrator"}. Berikut statistik
            terkini sistem GMMI.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {user?.role?.includes("super") && (
            <Button
              as={Link}
              to="/super-admin/keuangan"
              className="bg-gmmi-navy text-white font-semibold w-full sm:w-auto"
              startContent={<TrendingUp size={18} />}
              aria-label="Buka Laporan Keuangan"
            >
              Laporan Keuangan
            </Button>
          )}
        </div>
      </div>

      {/* Master Data Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Jemaat Card */}
        {(() => {
          // Calculate filtered Jemaat count
          let displayTotalJemaat = stats?.totalJemaat || 0;
          let subText = "Jiwa terdaftar";

          if (selectedSector !== "all" && stats?.educationStats) {
            const filteredCount = stats.educationStats
              .filter((item: any) => item.sector === selectedSector)
              .reduce(
                (acc: number, curr: any) => acc + parseInt(curr.count),
                0,
              );

            // Fallback if stats are empty/loading but totalJemaat exists (unlikely if logic is correct)
            if (filteredCount > 0 || stats.educationStats.length > 0) {
              displayTotalJemaat = filteredCount;
              subText = `Jiwa di ${selectedSector}`;
            }
          }

          return (
            <Card className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none">
              <CardBody className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                      Total Jemaat
                    </p>
                    <h3 className="text-3xl font-black mt-2">
                      {displayTotalJemaat}
                    </h3>
                    <p className="text-xs opacity-80 mt-1">{subText}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Users size={24} className="text-white" />
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })()}

        {/* Sektor Card */}
        <Card className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-none">
          <CardBody className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                  Total Sektor
                </p>
                <h3 className="text-3xl font-black mt-2">
                  {stats?.totalSectors || 0}
                </h3>
                <p className="text-xs opacity-80 mt-1">Wilayah pelayanan</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Map size={24} className="text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Admin Card */}
        <Card className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-violet-500 to-violet-600 text-white border-none">
          <CardBody className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                  Total Admin
                </p>
                <h3 className="text-3xl font-black mt-2">
                  {stats?.totalAdmins || 0}
                </h3>
                <p className="text-xs opacity-80 mt-1">Pengelola sistem</p>
              </div>
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <ShieldCheck size={24} className="text-white" />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Database/System Status Card (Placeholder) */}
        <Card className="shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-slate-700 to-slate-800 text-white border-none">
          <CardBody className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                  Status Sistem
                </p>
                <h3 className="text-lg font-bold mt-2 text-emerald-400 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  Online
                </h3>
                <p className="text-xs opacity-60 mt-1">GMMI Backend v1.0</p>
              </div>
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Database size={24} className="text-white" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Statistics Section */}
      {stats && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-gmmi-navy flex items-center gap-2">
                <TrendingUp className="text-indigo-600" size={24} />
                Statistik Jemaat
              </h3>
              <p className="text-sm text-gray-500">
                Analisis sebaran data jemaat berdasarkan sektor dan kategori.
              </p>
            </div>
            <div className="w-full md:w-72">
              <Select
                label="Filter Wilayah Pelayanan"
                placeholder="Pilih Sektor"
                selectedKeys={[selectedSector]}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="max-w-xs"
                variant="faded"
                color="primary"
                startContent={<Map size={16} className="text-gray-400" />}
              >
                <SelectItem key="all" startContent={<Database size={16} />}>
                  Semua Sektor
                </SelectItem>
                {(stats.sectorsList || []).map((sec: any) => (
                  <SelectItem
                    key={sec.nama_sektor}
                    startContent={<Map size={16} />}
                  >
                    {sec.nama_sektor}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Education Logic */}
            {(() => {
              const data = (stats.educationStats || [])
                .filter(
                  (item: any) =>
                    selectedSector === "all" || item.sector === selectedSector,
                )
                .reduce((acc: any[], curr: any) => {
                  const existing = acc.find((x) => x.name === curr.education);
                  if (existing) {
                    existing.value += parseInt(curr.count);
                  } else {
                    acc.push({
                      name: curr.education || "Tidak Diketahui",
                      value: parseInt(curr.count),
                    });
                  }
                  return acc;
                }, [])
                .sort((a: any, b: any) => b.value - a.value);

              return (
                <Card className="shadow-lg border-none bg-white/80 backdrop-blur-md overflow-visible relative group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-xl" />
                  <CardBody className="p-6">
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-800 text-lg">
                        Pendidikan Terakhir
                      </h4>
                      <p className="text-xs text-gray-400">
                        Distribusi tingkat pendidikan
                      </p>
                    </div>
                    <div className="h-64 w-full relative z-10">
                      {data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={data}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={85}
                              paddingAngle={3}
                              dataKey="value"
                              cornerRadius={4}
                              stroke="none"
                            >
                              {data.map((_: any, index: number) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={
                                    [
                                      "#6366f1", // Indigo 500
                                      "#8b5cf6", // Violet 500
                                      "#ec4899", // Pink 500
                                      "#f43f5e", // Rose 500
                                      "#10b981", // Emerald 500
                                      "#3b82f6", // Blue 500
                                    ][index % 6]
                                  }
                                  className="stroke-2 stroke-white transition-opacity duration-300 hover:opacity-80"
                                />
                              ))}
                            </Pie>
                            <RechartsTooltip
                              content={<ChartTooltip />}
                              cursor={false}
                            />
                            <Legend
                              verticalAlign="bottom"
                              height={36}
                              iconType="circle"
                              iconSize={8}
                              formatter={(value) => (
                                <span className="text-xs font-semibold text-gray-500 ml-1">
                                  {value}
                                </span>
                              )}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm gap-2">
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <Database size={20} className="opacity-20" />
                          </div>
                          <span>Data tidak tersedia</span>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              );
            })()}

            {/* Kategorial Logic */}
            {(() => {
              const data = (stats.kategorialStats || [])
                .filter(
                  (item: any) =>
                    selectedSector === "all" || item.sector === selectedSector,
                )
                .reduce((acc: any[], curr: any) => {
                  const existing = acc.find((x) => x.name === curr.category);
                  if (existing) {
                    existing.value += parseInt(curr.count);
                  } else {
                    acc.push({
                      name: curr.category || "Lainnya",
                      value: parseInt(curr.count),
                    });
                  }
                  return acc;
                }, [])
                .sort((a: any, b: any) => b.value - a.value);

              return (
                <Card className="shadow-lg border-none bg-white/80 backdrop-blur-md overflow-visible relative group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-xl" />
                  <CardBody className="p-6">
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-800 text-lg">
                        Kategorial
                      </h4>
                      <p className="text-xs text-gray-400">
                        Pembagian kelompok usia
                      </p>
                    </div>
                    <div className="h-64 w-full relative z-10">
                      {data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={data}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={85}
                              paddingAngle={3}
                              dataKey="value"
                              cornerRadius={4}
                              stroke="none"
                            >
                              {data.map((_: any, index: number) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={
                                    [
                                      "#10b981", // Emerald 500
                                      "#14b8a6", // Teal 500
                                      "#06b6d4", // Cyan 500
                                      "#0ea5e9", // Sky 500
                                      "#3b82f6", // Blue 500
                                    ][index % 5]
                                  }
                                  className="stroke-2 stroke-white transition-opacity duration-300 hover:opacity-80"
                                />
                              ))}
                            </Pie>
                            <RechartsTooltip
                              content={<ChartTooltip />}
                              cursor={false}
                            />
                            <Legend
                              verticalAlign="bottom"
                              height={36}
                              iconType="circle"
                              iconSize={8}
                              formatter={(value) => (
                                <span className="text-xs font-semibold text-gray-500 ml-1">
                                  {value}
                                </span>
                              )}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm gap-2">
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <Database size={20} className="opacity-20" />
                          </div>
                          <span>Data tidak tersedia</span>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              );
            })()}

            {/* Sakramen Logic */}
            {(() => {
              const data = (stats.sakramenStats || [])
                .filter(
                  (item: any) =>
                    selectedSector === "all" || item.sector === selectedSector,
                )
                .reduce((acc: any[], curr: any) => {
                  const existing = acc.find((x) => x.name === curr.sacrament);
                  if (existing) {
                    existing.value += parseInt(curr.count);
                  } else {
                    acc.push({
                      name: curr.sacrament || "Lainnya",
                      value: parseInt(curr.count),
                    });
                  }
                  return acc;
                }, [])
                .sort((a: any, b: any) => b.value - a.value);

              return (
                <Card className="shadow-lg border-none bg-white/80 backdrop-blur-md overflow-visible relative group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-xl" />
                  <CardBody className="p-6">
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-800 text-lg">
                        Sakramen
                      </h4>
                      <p className="text-xs text-gray-400">
                        Status penerimaan sakramen
                      </p>
                    </div>
                    <div className="h-64 w-full relative z-10">
                      {data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={data}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={85}
                              paddingAngle={3}
                              dataKey="value"
                              cornerRadius={4}
                              stroke="none"
                            >
                              {data.map((_: any, index: number) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={
                                    [
                                      "#f59e0b", // Amber 500
                                      "#f97316", // Orange 500
                                      "#ef4444", // Red 500
                                      "#e11d48", // Rose 600
                                      "#8b5cf6", // Violet 500
                                    ][index % 5]
                                  }
                                  className="stroke-2 stroke-white transition-opacity duration-300 hover:opacity-80"
                                />
                              ))}
                            </Pie>
                            <RechartsTooltip
                              content={<ChartTooltip />}
                              cursor={false}
                            />
                            <Legend
                              verticalAlign="bottom"
                              height={36}
                              iconType="circle"
                              iconSize={8}
                              formatter={(value) => (
                                <span className="text-xs font-semibold text-gray-500 ml-1">
                                  {value}
                                </span>
                              )}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm gap-2">
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                            <Database size={20} className="opacity-20" />
                          </div>
                          <span>Data tidak tersedia</span>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              );
            })()}
          </div>

          {/* Sector Distribution Bars */}
          <Card className="shadow-lg border-none bg-white p-8 rounded-3xl mt-6">
            <CardBody className="p-0">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h4 className="font-black text-xl text-gray-800 uppercase tracking-tighter">
                    Sebaran Jemaat per Sektor
                  </h4>
                  <p className="text-sm text-gray-400 font-medium">
                    Kepadatan jiwa di setiap wilayah pelayanan.
                  </p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-900 rounded-2xl">
                  <Map size={24} />
                </div>
              </div>

              <div className="space-y-6">
                {(() => {
                  const sectorCounts = (stats.educationStats || []).reduce(
                    (acc: any, curr: any) => {
                      acc[curr.sector] =
                        (acc[curr.sector] || 0) + parseInt(curr.count);
                      return acc;
                    },
                    {},
                  );

                  const sortedSectors = Object.entries(sectorCounts).sort(
                    ([, a]: any, [, b]: any) => b - a,
                  );

                  const maxCount = Math.max(
                    ...(Object.values(sectorCounts) as number[]),
                    1,
                  );

                  return sortedSectors.map(
                    ([sector, count]: any, idx: number) => (
                      <div key={idx} className="group">
                        <div className="flex justify-between items-end mb-2">
                          <span className="font-black text-xs text-gray-700 uppercase tracking-widest">
                            {sector}
                          </span>
                          <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md">
                            {count} Jiwa
                          </span>
                        </div>
                        <div className="h-2.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                          <div
                            className="h-full bg-gradient-to-r from-blue-900 to-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-sm shadow-blue-900/10"
                            style={{ width: `${(count / maxCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    ),
                  );
                })()}
                {(!stats.educationStats ||
                  stats.educationStats.length === 0) && (
                  <p className="text-center text-gray-400 py-4 italic">
                    Belum ada data persebaran jemaat.
                  </p>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {/* Pewartaan Card */}
        <Card className="shadow-md hover:shadow-lg transition-shadow bg-white border border-gray-100">
          <CardBody className="flex flex-row items-center gap-4 p-6">
            <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
              <Megaphone size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Total Pewartaan
              </p>
              <h3 className="text-2xl font-bold text-gmmi-navy">
                {stats?.totalPewartaan || 0}
              </h3>
              <p className="text-xs text-green-600 font-medium">
                {stats?.activePewartaan || 0} Aktif
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Pengumuman Card */}
        <Card className="shadow-md hover:shadow-lg transition-shadow bg-white border border-gray-100">
          <CardBody className="flex flex-row items-center gap-4 p-6">
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
              <Megaphone size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Total Pengumuman
              </p>
              <h3 className="text-2xl font-bold text-gmmi-navy">
                {stats?.totalAnnouncements || 0}
              </h3>
            </div>
          </CardBody>
        </Card>

        {/* Agenda Card */}
        <Card className="shadow-md hover:shadow-lg transition-shadow bg-white border border-gray-100">
          <CardBody className="flex flex-row items-center gap-4 p-6">
            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Agenda Aktif</p>
              <h3 className="text-2xl font-bold text-gmmi-navy">
                {stats?.totalAgenda || 0}
              </h3>
            </div>
          </CardBody>
        </Card>

        {/* Program Card */}
        <Card className="shadow-md hover:shadow-lg transition-shadow bg-white border border-gray-100">
          <CardBody className="flex flex-row items-center gap-4 p-6">
            <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
              <ListTodo size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Jumlah Program Kerja Tahun ini
              </p>
              <h3 className="text-2xl font-bold text-gmmi-navy">
                {stats?.totalProgram || 0}
              </h3>
            </div>
          </CardBody>
        </Card>

        {/* Renungan Card */}
        <Card className="shadow-md hover:shadow-lg transition-shadow bg-white border border-gray-100">
          <CardBody className="flex flex-row items-center gap-4 p-6">
            <div className="p-3 bg-rose-100 rounded-xl text-rose-600">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Total Renungan
              </p>
              <h3 className="text-2xl font-bold text-gmmi-navy">
                {stats?.totalRenungan || 0}
              </h3>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Finance Overview Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-xl text-gmmi-navy">
            Ringkasan Keuangan
          </h3>
          <div className="flex gap-2">
            {user?.role?.includes("super") && (
              <>
                <Button
                  color="success"
                  variant="flat"
                  size="sm"
                  className="font-bold"
                  startContent={<TrendingUp size={16} />}
                  onPress={() => {
                    // Direct export call
                    import("../../services/keuangan.service").then((m) =>
                      m.exportTransactions(),
                    );
                  }}
                >
                  Export Excel
                </Button>
                <Button
                  as={Link}
                  to="/super-admin/keuangan"
                  size="sm"
                  variant="light"
                  color="primary"
                  className="font-bold"
                  endContent={<ArrowUpRight size={16} />}
                >
                  Kelola Lengkap
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-emerald-50 border-emerald-100 shadow-sm border">
            <CardBody className="p-4 flex flex-row items-center gap-4">
              <div className="p-2 bg-emerald-500 text-white rounded-lg">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-emerald-600 tracking-widest">
                  Total Pemasukan
                </p>
                <h4 className="text-xl font-black text-emerald-800">
                  Rp {(stats?.income || 0).toLocaleString("id-ID")}
                </h4>
              </div>
            </CardBody>
          </Card>
          <Card className="bg-rose-50 border-rose-100 shadow-sm border">
            <CardBody className="p-4 flex flex-row items-center gap-4">
              <div className="p-2 bg-rose-500 text-white rounded-lg">
                <TrendingUp size={20} className="rotate-180" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-rose-600 tracking-widest">
                  Total Pengeluaran
                </p>
                <h4 className="text-xl font-black text-rose-800">
                  Rp {(stats?.expense || 0).toLocaleString("id-ID")}
                </h4>
              </div>
            </CardBody>
          </Card>
          <Card className="bg-blue-50 border-blue-100 shadow-sm border">
            <CardBody className="p-4 flex flex-row items-center gap-4">
              <div className="p-2 bg-blue-500 text-white rounded-lg">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-blue-600 tracking-widest">
                  Saldo Bersih
                </p>
                <h4 className="text-xl font-black text-blue-800">
                  Rp{" "}
                  {(
                    (stats?.income || 0) - (stats?.expense || 0)
                  ).toLocaleString("id-ID")}
                </h4>
              </div>
            </CardBody>
          </Card>
        </div>

        <Card className="shadow-sm border border-gray-100 bg-white">
          <CardBody className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Keterangan
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                    Masuk
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                    Keluar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats?.recentFinance?.length > 0 ? (
                  stats.recentFinance.map((row: any) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-xs font-bold text-gmmi-navy">
                        {new Date(row.tanggal).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                        {row.keterangan}
                      </td>
                      <td className="px-6 py-4 text-xs font-black text-emerald-600 text-right">
                        {row.masuk > 0
                          ? `Rp ${row.masuk.toLocaleString("id-ID")}`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-xs font-black text-rose-500 text-right">
                        {row.keluar > 0
                          ? `Rp ${row.keluar.toLocaleString("id-ID")}`
                          : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-8 text-center text-gray-400 text-xs"
                    >
                      Belum ada transaksi tercatat.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>

      {/* Recent Activity & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 shadow-sm border border-gray-100 bg-white">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-gmmi-navy">
              Aktivitas Terkini
            </h3>
            <Button
              aria-label="Lihat semua aktivitas"
              as={Link}
              to="/super-admin/arsip"
              size="sm"
              variant="light"
              color="primary"
            >
              Lihat Semua
            </Button>
          </div>
          <CardBody className="p-0">
            {stats?.recentActivities?.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {stats.recentActivities.map((activity: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4 border-l-4 border-transparent hover:border-gmmi-navy/30"
                  >
                    <div
                      className={`p-2.5 rounded-xl shadow-sm ${
                        activity.type === "keuangan"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : activity.type === "jemaat"
                            ? "bg-blue-50 text-blue-600 border border-blue-100"
                            : activity.type === "program"
                              ? "bg-amber-50 text-amber-600 border border-amber-100"
                              : activity.type === "admin"
                                ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                                : "bg-slate-50 text-slate-600 border border-slate-100"
                      }`}
                    >
                      {activity.type === "keuangan" ? (
                        <TrendingUp size={18} />
                      ) : activity.type === "jemaat" ? (
                        <Users size={18} />
                      ) : activity.type === "program" ? (
                        <ListTodo size={18} />
                      ) : activity.type === "admin" ? (
                        <ShieldCheck size={18} />
                      ) : (
                        <Megaphone size={18} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800 leading-snug">
                        {activity.title}
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">
                        {activity.type}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-gmmi-navy bg-gray-50 px-2 py-1 rounded-md">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                <Calendar className="w-12 h-12 mb-2 opacity-20" />
                <p>Belum ada aktivitas tercatat hari ini.</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Quick Actions / Shortcuts */}
        <div className="space-y-6">
          <Card className="shadow-sm border border-gray-100 bg-gradient-to-br from-gmmi-navy to-blue-900 text-white">
            <CardBody className="p-6 space-y-4">
              <h3 className="font-bold text-lg">Akses Cepat</h3>
              <div className="grid grid-cols-1 gap-3">
                {user?.role?.includes("super") ? (
                  <>
                    <Button
                      as={Link}
                      to="/super-admin/pengumuman"
                      className="bg-white/10 hover:bg-white/20 text-white justify-start"
                      startContent={<Megaphone size={18} />}
                      aria-label="Buat Pengumuman Baru"
                    >
                      Buat Pengumuman Baru
                    </Button>
                    <Button
                      as={Link}
                      to="/super-admin/jemaat"
                      className="bg-white/10 hover:bg-white/20 text-white justify-start"
                      startContent={<Users size={18} />}
                      aria-label="Kelola Data Jemaat"
                    >
                      Kelola Data Jemaat
                    </Button>
                    <Button
                      as={Link}
                      to="/super-admin/pengaturan"
                      className="bg-white/10 hover:bg-white/20 text-white justify-start"
                      startContent={<ArrowUpRight size={18} />}
                      aria-label="Kelola Admin Majelis"
                    >
                      Kelola Admin Majelis
                    </Button>
                    <Button
                      as={Link}
                      to="/super-admin/program"
                      className="bg-white/10 hover:bg-white/20 text-white justify-start"
                      startContent={<ListTodo size={18} />}
                      aria-label="Kelola Program Kerja"
                    >
                      Kelola Program Kerja
                    </Button>
                  </>
                ) : (
                  <Button
                    as={Link}
                    to="/super-admin/pengumuman"
                    className="bg-white/10 hover:bg-white/20 text-white justify-start"
                    startContent={<Megaphone size={18} />}
                    aria-label="Buat Pengumuman Baru"
                  >
                    Buat Pengumuman Baru
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>

          <Card className="shadow-sm border border-gray-100 bg-white">
            <CardBody className="p-6">
              <h3 className="font-bold text-lg text-gmmi-navy mb-4">
                Agenda Terdekat
              </h3>
              {stats?.upcomingAgenda && stats.upcomingAgenda.length > 0 ? (
                <div className="space-y-4">
                  {stats.upcomingAgenda.map((item: any) => {
                    const date = new Date(item.tanggal);
                    const month = date.toLocaleDateString("id-ID", {
                      month: "short",
                    });
                    const day = date.getDate();
                    return (
                      <div key={item.id} className="flex gap-3 items-start">
                        <div className="bg-red-50 text-red-600 p-2 rounded-lg text-center min-w-[3.5rem]">
                          <span className="block text-xs font-bold uppercase">
                            {month}
                          </span>
                          <span className="block text-xl font-bold">{day}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm">
                            {item.kegiatan}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {item.jam_mulai?.substring(0, 5)} WIB •{" "}
                            {item.lokasi || "GMMI Pusat"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  Belum ada agenda terdekat.
                </p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
