# 🏆 Tarik Tambang — Media Pembelajaran Interaktif v2.0

Game edukasi dua tim berbasis Tarik Tambang. Siap deploy ke Vercel.

---

## 🚀 Deploy ke Vercel (Cara Termudah)

### Opsi A — Via GitHub (Recommended)
```bash
git init
git add .
git commit -m "Tarik Tambang v2.0"
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```
Lalu di [vercel.com](https://vercel.com): **New Project** → Import repo → **Deploy**.  
✅ Tidak perlu konfigurasi apapun — Vercel otomatis detect Vite.

### Opsi B — Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

---

## 💻 Jalankan Lokal
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # Build produksi ke /dist
```

---

## 🗄️ Setup Database Supabase (Opsional)

Tanpa database, data tersimpan di **localStorage browser** (langsung jalan).  
Dengan Supabase → data tersinkron antar perangkat.

### 1. Buat tabel di Supabase SQL Editor:
```sql
CREATE TABLE game_data (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE game_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_access" ON game_data FOR ALL USING (true) WITH CHECK (true);
```

### 2. Set environment variables di Vercel:
```
VITE_SUPABASE_URL      = https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY = eyJxxxx...
SUPABASE_URL           = https://xxxx.supabase.co
SUPABASE_ANON_KEY      = eyJxxxx...
```
*(Vercel: Project Settings → Environment Variables → redeploy)*

---

## 🔑 Akun Guru Default

| ID      | Password  | Mata Pelajaran  | Soal |
|---------|-----------|-----------------|------|
| `bj`    | `bj123`   | Bahasa Jawa     | 12   |
| `math`  | `math123` | Matematika      | 7    |
| `ipa`   | `ipa123`  | IPA             | 6    |
| `ips`   | `ips123`  | IPS             | 6    |
| `bing`  | `bing123` | Bahasa Inggris  | 4    |
| `admin` | `admin123`| Admin Panel     | —    |

---

## 🎮 Cara Bermain

| Mode       | Tim A 🦁        | Tim B 🦅           |
|------------|-----------------|-------------------|
| Desktop    | Tekan `1/2/3/4` | Klik tombol layar  |
| Mobile     | Tombol kiri     | Tombol kanan       |
| 2 HP/Tablet| HP kiri         | HP kanan           |

- Jawaban benar → poin +1 & tali bergeser
- Target default: 7 poin (ubah di Admin Panel)
- Musik latar: klik 🔊 di header

---

## 🔧 Struktur Project
```
tarik-tambang-v2/
├── api/
│   └── teachers.js        # Vercel API route (Supabase)
├── src/
│   ├── App.jsx            # Seluruh game logic & UI
│   ├── storage.js         # localStorage + Supabase layer
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── vercel.json            # Konfigurasi Vercel
├── .env.example           # Template environment variables
└── package.json
```
