import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, ArrowRight, Menu, X, Heart } from 'lucide-react';

// Import modular pages
import { Home } from './pages/Home';
import { PackagesCatalog } from './pages/PackagesCatalog';
import { PackageDetails } from './pages/PackageDetails';
import { GalleryGrid } from './pages/GalleryGrid';
import { AboutUs } from './pages/AboutUs';
import { ContactUs } from './pages/ContactUs';
import { GlassButton } from './components/GlassButton';

// ── Navbar item helper
const NavLink: React.FC<{ to: string; label: string; onClick?: () => void }> = ({
    to, label, onClick,
}) => {
    const location = useLocation();
    const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
    return (
        <Link
            to={to}
            onClick={onClick}
            className={`relative px-1 py-0.5 text-sm transition-colors duration-200 group ${active
                ? 'text-rose font-semibold'
                : 'text-dark/60 hover:text-dark font-normal'
                }`}
        >
            {label}
            <span
                className={`absolute -bottom-0.5 left-0 h-px bg-rose transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
            />
        </Link>
    );
};

// ── Page transition wrapper
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

// ── Scroll-aware navbar
const Navbar: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const navLinks = [
        { to: '/', label: 'Beranda' },
        { to: '/paket', label: 'Paket Pernikahan' },
        { to: '/galeri', label: 'Galeri' },
        { to: '/tentang-kami', label: 'Tentang Kami' },
        { to: '/kontak', label: 'Kontak' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 pt-3 md:pt-4">
            {/* Floating glass pill */}
            <div
                className={`max-w-7xl mx-auto flex items-center justify-between gap-4 rounded-2xl border px-4 md:px-5 py-2.5 transition-all duration-500 ${scrolled
                    ? 'bg-white border-rose/30 shadow-xl shadow-rose/15'
                    : 'bg-white border-rose/20 shadow-lg shadow-rose/10'
                    }`}
            >
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group shrink-0 -my-3 sm:-my-4 md:-my-5 lg:-my-6">
                    <img
                        src="/logo.png?v=3"
                        className="h-18 sm:h-20 md:h-24 lg:h-28 w-auto object-contain transition-all duration-500 group-hover:scale-105"
                        alt="Amaryllis Wedding & Organizer Logo"
                    />
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-5 lg:gap-7">
                    {navLinks.map(l => (
                        <NavLink key={l.to} {...l} />
                    ))}
                </nav>

                {/* CTA + Hamburger */}
                <div className="flex items-center gap-2.5 shrink-0">
                    <Link to="/kontak" className="hidden md:block">
                        <GlassButton variant="primary" size="sm" className="px-5 py-2.5">
                            Konsultasi Gratis
                            <ArrowRight size={13} />
                        </GlassButton>
                    </Link>
                    <motion.button
                        className="md:hidden p-2 border border-rose/20 rounded-xl text-dark/70 hover:text-rose hover:border-rose/40 transition-colors bg-white/60"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        whileTap={{ scale: 0.92 }}
                        aria-label="Toggle navigation"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </motion.button>
                </div>
            </div>

            {/* Mobile dropdown */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.nav
                        key="mobile-nav"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="md:hidden max-w-7xl mx-auto mt-2 rounded-2xl bg-white/95 backdrop-blur-xl border border-rose/10 shadow-xl shadow-rose/10 overflow-hidden"
                    >
                        <div className="flex flex-col gap-1 px-3 py-3">
                            {navLinks.map((l) => (
                                <Link
                                    key={l.to}
                                    to={l.to}
                                    onClick={() => setMobileOpen(false)}
                                    className="py-2.5 px-3 rounded-xl text-sm text-dark/70 hover:text-rose hover:bg-rose/5 transition-colors"
                                >
                                    {l.label}
                                </Link>
                            ))}
                            <Link to="/kontak" onClick={() => setMobileOpen(false)} className="mt-1.5 px-3 pb-1">
                                <GlassButton variant="primary" size="md" className="w-full">
                                    Konsultasi Gratis
                                    <ArrowRight size={14} />
                                </GlassButton>
                            </Link>
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
};

// ── Layout
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { pathname } = useLocation();
    const isHome = pathname === '/';

    return (
        <div className="flex flex-col min-h-screen relative overflow-hidden floral-bg">
            <Navbar />

            {/* Only the Home hero carries the pink background; other pages
                let the floral-bg body show through seamlessly */}
            <main className={`flex-grow pt-24 md:pt-28 relative z-10 ${isHome ? 'bg-cream' : ''}`}>
                <PageTransition>{children}</PageTransition>
            </main>

            {/* WhatsApp Floating Button */}
            <motion.a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
                className="wa-pulse fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full text-white shadow-2xl"
                style={{ background: 'linear-gradient(135deg, var(--color-rose), var(--color-gold))' }}
                whileHover={{ scale: 1.1, boxShadow: '0 0 24px rgba(27,77,62,0.5)' }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
            >
                <Phone size={24} />
            </motion.a>

            {/* Footer */}
            <footer className="bg-cream border-t border-rose/20 py-14 px-6 md:px-12 mt-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div>
                        <img
                            src="/logo.png?v=3"
                            alt="Amaryllis Wedding & Organizer"
                            className="h-36 w-auto -my-6 transition-transform duration-300 hover:scale-105"
                        />
                        <h3 className="font-display text-xl font-bold mb-3">
                            <span className="text-gradient-gold">Amaryllis</span>{' '}
                            <span className="text-rose">Wedding</span>
                        </h3>
                        <p className="text-sm text-dark/55 leading-relaxed">
                            Mewujudkan pernikahan impian Anda dengan layanan wedding organizer profesional.
                            Dari dekorasi, rias, dokumentasi, hingga katering — semua dalam satu paket.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gold/80 mb-4">Hubungi Kami</h4>
                        <ul className="text-sm text-dark/55 space-y-2.5">
                            <li className="flex items-center gap-2.5">
                                <Phone size={13} className="text-rose/70 shrink-0" />
                                <span>+62 812-3456-7890</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Mail size={13} className="text-rose/70 shrink-0" />
                                <span>info@amarylliswedding.com</span>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <MapPin size={13} className="text-rose/70 shrink-0 mt-0.5" />
                                <span>Jl. Kebun Raya No. 10, Bogor, Jawa Barat</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-gold/80 mb-4">Informasi Reservasi</h4>
                        <p className="text-sm text-dark/55 leading-relaxed mb-4">
                            Konsultasikan pernikahan impian Anda dengan tim wedding planner profesional kami.
                            Gratis konsultasi awal!
                        </p>
                        <Link
                            to="/paket"
                            className="text-rose text-sm font-semibold inline-flex items-center gap-1.5 hover:text-gold transition-colors"
                        >
                            Lihat Semua Paket <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
                <div className="border-t border-rose/10 mt-10 pt-6 text-center text-xs text-dark/30 flex items-center justify-center gap-1">
                    <Heart size={12} className="text-rose/50" />
                    © {new Date().getFullYear()} Amaryllis Wedding & Organizer. All rights reserved.
                    <Heart size={12} className="text-rose/50" />
                </div>
            </footer>
        </div>
    );
};

// ── Router
const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/paket" element={<PackagesCatalog />} />
            <Route path="/paket/:slug" element={<PackageDetails />} />
            <Route path="/galeri" element={<GalleryGrid />} />
            <Route path="/tentang-kami" element={<AboutUs />} />
            <Route path="/kontak" element={<ContactUs />} />
        </Routes>
    );
};

const App: React.FC = () => (
    <BrowserRouter>
        <Layout>
            <AppRoutes />
        </Layout>
    </BrowserRouter>
);

const container = document.getElementById('app');
if (container) {
    createRoot(container).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}