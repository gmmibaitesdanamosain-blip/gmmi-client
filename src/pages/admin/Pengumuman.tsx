import React, { useEffect, useState } from 'react';
import {
    getAnnouncements,
    createAnnouncement,
    updateAnnouncement
} from '../../services/admin.service';
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
    Textarea,
    Input,
    Alert
} from "@heroui/react";
import {
    Plus,
    Search,
    CheckCircle2,
    AlertCircle,
    Clock,
    Send,
    Save,
    ShieldCheck
} from 'lucide-react';

type Announcement = {
    id: string;
    isi: string;
    status: 'publish' | 'draft';
    tanggal: string;
    author_name?: string;
};

const Pengumuman: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [search, setSearch] = useState('');

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [editingItem, setEditingItem] = useState<Announcement | null>(null);
    const [formData, setFormData] = useState({
        isi: '',
        status: 'publish' as 'publish' | 'draft'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getAnnouncements();
            setAnnouncements(data);
        } catch (error) {
            console.error('Error fetching announcements:', error);
            setAnnouncements([]);
        }
    };

    const handleOpenModal = (item?: Announcement) => {
        if (item) {
            setEditingItem(item);
            setFormData({ isi: item.isi, status: item.status });
        } else {
            setEditingItem(null);
            setFormData({ isi: '', status: 'publish' });
        }
        onOpen();
    };

    const handleSubmit = async () => {
        if (!formData.isi.trim()) return;
        setIsSubmitting(true);
        try {
            if (editingItem) {
                await updateAnnouncement(editingItem.id, formData);
            } else {
                await createAnnouncement(formData);
            }
            fetchData();
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };


    const filteredData = announcements.filter(item =>
        item.isi.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold text-gmmi-navy tracking-tight">Pengumuman</h1>
                    <p className="text-gray-500 font-medium">Kelola informasi penting yang akan dilihat oleh seluruh jemaat.</p>
                </div>
                <Button
                    onPress={() => handleOpenModal()}
                    className="bg-gmmi-navy text-white font-bold rounded-2xl h-14 px-8 shadow-lg shadow-gmmi-navy/20"
                    startContent={<Plus className="w-5 h-5" />}
                >
                    Buat Baru
                </Button>
            </header>

            {/* Filter & Search */}
            <Card className="rounded-[2rem] border border-gray-100 shadow-sm">
                <CardBody className="p-6">
                    <Input
                        placeholder="Cari isi pengumuman..."
                        size="lg"
                        variant="flat"
                        radius="lg"
                        startContent={<Search className="text-gray-400 w-5 h-5" />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        classNames={{
                            inputWrapper: "bg-gray-50/50 group-data-[focused=true]:bg-white group-data-[focused=true]:!border-gmmi-navy h-14 px-6 border-transparent",
                        }}
                    />
                </CardBody>
            </Card>

            {/* Table Section */}
            <Card className="rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <Table aria-label="Tabel Pengumuman" removeWrapper className="bg-transparent">
                        <TableHeader>
                            <TableColumn className="bg-transparent p-8 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-50">ISI PENGUMUMAN</TableColumn>
                            <TableColumn className="bg-transparent p-8 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-50 text-center">DIBUAT OLEH</TableColumn>
                            <TableColumn className="bg-transparent p-8 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-50 text-center">STATUS</TableColumn>
                            <TableColumn className="bg-transparent p-8 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-50 text-center">TANGGAL</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={<div className="py-20 italic text-gray-400">Belum ada pengumuman yang dibuat.</div>}>
                            {filteredData.map((item) => (
                                <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0 group">
                                    <TableCell className="p-8">
                                        <p className="text-gmmi-navy font-medium line-clamp-2 max-w-xl">{item.isi}</p>
                                    </TableCell>
                                    <TableCell className="p-8 text-center">
                                        <span className="font-bold text-gmmi-navy">{item.author_name || 'System'}</span>
                                    </TableCell>
                                    <TableCell className="p-8 text-center">
                                        <Chip
                                            size="sm"
                                            variant="flat"
                                            className={`font-bold capitalize ${item.status === 'publish' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                }`}
                                            startContent={item.status === 'publish' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                        >
                                            {item.status}
                                        </Chip>
                                    </TableCell>
                                    <TableCell className="p-8 text-center text-sm font-medium text-gray-500">
                                        {item.tanggal}
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
                radius="lg"
                backdrop="blur"
                classNames={{
                    header: "border-b border-gray-50 p-8",
                    footer: "border-t border-gray-50 p-8",
                    body: "p-8",
                }}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        <h3 className="text-2xl font-bold text-gmmi-navy">{editingItem ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}</h3>
                        <p className="text-sm text-gray-500 font-medium">Isi informasi yang ingin Anda sampaikan ke jemaat.</p>
                    </ModalHeader>
                    <ModalBody className="gap-6">
                        <Textarea
                            label="Isi Pengumuman"
                            placeholder="Tulis pesan lengkap di sini..."
                            labelPlacement="outside"
                            variant="bordered"
                            isRequired
                            value={formData.isi}
                            onChange={(e) => setFormData({ ...formData, isi: e.target.value })}
                            classNames={{
                                label: "font-bold text-gmmi-navy pb-2",
                                input: "text-lg p-2 min-h-[200px]",
                                inputWrapper: "border-gray-200 focus-within:!border-gmmi-navy rounded-[1.5rem]",
                            }}
                        />

                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-bold text-gmmi-navy">Status Publikasi</label>
                            <div className="flex gap-4">
                                <Button
                                    onPress={() => setFormData({ ...formData, status: 'publish' })}
                                    variant={formData.status === 'publish' ? 'solid' : 'flat'}
                                    className={`rounded-2xl h-14 flex-1 font-bold ${formData.status === 'publish' ? 'bg-gmmi-navy text-white shadow-lg shadow-gmmi-navy/20' : 'bg-gray-50 text-gray-500'}`}
                                    startContent={<Send className="w-4 h-4" />}
                                >
                                    Langsung Publish
                                </Button>
                                <Button
                                    onPress={() => setFormData({ ...formData, status: 'draft' })}
                                    variant={formData.status === 'draft' ? 'solid' : 'flat'}
                                    className={`rounded-2xl h-14 flex-1 font-bold ${formData.status === 'draft' ? 'bg-amber-100 text-amber-700' : 'bg-gray-50 text-gray-500'}`}
                                    startContent={<Save className="w-4 h-4" />}
                                >
                                    Simpan sebagai Draft
                                </Button>
                            </div>
                        </div>

                        <Alert
                            color="warning"
                            variant="flat"
                            title="Perhatian"
                            description="Pengumuman yang sudah dipublish akan langsung muncul di portal publik jemaat."
                            icon={<AlertCircle className="w-4 h-4" />}
                            className="rounded-2xl border-none p-4"
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={onClose} className="rounded-2xl font-bold h-12 px-6">Batal</Button>
                        <Button
                            onPress={handleSubmit}
                            isLoading={isSubmitting}
                            className="bg-gmmi-navy text-white font-bold rounded-2xl h-12 px-10 shadow-lg shadow-gmmi-navy/20"
                            startContent={<ShieldCheck className="w-4 h-4 text-gmmi-gold" />}
                        >
                            {editingItem ? 'Simpan Perubahan' : 'Selesaikan & Buat'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default Pengumuman;
