import React, { useEffect, useState } from 'react';
import {
    Card,
    CardBody,
    Button,
    Input,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Textarea,
    RadioGroup,
    Radio,
    Divider,
} from "@heroui/react";
import { Plus, Trash2, Search, FileSpreadsheet } from 'lucide-react';
import { getTransactions, createTransaction, deleteTransaction, exportTransactions } from '../../services/keuangan.service';
import { useAuth } from '../../hooks/useAuth';

const Keuangan: React.FC = () => {
    const { user } = useAuth();
    const isSuperAdmin = user?.role === 'super_admin' || user?.role === 'superadmin';
    // State management
    const [transactions, setTransactions] = useState<any[]>([]);
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // Filter State
    const [filter, setFilter] = useState({
        startDate: '',
        endDate: ''
    });

    // Form State
    const [transactionType, setTransactionType] = useState('income'); // income | expense
    const [method, setMethod] = useState('kas'); // kas | bank
    const [formData, setFormData] = useState({
        tanggal: new Date().toISOString().split('T')[0],
        keterangan: '',
        amount: 0
    });

    useEffect(() => {
        fetchData();
    }, [filter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getTransactions(filter.startDate, filter.endDate);
            // Verify data structure matches what we expect from the backend
            if (data && data.data) {
                setTransactions(data.data);
                setSummary(data.summary);
            } else if (Array.isArray(data)) {
                // Fallback if backend returns array directly
                setTransactions(data);
            }
        } catch (error) {
            console.error("Failed to fetch finance data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            // Map simple form to db columns
            const payload: any = {
                tanggal: formData.tanggal,
                keterangan: formData.keterangan,
                kas_penerimaan: 0,
                kas_pengeluaran: 0,
                bank_debit: 0,
                bank_kredit: 0
            };

            if (transactionType === 'income') {
                if (method === 'kas') payload.kas_penerimaan = formData.amount;
                else payload.bank_debit = formData.amount;
            } else {
                // Expense
                if (method === 'kas') payload.kas_pengeluaran = formData.amount;
                else payload.bank_kredit = formData.amount;
            }

            await createTransaction(payload);
            fetchData();
            onOpenChange();
            // Reset form
            setFormData({ tanggal: new Date().toISOString().split('T')[0], keterangan: '', amount: 0 });
        } catch (error) {
            console.error("Failed to create transaction", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Apakah anda yakin ingin menghapus data ini? Aksi ini akan mempengaruhi saldo akhir.")) {
            try {
                await deleteTransaction(id);
                fetchData();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleExport = () => {
        exportTransactions(filter.startDate, filter.endDate);
    };

    // Helper for formatting currency
    const formatRp = (val: any) => {
        if (!val) return '-';
        const num = parseFloat(val);
        if (num === 0) return '-';
        return `Rp ${num.toLocaleString('id-ID')}`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gmmi-navy">Manajemen Keuangan</h1>
                    <p className="text-gray-500 text-sm">Input data pemasukan & pengeluaran Kas/Bank.</p>
                </div>
                <div className="flex gap-2">
                    {isSuperAdmin && (
                        <>
                            <Button
                                color="success"
                                variant="flat"
                                startContent={<FileSpreadsheet size={18} />}
                                onPress={handleExport}
                            >
                                Export Excel
                            </Button>
                            <Button
                                className="bg-gmmi-navy text-white"
                                startContent={<Plus size={18} />}
                                onPress={onOpen}
                            >
                                Input Transaksi
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Controls / Filter */}
            <Card className="shadow-sm border border-gray-100">
                <CardBody className="flex flex-col md:flex-row gap-4 items-end">
                    <Input
                        type="date"
                        label="Dari Tanggal"
                        variant="bordered"
                        value={filter.startDate}
                        onValueChange={(v) => setFilter({ ...filter, startDate: v })}
                        className="max-w-xs"
                    />
                    <Input
                        type="date"
                        label="Sampai Tanggal"
                        variant="bordered"
                        value={filter.endDate}
                        onValueChange={(v) => setFilter({ ...filter, endDate: v })}
                        className="max-w-xs"
                    />
                    <Button isIconOnly variant="light" onPress={fetchData}>
                        <Search size={20} />
                    </Button>
                    {/* Summary Quick View */}
                    {summary && (
                        <div className="ml-auto flex gap-4 text-xs">
                            <div className="bg-blue-50 p-2 rounded">
                                <span className="text-gray-500 block">Saldo Akhir Kas</span>
                                <span className="font-bold text-blue-700">{formatRp(summary.saldo_akhir_kas)}</span>
                            </div>
                            <div className="bg-emerald-50 p-2 rounded">
                                <span className="text-gray-500 block">Saldo Akhir Bank</span>
                                <span className="font-bold text-emerald-700">{formatRp(summary.saldo_akhir_bank)}</span>
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Main Table */}
            <Card className="shadow-sm border border-gray-100">
                <CardBody className="p-0 overflow-x-auto">
                    <Table aria-label="Laporan Keuangan" removeWrapper isStriped>
                        <TableHeader>
                            <TableColumn>TANGGAL</TableColumn>
                            <TableColumn width={250}>KETERANGAN</TableColumn>
                            <TableColumn className="text-right bg-blue-50/50">KAS (MASUK)</TableColumn>
                            <TableColumn className="text-right bg-blue-50/50">KAS (KELUAR)</TableColumn>
                            <TableColumn className="text-right bg-blue-100/50 font-bold">SALDO KAS</TableColumn>
                            <TableColumn className="text-right bg-emerald-50/50">BANK (DEBIT)</TableColumn>
                            <TableColumn className="text-right bg-emerald-50/50">BANK (KREDIT)</TableColumn>
                            <TableColumn className="text-right bg-emerald-100/50 font-bold">SALDO BANK</TableColumn>
                            <TableColumn align="center">AKSI</TableColumn>
                        </TableHeader>
                        <TableBody isLoading={loading} emptyContent="Belum ada data transaksi.">
                            {transactions.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell className="whitespace-nowrap">
                                        {new Date(row.tanggal).toLocaleDateString('id-ID', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        <div className="line-clamp-2 max-w-[250px]" title={row.keterangan}>
                                            {row.keterangan}
                                        </div>
                                    </TableCell>

                                    {/* KAS SECTION */}
                                    <TableCell className="text-right bg-blue-50/20 text-blue-600">
                                        {formatRp(row.kas_penerimaan)}
                                    </TableCell>
                                    <TableCell className="text-right bg-blue-50/20 text-rose-600">
                                        {formatRp(row.kas_pengeluaran)}
                                    </TableCell>
                                    <TableCell className="text-right bg-blue-100/20 font-semibold text-gray-700">
                                        {formatRp(row.saldo_kas)}
                                    </TableCell>

                                    {/* BANK SECTION */}
                                    <TableCell className="text-right bg-emerald-50/20 text-emerald-600">
                                        {formatRp(row.bank_debit)}
                                    </TableCell>
                                    <TableCell className="text-right bg-emerald-50/20 text-rose-600">
                                        {formatRp(row.bank_kredit)}
                                    </TableCell>
                                    <TableCell className="text-right bg-emerald-100/20 font-semibold text-gray-700">
                                        {formatRp(row.saldo_bank)}
                                    </TableCell>

                                    <TableCell>
                                        {isSuperAdmin && (
                                            <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleDelete(row.id)}>
                                                <Trash2 size={16} />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            {/* Input Modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Input Transaksi Baru
                                <span className="text-sm font-normal text-gray-500">Pastikan data yang diinput sesuai dengan bukti fisik.</span>
                            </ModalHeader>
                            <ModalBody>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        type="date"
                                        label="Tanggal"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={formData.tanggal}
                                        onValueChange={(v) => setFormData({ ...formData, tanggal: v })}
                                    />
                                    <Input
                                        type="number"
                                        label="Nominal"
                                        labelPlacement="outside"
                                        placeholder="0"
                                        variant="bordered"
                                        startContent="Rp"
                                        value={formData.amount.toString()}
                                        onValueChange={(v) => setFormData({ ...formData, amount: parseFloat(v) || 0 })}
                                    />
                                </div>
                                <Textarea
                                    label="Keterangan"
                                    labelPlacement="outside"
                                    placeholder="Contoh: Kolekte Ibadah Minggu..."
                                    variant="bordered"
                                    value={formData.keterangan}
                                    onValueChange={(v) => setFormData({ ...formData, keterangan: v })}
                                />

                                <Divider className="my-2" />

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm font-semibold mb-2">Jenis Transaksi</p>
                                        <RadioGroup
                                            value={transactionType}
                                            onValueChange={setTransactionType}
                                            orientation="vertical"
                                        >
                                            <Radio value="income" color="success">Pemasukan</Radio>
                                            <Radio value="expense" color="danger">Pengeluaran</Radio>
                                        </RadioGroup>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold mb-2">Metode / Akun</p>
                                        <RadioGroup
                                            value={method}
                                            onValueChange={setMethod}
                                            orientation="vertical"
                                        >
                                            <Radio value="kas" description="Uang Tunai di Gereja">KAS (Tunai)</Radio>
                                            <Radio value="bank" description="Rekening Bank GMMI">BANK (Transfer)</Radio>
                                        </RadioGroup>
                                    </div>
                                </div>

                                {/* Preview logic */}
                                <div className="bg-gray-50 p-3 rounded text-sm mt-2 border border-gray-200">
                                    <p className="text-gray-500 mb-1">Preview Pencatatan:</p>
                                    <div className="flex justify-between font-semibold">
                                        <span>
                                            {transactionType === 'income' ? 'Menambah' : 'Mengurangi'} Saldo {method.toUpperCase()}
                                        </span>
                                        <span className={transactionType === 'income' ? 'text-success' : 'text-danger'}>
                                            {transactionType === 'income' ? '+' : '-'} {formatRp(formData.amount)}
                                        </span>
                                    </div>
                                </div>

                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Batal
                                </Button>
                                <Button className="bg-gmmi-navy text-white" onPress={handleCreate}>
                                    Simpan Transaksi
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default Keuangan;
