import React, { useEffect, useState } from 'react';
import {
    Card,
    CardBody,
    Button,
    Input,
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
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/react";
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { createAnnouncement, deleteAnnouncement, getAnnouncements, updateAnnouncement } from '../../services/admin.service';
import { useAuth } from '../../hooks/useAuth';

const Pengumuman: React.FC = () => {
    const { user } = useAuth();
    const isSuperAdmin = user?.role === 'super_admin' || user?.role === 'superadmin';
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [formData, setFormData] = useState({ isi: '', status: 'draft' as 'draft' | 'publish' });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const data = await getAnnouncements();
            setAnnouncements(data);
        } catch (error) {
            console.error("Failed to fetch announcements", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        try {
            if (selectedItem) {
                await updateAnnouncement(selectedItem.id, formData);
            } else {
                await createAnnouncement(formData);
            }
            fetchAnnouncements();
            onOpenChange();
            setFormData({ isi: '', status: 'draft' });
            setSelectedItem(null);
        } catch (error) {
            console.error("Failed to save announcement", error);
        }
    };

    const handleEdit = (item: any) => {
        setSelectedItem(item);
        setFormData({ isi: item.isi, status: item.status });
        onOpen();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus pengumuman ini?")) {
            await deleteAnnouncement(id);
            fetchAnnouncements();
        }
    };

    const handleAddNew = () => {
        setSelectedItem(null);
        setFormData({ isi: '', status: 'draft' });
        onOpen();
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gmmi-navy">Pengumuman Nasional ({announcements.length})</h1>
                    <p className="text-gray-500">Kelola pengumuman untuk seluruh cabang GMMI. {loading ? 'Loading...' : ''}</p>
                </div>
                <Button
                    onPress={handleAddNew}
                    color="primary"
                    radius="sm"
                    className="bg-gmmi-navy text-white font-semibold shadow-md"
                    startContent={<Plus size={18} />}
                >
                    Buat Pengumuman
                </Button>
            </div>

            <Card className="border border-gray-100 shadow-sm">
                <CardBody>
                    <div className="flex justify-between items-center mb-4">
                        <Input
                            placeholder="Cari pengumuman..."
                            startContent={<Search className="text-gray-400" size={18} />}
                            className="max-w-xs"
                            variant="bordered"
                        />
                        <div className="flex gap-2">
                            {/* Filter logic here if needed */}
                        </div>
                    </div>
                    <Table aria-label="Tabel Pengumuman">
                        <TableHeader>
                            <TableColumn>ISI PENGUMUMAN</TableColumn>
                            <TableColumn>DIBUAT OLEH</TableColumn>
                            <TableColumn>STATUS</TableColumn>
                            <TableColumn>TANGGAL</TableColumn>
                            <TableColumn>AKSI</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={"Belum ada pengumuman."} isLoading={loading}>
                            {announcements.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="line-clamp-2 max-w-xl">{item.isi}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-semibold text-gmmi-navy">{item.author_name || 'System'}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            color={item.status === 'publish' ? "success" : "warning"}
                                            variant="flat"
                                            size="sm"
                                        >
                                            {item.status.toUpperCase()}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>{new Date(item.created_at || Date.now()).toLocaleDateString('id-ID')}</TableCell>
                                    <TableCell>
                                        {isSuperAdmin && (
                                            <div className="flex gap-2">
                                                <Button isIconOnly size="sm" variant="light" onPress={() => handleEdit(item)}>
                                                    <Edit size={16} className="text-blue-600" />
                                                </Button>
                                                <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleDelete(item.id)}>
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        )}
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
                            <ModalHeader className="flex flex-col gap-1">
                                {selectedItem ? "Edit Pengumuman" : "Buat Pengumuman Baru"}
                            </ModalHeader>
                            <ModalBody>
                                <Textarea
                                    label="Isi Pengumuman"
                                    placeholder="Tuliskan pengumuman di sini..."
                                    value={formData.isi}
                                    onValueChange={(val) => setFormData({ ...formData, isi: val })}
                                    minRows={5}
                                    variant="bordered"
                                />
                                <Select
                                    label="Status Publikasi"
                                    placeholder="Pilih status"
                                    selectedKeys={[formData.status]}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'publish' })}
                                    variant="bordered"
                                >
                                    <SelectItem key="draft">Draft (Simpan Dulu)</SelectItem>
                                    <SelectItem key="publish">Publish (Tayangkan Langsung)</SelectItem>
                                </Select>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Batal
                                </Button>
                                <Button color="primary" onPress={handleSubmit} className="bg-gmmi-navy">
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

export default Pengumuman;
