import React, { useEffect, useState } from 'react';
import { Card, CardBody, Button, Input, Select, SelectItem, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { Link } from 'react-router-dom';
import { Search, Eye, Download, CheckCircle, XCircle, Plus, FileText, Trash2 } from 'lucide-react';
import { getAllWarta, updateWartaStatus, deleteWarta } from '../../services/superAdmin.service';
import { exportPewartaanExcel, exportPewartaanWord } from '../../services/pewartaan.service';


const Warta: React.FC = () => {
    const [wartaList, setWartaList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', branch: 'all', date: '' });
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedWarta, setSelectedWarta] = useState<any | null>(null);

    useEffect(() => {
        fetchWarta();
    }, [filters]);

    const fetchWarta = async () => {
        setLoading(true);
        try {
            const res = await getAllWarta(filters);
            if (res.success) {
                setWartaList(res.data);
            } else {
                setWartaList([]);
            }
        } catch (error) {
            console.error("Failed to fetch warta", error);
            setWartaList([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        if (confirm("Setujui warta ini?")) {
            try {
                await updateWartaStatus(id, 'approved');
                fetchWarta();
                if (selectedWarta?.id === id) onOpenChange(); // Close modal if open
            } catch (error) {
                console.error("Failed to approve warta", error);
            }
        }
    };

    const handleReject = async (id: string) => {
        if (confirm("Tolak warta ini?")) {
            try {
                await updateWartaStatus(id, 'rejected');
                fetchWarta();
                if (selectedWarta?.id === id) onOpenChange(); // Close modal if open
            } catch (error) {
                console.error("Failed to reject warta", error);
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus warta ini? Tindakan ini tidak dapat dibatalkan.")) {
            try {
                await deleteWarta(id);
                fetchWarta();
                if (selectedWarta?.id === id) onOpenChange(); // Close modal if open
            } catch (error) {
                console.error("Failed to delete warta", error);
                alert("Gagal menghapus warta. Silakan coba lagi.");
            }
        }
    };

    const handleViewDetail = (item: any) => {
        setSelectedWarta(item);
        onOpen();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gmmi-navy">Warta Jemaat Global</h1>
                    <p className="text-gray-500">Pantau warta jemaat dari seluruh cabang.</p>
                </div>
                <div className="flex items-center gap-6">
                    <Button
                        as={Link}
                        to="/super-admin/pewartaan-input"
                        color="primary"
                        startContent={<Plus size={18} />}
                        className="font-bold"
                    >
                        Tambah Warta Struktural
                    </Button>

                </div>
            </div>

            <Card className="border border-gray-100 shadow-sm">
                <CardBody>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <Input
                            placeholder="Cari judul warta..."
                            startContent={<Search className="text-gray-400" size={18} />}
                            className="w-full md:max-w-xs"
                            variant="bordered"
                            value={filters.search}
                            onValueChange={(val) => setFilters({ ...filters, search: val })}
                        />
                        <Select
                            placeholder="Pilih Cabang"
                            className="w-full md:max-w-xs"
                            variant="bordered"
                            // selectedKeys={[filters.branch]}
                            onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                        >
                            <SelectItem key="all">Semua Cabang</SelectItem>
                            <SelectItem key="pusat">GMMI Pusat</SelectItem>
                            <SelectItem key="sby">GMMI Surabaya</SelectItem>
                        </Select>
                        <Input
                            type="date"
                            className="w-full md:max-w-xs"
                            variant="bordered"
                            value={filters.date}
                            onValueChange={(val) => setFilters({ ...filters, date: val })}
                        />
                    </div>

                    <Table aria-label="Tabel Warta Global">
                        <TableHeader>
                            <TableColumn>JUDUL WARTA</TableColumn>
                            <TableColumn>CABANG</TableColumn>
                            <TableColumn>TANGGAL IBADAH</TableColumn>
                            <TableColumn>STATUS</TableColumn>
                            <TableColumn>AKSI</TableColumn>
                        </TableHeader>
                        <TableBody
                            emptyContent={"Tidak ada warta ditemukan."}
                            isLoading={loading}
                            loadingContent={<div className="flex items-center gap-2 font-bold text-gmmi-navy">Memuat Data...</div>}
                        >
                            {wartaList.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="font-semibold text-gmmi-navy">{item.judul}</div>
                                    </TableCell>
                                    <TableCell>{item.tempat_jemaat}</TableCell>
                                    <TableCell>{new Date(item.tanggal_ibadah).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                                    <TableCell>
                                        <Chip
                                            color={item.status === 'approved' ? "success" : item.status === 'pending' ? "warning" : "danger"}
                                            variant="flat"
                                            size="sm"
                                        >
                                            {item.status.toUpperCase()}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Tooltip content="Lihat Detail">
                                                <Button isIconOnly size="sm" variant="light" onPress={() => handleViewDetail(item)}>
                                                    <Eye size={18} className="text-blue-600" />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip content="Edit Warta">
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    as={Link}
                                                    to={`/super-admin/pewartaan-input/${item.id}`}
                                                >
                                                    <Plus size={18} className="text-orange-500 rotate-45" />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip content="Download Excel">
                                                <Button isIconOnly size="sm" variant="light" onPress={() => exportPewartaanExcel(item.id, item.judul)}>
                                                    <Download size={18} className="text-emerald-600" />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip content="Download Word">
                                                <Button isIconOnly size="sm" variant="light" onPress={() => exportPewartaanWord(item.id, item.judul)}>
                                                    <FileText size={18} className="text-blue-500" />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip content="Setujui">
                                                <Button isIconOnly size="sm" variant="light" color="success" onPress={() => handleApprove(item.id)}>
                                                    <CheckCircle size={18} />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip content="Tolak">
                                                <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleReject(item.id)}>
                                                    <XCircle size={18} />
                                                </Button>
                                            </Tooltip>
                                            <Tooltip content="Hapus">
                                                <Button isIconOnly size="sm" variant="light" className="text-red-700" onPress={() => handleDelete(item.id)}>
                                                    <Trash2 size={18} />
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

            {/* Detail Modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" scrollBehavior="inside">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <h3 className="text-xl font-bold text-gmmi-navy">Detail Warta Jemaat</h3>

                                <p className="text-sm text-gray-500">{selectedWarta?.tempat_jemaat} • {selectedWarta && new Date(selectedWarta.tanggal_ibadah).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </ModalHeader>
                            <ModalBody>
                                {selectedWarta && (
                                    <div className="space-y-6">
                                        {/* 1. Header Info */}
                                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                            <h4 className="font-bold text-lg text-gmmi-navy">{selectedWarta.judul}</h4>
                                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <FileText size={16} />
                                                    <span>Ayat: <span className="font-semibold text-gray-900">{selectedWarta.ayat_firman}</span></span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle size={16} />
                                                    <span>Tema: <span className="font-semibold text-gray-900">{selectedWarta.tema_khotbah}</span></span>
                                                </div>
                                            </div>
                                            <Chip
                                                className="mt-3"
                                                color={selectedWarta.status === 'approved' ? "success" : selectedWarta.status === 'pending' ? "warning" : "danger"}
                                                variant="flat"
                                                size="sm"
                                            >
                                                Status: {selectedWarta.status.toUpperCase()}
                                            </Chip>
                                        </div>

                                        {/* 2. Tata Ibadah */}
                                        {selectedWarta.tata_ibadah && selectedWarta.tata_ibadah.length > 0 && (
                                            <div>
                                                <h5 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                    <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                                                    Tata Ibadah
                                                </h5>
                                                <div className="space-y-3">
                                                    {selectedWarta.tata_ibadah.map((item: any, idx: number) => (
                                                        <div key={idx} className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                                            <div className="font-bold text-gray-400 text-lg">#{item.urutan}</div>
                                                            <div>
                                                                <p className="font-bold text-gray-800">{item.nama_bagian}</p>
                                                                {item.judul_pujian && <p className="text-sm font-medium text-purple-600">🎵 {item.judul_pujian}</p>}
                                                                {item.isi_konten && <p className="text-xs text-gray-500 mt-1 whitespace-pre-wrap">{item.isi_konten}</p>}
                                                                {item.keterangan && <p className="text-xs text-gray-400 italic mt-1">Note: {item.keterangan}</p>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* 3. Pokok Doa */}
                                        {selectedWarta.pokok_doa && selectedWarta.pokok_doa.length > 0 && (
                                            <div>
                                                <h5 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                    <div className="w-1 h-6 bg-rose-500 rounded-full"></div>
                                                    Pokok Doa
                                                </h5>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {selectedWarta.pokok_doa.map((doa: any, idx: number) => (
                                                        <Card key={idx} className="shadow-sm border border-rose-100 bg-rose-50">
                                                            <CardBody className="p-3">
                                                                <p className="font-bold text-rose-700">{doa.kategori}</p>
                                                                <p className="text-xs text-gray-600">{doa.keterangan}</p>
                                                            </CardBody>
                                                        </Card>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* 4. Pelayanan Sektor */}
                                        {selectedWarta.pelayanan_sektor && selectedWarta.pelayanan_sektor.length > 0 && (
                                            <div>
                                                <h5 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                    <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                                                    Jadwal Pelayanan Sektor
                                                </h5>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm text-left">
                                                        <thead className="text-xs text-gray-500 bg-gray-50 uppercase">
                                                            <tr>
                                                                <th className="px-3 py-2">Sektor</th>
                                                                <th className="px-3 py-2">Tempat</th>
                                                                <th className="px-3 py-2">Pemimpin</th>
                                                                <th className="px-3 py-2">Liturgos</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {selectedWarta.pelayanan_sektor.map((pel: any, idx: number) => (
                                                                <tr key={idx} className="border-b border-gray-100">
                                                                    <td className="px-3 py-2 font-medium">{pel.nomor_sektor}</td>
                                                                    <td className="px-3 py-2">{pel.tempat}</td>
                                                                    <td className="px-3 py-2">{pel.pemimpin}</td>
                                                                    <td className="px-3 py-2">{pel.liturgos}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                        {/* 5. Info Jemaat Summary (Ultah, Sakit, etc) */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                                                <h6 className="font-bold text-amber-700 text-sm">Jemaat Ultah</h6>
                                                <p className="text-2xl font-black text-amber-900">{selectedWarta.jemaat_ultah?.length || 0}</p>
                                            </div>
                                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                                <h6 className="font-bold text-blue-700 text-sm">Jemaat Sakit</h6>
                                                <p className="text-2xl font-black text-blue-900">{selectedWarta.jemaat_sakit?.length || 0}</p>
                                            </div>
                                        </div>

                                        {/* Fallback for empty content */}
                                        {(!selectedWarta.tata_ibadah?.length && !selectedWarta.pokok_doa?.length) && (
                                            <div className="text-center py-8 text-gray-400">
                                                <FileText className="mx-auto h-12 w-12 opacity-20 mb-2" />
                                                <p>Tidak ada detail konten tata ibadah untuk warta ini.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Tutup
                                </Button>
                                <Button
                                    color="danger"
                                    variant="bordered"
                                    startContent={<Trash2 size={16} />}
                                    onPress={() => { handleDelete(selectedWarta.id); onClose(); }}
                                >
                                    Hapus
                                </Button>
                                {selectedWarta?.status === 'pending' && (
                                    <>
                                        <Button color="danger" onPress={() => { handleReject(selectedWarta.id); onClose(); }}>
                                            Tolak
                                        </Button>
                                        <Button color="success" className="text-white" onPress={() => { handleApprove(selectedWarta.id); onClose(); }}>
                                            Setujui
                                        </Button>
                                    </>
                                )}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default Warta;
