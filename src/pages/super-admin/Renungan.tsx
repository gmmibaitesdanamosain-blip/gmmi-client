
import React, { useEffect, useState, useRef } from 'react';
import { Card, CardBody, Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Textarea, Image } from "@heroui/react";
import { Plus, Trash2, Edit, Save, Upload } from 'lucide-react';
import { getAllRenungan, createRenungan, updateRenungan, deleteRenungan } from '../../services/renungan.service';

const Renungan: React.FC = () => {
    const [renunganList, setRenunganList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedRenungan, setSelectedRenungan] = useState<any | null>(null);
    const [formData, setFormData] = useState({ judul: '', isi: '', tanggal: '', gambar: null as File | null });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchRenungan();
    }, []);

    const fetchRenungan = async () => {
        setLoading(true);
        try {
            const res = await getAllRenungan();
            setRenunganList(Array.isArray(res) ? res : []);
        } catch (error) {
            console.error("Failed to fetch renungan", error);
            setRenunganList([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedRenungan(null);
        setFormData({ judul: '', isi: '', tanggal: new Date().toISOString().split('T')[0], gambar: null });
        onOpen();
    };

    const handleEdit = (item: any) => {
        setSelectedRenungan(item);
        setFormData({
            judul: item.judul,
            isi: item.isi,
            tanggal: item.tanggal ? new Date(item.tanggal).toISOString().split('T')[0] : '',
            gambar: null
        });
        onOpen();
    };

    const handleDelete = async (id: number) => {
        if (confirm("Hapus renungan ini?")) {
            try {
                await deleteRenungan(id);
                fetchRenungan();
            } catch (error) {
                console.error("Failed to delete renungan", error);
            }
        }
    };

    const handleSubmit = async (onClose: () => void) => {
        const data = new FormData();
        data.append('judul', formData.judul);
        data.append('isi', formData.isi);
        data.append('tanggal', formData.tanggal);
        if (formData.gambar) {
            data.append('gambar', formData.gambar);
        }

        try {
            if (selectedRenungan) {
                await updateRenungan(selectedRenungan.id, data);
            } else {
                await createRenungan(data);
            }
            fetchRenungan();
            onClose();
        } catch (error) {
            console.error("Failed to save renungan", error);
            alert("Gagal menyimpan renungan");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, gambar: e.target.files[0] });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gmmi-navy">Manajemen Renungan Mingguan</h1>
                    <p className="text-gray-500">Kelola konten renungan untuk jemaat.</p>
                </div>
                <Button
                    className="bg-gmmi-navy text-white font-semibold shadow-md"
                    onPress={handleCreate}
                    startContent={<Plus size={18} />}
                >
                    Tambah Renungan
                </Button>
            </div>

            <Card>
                <CardBody>
                    <Table aria-label="Tabel Renungan">
                        <TableHeader>
                            <TableColumn>GAMBAR</TableColumn>
                            <TableColumn>JUDUL</TableColumn>
                            <TableColumn>TANGGAL</TableColumn>
                            <TableColumn>AKSI</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={"Belum ada renungan."} isLoading={loading}>
                            {renunganList.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        {item.gambar ? (
                                            <Image
                                                src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${item.gambar}`}
                                                alt={item.judul}
                                                width={60}
                                                height={60}
                                                className="object-cover rounded-md"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">No Img</div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-bold">{item.judul}</div>
                                        <div className="text-xs text-gray-400 truncate max-w-xs">{item.isi?.substring(0, 50)}...</div>
                                    </TableCell>
                                    <TableCell>{new Date(item.tanggal).toLocaleDateString('id-ID')}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button isIconOnly size="sm" variant="light" onPress={() => handleEdit(item)}>
                                                <Edit size={18} className="text-blue-500" />
                                            </Button>
                                            <Button isIconOnly size="sm" variant="light" onPress={() => handleDelete(item.id)}>
                                                <Trash2 size={18} className="text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>{selectedRenungan ? 'Edit Renungan' : 'Tambah Renungan'}</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Judul Renungan"
                                    placeholder="Masukkan judul..."
                                    value={formData.judul}
                                    onValueChange={(v) => setFormData({ ...formData, judul: v })}
                                />
                                <Input
                                    type="date"
                                    label="Tanggal"
                                    value={formData.tanggal}
                                    onValueChange={(v) => setFormData({ ...formData, tanggal: v })}
                                />
                                <Textarea
                                    label="Isi Renungan"
                                    placeholder="Tuliskan isi renungan di sini..."
                                    minRows={10}
                                    value={formData.isi}
                                    onValueChange={(v) => setFormData({ ...formData, isi: v })}
                                />
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Gambar Sampul</label>
                                    <div className="flex items-center gap-4">
                                        <Button onPress={() => fileInputRef.current?.click()} startContent={<Upload size={16} />}>
                                            Upload Gambar
                                        </Button>
                                        <span className="text-sm text-gray-500">{formData.gambar ? formData.gambar.name : 'Tidak ada file dipilih'}</span>
                                        <input
                                            type="file"
                                            hidden
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                    </div>
                                    {selectedRenungan?.gambar && !formData.gambar && (
                                        <div className="text-xs text-gray-400">Gambar saat ini: {selectedRenungan.gambar}</div>
                                    )}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>Batal</Button>
                                <Button color="primary" onPress={() => handleSubmit(onClose)} startContent={<Save size={18} />}>
                                    Simpan
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default Renungan;
