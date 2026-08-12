import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Phone, Heart, Users, Calendar, MapPin, Sparkles, Home, Mail, ShieldAlert } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
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

export const Booking: React.FC = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [addons, setAddons] = useState<Addon[]>([]);
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    const [selectedPackageId, setSelectedPackageId] = useState<number | ''>('');
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
    const [pax, setPax] = useState(250);
    const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
    const [form, setForm] = useState({
        customer_name: '',
        customer_phone: '',
        customer_address: '',
        customer_email: '',
        event_date: '',
        event_location: '',
        notes: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState<any>(null);
    const [waUrl, setWaUrl] = useState('');
    const [redirectNotice, setRedirectNotice] = useState('');

    const [price, setPrice] = useState({
        packageCost: 0,
        addonsCost: 0,
        addonBreakdown: [] as any[],
        subtotal: 0,
        total: 0
    });

    useEffect(() => {
        (async () => {
            try {
                const [pkgRes, addonRes, settingsRes] = await Promise.all([
                    fetch('/api/packages'),
                    fetch('/api/addons'),
                    fetch('/api/settings'),
                ]);
                if (pkgRes.ok) {
                    const pkgsData: Package[] = await pkgRes.json();
                    setPackages(pkgsData);
                    if (pkgsData.length > 0) {
                        setSelectedPackageId(pkgsData[0].id);
                    }
                }
                if (addonRes.ok) setAddons(await addonRes.json());
                if (settingsRes.ok) setSettings(await settingsRes.json());
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        const pkg = packages.find(p => p.id === selectedPackageId) || null;
        setSelectedPackage(pkg);
        if (pkg) {
            setPax(Math.max(pkg.min_pax, Math.min(pax, pkg.max_pax || 2000)));
        }
    }, [selectedPackageId, packages]);

    useEffect(() => {
        if (!selectedPackage) {
            setPrice({ packageCost: 0, addonsCost: 0, addonBreakdown: [], subtotal: 0, total: 0 });
            return;
        }
        
        const packageCost = selectedPackage.is_flat 
            ? Number(selectedPackage.price_per_pax) 
            : Number(selectedPackage.price_per_pax) * pax;
            
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
        setPrice({
            packageCost,
            addonsCost,
            addonBreakdown,
            subtotal,
            total: subtotal
        });
    }, [selectedPackage, pax, selectedAddons, addons]);

    const toggleAddon = useCallback((id: number) => {
        setSelectedAddons(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    }, []);

    const handlePaxChange = (newPax: number) => {
        setPax(newPax);
        
        if (!selectedPackageId) return;
        
        const currentPkg = packages.find(p => p.id === selectedPackageId);
        if (!currentPkg) return;
        
        if (currentPkg.max_pax && newPax > currentPkg.max_pax) {
            const sortedPkgs = [...packages].sort((a, b) => (a.max_pax || 0) - (b.max_pax || 0));
            const nextPkg = sortedPkgs.find(p => p.max_pax && newPax <= p.max_pax);
            
            if (nextPkg && nextPkg.id !== selectedPackageId) {
                setSelectedPackageId(nextPkg.id);
                setRedirectNotice(`Paket otomatis dialihkan ke ${nextPkg.name} karena jumlah tamu (${newPax} Pax) melebihi kapasitas ${currentPkg.name} (Maks ${currentPkg.max_pax} Pax).`);
                setTimeout(() => setRedirectNotice(''), 6000);
            }
        }
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (!selectedPackageId) e.selectedPackageId = 'Silakan pilih paket pernikahan';
        if (!form.customer_name.trim()) e.customer_name = 'Nama lengkap wajib diisi';
        if (!form.customer_phone.trim()) e.customer_phone = 'Nomor WhatsApp wajib diisi';
        if (!form.customer_address.trim()) e.customer_address = 'Alamat lengkap wajib diisi';
        if (!form.event_location.trim()) e.event_location = 'Tempat / Lokasi acara wajib diisi';
        if (!form.event_date) e.event_date = 'Tanggal acara wajib diisi';
        setErrors(e);
        return !Object.keys(e).length;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate() || !selectedPackageId) return;
        setSubmitting(true);
        try {
            const res = await fetch('/api/quotations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    package_id: selectedPackageId,
                    pax,
                    addon_ids: selectedAddons,
                    ...form
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setSubmitted(data.quotation);
                setWaUrl(data.whatsapp_url ?? '');
                if (data.whatsapp_url) {
                    window.location.href = data.whatsapp_url;
                }
            } else {
                alert(data.message || 'Terjadi kesalahan.');
            }
        } catch {
            alert('Gagal menghubungi server.');
        } finally {
            setSubmitting(false);
        }
    };

    // Filter out specific booking options
    const decorAddon = addons.find(a => a.name.toLowerCase().includes('dekorasi'));
    const tentAddon = addons.find(a => a.name.toLowerCase().includes('tenda'));
    const otherAddons = addons.filter(a => a.id !== decorAddon?.id && a.id !== tentAddon?.id);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-6">
                <div className="skeleton h-24 rounded-2xl w-full" />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 skeleton h-96 rounded-2xl" />
                    <div className="lg:col-span-5 skeleton h-96 rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="relative pb-24 floral-bg">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 space-y-10 relative z-10">
                
                {/* Header */}
                <div className="text-center max-w-xl mx-auto mb-6 mt-4">
                    <span className="text-xs uppercase tracking-[0.2em] text-rose font-semibold font-utility">Reservasi Online</span>
                    <h1 className="font-display text-3xl md:text-5xl font-bold text-dark mt-2 mb-3">
                        Formulir <span className="text-gradient-gold">Pemesanan</span>
                    </h1>
                    <div className="h-0.5 w-16 bg-gold mx-auto mt-2"></div>
                    <p className="text-dark/50 text-xs mt-3">
                        Lengkapi formulir di bawah ini untuk mereservasi layanan wedding organizer mewah Anda.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Form side */}
                    <div className="lg:col-span-7 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <GlassCard className="p-6 md:p-8 space-y-6">
                                <h3 className="font-display text-lg font-bold text-dark border-b border-rose/10 pb-3 uppercase tracking-wider">
                                    Informasi Reservasi Pernikahan
                                </h3>

                                <AnimatePresence>
                                    {redirectNotice && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="bg-gold/10 border border-gold text-dark text-xs p-3.5 rounded-xl flex items-center gap-2 mb-4 overflow-hidden"
                                        >
                                            <Sparkles size={16} className="text-gold animate-bounce shrink-0" />
                                            <span className="font-semibold text-rose-dark">{redirectNotice}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Package Dropdown */}
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase text-dark/50 font-utility tracking-widest block font-bold">Pilih Paket WO *</label>
                                        <select
                                            value={selectedPackageId}
                                            onChange={e => setSelectedPackageId(Number(e.target.value))}
                                            className={`glass-input px-3.5 py-2.5 w-full text-xs bg-white focus:outline-none ${errors.selectedPackageId ? 'border-red-500/50' : ''}`}
                                        >
                                            <option value="">-- Pilih Paket Pernikahan --</option>
                                            {packages.map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} — Rp {Number(p.price_per_pax).toLocaleString('id-ID')} {p.is_flat ? '(Harga Flat Paket)' : '/pax'}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.selectedPackageId && <p className="text-[9px] text-red-500">{errors.selectedPackageId}</p>}
                                    </div>

                                    {/* Client Identity details */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase text-dark/50 font-utility tracking-widest block font-bold">Nama Lengkap Pemesan *</label>
                                            <input
                                                type="text"
                                                value={form.customer_name}
                                                onChange={e => setForm(p => ({ ...p, customer_name: e.target.value }))}
                                                placeholder="Nama lengkap Anda..."
                                                className={`glass-input px-3.5 py-2.5 w-full text-xs ${errors.customer_name ? 'border-red-500/50' : ''}`}
                                            />
                                            {errors.customer_name && <p className="text-[9px] text-red-500">{errors.customer_name}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase text-dark/50 font-utility tracking-widest block font-bold">Nomor WhatsApp *</label>
                                            <input
                                                type="text"
                                                value={form.customer_phone}
                                                onChange={e => setForm(p => ({ ...p, customer_phone: e.target.value }))}
                                                placeholder="Contoh: 085647457018"
                                                className={`glass-input px-3.5 py-2.5 w-full text-xs ${errors.customer_phone ? 'border-red-500/50' : ''}`}
                                            />
                                            {errors.customer_phone && <p className="text-[9px] text-red-500">{errors.customer_phone}</p>}
                                        </div>
                                    </div>

                                    {/* Email and Address */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase text-dark/50 font-utility tracking-widest block font-bold">Email (opsional)</label>
                                            <input
                                                type="email"
                                                value={form.customer_email}
                                                onChange={e => setForm(p => ({ ...p, customer_email: e.target.value }))}
                                                placeholder="email@contoh.com..."
                                                className="glass-input px-3.5 py-2.5 w-full text-xs"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase text-dark/50 font-utility tracking-widest block font-bold">Tanggal Acara *</label>
                                            <input
                                                type="date"
                                                value={form.event_date}
                                                min={new Date().toISOString().split('T')[0]}
                                                onChange={e => setForm(p => ({ ...p, event_date: e.target.value }))}
                                                className={`glass-input px-3.5 py-2.5 w-full text-xs ${errors.event_date ? 'border-red-500/50' : ''}`}
                                            />
                                            {errors.event_date && <p className="text-[9px] text-red-500">{errors.event_date}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase text-dark/50 font-utility tracking-widest block font-bold">Alamat Lengkap Pemesan *</label>
                                        <input
                                            type="text"
                                            value={form.customer_address}
                                            onChange={e => setForm(p => ({ ...p, customer_address: e.target.value }))}
                                            placeholder="Tulis alamat rumah lengkap Anda..."
                                            className={`glass-input px-3.5 py-2.5 w-full text-xs ${errors.customer_address ? 'border-red-500/50' : ''}`}
                                        />
                                        {errors.customer_address && <p className="text-[9px] text-red-500">{errors.customer_address}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase text-dark/50 font-utility tracking-widest block font-bold">Tempat / Lokasi Acara Pernikahan *</label>
                                        <input
                                            type="text"
                                            value={form.event_location}
                                            onChange={e => setForm(p => ({ ...p, event_location: e.target.value }))}
                                            placeholder="Nama Gedung / Hotel / Rumah (Tempat Resepsi)..."
                                            className={`glass-input px-3.5 py-2.5 w-full text-xs ${errors.event_location ? 'border-red-500/50' : ''}`}
                                        />
                                        {errors.event_location && <p className="text-[9px] text-red-500">{errors.event_location}</p>}
                                    </div>

                                    {/* Decoration and Tent options directly in form */}
                                    <div className="space-y-3 pt-2">
                                        <span className="text-[10px] uppercase text-dark/50 font-utility tracking-widest block font-bold">
                                            Opsi Sewa Dekorasi & Tenda (Wajib Diisi Bila Diperlukan)
                                        </span>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {decorAddon && (
                                                <motion.label
                                                    className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${
                                                        selectedAddons.includes(decorAddon.id)
                                                            ? 'border-rose bg-rose/5'
                                                            : 'border-rose/10 glass-card hover:border-rose/30'
                                                    }`}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedAddons.includes(decorAddon.id)}
                                                            onChange={() => toggleAddon(decorAddon.id)}
                                                            className="glass-checkbox"
                                                        />
                                                        <div>
                                                            <p className="text-xs text-dark font-semibold">Sewa Dekorasi</p>
                                                            <p className="text-[8px] text-dark/30 font-utility uppercase">Wardiere Wedding Decoration</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs font-bold text-rose font-utility">
                                                        +Rp {Number(decorAddon.price).toLocaleString('id-ID')}
                                                    </span>
                                                </motion.label>
                                            )}
                                            {tentAddon && (
                                                <motion.label
                                                    className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${
                                                        selectedAddons.includes(tentAddon.id)
                                                            ? 'border-rose bg-rose/5'
                                                            : 'border-rose/10 glass-card hover:border-rose/30'
                                                    }`}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedAddons.includes(tentAddon.id)}
                                                            onChange={() => toggleAddon(tentAddon.id)}
                                                            className="glass-checkbox"
                                                        />
                                                        <div>
                                                            <p className="text-xs text-dark font-semibold">Sewa Tenda & Panggung</p>
                                                            <p className="text-[8px] text-dark/30 font-utility uppercase">Tarif Flat</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs font-bold text-rose font-utility">
                                                        +Rp {Number(tentAddon.price).toLocaleString('id-ID')}
                                                    </span>
                                                </motion.label>
                                            )}
                                        </div>
                                    </div>

                                    {/* Other addons (optional) */}
                                    {otherAddons.length > 0 && (
                                        <div className="space-y-3 pt-2">
                                            <span className="text-[10px] uppercase text-dark/50 font-utility tracking-widest block font-bold">Layanan Tambahan Lainnya (Opsional)</span>
                                            <div className="grid grid-cols-1 gap-2">
                                                {otherAddons.map(a => (
                                                    <label key={a.id} className="flex items-center justify-between p-3 border border-rose/10 rounded-lg cursor-pointer hover:bg-rose/5 text-xs">
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedAddons.includes(a.id)}
                                                                onChange={() => toggleAddon(a.id)}
                                                                className="glass-checkbox"
                                                            />
                                                            <span className="text-dark/70 font-semibold">{a.name}</span>
                                                        </div>
                                                        <span className="font-utility font-bold text-rose">
                                                            Rp {Number(a.price).toLocaleString('id-ID')}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Pax Selector */}
                                    {selectedPackage && (
                                        <div className="space-y-3 pt-2 border-t border-rose/10">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-dark/50 uppercase font-utility">Estimasi Jumlah Tamu</span>
                                                <span className="font-bold text-rose bg-rose/10 px-2 py-0.5 font-utility">{pax} Tamu</span>
                                            </div>

                                            <div className="text-[10px] text-dark/65 bg-rose/5 border border-rose/10 p-3 rounded-lg">
                                                <span className="font-bold text-rose">Kapasitas Paket:</span> {getCapacityText(selectedPackage)}
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] uppercase text-dark/50 font-utility tracking-widest block font-bold">
                                                    Jumlah Tamu (Pax) *
                                                </label>
                                                <input
                                                    type="number"
                                                    min={selectedPackage.is_flat ? 1 : selectedPackage.min_pax}
                                                    max={selectedPackage.max_pax || 2000}
                                                    value={pax === 0 ? '' : pax}
                                                    onChange={e => {
                                                        const val = e.target.value;
                                                        const newPax = val === '' ? 0 : Number(val);
                                                        handlePaxChange(newPax);
                                                    }}
                                                    className="glass-input px-3.5 py-2.5 w-full text-xs font-utility"
                                                    placeholder={`Masukkan jumlah tamu (Maksimal ${selectedPackage.max_pax || 2000} Pax)...`}
                                                />
                                                <p className="text-[9px] text-dark/40 italic">
                                                    Estimasi Undangan: {Math.round(pax / 2)} Undangan
                                                </p>
                                            </div>

                                            {selectedPackage.max_pax && pax > selectedPackage.max_pax && (
                                                <div className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200/50 p-2.5 rounded-lg font-medium leading-relaxed">
                                                    Perhatian: Jumlah tamu melebihi kapasitas paket ({selectedPackage.max_pax} Pax).
                                                    Kelebihan tamu akan dikenakan biaya tambahan (charge) sesuai Syarat & Ketentuan.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase text-dark/50 font-utility tracking-widest block font-bold">Catatan Khusus (Bila Ada)</label>
                                        <textarea
                                            value={form.notes}
                                            onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                                            rows={3}
                                            placeholder="Request adat tertentu, perincian rundown khusus, dll..."
                                            className="glass-input px-3.5 py-2.5 w-full text-xs resize-none"
                                        />
                                    </div>

                                    {/* Terms & Conditions (SK) directly under form as requested */}
                                    <div className="bg-rose/5 border border-rose/20 p-4 space-y-2 mt-4">
                                        <h4 className="text-[10px] uppercase font-bold text-rose tracking-wider flex items-center gap-1.5 leading-none">
                                            <ShieldAlert size={14} className="text-gold animate-pulse" />
                                            Syarat & Ketentuan Biaya Tambahan (SK Charge)
                                        </h4>
                                        <div className="text-[11px] text-dark/65 space-y-1.5 leading-relaxed font-sans">
                                            <p className="flex items-start gap-1">
                                                <span className="text-gold font-bold shrink-0">•</span>
                                                <span>{settings.sk_charge_quota || 'Kelebihan kuota tamu undangan akan dikenakan biaya tambahan (charge) sesuai ketentuan.'}</span>
                                            </p>
                                            <p className="flex items-start gap-1">
                                                <span className="text-gold font-bold shrink-0">•</span>
                                                <span>{settings.sk_charge_overtime || 'Kelebihan durasi pemakaian waktu acara (overtime) akan dikenakan biaya tambahan (charge) sesuai ketentuan.'}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <GlassButton
                                        variant="primary"
                                        size="lg"
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full mt-4"
                                    >
                                        {submitting ? 'MEMPROSES RESERVASI...' : 'KIRIM PERMINTAAN BOOKING'}
                                    </GlassButton>
                                </form>
                            </GlassCard>
                        </motion.div>
                    </div>

                    {/* Receipt Ticket side */}
                    <div className="lg:col-span-5 lg:sticky lg:top-28">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <div className="receipt-card rounded-2xl p-6 md:p-8">
                                <div className="text-center pb-5 border-b border-rose/15">
                                    <span className="font-display text-[9px] uppercase tracking-[0.25em] text-rose font-bold">LUXURY WEDDING ORGANIZER</span>
                                    <h4 className="font-display text-lg font-bold text-dark mt-1 tracking-wide uppercase">Ringkasan Invoice</h4>
                                    <p className="text-[9px] text-dark/35 font-utility tracking-widest mt-1">NO. BOOKING-{new Date().toISOString().slice(2, 10).replace(/-/g, '')}</p>
                                </div>

                                <div className="py-5 space-y-4 text-xs font-utility">
                                    {/* Package cost */}
                                    {selectedPackage ? (
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center text-dark/75">
                                                <span className="font-semibold text-dark/85">WO: {selectedPackage.name}</span>
                                                <span className="font-bold text-dark">Rp <AnimNum value={price.packageCost} /></span>
                                            </div>
                                            <div className="flex justify-between text-[9px] text-dark/45 italic">
                                                <span>{selectedPackage.is_flat ? 'Flat Fee Wedding Organizer Crew' : `${pax} Pax x Rp ${Number(selectedPackage.price_per_pax).toLocaleString('id-ID')}/pax`}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-center text-dark/35 italic py-4">Silakan pilih paket untuk melihat estimasi biaya.</p>
                                    )}

                                    {/* Addons */}
                                    {price.addonBreakdown.length > 0 && (
                                        <div className="border-t border-rose/10 pt-3 space-y-2.5">
                                            <p className="font-semibold text-dark/85">Opsi Sewa & Layanan Tambahan:</p>
                                            <div className="space-y-2">
                                                {price.addonBreakdown.map((item, i) => (
                                                    <div key={i} className="space-y-0.5 pl-2 border-l border-rose/10">
                                                        <div className="flex justify-between items-center text-dark/75">
                                                            <span>• {item.name}</span>
                                                            <span className="font-bold text-dark">Rp <AnimNum value={item.cost} /></span>
                                                        </div>
                                                        <div className="text-[8px] text-dark/45 font-display italic">
                                                            {item.pricing_type === 'per_pax' ? `${pax} Pax x Rp ${item.price.toLocaleString('id-ID')}` : 'Tarif Flat'}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="relative my-2 -mx-6 md:-mx-8 select-none pointer-events-none">
                                    <div className="absolute left-0 w-5 h-5 bg-warm-white rounded-full border-r border-rose/15 -translate-x-1/2 top-1/2 -translate-y-1/2"></div>
                                    <div className="absolute right-0 w-5 h-5 bg-warm-white rounded-full border-l border-rose/15 translate-x-1/2 top-1/2 -translate-y-1/2"></div>
                                    <div className="receipt-tear-line mx-2"></div>
                                </div>

                                <div className="space-y-3 font-utility text-xs pt-2">
                                    <div className="flex justify-between items-center text-dark/65">
                                        <span>Subtotal Biaya</span>
                                        <span className="font-semibold text-dark">Rp <AnimNum value={price.subtotal} /></span>
                                    </div>

                                    <div className="pt-4 border-t border-rose/15 flex justify-between items-end relative">
                                        <div>
                                            <p className="text-[9px] text-dark/35 uppercase font-bold tracking-widest font-utility">Total Estimasi</p>
                                            <p className="text-xl font-bold font-utility text-rose mt-1 tracking-tight leading-none">
                                                Rp <AnimNum value={price.total} />
                                            </p>
                                        </div>

                                        <motion.div
                                            key={price.total}
                                            initial={{ opacity: 0, scale: 2.2, rotate: -28 }}
                                            animate={{ opacity: 0.65, scale: 1, rotate: -12 }}
                                            transition={{ type: 'spring', damping: 13, stiffness: 100 }}
                                            className="absolute bottom-0 right-1 pointer-events-none select-none rubber-stamp text-[10px]"
                                        >
                                            RESERVASI
                                        </motion.div>
                                    </div>
                                </div>

                                <p className="text-[9px] text-dark/35 mt-6 text-center leading-relaxed font-utility">
                                    * Rincian akhir dan ketersediaan tanggal akan segera divalidasi oleh tim wedding planner LUXURY via WhatsApp chat.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Success Modal */}
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

                                <h2 className="font-display text-2xl font-bold text-dark mb-2">Booking Berhasil Dikirim!</h2>
                                <p className="text-dark/50 text-sm mb-6">
                                    Pemesanan Anda berhasil tercatat dengan lead ID <span className="text-rose font-utility font-bold">#{submitted.id}</span>.
                                </p>

                                <div className="glass-card rounded-xl p-4 border border-rose/10 text-left space-y-1.5 text-xs font-utility text-dark/50 mb-7">
                                    <div><span className="text-dark/30">Nama:</span> {submitted.customer_name}</div>
                                    <div><span className="text-dark/30">Paket:</span> {submitted.package_name_snapshot}</div>
                                    <div><span className="text-dark/30">Tanggal:</span> {submitted.event_date}</div>
                                    <div><span className="text-dark/30">Alamat:</span> {submitted.customer_address}</div>
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
                                            setForm({
                                                customer_name: '',
                                                customer_phone: '',
                                                customer_address: '',
                                                customer_email: '',
                                                event_date: '',
                                                event_location: '',
                                                notes: ''
                                            });
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
