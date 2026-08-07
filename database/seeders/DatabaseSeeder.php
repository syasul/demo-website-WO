<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Package;
use App\Models\MenuItem;
use App\Models\Addon;
use App\Models\PricingTier;
use App\Models\Quotation;
use App\Models\QuotationActivity;
use App\Models\Testimonial;
use App\Models\Gallery;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Users
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@amarylliswedding.com',
            'password' => Hash::make('password'),
            'phone' => '081234567890',
            'is_active' => true,
        ]);

        $admin = User::create([
            'name' => 'Admin Wedding Planner',
            'email' => 'admin@amarylliswedding.com',
            'password' => Hash::make('password'),
            'phone' => '081234567891',
            'is_active' => true,
        ]);

        $finance = User::create([
            'name' => 'Finance Staff',
            'email' => 'finance@amarylliswedding.com',
            'password' => Hash::make('password'),
            'phone' => '081234567892',
            'is_active' => true,
        ]);

        // 2. Create Categories
        $akadCat = Category::create(['name' => 'Akad Nikah', 'slug' => 'akad-nikah']);
        $resepsiCat = Category::create(['name' => 'Resepsi', 'slug' => 'resepsi']);
        $allInCat = Category::create(['name' => 'All-in Package', 'slug' => 'all-in-package']);

        // 3. Create Wedding Services (MenuItem)
        $services = [
            // Decoration
            ['name' => 'Dekorasi Pelaminan Minimalis', 'type' => 'decoration'],
            ['name' => 'Backdrop Flower Wall', 'type' => 'decoration'],
            ['name' => 'Dekorasi Aisle Runner & Gate', 'type' => 'decoration'],
            ['name' => 'Lighting & Lampu Gantung', 'type' => 'decoration'],
            ['name' => 'Floral Arrangement Centerpiece', 'type' => 'decoration'],
            // Makeup
            ['name' => 'Rias Pengantin Modern', 'type' => 'makeup'],
            ['name' => 'Rias Pengantin Adat', 'type' => 'makeup'],
            ['name' => 'Sanggul & Hairdo Profesional', 'type' => 'makeup'],
            ['name' => 'MUA Follow-up Sesi Kedua', 'type' => 'makeup'],
            // Photo
            ['name' => 'Dokumentasi Foto & Video', 'type' => 'photo'],
            ['name' => 'Sesi Foto Prewedding', 'type' => 'photo'],
            ['name' => 'Drone Cinematic', 'type' => 'photo'],
            ['name' => 'Photobooth 4x6', 'type' => 'photo'],
            // Venue
            ['name' => 'Gedung Ballroom', 'type' => 'venue'],
            ['name' => 'Venue Outdoor Garden', 'type' => 'venue'],
            ['name' => 'Tenda & Panggung', 'type' => 'venue'],
            // Catering
            ['name' => 'Prasmanan Nusantara', 'type' => 'catering'],
            ['name' => 'Fine Dining Plated', 'type' => 'catering'],
            ['name' => 'Live Station BBQ', 'type' => 'catering'],
            ['name' => 'Kambing Guling', 'type' => 'catering'],
            // Entertainment
            ['name' => 'MC Profesional', 'type' => 'entertainment'],
            ['name' => 'Live Music Akustik', 'type' => 'entertainment'],
        ];

        $serviceModels = [];
        foreach ($services as $s) {
            $serviceModels[] = MenuItem::create($s);
        }

        // 4. Create Packages
        $pSakinah = Package::create([
            'category_id' => $akadCat->id,
            'name' => 'Paket Akad Nikah Sakinah',
            'slug' => 'paket-akad-sakinah',
            'description' => 'Paket akad nikah elegan dengan dekorasi pelaminan, rias pengantin, dokumentasi, dan prasmanan untuk tamu undangan.',
            'price_per_pax' => 275000.00,
            'min_pax' => 100,
            'max_pax' => 500,
            'thumbnail' => null,
            'is_active' => true,
        ]);

        $pMawaddah = Package::create([
            'category_id' => $resepsiCat->id,
            'name' => 'Paket Resepsi Mawaddah',
            'slug' => 'paket-resepsi-mawaddah',
            'description' => 'Paket resepsi populer dengan dekorasi flower wall, live music akustik, dan prasmanan lengkap untuk momen bahagia.',
            'price_per_pax' => 375000.00,
            'min_pax' => 150,
            'max_pax' => 1000,
            'thumbnail' => null,
            'is_active' => true,
        ]);

        $pRahmah = Package::create([
            'category_id' => $allInCat->id,
            'name' => 'Paket All-in Rahmah',
            'slug' => 'paket-all-in-rahmah',
            'description' => 'Paket pernikahan terlengkap: akad + resepsi, rias, dokumentasi premium, venue ballroom, dan hiburan terbaik.',
            'price_per_pax' => 475000.00,
            'min_pax' => 200,
            'max_pax' => 2000,
            'thumbnail' => null,
            'is_active' => true,
        ]);

        $pImpian = Package::create([
            'category_id' => $allInCat->id,
            'name' => 'Paket All-in Impian',
            'slug' => 'paket-all-in-impian',
            'description' => 'Paket lengkap dengan konsep outdoor garden, prewedding session, photobooth, dan MC profesional untuk pernikahan impian.',
            'price_per_pax' => 425000.00,
            'min_pax' => 150,
            'max_pax' => 1000,
            'thumbnail' => null,
            'is_active' => true,
        ]);

        // Link Services to Packages
        // Akad Sakinah services
        $pSakinah->menuItems()->attach([
            $serviceModels[0]->id, // Pelaminan Minimalis
            $serviceModels[2]->id, // Aisle Runner & Gate
            $serviceModels[4]->id, // Floral Centerpiece
            $serviceModels[6]->id, // Rias Adat
            $serviceModels[9]->id, // Dokumentasi Foto & Video
            $serviceModels[16]->id, // Prasmanan Nusantara
            $serviceModels[20]->id, // MC Profesional
        ]);

        // Resepsi Mawaddah services
        $pMawaddah->menuItems()->attach([
            $serviceModels[0]->id, // Pelaminan Minimalis
            $serviceModels[1]->id, // Flower Wall
            $serviceModels[3]->id, // Lighting
            $serviceModels[5]->id, // Rias Modern
            $serviceModels[7]->id, // Sanggul & Hairdo
            $serviceModels[9]->id, // Dokumentasi
            $serviceModels[12]->id, // Photobooth
            $serviceModels[16]->id, // Prasmanan Nusantara
            $serviceModels[19]->id, // Kambing Guling
            $serviceModels[20]->id, // MC Profesional
            $serviceModels[21]->id, // Live Music Akustik
        ]);

        // All-in Rahmah services
        $pRahmah->menuItems()->attach([
            $serviceModels[0]->id, // Pelaminan Minimalis
            $serviceModels[1]->id, // Flower Wall
            $serviceModels[2]->id, // Aisle Runner
            $serviceModels[3]->id, // Lighting
            $serviceModels[4]->id, // Floral Centerpiece
            $serviceModels[5]->id, // Rias Modern
            $serviceModels[6]->id, // Rias Adat
            $serviceModels[8]->id, // MUA Follow-up
            $serviceModels[9]->id, // Dokumentasi
            $serviceModels[10]->id, // Prewedding
            $serviceModels[11]->id, // Drone
            $serviceModels[13]->id, // Gedung Ballroom
            $serviceModels[16]->id, // Prasmanan
            $serviceModels[17]->id, // Fine Dining
            $serviceModels[19]->id, // Kambing Guling
            $serviceModels[20]->id, // MC
            $serviceModels[21]->id, // Live Music
        ]);

        // All-in Impian services
        $pImpian->menuItems()->attach([
            $serviceModels[0]->id, // Pelaminan Minimalis
            $serviceModels[1]->id, // Flower Wall
            $serviceModels[3]->id, // Lighting
            $serviceModels[5]->id, // Rias Modern
            $serviceModels[9]->id, // Dokumentasi
            $serviceModels[10]->id, // Prewedding
            $serviceModels[12]->id, // Photobooth
            $serviceModels[14]->id, // Outdoor Garden
            $serviceModels[16]->id, // Prasmanan
            $serviceModels[18]->id, // Live Station BBQ
            $serviceModels[20]->id, // MC
            $serviceModels[21]->id, // Live Music
        ]);

        // 5. Create Add-ons
        $addons = [
            ['name' => 'MC Profesional & Sound System', 'pricing_type' => 'flat', 'price' => 2500000.00],
            ['name' => 'Live Music Akustik', 'pricing_type' => 'flat', 'price' => 4500000.00],
            ['name' => 'Souvenir Pernikahan per Tamu', 'pricing_type' => 'per_pax', 'price' => 15000.00],
            ['name' => 'Flower Wall Tambahan', 'pricing_type' => 'flat', 'price' => 3500000.00],
            ['name' => 'Photobooth 4x6', 'pricing_type' => 'flat', 'price' => 2000000.00],
            ['name' => 'Kambing Guling (pax)', 'pricing_type' => 'per_pax', 'price' => 35000.00],
        ];

        $addonModels = [];
        foreach ($addons as $ad) {
            $addonModels[] = Addon::create($ad);
        }

        // 6. Create Pricing Tiers
        // Global Tiers (discount_percent)
        PricingTier::create(['package_id' => null, 'min_pax' => 250, 'discount_percent' => 5.00]);
        PricingTier::create(['package_id' => null, 'min_pax' => 500, 'discount_percent' => 10.00]);

        // Package-specific Tier overrides (for pSakinah)
        PricingTier::create(['package_id' => $pSakinah->id, 'min_pax' => 300, 'discount_percent' => 12.00]);

        // 7. Create Testimonials
        Testimonial::create([
            'customer_name' => 'Budi & Ani',
            'event_type' => 'Wedding Reception',
            'rating' => 5,
            'content' => 'Pernikahan kami berjalan sangat lancar! Dekorasi flower wall-nya cantik sekali, semua tamu memuji konsep resepsinya. Tim Amaryllis sangat profesional dari akad sampai resepsi.',
            'photo' => null,
            'is_published' => true,
        ]);

        Testimonial::create([
            'customer_name' => 'Rina & Dedi',
            'event_type' => 'Akad & Resepsi',
            'rating' => 5,
            'content' => 'Rias pengantinnya natural dan elegan, dokumentasi fotonya seperti foto majalah! Harga sesuai dengan kualitas yang kami dapatkan. Sangat direkomendasikan!',
            'photo' => null,
            'is_published' => true,
        ]);

        Testimonial::create([
            'customer_name' => 'Sinta & Raka',
            'event_type' => 'Wedding All-in Package',
            'rating' => 4,
            'content' => 'Paket all-in sangat membantu kami karena tidak perlu repot mengurus vendor satu per satu. MC dan live music-nya bagus, suasana resepsi jadi meriah.',
            'photo' => null,
            'is_published' => true,
        ]);

        // 8. Create Galleries
        Gallery::create([
            'title' => 'Dekorasi Resepsi Elegan Budi & Ani',
            'category_id' => $resepsiCat->id,
            'image' => 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600',
            'event_date' => Carbon::now()->subMonths(2),
            'is_published' => true,
        ]);

        Gallery::create([
            'title' => 'Konsep Outdoor Garden Sinta & Raka',
            'category_id' => $allInCat->id,
            'image' => 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600',
            'event_date' => Carbon::now()->subMonths(1),
            'is_published' => true,
        ]);

        Gallery::create([
            'title' => 'Momen Akad Nikah Rina & Dedi',
            'category_id' => $akadCat->id,
            'image' => 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=600',
            'event_date' => Carbon::now()->subDays(15),
            'is_published' => true,
        ]);

        // 9. Create Quotations (Leads)
        $now = Carbon::now();

        // Lead 1: New Lead
        $lead1 = Quotation::create([
            'package_id' => $pSakinah->id,
            'package_name_snapshot' => $pSakinah->name,
            'price_per_pax_snapshot' => $pSakinah->price_per_pax,
            'pax' => 300,
            'addon_ids' => [$addonModels[0]->id, $addonModels[1]->id], // MC & Sound, Live Music
            'addon_snapshot' => [
                ['name' => $addonModels[0]->name, 'pricing_type' => $addonModels[0]->pricing_type, 'price' => $addonModels[0]->price],
                ['name' => $addonModels[1]->name, 'pricing_type' => $addonModels[1]->pricing_type, 'price' => $addonModels[1]->price],
            ],
            'event_date' => $now->copy()->addMonths(3)->toDateString(),
            'event_location' => 'Gedung Serbaguna Masjid Agung, Jakarta',
            'subtotal' => (55000.00 * 300) + 2500000.00 + 4500000.00, // 16.5M + 7M = 23.5M
            'discount' => 23500000.00 * 0.05, // 5% discount (pax >= 250) -> 1.175M
            'total_estimate' => 22325000.00,
            'customer_name' => 'Siti Rahmawati',
            'customer_phone' => '087812345678',
            'customer_email' => 'siti.rahma@gmail.com',
            'notes' => 'Tolong tanyakan apakah dekorasi pelaminan bisa request warna ungu pastel.',
            'source' => 'web',
            'status' => 'new',
            'assigned_to' => null,
            'lost_reason' => null,
            'created_at' => $now->copy()->subHours(2),
        ]);

        // Lead 2: Contacted Lead (Assigned to Admin)
        $lead2 = Quotation::create([
            'package_id' => $pMawaddah->id,
            'package_name_snapshot' => $pMawaddah->name,
            'price_per_pax_snapshot' => $pMawaddah->price_per_pax,
            'pax' => 400,
            'addon_ids' => [$addonModels[2]->id, $addonModels[3]->id], // Souvenir, Flower Wall
            'addon_snapshot' => [
                ['name' => $addonModels[2]->name, 'pricing_type' => $addonModels[2]->pricing_type, 'price' => $addonModels[2]->price], // 15k * 400 = 6M
                ['name' => $addonModels[3]->name, 'pricing_type' => $addonModels[3]->pricing_type, 'price' => $addonModels[3]->price], // 3.5M
            ],
            'event_date' => $now->copy()->addMonths(4)->toDateString(),
            'event_location' => 'Aula Kompas Gramedia, Jakarta',
            'subtotal' => (75000.00 * 400) + (15000.00 * 400) + 3500000.00, // 30M + 6M + 3.5M = 39.5M
            'discount' => 39500000.00 * 0.05, // 5% -> 1.975M
            'total_estimate' => 37525000.00,
            'customer_name' => 'Ahmad Fauzi',
            'customer_phone' => '082198765432',
            'customer_email' => 'fauzi.ahmad@yahoo.com',
            'notes' => 'Rencana resepsi pernikahan malam hari dengan tema rose gold.',
            'source' => 'web',
            'status' => 'contacted',
            'assigned_to' => $admin->id,
            'lost_reason' => null,
            'created_at' => $now->copy()->subDays(3),
        ]);

        QuotationActivity::create([
            'quotation_id' => $lead2->id,
            'user_id' => $admin->id,
            'note' => 'Melakukan follow-up pertama via WhatsApp. Customer meminta rincian layanan yang termasuk dalam Paket Mawaddah.',
            'activity_type' => 'wa',
            'created_at' => $now->copy()->subDays(2)->addHours(4),
        ]);

        QuotationActivity::create([
            'quotation_id' => $lead2->id,
            'user_id' => $admin->id,
            'note' => 'Menghubungi via telepon. Konfirmasi tanggal acara aman belum ter-booking.',
            'activity_type' => 'call',
            'created_at' => $now->copy()->subDays(2)->addHours(5),
        ]);

        // Lead 3: Negotiation Lead
        $lead3 = Quotation::create([
            'package_id' => $pRahmah->id,
            'package_name_snapshot' => $pRahmah->name,
            'price_per_pax_snapshot' => $pRahmah->price_per_pax,
            'pax' => 600,
            'addon_ids' => [$addonModels[0]->id, $addonModels[4]->id], // MC & Sound, Photobooth
            'addon_snapshot' => [
                ['name' => $addonModels[0]->name, 'pricing_type' => $addonModels[0]->pricing_type, 'price' => $addonModels[0]->price], // 2.5M
                ['name' => $addonModels[4]->name, 'pricing_type' => $addonModels[4]->pricing_type, 'price' => $addonModels[4]->price], // 2M
            ],
            'event_date' => $now->copy()->addMonths(2)->toDateString(),
            'event_location' => 'Balai Kartini, Jakarta',
            'subtotal' => (95000.00 * 600) + 2500000.00 + 2000000.00, // 57M + 4.5M = 61.5M
            'discount' => 61500000.00 * 0.10, // 10% discount (pax >= 500) -> 6.15M
            'total_estimate' => 55350000.00,
            'customer_name' => 'Rina Wijayanti',
            'customer_phone' => '081399887766',
            'customer_email' => 'rina.w@outlook.com',
            'notes' => 'Meminta nego diskon tambahan karena ambil paket rias busana juga.',
            'source' => 'whatsapp',
            'status' => 'negotiation',
            'assigned_to' => $admin->id,
            'lost_reason' => null,
            'created_at' => $now->copy()->subDays(5),
        ]);

        QuotationActivity::create([
            'quotation_id' => $lead3->id,
            'user_id' => $admin->id,
            'note' => 'Chat WhatsApp: Customer menanyakan kelengkapan rias pengantin adat Jawa Tengah.',
            'activity_type' => 'wa',
            'created_at' => $now->copy()->subDays(4),
        ]);

        QuotationActivity::create([
            'quotation_id' => $lead3->id,
            'user_id' => $admin->id,
            'note' => 'Bertemu di kantor untuk melihat portfolio dekorasi dan mencoba menu prasmanan. Customer suka dan lanjut bernegosiasi harga.',
            'activity_type' => 'meeting',
            'created_at' => $now->copy()->subDays(3),
        ]);

        // Lead 4: Deal Lead
        $lead4 = Quotation::create([
            'package_id' => $pImpian->id,
            'package_name_snapshot' => $pImpian->name,
            'price_per_pax_snapshot' => $pImpian->price_per_pax,
            'pax' => 200,
            'addon_ids' => [$addonModels[1]->id], // Live Music
            'addon_snapshot' => [
                ['name' => $addonModels[1]->name, 'pricing_type' => $addonModels[1]->pricing_type, 'price' => $addonModels[1]->price], // 4.5M
            ],
            'event_date' => $now->copy()->addMonths(1)->toDateString(),
            'event_location' => 'Kebun Raya Bogor, Area Outdoor',
            'subtotal' => (85000.00 * 200) + 4500000.00, // 17M + 4.5M = 21.5M
            'discount' => 0.00, // pax 200 < 250, no discount
            'total_estimate' => 21500000.00,
            'customer_name' => 'Hendra Setiawan',
            'customer_phone' => '081223344556',
            'customer_email' => 'hendra.setiawan@gmail.com',
            'notes' => 'Pernikahan outdoor garden dengan konsep bohemian.',
            'source' => 'manual',
            'status' => 'deal',
            'assigned_to' => $admin->id,
            'lost_reason' => null,
            'created_at' => $now->copy()->subDays(10),
        ]);

        QuotationActivity::create([
            'quotation_id' => $lead4->id,
            'user_id' => $admin->id,
            'note' => 'Penawaran dikirim via email beserta timeline persiapan pernikahan.',
            'activity_type' => 'email',
            'created_at' => $now->copy()->subDays(9),
        ]);

        QuotationActivity::create([
            'quotation_id' => $lead4->id,
            'user_id' => $admin->id,
            'note' => 'Status diubah ke Deal. Customer telah mengirimkan DP 50% sebesar Rp 10.750.000 via transfer bank.',
            'activity_type' => 'status_change',
            'created_at' => $now->copy()->subDays(8),
        ]);

        // Lead 5: Lost Lead
        $lead5 = Quotation::create([
            'package_id' => $pMawaddah->id,
            'package_name_snapshot' => $pMawaddah->name,
            'price_per_pax_snapshot' => $pMawaddah->price_per_pax,
            'pax' => 200,
            'addon_ids' => [$addonModels[0]->id], // MC & Sound
            'addon_snapshot' => [
                ['name' => $addonModels[0]->name, 'pricing_type' => $addonModels[0]->pricing_type, 'price' => $addonModels[0]->price], // 2.5M
            ],
            'event_date' => $now->copy()->addMonths(5)->toDateString(),
            'event_location' => 'Rumah Kediaman Pamulang',
            'subtotal' => (75000.00 * 200) + 2500000.00, // 15M + 2.5M = 17.5M
            'discount' => 0.00,
            'total_estimate' => 17500000.00,
            'customer_name' => 'Dewi Lestari',
            'customer_phone' => '085611223344',
            'customer_email' => 'dewi.lestari@gmail.com',
            'notes' => 'Rencana resepsi pernikahan keluarga di rumah dengan tenda.',
            'source' => 'web',
            'status' => 'lost',
            'assigned_to' => $admin->id,
            'lost_reason' => 'Harga terlalu tinggi',
            'created_at' => $now->copy()->subDays(12),
        ]);

        QuotationActivity::create([
            'quotation_id' => $lead5->id,
            'user_id' => $admin->id,
            'note' => 'Menghubungi customer via WA. Customer merasa budget 17.5 juta terlalu mahal untuk resepsi di rumah dan memilih vendor lain yang lebih ekonomis.',
            'activity_type' => 'status_change',
            'created_at' => $now->copy()->subDays(10),
        ]);

        // Generate more historical leads to make charts look great (especially Reports)
        // Let's seed 15 more leads spread over the last 3 months
        $months = [3, 2, 1, 0];
        $statuses = ['deal', 'lost', 'negotiation', 'contacted', 'new'];
        $lostReasons = ['Harga terlalu tinggi', 'Sudah pakai vendor lain', 'Batal acara', 'Kurang cocok konsep'];
        $names = ['Siska', 'Aditya', 'Rian', 'Denny', 'Melati', 'Wulan', 'Dimas', 'Indra', 'Fitri', 'Bambang', 'Lilis', 'Yusuf', 'Novi', 'Fajar', 'Toni'];

        foreach ($names as $index => $name) {
            $monthOffset = $months[$index % count($months)];
            $status = $statuses[$index % count($statuses)];
            $assigned = ($status === 'new') ? null : $admin->id;
            $lostReason = ($status === 'lost') ? $lostReasons[$index % count($lostReasons)] : null;
            $pkg = ($index % 2 === 0) ? $pMawaddah : $pSakinah;
            $pax = 150 + ($index * 25);
            $sub = $pkg->price_per_pax * $pax;
            $disc = ($pax >= 250) ? $sub * 0.05 : 0;
            $total = $sub - $disc;

            Quotation::create([
                'package_id' => $pkg->id,
                'package_name_snapshot' => $pkg->name,
                'price_per_pax_snapshot' => $pkg->price_per_pax,
                'pax' => $pax,
                'addon_ids' => [],
                'addon_snapshot' => [],
                'event_date' => $now->copy()->subMonths($monthOffset)->addDays($index)->toDateString(),
                'event_location' => 'Kota Jakarta',
                'subtotal' => $sub,
                'discount' => $disc,
                'total_estimate' => $total,
                'customer_name' => $name,
                'customer_phone' => '0898000011' . sprintf('%02d', $index),
                'customer_email' => strtolower($name) . '@example.com',
                'notes' => 'Acara pernikahan seeded.',
                'source' => ($index % 3 === 0) ? 'whatsapp' : (($index % 3 === 1) ? 'web' : 'manual'),
                'status' => $status,
                'assigned_to' => $assigned,
                'lost_reason' => $lostReason,
                'created_at' => $now->copy()->subMonths($monthOffset)->subDays(10 - $index),
            ]);
        }

        // 10. Create Default Settings
        \App\Models\Setting::create(['key' => 'contact_whatsapp', 'value' => '6281234567890']);
        \App\Models\Setting::create(['key' => 'contact_email', 'value' => 'info@amarylliswedding.com']);
        \App\Models\Setting::create(['key' => 'contact_address', 'value' => 'Jl. Kebun Raya No. 10, Bogor, Jawa Barat']);
        \App\Models\Setting::create(['key' => 'whatsapp_template', 'value' => "Halo Admin Amaryllis Wedding, saya ingin mengkonfirmasi simulasi estimasi biaya pernikahan saya:\n\n*Nama:* {name}\n*No HP:* {phone}\n*Paket:* {package} ({pax} pax)\n*Tanggal Acara:* {event_date}\n*Lokasi:* {location}\n*Add-ons:* {addons}\n*Estimasi Total:* Rp {total_estimate}\n\nMohon dibantu untuk kelanjutan pemesanan."]);
        \App\Models\Setting::create(['key' => 'notification_emails', 'value' => 'admin@amarylliswedding.com,finance@amarylliswedding.com']);
    }
}