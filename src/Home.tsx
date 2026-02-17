import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { getWarta, getPengumuman } from "./services/dashboard.services";
import { getPrograms } from "./services/program.service";
import { getAllRenungan } from "./services/renungan.service";
import { getCarouselSlides } from "./services/carousel.service";
import { getKeuanganSummary } from "./services/keuangan.service";
import type { CarouselSlide } from "./services/carousel.service";
import type { Sejarah } from "./services/sejarah.service";
import { getSejarah } from "./services/sejarah.service";
import type { Program } from "./services/program.service";
import {
  Button,
  Card,
  Divider,
  Skeleton,
  Chip,
  Spinner,
  Accordion,
  AccordionItem,
} from "@heroui/react";
import {
  ChevronRight,
  Sparkles,
  BookOpen,
  Megaphone,
  Calendar,
  History,
  ArrowRight,
  MapPin,
  Clock,
  Users,
  ScrollText,
  MessageCircle,
  Plus,
  Activity,
  Target,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";
import Navbar from "./components/partials/Navbar";
import Footer from "./components/partials/Footer";

const HeroCarousel: React.FC<{ slides: CarouselSlide[] }> = ({ slides }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const renderImageUrl = (url: string) => {
    if (!url) return "/img/Foto gereja.jpg";
    return url;
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev: number) => (prev + 1) % slides.length);
  };

  useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(() => {
      handleNext();
    }, 7000);
    return () => clearInterval(timer);
  }, [currentIndex, slides.length]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 1.1,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-slate-900 shadow-2xl group">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.6 },
            scale: { duration: 0.8 },
          }}
          className="absolute inset-0 w-full h-full"
        >
          <div className="absolute inset-0 z-10 bg-black/50"></div>
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={renderImageUrl(slides[currentIndex].image_url)}
              alt={slides[currentIndex].title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div className="relative z-30 h-full container mx-auto px-6 md:px-12 xl:pl-36 flex flex-col justify-center max-w-7xl space-y-4 md:space-y-8 pt-20">
            {slides[currentIndex].badge && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-px bg-gmmi-gold"></div>
                <span className="text-gmmi-gold font-black uppercase tracking-[0.4em] text-[10px] md:text-xs">
                  {slides[currentIndex].badge}
                </span>
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-8xl font-serif font-bold tracking-tight leading-tight text-white drop-shadow-md"
            >
              {slides[currentIndex].title.includes("Miracle")
                ? slides[currentIndex].title.split("Miracle").join("\n")
                : slides[currentIndex].title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-base md:text-3xl text-slate-300 font-light max-w-3xl leading-relaxed"
            >
              "{slides[currentIndex].subtitle}"
            </motion.p>

            {slides[currentIndex].quote && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="border-l-4 border-gmmi-gold pl-4 md:pl-6 py-1 md:py-2"
              >
                <p className="text-xs md:text-md text-gmmi-gold/80 italic font-medium max-w-2xl">
                  {slides[currentIndex].quote}
                </p>
              </motion.div>
            )}

            {slides[currentIndex].cta_link && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 pt-4 md:pt-6"
              >
                <Button
                  onPress={() => {
                    const link = slides[currentIndex].cta_link;
                    if (!link) return;

                    if (link.startsWith("#")) {
                      // Handle all internal hash links smoothly
                      let targetId = link.substring(1);

                      // Fallback for old contact link to new finance summary
                      if (link === "#contact") {
                        targetId = "finance-summary";
                      }

                      const element = document.getElementById(targetId);
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    } else if (link.startsWith("http")) {
                      // Handle external links (including WhatsApp)
                      window.open(link, "_blank");
                    } else {
                      // Handle internal routes using React Router
                      navigate(link);
                    }
                  }}
                  size="lg"
                  radius="full"
                  variant="shadow"
                  className="bg-gmmi-gold text-gmmi-navy font-bold px-10 py-5 hover:scale-105 transition-all w-full sm:w-auto"
                >
                  {slides[currentIndex].cta_text || "Pelajari Lebih Lanjut"}
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Social Media Sidebar */}
      {/* Social Media Responsive Bar */}
      <div
        className="absolute z-40 flex items-center gap-4 xl:gap-6
                bottom-8 left-1/2 -translate-x-1/2 flex-row
                xl:bottom-auto xl:left-12 xl:top-1/2 xl:-translate-y-1/2 xl:flex-col xl:translate-x-0"
      >
        {[
          {
            Icon: Facebook,
            href: "https://www.facebook.com/share/1GifNxGmJv/",
          },
          { Icon: Instagram, href: "https://instagram.com" },
          { Icon: Youtube, href: "https://youtube.com/@SinodeGMMI" },
          { Icon: Twitter, href: "https://twitter.com" },
        ].map(({ Icon, href }, index) => (
          <motion.a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + index * 0.1 }}
            className="w-10 h-10 lg:w-14 lg:h-14 rounded-full border border-white/30 bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:text-gmmi-gold hover:border-gmmi-gold hover:bg-gmmi-gold/20 transition-all group shadow-lg"
          >
            <Icon className="w-4 h-4 xl:w-6 xl:h-6 group-hover:scale-110 transition-transform" />
          </motion.a>
        ))}

        {/* Vertical Line for Desktop only */}
        <div className="hidden xl:block w-px h-20 bg-gradient-to-b from-white/20 to-transparent mx-auto mt-4"></div>
      </div>

      {/* Discover More Vertical Text */}
      <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-8">
        <div className="w-px h-20 bg-gradient-to-t from-white/20 to-transparent"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 [writing-mode:vertical-lr] rotate-180">
          Satu Keluarga Dalam Kristus
        </p>
        <div className="flex flex-col gap-1">
          <div className="w-1 h-1 rounded-full bg-gmmi-gold/40"></div>
          <div className="w-1 h-3 rounded-full bg-gmmi-gold"></div>
          <div className="w-1 h-1 rounded-full bg-gmmi-gold/40"></div>
        </div>
      </div>
    </section>
  );
};

const sejarahContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const sejarahItemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

const SejarahSection: React.FC<{ sejarahList: Sejarah[] }> = ({
  sejarahList = [],
}) => {
  // Determine content to display
  const data =
    Array.isArray(sejarahList) && sejarahList.length > 0
      ? sejarahList[0]
      : null;
  const defaultImage = "/img/Foto gereja.jpg";

  const renderImageUrl = (url?: string) => {
    if (!url) return defaultImage;
    return url;
  };

  const year = data?.tanggal_peristiwa
    ? new Date(data.tanggal_peristiwa).getFullYear()
    : "1999";
  const title = data?.judul || "Melayani dengan Kasih & Iman";
  const description =
    data?.deskripsi ||
    "GMMI lahir dari kerinduan untuk menyediakan wadah persekutuan yang berakar kuat pada Alkitab dan memiliki kepedulian sosial yang nyata bagi sesama.";

  // Split title for styling if it matches default
  const titleNode = data ? (
    <h2 className="text-5xl md:text-7xl font-bold text-gmmi-navy leading-tight tracking-tight">
      {title}
    </h2>
  ) : (
    <h2 className="text-5xl md:text-7xl font-bold text-gmmi-navy leading-tight tracking-tight">
      Melayani dengan <br />
      <span className="text-gmmi-gold">Kasih & Iman</span>
    </h2>
  );

  return (
    <section
      id="sejarah"
      className="relative py-32 overflow-hidden bg-neutral-50/50"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gmmi-navy/5 -skew-x-12 translate-x-1/2"></div>
      <div className="absolute top-40 left-10 w-64 h-64 bg-gmmi-gold/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Image/Visual Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
              <img
                src={renderImageUrl(data?.gambar_url)}
                alt="Church History"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  // Prevent infinite loop if default image also fails
                  if (!target.src.includes("placeholder")) {
                    target.src =
                      "https://placehold.co/600x400?text=GMMI+History";
                  }
                }}
                className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gmmi-navy/60 to-transparent"></div>
              <div className="absolute bottom-10 left-10 text-white">
                <p className="text-5xl font-serif font-bold text-gmmi-gold">
                  {year}
                </p>
                <p className="text-sm font-black uppercase tracking-[0.3em] opacity-80">
                  Tahun Peristiwa
                </p>
              </div>
            </div>

            {/* Floating Stats Card - Only show on MD+ */}
            <div className="hidden md:block absolute -bottom-10 -right-10 z-20">
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-neutral-100"
              >
                <div className="flex items-center gap-6">
                  <div className="bg-gmmi-gold/10 p-4 rounded-2xl text-gmmi-gold">
                    <Users className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gmmi-navy tracking-tight">
                      {new Date().getFullYear() - 1999}+
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      Tahun Melayani
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            variants={sejarahContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div className="space-y-4">
              <motion.div
                variants={sejarahItemVariants}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-gmmi-navy text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em]"
              >
                <History className="w-3.5 h-3.5 text-gmmi-gold" />
                Warisan & Sejarah
              </motion.div>
              {titleNode}
            </div>

            <div className="space-y-6 text-lg text-neutral-600 font-light leading-relaxed">
              <motion.p variants={sejarahItemVariants}>{description}</motion.p>
              {!data && (
                <motion.p variants={sejarahItemVariants}>
                  Sejak didirikan pada tahun 1999, GMMI terus berkomitmen untuk
                  membangun jemaat yang militan dalam iman namun inklusif dalam
                  pelayanan. Kami percaya bahwa setiap pribadi dipanggil untuk
                  menjadi garam dan terang di tengah dunia.
                </motion.p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-8 pt-6">
              <motion.div variants={sejarahItemVariants} className="space-y-3">
                <div className="w-12 h-1 bg-gmmi-gold rounded-full"></div>
                <h4 className="font-bold text-gmmi-navy text-xl uppercase tracking-tighter">
                  Visi Utama
                </h4>
                <p className="text-sm text-neutral-500 font-medium">
                  Menjadi gereja yang berpusat pada Kristus dan berdampak bagi
                  lingkungan.
                </p>
              </motion.div>
              <motion.div variants={sejarahItemVariants} className="space-y-3">
                <div className="w-12 h-1 bg-gmmi-navy rounded-full"></div>
                <h4 className="font-bold text-gmmi-navy text-xl uppercase tracking-tighter">
                  Misi Suci
                </h4>
                <p className="text-sm text-neutral-500 font-medium">
                  Mewartakan kabar baik melalui aksi pelayanan kasih yang
                  holistik.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const homeItemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [warta, setWarta] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [renungan, setRenungan] = useState<any | null>(null);
  const [sejarah, setSejarah] = useState<Sejarah[]>([]);
  const [financeSummary, setFinanceSummary] = useState<any>(null);

  // Secret Key Access: Ctrl + Alt + L to Login
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.ctrlKey &&
        event.altKey &&
        (event.key === "l" || event.key === "L")
      ) {
        event.preventDefault();
        navigate("/login");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch main data
      try {
        const results = await Promise.allSettled([
          getPrograms({}).catch((err) => {
            console.error("Programs Error:", err);
            return [];
          }),
          getWarta().catch((err) => {
            console.error("Warta Error:", err);
            return null;
          }),
          getPengumuman().catch((err) => {
            console.error("Pengumuman Error:", err);
            return [];
          }),
          getAllRenungan().catch((err) => {
            console.error("Renungan Error:", err);
            return [];
          }),
          getCarouselSlides().catch((err) => {
            console.error("Carousel Error:", err);
            return [];
          }),
          getKeuanganSummary().catch((err) => {
            console.error("Finance Error:", err);
            return null;
          }),
        ]);

        // Helper to get value or default
        const getValue = (
          result: PromiseSettledResult<any>,
          defaultVal: any,
        ) => (result.status === "fulfilled" ? result.value : defaultVal);

        // Programs
        setPrograms(getValue(results[0], [])?.slice(0, 6) || []);

        // Warta
        const wartaData = getValue(results[1], null);
        setWarta(wartaData?.data?.slice(0, 3) || []);

        // Announcements
        setAnnouncements(getValue(results[2], [])?.slice(0, 5) || []);

        // Renungan
        const renunganData = getValue(results[3], []);
        setRenungan(
          Array.isArray(renunganData) && renunganData.length > 0
            ? renunganData[0]
            : null,
        );

        // Carousel
        setSlides(getValue(results[4], []) || []);

        // Finance
        const financeData = getValue(results[5], null);
        if (financeData?.success) {
          setFinanceSummary(financeData.data);
        }
      } catch (mainError) {
        console.error("Critical Error in fetchData:", mainError);
      }

      // Fetch Sejarah independently
      try {
        const sejarahRes = await getSejarah();
        setSejarah(Array.isArray(sejarahRes) ? sejarahRes : []);
      } catch (sejarahError) {
        console.error("Gagal mengambil data sejarah:", sejarahError);
        setSejarah([]); // Fallback to empty to use default content
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {slides.length > 0 && <HeroCarousel slides={slides} />}

      {/* Sejarah Section - World Class & Premium */}
      <SejarahSection sejarahList={sejarah} />

      <main className="container mx-auto px-6 py-24 space-y-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Warta & Pengumuman */}
          <div className="lg:col-span-7 space-y-8">
            {/* Warta Section */}
            <section id="pewartaan">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gmmi-navy flex items-center gap-2">
                  <Megaphone className="w-6 h-6 text-gmmi-gold" />
                  Pewartaan Jemaat
                </h3>
                <Link
                  to="/pewartaan"
                  className="text-sm font-bold text-gmmi-gold hover:text-gmmi-navy transition-colors flex items-center gap-1"
                >
                  Lihat Semua <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {loading ? (
                  <Skeleton className="h-[280px] rounded-[2.5rem]" />
                ) : warta.length > 0 ? (
                  warta.map((item, i) => (
                    <motion.div
                      key={item.id}
                      variants={homeItemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card
                        as={motion.div}
                        whileHover={{ scale: 1.02 }}
                        className="relative overflow-hidden group border-none h-[180px] rounded-[2.5rem] shadow-xl hover:shadow-gmmi-gold/20 transition-all duration-500 cursor-pointer"
                        onClick={() => navigate(`/pewartaan/${item.id}`)}
                      >
                        <div className="flex h-full">
                          <div className="w-1/3 bg-gmmi-navy relative overflow-hidden">
                            <div className="absolute inset-0 bg-gmmi-gold/20 flex items-center justify-center">
                              <Megaphone className="text-white w-12 h-12 opacity-20" />
                            </div>
                            <div className="absolute top-4 left-4 flex flex-col items-center">
                              <span className="text-white font-black text-2xl">
                                {new Date(item.tanggal_ibadah).getDate()}
                              </span>
                              <span className="text-gmmi-gold text-[10px] font-black uppercase">
                                {new Date(item.tanggal_ibadah).toLocaleString(
                                  "id-ID",
                                  { month: "short" },
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="w-2/3 p-6 flex flex-col justify-center space-y-2">
                            <div className="flex items-center gap-2">
                              <Chip
                                size="sm"
                                color="primary"
                                variant="flat"
                                className="text-[8px] h-5 font-black uppercase tracking-widest"
                              >
                                {item.tempat_jemaat}
                              </Chip>
                            </div>
                            <h4 className="text-lg font-bold text-gmmi-navy line-clamp-1">
                              {item.judul}
                            </h4>
                            <p className="text-xs text-neutral-500 line-clamp-2 italic">
                              "{item.tema_khotbah}"
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <Card
                    as={motion.div}
                    whileHover={{ scale: 1.02 }}
                    className="relative overflow-hidden group border-none h-[280px] rounded-[2.5rem] shadow-2xl hover:shadow-gmmi-gold/20 transition-all duration-500 cursor-pointer"
                    onClick={() => navigate("/pewartaan")}
                  >
                    <div className="absolute inset-0 z-0">
                      <img
                        src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2070&auto=format&fit=crop"
                        alt="Pewartaan Background"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-gmmi-navy via-gmmi-navy/80 to-transparent"></div>
                    </div>

                    <div className="relative z-10 h-full p-10 flex flex-col justify-center max-w-md space-y-4">
                      <div className="flex items-center gap-2 px-3 py-1 bg-gmmi-gold text-gmmi-navy w-fit rounded-full text-[10px] font-black uppercase tracking-widest">
                        <Sparkles size={12} /> Terkini
                      </div>
                      <h4 className="text-3xl font-bold text-white leading-tight">
                        Informasi & Warta <br />{" "}
                        <span className="text-gmmi-gold">Keluarga Allah</span>
                      </h4>
                      <p className="text-slate-300 font-light text-sm leading-relaxed">
                        Dapatkan informasi terbaru mengenai jadwal ibadah,
                        kegiatan jemaat, dan berita sukacita lainnya di halaman
                        pewartaan kami.
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </section>

            <Divider className="my-8" />

            {/* Pengumuman Section */}
            <section id="pengumuman">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gmmi-navy flex items-center gap-2">
                  <ScrollText className="w-6 h-6 text-gmmi-gold" />
                  Pengumuman Resmi
                </h3>
                <Link
                  to="/pengumuman"
                  className="text-sm font-bold text-gmmi-gold hover:text-gmmi-navy transition-colors flex items-center gap-1"
                >
                  Buka Arsip <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <Skeleton className="h-20 rounded-2xl" />
                ) : announcements.length > 0 ? (
                  announcements.map((item, i) => (
                    <motion.div
                      key={item.id}
                      variants={homeItemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: i * 0.05 }}
                      className="p-6 bg-neutral-50 rounded-[2rem] border border-neutral-100 flex items-start gap-4 hover:bg-white hover:shadow-xl hover:scale-[1.02] transition-all cursor-default"
                    >
                      <div className="w-10 h-10 rounded-full bg-gmmi-gold/10 flex items-center justify-center text-gmmi-gold shrink-0">
                        <Megaphone size={18} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gmmi-navy font-medium leading-relaxed">
                          {item.isi}
                        </p>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                          {new Date(
                            item.tanggal || item.created_at,
                          ).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <Card
                    as={motion.div}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gmmi-navy p-10 rounded-[2.5rem] relative overflow-hidden group hover:shadow-2xl hover:shadow-gmmi-navy/40 transition-all border border-white/5 h-[200px] flex flex-col justify-center cursor-pointer"
                    onClick={() => navigate("/pengumuman")}
                  >
                    <div className="relative z-10 space-y-4">
                      <h4 className="text-2xl font-bold text-white">
                        Belum ada pengumuman baru.
                      </h4>
                      <p className="text-slate-400 text-sm">
                        Klik di sini untuk melihat arsip pengumuman sebelumnya.
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Jadwal & Support */}
          <div className="lg:col-span-5 space-y-8">
            <Card
              id="agenda"
              as={motion.div}
              whileHover={{ scale: 1.01 }}
              className="bg-gmmi-navy text-white p-10 rounded-[3rem] relative overflow-hidden min-h-[550px] shadow-2xl shadow-gmmi-navy/40 border border-white/5 group transition-all duration-700 flex flex-col justify-between cursor-pointer"
              onClick={() => navigate("/agenda")}
            >
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none blur-md group-hover:opacity-20 transition-opacity duration-700">
                <Calendar className="w-72 h-72 text-white" />
              </div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gmmi-gold/10 rounded-full blur-[80px]"></div>

              <div className="relative z-10">
                <div className="mb-12">
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] mb-6 backdrop-blur-md border border-white/10 text-gmmi-gold">
                    <Calendar className="w-4 h-4" />
                    Agenda Gereja
                  </div>
                  <h2 className="text-4xl font-bold leading-tight tracking-tight">
                    Jadwal Ibadah
                    <br />& Kegiatan
                  </h2>
                </div>

                <div className="space-y-6">
                  <p className="text-slate-400 text-lg font-light leading-relaxed">
                    Temukan seluruh rangkaian agenda pelayanan, jadwal ibadah
                    raya, hingga kegiatan kategorial dalam satu tempat.
                  </p>
                  <div className="flex items-center gap-3 text-gmmi-gold font-black text-xs uppercase tracking-widest pt-4 group-hover:gap-5 transition-all">
                    Lihat Agenda Lengkap <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Info Featurette */}
              <div className="relative z-10 pt-10 grid grid-cols-2 gap-4">
                <div className="p-5 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm">
                  <Clock className="w-6 h-6 text-gmmi-gold mb-3" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                    Update
                  </p>
                  <p className="text-sm font-bold">Setiap Hari</p>
                </div>
                <div className="p-5 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm">
                  <MapPin className="w-6 h-6 text-gmmi-gold mb-3" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                    Lokasi
                  </p>
                  <p className="text-sm font-bold">Gedung Gereja</p>
                </div>
              </div>
            </Card>

            {/* Renungan Card - Premium Weekly Devotional */}
            <Card
              as={Link}
              to={renungan ? `/renungan/${renungan.id}` : "/renungan"}
              className="p-10 bg-white relative overflow-hidden group border border-gray-100 shadow-xl shadow-gmmi-gold/5 rounded-[2.5rem] hover:shadow-2xl hover:border-gmmi-gold/30 transition-all duration-500"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gmmi-gold/10 rounded-bl-[4rem]"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gmmi-gold to-gmmi-navy"></div>

              <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gmmi-gold/10 text-gmmi-navy rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                    <BookOpen className="w-3.5 h-3.5 text-gmmi-gold" />
                    Renungan Mingguan
                  </div>
                  <h3 className="text-3xl font-bold text-gmmi-navy leading-tight group-hover:text-gmmi-gold transition-colors duration-300">
                    {renungan ? renungan.judul : "Renungan Minggu Ini"}
                  </h3>
                  {renungan && (
                    <p className="text-gray-500 mt-2 line-clamp-2 font-light">
                      {renungan.isi}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {renungan
                      ? new Date(renungan.tanggal).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                        })
                      : "Segera Hadir"}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-gmmi-navy text-white flex items-center justify-center group-hover:bg-gmmi-gold group-hover:scale-110 transition-all duration-500 shadow-lg shadow-gmmi-navy/20">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Rekapan Keuangan Card - New Section */}
            <Card
              id="finance-summary"
              as={Link}
              to="/keuangan"
              className="p-10 bg-gmmi-navy relative overflow-hidden group border-none shadow-2xl shadow-gmmi-navy/40 rounded-[2.5rem]"
            >
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Activity className="w-64 h-64 text-white" />
              </div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gmmi-gold/10 rounded-full blur-[80px]"></div>

              <div className="relative z-10 space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-gmmi-gold rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4 backdrop-blur-md border border-white/5">
                    <Activity className="w-3.5 h-3.5" />
                    Rekapan Keuangan
                  </div>
                  <h3 className="text-3xl font-bold text-white leading-tight">
                    Transparansi <br />{" "}
                    <span className="text-gmmi-gold">Kas Gereja</span>
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                      Saldo Saat Ini
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {financeSummary
                        ? new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          }).format(financeSummary.balance)
                        : "Rp 0"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-500/10 rounded-2xl border border-green-500/20">
                      <p className="text-[10px] font-black uppercase tracking-widest text-green-400 mb-1">
                        Pemasukan
                      </p>
                      <p className="text-sm font-bold text-white">
                        {financeSummary
                          ? new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              maximumFractionDigits: 0,
                            }).format(financeSummary.totalIncome)
                          : "Rp 0"}
                      </p>
                    </div>
                    <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                      <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1">
                        Pengeluaran
                      </p>
                      <p className="text-sm font-bold text-white">
                        {financeSummary
                          ? new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              currencyDisplay: "symbol",
                              maximumFractionDigits: 0,
                            }).format(financeSummary.totalExpense)
                          : "Rp 0"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest uppercase">
                    Update:{" "}
                    {new Date().toLocaleDateString("id-ID", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-gmmi-gold text-gmmi-navy flex items-center justify-center group-hover:scale-110 transition-all shadow-lg shadow-gmmi-gold/20">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Program & Kegiatan Section */}
        <section id="program" className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card
              as={Link}
              to="/program"
              className="bg-white p-12 md:p-20 rounded-[4rem] relative overflow-hidden group border border-neutral-100 shadow-2xl shadow-gmmi-navy/5 hover:border-gmmi-gold/30 transition-all duration-700"
            >
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gmmi-gold/5 to-transparent"></div>
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gmmi-gold/10 rounded-full blur-[100px] group-hover:bg-gmmi-gold/20 transition-colors"></div>

              <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gmmi-navy text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                    <BookOpen className="w-3.5 h-3.5" />
                    Rencana Strategis
                  </div>
                  <div className="space-y-6">
                    <h2 className="text-5xl md:text-7xl font-bold text-gmmi-navy tracking-tighter leading-[0.9]">
                      Program Kerja <br />{" "}
                      <span className="text-gmmi-gold">& Pelayanan</span>
                    </h2>
                    <p className="text-neutral-500 text-xl font-light leading-relaxed max-w-xl">
                      Mewujudkan visi gereja melalui berbagai aksi nyata dalam
                      pelayanan, persekutuan, dan pengembangan jemaat.
                    </p>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-4 text-gmmi-gold font-black text-xs uppercase tracking-[0.3em] group-hover:gap-6 transition-all duration-500">
                    Lihat Semua Program <ChevronRight className="w-6 h-6" />
                  </div>
                </div>

                <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {loading
                    ? [1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-40 rounded-[2rem]" />
                      ))
                    : programs.length > 0
                      ? programs.map((prog, i) => (
                          <div
                            key={i}
                            className="p-8 bg-neutral-50 rounded-[2.5rem] border border-neutral-100 group-hover:bg-white group-hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
                          >
                            <div>
                              <div className="text-gmmi-gold mb-4">
                                {prog.bidang === "Pewartaan" ? (
                                  <Target size={24} />
                                ) : prog.bidang === "Pelayanan" ? (
                                  <Activity size={24} />
                                ) : (
                                  <Sparkles size={24} />
                                )}
                              </div>
                              <span className="text-gmmi-navy font-bold text-sm tracking-tight block mb-2">
                                {prog.nama_program}
                              </span>
                              <p className="text-xs text-neutral-500 line-clamp-2">
                                {prog.jenis_kegiatan}
                              </p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-neutral-100 flex justify-between items-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                              <span>{prog.waktu_pelaksanaan}</span>
                            </div>
                          </div>
                        ))
                      : [
                          {
                            label: "Pewartaan",
                            icon: <Target className="w-6 h-6" />,
                          },
                          {
                            label: "Pelayanan",
                            icon: <Activity className="w-6 h-6" />,
                          },
                          {
                            label: "Persekutuan",
                            icon: <Users className="w-6 h-6" />,
                          },
                          {
                            label: "Pendidikan",
                            icon: <BookOpen className="w-6 h-6" />,
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="p-8 bg-neutral-50 rounded-[2.5rem] border border-neutral-100 group-hover:bg-white group-hover:shadow-xl transition-all duration-500"
                          >
                            <div className="text-gmmi-gold mb-4">
                              {item.icon}
                            </div>
                            <span className="text-gmmi-navy font-bold text-sm tracking-tight">
                              {item.label}
                            </span>
                          </div>
                        ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </section>

        {/* FAQ Section with MUI */}
        <section id="faq" className="space-y-16 py-10">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-neutral-100 text-gmmi-navy rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-neutral-200">
              <MessageCircle className="w-3.5 h-3.5" />
              Tanya Jawab
            </div>
            <h2 className="text-5xl font-bold text-gmmi-navy tracking-tight">
              Informasi Penting
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion
              variant="splitted"
              selectionMode="multiple"
              className="gap-6 px-0"
              itemClasses={{
                base: "rounded-[2rem] border border-slate-100 shadow-none hover:border-gmmi-gold/40 transition-all duration-400 data-[open=true]:border-gmmi-gold data-[open=true]:bg-white data-[open=true]:shadow-xl data-[open=true]:shadow-gmmi-gold/[0.08]",
                title: "font-extrabold text-slate-900 text-xl tracking-tight",
                trigger: "px-8 py-5",
                content:
                  "px-8 pb-8 pt-0 text-slate-500 leading-8 font-light text-base",
                indicator: "text-gmmi-gold",
              }}
            >
              {[
                {
                  q: "Kapan jadwal ibadah raya GMMI?",
                  a: "Ibadah Raya kami diadakan setiap hari Minggu pukul 08:00 WIB dan 10:00 WIB. Kami juga menyediakan layanan live streaming bagi jemaat yang berhalangan hadir fisik.",
                },
                {
                  q: "Bagaimana cara menjadi anggota jemaat?",
                  a: "Anda dapat menghubungi sekretariat kami setelah ibadah selesai atau mengisi formulir pendaftaran jemaat melalui portal yang tersedia di website ini.",
                },
                {
                  q: "Apakah ada kegiatan untuk anak-anak dan remaja?",
                  a: "Tentu! Kami memiliki Sekolah Minggu untuk anak-anak (pukul 08:00 WIB) dan persekutuan remaja/pemuda setiap hari Sabtu pukul 18:00 WIB.",
                },
              ].map((item, i) => (
                <AccordionItem
                  key={i}
                  aria-label={item.q}
                  title={item.q}
                  indicator={<Plus className="w-5 h-5 text-gmmi-gold" />}
                >
                  {item.a}
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
