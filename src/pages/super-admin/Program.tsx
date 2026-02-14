import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Textarea,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Spinner,
  Tooltip,
} from "@heroui/react";
import {
  Plus as AddIcon,
  Save as SaveIcon,
  Download as ExportIcon,
  Filter as FilterIcon,
  Trash2 as DeleteIcon,
} from "lucide-react";
import {
  createProgram,
  getPrograms,
  exportExcel,
  exportWord,
  deleteProgram,
} from "../../services/program.service";
import type { Program } from "../../services/program.service";
import { useAuth } from "../../hooks/useAuth";

const BIDANG_OPTIONS = [
  "Sekretariat",
  "Penatalayanan",
  "Kategorial",
  "Pemberdayaan Jemaat",
  "Rumah Tangga, Sarana, dan Prasarana",
  "BP2K2",
  "Kebendaharaan",
];

const SuperAdminProgram: React.FC = () => {
  const { user } = useAuth();
  const isSuperAdmin =
    user?.role === "super_admin" || user?.role === "superadmin";
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [filterBidang, setFilterBidang] = useState<string>("");

  const [formData, setFormData] = useState({
    bidang: "",
    sub_bidang: "",
    nama_program: "",
    jenis_kegiatan: "",
    volume: 1,
    waktu_pelaksanaan: "",
    rencana_biaya: 0,
    keterangan: "",
  });

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    fetchPrograms();
  }, [filterBidang]);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const data = await getPrograms({ bidang: filterBidang });
      setPrograms(data || []);
    } catch (error) {
      console.error("Fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "volume" || name === "rencana_biaya" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset sub_bidang if bidang is not Penatalayanan
      ...(name === "bidang" && value !== "Penatalayanan"
        ? { sub_bidang: "" }
        : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      await createProgram(formData);
      setToast({
        open: true,
        message: "✅ Program berhasil ditambahkan!",
        severity: "success",
      });
      setFormData({
        bidang: "",
        sub_bidang: "",
        nama_program: "",
        jenis_kegiatan: "",
        volume: 1,
        waktu_pelaksanaan: "",
        rencana_biaya: 0,
        keterangan: "",
      });
      fetchPrograms();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Gagal menambahkan program";
      setToast({
        open: true,
        message: `❌ ${errorMessage}`,
        severity: "error",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  useEffect(() => {
    if (toast.open) {
      const timer = setTimeout(() => handleCloseToast(), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.open]);

  const handleExportExcel = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const blob = await exportExcel(filterBidang);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filterBidang
        ? `Program_Kerja_${filterBidang}_${currentYear}.xlsx`
        : `Program_Kerja_GMMI_${currentYear}.xlsx`;
      a.click();
      setToast({
        open: true,
        message: "📊 File Excel berhasil diunduh!",
        severity: "success",
      });
    } catch (error) {
      console.error("Export failed", error);
      setToast({
        open: true,
        message: "❌ Gagal mengekspor ke Excel.",
        severity: "error",
      });
    }
  };

  const handleExportWord = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const blob = await exportWord(filterBidang);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filterBidang
        ? `Program_Kerja_${filterBidang}_${currentYear}.docx`
        : `Program_Kerja_GMMI_${currentYear}.docx`;
      a.click();
      setToast({
        open: true,
        message: "📄 File Word berhasil diunduh!",
        severity: "success",
      });
    } catch (error) {
      console.error("Export failed", error);
      setToast({
        open: true,
        message: "❌ Gagal mengekspor ke Word.",
        severity: "error",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus program ini?"))
      return;

    try {
      await deleteProgram(id);
      setToast({
        open: true,
        message: "🗑️ Program berhasil dihapus!",
        severity: "success",
      });
      fetchPrograms();
    } catch (error) {
      console.error("Delete failed", error);
      setToast({
        open: true,
        message: "❌ Gagal menghapus program.",
        severity: "error",
      });
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Manajemen Program & Kegiatan Gereja
        </h1>
      </div>

      {/* FORM SECTION */}
      {isSuperAdmin && (
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-4 rounded-t-xl">
            <div className="flex items-center gap-2">
              <AddIcon />
              <h2 className="text-xl font-semibold">Input Program Baru</h2>
            </div>
          </CardHeader>
          <CardBody className="p-6 bg-white">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <Select
                  label="Bidang Program"
                  placeholder="Pilih Bidang"
                  selectedKeys={formData.bidang ? [formData.bidang] : []}
                  onChange={(e) => handleSelectChange("bidang", e.target.value)}
                  isRequired
                >
                  {BIDANG_OPTIONS.map((bidang) => (
                    <SelectItem key={bidang} textValue={bidang}>
                      {bidang}
                    </SelectItem>
                  ))}
                </Select>

                {formData.bidang === "Penatalayanan" && (
                  <Select
                    label="Sub Bidang"
                    placeholder="Pilih Sub Bidang"
                    selectedKeys={
                      formData.sub_bidang ? [formData.sub_bidang] : []
                    }
                    onChange={(e) =>
                      handleSelectChange("sub_bidang", e.target.value)
                    }
                    isRequired
                  >
                    <SelectItem key="Pelayanan Umum" textValue="Pelayanan Umum">
                      Pelayanan Umum
                    </SelectItem>
                    <SelectItem
                      key="Pelayanan Khusus"
                      textValue="Pelayanan Khusus"
                    >
                      Pelayanan Khusus
                    </SelectItem>
                  </Select>
                )}

                <Input
                  label="Nama Program"
                  name="nama_program"
                  value={formData.nama_program}
                  onChange={handleInputChange}
                  placeholder="Contoh: Ibadah Raya"
                  isRequired
                />

                <Input
                  type="number"
                  label="Volume"
                  name="volume"
                  value={String(formData.volume)}
                  onChange={handleInputChange}
                  min={1}
                  isRequired
                />
              </div>

              <div className="space-y-4">
                <Input
                  label="Waktu Pelaksanaan"
                  name="waktu_pelaksanaan"
                  value={formData.waktu_pelaksanaan}
                  onChange={handleInputChange}
                  placeholder="Contoh: Setiap Minggu / 10 Jan 2026"
                  isRequired
                />

                <Input
                  type="number"
                  label="Rencana Biaya (Rp)"
                  name="rencana_biaya"
                  value={String(formData.rencana_biaya)}
                  onChange={handleInputChange}
                  placeholder="Masukkan nominal biaya"
                />

                <Textarea
                  label="Jenis Kegiatan"
                  name="jenis_kegiatan"
                  value={formData.jenis_kegiatan}
                  onChange={handleInputChange}
                  placeholder="Deskripsikan detail kegiatan"
                  isRequired
                />

                <Textarea
                  label="Keterangan (Opsional)"
                  name="keterangan"
                  value={formData.keterangan}
                  onChange={handleInputChange}
                  placeholder="Catatan tambahan"
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <Button
                  type="submit"
                  color="primary"
                  isLoading={submitLoading}
                  startContent={!submitLoading && <SaveIcon />}
                  className="px-10 font-bold"
                >
                  Simpan Program
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {/* DATA TABLE SECTION */}
      <Card className="shadow-lg border border-gray-100">
        <CardBody className="p-0 overflow-hidden">
          <div className="p-6 bg-gray-50 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 w-full md:max-w-md">
              <FilterIcon className="text-gray-400" />
              <Select
                placeholder="Filter per Bidang"
                size="sm"
                variant="bordered"
                selectedKeys={filterBidang ? [filterBidang] : ["all"]}
                onChange={(e) =>
                  setFilterBidang(
                    e.target.value === "all" ? "" : e.target.value,
                  )
                }
                className="w-full"
              >
                {["all", ...BIDANG_OPTIONS].map((opt) => (
                  <SelectItem
                    key={opt}
                    textValue={opt === "all" ? "Semua Bidang" : opt}
                  >
                    {opt === "all" ? "Semua Bidang" : opt}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="flex gap-2">
              {isSuperAdmin && (
                <>
                  <Button
                    variant="flat"
                    color="success"
                    startContent={<ExportIcon />}
                    onPress={handleExportExcel}
                    className="font-semibold"
                  >
                    Excel
                  </Button>
                  <Button
                    variant="flat"
                    color="primary"
                    startContent={<ExportIcon />}
                    onPress={handleExportWord}
                    className="font-semibold"
                  >
                    Word
                  </Button>
                </>
              )}
            </div>
          </div>

          <Table
            aria-label="Tabel Program Kerja"
            classNames={{
              base: "min-h-[400px]",
              th: "bg-gray-100 text-gray-700 font-bold uppercase text-xs py-4",
              td: "py-4 px-6 border-b border-gray-50",
            }}
          >
            <TableHeader>
              <TableColumn>BIDANG</TableColumn>
              <TableColumn>PROGRAM</TableColumn>
              <TableColumn>KEGIATAN</TableColumn>
              <TableColumn>WAKTU</TableColumn>
              <TableColumn>BIAYA</TableColumn>
              <TableColumn>KETERANGAN</TableColumn>
              <TableColumn>AKSI</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent={
                loading ? null : "Tidak ada data program ditemukan."
              }
              isLoading={loading}
              loadingContent={<Spinner label="Memuat data..." />}
            >
              {programs.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-blue-900">
                        {item.bidang}
                      </span>
                      {item.sub_bidang && (
                        <Chip size="sm" variant="flat" color="primary">
                          {item.sub_bidang}
                        </Chip>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">{item.nama_program}</div>
                    <div className="text-xs text-gray-400 font-light">
                      Vol: {item.volume}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className="max-w-xs text-sm text-gray-600 line-clamp-2"
                      title={item.jenis_kegiatan}
                    >
                      {item.jenis_kegiatan}
                    </div>
                  </TableCell>
                  <TableCell>{item.waktu_pelaksanaan}</TableCell>
                  <TableCell>
                    Rp {Number(item.rencana_biaya).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <div
                      className="max-w-xs truncate text-xs text-gray-500 italic"
                      title={item.keterangan}
                    >
                      {item.keterangan || "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {isSuperAdmin && (
                      <Tooltip content="Hapus Program">
                        <Button
                          isIconOnly
                          color="danger"
                          variant="light"
                          onPress={() => handleDelete(item.id)}
                          size="sm"
                        >
                          <DeleteIcon className="text-red-500" />
                        </Button>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {toast.open && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in">
          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg font-bold text-white ${
              toast.severity === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={handleCloseToast}
              className="ml-2 text-white/80 hover:text-white text-lg"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminProgram;
