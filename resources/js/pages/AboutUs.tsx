import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Award, Users, Clock, Sparkles } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';

export const AboutUs: React.FC = () => {
    return (
        <div className="relative overflow-x-hidden pb-24 floral-bg">
            <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 relative z-10">
                
                {/* Header Section */}
                <div className="text-center mb-16 mt-12">
                    <span className="text-xs uppercase tracking-[0.2em] text-rose font-semibold font-utility">Cerita Kami</span>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-dark mt-2">
                        Tentang <span className="text-gradient-gold">Amaryllis</span>{' '}
                        <span className="text-rose">Wedding</span>
                    </h1>
                    <div className="flex items-center justify-center gap-3 mt-5">
                        <span className="wedding-divider w-16" />
                        <Sparkles size={13} className="text-gold/80" />
                        <span className="wedding-divider w-16" />
                    </div>
                    <p className="text-dark/40 text-[10px] mt-3 uppercase tracking-widest font-utility">Amaryllis Wedding & Organizer</p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[230px]">
                    
                    {/* Cell 1: Our Story (spans 2x2) */}
                    <GlassCard variant="default" className="md:col-span-2 md:row-span-2 p-8 flex flex-col justify-between" hover>
                        <div className="space-y-6">
                            <span className="text-xs uppercase tracking-wider text-rose font-semibold font-utility block">Visi & Misi Kami</span>
                            <h2 className="font-display text-xl md:text-2xl font-bold text-dark leading-relaxed">
                                Mewujudkan Pernikahan Impian Setiap Pasangan
                            </h2>
                            <p className="text-dark/60 text-xs leading-relaxed">
                                Berawal dari kecintaan terhadap seni merangkai momen indah, <strong className="text-rose">Amaryllis Wedding & Organizer</strong> hadir untuk memberikan pengalaman wedding planning yang menyenangkan dan bebas stres bagi setiap pasangan.
                            </p>
                            <p className="text-dark/50 text-xs leading-relaxed">
                                Kami percaya setiap pasangan berhak mendapatkan hari pernikahan yang sempurna tanpa harus repot mengurus detail teknis. Dengan tim profesional yang berpengalaman, kami mengelola semua aspek pernikahan — dari dekorasi, rias, dokumentasi, katering, hingga venue — dalam satu paket terintegrasi.
                            </p>
                        </div>
                        <div className="border-t border-rose/10 pt-4 text-[10px] text-dark/35 font-utility uppercase tracking-widest">
                            EST. 2020 · BOGOR & JABODETABEK
                        </div>
                    </GlassCard>

                    {/* Cell 2: Photo Frame (spans 1x2) */}
                    <GlassCard variant="default" className="md:col-span-1 md:row-span-2 p-6 flex flex-col justify-between relative overflow-hidden" hover>
                        <div className="relative h-[320px] rounded-xl overflow-hidden">
                            <img 
                                src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800"
                                alt="Wedding Decoration"
                                className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-rose/40 to-transparent" />
                            <div className="absolute bottom-3 left-3">
                                <p className="text-[10px] font-utility uppercase tracking-wider text-white font-bold">Tim Profesional</p>
                                <p className="font-display text-sm font-semibold text-white/90">Amaryllis Wedding Team</p>
                            </div>
                        </div>
                        <div className="pt-2 text-center">
                            <span className="text-[10px] text-rose/80 font-utility uppercase tracking-widest font-bold">100% KOMITMEN KUALITAS</span>
                        </div>
                    </GlassCard>

                    {/* Cell 3: Stats */}
                    <GlassCard variant="default" className="p-6 flex flex-col justify-between" hover>
                        <span className="text-[10px] uppercase tracking-wider text-dark/40 font-utility">Akumulasi Prestasi</span>
                        <div className="space-y-4">
                            <div className="flex justify-between items-baseline font-utility border-b border-rose/10 pb-2 text-xs">
                                <span className="text-dark/50">Pasangan Bahagia</span>
                                <span className="font-bold text-dark text-base">200+</span>
                            </div>
                            <div className="flex justify-between items-baseline font-utility pt-1 text-xs">
                                <span className="text-dark/50">Tamu Terlayani</span>
                                <span className="font-bold text-dark text-base">50K+ Tamu</span>
                            </div>
                        </div>
                        <span className="text-[9px] text-dark/35 font-utility uppercase">RECORDED DATA</span>
                    </GlassCard>

                    {/* Cell 4: Our Values */}
                    <GlassCard variant="default" className="p-6 flex flex-col justify-between" hover>
                        <span className="text-[10px] uppercase tracking-wider text-dark/40 font-utility">Nilai Kami</span>
                        <div>
                            <h4 className="font-semibold text-rose text-xs uppercase mb-1.5">Teliti & Profesional</h4>
                            <p className="text-dark/50 text-[11px] leading-relaxed line-clamp-3">
                                Setiap detail diperhatikan dengan seksama untuk memastikan hari pernikahan Anda berjalan sempurna.
                            </p>
                        </div>
                        <span className="text-[9px] text-dark/35 font-utility uppercase">NILAI KAMI</span>
                    </GlassCard>

                    {/* Cell 5: Transparansi */}
                    <GlassCard variant="default" className="p-6 flex flex-col justify-between" hover>
                        <span className="text-[10px] uppercase tracking-wider text-dark/40 font-utility">Komitmen</span>
                        <div>
                            <h4 className="font-semibold text-rose text-xs uppercase mb-1.5">Harga Transparan</h4>
                            <p className="text-dark/50 text-[11px] leading-relaxed line-clamp-3">
                                Rincian biaya yang jelas dan transparan tanpa biaya tersembunyi. Apa yang Anda lihat, itulah yang Anda bayar.
                            </p>
                        </div>
                        <span className="text-[9px] text-dark/35 font-utility uppercase">TRANSPARANSI PENUH</span>
                    </GlassCard>

                </div>
            </div>
        </div>
    );
};