import React, { useEffect, useState } from 'react';
import { getJadwal, createJadwal, updateJadwal, deleteJadwal } from '../../services/admin.service';
import {
    Card,
    CardBody,
    Button,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Input,
    Tooltip,
    Skeleton,
    Select,
    SelectItem
} from "@heroui/react";
import {
    Calendar,
    Plus,
    Pencil,
    Trash2,
    Clock,
    MapPin,
    Users,
    CheckCircle2,
    XCircle
} from 'lucide-react';

type Jadwal = {
    id: string;
    judul: string;
    tanggal: string;
    waktu: string;
    lokasi: string;
    penanggungJawab: string;
    status: 'aktif' | 'selesai';
};

const JadwalPelayanan: React.FC = () => {
    const [jadwalList, setJadwalList] = useState<Jadwal[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [editingItem, setEditingItem] = useState<Jadwal | null>(null);
    const [formData, setFormData] = useState({
        judul: '',
        tanggal: '',
        waktu: '',
        lokasi: '',
        penanggungJawab: '',
        status: 'aktif' as 'aktif' | 'selesai'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await getJadwal();
            setJadwalList(data);
        } catch (error) {
            console.error('Error fetching jadwal:', error);
            setJadwalList([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item?: Jadwal) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                judul: item.judul,
                tanggal: item.tanggal,
                waktu: item.waktu,
                lokasi: item.lokasi,
                penanggungJawab: item.penanggungJawab,
                status: item.status
            });
        } else {
            setEditingItem(null);
            setFormData({
                judul: '',
                tanggal: '',
                waktu: '',
                lokasi: '',
                penanggungJawab: '',
                status: 'aktif'
            });
        }
        onOpen();
    };

    const handleSubmit = async () => {
        if (!formData.judul.trim() || !formData.tanggal || !formData.waktu) return;
        setIsSubmitting(true);
        try {
            if (editingItem) {
                await updateJadwal(editingItem.id, formData);
            } else {
                await createJadwal(formData);
            }
            fetchData();
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
            try {
                await deleteJadwal(id);
                fetchData();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const upcomingJadwal = jadwalList.filter(j => j.status === 'aktif').sort((a, b) =>
        new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
    );

    if (loading) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-20 rounded-[2rem]" />
                <Skeleton className="h-[500px] rounded-[3rem]" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold text-gmmi-navy tracking-tight">Jadwal Pelayanan</h1>
                    <p className="text-gray-500 font-medium">Kelola jadwal ibadah dan kegiatan pelayanan jemaat.</p>
                </div>
                <Button
                    onPress={() => handleOpenModal()}
                    className="bg-gmmi-navy text-white font-bold rounded-2xl h-14 px-8 shadow-lg shadow-gmmi-navy/20"
                    startContent={<Plus className="w-5 h-5" />}
                >
                    Tambah Jadwal
                </Button>
            </header>

            {/* Upcoming Schedule Highlight */}
            {upcomingJadwal.length > 0 && (
                <Card className="rounded-[2.5rem] border border-gray-100 shadow-sm bg-gradient-to-br from-gmmi-navy to-gmmi-navy/90 text-white overflow-hidden relative">
                    <div className="absolute -right-20 -top-20 bg-white/5 w-80 h-80 rounded-full blur-3xl"></div>
                    <CardBody className="p-8 relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-gmmi-gold/20 p-2 rounded-xl">
                                <Calendar className="w-5 h-5 text-gmmi-gold" />
                            </div>
                            <h3 className="text-lg font-bold">Jadwal Terdekat</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {upcomingJadwal.slice(0, 2).map((item) => (
                                <div key={item.id} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                                    <h4 className="font-bold text-xl mb-3">{item.judul}</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-gray-200">
                                            <Calendar className="w-4 h-4" />
                                            <span>{item.tanggal} • {item.waktu}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-200">
                                            <MapPin className="w-4 h-4" />
                                            <span>{item.lokasi}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-200">
                                            <Users className="w-4 h-4" />
                                            <span>{item.penanggungJawab}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Table */}
            <Card className="rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <Table aria-label="Tabel Jadwal Pelayanan" removeWrapper className="bg-transparent">
                        <TableHeader>
                            <TableColumn className="bg-transparent p-8 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-50">KEGIATAN</TableColumn>
                            <TableColumn className="bg-transparent p-8 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-50 text-center">TANGGAL & WAKTU</TableColumn>
                            <TableColumn className="bg-transparent p-8 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-50">LOKASI</TableColumn>
                            <TableColumn className="bg-transparent p-8 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-50">PENANGGUNG JAWAB</TableColumn>
                            <TableColumn className="bg-transparent p-8 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-50 text-center">STATUS</TableColumn>
                            <TableColumn className="bg-transparent p-8 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-50 text-right">AKSI</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={<div className="py-20 italic text-gray-400">Belum ada jadwal yang dibuat.</div>}>
                            {jadwalList.map((item) => (
                                <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0 group">
                                    <TableCell className="p-8">
                                        <p className="text-gmmi-navy font-bold">{item.judul}</p>
                                    </TableCell>
                                    <TableCell className="p-8 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-gmmi-navy font-medium">{item.tanggal}</span>
                                            <span className="text-gray-500 text-sm flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {item.waktu}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="p-8">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <MapPin className="w-4 h-4" />
                                            <span>{item.lokasi}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="p-8">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Users className="w-4 h-4" />
                                            <span>{item.penanggungJawab}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="p-8 text-center">
                                        <Chip
                                            size="sm"
                                            variant="flat"
                                            className={`font-bold capitalize ${item.status === 'aktif'
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : 'bg-gray-100 text-gray-500'
                                                }`}
                                            startContent={item.status === 'aktif' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                        >
                                            {item.status}
                                        </Chip>
                                    </TableCell>
                                    <TableCell className="p-8 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Tooltip content="Edit Jadwal">
                                                <Button isIconOnly variant="flat" onPress={() => handleOpenModal(item)} className="bg-blue-50 text-blue-600 rounded-xl">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip content="Hapus" color="danger">
                                                <Button isIconOnly variant="flat" onPress={() => handleDelete(item.id)} className="bg-red-50 text-red-600 rounded-xl">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="3xl"
                scrollBehavior="inside"
                classNames={{
                    header: "border-b border-gray-50 p-8",
                    footer: "border-t border-gray-50 p-8",
                    body: "p-8",
                }}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        <h3 className="text-2xl font-bold text-gmmi-navy">{editingItem ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</h3>
                        <p className="text-sm text-gray-500 font-medium">Isi detail kegiatan pelayanan.</p>
                    </ModalHeader>
                    <ModalBody className="gap-6">
                        <Input
                            label="Judul Kegiatan"
                            placeholder="Contoh: Ibadah Minggu Utama"
                            labelPlacement="outside"
                            variant="bordered"
                            isRequired
                            value={formData.judul}
                            onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                            classNames={{
                                label: "font-bold text-gmmi-navy pb-2",
                                inputWrapper: "border-gray-200 focus-within:!border-gmmi-navy rounded-[1.5rem] h-14",
                            }}
                        />

                        <div className="grid md:grid-cols-2 gap-6">
                            <Input
                                label="Tanggal"
                                type="date"
                                labelPlacement="outside"
                                variant="bordered"
                                isRequired
                                value={formData.tanggal}
                                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                                startContent={<Calendar className="w-4 h-4 text-gray-400" />}
                                classNames={{
                                    label: "font-bold text-gmmi-navy pb-2",
                                    inputWrapper: "border-gray-200 focus-within:!border-gmmi-navy rounded-[1.5rem] h-14",
                                }}
                            />

                            <Input
                                label="Waktu"
                                type="time"
                                labelPlacement="outside"
                                variant="bordered"
                                isRequired
                                value={formData.waktu}
                                onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
                                startContent={<Clock className="w-4 h-4 text-gray-400" />}
                                classNames={{
                                    label: "font-bold text-gmmi-navy pb-2",
                                    inputWrapper: "border-gray-200 focus-within:!border-gmmi-navy rounded-[1.5rem] h-14",
                                }}
                            />
                        </div>

                        <Input
                            label="Lokasi"
                            placeholder="Contoh: Gedung Utama"
                            labelPlacement="outside"
                            variant="bordered"
                            value={formData.lokasi}
                            onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                            startContent={<MapPin className="w-4 h-4 text-gray-400" />}
                            classNames={{
                                label: "font-bold text-gmmi-navy pb-2",
                                inputWrapper: "border-gray-200 focus-within:!border-gmmi-navy rounded-[1.5rem] h-14",
                            }}
                        />

                        <Input
                            label="Penanggung Jawab"
                            placeholder="Contoh: Pdt. John Doe"
                            labelPlacement="outside"
                            variant="bordered"
                            value={formData.penanggungJawab}
                            onChange={(e) => setFormData({ ...formData, penanggungJawab: e.target.value })}
                            startContent={<Users className="w-4 h-4 text-gray-400" />}
                            classNames={{
                                label: "font-bold text-gmmi-navy pb-2",
                                inputWrapper: "border-gray-200 focus-within:!border-gmmi-navy rounded-[1.5rem] h-14",
                            }}
                        />

                        <Select
                            label="Status"
                            labelPlacement="outside"
                            variant="bordered"
                            selectedKeys={[formData.status]}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'aktif' | 'selesai' })}
                            classNames={{
                                label: "font-bold text-gmmi-navy pb-2",
                                trigger: "border-gray-200 focus-within:!border-gmmi-navy rounded-[1.5rem] h-14",
                            }}
                        >
                            {[
                                { key: "aktif", label: "Aktif" },
                                { key: "selesai", label: "Selesai" }
                            ].map((item) => (
                                <SelectItem key={item.key}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </Select>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={onClose} className="rounded-2xl font-bold h-12 px-6">Batal</Button>
                        <Button
                            onPress={handleSubmit}
                            isLoading={isSubmitting}
                            className="bg-gmmi-navy text-white font-bold rounded-2xl h-12 px-10 shadow-lg shadow-gmmi-navy/20"
                            startContent={<Calendar className="w-4 h-4 text-gmmi-gold" />}
                        >
                            {editingItem ? 'Simpan Perubahan' : 'Tambahkan Jadwal'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default JadwalPelayanan;
