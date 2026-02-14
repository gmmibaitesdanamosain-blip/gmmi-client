import React, { useEffect, useState } from 'react';
import {
    Card,
    CardBody,
    Button,
    Input,
    Textarea,
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
} from "@heroui/react";
import { Plus, Edit, Trash2, History } from 'lucide-react';
import { getSejarah, createSejarah, updateSejarah, deleteSejarah } from '../../services/sejarah.service';
import type { Sejarah } from '../../services/sejarah.service';

const SejarahManagement: React.FC = () => {
    const [sejarahList, setSejarahList] = useState<Sejarah[]>([]);
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedItem, setSelectedItem] = useState<Sejarah | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        judul: '',
        tanggal_peristiwa: '',
        deskripsi: '',
        gambar_url: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getSejarah();
            setSejarahList(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch sejarah", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNew = () => {
        setSelectedItem(null);
        setSelectedFile(null);
        setFormData({ judul: '', tanggal_peristiwa: '', deskripsi: '', gambar_url: '' });
        onOpen();
    };

    const handleEdit = (item: Sejarah) => {
        setSelectedItem(item);
        setSelectedFile(null);
        setFormData({
            judul: item.judul,
            tanggal_peristiwa: item.tanggal_peristiwa ? new Date(item.tanggal_peristiwa).toISOString().split('T')[0] : '', // Format YYYY-MM-DD
            deskripsi: item.deskripsi,
            gambar_url: item.gambar_url || ''
        });
        onOpen();
    };

    const handleDelete = async (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus data sejarah ini?")) {
            await deleteSejarah(id);
            fetchData();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        try {
            const data = new FormData();
            data.append('judul', formData.judul);
            data.append('tanggal_peristiwa', formData.tanggal_peristiwa);
            data.append('deskripsi', formData.deskripsi);

            if (selectedFile) {
                data.append('image', selectedFile);
            } else if (formData.gambar_url) {
                data.append('gambar_url', formData.gambar_url);
            }

            if (selectedItem) {
                await updateSejarah(selectedItem.id, data);
            } else {
                await createSejarah(data);
            }
            fetchData();
            onOpenChange(); // Close modal
        } catch (error) {
            console.error("Failed to save sejarah", error);
            alert("Gagal menyimpan data");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gmmi-navy flex items-center gap-2">
                        <History /> Manajemen Sejarah
                    </h1>
                    <p className="text-slate-500">Kelola konten sejarah gereja yang ditampilkan di Beranda.</p>
                </div>
                <Button
                    onPress={handleAddNew}
                    className="bg-gmmi-navy text-white font-bold"
                    startContent={<Plus size={18} />}
                >
                    Tambah Sejarah
                </Button>
            </div>

            <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden">
                <CardBody className="p-0">
                    <Table aria-label="Tabel Sejarah">
                        <TableHeader>
                            <TableColumn>JUDUL</TableColumn>
                            <TableColumn>TANGGAL PERISTIWA</TableColumn>
                            <TableColumn>DESKRIPSI</TableColumn>
                            <TableColumn>GAMBAR</TableColumn>
                            <TableColumn>AKSI</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent="Belum ada data sejarah." isLoading={loading}>
                            {sejarahList.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-bold text-gmmi-navy">{item.judul}</TableCell>
                                    <TableCell>
                                        {item.tanggal_peristiwa ? new Date(item.tanggal_peristiwa).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="line-clamp-2 max-w-xs text-xs text-slate-500">{item.deskripsi}</div>
                                    </TableCell>
                                    <TableCell>
                                        {item.gambar_url ? (
                                            <img src={item.gambar_url} alt="Preview" className="w-16 h-10 object-cover rounded-lg" />
                                        ) : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button isIconOnly size="sm" variant="flat" color="primary" onPress={() => handleEdit(item)}>
                                                <Edit size={16} />
                                            </Button>
                                            <Button isIconOnly size="sm" variant="flat" color="danger" onPress={() => handleDelete(item.id)}>
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

            {/* Modal Form */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" scrollBehavior="inside">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>{selectedItem ? "Edit Sejarah" : "Tambah Sejarah Baru"}</ModalHeader>
                            <ModalBody className="gap-6">
                                <Input
                                    label="Judul Peristiwa"
                                    placeholder="Contoh: Awal Mula Berdiri"
                                    variant="bordered"
                                    value={formData.judul}
                                    onValueChange={(v) => setFormData({ ...formData, judul: v })}
                                />
                                <Input
                                    type="date"
                                    label="Tanggal Peristiwa"
                                    variant="bordered"
                                    value={formData.tanggal_peristiwa}
                                    onValueChange={(v) => setFormData({ ...formData, tanggal_peristiwa: v })}
                                />
                                <Textarea
                                    label="Deskripsi Lengkap"
                                    placeholder="Ceritakan detail sejarah di sini..."
                                    variant="bordered"
                                    minRows={5}
                                    value={formData.deskripsi}
                                    onValueChange={(v) => setFormData({ ...formData, deskripsi: v })}
                                />
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Gambar (Opsional)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-slate-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-full file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-gmmi-navy/10 file:text-gmmi-navy
                                            hover:file:bg-gmmi-navy/20"
                                    />
                                    {selectedFile ? (
                                        <p className="text-xs text-green-600">File terpilih: {selectedFile.name}</p>
                                    ) : formData.gambar_url && (
                                        <div className="mt-2">
                                            <p className="text-xs text-slate-500 mb-1">Gambar saat ini:</p>
                                            <img src={formData.gambar_url} alt="Current" className="h-20 w-auto rounded object-cover" />
                                        </div>
                                    )}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>Batal</Button>
                                <Button className="bg-gmmi-navy text-white" onPress={handleSubmit}>Simpan</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div >
    );
};

// Quick fix for TableBody typing in HeroUI if needed, but standard usage usually works.

export default SejarahManagement;
