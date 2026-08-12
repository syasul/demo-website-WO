import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, Heart, Phone, Mail, MapPin, Sparkles } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';

export const ContactUs: React.FC = () => {
    const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [settings, setSettings] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    setSettings(await res.json());
                }
            } catch (err) {
                console.error("Failed to fetch settings in ContactUs:", err);
            }
        };
        fetchSettings();
    }, []);

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = 'Nama wajib diisi';
        if (!form.phone.trim() && !form.email.trim()) e.phone = 'Isi minimal satu — No. WhatsApp atau email';
        if (!form.message.trim()) e.message = 'Pesan wajib diisi';
        setErrors(e);
        return !Object.keys(e).length;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({ name: form.name, phone: form.phone, email: form.email, message: form.message }),
            });
            if (res.ok) {
                setSuccess(true);
                setForm({ name: '', phone: '', email: '', message: '' });
            } else {
                const d = await res.json();
                alert(d.message || 'Terjadi kesalahan.');
            }
        } catch {
            alert('Gagal menghubungi server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative overflow-x-hidden pb-24 floral-bg">
            <div className="max-w-6xl mx-auto px-6 md:px-12 pt-24 md:pt-28 pb-12 relative z-10">
                
                <div className="text-center mb-16">
                    <span className="text-xs uppercase tracking-[0.2em] text-rose font-semibold font-utility">Hubungi Kami</span>
                    <h1 className="font-display text-3xl md:text-5xl font-bold text-dark mt-2 mb-3">
                        Hubungi <span className="text-gradient-gold">Kami</span>
                    </h1>
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <span className="wedding-divider w-16" />
                        <Sparkles size={13} className="text-gold/80" />
                        <span className="wedding-divider w-16" />
                    </div>
                    <p className="text-dark/50 text-xs uppercase tracking-widest font-utility">Konsultasi Gratis — Respon Cepat</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch mb-20">
                    
                    {/* Form Card (Left) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-7 flex flex-col"
                    >
                        <div className="bg-white border border-rose/15 rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden flex-grow flex flex-col justify-between">
                            <div className="absolute -right-16 -top-16 w-32 h-32 bg-rose/5 rounded-full blur-xl pointer-events-none" />

                            {success ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-12 space-y-6"
                                >
                                    <CheckCircle2 size={48} className="text-rose mx-auto" />
                                    <h3 className="font-display text-2xl font-bold text-dark">Pesan Terkirim!</h3>
                                    <p className="text-dark/50 text-xs leading-relaxed max-w-sm mx-auto">
                                        Terima kasih telah menghubungi kami. Tim wedding planner kami akan membalas pesan Anda secepatnya.
                                    </p>
                                    <button 
                                        onClick={() => setSuccess(false)}
                                        className="bg-rose text-white font-bold py-2.5 px-6 rounded-xl text-xs tracking-wider uppercase hover:bg-rose/90 transition-colors cursor-pointer"
                                    >
                                        Kirim Pesan Lain
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase text-rose font-utility tracking-widest block font-bold">Nama *</label>
                                            <input
                                                type="text"
                                                value={form.name}
                                                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                                placeholder="Nama lengkap Anda..."
                                                className={`w-full bg-warm-white border rounded-xl px-3.5 py-2.5 text-sm text-dark placeholder-gray-400 focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose focus:bg-white transition-all duration-200 ${errors.name ? 'border-red-500/50' : 'border-rose/20'}`}
                                            />
                                            {errors.name && <p className="text-[9px] text-red-500 font-semibold">{errors.name}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase text-rose font-utility tracking-widest block font-bold">No. WhatsApp *</label>
                                            <input
                                                type="text"
                                                value={form.phone}
                                                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                                                placeholder="0812xxx..."
                                                className={`w-full bg-warm-white border rounded-xl px-3.5 py-2.5 text-sm text-dark placeholder-gray-400 focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose focus:bg-white transition-all duration-200 ${errors.phone ? 'border-red-500/50' : 'border-rose/20'}`}
                                            />
                                            {errors.phone && <p className="text-[9px] text-red-500 font-semibold">{errors.phone}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase text-rose font-utility tracking-widest block font-bold">Email</label>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                            placeholder="email@contoh.com..."
                                            className="w-full bg-warm-white border border-rose/20 rounded-xl px-3.5 py-2.5 text-sm text-dark placeholder-gray-400 focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose focus:bg-white transition-all duration-200"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase text-rose font-utility tracking-widest block font-bold">Detail Pesan *</label>
                                        <textarea
                                            value={form.message}
                                            onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                                            rows={4}
                                            placeholder="Ceritakan kebutuhan pernikahan Anda..."
                                            className={`w-full bg-warm-white border rounded-xl px-3.5 py-2.5 text-sm text-dark placeholder-gray-400 focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose focus:bg-white transition-all duration-200 resize-none ${errors.message ? 'border-red-500/50' : 'border-rose/20'}`}
                                        />
                                        {errors.message && <p className="text-[9px] text-red-500 font-semibold">{errors.message}</p>}
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        type="submit"
                                        disabled={loading}
                                        className="btn-shimmer w-full bg-rose text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:bg-rose/90 cursor-pointer font-utility text-[10px] tracking-widest uppercase mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send size={14} />
                                        {loading ? 'MENGIRIM...' : 'KIRIM PESAN'}
                                    </motion.button>
                                </form>
                            )}
                        </div>
                    </motion.div>

                    {/* Contact Info (Right) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="lg:col-span-5 relative self-stretch min-h-[300px] lg:min-h-[500px] mt-10 lg:mt-0"
                    >
                        <div className="h-full flex flex-col gap-6">
                            <GlassCard className="p-8 flex flex-col justify-center h-full" hover>
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="font-display text-xl font-bold text-dark mb-6">Hubungi Kami</h3>
                                        <div className="space-y-5">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-full bg-rose/10 flex items-center justify-center shrink-0">
                                                    <Phone size={18} className="text-rose" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-dark">WhatsApp</p>
                                                    <p className="text-sm text-dark/60">
                                                        {settings.contact_whatsapp
                                                            ? `+${settings.contact_whatsapp.replace(/(\d{2})(\d{3})(\d{4})(\d+)/, '$1 $2-$3-$4')}`
                                                            : '+62 856-4745-7018'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-full bg-rose/10 flex items-center justify-center shrink-0">
                                                    <Mail size={18} className="text-rose" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-dark">Email</p>
                                                    <p className="text-sm text-dark/60">{settings.contact_email || 'info@luxurywo.com'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-full bg-rose/10 flex items-center justify-center shrink-0">
                                                    <MapPin size={18} className="text-rose" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-dark">Alamat</p>
                                                    <p className="text-sm text-dark/60">{settings.contact_address || 'Ruko Dinoyo Kav. 4, Malang, Jawa Timur'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-t border-rose/10 pt-6">
                                        <p className="text-xs text-dark/50 leading-relaxed">
                                            Konsultasi gratis dengan tim wedding planner profesional kami. 
                                            Senang membantu mewujudkan pernikahan impian Anda!
                                        </p>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};