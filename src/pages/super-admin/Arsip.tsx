import React, { useEffect, useState } from 'react';
import {
    Card,
    CardBody,
    Button,
    Select,
    SelectItem,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
} from "@heroui/react";
import { ListFilter, FileText, Download } from 'lucide-react';
import { getArsipBulanan } from '../../services/superAdmin.service';

const Arsip: React.FC = () => {
    const [month, setMonth] = useState<string>(new Date().getMonth().toString());
    const [year, setYear] = useState<string>(new Date().getFullYear().toString());
    const [arsipList, setArsipList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

    useEffect(() => {
        fetchArsip();
    }, [month, year]);

    const fetchArsip = async () => {
        setLoading(true);
        try {
            const data = await getArsipBulanan(parseInt(month) + 1, parseInt(year));
            setArsipList(data);
        } catch (error) {
            console.error("Failed to fetch arsip", error);
            setArsipList([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gmmi-navy">Arsip Dokumen Bulanan</h1>
                    <p className="text-gray-500">Lihat kembali warta dan laporan bulan-bulan sebelumnya.</p>
                </div>
                <Button variant="flat" color="success" radius="sm" className="font-semibold" startContent={<Download size={18} />}>Export Laporan</Button>
            </div>

            <Card className="border border-gray-100 shadow-sm">
                <CardBody>
                    <div className="flex gap-4 mb-6 items-center bg-gray-50 p-4 rounded-xl">
                        <ListFilter size={20} className="text-gray-400" />
                        <span className="font-semibold text-gray-600">Filter Periode:</span>
                        <Select
                            placeholder="Pilih Bulan"
                            className="max-w-[150px]"
                            selectedKeys={[month]}
                            onChange={(e) => setMonth(e.target.value)}
                            aria-label="Pilih Bulan"
                        >
                            {months.map((m, i) => (
                                <SelectItem key={i.toString()}>{m}</SelectItem>
                            ))}
                        </Select>
                        <Select
                            placeholder="Pilih Tahun"
                            className="max-w-[120px]"
                            selectedKeys={[year]}
                            onChange={(e) => setYear(e.target.value)}
                            aria-label="Pilih Tahun"
                        >
                            {years.map((y) => (
                                <SelectItem key={y}>{y}</SelectItem>
                            ))}
                        </Select>
                    </div>

                    <Table aria-label="Tabel Arsip">
                        <TableHeader>
                            <TableColumn>NAMA DOKUMEN</TableColumn>
                            <TableColumn>TIPE</TableColumn>
                            <TableColumn>TANGGAL UPLOAD</TableColumn>
                            <TableColumn>UKURAN</TableColumn>
                            <TableColumn>AKSI</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent="Tidak ada dokumen arsip pada periode ini." isLoading={loading}>
                            {arsipList.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                <FileText size={18} />
                                            </div>
                                            <span className="font-medium text-gray-700">{item.name || 'Tanpa Judul'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="capitalize">{item.type}</span>
                                    </TableCell>
                                    <TableCell>
                                        {item.date ? new Date(item.date).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        }) : '-'}
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-gray-400 italic">{item.size}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Button size="sm" variant="flat" color="primary" isDisabled>Detail</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </div>
    );
};

export default Arsip;
