import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroHeaderProps {
    title: string;
    subtitle: string;
    breadcrumbLabel?: string;
    breadcrumbLink?: string;
}

const HeroHeader: React.FC<HeroHeaderProps> = ({
    title,
    subtitle,
    breadcrumbLabel = "Kembali ke Beranda",
    breadcrumbLink = "/"
}) => {
    // Split title to highlight the last word if it has more than one word
    const titleParts = title.split(' ');
    const lastWord = titleParts.length > 1 ? titleParts.pop() : '';
    const mainTitle = titleParts.join(' ');

    return (
        <section className="relative pt-32 pb-20 overflow-hidden bg-gmmi-navy">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gmmi-gold/10 -skew-x-12 translate-x-1/2"></div>

            <div className="container mx-auto px-6 relative z-10 flex justify-between items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6 max-w-2xl"
                >
                    <Link to={breadcrumbLink} className="inline-flex items-center gap-2 text-gmmi-gold/80 hover:text-gmmi-gold transition-colors text-sm font-bold uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4" /> {breadcrumbLabel}
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
                        {mainTitle} {lastWord && <span className="text-gmmi-gold">{lastWord}</span>}
                    </h1>
                    <p className="text-slate-300 text-lg font-light leading-relaxed">
                        {subtitle}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="hidden lg:block relative"
                >
                    {/* Glow background for "shadow" nuance */}
                    <div className="absolute inset-0 bg-gmmi-gold/15 blur-[120px] rounded-full -translate-x-10"></div>

                    {/* The "Grayscale Shadow" Logo (B&W, low opacity, mirrored) */}
                    <img
                        src="/img/LOGO GMMI.png"
                        alt="Logo GMMI Background"
                        className="w-[380px] h-[380px] object-contain relative z-10 select-none pointer-events-none opacity-[0.12]"
                        style={{
                            filter: 'grayscale(100%) brightness(1.2)',
                            transform: 'translateY(-5%) scaleX(-1)'
                        }}
                    />
                </motion.div>
            </div>
        </section>
    );
};

export default HeroHeader;
