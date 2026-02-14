import React from 'react';
import { Link } from 'react-router-dom';
import {

    Divider
} from "@heroui/react";
import {
    Instagram,
    Facebook,
    Youtube,
    Twitter,
    MapPin,
    Mail
} from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gmmi-navy text-white pt-32 pb-12 mt-32 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gmmi-gold/20 via-gmmi-gold to-gmmi-gold/20"></div>
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
                <div className="space-y-8 md:col-span-1">
                    <div className="flex items-center gap-3">
                        <img
                            src="/img/LOGO GMMI.png"
                            alt="Logo GMMI"
                            className="w-12 h-12 object-contain"
                        />
                        <div className="leading-tight">
                            <p className="text-2xl font-bold">GMMI</p>
                            <p className="text-[10px] text-gmmi-gold tracking-[0.2em] font-bold">EST. 1999</p>
                        </div>
                    </div>
                    <p className="text-gray-400 leading-relaxed font-light">
                        Gereja Mase Musafir Indonesia — Wadah persekutuan yang berakar pada kasih dan bertumbuh dalam kebenaran Firman Tuhan.
                    </p>
                    <div className="flex gap-4">
                        {[
                            { Icon: Facebook, href: "https://www.facebook.com/share/1GifNxGmJv/" },
                            { Icon: Instagram, href: "https://instagram.com" },
                            { Icon: Youtube, href: "https://youtube.com/@SinodeGMMI" },
                            { Icon: Twitter, href: "https://twitter.com" },
                        ].map(({ Icon, href }, index) => (
                            <a
                                key={index}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gmmi-gold hover:text-gmmi-navy transition-all cursor-pointer group"
                            >
                                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </a>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <h4 className="text-lg font-bold text-white relative inline-block">
                        Layanan
                        <span className="absolute -bottom-2 left-0 w-8 h-1 bg-gmmi-gold rounded-full"></span>
                    </h4>
                    <ul className="space-y-4 text-gray-400">
                        <li><Link to="/pewartaan" className="hover:text-gmmi-gold transition-colors">Pewartaan</Link></li>
                        <li><Link to="/pengumuman" className="hover:text-gmmi-gold transition-colors">Pengumuman</Link></li>
                        <li><Link to="/agenda" className="hover:text-gmmi-gold transition-colors">Agenda</Link></li>
                        <li><Link to="/program" className="hover:text-gmmi-gold transition-colors">Program & Kegiatan</Link></li>
                    </ul>
                </div>

                <div className="space-y-8">
                    <h4 className="text-lg font-bold text-white relative inline-block">
                        Informasi
                        <span className="absolute -bottom-2 left-0 w-8 h-1 bg-gmmi-gold rounded-full"></span>
                    </h4>
                    <ul className="space-y-4 text-gray-400">
                        <li><Link to="/keuangan" className="hover:text-gmmi-gold transition-colors">Keuangan</Link></li>
                        <li><Link to="/renungan" className="hover:text-gmmi-gold transition-colors">Renungan</Link></li>
                        <li><Link to="/#sejarah" className="hover:text-gmmi-gold transition-colors">Tentang Kami</Link></li>
                    </ul>
                </div>

                <div className="space-y-8">
                    <h4 className="text-lg font-bold text-white relative inline-block">
                        Tetap Terhubung
                        <span className="absolute -bottom-2 left-0 w-8 h-1 bg-gmmi-gold rounded-full"></span>
                    </h4>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-gmmi-gold/10 flex items-center justify-center text-gmmi-gold">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <p className="text-sm text-gray-400">Jl. Mawar Merah No. 12, Jakarta Timur, DKI Jakarta - 12345</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-gmmi-gold/10 flex items-center justify-center text-gmmi-gold">
                                <Mail className="w-5 h-5" />
                            </div>
                            <p className="text-sm text-gray-400">sekretariat@gmmi.or.id</p>
                        </div>

                    </div>
                </div>
            </div>

            <Divider className="bg-white/10" />

            <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-gray-500 text-sm">© 2026 Gereja Mase Musafir Indonesia. Hak Cipta Dilindungi.</p>
                <div className="flex gap-8 text-gray-500 text-sm">
                    <a href="#" className="hover:text-white">Privasi</a>
                    <a href="#" className="hover:text-white">Syarat & Ketentuan</a>
                    <a href="#" className="hover:text-white">Kontak</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
