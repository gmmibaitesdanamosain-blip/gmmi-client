import React, { useState, useEffect } from 'react';
import {
    Card, CardBody, Input, Button, Table, TableHeader, TableColumn,
    TableBody, TableRow, TableCell, Modal, ModalContent, ModalHeader,
    ModalBody, ModalFooter, useDisclosure, Select, SelectItem,
    Checkbox, CheckboxGroup, RadioGroup, Radio, Textarea,
    Chip, Divider, Alert
} from "@heroui/react";
import {
    Search, Edit, Trash2, FileSpreadsheet,
    Users, UserPlus, Save, X
} from 'lucide-react';
import {
    getAllJemaat, createJemaat, updateJemaat, deleteJemaat, getSectors
} from '../../services/jemaat.service';
import * as XLSX from 'xlsx';
import { useAuth } from '../../hooks/useAuth';

// Daftar pekerjaan sesuai constraint CHECK di database
const PEKERJAAN_OPTIONS = [
    'Buruh',
    'Petani',
    'Nelayan',
    'PNS',
    'TNI / POLRI',
    'Guru / Dosen',
    'Tenaga Kesehatan',
    'Rohaniawan',
    'Lainnya'
];

const JemaatManagement: React.FC = () => {
    const { user } = useAuth();
    const isSuperAdmin = user?.role === 'super_admin' || user?.role === 'superadmin';
    const [jemaatList, setJemaatList] = useState<any[]>([]);
    const [sectors, setSectors] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        sektor_id: '',
        pendidikan: '',
        kategorial: ''
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedJemaat, setSelectedJemaat] = useState<any>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);

    // Form State
    const [formData, setFormData] = useState<any>({
        nama: '',
        sektor_id: '',
        pendidikan_terakhir: 'SMA',
        pekerjaan: '',
        kategorial: [],
        keterangan: '',
        jenis_kelamin: 'L',
        tempat_lahir: '',
        tanggal_lahir: '',
        sakramen: {
            bpts: false,
            sidi: false,
            nikah: false,
            meninggal: false
        }
    });

    useEffect(() => {
        fetchData();
    }, [filters, searchTerm]);

    useEffect(() => {
        fetchSectors();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getAllJemaat({ ...filters, search: searchTerm });
            if (res.success) setJemaatList(res.data);
        } catch (error) {
            console.error("Failed to fetch jemaat", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSectors = async () => {
        try {
            const res = await getSectors();
            if (res.success && res.data && res.data.length > 0) {
                setSectors(res.data);
            } else {
                const fallbackSectors = Array.from({ length: 7 }, (_, i) => ({
                    id: `00000000-0000-4000-a000-00000000000${i + 1}`,
                    nama_sektor: `Sektor ${i + 1}`,
                    alamat: '-',
                    no_hp: '-'
                }));
                setSectors(fallbackSectors);
            }
        } catch (error) {
            console.error("Failed to fetch sectors", error);
            const fallbackSectors = Array.from({ length: 7 }, (_, i) => ({
                id: `00000000-0000-4000-a000-00000000000${i + 1}`,
                nama_sektor: `Sektor ${i + 1}`,
                alamat: '-',
                no_hp: '-'
            }));
            setSectors(fallbackSectors);
        }
    };

    const handleOpenModal = (jemaat?: any) => {
        if (jemaat) {
            setSelectedJemaat(jemaat);
            setFormData({
                nama: jemaat.nama,
                sektor_id: jemaat.sektor_id,
                pendidikan_terakhir: jemaat.pendidikan_terakhir,
                pekerjaan: jemaat.pekerjaan || '',
                kategorial: jemaat.kategorial ? jemaat.kategorial.split(',') : [],
                keterangan: jemaat.keterangan || '',
                jenis_kelamin: jemaat.jenis_kelamin || 'L',
                tempat_lahir: jemaat.tempat_lahir || '',
                tanggal_lahir: jemaat.tanggal_lahir ? jemaat.tanggal_lahir.split('T')[0] : '',
                sakramen: {
                    bpts: jemaat.bpts,
                    sidi: jemaat.sidi,
                    nikah: jemaat.nikah,
                    meninggal: jemaat.meninggal
                }
            });
        } else {
            setSelectedJemaat(null);
            setFormData({
                nama: '',
                sektor_id: '',
                pendidikan_terakhir: 'SMA',
                pekerjaan: '',
                kategorial: [],
                keterangan: '',
                jenis_kelamin: 'L',
                tempat_lahir: '',
                tanggal_lahir: '',
                sakramen: {
                    bpts: false,
                    sidi: false,
                    nikah: false,
                    meninggal: false
                }
            });
        }
        onOpen();
    };

    const handleSubmit = async () => {
        try {
            // Validasi frontend
            if (!formData.pekerjaan || formData.pekerjaan.trim() === '') {
                setMessage({ type: 'danger', text: 'Pekerjaan wajib diisi.' });
                return;
            }

            if (!PEKERJAAN_OPTIONS.includes(formData.pekerjaan)) {
                setMessage({ type: 'danger', text: 'Pekerjaan tidak valid. Pilih dari daftar yang tersedia.' });
                return;
            }

            const dataToSubmit = {
                ...formData,
                kategorial: formData.kategorial.join(',')
            };

            if (selectedJemaat) {
                await updateJemaat(selectedJemaat.id, dataToSubmit);
                setMessage({ type: 'success', text: 'Data jemaat berhasil diperbarui.' });
            } else {
                await createJemaat(dataToSubmit);
                setMessage({ type: 'success', text: 'Data jemaat berhasil ditambahkan.' });
            }
            fetchData();
            onClose();
        } catch (error: any) {
            console.error("Save error", error);
            const errorMsg = error.response?.data?.error || 'Gagal menyimpan data jemaat.';
            setMessage({ type: 'danger', text: errorMsg });
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Hapus data jemaat ini?')) {
            try {
                await deleteJemaat(id);
                setMessage({ type: 'success', text: 'Data jemaat berhasil dihapus.' });
                fetchData();
            } catch (error) {
                setMessage({ type: 'danger', text: 'Gagal menghapus data jemaat.' });
            }
        }
    };

    const exportExcel = () => {
        // Prepare Data in AOA (Array of Arrays) for merged headers
        const header1 = [
            "NO", "NAMA", "TTL", "JNS KLMN", "PENDIDIKAN TERAKHIR", "", "", "", "", "", "PEKERJAAN", "SAKRAMEN", "", "", "KATEGORIAL", "", "", "", "", "KET"
        ];
        const header2 = [
            "", "", "", "L/P", "TK", "SD", "SMP", "SMA", "S1", "S2", "", "BPTS", "SIDI", "NIKAH", "P. PRIA", "P. WANITA", "AMMI", "ARMI", "SM", ""
        ];

        const rows = jemaatList.map((j, index) => {
            const ttl = `${j.tempat_lahir || ''}, ${j.tanggal_lahir ? new Date(j.tanggal_lahir).toLocaleDateString('id-ID') : ''}`;
            const kat = j.kategorial || "";

            return [
                index + 1,
                j.nama,
                ttl,
                j.jenis_kelamin || "L",
                j.pendidikan_terakhir === "TK" ? "V" : "",
                j.pendidikan_terakhir === "SD" ? "V" : "",
                j.pendidikan_terakhir === "SMP" ? "V" : "",
                j.pendidikan_terakhir === "SMA" ? "V" : "",
                j.pendidikan_terakhir === "S1" ? "V" : "",
                j.pendidikan_terakhir === "S2" ? "V" : "",
                j.pekerjaan || "-",
                j.bpts ? "V" : "",
                j.sidi ? "V" : "",
                j.nikah ? "V" : "",
                kat.includes("P_PRIA") ? "V" : "",
                kat.includes("P_WANITA") ? "V" : "",
                kat.includes("AMMI") ? "V" : "",
                kat.includes("ARMI") ? "V" : "",
                kat.includes("SM") ? "V" : "",
                j.keterangan || (j.meninggal ? "MENINGGAL" : "AKTIF")
            ];
        });

        const worksheet = XLSX.utils.aoa_to_sheet([
            [`DATA JEMAAT GMMI BAITESDA TAHUN ${new Date().getFullYear()}`],
            [], // Empty row
            header1,
            header2,
            ...rows
        ]);

        // Merges
        worksheet["!merges"] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 19 } }, // Title
            { s: { r: 2, c: 0 }, e: { r: 3, c: 0 } }, // NO
            { s: { r: 2, c: 1 }, e: { r: 3, c: 1 } }, // NAMA
            { s: { r: 2, c: 2 }, e: { r: 3, c: 2 } }, // TTL
            { s: { r: 2, c: 3 }, e: { r: 2, c: 3 } }, // JNS KLMN top
            { s: { r: 2, c: 4 }, e: { r: 2, c: 9 } }, // Pendidikan
            { s: { r: 2, c: 10 }, e: { r: 3, c: 10 } }, // Pekerjaan
            { s: { r: 2, c: 11 }, e: { r: 2, c: 13 } }, // Sakramen
            { s: { r: 2, c: 14 }, e: { r: 2, c: 18 } }, // Kategorial
            { s: { r: 2, c: 19 }, e: { r: 3, c: 19 } }, // KET
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "DATA JEMAAT");

        XLSX.writeFile(workbook, `Data_Jemaat_GMMI_BAITESDA_${new Date().getFullYear()}.xlsx`);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gmmi-navy tracking-tighter">MANAJEMEN DATA JEMAAT</h1>
                    <p className="text-gray-500 font-medium">Pengelolaan data keanggotaan jemaat GMMI.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button
                        color="success"
                        variant="flat"
                        className="font-bold flex-1 md:flex-none"
                        startContent={<FileSpreadsheet size={18} />}
                        onClick={exportExcel}
                    >
                        Export Excel
                    </Button>
                    {isSuperAdmin && (
                        <Button
                            color="primary"
                            className="bg-gmmi-navy text-white font-bold flex-1 md:flex-none shadow-lg shadow-gmmi-navy/20"
                            startContent={<UserPlus size={18} />}
                            onClick={() => handleOpenModal()}
                        >
                            Tambah Jemaat
                        </Button>
                    )}
                </div>
            </div>

            {message && (
                <Alert
                    color={message.type === 'success' ? 'success' : 'danger'}
                    onClose={() => setMessage(null)}
                    className="animate-in fade-in slide-in-from-top-4"
                >
                    {message.text}
                </Alert>
            )}

            <Card className="border-none shadow-2xl shadow-gmmi-navy/5 overflow-hidden rounded-[2.5rem]">
                <CardBody className="p-0">
                    <div className="p-6 border-b border-gray-100 bg-neutral-50/50 flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Cari nama jemaat..."
                                startContent={<Search className="text-gray-400" size={18} />}
                                value={searchTerm}
                                onValueChange={setSearchTerm}
                                variant="bordered"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Select
                                placeholder="Filter Sektor"
                                aria-label="Filter Sektor"
                                variant="bordered"
                                selectedKeys={[filters.sektor_id || "all"]}
                                onSelectionChange={(keys: any) => {
                                    const val = Array.from(keys)[0] as string;
                                    setFilters(f => ({ ...f, sektor_id: val === "all" ? "" : val }));
                                }}
                            >
                                {[
                                    <SelectItem key="all" textValue="Semua Sektor">Semua Sektor</SelectItem>,
                                    ...sectors.map(s => (
                                        <SelectItem key={s.id} textValue={s.nama_sektor}>{s.nama_sektor}</SelectItem>
                                    ))
                                ]}
                            </Select>
                            <Select
                                placeholder="Pendidikan"
                                aria-label="Filter Pendidikan"
                                variant="bordered"
                                selectedKeys={filters.pendidikan ? [filters.pendidikan] : []}
                                onSelectionChange={(keys: any) => setFilters(f => ({ ...f, pendidikan: Array.from(keys)[0] as string }))}
                            >
                                {['', 'TK', 'SD', 'SMP', 'SMA', 'S1', 'S2', 'S3'].map(p => (
                                    <SelectItem key={p} textValue={p === "" ? "Semua Pendidikan" : p}>
                                        {p === "" ? "Semua Pendidikan" : p}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>

                    <Table aria-label="Tabel Data Jemaat" removeWrapper className="min-h-[400px]">
                        <TableHeader>
                            <TableColumn>NAMA</TableColumn>
                            <TableColumn>SEKTOR</TableColumn>
                            <TableColumn>PENDIDIKAN</TableColumn>
                            <TableColumn>PEKERJAAN</TableColumn>
                            <TableColumn>KATEGORIAL</TableColumn>
                            <TableColumn>SAKRAMEN</TableColumn>
                            <TableColumn>STATUS</TableColumn>
                            <TableColumn>AKSI</TableColumn>
                        </TableHeader>
                        <TableBody
                            loadingContent={<div className="font-black text-gmmi-navy">Memuat Data...</div>}
                            isLoading={loading}
                            emptyContent="Tidak ada data jemaat yang ditemukan."
                        >
                            {jemaatList.map((item) => (
                                <TableRow key={item.id} className="hover:bg-neutral-50 transition-colors">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gmmi-navy">{item.nama}</span>
                                            <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                                                {item.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{item.nama_sektor}</TableCell>
                                    <TableCell>{item.pendidikan_terakhir}</TableCell>
                                    <TableCell>{item.pekerjaan || '-'}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {item.kategorial?.split(',').map((k: string) => (
                                                <Chip key={k} size="sm" variant="flat" color="secondary">{k}</Chip>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            {item.bpts && <Chip size="sm" color="primary" variant="flat">BPTS</Chip>}
                                            {item.sidi && <Chip size="sm" color="success" variant="flat">SIDI</Chip>}
                                            {item.nikah && <Chip size="sm" color="warning" variant="flat">NIKAH</Chip>}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {item.meninggal ? (
                                            <Chip color="danger" variant="flat" size="sm" className="font-bold">MENINGGAL</Chip>
                                        ) : (
                                            <Chip color="success" variant="flat" size="sm" className="font-bold">AKTIF</Chip>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button isIconOnly size="sm" variant="light" onClick={() => handleOpenModal(item)}>
                                                <Edit size={16} />
                                            </Button>
                                            {isSuperAdmin && (
                                                <Button isIconOnly size="sm" color="danger" variant="light" onClick={() => handleDelete(item.id)}>
                                                    <Trash2 size={16} />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside" className="bg-white/80 backdrop-blur-xl">
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Users className="text-gmmi-navy" />
                            <h2 className="text-2xl font-black uppercase tracking-tighter">
                                {selectedJemaat ? 'Edit Data Jemaat' : 'Tambah Jemaat Baru'}
                            </h2>
                        </div>
                    </ModalHeader>
                    <ModalBody className="pb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="font-black text-[10px] text-gmmi-gold uppercase tracking-[0.3em]">Data Utama</h4>
                                <Input
                                    label="Nama Lengkap"
                                    placeholder="Masukkan nama sesuai KTP"
                                    value={formData.nama}
                                    variant="bordered"
                                    isRequired
                                    onValueChange={(val) => setFormData((prev: any) => ({ ...prev, nama: val }))}
                                />

                                <RadioGroup
                                    label="Jenis Kelamin"
                                    orientation="horizontal"
                                    value={formData.jenis_kelamin}
                                    onValueChange={(val) => setFormData((prev: any) => ({ ...prev, jenis_kelamin: val }))}
                                >
                                    <Radio value="L">Laki-laki</Radio>
                                    <Radio value="P">Perempuan</Radio>
                                </RadioGroup>

                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        label="Tempat Lahir"
                                        placeholder="Contoh: Jakarta"
                                        value={formData.tempat_lahir}
                                        variant="bordered"
                                        onValueChange={(val) => setFormData((prev: any) => ({ ...prev, tempat_lahir: val }))}
                                    />
                                    <Input
                                        label="Tanggal Lahir"
                                        type="date"
                                        value={formData.tanggal_lahir}
                                        variant="bordered"
                                        onValueChange={(val) => setFormData((prev: any) => ({ ...prev, tanggal_lahir: val }))}
                                    />
                                </div>

                                <Select
                                    label="Sektor"
                                    placeholder="Pilih Sektor"
                                    variant="bordered"
                                    isRequired
                                    selectedKeys={formData.sektor_id ? [formData.sektor_id] : []}
                                    onSelectionChange={(keys: any) => {
                                        const val = Array.from(keys)[0] as string;
                                        setFormData((prev: any) => ({ ...prev, sektor_id: val }));
                                    }}
                                >
                                    {sectors.map(s => (
                                        <SelectItem key={s.id} textValue={s.nama_sektor}>{s.nama_sektor}</SelectItem>
                                    ))}
                                </Select>
                                <Select
                                    label="Pekerjaan"
                                    placeholder="Pilih Pekerjaan"
                                    variant="bordered"
                                    isRequired
                                    selectedKeys={formData.pekerjaan ? [formData.pekerjaan] : []}
                                    onSelectionChange={(keys: any) => {
                                        const val = Array.from(keys)[0] as string;
                                        setFormData((prev: any) => ({ ...prev, pekerjaan: val }));
                                    }}
                                >
                                    {PEKERJAAN_OPTIONS.map(p => (
                                        <SelectItem key={p} textValue={p}>{p}</SelectItem>
                                    ))}
                                </Select>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-black text-[10px] text-gmmi-gold uppercase tracking-[0.3em]">Pendidikan Terakhir</h4>
                                <RadioGroup
                                    orientation="horizontal"
                                    value={formData.pendidikan_terakhir}
                                    onValueChange={(val) => setFormData((prev: any) => ({ ...prev, pendidikan_terakhir: val }))}
                                >
                                    {['TK', 'SD', 'SMP', 'SMA', 'S1', 'S2'].map(p => (
                                        <Radio key={p} value={p}>{p}</Radio>
                                    ))}
                                </RadioGroup>

                                <Divider />
                                <h4 className="font-black text-[10px] text-gmmi-gold uppercase tracking-[0.3em]">Kategorial</h4>
                                <CheckboxGroup
                                    orientation="horizontal"
                                    value={formData.kategorial}
                                    onValueChange={(val) => setFormData((prev: any) => ({ ...prev, kategorial: val }))}
                                >
                                    <Checkbox value="P_PRIA">P. PRIA</Checkbox>
                                    <Checkbox value="P_WANITA">P. WANITA</Checkbox>
                                    <Checkbox value="AMMI">AMMI</Checkbox>
                                    <Checkbox value="ARMI">ARMI</Checkbox>
                                    <Checkbox value="SM">SM</Checkbox>
                                </CheckboxGroup>

                                <Divider />
                                <h4 className="font-black text-[10px] text-gmmi-gold uppercase tracking-[0.3em]">Sakramen & Status</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <Checkbox
                                        isSelected={formData.sakramen.bpts}
                                        onValueChange={(v) => setFormData((p: any) => ({ ...p, sakramen: { ...p.sakramen, bpts: v } }))}
                                    >BPTS</Checkbox>
                                    <Checkbox
                                        isSelected={formData.sakramen.sidi}
                                        onValueChange={(v) => setFormData((p: any) => ({ ...p, sakramen: { ...p.sakramen, sidi: v } }))}
                                    >SIDI</Checkbox>
                                    <Checkbox
                                        isSelected={formData.sakramen.nikah}
                                        onValueChange={(v) => setFormData((p: any) => ({ ...p, sakramen: { ...p.sakramen, nikah: v } }))}
                                    >NIKAH</Checkbox>
                                    <Checkbox
                                        isSelected={formData.sakramen.meninggal}
                                        className="text-red-500"
                                        onValueChange={(v) => setFormData((p: any) => ({ ...p, sakramen: { ...p.sakramen, meninggal: v } }))}
                                    >MENINGGAL</Checkbox>
                                </div>

                                <Textarea
                                    label="Keterangan"
                                    placeholder="Catatan tambahan (opsional)"
                                    variant="bordered"
                                    value={formData.keterangan}
                                    onValueChange={(v) => setFormData((p: any) => ({ ...p, keterangan: v }))}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter className="border-t border-gray-100 p-6">
                        <Button color="danger" variant="light" onPress={onClose} startContent={<X size={18} />}>
                            Batal
                        </Button>
                        <Button
                            color="primary"
                            className="bg-gmmi-navy text-white font-black uppercase tracking-widest px-8 shadow-xl shadow-gmmi-navy/20"
                            onPress={handleSubmit}
                            startContent={<Save size={18} />}
                        >
                            Simpan Data
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default JemaatManagement;
