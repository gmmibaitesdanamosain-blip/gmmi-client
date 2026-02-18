import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Button,
    Input,
    Card,
    CardBody,
    Accordion,
    AccordionItem,
    Autocomplete,
    AutocompleteItem,
    Select,
    SelectItem,
    Alert,
    addToast,
    Textarea,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    type Selection
} from "@heroui/react";
import {
    ChevronLeft, Plus, Trash2, Save, FileText, Heart,
    Users, Calendar, Info, Music, FileSpreadsheet, CheckCircle
} from 'lucide-react';

import {
    createPewartaan, getPewartaanById, updatePewartaan,
    exportPewartaanExcel, exportPewartaanWord
} from '../../services/pewartaan.service';
import { getSectors, getAllJemaat } from '../../services/jemaat.service';

const SuperAdminPewartaanInput: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null);
    const [sectors, setSectors] = useState<any[]>([]);
    const [jemaatList, setJemaatList] = useState<any[]>([]);

    // Form State
    const [formData, setFormData] = useState<any>({
        judul: '',
        tanggal_ibadah: '',
        hari: '',
        tempat_jemaat: '',
        ayat_firman: '',
        tema_khotbah: '',
        status: 'draft',
        tata_ibadah: [],
        pokok_doa: [],
        jemaat_ultah: [],
        jemaat_sakit: [],
        pemulihan: [],
        lansia: [],
        info_ibadah: [],
        pelayanan_sektor: [],
        pelayanan_kategorial: []
    });

    useEffect(() => {
        if (id) {
            fetchData(id);
        }
        fetchReferenceData();
    }, [id]);

    const fetchReferenceData = async () => {
        try {
            const [secRes, jemRes] = await Promise.all([getSectors(), getAllJemaat()]);

            if (secRes.success && secRes.data) {
                setSectors(Array.isArray(secRes.data) ? secRes.data : []);
            } else if (Array.isArray(secRes)) {
                setSectors(secRes);
            }

            if (jemRes.success && jemRes.data) {
                setJemaatList(Array.isArray(jemRes.data) ? jemRes.data : []);
            } else if (Array.isArray(jemRes)) {
                setJemaatList(jemRes);
            }
        } catch (error) {
            console.error("Failed to fetch ref data", error);
        }
    };

    const fetchData = async (wartaId: string) => {
        try {
            const res = await getPewartaanById(wartaId);
            if (res.success && res.data) {
                const data = res.data;
                if (data.tanggal_ibadah && typeof data.tanggal_ibadah === 'string') {
                    data.tanggal_ibadah = data.tanggal_ibadah.split('T')[0];
                }

                const arrayFields = [
                    'tata_ibadah', 'pokok_doa', 'jemaat_ultah', 'jemaat_sakit',
                    'pemulihan', 'lansia', 'info_ibadah', 'pelayanan_sektor', 'pelayanan_kategorial'
                ];

                arrayFields.forEach(field => {
                    if (!data[field]) data[field] = [];
                });

                setFormData(data);
            }
        } catch (error: any) {
            console.error("Failed to fetch warta", error);
            const msg = error.message || 'Gagal memuat data warta.';
            addToast({ title: msg, color: 'danger' });
            setMessage({ type: 'danger', text: msg });
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const addRow = (section: string, defaultRow: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [section]: [...prev[section], { ...defaultRow, id: Date.now() }]
        }));
    };

    const removeRow = (section: string, index: number) => {
        setFormData((prev: any) => ({
            ...prev,
            [section]: prev[section].filter((_: any, i: number) => i !== index)
        }));
    };

    const updateRow = (section: string, index: number, field: string, value: any) => {
        setFormData((prev: any) => {
            const newList = [...prev[section]];
            newList[index] = { ...newList[index], [field]: value };
            return { ...prev, [section]: newList };
        });
    };

    const handleSave = async (overrideStatus?: string) => {
        if (!formData.judul || formData.judul.trim() === '') {
            addToast({ title: "Judul Warta wajib diisi!", variant: "solid", color: "danger" });
            return;
        }

        if (!formData.tanggal_ibadah) {
            addToast({ title: "Tanggal Ibadah wajib diisi!", variant: "solid", color: "danger" });
            return;
        }

        setLoading(true);
        setMessage(null);

        const dataToSave = overrideStatus ? { ...formData, status: overrideStatus } : formData;

        try {
            if (id) {
                await updatePewartaan(id, dataToSave);
                addToast({ title: "Warta berhasil diperbarui!", variant: "solid", color: "success" });
                if (overrideStatus) setFormData(dataToSave);
            } else {
                const res = await createPewartaan(dataToSave);
                addToast({ title: "Warta berhasil disimpan!", variant: "solid", color: "success" });
                const newId = res.id || (res.data && res.data.id);
                if (newId) {
                    navigate(`/super-admin/pewartaan-input/${newId}`);
                }
            }
        } catch (error: any) {
            console.error("Failed to save", error);
            const errorMsg = error.message || 'Gagal menyimpan warta.';
            addToast({ title: errorMsg, variant: "solid", color: "danger" });
            setMessage({ type: 'danger', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <Button isIconOnly variant="light" onClick={() => navigate('/super-admin/warta')}>
                        <ChevronLeft size={24} />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gmmi-navy">Input Warta Ibadah</h1>
                        <p className="text-gray-500">Isi data pewartaan jemaat secara lengkap dan dinamis.</p>
                    </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    {id && (
                        <>
                            <Button
                                color="success"
                                variant="flat"
                                startContent={<FileSpreadsheet size={18} />}
                                onClick={() => exportPewartaanExcel(id, formData.judul)}
                            >
                                Excel
                            </Button>
                            <Button
                                color="primary"
                                variant="flat"
                                startContent={<FileText size={18} />}
                                onClick={() => exportPewartaanWord(id, formData.judul)}
                            >
                                Word
                            </Button>
                        </>
                    )}
                    <Button
                        color="secondary"
                        variant="flat"
                        isLoading={loading}
                        startContent={<CheckCircle size={18} />}
                        onClick={() => handleSave('approved')}
                        className="flex-1 md:flex-none font-bold"
                    >
                        Simpan & Setujui
                    </Button>
                    <Button
                        color="primary"
                        isLoading={loading}
                        startContent={<Save size={18} />}
                        onClick={() => handleSave()}
                        className="flex-1 md:flex-none font-bold"
                    >
                        {id ? 'Perbarui Warta' : 'Simpan Warta'}
                    </Button>
                </div>
            </div>

            {message && (
                <Alert color={message.type} variant="flat" className="rounded-xl">
                    {message.text}
                </Alert>
            )}

            <Accordion variant="splitted" selectionMode="multiple" defaultExpandedKeys={["main"]}>
                <AccordionItem
                    key="main"
                    aria-label="Data Utama Warta"
                    title="1. Data Utama Warta"
                    startContent={<Info className="text-blue-500" />}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                        <Input
                            label="Judul Warta / Ibadah"
                            value={formData.judul}
                            variant="bordered"
                            isRequired
                            onValueChange={(val) => handleInputChange('judul', val)}
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <Input
                                type="date"
                                label="Tanggal Ibadah"
                                value={formData.tanggal_ibadah}
                                variant="bordered"
                                onValueChange={(val) => handleInputChange('tanggal_ibadah', val)}
                            />
                            <Input
                                label="Hari"
                                value={formData.hari}
                                variant="bordered"
                                onValueChange={(val) => handleInputChange('hari', val)}
                            />
                        </div>
                        <Input
                            label="Tempat / Jemaat"
                            value={formData.tempat_jemaat}
                            variant="bordered"
                            onValueChange={(val) => handleInputChange('tempat_jemaat', val)}
                        />
                        <Input
                            label="Ayat Firman Tuhan"
                            value={formData.ayat_firman}
                            variant="bordered"
                            onValueChange={(val) => handleInputChange('ayat_firman', val)}
                        />
                        <Textarea
                            label="Tema Khotbah"
                            className="md:col-span-2"
                            value={formData.tema_khotbah}
                            variant="bordered"
                            onValueChange={(val) => handleInputChange('tema_khotbah', val)}
                        />
                    </div>
                </AccordionItem>

                <AccordionItem
                    key="tata"
                    title="2. Tata Ibadah"
                    startContent={<Music className="text-purple-500" />}
                >
                    <div className="space-y-4 pb-4">
                        {formData.tata_ibadah.map((item: any, idx: number) => (
                            <Card key={item.id || idx} className="border border-gray-100 shadow-sm bg-gray-50/50">
                                <CardBody className="p-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-gmmi-navy">Bagian #{idx + 1}</span>
                                        <Button isIconOnly size="sm" color="danger" variant="light" onClick={() => removeRow('tata_ibadah', idx)}>
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <Input
                                            label="Urutan"
                                            type="number"
                                            value={item.urutan}
                                            variant="bordered"
                                            onValueChange={(val) => updateRow('tata_ibadah', idx, 'urutan', val)}
                                        />
                                        <Input
                                            label="Bagian"
                                            value={item.nama_bagian || ''}
                                            variant="bordered"
                                            onValueChange={(val) => updateRow('tata_ibadah', idx, 'nama_bagian', val)}
                                        />
                                        <Input
                                            label="Keterangan"
                                            value={item.keterangan || ''}
                                            variant="bordered"
                                            onValueChange={(val) => updateRow('tata_ibadah', idx, 'keterangan', val)}
                                        />
                                    </div>
                                    <Input
                                        label="Judul Pujian"
                                        value={item.judul_pujian || ''}
                                        variant="bordered"
                                        onValueChange={(val) => updateRow('tata_ibadah', idx, 'judul_pujian', val)}
                                    />
                                    <Textarea
                                        label="Isi Konten"
                                        value={item.isi_konten || ''}
                                        variant="bordered"
                                        onValueChange={(val) => updateRow('tata_ibadah', idx, 'isi_konten', val)}
                                    />
                                </CardBody>
                            </Card>
                        ))}
                        <Button fullWidth variant="bordered" className="border-dashed" startContent={<Plus size={18} />} onClick={() => addRow('tata_ibadah', { urutan: formData.tata_ibadah.length + 1 })}>
                            Tambah Bagian
                        </Button>
                    </div>
                </AccordionItem>

                <AccordionItem
                    key="doa"
                    title="3. Pokok Doa"
                    startContent={<Heart className="text-red-500" />}
                >
                    <div className="space-y-4 pb-4">
                        {formData.pokok_doa.map((item: any, idx: number) => (
                            <div key={item.id || idx} className="flex gap-2">
                                <Input label="Kategori" value={item.kategori || ''} variant="bordered" onValueChange={(v) => updateRow('pokok_doa', idx, 'kategori', v)} />
                                <Input label="Keterangan" value={item.keterangan || ''} variant="bordered" onValueChange={(v) => updateRow('pokok_doa', idx, 'keterangan', v)} />
                                <Button isIconOnly color="danger" variant="light" onClick={() => removeRow('pokok_doa', idx)}><Trash2 size={18} /></Button>
                            </div>
                        ))}
                        <Button variant="flat" startContent={<Plus size={18} />} onClick={() => addRow('pokok_doa', { kategori: '', keterangan: '' })}>Tambah</Button>
                    </div>
                </AccordionItem>

                <AccordionItem
                    key="jemaat"
                    title="4–7. Info Jemaat"
                    startContent={<Users className="text-emerald-500" />}
                >
                    <div className="space-y-8 pb-4">
                        {['jemaat_ultah', 'jemaat_sakit', 'pemulihan', 'lansia'].map((key) => (
                            <div key={key}>
                                <div className="flex justify-between mb-2">
                                    <h4 className="font-bold uppercase">{key.replace('_', ' ')}</h4>
                                    <Button size="sm" variant="flat" onClick={() => addRow(key, { nama_jemaat: '', keterangan: '', tanggal: '' })}>Tambah</Button>
                                </div>
                                <Table aria-label={key}>
                                    <TableHeader>
                                        <TableColumn>NAMA JEMAAT</TableColumn>
                                        <TableColumn>KETERANGAN</TableColumn>
                                        <TableColumn width={50}> </TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        {formData[key].map((item: any, idx: number) => (
                                            <TableRow key={item.id || idx}>
                                                <TableCell>
                                                    <Autocomplete
                                                        allowsCustomValue
                                                        label="Pilih Jemaat"
                                                        inputValue={item.nama_jemaat || ''}
                                                        onInputChange={(v) => updateRow(key, idx, 'nama_jemaat', v)}
                                                        onSelectionChange={(k) => k && updateRow(key, idx, 'nama_jemaat', String(k))}
                                                    >
                                                        {jemaatList.filter(j => !j.meninggal).map(j => (
                                                            <AutocompleteItem key={j.nama} textValue={j.nama}>{j.nama}</AutocompleteItem>
                                                        ))}
                                                    </Autocomplete>
                                                </TableCell>
                                                <TableCell><Input value={item.keterangan || ''} variant="flat" onValueChange={(v) => updateRow(key, idx, 'keterangan', v)} /></TableCell>
                                                <TableCell><Button isIconOnly size="sm" color="danger" variant="light" onClick={() => removeRow(key, idx)}><Trash2 size={14} /></Button></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ))}
                    </div>
                </AccordionItem>

                <AccordionItem
                    key="pelayanan"
                    title="8–10. Pelayanan"
                    startContent={<Calendar className="text-orange-500" />}
                >
                    <div className="space-y-8 pb-4">
                        <Table aria-label="Sektor">
                            <TableHeader>
                                <TableColumn>SEKTOR</TableColumn>
                                <TableColumn>TEMPAT</TableColumn>
                                <TableColumn>PEMIMPIN</TableColumn>
                                <TableColumn width={50}> </TableColumn>
                            </TableHeader>
                            <TableBody>
                                {formData.pelayanan_sektor.map((item: any, idx: number) => (
                                    <TableRow key={item.id || idx}>
                                        <TableCell>
                                            <Select
                                                label="Sektor"
                                                selectedKeys={new Set(item.nomor_sektor ? [item.nomor_sektor] : []) as Selection}
                                                onSelectionChange={(keys: Selection) => {
                                                    const name = Array.from(keys)[0] as string;
                                                    const s = sectors.find(sec => sec.nama_sektor === name);
                                                    if (s) {
                                                        const newList = [...formData.pelayanan_sektor];
                                                        newList[idx] = { ...newList[idx], nomor_sektor: s.nama_sektor, tempat: s.alamat };
                                                        setFormData((p: any) => ({ ...p, pelayanan_sektor: newList }));
                                                    }
                                                }}
                                            >
                                                {sectors.map(s => <SelectItem key={s.nama_sektor} textValue={s.nama_sektor}>{s.nama_sektor}</SelectItem>)}
                                            </Select>
                                        </TableCell>
                                        <TableCell><Input value={item.tempat || ''} variant="flat" onValueChange={(v) => updateRow('pelayanan_sektor', idx, 'tempat', v)} /></TableCell>
                                        <TableCell><Input value={item.pemimpin || ''} variant="flat" onValueChange={(v) => updateRow('pelayanan_sektor', idx, 'pemimpin', v)} /></TableCell>
                                        <TableCell><Button isIconOnly size="sm" color="danger" variant="light" onClick={() => removeRow('pelayanan_sektor', idx)}><Trash2 size={14} /></Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Button variant="flat" startContent={<Plus size={16} />} onClick={() => addRow('pelayanan_sektor', { nomor_sektor: '', tempat: '', pemimpin: '' })}>Tambah Sektor</Button>
                    </div>
                </AccordionItem>
            </Accordion>

            <Card className="fixed bottom-6 left-1/2 -translate-x-1/2 shadow-2xl z-50">
                <CardBody className="flex flex-row gap-4 items-center py-2 px-4">
                    <Button
                        color="secondary"
                        variant="flat"
                        isLoading={loading}
                        startContent={<CheckCircle size={18} />}
                        onClick={() => handleSave('approved')}
                    >
                        Setujui
                    </Button>
                    <Button
                        color="primary"
                        isLoading={loading}
                        startContent={<Save size={18} />}
                        onClick={() => handleSave()}
                    >
                        Simpan
                    </Button>
                </CardBody>
            </Card>
        </div>
    );
};

export default SuperAdminPewartaanInput;
