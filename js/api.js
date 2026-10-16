
/**
 * api.js
 * Mengambil data katalog dari Google Apps Script (GAS).
 */

import { CONFIG } from "./config.js";

/**
 * Mengambil identitas toko dan daftar produk dari API.
 */
export async function fetchCatalog() {
  const apiUrl = CONFIG?.API_URL;

  // Periksa konfigurasi URL API.
  if (
    typeof apiUrl !== "string" ||
    apiUrl.trim() === "" ||
    apiUrl.includes("AKfycb...")
  ) {
    throw new Error(
      "URL API belum dikonfigurasi. Periksa nilai API_URL di js/config.js."
    );
  }

  let response;

  // Mengirim request ke Google Apps Script.
  try {
    response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      cache: "no-store"
    });
  } catch (error) {
    throw new Error(
      "Tidak dapat terhubung ke API katalog. Periksa koneksi internet dan URL deployment Apps Script."
    );
  }

  // Memeriksa apakah request berhasil.
  if (!response.ok) {
    throw new Error(
      `Request API gagal dengan HTTP ${response.status} (${response.statusText}).`
    );
  }

  let data;

  // Membaca respons dalam format JSON.
  try {
    data = await response.json();
  } catch (error) {
    throw new Error(
      "Respons API tidak dapat dibaca sebagai JSON. Periksa deployment Google Apps Script."
    );
  }

  // Memeriksa status respons dari Code.gs.
  if (!data || data.status !== "success") {
    const apiMessage =
      typeof data?.message === "string" && data.message.trim()
        ? data.message
        : "API tidak mengembalikan status success.";

    throw new Error(`API katalog bermasalah: ${apiMessage}`);
  }

  // Memvalidasi struktur data toko.
  if (
    typeof data.store !== "object" ||
    data.store === null ||
    Array.isArray(data.store)
  ) {
    throw new Error("Format data toko dari API tidak valid.");
  }

  // Memvalidasi daftar produk.
  if (!Array.isArray(data.products)) {
    throw new Error("Format daftar produk dari API tidak valid.");
  }

  // Mengembalikan data yang dibutuhkan frontend.
  return {
    store: data.store,
    products: data.products,
    timestamp: data.timestamp
  };
}
