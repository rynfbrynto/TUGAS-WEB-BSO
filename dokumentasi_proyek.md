# Katalog Toko Online (Serverless via Google Sheets & Apps Script)

Website katalog produk dinamis berbasis arsitektur web statis (*Jamstack*) tanpa memerlukan hosting server backend maupun database SQL berbayar. Seluruh data identitas toko dan daftar inventaris produk dikelola langsung melalui Google Sheets, disajikan dalam bentuk REST API menggunakan Google Apps Script (GAS), dan di-hosting secara publik via GitHub Pages.

🔗 **Live Demo:** belum ada

## 🚀 Fitur Utama

* **Headless CMS via Google Sheets**: Kelola katalog (tambah, perbarui, dan arsipkan produk) langsung dari lembar kerja spreadsheet tanpa perlu merilis atau build ulang repositori website.

* **REST API Serverless**: Memanfaatkan fungsi Google Apps Script Web App untuk menyediakan endpoint data JSON publik tanpa kendala CORS.

* **Pencarian & Filter Kategori Dinamis**: Ekstraksi kategori unik langsung dari data produk aktif serta fitur live search berdasarkan nama barang.

* **Direct WhatsApp Checkout**: Generator otomatis tautan WhatsApp (`wa.me`) dengan format pesan pesanan terstruktur yang memuat nama produk dan rincian harga.

* **Arsitektur Modular ES6**: Pemisahan logika kode berbasis modul JavaScript standar (`import`/`export`) yang memisahkan urusan API, perenderan DOM, format data, dan konfigurasi.

* **Fallback Resilient UI**: Mekanisme penanganan bawaan bila gambar produk kosong atau gagal dimuat, serta fallback identitas toko jika koneksi API terputus.

## 🏗️ Arsitektur Sistem

```
[ Google Sheets ] ──(SpreadsheetApp API)──> [ Google Apps Script (doGet) ]
                                                        │
                                                 (JSON Response)
                                                        │
                                                        ▼
[ Browser / Client ] <───────(fetch API)─────── [ js/api.js ]
         │
         ├──> js/store.js     (Render Brand, Info Toko, & Footer)
         ├──> js/products.js  (Render Grid Kartu & Format IDR)
         └──> js/whatsapp.js  (Generator Link & Pesan WhatsApp)

```

## 📡 Spesifikasi API (Google Apps Script)

Endpoint backend diakses menggunakan protokol HTTP `GET` publik:

* **Method**: `GET`

* **Format URL**: `https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec`

* **Content-Type**: `application/json`

### Contoh Format Output JSON

```
{
  "status": "success",
  "store": {
    "nama_toko": "Trianggoro Store",
    "slogan": "Katalog Produk Pilihan Berkualitas",
    "no_wa": "6281234567890"
  },
  "products": [
    {
      "id": 1,
      "nama": "Kaos Polos Hitam",
      "kategori": "Pakaian",
      "harga": 75000,
      "gambar": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500",
      "deskripsi": "Bahan katun combed 30s adem dan nyaman dipakai",
      "status": "aktif"
    },
    {
      "id": 2,
      "nama": "Hoodie Casual Navy",
      "kategori": "Pakaian",
      "harga": 165000,
      "gambar": "",
      "deskripsi": "Hoodie katun fleece tebal dan lembut",
      "status": "aktif"
    }
  ]
}

```

> **Catatan**: Data baris pada tab `Produk` dengan status selain `aktif` akan otomatis disaring oleh Apps Script sehingga tidak dikirim ke sisi publik frontend.

## 🗄️ Struktur Database (Google Sheets)

Database menggunakan satu buku kerja (*workbook*) Google Sheets dengan dua lembar tab kerja:

### 1. Tab `Pengaturan`

Menyimpan konfigurasi identitas toko (format pasangan kunci-nilai):

| Kolom A (Key) | Kolom B (Value) | Keterangan | 
| ----- | ----- | ----- | 
| `nama_toko` | Trianggoro Store | Nama toko yang ditampilkan pada header & footer | 
| `slogan` | Katalog Produk Pilihan Berkualitas | Tagline atau deskripsi singkat toko | 
| `no_wa` | 6281234567890 | Nomor WhatsApp toko diawali kode negara (62) | 

### 2. Tab `Produk`

Menyimpan daftar produk katalog toko:

| Kolom | Tipe Data | Deskripsi | Contoh | 
| ----- | ----- | ----- | ----- | 
| `id` | Angka / Teks | Identifier unik produk | `1` | 
| `nama` | Teks | Nama lengkap barang | `Kaos Polos Hitam` | 
| `kategori` | Teks | Kategori untuk pengelompokan | `Pakaian` | 
| `harga` | Angka | Nominal harga (angka murni tanpa titik/Rp) | `75000` | 
| `gambar` | URL | Tautan langsung gambar produk (bisa dikosongkan) | `https://...` | 
| `deskripsi` | Teks | Rincian spesifikasi barang | `Bahan katun combed 30s` | 
| `status` | Teks | Status ketersediaan (`aktif` / `nonaktif`) | `aktif` | 

## 📁 Struktur Direktori Repositori

```
TUGAS/
├── css/
│   ├── responsive.css       # Media queries tampilan layar ponsel dan tablet
│   └── style.css            # Styling komponen UI, grid kartu, tombol, dan tema
├── gas/
│   └── Code.gs              # Kode backend Google Apps Script
├── js/
│   ├── api.js               # Pengelola request HTTP fetch & error handling
│   ├── app.js               # File orkestrator utama & event listener filter
│   ├── config.js            # Penyimpan URL API Apps Script & fallback defaults
│   ├── products.js          # Generator markup DOM produk & format mata uang IDR
│   ├── store.js             # Updater informasi identitas toko pada halaman
│   └── whatsapp.js          # Generator tautan transaksi chat WhatsApp
├── index.html               # Halaman utama aplikasi katalog web
└── README.md                # Dokumentasi teknis proyek

```

## ⚙️ Panduan Setup & Konfigurasi

### 1. Kloning Repositori

```
git clone https://github.com/ixroo/TUGAS.git
cd TUGAS

```

### 2. Konfigurasi Spreadsheet & Deployment Apps Script

1. Buka Google Sheets dan siapkan dua tab bernama `Pengaturan` dan `Produk` sesuai format tabel database di atas.

2. Buka menu **Ekstensi** > **Apps Script**.

3. Tempel seluruh kode dari file `gas/Code.gs` ke editor Apps Script.

4. Klik tombol **Deploy** > **Deployment baru**.

5. Pilih jenis **Aplikasi web** (*Web app*):

   * **Jalankan sebagai**: `Saya (Me)`

   * **Yang memiliki akses**: `Siapa saja (Anyone)`

6. Klik **Deploy**, selesaikan perizinan akun Google (*Review Permissions* > *Advanced* > *Allow*), lalu salin URL Web App yang berakhiran `/exec`.

### 3. Konfigurasi Endpoint Frontend

Buka file `js/config.js` dan tempelkan URL Web App yang sudah didapatkan:

```
export const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycb.../exec',
  // ...
};

```

### ✅ Siap Dideploy & Digunakan

Setelah nilai `API_URL` dikonfigurasi, seluruh sistem katalog sudah terhubung penuh ke Google Sheets dan **siap dideploy atau dijalankan** di platform hosting web statis mana pun (seperti GitHub Pages, Cloudflare Pages, Vercel, maupun Netlify).