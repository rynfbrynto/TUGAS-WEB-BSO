/**
 * whatsapp.js
 * Modul terpusat untuk memformat nomor telepon dan membuat tautan WhatsApp (wa.me)
 * untuk transaksi pesanan produk maupun konsultasi ke admin[span_1](start_span)[span_1](end_span).
 */

import { formatRupiah } from "./products.js";

/**
 * Membersihkan nomor telepon agar hanya berisi karakter angka[span_2](start_span)[span_2](end_span).
 * @param {string|number} phone - Nomor WhatsApp
 * @returns {string} Nomor telepon murni angka
 */
export function cleanPhoneNumber(phone) {
  if (!phone) return "";
  
  // Hapus semua karakter selain angka
  let cleaned = String(phone).replace(/\D/g, "");

  // Mengubah awalan "08" menjadi "628" secara otomatis jika diperlukan
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  }

  return cleaned;
}

/**
 * Membuat tautan WhatsApp untuk pemesanan produk tertentu[span_3](start_span)[span_3](end_span).
 * @param {string|number} phone - Nomor WhatsApp admin/toko
 * @param {string} productName - Nama produk yang dipesan[span_4](start_span)[span_4](end_span)
 * @param {number|string} productPrice - Harga produk[span_5](start_span)[span_5](end_span)
 * @returns {string} URL wa.me lengkap dengan pesan terformat[span_6](start_span)[span_6](end_span)
 */
export function createOrderWaLink(phone, productName, productPrice) {
  const cleanPhone = cleanPhoneNumber(phone);
  if (!cleanPhone) return "#";

  const formattedName = String(productName || "Produk").trim();
  const formattedPrice = formatRupiah(productPrice);

  const message = `Halo, saya ingin memesan produk berikut:\n\n` +
                  `*Nama Produk:* ${formattedName}\n` +
                  `*Harga:* ${formattedPrice}\n\n` +
                  `Apakah produk ini masih tersedia?`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Membuat tautan WhatsApp untuk konsultasi umum/hubungi admin[span_7](start_span)[span_7](end_span)[span_8](start_span)[span_8](end_span).
 * @param {string|number} phone - Nomor WhatsApp admin toko
 * @returns {string} URL wa.me dengan pesan pembuka umum
 */
export function createAdminWaLink(phone) {
  const cleanPhone = cleanPhoneNumber(phone);
  if (!cleanPhone) return "#";

  const message = "Halo Admin, saya ingin bertanya mengenai produk di katalog toko Anda.";

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
