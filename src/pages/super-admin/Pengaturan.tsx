import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tabs,
  Tab,
  Switch,
  Avatar,
  Select,
  SelectItem,
  Spinner,
  Divider,
} from "@heroui/react";
import {
  Plus,
  Edit,
  UserCog,
  KeyRound,
  ShieldCheck,
  Mail,
  User,
  MapPin,
  Phone,
  Trash2,
  Save,
  Lock,
  CheckCircle2,
} from "lucide-react";
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  resetAdminPassword,
  toggleAdminStatus,
  changeMyPassword,
} from "../../services/superAdmin.service";
import {
  getSectors,
  createSector,
  updateSector,
  deleteSector,
} from "../../services/jemaat.service";
import { useAuth } from "../../hooks/useAuth";

const Pengaturan: React.FC = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [secLoading, setSecLoading] = useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isSecOpen,
    onOpen: onSecOpen,
    onOpenChange: onSecOpenChange,
  } = useDisclosure();

  const [selectedAdmin, setSelectedAdmin] = useState<any | null>(null);
  const [selectedSector, setSelectedSector] = useState<any | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "admin_majelis",
    password: "",
  });
  const [secData, setSecData] = useState({
    nama_sektor: "",
    no_hp: "",
    alamat: "",
  });
  const [passData, setPassData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [passLoading, setPassLoading] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning",
  });

  const [showCurrentPass, setShowCurrentPass] = useState(false);

  useEffect(() => {
    if (user?.password) {
      setPassData((prev) => ({ ...prev, current: user.password || "" }));
    }
  }, [user]);

  useEffect(() => {
    fetchAdmins();
    fetchSectors();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (error) {
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSectors = async () => {
    setSecLoading(true);
    try {
      const res = await getSectors();
      setSectors(res.data || []);
    } catch (error) {
      setSectors([]);
    } finally {
      setSecLoading(false);
    }
  };

  const showToast = (
    message: string,
    severity: "success" | "error" | "warning" = "success",
  ) => {
    setToast({ open: true, message, severity });
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

  // --- Admin Handlers ---
  const handleSubmit = async () => {
    try {
      if (selectedAdmin) {
        await updateAdmin(selectedAdmin.id, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        });
        showToast("Admin berhasil diperbarui.");
      } else {
        await createAdmin({
          nama: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });
        showToast("Admin baru berhasil didaftarkan.");
      }
      fetchAdmins();
      onOpenChange();
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Gagal menyimpan data admin.",
        "error",
      );
    }
  };

  // --- Sector Handlers ---
  const handleSecSubmit = async () => {
    try {
      if (selectedSector) {
        await updateSector(selectedSector.id, secData);
        showToast("Data sektor berhasil diperbarui.");
      } else {
        await createSector(secData);
        showToast("Sektor baru berhasil ditambahkan.");
      }
      fetchSectors();
      onSecOpenChange();
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Gagal menyimpan data sektor.",
        "error",
      );
    }
  };

  const handleSecDelete = async (id: string) => {
    if (
      confirm(
        "Hapus sektor ini? Pastikan tidak ada jemaat yang terdaftar di sektor ini.",
      )
    ) {
      try {
        const res = await deleteSector(id);
        if (res.success) {
          showToast("Sektor berhasil dihapus.");
          fetchSectors();
        }
      } catch (error: any) {
        showToast(
          error.response?.data?.message || "Gagal menghapus sektor.",
          "error",
        );
      }
    }
  };

  // --- Password Handler ---
  const handlePassChange = async () => {
    if (!passData.current || !passData.new || !passData.confirm) {
      showToast("Semua field password harus diisi.", "warning");
      return;
    }
    if (passData.new !== passData.confirm) {
      showToast("Konfirmasi password tidak cocok.", "error");
      return;
    }
    if (passData.new.length < 6) {
      showToast("Password baru minimal 6 karakter.", "warning");
      return;
    }

    if (!user?.id) {
      showToast("Sesi pengguna tidak valid.", "error");
      return;
    }

    setPassLoading(true);
    try {
      await changeMyPassword(user.id, passData.current, passData.new);
      showToast(
        "Password berhasil diubah. Silakan gunakan password baru pada login berikutnya.",
      );
      setPassData({ current: "", new: "", confirm: "" });
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Gagal mengubah password.",
        "error",
      );
    } finally {
      setPassLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleAdminStatus(id, !currentStatus);
      showToast(
        `Akun berhasil ${!currentStatus ? "diaktifkan" : "dinonaktifkan"}.`,
      );
      fetchAdmins();
    } catch (error) {
      showToast("Gagal mengubah status akun.", "error");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-blue-900 tracking-tighter">
          PENGATURAN SISTEM
        </h1>
        <p className="text-gray-500 font-medium">
          Konfigurasi keamanan dan data master GMMI Baitesda.
        </p>
      </div>

      <Tabs
        aria-label="Opsi Pengaturan"
        color="primary"
        variant="underlined"
        classNames={{
          tabList: "gap-6",
          cursor: "w-full bg-blue-900",
          tabContent: "group-data-[selected=true]:text-blue-900 font-bold",
        }}
      >
        <Tab
          key="admins"
          title={
            <div className="flex items-center space-x-2">
              <UserCog size={18} />
              <span>KELOLA ADMIN</span>
            </div>
          }
        >
          <Card className="mt-4 border-none shadow-xl shadow-blue-900/5 rounded-3xl">
            <CardBody className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">
                    Daftar Admin
                  </h3>
                  <p className="text-sm text-gray-400">
                    Total {admins.length} akun terdaftar di sistem.
                  </p>
                </div>
                <Button
                  onPress={() => {
                    setSelectedAdmin(null);
                    setFormData({
                      name: "",
                      email: "",
                      role: "admin_majelis",
                      password: "",
                    });
                    onOpen();
                  }}
                  color="primary"
                  className="bg-blue-900 text-white font-bold px-6 shadow-lg shadow-blue-900/20"
                  startContent={<Plus size={18} />}
                >
                  TAMBAH ADMIN
                </Button>
              </div>
              <Table
                aria-label="Tabel Admin"
                removeWrapper
                className="border-none"
              >
                <TableHeader>
                  <TableColumn className="bg-gray-50/50">ADMIN</TableColumn>
                  <TableColumn className="bg-gray-50/50">ROLE</TableColumn>
                  <TableColumn className="bg-gray-50/50">STATUS</TableColumn>
                  <TableColumn className="bg-gray-50/50 text-right">
                    AKSI
                  </TableColumn>
                </TableHeader>
                <TableBody
                  emptyContent={loading ? "" : "Tidak ada data admin."}
                  isLoading={loading}
                  loadingContent={<Spinner label="Memuat..." />}
                >
                  {admins.map((admin) => (
                    <TableRow
                      key={admin.id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar name={admin.name} className="shadow-sm" />
                          <div>
                            <p className="font-bold text-gray-800">
                              {admin.name}
                            </p>
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                              {admin.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-blue-900 bg-blue-50 px-3 py-1 rounded-full w-fit text-[10px] font-black uppercase tracking-widest border border-blue-100/50">
                          <ShieldCheck size={12} />
                          {admin.role === "admin_majelis"
                            ? "Admin Majelis"
                            : "Super Admin"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch
                          isSelected={admin.isActive}
                          color="success"
                          size="sm"
                          onValueChange={() =>
                            handleToggleStatus(admin.id, admin.isActive)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => {
                              setSelectedAdmin(admin);
                              setFormData({
                                name: admin.name,
                                email: admin.email,
                                role: admin.role,
                                password: "",
                              });
                              onOpen();
                            }}
                          >
                            <Edit size={16} className="text-blue-600" />
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="warning"
                            onPress={() => {
                              if (confirm("Reset password ke GMMI1234?"))
                                resetAdminPassword(admin.id)
                                  .then(() => showToast("Password direset."))
                                  .catch(() =>
                                    showToast("Gagal reset.", "error"),
                                  );
                            }}
                          >
                            <KeyRound size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>

        <Tab
          key="sectors"
          title={
            <div className="flex items-center space-x-2">
              <MapPin size={18} />
              <span>KELOLA SEKTOR</span>
            </div>
          }
        >
          <Card className="mt-4 border-none shadow-xl shadow-blue-900/5 rounded-3xl">
            <CardBody className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">
                    Wilayah Sektor
                  </h3>
                  <p className="text-sm text-gray-400">
                    Total {sectors.length} wilayah sektor terdaftar.
                  </p>
                </div>
                <Button
                  onPress={() => {
                    setSelectedSector(null);
                    setSecData({ nama_sektor: "", no_hp: "", alamat: "" });
                    onSecOpen();
                  }}
                  color="primary"
                  className="bg-blue-900 text-white font-bold px-6"
                  startContent={<Plus size={18} />}
                >
                  TAMBAH SEKTOR
                </Button>
              </div>
              <Table aria-label="Tabel Sektor" removeWrapper>
                <TableHeader>
                  <TableColumn className="bg-gray-50/50">
                    NAMA SEKTOR
                  </TableColumn>
                  <TableColumn className="bg-gray-50/50">ALAMAT</TableColumn>
                  <TableColumn className="bg-gray-50/50">KONTAK</TableColumn>
                  <TableColumn className="bg-gray-50/50 text-right">
                    AKSI
                  </TableColumn>
                </TableHeader>
                <TableBody
                  isLoading={secLoading}
                  emptyContent="Belum ada data sektor."
                >
                  {sectors.map((sec) => (
                    <TableRow key={sec.id} className="border-b border-gray-50">
                      <TableCell className="font-bold text-blue-900">
                        {sec.nama_sektor}
                      </TableCell>
                      <TableCell className="text-gray-500 max-w-xs truncate">
                        {sec.alamat || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={14} />
                          <span className="text-xs font-mono">
                            {sec.no_hp || "-"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => {
                              setSelectedSector(sec);
                              setSecData({
                                nama_sektor: sec.nama_sektor,
                                no_hp: sec.no_hp || "",
                                alamat: sec.alamat || "",
                              });
                              onSecOpen();
                            }}
                          >
                            <Edit size={16} className="text-blue-600" />
                          </Button>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            onPress={() => handleSecDelete(sec.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        </Tab>

        <Tab
          key="profile"
          title={
            <div className="flex items-center space-x-2">
              <User size={18} />
              <span>AKUN SAYA</span>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            <Card className="border-none shadow-xl rounded-3xl p-8 col-span-1">
              <CardBody className="p-0 flex flex-col items-center">
                <Avatar
                  className="h-32 w-32 border-4 border-blue-50 shadow-inner mb-6"
                  src=""
                  name={user?.nama}
                />
                <h3 className="text-2xl font-black text-gray-800 text-center">
                  {user?.nama?.toUpperCase()}
                </h3>
                <div className="mt-2 bg-blue-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">
                  {user?.role?.replace("_", " ")}
                </div>
                <Divider className="my-6 w-full" />
                <div className="w-full space-y-4">
                  <div className="flex items-center gap-3 text-gray-500">
                    <Mail size={16} className="text-blue-900" />
                    <span className="text-sm font-medium">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-500">
                    <ShieldCheck size={16} className="text-blue-900" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Akses Administrator
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="border-none shadow-xl rounded-3xl p-8 col-span-2">
              <CardBody className="p-0">
                <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight mb-6 flex items-center gap-2">
                  <Lock size={20} className="text-blue-900" />
                  Ubah Kata Sandi
                </h3>
                <div className="space-y-6 max-w-md">
                  <Input
                    type={showCurrentPass ? "text" : "password"}
                    label="Kata Sandi Saat Ini"
                    placeholder="••••••••"
                    variant="bordered"
                    value={passData.current}
                    onValueChange={(val) =>
                      setPassData({ ...passData, current: val })
                    }
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                      >
                        {showCurrentPass ? (
                          <Lock className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <KeyRound className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                  />
                  <Divider />
                  <Input
                    type="password"
                    label="Kata Sandi Baru"
                    placeholder="Minimal 6 karakter"
                    variant="bordered"
                    value={passData.new}
                    onValueChange={(val) =>
                      setPassData({ ...passData, new: val })
                    }
                  />
                  <Input
                    type="password"
                    label="Konfirmasi Kata Sandi Baru"
                    placeholder="Ketik kembali password baru"
                    variant="bordered"
                    value={passData.confirm}
                    onValueChange={(val) =>
                      setPassData({ ...passData, confirm: val })
                    }
                  />
                  <Button
                    color="primary"
                    className="bg-blue-900 text-white font-black w-full h-12 shadow-xl shadow-blue-900/20"
                    onPress={handlePassChange}
                    isLoading={passLoading}
                    startContent={!passLoading && <CheckCircle2 size={18} />}
                  >
                    PERBARUI PASSWORD
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>
      </Tabs>

      {/* Modal Admin */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        className="rounded-[2rem]"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="font-black uppercase tracking-tight p-6">
                {selectedAdmin ? "Edit Data Admin" : "Daftar Admin Baru"}
              </ModalHeader>
              <ModalBody className="pb-8 px-6 space-y-4">
                <Input
                  label="Nama Lengkap"
                  placeholder="Bpk/Ibu/Sdr..."
                  variant="bordered"
                  value={formData.name}
                  onValueChange={(v) => setFormData({ ...formData, name: v })}
                />
                <Input
                  label="Email"
                  placeholder="admin@gmail.com"
                  variant="bordered"
                  value={formData.email}
                  onValueChange={(v) => setFormData({ ...formData, email: v })}
                />
                <Select
                  label="Role"
                  variant="bordered"
                  selectedKeys={[formData.role]}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <SelectItem key="admin_majelis" textValue="Admin Majelis">
                    Admin Majelis
                  </SelectItem>
                  <SelectItem key="super_admin" textValue="Super Admin">
                    Super Admin
                  </SelectItem>
                </Select>
                {!selectedAdmin && (
                  <Input
                    label="Password Awal"
                    type="password"
                    variant="bordered"
                    value={formData.password}
                    onValueChange={(v) =>
                      setFormData({ ...formData, password: v })
                    }
                  />
                )}
              </ModalBody>
              <ModalFooter className="p-6 border-t">
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  className="font-bold"
                >
                  BATAL
                </Button>
                <Button
                  color="primary"
                  className="bg-blue-900 text-white font-black shadow-lg"
                  onPress={handleSubmit}
                  startContent={<Save size={18} />}
                >
                  SIMPAN
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal Sektor */}
      <Modal
        isOpen={isSecOpen}
        onOpenChange={onSecOpenChange}
        backdrop="blur"
        className="rounded-[2rem]"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="font-black uppercase tracking-tight p-6">
                {selectedSector ? "Edit Wilayah Sektor" : "Tambah Sektor Baru"}
              </ModalHeader>
              <ModalBody className="pb-8 px-6 space-y-4">
                <Input
                  label="Nama Sektor"
                  placeholder="Contoh: Sektor 1"
                  variant="bordered"
                  value={secData.nama_sektor}
                  onValueChange={(v) =>
                    setSecData({ ...secData, nama_sektor: v })
                  }
                />
                <Input
                  label="Nomor HP Koordinator"
                  placeholder="08..."
                  variant="bordered"
                  value={secData.no_hp}
                  onValueChange={(v) => setSecData({ ...secData, no_hp: v })}
                />
                <Input
                  label="Alamat / Wilayah"
                  placeholder="Cth: Kelapa Gading..."
                  variant="bordered"
                  value={secData.alamat}
                  onValueChange={(v) => setSecData({ ...secData, alamat: v })}
                />
              </ModalBody>
              <ModalFooter className="p-6 border-t">
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  className="font-bold"
                >
                  BATAL
                </Button>
                <Button
                  color="primary"
                  className="bg-blue-900 text-white font-black shadow-lg"
                  onPress={handleSecSubmit}
                  startContent={<Save size={18} />}
                >
                  SIMPAN SEKTOR
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {toast.open && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in">
          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg font-bold text-white ${
              toast.severity === "success"
                ? "bg-green-600"
                : toast.severity === "warning"
                  ? "bg-yellow-500"
                  : "bg-red-600"
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

export default Pengaturan;
