import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { animate, stagger as animeStagger } from 'animejs';
import {
    ChevronRight, Star, Clock, Coins, ShieldAlert,
    CheckCircle2, Sparkles, ArrowRight, Heart, Camera, Music,
    Palette, UtensilsCrossed, Building2, Scissors, ChevronDown, Quote
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';

import type { Category, Testimonial } from '../types';

export const getPackageThumbnail = (slug: string): string => {
    const map: Record<string, string> = {
        'paket-akad':     'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800',
        'paket-resepsi':  'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800',
        'paket-all-in':   'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800',
        'paket-premium':  'https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=800',
        'paket-prewedding': 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800',
    };
    return map[slug] ?? map['paket-resepsi'];
};

const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const CountUp: React.FC<{ value: number }> = ({ value }) => {
    const [displayVal, setDisplayVal] = useState(0);
    useEffect(() => {
        let start = displayVal;
        const end = value;
        if (start === end) return;
        const duration = 400;
        const range = end - start;
        let current = start;
        const increment = end > start ? Math.ceil(range / 12) : Math.floor(range / 12);
        const stepTime = Math.abs(Math.floor(duration / 12));
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                setDisplayVal(end);
                clearInterval(timer);
            } else {
                setDisplayVal(current);
            }
        }, stepTime);
        return () => clearInterval(timer);
    }, [value]);
    return <span>{displayVal.toLocaleString('id-ID')}</span>;
};

export const Home: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const [catRes, tRes] = await Promise.all([
                    fetch('/api/categories'),
                    fetch('/api/testimonials'),
                ]);
                if (catRes.ok) setCategories(await catRes.json());
                if (tRes.ok) setTestimonials((await tRes.json()).slice(0, 3));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();

        animate('.anime-hero-title', {
            translateY: [48, 0],
            opacity: [0, 1],
            easing: 'easeOutExpo',
            duration: 1300,
            delay: 200
        });
        animate('.anime-hero-desc', {
            translateY: [32, 0],
            opacity: [0, 1],
            easing: 'easeOutExpo',
            duration: 1300,
            delay: 350
        });
        animate('.anime-hero-cta', {
            translateY: [24, 0],
            opacity: [0, 1],
            easing: 'easeOutExpo',
            duration: 1100,
            delay: 450
        });
        animate('.anime-hero-img', {
            translateX: [40, 0],
            opacity: [0, 1],
            easing: 'easeOutExpo',
            duration: 1400,
            delay: 500
        });
        animate('.anime-bento-card', {
            translateY: [60, 0],
            opacity: [0, 1],
            easing: 'easeOutExpo',
            duration: 1200,
            delay: animeStagger(120, { start: 600 })
        });
    }, []);

    const allPackages = categories.flatMap(cat =>
        cat.packages.map(pkg => ({ ...pkg, categoryName: cat.name }))
    );

    const problems = [
        {
            icon: <Clock size={22} />,
            title: 'Ribet Urus Vendor',
            desc: 'Harus menghubungi satu per satu vendor dekorasi, rias, dokumentasi, katering — melelahkan dan memakan waktu.',
        },
        {
            icon: <Coins size={22} />,
            title: 'Budget Membengkak',
            desc: 'Biaya tersembunyi mulai dari dekorasi tambahan, biaya lembur, hingga transportasi vendor yang tidak terduga.',
        },
        {
            icon: <ShieldAlert size={22} />,
            title: 'Koordinasi Kacau',
            desc: 'Komunikasi antar vendor yang tidak sinkron sering menyebabkan keterlambatan dan hasil yang tidak maksimal.',
        },
    ];

    const services = [
        { icon: <Palette size={24} />, title: 'Dekorasi', desc: 'Dekorasi pelaminan & venue dengan tema romantis eksklusif' },
        { icon: <Scissors size={24} />, title: 'Rias & Busana', desc: 'Makeup profesional, sanggul, dan sewai kebaya gaun pengantin' },
        { icon: <Camera size={24} />, title: 'Dokumentasi', desc: 'Foto & video cinematic untuk kenangan abadi hari bahagia' },
        { icon: <UtensilsCrossed size={24} />, title: 'Katering', desc: 'Hidangan prasmanan nusantara & internasional untuk tamu' },
        { icon: <Building2 size={24} />, title: 'Venue', desc: 'Gedung pernikahan dengan kapasitas besar dan dekorasi mewah' },
        { icon: <Music size={24} />, title: 'Hiburan', desc: 'MC profesional, musik akustik, dan hiburan spesial lainnya' },
    ];

    return (
        <div className="overflow-x-hidden">
            {/* ───── HERO ───── */}
            <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-24 overflow-hidden"
                style={{ background: 'var(--color-cream)' }}
            >
                {/* Decorative circles */}
                <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-rose/5 blur-3xl pointer-events-none" />
                <div className="absolute bottom-10 right-20 w-80 h-80 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

                {/* Floating sparkles */}
                <Sparkles size={18} className="hero-sparkle absolute top-24 right-[12%] text-gold/60 pointer-events-none hidden md:block" />
                <Heart size={14} className="hero-sparkle absolute top-[38%] left-[6%] text-rose/50 pointer-events-none hidden md:block" style={{ animationDelay: '1.2s' }} />
                <Sparkles size={12} className="hero-sparkle absolute bottom-[22%] left-[18%] text-rose/50 pointer-events-none hidden md:block" style={{ animationDelay: '2.1s' }} />
                <Heart size={16} className="hero-sparkle absolute bottom-[30%] right-[6%] text-gold/50 pointer-events-none hidden md:block" style={{ animationDelay: '0.6s' }} />

                <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 text-center lg:text-left">
                        <motion.span
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="inline-block text-xs uppercase tracking-[0.2em] text-rose font-semibold font-utility mb-4 px-4 py-1.5 rounded-full bg-white/60 border border-rose/20"
                        >
                            LUXURY Wedding Organizer
                        </motion.span>

                        <h1 className="anime-hero-title opacity-0 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-dark leading-[1.1] mb-6">
                            Mewujudkan{' '}
                            <span className="text-rose">Pernikahan</span>
                            <br />
                            <span className="text-gradient-gold">Impian Anda</span>
                        </h1>

                        <p className="anime-hero-desc opacity-0 text-dark/60 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
                            Nikmati pengalaman wedding planning yang menyenangkan dengan paket all-in 
                            dari dekorasi, rias, dokumentasi, katering, hingga venue. Satu vendor, tanpa ribet!
                        </p>

                        <div className="anime-hero-cta opacity-0 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/paket">
                                <GlassButton variant="primary" size="lg">
                                    <Heart size={18} />
                                    Lihat Paket Pernikahan
                                </GlassButton>
                            </Link>
                            <Link to="/kontak">
                                <GlassButton variant="outline" size="lg">
                                    Konsultasi Gratis
                                    <ChevronRight size={16} />
                                </GlassButton>
                            </Link>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                            className="mt-16 flex flex-wrap justify-center lg:justify-start gap-6 text-[10px] text-dark/40 uppercase tracking-widest font-utility"
                        >
                            {['200+ Pasangan Bahagia', 'Bogor & Jabodetabek', 'All-in Package'].map(t => (
                                <span key={t} className="border-r border-rose/15 pr-6 last:border-0">{t}</span>
                            ))}
                        </motion.div>
                    </div>

                    <div className="lg:col-span-5 relative pr-0 lg:pr-6 mt-10 lg:mt-0">
                        <div className="anime-hero-img opacity-0 relative max-w-md mx-auto">
                            <div className="absolute -inset-4 bg-gradient-to-br from-rose/15 to-gold/15 rounded-3xl blur-xl -z-10 animate-pulse-soft" />
                            <img
                                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800"
                                alt="Wedding Decoration"
                                className="relative w-full h-[320px] md:h-[400px] lg:h-[500px] object-cover rounded-2xl shadow-2xl"
                            />
                            {/* Floating rating badge */}
                            <div className="absolute -top-5 -right-3 md:-right-5 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-gold/30 animate-float rotate-3 hover:rotate-0 transition-transform duration-300">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={11} className="text-gold fill-gold" />
                                        ))}
                                    </div>
                                    <span className="text-[9px] font-utility uppercase tracking-wider text-dark/65 font-bold">200+ Review</span>
                                </div>
                            </div>
                            <div className="absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-rose/25 -rotate-2 hover:rotate-0 transition-transform duration-300">
                                <p className="text-sm font-bold text-gradient-gold leading-none font-utility">200+</p>
                                <p className="text-[9px] text-dark/50 font-bold uppercase tracking-wider mt-0.5">Pasangan Bahagia</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1.5 text-dark/30"
                >
                    <span className="text-[9px] font-utility uppercase tracking-[0.3em]">Scroll</span>
                    <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}>
                        <ChevronDown size={16} />
                    </motion.div>
                </motion.div>

                <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, var(--color-warm-white), transparent)' }} />
            </section>

            {/* ───── PROBLEMS ───── */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                    className="text-center mb-14"
                >
                    <motion.span variants={fadeUp} className="text-xs uppercase tracking-[0.2em] text-rose font-semibold font-utility">
                        Masalah Umum
                    </motion.span>
                    <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-4xl font-bold text-dark mt-2">
                        Stres Merencanakan Pernikahan?
                    </motion.h2>
                    <motion.p variants={fadeUp} className="text-dark/50 text-sm max-w-xl mx-auto mt-4">
                        Kami paham setiap pasangan ingin hari spesialnya sempurna. 
                        Biarkan kami yang mengurus semua detailnya.
                    </motion.p>
                </motion.div>

                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-60px' }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {problems.map((p, i) => (
                        <motion.div key={i} variants={fadeUp}>
                            <GlassCard className="p-8 h-full" hover>
                                <div className="flex items-center gap-3.5 mb-4">
                                    <span className="text-rose shrink-0">{p.icon}</span>
                                    <h3 className="font-display text-lg font-semibold text-dark leading-snug">{p.title}</h3>
                                </div>
                                <p className="text-dark/50 text-sm leading-relaxed">{p.desc}</p>
                            </GlassCard>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ───── SERVICES (BENTO GRID) ───── */}
            <section className="py-24 px-6 md:px-12 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-xs uppercase tracking-[0.2em] text-rose font-semibold font-utility">Layanan Unggulan</span>
                        <h2 className="font-display text-3xl md:text-5xl font-bold text-dark mt-2">
                            Layanan Wedding Lengkap
                        </h2>
                        <div className="flex items-center justify-center gap-3 mt-5">
                            <span className="wedding-divider w-16" />
                            <Sparkles size={13} className="text-gold/80" />
                            <span className="wedding-divider w-16" />
                        </div>
                        <p className="text-dark/50 text-sm max-w-xl mx-auto mt-4 leading-relaxed">
                            Dari dekorasi hingga hiburan, semua kebutuhan pernikahan Anda dalam satu tim profesional.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[240px]">
                        {/* Cell 1: Featured Service (spans 2x2) */}
                        <GlassCard variant="rose" className="anime-bento-card opacity-0 md:col-span-2 lg:col-span-2 lg:row-span-2 p-8 flex flex-col justify-between" hover>
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-rose">
                                        <Heart size={20} />
                                    </span>
                                    <div>
                                        <h3 className="font-display text-base font-bold text-dark uppercase tracking-wider">Paket All-in Wedding</h3>
                                        <p className="text-dark/40 text-[9px] font-utility tracking-widest">SOLUSI LENGKAP NIKAH TANPA RIBET</p>
                                    </div>
                                </div>
                                <p className="text-dark/60 text-xs leading-relaxed max-w-xl">
                                    Nikmati kemudahan dengan satu paket lengkap yang mencakup dekorasi pelaminan & venue, 
                                    rias pengantin & busana, dokumentasi foto & video, katering prasmanan, 
                                    venue gedung, dan hiburan spesial. Semua dikelola oleh tim profesional kami.
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                                    {['Dekorasi Venue', 'Rias & Busana', 'Dokumentasi', 'Katering', 'Venue', 'Hiburan'].map(s => (
                                        <motion.div 
                                            key={s} 
                                            whileHover={{ scale: 1.03, backgroundColor: 'rgba(212, 165, 165, 0.08)', borderColor: 'rgba(212, 165, 165, 0.3)' }}
                                            className="bg-rose/5 border border-rose/10 p-3 rounded-xl text-center transition-colors duration-200"
                                        >
                                            <p className="text-rose font-display font-semibold text-xs">{s}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            <div className="border-t border-rose/10 pt-4 text-[10px] text-dark/35 font-utility uppercase tracking-widest flex justify-between">
                                <span>FREE KONSULTASI</span>
                                <span>100% PROFESIONAL</span>
                            </div>
                        </GlassCard>

                        {/* Service Cards */}
                        {services.slice(0, 4).map((svc, i) => (
                            <GlassCard key={i} variant="default" className="anime-bento-card opacity-0 p-6 flex flex-col justify-between" hover>
                                <div className="flex justify-between items-start">
                                    <span className="text-rose p-2.5 bg-rose/5 border border-rose/10 rounded-xl">{svc.icon}</span>
                                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/25 font-utility font-semibold tracking-wider">
                                        PREMIUM
                                    </span>
                                </div>
                                <div>
                                    <h4 className="font-display font-semibold text-dark text-sm mb-1.5">{svc.title}</h4>
                                    <p className="text-dark/55 text-[11px] leading-relaxed line-clamp-3">{svc.desc}</p>
                                </div>
                                <span className="text-[9px] text-dark/35 font-utility uppercase border-t border-rose/5 pt-2 tracking-wider font-semibold">
                                    WEDDING SERVICE
                                </span>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* ───── PACKAGES ───── */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                    className="text-left mb-14 border-b border-rose/10 pb-6"
                >
                    <motion.span variants={fadeUp} className="text-xs uppercase tracking-[0.2em] text-rose font-semibold font-utility flex items-center gap-1.5">
                        <Heart size={12} /> Paket Pernikahan
                    </motion.span>
                    <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-4xl font-bold text-dark mt-2">
                        Pilihan Paket Pernikahan
                    </motion.h2>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="glass-card rounded-2xl overflow-hidden">
                                <div className="skeleton h-48 w-full" />
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
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: '-60px' }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {allPackages.map((pkg, i) => (
                            <motion.div key={pkg.id} variants={fadeUp}>
                                <GlassCard className="overflow-hidden flex flex-col h-full" hover>
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={getPackageThumbnail(pkg.slug)}
                                            alt={pkg.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent" />
                                        <div className="absolute bottom-3 left-3">
                                            <span className="text-[9px] px-2 py-0.5 rounded-full font-utility uppercase tracking-widest border border-rose/20 text-white/90 bg-rose/40 backdrop-blur-sm">
                                                {pkg.categoryName}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-grow space-y-4">
                                        <div>
                                            <h3 className="font-display text-base font-semibold text-dark leading-tight">{pkg.name}</h3>
                                            <p className="text-dark/45 text-xs mt-1.5 leading-relaxed line-clamp-2">{pkg.description}</p>
                                        </div>

                                        {pkg.menu_items.length > 0 && (
                                            <div className="space-y-2">
                                                <span className="text-[10px] uppercase tracking-widest text-rose/70 font-utility">Layanan Termasuk</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {pkg.menu_items.slice(0, 4).map(m => (
                                                        <span key={m.id} className="text-[9px] px-2 py-0.5 rounded-full glass-card border border-rose/10 text-dark/60">
                                                            {m.name}
                                                        </span>
                                                    ))}
                                                    {pkg.menu_items.length > 4 && (
                                                        <span className="text-[9px] px-2 py-0.5 rounded-full text-dark/40">
                                                            +{pkg.menu_items.length - 4} lainnya
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-auto pt-4 border-t border-rose/10 flex justify-between items-center">
                                            <div>
                                                <span className="text-[10px] text-dark/35 font-utility uppercase">Mulai dari</span>
                                                <p className="text-rose font-bold font-utility text-base">
                                                    Rp {Number(pkg.price_per_pax).toLocaleString('id-ID')}
                                                    <span className="text-xs font-normal text-dark/35">/pax</span>
                                                </p>
                                                <span className="text-[9px] text-dark/30 font-utility uppercase block"></span>
                                            </div>
                                            <Link to={`/paket/${pkg.slug}`}>
                                                <GlassButton variant="primary" size="sm">
                                                    Lihat Detail
                                                    <ChevronRight size={14} />
                                                </GlassButton>
                                            </Link>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-10"
                >
                    <Link to="/paket">
                        <GlassButton variant="outline" size="md">
                            Lihat Semua Paket
                            <ArrowRight size={16} />
                        </GlassButton>
                    </Link>
                </motion.div>
            </section>

            {/* ───── TESTIMONIALS ───── */}
            {testimonials.length > 0 && (
                <section className="py-24 px-6 md:px-12 relative overflow-hidden bg-cream/30">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            variants={stagger}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="text-center mb-14"
                        >
                            <motion.span variants={fadeUp} className="text-xs uppercase tracking-[0.2em] text-rose font-semibold font-utility">
                                Testimoni
                            </motion.span>
                            <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-4xl font-bold text-dark mt-2">
                                Kata Mereka yang Bahagia
                            </motion.h2>
                            <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mt-5">
                                <span className="wedding-divider w-16" />
                                <Sparkles size={13} className="text-gold/80" />
                                <span className="wedding-divider w-16" />
                            </motion.div>
                        </motion.div>

                        <motion.div
                            variants={stagger}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        >
                            {testimonials.map((t, i) => (
                                <motion.div key={t.id} variants={fadeUp}>
                                    <GlassCard variant="default" className="p-7 flex flex-col justify-between h-full relative">
                                        <Quote size={40} className="absolute -top-1 right-4 text-rose/10 rotate-180" />
                                        <div>
                                            <div className="flex gap-1 mb-4">
                                                {[...Array(t.rating)].map((_, j) => (
                                                    <Star key={j} size={14} className="text-gold fill-gold" />
                                                ))}
                                            </div>
                                            <p className="text-dark/70 text-sm leading-relaxed italic mb-6">
                                                "{t.content}"
                                            </p>
                                        </div>
                                        <div className="border-t border-rose/10 pt-4 flex justify-between items-center">
                                            <span className="text-sm font-semibold text-rose">{t.customer_name}</span>
                                            <span className="text-[10px] text-dark/35 font-utility uppercase tracking-wider">{t.event_type}</span>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* ───── CTA ───── */}
            <section className="py-28 px-6 text-center relative overflow-hidden"
                style={{ background: 'var(--color-cream)' }}
            >
                {/* Decorative sparkles */}
                <Sparkles size={18} className="hero-sparkle absolute top-16 left-[8%] text-gold/50 pointer-events-none hidden md:block" />
                <Heart size={14} className="hero-sparkle absolute bottom-20 right-[10%] text-rose/40 pointer-events-none hidden md:block" style={{ animationDelay: '1s' }} />
                <Sparkles size={12} className="hero-sparkle absolute top-1/2 right-[4%] text-rose/40 pointer-events-none hidden md:block" style={{ animationDelay: '2s' }} />
                <div className="relative z-10 max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <GlassCard variant="default" className="p-10 md:p-14" hover={false}>
                            <Heart size={32} className="text-rose mx-auto mb-6" />
                            <h2 className="font-display text-3xl md:text-4xl font-bold text-dark mb-4">
                                Siap Mewujudkan Pernikahan Impian?
                            </h2>
                            <p className="text-dark/55 mb-8 leading-relaxed">
                                Konsultasikan rencana pernikahan Anda dengan tim wedding planner profesional kami. 
                                Gratis dan tanpa kewajiban!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/paket">
                                    <GlassButton variant="primary" size="lg">
                                        <Heart size={18} />
                                        Lihat Paket Pernikahan
                                    </GlassButton>
                                </Link>
                                <Link to="/kontak">
                                    <GlassButton variant="outline" size="lg">
                                        Konsultasi Gratis
                                        <ArrowRight size={16} />
                                    </GlassButton>
                                </Link>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};