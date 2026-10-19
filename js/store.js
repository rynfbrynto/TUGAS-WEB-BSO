/**
 * store.js
 * Modul untuk memperbarui informasi identitas toko pada halaman web.
 */

/**
 * Membersihkan nomor telepon dan membentuk link WhatsApp untuk kontak admin.
 * @param {string} phone - Nomor WhatsApp admin toko
 * @returns {string} Tautan wa.me terformat
 */
function createAdminWaLink(phone) {
  if (!phone) return "#";

  // Membersihkan karakter selain angka
  const cleanPhone = String(phone).replace(/\D/g, "");
  if (!cleanPhone) return "#";

  const message = "Halo Admin, saya ingin bertanya mengenai produk di toko Anda.";
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Memperbarui komponen identitas toko pada DOM berdasarkan data dari API.
 * @param {Object} store - Object berisi informasi toko (nama_toko, slogan, no_wa)
 */
export function updateStoreInfo(store = {}) {
  if (typeof store !== "object" || store === null) {
    store = {};
  }

  // Ambil data toko dengan fallback nilai default
  const storeName = String(store.nama_toko ?? "").trim() || "Katalog Toko";
  const storeSlogan = String(store.slogan ?? "").trim() || "Selamat datang di katalog online kami";
  const storePhone = store.no_wa;

  // 1. Perbarui Nama Toko di Header
  const storeNameEl = document.getElementById("store-name");
  if (storeNameEl) {
    storeNameEl.textContent = storeName;
  }

  // 2. Perbarui Slogan Toko di Header
  const storeSloganEl = document.getElementById("store-slogan");
  if (storeSloganEl) {
    storeSloganEl.textContent = storeSlogan;
  }

  // 3. Perbarui Tombol Admin WhatsApp di Header
  const adminWaBtn = document.getElementById("btn-admin-wa");
  if (adminWaBtn) {
    const waUrl = createAdminWaLink(storePhone);
    adminWaBtn.href = waUrl;

    // Sembunyikan tombol jika nomor WhatsApp tidak valid atau kosong
    if (waUrl === "#") {
      adminWaBtn.style.display = "none";
    } else {
      adminWaBtn.style.display = "inline-flex";
    }
  }
}
