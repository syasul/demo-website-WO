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
            'email' => 'superadmin@luxurywo.com',
            'password' => Hash::make('password'),
            'phone' => '085647457018',
            'is_active' => true,
        ]);

        $admin = User::create([
            'name' => 'Admin Wedding Planner',
            'email' => 'admin@luxurywo.com',
            'password' => Hash::make('password'),
            'phone' => '085647457019',
            'is_active' => true,
        ]);

        $finance = User::create([
            'name' => 'Finance Staff',
            'email' => 'finance@luxurywo.com',
            'password' => Hash::make('password'),
            'phone' => '085647457020',
            'is_active' => true,
        ]);

        // 2. Create Categories
        $akadCat = Category::create(['name' => 'Akad Nikah', 'slug' => 'akad-nikah']);
        $resepsiCat = Category::create(['name' => 'Resepsi', 'slug' => 'resepsi']);
        $allInCat = Category::create(['name' => 'All-in Package', 'slug' => 'all-in-package']);

        // 3. Create Wedding Services (MenuItem)
        $services = [
            // General WO services from flyer
            ['name' => 'Susunan acara atau rundown', 'type' => 'entertainment'],
            ['name' => 'Desain layout venue & Moodboard', 'type' => 'decoration'],
            ['name' => 'Referensi & dealing vendor', 'type' => 'venue'],
            ['name' => 'Pendampingan crew selama acara', 'type' => 'entertainment'],
            ['name' => 'Pendampingan loading vendor H-1', 'type' => 'decoration'],
            ['name' => 'TM Family & Meeting all vendor', 'type' => 'entertainment'],
            ['name' => 'Rias Pengantin Modern / Adat', 'type' => 'makeup'],
            ['name' => 'Dokumentasi Foto & Video', 'type' => 'photo'],
            ['name' => 'Prasmanan Nusantara & Gubukan', 'type' => 'catering'],
        ];

        $serviceModels = [];
        foreach ($services as $s) {
            $serviceModels[] = MenuItem::create($s);
        }

        // 4. Create Packages
        $pIntimate = Package::create([
            'category_id' => $allInCat->id,
            'name' => 'Intimate Package',
            'slug' => 'intimate-package',
            'description' => 'Paket intimate WO (75-100 Undangan / 150-200 Pax) - Termasuk susunan acara, desain layout, moodboard, pendampingan crew, TM Family, free balon helium, fitting, & video IG story.',
            'price_per_pax' => 1500000.00, // Used as flat rate when is_flat = true
            'min_pax' => 150,
            'max_pax' => 200,
            'thumbnail' => null,
            'is_active' => true,
            'is_flat' => true,
        ]);

        $pClassic = Package::create([
            'category_id' => $allInCat->id,
            'name' => 'Classic Package',
            'slug' => 'classic-package',
            'description' => 'Paket classic WO (500 Undangan / 1000 Pax) - 7 Crew incharge, susunan acara, layout venue, TM Family 1x, free fitting, balon helium, buku tamu, video IG story, & doorprize.',
            'price_per_pax' => 3000000.00,
            'min_pax' => 500,
            'max_pax' => 1000,
            'thumbnail' => null,
            'is_active' => true,
            'is_flat' => true,
        ]);

        $pPremium = Package::create([
            'category_id' => $allInCat->id,
            'name' => 'Premium Package',
            'slug' => 'premium-package',
            'description' => 'Paket premium WO (1000 Undangan / 2000 Pax) - 12 Crew incharge, susunan acara, layout, loading vendor H-1, free fitting, buku tamu, sepasang merpati, video IG, & doorprize.',
            'price_per_pax' => 6000000.00,
            'min_pax' => 1000,
            'max_pax' => 2000,
            'thumbnail' => null,
            'is_active' => true,
            'is_flat' => true,
        ]);

        // Link Services to Packages
        $pIntimate->menuItems()->attach([
            $serviceModels[0]->id,
            $serviceModels[1]->id,
            $serviceModels[2]->id,
            $serviceModels[3]->id,
            $serviceModels[4]->id,
        ]);

        $pClassic->menuItems()->attach([
            $serviceModels[0]->id,
            $serviceModels[1]->id,
            $serviceModels[2]->id,
            $serviceModels[3]->id,
            $serviceModels[4]->id,
            $serviceModels[5]->id,
        ]);

        $pPremium->menuItems()->attach([
            $serviceModels[0]->id,
            $serviceModels[1]->id,
            $serviceModels[2]->id,
            $serviceModels[3]->id,
            $serviceModels[4]->id,
            $serviceModels[5]->id,
            $serviceModels[6]->id,
            $serviceModels[7]->id,
        ]);

        // 5. Create Add-ons
        $addons = [
            ['name' => 'Sewa Dekorasi Pernikahan (Wardiere Wedding Decoration)', 'pricing_type' => 'flat', 'price' => 5000000.00],
            ['name' => 'Sewa Tenda & Panggung Pernikahan', 'pricing_type' => 'flat', 'price' => 3000000.00],
            ['name' => 'MC Profesional & Sound System', 'pricing_type' => 'flat', 'price' => 2500000.00],
            ['name' => 'Live Music Akustik', 'pricing_type' => 'flat', 'price' => 4500000.00],
            ['name' => 'Photobooth 4x6 Unlimited (3 Jam)', 'pricing_type' => 'flat', 'price' => 2000000.00],
        ];

        $addonModels = [];
        foreach ($addons as $ad) {
            $addonModels[] = Addon::create($ad);
        }

        // 6. Create Pricing Tiers (Can keep empty or simple)
        PricingTier::create(['package_id' => null, 'min_pax' => 250, 'discount_percent' => 5.00]);

        // 7. Create Testimonials
        Testimonial::create([
            'customer_name' => 'Budi & Ani',
            'event_type' => 'Wedding Reception',
            'rating' => 5,
            'content' => 'Pernikahan kami berjalan sangat lancar! Koordinasi crew LUXURY sangat disiplin, dekorasi Wardiere cantik sekali. Sangat merekomendasikan paket Intimate!',
            'photo' => null,
            'is_published' => true,
        ]);

        Testimonial::create([
            'customer_name' => 'Rina & Dedi',
            'event_type' => 'Akad & Resepsi',
            'rating' => 5,
            'content' => 'Sangat membantu dalam mengurus rundown dan layout acara. Crew LUXURY sangat teliti, sehingga kami bisa menikmati acara dengan tenang dan bahagia.',
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
            'title' => 'Konsep Outdoor Garden Rina & Dedi',
            'category_id' => $allInCat->id,
            'image' => 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600',
            'event_date' => Carbon::now()->subMonths(1),
            'is_published' => true,
        ]);

        // 9. Create Quotations (Leads)
        $now = Carbon::now();

        // Lead 1
        Quotation::create([
            'package_id' => $pIntimate->id,
            'package_name_snapshot' => $pIntimate->name,
            'price_per_pax_snapshot' => $pIntimate->price_per_pax,
            'pax' => 150,
            'addon_ids' => [$addonModels[0]->id, $addonModels[1]->id], // Dekorasi, Tenda
            'addon_snapshot' => [
                ['name' => $addonModels[0]->name, 'pricing_type' => $addonModels[0]->pricing_type, 'price' => $addonModels[0]->price],
                ['name' => $addonModels[1]->name, 'pricing_type' => $addonModels[1]->pricing_type, 'price' => $addonModels[1]->price],
            ],
            'event_date' => $now->copy()->addMonths(3)->toDateString(),
            'event_location' => 'Gedung Serbaguna Dinoyo, Malang',
            'subtotal' => 1500000.00 + 5000000.00 + 3000000.00, // 9.5M
            'discount' => 0.00,
            'total_estimate' => 9500000.00,
            'customer_name' => 'Siti Rahmawati',
            'customer_phone' => '087812345678',
            'customer_address' => 'Jl. MT Haryono No. 12, Malang',
            'customer_email' => 'siti.rahma@gmail.com',
            'notes' => 'Minta info detail rundown acara pagi.',
            'source' => 'web',
            'status' => 'new',
            'assigned_to' => null,
            'lost_reason' => null,
            'created_at' => $now->copy()->subHours(2),
        ]);

        // Lead 2
        Quotation::create([
            'package_id' => $pClassic->id,
            'package_name_snapshot' => $pClassic->name,
            'price_per_pax_snapshot' => $pClassic->price_per_pax,
            'pax' => 1000,
            'addon_ids' => [$addonModels[0]->id], // Dekorasi
            'addon_snapshot' => [
                ['name' => $addonModels[0]->name, 'pricing_type' => $addonModels[0]->pricing_type, 'price' => $addonModels[0]->price],
            ],
            'event_date' => $now->copy()->addMonths(4)->toDateString(),
            'event_location' => 'Aula Universitas Brawijaya, Malang',
            'subtotal' => 3000000.00 + 5000000.00, // 8M
            'discount' => 0.00,
            'total_estimate' => 8000000.00,
            'customer_name' => 'Ahmad Fauzi',
            'customer_phone' => '082198765432',
            'customer_address' => 'Jl. Pajajaran No. 44, Malang',
            'customer_email' => 'fauzi.ahmad@yahoo.com',
            'notes' => 'Ingin tema dekorasi serba hijau emerald.',
            'source' => 'web',
            'status' => 'contacted',
            'assigned_to' => $admin->id,
            'lost_reason' => null,
            'created_at' => $now->copy()->subDays(3),
        ]);

        // 10. Create Default Settings
        \App\Models\Setting::create(['key' => 'contact_whatsapp', 'value' => '6281330012100']);
        \App\Models\Setting::create(['key' => 'contact_email', 'value' => 'info@luxurywo.com']);
        \App\Models\Setting::create(['key' => 'contact_address', 'value' => 'Ruko Dinoyo Kav. 4, Malang, Jawa Timur']);
        \App\Models\Setting::create(['key' => 'whatsapp_template', 'value' => "Halo Admin LUXURY Wedding Organizer, saya ingin mengkonfirmasi reservasi booking WO saya:\n\n*Nama:* {name}\n*No HP:* {phone}\n*Alamat:* {address}\n*Paket:* {package} ({pax} pax)\n*Tanggal Acara:* {event_date}\n*Lokasi:* {location}\n*Add-ons:* {addons}\n*Estimasi Total:* Rp {total_estimate}\n\nMohon dibantu untuk kelanjutan pemesanan."]);
        \App\Models\Setting::create(['key' => 'notification_emails', 'value' => 'admin@luxurywo.com,finance@luxurywo.com']);
        \App\Models\Setting::create(['key' => 'sk_charge_quota', 'value' => 'Apabila jumlah tamu melebihi kuota paket yang disepakati, akan dikenakan biaya tambahan (charge) sebesar Rp 50.000 per pax.']);
        \App\Models\Setting::create(['key' => 'sk_charge_overtime', 'value' => 'Kelebihan waktu pemakaian (overtime) dari durasi paket yang ditentukan akan dikenakan biaya tambahan (charge) sebesar Rp 1.000.000 per jam.']);
    }
}