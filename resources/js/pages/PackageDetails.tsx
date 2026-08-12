import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Check, Phone, Heart, ChevronLeft, Users, Tag, Calendar, MapPin, Sparkles } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { getPackageThumbnail } from './Home';
import type { Package, Addon } from '../types';
import { getCapacityText } from '../types';

const AnimNum: React.FC<{ value: number }> = ({ value }) => {
    const [display, setDisplay] = useState(value);
    useEffect(() => {
        let frame: number;
        const start = display;
        const end = value;
        if (start === end) return;
        const duration = 400;
        const startTime = performance.now();
        const animate = (now: number) => {
            const p = Math.min((now - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setDisplay(Math.round(start + (end - start) * ease));
            if (p < 1) frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [value]);
    return <>{display.toLocaleString('id-ID')}</>;
};

const typeLabels: Record<string, string> = {
    decoration: 'Dekorasi',
    makeup: 'Rias & Busana',
    photo: 'Dokumentasi',
    venue: 'Venue',
    catering: 'Katering',
    entertainment: 'Hiburan',
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};
const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
};

export const PackageDetails: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [pkg, setPkg] = useState<Package | null>(null);
    const [addons, setAddons] = useState<Addon[]>([]);
    const [loading, setLoading] = useState(true);

    const [pax, setPax] = useState(250);
    const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
    const [form, setForm] = useState({ customer_name: '', customer_phone: '', customer_email: '', event_date: '', event_location: '', notes: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState<any>(null);
    const [waUrl, setWaUrl] = useState('');

    const [price, setPrice] = useState({ packageCost: 0, addonsCost: 0, addonBreakdown: [] as any[], subtotal: 0, discountPct: 0, discountAmt: 0, total: 0 });

    useEffect(() => {
        (async () => {
            try {
                const [pkgRes, addonRes] = await Promise.all([
                    fetch(`/api/packages/${slug}`),
                    fetch('/api/addons'),
                ]);
                if (pkgRes.ok) {
                    const d: Package = await pkgRes.json();
                    setPkg(d);
                    setPax(d.min_pax);
                }
                if (addonRes.ok) setAddons(await addonRes.json());
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, [slug]);

    useEffect(() => {
        if (!pkg) return;
        const packageCost = pkg.is_flat 
            ? Number(pkg.price_per_pax) 
            : Number(pkg.price_per_pax) * pax;
        let addonsCost = 0;
        const addonBreakdown: any[] = [];
        selectedAddons.forEach(id => {
            const a = addons.find(x => x.id === id);
            if (!a) return;
            const cost = a.pricing_type === 'per_pax' ? Number(a.price) * pax : Number(a.price);
            addonsCost += cost;
            addonBreakdown.push({ name: a.name, pricing_type: a.pricing_type, price: Number(a.price), cost });
        });
        const subtotal = packageCost + addonsCost;

        let discountPct = 0;
        const tiers = (pkg.pricing_tiers ?? []).filter((t: any) => Number(t.min_pax) <= pax).sort((a: any, b: any) => b.min_pax - a.min_pax);
        if (tiers[0]) {
            discountPct = Number(tiers[0].discount_percent);
        } else {
            if (pax >= 500) discountPct = 10;
            else if (pax >= 250) discountPct = 5;
        }

        const discountAmt = subtotal * (discountPct / 100);
        setPrice({ packageCost, addonsCost, addonBreakdown, subtotal, discountPct, discountAmt, total: subtotal - discountAmt });
    }, [pkg, pax, selectedAddons, addons]);

    const toggleAddon = useCallback((id: number) => {
        setSelectedAddons(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    }, []);

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.customer_name.trim()) e.customer_name = 'Nama wajib diisi';
        if (!form.customer_phone.trim()) e.customer_phone = 'No. WhatsApp wajib diisi';
        if (!form.event_date) e.event_date = 'Tanggal acara wajib diisi';
        setErrors(e);
        return !Object.keys(e).length;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate() || !pkg) return;
        setSubmitting(true);
        try {
            const res = await fetch('/api/quotations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({ package_id: pkg.id, pax, addon_ids: selectedAddons, ...form }),
            });
            const data = await res.json();
            if (res.ok) {
                setSubmitted(data.quotation);
                setWaUrl(data.whatsapp_url ?? '');
            } else {
                alert(data.message || 'Terjadi kesalahan.');
            }
        } catch {
            alert('Gagal menghubungi server.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-6">
                <div className="skeleton h-64 rounded-2xl w-full" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="skeleton h-80 rounded-2xl" />
                    <div className="skeleton h-80 rounded-2xl" />
                </div>
            </div>
        );
    }

    if (!pkg) {
        return (
            <div className="text-center py-32 text-dark/40">Paket tidak ditemukan.</div>
        );
    }

    const groupedMenu = pkg.menu_items.reduce((acc, item) => {
        if (!acc[item.type]) acc[item.type] = [];
        acc[item.type].push(item);
        return acc;
    }, {} as Record<string, typeof pkg.menu_items>);

    return (
        <div className="relative pb-24 floral-bg">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 space-y-10 relative z-10">

                {/* Back nav */}
                <Link to="/paket" className="inline-flex items-center gap-1.5 text-dark/40 hover:text-rose text-sm transition-colors">
                    <ChevronLeft size={16} /> Kembali ke Katalog
                </Link>

                {/* ── Hero Card */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                    <GlassCard className="overflow-hidden grid grid-cols-1 md:grid-cols-12">
                        <div className="md:col-span-5 h-60 md:h-auto relative overflow-hidden">
                            <img
                                src={getPackageThumbnail(pkg.slug)}
                                alt={pkg.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent" />
                            <div className="absolute top-4 left-4">
                                <span className="text-[9px] px-2.5 py-1 rounded-full font-utility uppercase tracking-widest border border-rose/30 text-rose glass-card">
                                    {(pkg as any).category?.name}
                                </span>
                            </div>
                        </div>
                        <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-center">
                            <span className="text-[10px] uppercase tracking-widest text-rose/70 font-utility mb-2">Paket Pernikahan</span>
                            <h1 className="font-display text-2xl md:text-3xl font-bold text-dark mb-3">{pkg.name}</h1>
                            <div className="h-px w-16 bg-rose/50 mb-4" />
                            <p className="text-dark/55 text-sm leading-relaxed mb-6">{pkg.description}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-utility">
                                <div>
                                    <p className="text-[10px] text-dark/30 uppercase mb-1">{pkg.is_flat ? 'Harga Paket (Flat Fee)' : 'Harga per Orang'}</p>
                                    <p className="text-rose font-bold">
                                        Rp {Number(pkg.price_per_pax).toLocaleString('id-ID')}
                                        {!pkg.is_flat && <span className="text-xs font-normal text-dark/35">/pax</span>}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-dark/30 uppercase mb-1">Kapasitas</p>
                                    <p className="text-dark font-semibold">{getCapacityText(pkg)}</p>
                                </div>
                            </div>
                            <p className="text-[9px] text-dark/35 font-utility uppercase tracking-wider mt-4 flex items-center gap-1.5">
                                <Check size={10} className="text-rose shrink-0" />
                                {pkg.is_flat 
                                    ? 'Harga paket flat fee, sudah termasuk seluruh layanan paket sesuai kapasitas maksimum — bukan hitungan per pax'
                                    : 'Harga per orang = per tamu, sudah termasuk seluruh layanan paket — bukan hanya katering'
                                }
                            </p>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* ── Service Groups */}
                <div className="space-y-5">
                    <h2 className="font-display text-xl font-bold text-dark flex items-center gap-2">
                        <span className="w-1 h-5 bg-rose rounded-full inline-block" />
                        Layanan Lengkap Paket
                    </h2>
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        {Object.entries(groupedMenu).map(([type, items]) => (
                            <motion.div key={type} variants={fadeUp}>
                                <GlassCard className="p-5 h-full">
                                    <p className="text-[10px] uppercase tracking-widest text-rose/70 font-utility mb-3">{typeLabels[type] || type}</p>
                                    <ul className="space-y-1.5">
                                        {items.map(item => (
                                            <li key={item.id} className="flex items-center gap-2 text-xs text-dark/60">
                                                <Check size={11} className="text-rose/70 shrink-0" />
                                                {item.name}
                                            </li>
                                        ))}
                                    </ul>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* ── CALCULATOR SECTION */}
                <div className="space-y-5 pt-4">
                    <h2 className="font-display text-xl font-bold text-dark flex items-center gap-2">
                        <span className="w-1 h-5 bg-rose rounded-full inline-block" />
                        Rincian Estimasi Biaya
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                        {/* Form side */}
                        <div className="lg:col-span-7 space-y-5">

                            {/* Step 1 — Pax Selector */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <GlassCard className="p-6 md:p-8 space-y-5">
                                    <div className="flex items-center gap-2">
                                        <Users size={16} className="text-rose" />
                                        <h3 className="font-semibold text-dark text-sm">Estimasi Jumlah Tamu</h3>
                                    </div>

                                    <div className="text-[11px] text-dark/65 bg-rose/5 border border-rose/10 p-3 rounded-lg">
                                        <span className="font-bold text-rose">Kapasitas Paket:</span> {getCapacityText(pkg)}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase text-dark/40 font-utility tracking-widest block font-bold">
                                            Jumlah Tamu (Pax) *
                                        </label>
                                        <input
                                            type="number"
                                            min={pkg.is_flat ? 1 : pkg.min_pax}
                                            max={pkg.max_pax || 2000}
                                            value={pax === 0 ? '' : pax}
                                            onChange={e => {
                                                const val = e.target.value;
                                                setPax(val === '' ? 0 : Number(val));
                                            }}
                                            className="glass-input px-3.5 py-2.5 w-full text-sm font-utility"
                                            placeholder={`Masukkan jumlah tamu (Maksimal ${pkg.max_pax || 2000} Pax)...`}
                                        />
                                        <p className="text-[9px] text-dark/40 italic">
                                            Estimasi Undangan: {Math.round(pax / 2)} Undangan
                                        </p>
                                    </div>

                                    {pkg.max_pax && pax > pkg.max_pax && (
                                        <div className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200/50 p-2.5 rounded-lg font-medium leading-relaxed">
                                            Perhatian: Jumlah tamu melebihi kapasitas paket ({pkg.max_pax} Pax).
                                            Kelebihan tamu akan dikenakan biaya tambahan (charge) sesuai Syarat & Ketentuan.
                                        </div>
                                    )}
                                </GlassCard>
                            </motion.div>

                            {/* Step 2 — Addons */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                <GlassCard className="p-6 md:p-8 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Tag size={16} className="text-rose" />
                                        <h3 className="font-semibold text-dark text-sm">Tambahan Layanan <span className="text-dark/30 font-normal">(opsional)</span></h3>
                                    </div>
                                    <div className="space-y-2">
                                        {addons.map(addon => {
                                            const selected = selectedAddons.includes(addon.id);
                                            return (
                                                <motion.label
                                                    key={addon.id}
                                                    className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                                                        selected
                                                            ? 'border-rose/40 bg-rose/5'
                                                            : 'border-rose/10 glass-card hover:border-rose/20'
                                                    }`}
                                                    whileTap={{ scale: 0.99 }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={selected}
                                                            onChange={() => toggleAddon(addon.id)}
                                                            className="glass-checkbox"
                                                        />
                                                        <div>
                                                            <p className="text-sm text-dark font-medium">{addon.name}</p>
                                                            <p className="text-[10px] text-dark/35 font-utility uppercase">
                                                                {addon.pricing_type === 'per_pax' ? 'Per Pax' : 'Flat'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-bold text-rose font-utility">
                                                        Rp {Number(addon.price).toLocaleString('id-ID')}
                                                        {addon.pricing_type === 'per_pax' && <span className="text-xs font-normal text-dark/35">/pax</span>}
                                                    </span>
                                                </motion.label>
                                            );
                                        })}
                                    </div>
                                </GlassCard>
                            </motion.div>

                            {/* Step 3 — Customer Form */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                <GlassCard variant="default" className="p-6 md:p-8 space-y-4">
                                    <h3 className="font-semibold text-dark text-sm">Informasi Pemesan</h3>
                                    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <label className="text-[10px] uppercase text-dark/40 font-utility tracking-widest block font-bold">Nama Lengkap *</label>
                                                <input
                                                    type="text"
                                                    name="customer_name"
                                                    value={form.customer_name}
                                                    onChange={e => {
                                                        setForm(p => ({ ...p, customer_name: e.target.value }));
                                                        if (errors.customer_name) setErrors(p => { const c = { ...p }; delete c.customer_name; return c; });
                                                    }}
                                                    placeholder="Nama Anda..."
                                                    className={`glass-input px-3.5 py-2.5 w-full text-sm placeholder-dark/20 ${errors.customer_name ? 'border-red-500/50' : ''}`}
                                                />
                                                {errors.customer_name && <p className="text-[9px] text-red-500">{errors.customer_name}</p>}
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] uppercase text-dark/40 font-utility tracking-widest block font-bold">No. WhatsApp *</label>
                                                <input
                                                    type="text"
                                                    name="customer_phone"
                                                    value={form.customer_phone}
                                                    onChange={e => {
                                                        setForm(p => ({ ...p, customer_phone: e.target.value }));
                                                        if (errors.customer_phone) setErrors(p => { const c = { ...p }; delete c.customer_phone; return c; });
                                                    }}
                                                    placeholder="0812xxx..."
                                                    className={`glass-input px-3.5 py-2.5 w-full text-sm placeholder-dark/20 ${errors.customer_phone ? 'border-red-500/50' : ''}`}
                                                />
                                                {errors.customer_phone && <p className="text-[9px] text-red-500">{errors.customer_phone}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <label className="text-[10px] uppercase text-dark/40 font-utility tracking-widest block font-bold">Tanggal Acara *</label>
                                                <input
                                                    type="date"
                                                    name="event_date"
                                                    value={form.event_date}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    onChange={e => {
                                                        setForm(p => ({ ...p, event_date: e.target.value }));
                                                        if (errors.event_date) setErrors(p => { const c = { ...p }; delete c.event_date; return c; });
                                                    }}
                                                    className={`glass-input px-3.5 py-2.5 w-full text-sm placeholder-dark/20 ${errors.event_date ? 'border-red-500/50' : ''}`}
                                                />
                                                {errors.event_date && <p className="text-[9px] text-red-500">{errors.event_date}</p>}
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] uppercase text-dark/40 font-utility tracking-widest block font-bold">Email (opsional)</label>
                                                <input
                                                    type="email"
                                                    name="customer_email"
                                                    value={form.customer_email}
                                                    onChange={e => setForm(p => ({ ...p, customer_email: e.target.value }))}
                                                    placeholder="email@contoh.com..."
                                                    className="glass-input px-3.5 py-2.5 w-full text-sm placeholder-dark/20"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase text-dark/40 font-utility tracking-widest block font-bold">Lokasi Acara</label>
                                            <input
                                                type="text"
                                                name="event_location"
                                                value={form.event_location}
                                                onChange={e => setForm(p => ({ ...p, event_location: e.target.value }))}
                                                placeholder="Nama Gedung / Alamat..."
                                                className="glass-input px-3.5 py-2.5 w-full text-sm placeholder-dark/20"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase text-dark/40 font-utility tracking-widest block font-bold">Catatan Tambahan</label>
                                            <textarea
                                                name="notes"
                                                value={form.notes}
                                                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                                                rows={3}
                                                placeholder="Request khusus, menu tambahan, dll..."
                                                className="glass-input px-3.5 py-2.5 w-full text-sm placeholder-dark/20 resize-none"
                                            />
                                        </div>

                                        <GlassButton
                                            variant="primary"
                                            size="lg"
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full mt-4"
                                        >
                                            {submitting ? 'MEMPROSES...' : 'KIRIM PERMINTAAN RESERVASI'}
                                        </GlassButton>
                                    </form>
                                </GlassCard>
                            </motion.div>
                        </div>

                        {/* Receipt panel (sticky) */}
                        <div className="lg:col-span-5 lg:sticky lg:top-28">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <div className="receipt-card rounded-2xl p-6 md:p-8">
                                    <div className="text-center pb-5 border-b border-rose/15">
                                        <span className="font-display text-[9px] uppercase tracking-[0.25em] text-rose font-bold">Nota Estimasi</span>
                                        <h4 className="font-display text-lg font-bold text-dark mt-1 tracking-wide uppercase">Ringkasan Biaya</h4>
                                        <p className="text-[9px] text-dark/35 font-utility tracking-widest mt-1">NO. AMARYLLIS-{new Date().toISOString().slice(2, 10).replace(/-/g, '')}</p>
                                    </div>

                                    <div className="py-5 space-y-4 text-xs font-utility">
                                        {/* Package line */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center text-dark/75">
                                                <span className="font-semibold text-dark/85">Paket: {pkg.name}</span>
                                                <span className="font-bold text-dark">Rp <AnimNum value={price.packageCost} /></span>
                                            </div>
                                            <div className="flex justify-between text-[10px] text-dark/45 font-display italic">
                                                <span>{pkg.is_flat ? 'Tarif Flat Paket Pernikahan' : `${pax} Tamu x Rp ${Number(pkg.price_per_pax).toLocaleString('id-ID')}/pax`}</span>
                                            </div>
                                        </div>

                                        {/* Addons lines */}
                                        {price.addonBreakdown.length > 0 && (
                                            <div className="border-t border-rose/10 pt-3 space-y-2.5">
                                                <p className="font-semibold text-dark/85">Layanan Tambahan:</p>
                                                <div className="space-y-2">
                                                    {price.addonBreakdown.map((item, i) => (
                                                        <div key={i} className="space-y-0.5 pl-2 border-l border-rose/10">
                                                            <div className="flex justify-between items-center text-dark/75">
                                                                <span>· {item.name}</span>
                                                                <span className="font-bold text-dark">Rp <AnimNum value={item.cost} /></span>
                                                            </div>
                                                            <div className="text-[9px] text-dark/45 font-display italic">
                                                                {item.pricing_type === 'per_pax' 
                                                                    ? `${pax} Tamu x Rp ${Number(item.price).toLocaleString('id-ID')}/pax`
                                                                    : 'Tarif Flat'
                                                                }
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Tear line with notches extending to the card edges */}
                                    <div className="relative my-2 -mx-6 md:-mx-8 select-none pointer-events-none">
                                        <div className="absolute left-0 w-5 h-5 bg-warm-white rounded-full border-r border-rose/15 -translate-x-1/2 top-1/2 -translate-y-1/2"></div>
                                        <div className="absolute right-0 w-5 h-5 bg-warm-white rounded-full border-l border-rose/15 translate-x-1/2 top-1/2 -translate-y-1/2"></div>
                                        <div className="receipt-tear-line mx-2"></div>
                                    </div>

                                    <div className="space-y-3 font-utility text-xs pt-2">
                                        <div className="flex justify-between items-center text-dark/65">
                                            <span>Subtotal Layanan</span>
                                            <span className="font-semibold text-dark">Rp <AnimNum value={price.subtotal} /></span>
                                        </div>

                                        {price.discountPct > 0 && (
                                            <div className="flex justify-between items-center text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100/50">
                                                <span className="flex items-center gap-1">
                                                    <Sparkles size={11} className="text-emerald-600 animate-pulse" />
                                                    <span>Diskon Hemat ({price.discountPct}%)</span>
                                                </span>
                                                <span className="font-bold">- Rp <AnimNum value={price.discountAmt} /></span>
                                            </div>
                                        )}

                                        <div className="pt-4 border-t border-rose/15 flex justify-between items-end relative">
                                            <div>
                                                <p className="text-[9px] text-dark/35 uppercase font-bold tracking-widest font-utility">Total Estimasi</p>
                                                <p className="text-xl font-bold font-utility text-rose mt-1 tracking-tight leading-none">
                                                    Rp <AnimNum value={price.total} />
                                                </p>
                                            </div>
                                            
                                            {/* Violet Rubber Stamp */}
                                            <motion.div
                                                key={price.total} // key triggers re-render and spring animation on change!
                                                initial={{ opacity: 0, scale: 2.2, rotate: -28 }}
                                                animate={{ opacity: 0.65, scale: 1, rotate: -12 }}
                                                transition={{ type: 'spring', damping: 13, stiffness: 100 }}
                                                className="absolute bottom-0 right-1 pointer-events-none select-none rubber-stamp text-[10px]"
                                            >
                                                ESTIMASI
                                            </motion.div>
                                        </div>
                                    </div>

                                    <p className="text-[9px] text-dark/35 mt-6 text-center leading-relaxed font-utility">
                                        * Rincian final akan dikonfirmasi admin via WhatsApp.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Success Modal */}
            <AnimatePresence>
                {submitted && (
                    <motion.div
                        key="success-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm"
                        style={{ background: 'rgba(0,0,0,0.5)' }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="max-w-md w-full"
                        >
                            <GlassCard variant="gold" className="p-8 md:p-10 text-center" glow>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                                    className="w-16 h-16 rounded-full bg-rose/20 border border-rose/40 flex items-center justify-center mx-auto mb-6"
                                >
                                    <Heart size={28} className="text-rose" />
                                </motion.div>

                                <h2 className="font-display text-2xl font-bold text-dark mb-2">Permintaan Terkirim!</h2>
                                <p className="text-dark/50 text-sm mb-6">
                                    Lead ID <span className="text-rose font-utility font-bold">#{submitted.id}</span> telah tercatat. Tim kami akan segera menghubungi Anda.
                                </p>

                                <div className="glass-card rounded-xl p-4 border border-rose/10 text-left space-y-1.5 text-xs font-utility text-dark/50 mb-7">
                                    <div><span className="text-dark/30">Nama:</span> {submitted.customer_name}</div>
                                    <div><span className="text-dark/30">Paket:</span> {submitted.package_name_snapshot} · {submitted.pax} Tamu</div>
                                    <div><span className="text-dark/30">Tanggal:</span> {submitted.event_date}</div>
                                </div>

                                <div className="space-y-3">
                                    {waUrl && (
                                        <a href={waUrl} target="_blank" rel="noreferrer">
                                            <GlassButton variant="primary" size="lg" className="w-full">
                                                <Phone size={16} />
                                                Chat WhatsApp Admin
                                            </GlassButton>
                                        </a>
                                    )}
                                    <GlassButton
                                        variant="glass"
                                        size="md"
                                        className="w-full"
                                        onClick={() => {
                                            setSubmitted(null);
                                            setSelectedAddons([]);
                                            setForm({ customer_name: '', customer_phone: '', customer_email: '', event_date: '', event_location: '', notes: '' });
                                        }}
                                    >
                                        Tutup & Atur Ulang
                                    </GlassButton>
                                </div>
                            </GlassCard>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};