import React, { useEffect, useState, useRef } from 'react';
import { Card, CardBody, Button, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Textarea, Image, Switch, Chip, Select, SelectItem } from "@heroui/react";
import { Plus, Trash2, Edit, Save, Upload, ExternalLink, Phone } from 'lucide-react';
import { getCarouselSlidesAdmin, createCarouselSlide, updateCarouselSlide, deleteCarouselSlide } from '../../services/carousel.service';
import type { CarouselSlide } from '../../services/carousel.service';

const CTA_OPTIONS = [
    { label: "Sesi Pewartaan", value: "#pewartaan" },
    { label: "Sesi Pengumuman", value: "#pengumuman" },
    { label: "Sesi Agenda", value: "#agenda" },
    { label: "Sesi Program", value: "#program" },
    { label: "Sesi Sejarah", value: "#sejarah" },
    { label: "Sesi FAQ", value: "#faq" },
    { label: "Layanan Doa (Scroll)", value: "#contact" },
    { label: "WhatsApp (Hubungi Langsung)", value: "wa" },
    { label: "Halaman Agenda Full", value: "/agenda" },
    { label: "Halaman Pewartaan Full", value: "/pewartaan" },
    { label: "Beranda", value: "/" },
    { label: "Custom URL (Manual)", value: "custom" },
];

const CarouselManagement: React.FC = () => {
    const [slides, setSlides] = useState<CarouselSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedSlide, setSelectedSlide] = useState<CarouselSlide | null>(null);
    const [waNumber, setWaNumber] = useState('');
    const [linkType, setLinkType] = useState<string>('custom');
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        quote: '',
        badge: '',
        cta_text: '',
        cta_link: '',
        order_index: 0,
        is_active: true,
        image: null as File | null
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        setLoading(true);
        try {
            const data = await getCarouselSlidesAdmin();
            setSlides(data);
        } catch (error) {
            console.error("Failed to fetch carousel slides", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedSlide(null);
        setFormData({
            title: '',
            subtitle: '',
            quote: '',
            badge: '',
            cta_text: '',
            cta_link: '',
            order_index: slides.length + 1,
            is_active: true,
            image: null
        });
        setLinkType('custom');
        setWaNumber('');
        onOpen();
    };

    const handleEdit = (item: CarouselSlide) => {
        setSelectedSlide(item);

        let type = 'custom';
        let wa = '';

        const link = item.cta_link || '';
        const foundOption = CTA_OPTIONS.find(opt => opt.value !== 'custom' && opt.value !== 'wa' && opt.value === link);

        if (foundOption) {
            type = foundOption.value;
        } else if (link.startsWith('https://wa.me/')) {
            type = 'wa';
            wa = link.replace('https://wa.me/', '');
        }

        setFormData({
            title: item.title,
            subtitle: item.subtitle || '',
            quote: item.quote || '',
            badge: item.badge || '',
            cta_text: item.cta_text || '',
            cta_link: item.cta_link || '',
            order_index: item.order_index,
            is_active: item.is_active,
            image: null
        });
        setLinkType(type);
        setWaNumber(wa);
        onOpen();
    };

    const handleDelete = async (id: number) => {
        if (confirm("Hapus slide carousel ini?")) {
            try {
                await deleteCarouselSlide(id);
                fetchSlides();
            } catch (error) {
                console.error("Failed to delete slide", error);
            }
        }
    };

    const handleSubmit = async (onClose: () => void) => {
        const data = new FormData();
        let finalLink = formData.cta_link;
        if (linkType === 'wa') {
            finalLink = `https://wa.me/${waNumber.startsWith('0') ? '62' + waNumber.substring(1) : waNumber}`;
        } else if (linkType !== 'custom') {
            finalLink = linkType;
        }

        data.append('title', formData.title);
        data.append('subtitle', formData.subtitle);
        data.append('quote', formData.quote);
        data.append('badge', formData.badge);
        data.append('cta_text', formData.cta_text);
        data.append('cta_link', finalLink);
        data.append('order_index', formData.order_index.toString());
        data.append('is_active', formData.is_active.toString());

        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            if (selectedSlide) {
                await updateCarouselSlide(selectedSlide.id, data);
            } else {
                await createCarouselSlide(data);
            }
            fetchSlides();
            onClose();
        } catch (error: any) {
            console.error("Failed to save slide", error);
            const errorMessage = error.response?.data?.message || error.message;
            alert(`Gagal menyimpan slide carousel: ${errorMessage}`);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, image: e.target.files[0] });
        }
    };

    const renderImageUrl = (url: string) => {
        if (url.startsWith('/img/')) return url; // Static images
        return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${url}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gmmi-navy">Manajemen Carousel Hero</h1>
                    <p className="text-gray-500">Kelola gambar dan teks yang tampil di bagian atas beranda.</p>
                </div>
                <Button color="primary" onPress={handleCreate} startContent={<Plus size={18} />}>
                    Tambah Slide
                </Button>
            </div>

            <Card>
                <CardBody>
                    <Table aria-label="Tabel Carousel">
                        <TableHeader>
                            <TableColumn>GAMBAR</TableColumn>
                            <TableColumn>INFO SLIDE</TableColumn>
                            <TableColumn>URUTAN</TableColumn>
                            <TableColumn>STATUS</TableColumn>
                            <TableColumn>AKSI</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={"Belum ada slide carousel."} isLoading={loading}>
                            {slides.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Image
                                            src={renderImageUrl(item.image_url)}
                                            alt={item.title}
                                            width={120}
                                            className="object-cover rounded-lg aspect-video"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-bold text-gmmi-navy">{item.title}</div>
                                        <div className="text-xs text-gray-400 max-w-xs truncate">{item.subtitle}</div>
                                        {item.cta_link && (
                                            <div className="flex items-center gap-1 text-[10px] text-blue-500 mt-1">
                                                <ExternalLink size={10} /> {item.cta_text || 'Link'}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Chip size="sm" variant="flat">{item.order_index}</Chip>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            size="sm"
                                            color={item.is_active ? "success" : "danger"}
                                            variant="flat"
                                        >
                                            {item.is_active ? "Aktif" : "Nonaktif"}
                                        </Chip>
                                    </TableCell>
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

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl" scrollBehavior="inside">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>{selectedSlide ? 'Edit Slide Carousel' : 'Tambah Slide Carousel'}</ModalHeader>
                            <ModalBody className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Judul (Title)"
                                        placeholder="Masukkan judul slide..."
                                        value={formData.title}
                                        onValueChange={(v) => setFormData({ ...formData, title: v })}
                                    />
                                    <Input
                                        label="Badge (Small Text)"
                                        placeholder="Misal: Selamat Datang"
                                        value={formData.badge}
                                        onValueChange={(v) => setFormData({ ...formData, badge: v })}
                                    />
                                </div>
                                <Textarea
                                    label="Subjudul (Subtitle)"
                                    placeholder="Masukkan deskripsi singkat..."
                                    value={formData.subtitle}
                                    onValueChange={(v) => setFormData({ ...formData, subtitle: v })}
                                />
                                <Textarea
                                    label="Ayat / Kutipan (Quote)"
                                    placeholder="Masukkan ayat Alkitab atau kutipan..."
                                    value={formData.quote}
                                    onValueChange={(v) => setFormData({ ...formData, quote: v })}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Teks Tombol (CTA Text)"
                                        placeholder="Misal: Selengkapnya"
                                        value={formData.cta_text}
                                        onValueChange={(v) => setFormData({ ...formData, cta_text: v })}
                                    />
                                    <Select
                                        label="Tujuan Link (Redirection)"
                                        placeholder="Pilih tujuan..."
                                        selectedKeys={new Set([linkType])}
                                        onSelectionChange={(keys) => {
                                            const val = Array.from(keys)[0] as string;
                                            if (val) setLinkType(val);
                                        }}
                                    >
                                        {CTA_OPTIONS.map((opt) => (
                                            <SelectItem key={opt.value} textValue={opt.label}>
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>

                                {linkType === 'custom' && (
                                    <Input
                                        label="Link Manual (Custom URL)"
                                        placeholder="Masukkan URL atau path (misal: /agenda)"
                                        value={formData.cta_link}
                                        onValueChange={(v) => setFormData({ ...formData, cta_link: v })}
                                    />
                                )}

                                {linkType === 'wa' && (
                                    <Input
                                        label="Nomor WhatsApp"
                                        placeholder="Misal: 08123456789 atau 6281..."
                                        startContent={<Phone size={16} className="text-gray-400" />}
                                        value={waNumber}
                                        onValueChange={setWaNumber}
                                        description="Masukkan nomor WhatsApp yang akan dihubungi."
                                    />
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                    <Input
                                        type="number"
                                        label="Urutan"
                                        value={formData.order_index.toString()}
                                        onValueChange={(v) => setFormData({ ...formData, order_index: parseInt(v) || 0 })}
                                    />
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-medium">Status Aktif</span>
                                        <Switch
                                            isSelected={formData.is_active}
                                            onValueChange={(v) => setFormData({ ...formData, is_active: v })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Gambar Slide</label>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-4">
                                            <Button onPress={() => fileInputRef.current?.click()} startContent={<Upload size={16} />}>
                                                Upload Gambar Baru
                                            </Button>
                                            <input
                                                type="file"
                                                hidden
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                accept="image/*"
                                            />
                                            {formData.image && <span className="text-xs text-green-500">{formData.image.name}</span>}
                                        </div>
                                        {selectedSlide && !formData.image && (
                                            <div className="relative group w-full max-w-md">
                                                <p className="text-xs text-gray-400 mb-1">Gambar saat ini:</p>
                                                <Image
                                                    src={renderImageUrl(selectedSlide.image_url)}
                                                    alt="Preview"
                                                    className="w-full rounded-lg aspect-video object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>Batal</Button>
                                <Button color="primary" onPress={() => handleSubmit(onClose)} startContent={<Save size={18} />}>
                                    Simpan Slide
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default CarouselManagement;
