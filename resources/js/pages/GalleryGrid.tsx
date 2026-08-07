import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { X, ZoomIn, Heart, Sparkles } from 'lucide-react';
import type { Gallery } from '../types';

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp: Variants = {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export const GalleryGrid: React.FC = () => {
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [loading, setLoading] = useState(true);
    const [lightbox, setLightbox] = useState<Gallery | null>(null);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/galleries');
                if (res.ok) setGalleries(await res.json());
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const categories = ['all', 'akad', 'resepsi', 'prewedding', 'dekorasi'];

    return (
        <div className="relative px-6 md:px-12 py-12 max-w-7xl mx-auto overflow-x-hidden floral-bg">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12 mt-12"
            >
                <span className="text-xs uppercase tracking-[0.2em] text-rose font-semibold font-utility">Dokumentasi</span>
                <h1 className="font-display text-3xl md:text-5xl font-bold text-dark mt-2">
                    Galeri <span className="text-gradient-gold">Pernikahan</span>
                </h1>
                <div className="flex items-center justify-center gap-3 mt-5">
                    <span className="wedding-divider w-16" />
                    <Sparkles size={13} className="text-gold/80" />
                    <span className="wedding-divider w-16" />
                </div>
                <p className="text-dark/40 mt-3 text-xs uppercase tracking-widest font-utility">
                    Momen-momen indah dari pasangan yang telah mempercayakan hari bahagianya kepada kami
                </p>
            </motion.div>

            {/* Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-200 border ${
                            filter === cat
                                ? 'bg-rose border-rose text-white shadow-sm'
                                : 'bg-white border-rose/20 text-dark/60 hover:text-rose hover:border-rose/40'
                        }`}
                    >
                        {cat === 'all' ? 'Semua' : cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="columns-1 sm:columns-2 md:columns-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className={`skeleton rounded-2xl mb-4 ${i % 3 === 0 ? 'h-64' : i % 3 === 1 ? 'h-48' : 'h-80'}`} />
                    ))}
                </div>
            ) : (
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="show"
                    className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4"
                >
                    {galleries
                        .filter(img => filter === 'all' || img.title.toLowerCase().includes(filter))
                        .map(img => (
                            <motion.div
                                key={img.id}
                                variants={fadeUp}
                                className="break-inside-avoid mb-4 relative group overflow-hidden rounded-2xl glass-card border border-rose/10 cursor-pointer shadow-sm"
                                onClick={() => setLightbox(img)}
                                whileHover={{ scale: 1.015 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            >
                                <img
                                    src={img.image}
                                    alt={img.title}
                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 border border-rose/10 rounded-2xl"
                                    loading="lazy"
                                />
                                
                                <div 
                                    className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                                    style={{ 
                                        background: 'linear-gradient(to top, rgba(212,165,165,0.9), transparent)',
                                    }}
                                >
                                    <motion.div
                                        initial={{ y: 10, opacity: 0 }}
                                        whileInView={{ y: 0, opacity: 1 }}
                                        className="flex justify-between items-end"
                                    >
                                        <div>
                                            <h4 className="font-display font-bold text-white text-sm uppercase tracking-wide">{img.title}</h4>
                                            {img.event_date && (
                                                <p className="text-[9px] text-white/80 font-utility uppercase tracking-wider mt-1.5 font-bold">
                                                    {new Date(img.event_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
                                                </p>
                                            )}
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white/80 hover:text-white transition-colors">
                                            <ZoomIn size={13} />
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                </motion.div>
            )}

            {/* Lightbox Modal */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        key="lightbox"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-md"
                        style={{ background: 'rgba(0,0,0,0.85)' }}
                        onClick={() => setLightbox(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                            className="relative max-w-4xl w-full max-h-[85vh] flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setLightbox(null)}
                                className="absolute -top-4 -right-4 z-10 w-9 h-9 rounded-full glass-card border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                            <img
                                src={lightbox.image}
                                alt={lightbox.title}
                                className="w-full max-h-[75vh] object-contain rounded-2xl border border-rose/30 shadow-2xl"
                            />
                            <div className="mt-4 text-center">
                                <p className="font-display font-bold text-white text-base tracking-wide uppercase">{lightbox.title}</p>
                                {lightbox.event_date && (
                                    <p className="text-[10px] text-rose font-utility uppercase tracking-widest mt-2 font-bold">
                                        {new Date(lightbox.event_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};