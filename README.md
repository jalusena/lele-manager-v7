# 🐟 Lele Manager

Aplikasi manajemen budidaya ikan lele berbasis web mobile-first.
Dibangun dengan **Next.js 14 + Prisma + SQLite + Tailwind CSS**.

---

## 🛠 Tech Stack

| Layer       | Teknologi                         |
|-------------|-----------------------------------|
| Frontend    | Next.js 14 (App Router), React 18 |
| Styling     | Tailwind CSS                      |
| Icons       | Lucide React                      |
| Charts      | Recharts                          |
| Database    | SQLite via Prisma ORM             |
| Export      | SheetJS (xlsx)                    |
| Deployment  | Vercel / Node.js server           |

---

## 📁 Struktur Folder

```
lele-manager/
├── prisma/
│   ├── schema.prisma       # Skema database
│   ├── seed.js             # Data dummy
│   └── dev.db              # SQLite (auto-generated)
│
├── src/
│   ├── app/
│   │   ├── (main)/
│   │   │   ├── layout.jsx          # Layout + BottomNav
│   │   │   ├── dashboard/          # Halaman dashboard
│   │   │   ├── kolam/              # List & detail kolam
│   │   │   │   └── [id]/           # Detail per kolam
│   │   │   ├── pakan/              # Data pakan semua kolam
│   │   │   ├── laporan/            # Laporan + export Excel
│   │   │   └── profil/             # Profil user
│   │   │
│   │   ├── api/
│   │   │   ├── ponds/              # CRUD kolam
│   │   │   ├── seeds/              # CRUD benih
│   │   │   ├── feeds/              # CRUD pakan
│   │   │   ├── harvests/           # CRUD panen
│   │   │   └── expenses/           # CRUD biaya
│   │   │
│   │   ├── layout.jsx              # Root layout
│   │   ├── page.jsx                # Redirect ke /dashboard
│   │   └── globals.css             # Global styles
│   │
│   ├── components/
│   │   ├── BottomNav.jsx           # Navigasi bawah mobile
│   │   └── ui.jsx                  # Komponen reusable
│   │
│   └── lib/
│       ├── prisma.js               # Prisma client singleton
│       ├── utils.js                # Helper functions
│       └── exportExcel.js          # Export Excel (SheetJS)
│
├── .env                            # Environment variables
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## ⚡ Cara Instalasi & Menjalankan

### Prasyarat

Pastikan sudah terinstall:
- **Node.js** versi 18 atau lebih baru → [nodejs.org](https://nodejs.org)
- **npm** (ikut serta saat install Node.js)

Cek versi:
```bash
node -v    # harus >= 18
npm -v     # harus >= 8
```

---

### Langkah 1 – Clone / Download Project

**Opsi A – Download ZIP** (paling mudah):
1. Download file project ini
2. Extract ke folder pilihan
3. Buka terminal, masuk ke folder project

**Opsi B – Git clone** (jika di GitHub):
```bash
git clone https://github.com/username/lele-manager.git
cd lele-manager
```

---

### Langkah 2 – Install Dependensi

```bash
npm install
```

Proses ini akan mengunduh semua library yang dibutuhkan (Next.js, Prisma, Tailwind, dll).
Tunggu hingga selesai (~1-2 menit).

---

### Langkah 3 – Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Buat tabel di database SQLite
npm run db:push
```

---

### Langkah 4 – Isi Data Contoh (Opsional tapi Disarankan)

```bash
npm run db:seed
```

Perintah ini akan membuat:
- 1 user demo (budi@demo.com / demo1234)
- 3 kolam contoh (Kolam A, B, C)
- Data pakan, panen, dan biaya

---

### Langkah 5 – Jalankan Aplikasi

```bash
npm run dev
```

Buka browser dan akses: **http://localhost:3000**

---

## 📱 Cara Pakai di HP (Mobile)

Untuk mengakses dari HP yang terhubung ke WiFi yang sama:

1. Cari IP komputer/laptop kamu:
   - **Windows**: buka cmd → ketik `ipconfig` → lihat IPv4
   - **Mac/Linux**: buka terminal → ketik `ifconfig`

2. Jalankan dev server dengan:
   ```bash
   npm run dev -- --hostname 0.0.0.0
   ```

3. Buka di browser HP: `http://192.168.X.X:3000`

---

## 🚀 Deploy ke Vercel (Gratis)

### Persiapan untuk Vercel

Karena Vercel tidak mendukung SQLite di production, ganti database ke **PostgreSQL** (gratis di Neon.tech):

1. Daftar di [neon.tech](https://neon.tech) → buat database baru → copy connection string

2. Update `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/lele_db?sslmode=require"
   ```

3. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

### Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login dan deploy
vercel

# Atau push ke GitHub dan connect di vercel.com
```

Di dashboard Vercel, tambahkan environment variable `DATABASE_URL`.

---

## 🗂 API Endpoints

| Method | Endpoint              | Keterangan             |
|--------|-----------------------|------------------------|
| GET    | /api/ponds            | Ambil semua kolam      |
| POST   | /api/ponds            | Tambah kolam baru      |
| PUT    | /api/ponds/[id]       | Update kolam           |
| DELETE | /api/ponds/[id]       | Hapus kolam            |
| POST   | /api/seeds            | Tambah data benih      |
| GET    | /api/feeds            | Ambil data pakan       |
| POST   | /api/feeds            | Tambah pakan           |
| DELETE | /api/feeds/[id]       | Hapus pakan            |
| GET    | /api/harvests         | Ambil data panen       |
| POST   | /api/harvests         | Catat panen            |
| DELETE | /api/harvests/[id]    | Hapus panen            |
| POST   | /api/expenses         | Tambah biaya           |
| DELETE | /api/expenses/[id]    | Hapus biaya            |

---

## 🧮 Rumus Perhitungan

```
Berat Bersih  = Berat Panen × (1 - Refaksi / 100)
Total Jual    = Berat Bersih × Harga per kg
Total Modal   = Biaya Benih + Biaya Pakan + Biaya Operasional
Laba Bersih   = Total Penjualan - Total Modal
ROI           = (Laba Bersih / Total Modal) × 100
FCR           = Total Pakan (kg) / Total Panen (kg)
```

---

## 🔧 Commands Lengkap

```bash
npm run dev          # Jalankan mode development
npm run build        # Build untuk production
npm run start        # Jalankan production build
npm run db:generate  # Generate Prisma client
npm run db:push      # Sinkronisasi schema ke database
npm run db:seed      # Isi data contoh
npm run db:studio    # Buka Prisma Studio (GUI database)
```

---

## 📌 Catatan Penting

- **SQLite** digunakan untuk development lokal — tidak perlu install server database
- **Prisma Studio** (`npm run db:studio`) = antarmuka visual untuk melihat/edit database
- Untuk production, gunakan **PostgreSQL** (Neon.tech, Supabase, atau Railway — semua gratis)
- User ID saat ini hardcoded `user-demo` — untuk multi-user, integrasikan dengan NextAuth.js

---

## 🤝 Pengembangan Selanjutnya

- [ ] Login/Register dengan NextAuth.js
- [ ] Push Notification jadwal pakan
- [ ] Mode Offline (PWA)
- [ ] Upload foto kolam
- [ ] Multi-user / multi-farm
- [ ] Scan nota pakan (OCR)
