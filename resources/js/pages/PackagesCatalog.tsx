import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ChevronRight, Heart, Sparkles } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { getPackageThumbnail } from './Home';
import type { Category, Package } from '../types';
import { getCapacityText } from '../types';

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp: Variants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } } };

export const PackagesCatalog: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCatalog = async () => {
            setLoading(true);
            try {
                const catRes = await fetch('/api/categories');
                if (catRes.ok) setCategories(await catRes.json());

                let url = '/api/packages?sort=price_asc';
                if (selectedCategory) url += `&category_id=${selectedCategory}`;

                const pkgRes = await fetch(url);
                if (pkgRes.ok) setPackages(await pkgRes.json());
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCatalog();
    }, [selectedCategory]);

    return (
        <div className="relative min-h-screen px-6 md:px-12 py-12 max-w-7xl mx-auto overflow-x-hidden floral-bg">
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-rose/10 pb-8 mb-10 mt-12 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="text-left max-w-xl"
                >
                    <span className="text-xs uppercase tracking-[0.2em] text-rose font-semibold font-utility">Paket Pernikahan</span>
                    <h1 className="font-display text-3xl md:text-5xl font-bold text-dark mt-2 mb-3">
                        Katalog{' '}
                        <span className="text-gradient-gold">Paket Pernikahan</span>
                    </h1>
                    <p className="text-dark/40 text-xs uppercase tracking-widest font-utility">
                        Pilih paket pernikahan impian Anda
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.45 }}
                >
                    <GlassCard className="p-3 flex flex-wrap items-center gap-3">
                        {[{ id: null, name: 'Semua' }, ...categories].map((cat) => {
                            const active = selectedCategory === (cat.id ?? null);
                            return (
                                <motion.button
                                    key={cat.id ?? 'all'}
                                    onClick={() => setSelectedCategory(cat.id ?? null)}
                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${
                                        active
                                            ? 'bg-gradient-to-r from-rose to-rose-light border-rose text-white shadow-md shadow-rose/10 font-bold'
                                            : 'bg-white/80 border-rose/15 text-dark/65 hover:text-rose hover:border-rose/35 hover:bg-white'
                                    }`}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {cat.name}
                                </motion.button>
                            );
                        })}
                    </GlassCard>
                </motion.div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="glass-card rounded-2xl overflow-hidden">
                            <div className="skeleton h-52 w-full" />
                            <div className="p-6 space-y-3">
                                <div className="skeleton h-4 w-3/4" />
                                <div className="skeleton h-3 w-full" />
                                <div className="skeleton h-3 w-5/6" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <motion.div
                    key={selectedCategory ?? 'all'}
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {packages.map((pkg) => (
                        <motion.div key={pkg.id} variants={fadeUp}>
                            <GlassCard className="overflow-hidden flex flex-col h-full relative group" hover>
                                <div className="relative h-48 overflow-hidden m-4 rounded-xl border border-rose/15">
                                    <img
                                        src={getPackageThumbnail(pkg.slug)}
                                        alt={pkg.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent" />
                                    <div className="absolute bottom-3 left-3">
                                        <span className="text-[8px] px-2 py-0.5 rounded-full font-utility uppercase tracking-widest border border-rose/30 text-white/90 bg-rose/40 backdrop-blur-md">
                                            {(pkg as any).category?.name}
                                        </span>
                                    </div>
                                </div>

                                <div className="px-6 pb-6 pt-2 flex flex-col flex-grow justify-between gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h2 className="font-display text-lg font-bold text-dark leading-tight uppercase tracking-wide border-b border-rose/10 pb-2">
                                                {pkg.name}
                                            </h2>
                                            <p className="text-dark/40 text-xs mt-2.5 leading-relaxed line-clamp-2">{pkg.description}</p>
                                        </div>

                                        {pkg.menu_items.length > 0 && (
                                            <div className="space-y-1.5">
                                                <p className="text-[9px] uppercase tracking-widest text-rose/60 font-utility font-bold flex items-center gap-1">
                                                    <Sparkles size={10} /> Layanan Termasuk
                                                </p>
                                                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                                    {pkg.menu_items.slice(0, 4).map(m => (
                                                        <span key={m.id} className="text-[10px] text-dark/60 truncate font-display">
                                                            · {m.name}
                                                        </span>
                                                    ))}
                                                    {pkg.menu_items.length > 4 && (
                                                        <span className="text-[10px] text-dark/35 font-utility col-span-2">
                                                            +{pkg.menu_items.length - 4} Layanan Lainnya...
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-rose/10 pt-4 space-y-4 mt-auto">
                                        <div className="flex justify-between items-center text-[10px] text-dark/35 font-utility uppercase tracking-wider">
                                            <span>Kapasitas</span>
                                            <span className="font-bold text-dark/60">{getCapacityText(pkg)}</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[9px] text-dark/30 font-utility uppercase">{pkg.is_flat ? 'Harga Paket' : 'Mulai dari'}</p>
                                                <p className="text-rose font-bold font-utility text-base leading-none">
                                                    Rp {Number(pkg.price_per_pax).toLocaleString('id-ID')}
                                                    {!pkg.is_flat && <span className="text-[10px] font-normal text-dark/30">/pax</span>}
                                                </p>
                                                <p className="text-[8px] text-dark/30 font-utility uppercase mt-1"></p>
                                            </div>
                                            <Link to={`/paket/${pkg.slug}`}>
                                                <GlassButton variant="primary" size="sm" className="px-5 py-2.5">
                                                    Lihat Rincian
                                                    <ChevronRight size={13} />
                                                </GlassButton>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {!loading && packages.length === 0 && (
                <div className="text-center py-20 text-dark/30 text-xs font-utility uppercase tracking-widest">
                    Tidak ada paket untuk kategori ini.
                </div>
            )}
        </div>
    );
};