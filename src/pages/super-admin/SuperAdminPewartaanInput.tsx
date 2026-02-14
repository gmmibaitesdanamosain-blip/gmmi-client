import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card, CardBody, Input, Button, Textarea, Accordion, AccordionItem,
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Divider, Alert
} from "@heroui/react";
import {
    Save, Plus, Trash2, FileSpreadsheet, FileText,
    Heart, Users, Calendar, Info, Music, ChevronLeft, CheckCircle
} from 'lucide-react';
import {
    createPewartaan, getPewartaanById, updatePewartaan,
    exportPewartaanExcel, exportPewartaanWord
} from '../../services/pewartaan.service';
import { getSectors, getAllJemaat } from '../../services/jemaat.service';
import { Autocomplete, AutocompleteItem, Select, SelectItem } from "@heroui/react";

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
            fetchData(parseInt(id));
        }
        fetchReferenceData();
    }, [id]);

    const fetchReferenceData = async () => {
        try {
            const [secRes, jemRes] = await Promise.all([getSectors(), getAllJemaat()]);
            if (secRes.success) setSectors(secRes.data);
            if (jemRes.success) setJemaatList(jemRes.data);
        } catch (error) {
            console.error("Failed to fetch ref data", error);
        }
    };

    const fetchData = async (wartaId: number) => {
        try {
            const res = await getPewartaanById(wartaId);
            if (res.success) {
                // Ensure date format is YYYY-MM-DD for input
                const data = res.data;
                data.tanggal_ibadah = data.tanggal_ibadah.split('T')[0];
                setFormData(data);
            }
        } catch (error) {
            console.error("Failed to fetch warta", error);
            setMessage({ type: 'danger', text: 'Gagal memuat data warta.' });
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    // Generic Dynamic List Handler
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
        setLoading(true);
        setMessage(null);

        const dataToSave = overrideStatus
            ? { ...formData, status: overrideStatus }
            : formData;

        try {
            if (id) {
                await updatePewartaan(parseInt(id), dataToSave);
                setMessage({ type: 'success', text: 'Warta berhasil diperbarui!' });
                // If we approved it, update local state status too
                if (overrideStatus) setFormData(dataToSave);
            } else {
                const res = await createPewartaan(dataToSave);
                setMessage({ type: 'success', text: 'Warta berhasil disimpan!' });
                navigate(`/super-admin/pewartaan-input/${res.id}`);
            }
        } catch (error) {
            console.error("Failed to save", error);
            setMessage({ type: 'danger', text: 'Gagal menyimpan warta.' });
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
                                onClick={() => exportPewartaanExcel(parseInt(id), formData.judul)}
                            >
                                Excel
                            </Button>
                            <Button
                                color="primary"
                                variant="flat"
                                startContent={<FileText size={18} />}
                                onClick={() => exportPewartaanWord(parseInt(id), formData.judul)}
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
                        {id ? 'Perbarui' : 'Simpan Warta'}
                    </Button>
                </div>
            </div>

            {message && (
                <Alert color={message.type} variant="flat" className="rounded-xl">
                    {message.text}
                </Alert>
            )}

            <Accordion variant="splitted" selectionMode="multiple" defaultExpandedKeys={["main"]}>
                {/* 1. DATA UTAMA */}
                <AccordionItem
                    key="main"
                    aria-label="Data Utama Warta"
                    title="1. Data Utama Warta"
                    subtitle="Informasi dasar ibadah dan tema"
                    startContent={<Info className="text-blue-500" />}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                        <Input
                            label="Judul Warta / Ibadah"
                            placeholder="Contoh: Tata Ibadah Minggu, 08 Februari 2026"
                            value={formData.judul}
                            variant="bordered"
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
                                placeholder="Minggu"
                                value={formData.hari}
                                variant="bordered"
                                onValueChange={(val) => handleInputChange('hari', val)}
                            />
                        </div>
                        <Input
                            label="Tempat / Jemaat"
                            placeholder="GMMI Pusat"
                            value={formData.tempat_jemaat}
                            variant="bordered"
                            onValueChange={(val) => handleInputChange('tempat_jemaat', val)}
                        />
                        <Input
                            label="Ayat Firman Tuhan"
                            placeholder="Yohanes 3:16"
                            value={formData.ayat_firman}
                            variant="bordered"
                            onValueChange={(val) => handleInputChange('ayat_firman', val)}
                        />
                        <Textarea
                            label="Tema Khotbah"
                            placeholder="Kasih Tuhan yang tak berkesudahan"
                            className="md:col-span-2"
                            value={formData.tema_khotbah}
                            variant="bordered"
                            onValueChange={(val) => handleInputChange('tema_khotbah', val)}
                        />
                    </div>
                </AccordionItem>

                {/* 2. TATA IBADAH */}
                <AccordionItem
                    key="tata"
                    aria-label="Tata Ibadah"
                    title="2. Tata Ibadah (Sequence List)"
                    subtitle="Daftar urutan liturgi ibadah"
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
                                            label="Nama Bagian"
                                            placeholder="Saat Teduh"
                                            value={item.nama_bagian}
                                            variant="bordered"
                                            onValueChange={(val) => updateRow('tata_ibadah', idx, 'nama_bagian', val)}
                                        />
                                        <Input
                                            label="Keterangan"
                                            placeholder="Jemaat berdiri"
                                            value={item.keterangan}
                                            variant="bordered"
                                            onValueChange={(val) => updateRow('tata_ibadah', idx, 'keterangan', val)}
                                        />
                                    </div>
                                    <Input
                                        label="Judul Pujian / Lagu (Opsional)"
                                        value={item.judul_pujian}
                                        variant="bordered"
                                        onValueChange={(val) => updateRow('tata_ibadah', idx, 'judul_pujian', val)}
                                    />
                                    <Textarea
                                        label="Isi Lagu / Ayat / Catatan"
                                        value={item.isi_konten}
                                        variant="bordered"
                                        onValueChange={(val) => updateRow('tata_ibadah', idx, 'isi_konten', val)}
                                    />
                                </CardBody>
                            </Card>
                        ))}
                        <Button
                            fullWidth
                            variant="bordered"
                            className="border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50"
                            startContent={<Plus size={18} />}
                            onClick={() => addRow('tata_ibadah', { urutan: formData.tata_ibadah.length + 1, nama_bagian: '', keterangan: '', judul_pujian: '', isi_konten: '' })}
                        >
                            Tambah Bagian Ibadah
                        </Button>
                    </div>
                </AccordionItem>

                {/* 3. POKOK DOA */}
                <AccordionItem
                    key="doa"
                    aria-label="Pokok Doa"
                    title="3. Pokok Doa"
                    subtitle="Kategori dan isi doa syafaat"
                    startContent={<Heart className="text-red-500" />}
                >
                    <div className="space-y-4 pb-4">
                        {formData.pokok_doa.map((item: any, idx: number) => (
                            <div key={item.id || idx} className="flex gap-2 items-start">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <Input
                                        label="Kategori Doa"
                                        placeholder="Bangsa & Negara"
                                        value={item.kategori}
                                        variant="bordered"
                                        onValueChange={(val) => updateRow('pokok_doa', idx, 'kategori', val)}
                                    />
                                    <Input
                                        label="Keterangan (Opsional)"
                                        value={item.keterangan}
                                        variant="bordered"
                                        onValueChange={(val) => updateRow('pokok_doa', idx, 'keterangan', val)}
                                    />
                                </div>
                                <Button isIconOnly className="mt-2" color="danger" variant="light" onClick={() => removeRow('pokok_doa', idx)}>
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        ))}
                        <Button color="primary" variant="flat" startContent={<Plus size={18} />} onClick={() => addRow('pokok_doa', { kategori: '', keterangan: '' })}>
                            Tambah Pokok Doa
                        </Button>
                    </div>
                </AccordionItem>

                {/* 4-7. JEMAAT INFO (TABLES) */}
                <AccordionItem
                    key="jemaat"
                    aria-label="Info Jemaat"
                    title="4–7. Info Jemaat (Ultah, Sakit, Pemulihan, Lansia)"
                    subtitle="Data jemaat mingguan"
                    startContent={<Users className="text-emerald-500" />}
                >
                    <div className="space-y-8 pb-4">
                        {/* Ultah */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-gray-700">Jemaat Berulang Tahun</h4>
                                <Button size="sm" color="primary" variant="flat" startContent={<Plus size={16} />} onClick={() => addRow('jemaat_ultah', { tanggal: '', nama_jemaat: '', keterangan: '' })}>Tambah</Button>
                            </div>
                            <Table aria-label="Ultah Table" className="bg-gray-50 rounded-xl overflow-hidden">
                                <TableHeader>
                                    <TableColumn>TANGGAL</TableColumn>
                                    <TableColumn>NAMA JEMAAT</TableColumn>
                                    <TableColumn>KETERANGAN</TableColumn>
                                    <TableColumn width={50}> </TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {formData.jemaat_ultah.map((item: any, idx: number) => (
                                        <TableRow key={item.id || idx}>
                                            <TableCell><Input type="date" value={item.tanggal} variant="flat" onValueChange={(v) => updateRow('jemaat_ultah', idx, 'tanggal', v)} /></TableCell>
                                            <TableCell>
                                                <Autocomplete
                                                    placeholder="Pilih Jemaat"
                                                    variant="flat"
                                                    allowsCustomValue
                                                    inputValue={item.nama_jemaat}
                                                    onInputChange={(val) => updateRow('jemaat_ultah', idx, 'nama_jemaat', val)}
                                                    onSelectionChange={(key) => {
                                                        if (key) updateRow('jemaat_ultah', idx, 'nama_jemaat', key as string);
                                                    }}
                                                >
                                                    {jemaatList.filter(j => !j.meninggal).map(j => (
                                                        <AutocompleteItem key={j.nama} textValue={j.nama}>
                                                            {j.nama} ({j.nama_sektor})
                                                        </AutocompleteItem>
                                                    ))}
                                                </Autocomplete>
                                            </TableCell>
                                            <TableCell><Input value={item.keterangan} variant="flat" onValueChange={(v) => updateRow('jemaat_ultah', idx, 'keterangan', v)} /></TableCell>
                                            <TableCell><Button isIconOnly size="sm" color="danger" variant="light" onClick={() => removeRow('jemaat_ultah', idx)}><Trash2 size={14} /></Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Repeat for Sakit, Pemulihan, Lansia */}
                        {['jemaat_sakit', 'pemulihan', 'lansia'].map((key) => (
                            <div key={key}>
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-gray-700 uppercase">{key.replace('_', ' ')}</h4>
                                    <Button size="sm" color="primary" variant="flat" startContent={<Plus size={16} />} onClick={() => addRow(key, { nama_jemaat: '', keterangan: '' })}>Tambah</Button>
                                </div>
                                <Table aria-label={`${key} table`}>
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
                                                        placeholder="Pilih Jemaat"
                                                        variant="flat"
                                                        allowsCustomValue
                                                        inputValue={item.nama_jemaat}
                                                        onInputChange={(val) => updateRow(key, idx, 'nama_jemaat', val)}
                                                        onSelectionChange={(k) => {
                                                            if (k) updateRow(key, idx, 'nama_jemaat', k as string);
                                                        }}
                                                    >
                                                        {jemaatList.filter(j => !j.meninggal).map(j => (
                                                            <AutocompleteItem key={j.nama} textValue={j.nama}>
                                                                {j.nama} ({j.nama_sektor})
                                                            </AutocompleteItem>
                                                        ))}
                                                    </Autocomplete>
                                                </TableCell>
                                                <TableCell><Input value={item.keterangan} variant="flat" onValueChange={(v) => updateRow(key, idx, 'keterangan', v)} /></TableCell>
                                                <TableCell><Button isIconOnly size="sm" color="danger" variant="light" onClick={() => removeRow(key, idx)}><Trash2 size={14} /></Button></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ))}
                    </div>
                </AccordionItem>

                {/* 8-10. INFORMASI PELAYANAN */}
                <AccordionItem
                    key="pelayanan"
                    aria-label="Info Pelayanan"
                    title="8–10. Informasi Pelayanan & Sektor"
                    subtitle="Jadwal ibadah, pelayanan sektor, kategorial"
                    startContent={<Calendar className="text-orange-500" />}
                >
                    <div className="space-y-8 pb-4">
                        {/* Info Ibadah */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-gray-700">8. Informasi Ibadah</h4>
                                <Button size="sm" color="primary" variant="flat" startContent={<Plus size={16} />} onClick={() => addRow('info_ibadah', { tanggal: '', jam: '', jenis_ibadah: '', pemimpin: '', sektor: '' })}>Tambah</Button>
                            </div>
                            <Table aria-label="Info Ibadah">
                                <TableHeader>
                                    <TableColumn>TANGGAL</TableColumn>
                                    <TableColumn>JAM</TableColumn>
                                    <TableColumn>JENIS</TableColumn>
                                    <TableColumn>PEMIMPIN</TableColumn>
                                    <TableColumn>SEKTOR</TableColumn>
                                    <TableColumn width={50}> </TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {formData.info_ibadah.map((item: any, idx: number) => (
                                        <TableRow key={item.id || idx}>
                                            <TableCell><Input type="date" value={item.tanggal} variant="flat" onValueChange={(v) => updateRow('info_ibadah', idx, 'tanggal', v)} /></TableCell>
                                            <TableCell><Input placeholder="09:00" value={item.jam} variant="flat" onValueChange={(v) => updateRow('info_ibadah', idx, 'jam', v)} /></TableCell>
                                            <TableCell><Input value={item.jenis_ibadah} variant="flat" onValueChange={(v) => updateRow('info_ibadah', idx, 'jenis_ibadah', v)} /></TableCell>
                                            <TableCell><Input value={item.pemimpin} variant="flat" onValueChange={(v) => updateRow('info_ibadah', idx, 'pemimpin', v)} /></TableCell>
                                            <TableCell><Input value={item.sektor} variant="flat" onValueChange={(v) => updateRow('info_ibadah', idx, 'sektor', v)} /></TableCell>
                                            <TableCell><Button isIconOnly size="sm" color="danger" variant="light" onClick={() => removeRow('info_ibadah', idx)}><Trash2 size={14} /></Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Sektor */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-gray-700">9. Pelayanan Sektor</h4>
                                <Button size="sm" color="primary" variant="flat" startContent={<Plus size={16} />} onClick={() => addRow('pelayanan_sektor', { nomor_sektor: '', tempat: '', pemimpin: '', liturgos: '', nomor_hp: '' })}>Tambah</Button>
                            </div>
                            <Table aria-label="Sektor Table">
                                <TableHeader>
                                    <TableColumn>SEKTOR</TableColumn>
                                    <TableColumn>TEMPAT</TableColumn>
                                    <TableColumn>PEMIMPIN</TableColumn>
                                    <TableColumn>LITURGOS</TableColumn>
                                    <TableColumn>NOMOR HP</TableColumn>
                                    <TableColumn width={50}> </TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {formData.pelayanan_sektor.map((item: any, idx: number) => (
                                        <TableRow key={item.id || idx}>
                                            <TableCell>
                                                <Select
                                                    placeholder="Pilih Sektor"
                                                    variant="flat"
                                                    selectedKeys={item.nomor_sektor ? [item.nomor_sektor] : []}
                                                    onSelectionChange={(keys: any) => {
                                                        const sectorName = Array.from(keys)[0] as string;
                                                        const sector = sectors.find(s => s.nama_sektor === sectorName);
                                                        if (sector) {
                                                            const newList = [...formData.pelayanan_sektor];
                                                            newList[idx] = {
                                                                ...newList[idx],
                                                                nomor_sektor: sector.nama_sektor,
                                                                nomor_hp: sector.no_hp,
                                                                tempat: sector.alamat
                                                            };
                                                            setFormData((p: any) => ({ ...p, pelayanan_sektor: newList }));
                                                        }
                                                    }}
                                                >
                                                    {sectors.map(s => (
                                                        <SelectItem key={s.nama_sektor} textValue={s.nama_sektor}>{s.nama_sektor}</SelectItem>
                                                    ))}
                                                </Select>
                                            </TableCell>
                                            <TableCell><Input value={item.tempat} variant="flat" onValueChange={(v) => updateRow('pelayanan_sektor', idx, 'tempat', v)} /></TableCell>
                                            <TableCell><Input value={item.pemimpin} variant="flat" onValueChange={(v) => updateRow('pelayanan_sektor', idx, 'pemimpin', v)} /></TableCell>
                                            <TableCell><Input value={item.liturgos} variant="flat" onValueChange={(v) => updateRow('pelayanan_sektor', idx, 'liturgos', v)} /></TableCell>
                                            <TableCell><Input placeholder="08..." value={item.nomor_hp} variant="flat" onValueChange={(v) => updateRow('pelayanan_sektor', idx, 'nomor_hp', v)} /></TableCell>
                                            <TableCell><Button isIconOnly size="sm" color="danger" variant="light" onClick={() => removeRow('pelayanan_sektor', idx)}><Trash2 size={14} /></Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Kategorial */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-gray-700">10. Pelayanan Kategorial</h4>
                                <Button size="sm" color="primary" variant="flat" startContent={<Plus size={16} />} onClick={() => addRow('pelayanan_kategorial', { tanggal_waktu: '', kategori_pelayanan: '', tempat: '', pemimpin: '', liturgos_petugas: '' })}>Tambah</Button>
                            </div>
                            <Table aria-label="Kategorial Table">
                                <TableHeader>
                                    <TableColumn>TGL/WAKTU</TableColumn>
                                    <TableColumn>KATEGORI</TableColumn>
                                    <TableColumn>TEMPAT</TableColumn>
                                    <TableColumn>PEMIMPIN</TableColumn>
                                    <TableColumn>PETUGAS</TableColumn>
                                    <TableColumn width={50}> </TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {formData.pelayanan_kategorial.map((item: any, idx: number) => (
                                        <TableRow key={item.id || idx}>
                                            <TableCell><Input type="datetime-local" value={item.tanggal_waktu} variant="flat" onValueChange={(v) => updateRow('pelayanan_kategorial', idx, 'tanggal_waktu', v)} /></TableCell>
                                            <TableCell><Input value={item.kategori_pelayanan} variant="flat" onValueChange={(v) => updateRow('pelayanan_kategorial', idx, 'kategori_pelayanan', v)} /></TableCell>
                                            <TableCell><Input value={item.tempat} variant="flat" onValueChange={(v) => updateRow('pelayanan_kategorial', idx, 'tempat', v)} /></TableCell>
                                            <TableCell><Input value={item.pemimpin} variant="flat" onValueChange={(v) => updateRow('pelayanan_kategorial', idx, 'pemimpin', v)} /></TableCell>
                                            <TableCell><Input value={item.liturgos_petugas} variant="flat" onValueChange={(v) => updateRow('pelayanan_kategorial', idx, 'liturgos_petugas', v)} /></TableCell>
                                            <TableCell><Button isIconOnly size="sm" color="danger" variant="light" onClick={() => removeRow('pelayanan_kategorial', idx)}><Trash2 size={14} /></Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </AccordionItem>
            </Accordion>

            {/* Bottom Actions Floating (Optional) */}
            <Card className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-auto shadow-2xl border border-gray-100 z-50">
                <CardBody className="py-3 px-6 flex flex-row gap-4 items-center">
                    <p className="text-sm text-gray-500 hidden md:block">Status: <span className="font-bold text-gmmi-navy uppercase">{formData.status}</span></p>
                    <Divider orientation="vertical" className="h-6 hidden md:block" />
                    <Button
                        color="secondary"
                        variant="flat"
                        isLoading={loading}
                        startContent={<CheckCircle size={18} />}
                        onClick={() => handleSave('approved')}
                        className="font-bold"
                    >
                        Setujui & Publikasikan
                    </Button>
                    <Button
                        color="primary"
                        isLoading={loading}
                        startContent={<Save size={18} />}
                        onClick={() => handleSave()}
                        className="font-bold"
                    >
                        {id ? 'Perbarui Warta' : 'Simpan Sekarang'}
                    </Button>
                </CardBody>
            </Card>
        </div>
    );
};

export default SuperAdminPewartaanInput;
