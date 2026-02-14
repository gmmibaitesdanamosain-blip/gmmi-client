import React, { useEffect, useState } from 'react';
import { getArsip } from '../../services/admin.service';
import * as XLSX from 'xlsx';
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
    Select,
    SelectItem,
    Skeleton,
    Chip
} from "@heroui/react";
import {
    Archive,
    Download,
    FileText,
    Calendar,
    Filter
} from 'lucide-react';

type ArsipItem = {
    id: string;
    type: 'pengumuman' | 'warta' | 'jadwal';
    judul: string;
    tanggal: string;
    bulan: string;
    tahun: string;
    minggu: string;
};

const ArsipBulanan: React.FC = () => {
    const [arsipList, setArsipList] = useState<ArsipItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBulan, setSelectedBulan] = useState('');
    const [selectedTahun, setSelectedTahun] = useState('');

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
    const months = [
        { value: '01', label: 'Januari' },
        { value: '02', label: 'Februari' },
        { value: '03', label: 'Maret' },
        { value: '04', label: 'April' },
        { value: '05', label: 'Mei' },
        { value: '06', label: 'Juni' },
        { value: '07', label: 'Juli' },
        { value: '08', label: 'Agustus' },
        { value: '09', label: 'September' },
        { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' },
        { value: '12', label: 'Desember' },
    ];

    useEffect(() => {
        // Set default to current month and year
        const now = new Date();
        setSelectedBulan((now.getMonth() + 1).toString().padStart(2, '0'));
        setSelectedTahun(now.getFullYear().toString());
    }, []);

    useEffect(() => {
        if (selectedBulan && selectedTahun) {
            fetchData();
        }
    }, [selectedBulan, selectedTahun]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await getArsip(selectedBulan, selectedTahun);
            setArsipList(data);
        } catch (error) {
            console.error('Error fetching arsip:', error);
            setArsipList([]);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (!arsipList || arsipList.length === 0) {
            alert('Tidak ada data untuk di-export.');
            return;
        }

        // Prepare data for Excel
        const exportData = arsipList.map(item => ({
            'Tipe': getTypeLabel(item.type),
            'Judul': item.judul,
            'Tanggal': item.tanggal,
            'Minggu Ke': item.minggu,
            'Bulan': months.find(m => m.value === item.bulan)?.label || item.bulan,
            'Tahun': item.tahun
        }));

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(exportData);

        // Auto-size columns (optional but nice)
        const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
        const cols = [];
        for (let C = range.s.c; C <= range.e.c; ++C) {
            let maxLen = 10; // Default min width
            for (let R = range.s.r; R <= range.e.r; ++R) {
                const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
                if (cell && cell.v) {
                    const len = cell.v.toString().length;
                    if (len > maxLen) maxLen = len;
                }
            }
            cols.push({ wch: maxLen + 2 });
        }
        worksheet['!cols'] = cols;

        // Create workbook and append worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Arsip Bulanan');

        // Generate filename based on selected period
        const fileName = `Arsip_GMMI_${selectedBulan}_${selectedTahun}.xlsx`;

        // Download the file
        XLSX.writeFile(workbook, fileName);
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'pengumuman':
                return 'bg-amber-50 text-amber-600';
            case 'warta':
                return 'bg-blue-50 text-blue-600';
            case 'jadwal':
                return 'bg-red-50 text-red-600';
            default:
                return 'bg-gray-50 text-gray-600';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'pengumuman':
                return 'Pengumuman';
            case 'warta':
                return 'Warta';
            case 'jadwal':
                return 'Jadwal';
            default:
                return type;
        }
    };

    if (loading && !selectedBulan) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-20 rounded-[2rem]" />
                <Skeleton className="h-[500px] rounded-[3rem]" />
            </div>
        );
    }

    const groupedArsip = arsipList.reduce((acc, item) => {
        const week = item.minggu || '1';
        if (!acc[week]) acc[week] = [];
        acc[week].push(item);
        return acc;
    }, {} as Record<string, ArsipItem[]>);

    const sortedWeeks = Object.keys(groupedArsip).sort();

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold text-gmmi-navy tracking-tight">Arsip Bulanan</h1>
                    <p className="text-gray-500 font-medium">Lihat data historis pengumuman, warta, dan jadwal.</p>
                </div>
                <Button
                    onPress={handleExport}
                    className="bg-gmmi-navy text-white font-bold rounded-2xl h-14 px-8 shadow-lg shadow-gmmi-navy/20"
                    startContent={<Download className="w-5 h-5" />}
                >
                    Export Data
                </Button>
            </header>

            {/* Filter Section */}
            <Card className="rounded-[2.5rem] border border-gray-100 shadow-sm bg-gradient-to-br from-slate-50 to-white">
                <CardBody className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-gmmi-navy/10 p-3 rounded-2xl">
                            <Filter className="w-5 h-5 text-gmmi-navy" />
                        </div>
                        <h3 className="text-xl font-bold text-gmmi-navy">Filter Periode</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Select
                            label="Bulan"
                            labelPlacement="outside"
                            variant="bordered"
                            placeholder="Pilih bulan"
                            selectedKeys={selectedBulan ? [selectedBulan] : []}
                            onChange={(e) => setSelectedBulan(e.target.value)}
                            classNames={{
                                label: "font-bold text-gmmi-navy pb-2",
                                trigger: "border-gray-200 focus-within:!border-gmmi-navy rounded-[1.5rem] h-14",
                            }}
                        >
                            {months.map((month) => (
                                <SelectItem key={month.value}>
                                    {month.label}
                                </SelectItem>
                            ))}
                        </Select>

                        <Select
                            label="Tahun"
                            labelPlacement="outside"
                            variant="bordered"
                            placeholder="Pilih tahun"
                            selectedKeys={selectedTahun ? [selectedTahun] : []}
                            onChange={(e) => setSelectedTahun(e.target.value)}
                            classNames={{
                                label: "font-bold text-gmmi-navy pb-2",
                                trigger: "border-gray-200 focus-within:!border-gmmi-navy rounded-[1.5rem] h-14",
                            }}
                        >
                            {years.map((year) => (
                                <SelectItem key={year}>
                                    {year}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                </CardBody>
            </Card>

            {/* Overall Summary Card */}
            {selectedBulan && selectedTahun && (
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="rounded-[2rem] border border-gray-100 shadow-sm">
                        <CardBody className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-amber-50 p-3 rounded-xl">
                                    <FileText className="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Total Pengumuman</p>
                                    <h3 className="text-2xl font-bold text-gmmi-navy">
                                        {arsipList.filter(item => item.type === 'pengumuman').length}
                                    </h3>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="rounded-[2rem] border border-gray-100 shadow-sm">
                        <CardBody className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-50 p-3 rounded-xl">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Total Warta</p>
                                    <h3 className="text-2xl font-bold text-gmmi-navy">
                                        {arsipList.filter(item => item.type === 'warta').length}
                                    </h3>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="rounded-[2rem] border border-gray-100 shadow-sm">
                        <CardBody className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-red-50 p-3 rounded-xl">
                                    <Calendar className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Total Jadwal</p>
                                    <h3 className="text-2xl font-bold text-gmmi-navy">
                                        {arsipList.filter(item => item.type === 'jadwal').length}
                                    </h3>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            )}

            {/* Weekly Grouped Data */}
            <div className="space-y-12">
                {loading ? (
                    <div className="space-y-8">
                        <Skeleton className="h-20 rounded-2xl" />
                        <Skeleton className="h-[400px] rounded-2xl" />
                    </div>
                ) : sortedWeeks.length > 0 ? (
                    sortedWeeks.map((weekNum) => (
                        <div key={weekNum} className="space-y-6">
                            <div className="flex items-center gap-4 px-4">
                                <div className="h-10 w-1 bg-gmmi-gold rounded-full"></div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gmmi-navy uppercase tracking-tight">Minggu ke-{weekNum}</h2>
                                    <p className="text-sm text-gray-500 font-medium">Total {groupedArsip[weekNum].length} rekapan tersedia</p>
                                </div>
                            </div>

                            <Card className="rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                                <CardBody className="p-0">
                                    <Table aria-label={`Tabel Arsip Minggu ${weekNum}`} removeWrapper className="bg-transparent">
                                        <TableHeader>
                                            <TableColumn className="bg-transparent p-8 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-50">TIPE</TableColumn>
                                            <TableColumn className="bg-transparent p-8 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-50">JUDUL</TableColumn>
                                            <TableColumn className="bg-transparent p-8 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-50 text-center">TANGGAL</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                            {groupedArsip[weekNum].map((item) => (
                                                <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                                                    <TableCell className="p-8">
                                                        <Chip
                                                            size="sm"
                                                            variant="flat"
                                                            className={`font-bold capitalize ${getTypeColor(item.type)}`}
                                                        >
                                                            {getTypeLabel(item.type)}
                                                        </Chip>
                                                    </TableCell>
                                                    <TableCell className="p-8">
                                                        <p className="text-gmmi-navy font-medium">{item.judul}</p>
                                                    </TableCell>
                                                    <TableCell className="p-8 text-center">
                                                        <span className="text-gray-600 font-medium">{item.tanggal}</span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </div>
                    ))
                ) : (
                    <Card className="rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden p-20 text-center">
                        <Archive className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-400 italic">Tidak ada data arsip untuk periode ini.</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ArsipBulanan;
