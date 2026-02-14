/**
 * Utilitas untuk menangani integrasi WhatsApp
 */

/**
 * Membuka chat WhatsApp dengan nomor dan pesan tertentu
 * @param phoneNumber Nomor WhatsApp (bisa mengandung karakter non-angka)
 * @param message Pesan yang ingin dikirimkan (opsional)
 */
export const openWhatsApp = (phoneNumber: string, message: string = ''): void => {
    // 1. Bersihkan nomor telepon dari karakter selain angka
    // Misal: "+62 812-3456" menjadi "628123456"
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');

    // 2. Pastikan nomor diawali dengan kode negara (default Indonesia 62)
    // Jika input diawali '0', ubah menjadi '62'
    let formattedNumber = cleanNumber;
    if (cleanNumber.startsWith('0')) {
        formattedNumber = '62' + cleanNumber.substring(1);
    }

    // 3. Gabungkan menjadi URL WhatsApp
    // encodeURIComponent digunakan agar karakter spesial dalam pesan aman dikirim lewat URL
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${formattedNumber}${message ? `?text=${encodedMessage}` : ''}`;

    // 4. Buka di tab baru
    window.open(waUrl, '_blank', 'noopener,noreferrer');
};
