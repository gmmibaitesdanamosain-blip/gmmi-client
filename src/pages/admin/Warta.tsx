import React, { useEffect, useState } from 'react';
import {
    getWarta,
    createWarta,
    updateWarta,
    deleteWarta
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
    Tooltip,
    Pagination,
    Skeleton
} from "@heroui/react";
import {
    BookOpen,
    Plus,
    Pencil,
    Trash2,
    Search,
    Eye,
    Calendar,
    FileText
} from 'lucide-react';

type Warta = {
    id: string;
    judul: string;
    isi: string;
    tanggal: string;
    thumbnail?: string;
};

const Warta: React.FC = () => {
    const [wartaList, setWartaList] = useState<Warta[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isPreviewOpen, onOpen: onPreviewOpen, onClose: onPreviewClose } = useDisclosure();
    const [editingItem, setEditingItem] = useState<Warta | null>(null);
    const [previewItem, setPreviewItem] = useState<Warta | null>(null);
    const [formData, setFormData] = useState({
        judul: '',
        isi: '',
        thumbnailFile: null as File | null,
        thumbnailPreview: '' as string
    });

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await getWarta(currentPage, 10);
            setWartaList(data.data || data);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching warta:', error);
            setWartaList([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item?: Warta) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                judul: item.judul,
                isi: item.isi,
                thumbnailFile: null,
                thumbnailPreview: item.thumbnail || ''
            });
        } else {
            setEditingItem(null);
            setFormData({
                judul: '',
                isi: '',
                thumbnailFile: null,
                thumbnailPreview: ''
            });
        }
        onOpen();
    };

    const handlePreview = (item: Warta) => {
        setPreviewItem(item);
        onPreviewOpen();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                alert('Hanya file gambar yang diperbolehkan (jpeg, jpg, png, gif, webp)');
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Ukuran file maksimal 5MB');
                return;
            }

            setFormData({
                ...formData,
                thumbnailFile: file,
                thumbnailPreview: URL.createObjectURL(file)
            });
        }
    };

    const handleSubmit = async () => {
        if (!formData.judul.trim() || !formData.isi.trim()) return;
        setIsSubmitting(true);
        try {
            const submitData = new FormData();
            submitData.append('judul', formData.judul);
            submitData.append('isi', formData.isi);
            submitData.append('tanggal', new Date().toISOString().split('T')[0]);
            submitData.append('status', 'publish');

            if (formData.thumbnailFile) {
                submitData.append('thumbnail', formData.thumbnailFile);
            }

            if (editingItem) {
                await updateWarta(editingItem.id, submitData);
            } else {
                await createWarta(submitData);
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
        if (window.confirm('Apakah Anda yakin ingin menghapus warta ini?')) {
            try {
                await deleteWarta(id);
                fetchData();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const filteredData = wartaList.filter(item =>
        item.judul.toLowerCase().includes(search.toLowerCase()) ||
        item.isi.toLowerCase().includes(search.toLowerCase())
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
                    <h1 className="text-4xl font-bold text-gmmi-navy tracking-tight">Warta Jemaat</h1>
                    <p className="text-gray-500 font-medium">Kelola warta dan informasi berkala untuk jemaat.</p>
                </div>
                <Button
                    onPress={() => handleOpenModal()}
                    className="bg-gmmi-navy text-white font-bold rounded-2xl h-14 px-8 shadow-lg shadow-gmmi-navy/20"
                    startContent={<Plus className="w-5 h-5" />}
                >
                    Buat Warta Baru
                </Button>
            </header>

            {/* Search */}
            <Card className="rounded-[2rem] border border-gray-100 shadow-sm">
                <CardBody className="p-6">
                    <Input
                        placeholder="Cari judul atau isi warta..."
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

            {/* Table */}
            <Card className="rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <CardBody className="p-0">
                    <Table aria-label="Tabel Warta" removeWrapper className="bg-transparent">
                        <TableHeader>
                            <TableColumn className="bg-transparent p-8 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-50">JUDUL</TableColumn>
                            <TableColumn className="bg-transparent p-8 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-50">ISI</TableColumn>
                            <TableColumn className="bg-transparent p-8 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-50 text-center">TANGGAL</TableColumn>
                            <TableColumn className="bg-transparent p-8 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-50 text-right">AKSI</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={<div className="py-20 italic text-gray-400">Belum ada warta yang dibuat.</div>}>
                            {filteredData.map((item) => (
                                <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0 group">
                                    <TableCell className="p-8">
                                        <div className="flex items-center gap-4">
                                            {item.thumbnail ? (
                                                <img src={item.thumbnail} alt={item.judul} className="w-12 h-12 rounded-xl object-cover" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                                    <FileText className="w-6 h-6 text-blue-600" />
                                                </div>
                                            )}
                                            <p className="text-gmmi-navy font-bold">{item.judul}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="p-8">
                                        <p className="text-gray-600 line-clamp-2 max-w-md">{item.isi}</p>
                                    </TableCell>
                                    <TableCell className="p-8 text-center">
                                        <Chip
                                            size="sm"
                                            variant="flat"
                                            className="bg-slate-50 text-slate-600 font-medium"
                                            startContent={<Calendar className="w-3 h-3" />}
                                        >
                                            {item.tanggal}
                                        </Chip>
                                    </TableCell>
                                    <TableCell className="p-8 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Tooltip content="Preview">
                                                <Button isIconOnly variant="flat" onPress={() => handlePreview(item)} className="bg-purple-50 text-purple-600 rounded-xl">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip content="Edit Warta">
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
                {totalPages > 1 && (
                    <div className="flex justify-center p-8 border-t border-gray-50">
                        <Pagination
                            total={totalPages}
                            page={currentPage}
                            onChange={setCurrentPage}
                            classNames={{
                                cursor: "bg-gmmi-navy text-white font-bold",
                            }}
                        />
                    </div>
                )}
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
                        <h3 className="text-2xl font-bold text-gmmi-navy">{editingItem ? 'Edit Warta' : 'Buat Warta Baru'}</h3>
                        <p className="text-sm text-gray-500 font-medium">Isi informasi warta jemaat.</p>
                    </ModalHeader>
                    <ModalBody className="gap-6">
                        <Input
                            label="Judul Warta"
                            placeholder="Contoh: Warta Jemaat Edisi Februari 2026"
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

                        <Textarea
                            label="Isi Warta"
                            placeholder="Tulis konten warta lengkap di sini..."
                            labelPlacement="outside"
                            variant="bordered"
                            isRequired
                            value={formData.isi}
                            onChange={(e) => setFormData({ ...formData, isi: e.target.value })}
                            classNames={{
                                label: "font-bold text-gmmi-navy pb-2",
                                input: "text-lg p-2 min-h-[250px]",
                                inputWrapper: "border-gray-200 focus-within:!border-gmmi-navy rounded-[1.5rem]",
                            }}
                        />

                        <div className="space-y-2">
                            <label className="font-bold text-gmmi-navy pb-2 block">Thumbnail (Opsional)</label>
                            <div className="flex flex-col gap-4">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-3 file:px-6
                                        file:rounded-2xl file:border-0
                                        file:text-sm file:font-bold
                                        file:bg-gmmi-navy file:text-white
                                        hover:file:bg-gmmi-navy/90
                                        file:cursor-pointer cursor-pointer
                                        border border-gray-200 rounded-[1.5rem] p-3"
                                />
                                {formData.thumbnailPreview && (
                                    <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-gray-200">
                                        <img
                                            src={formData.thumbnailPreview.startsWith('blob:')
                                                ? formData.thumbnailPreview
                                                : `http://localhost:3000${formData.thumbnailPreview}`
                                            }
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={onClose} className="rounded-2xl font-bold h-12 px-6">Batal</Button>
                        <Button
                            onPress={handleSubmit}
                            isLoading={isSubmitting}
                            className="bg-gmmi-navy text-white font-bold rounded-2xl h-12 px-10 shadow-lg shadow-gmmi-navy/20"
                            startContent={<BookOpen className="w-4 h-4 text-gmmi-gold" />}
                        >
                            {editingItem ? 'Simpan Perubahan' : 'Publikasikan Warta'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Preview Modal */}
            <Modal
                isOpen={isPreviewOpen}
                onClose={onPreviewClose}
                size="3xl"
                scrollBehavior="inside"
                classNames={{
                    header: "border-b border-gray-50 p-8",
                    body: "p-8",
                }}
            >
                <ModalContent>
                    <ModalHeader>
                        <h3 className="text-2xl font-bold text-gmmi-navy">Preview Warta</h3>
                    </ModalHeader>
                    <ModalBody>
                        {previewItem && (
                            <div className="space-y-6">
                                {previewItem.thumbnail && (
                                    <img src={previewItem.thumbnail} alt={previewItem.judul} className="w-full h-64 object-cover rounded-2xl" />
                                )}
                                <div>
                                    <h2 className="text-3xl font-bold text-gmmi-navy mb-2">{previewItem.judul}</h2>
                                    <p className="text-sm text-gray-500 font-medium">{previewItem.tanggal}</p>
                                </div>
                                <div className="prose prose-lg max-w-none">
                                    <p className="text-gray-700 whitespace-pre-wrap">{previewItem.isi}</p>
                                </div>
                            </div>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default Warta;
