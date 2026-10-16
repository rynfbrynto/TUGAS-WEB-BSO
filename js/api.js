/**
 * api.js
 * Mengambil data katalog dari Google Apps Script.
 */

import { CONFIG } from './config.js';

/**
 * Mengambil data toko dan daftar produk dari API.
 */
export async function fetchCatalog() {
  const apiUrl = CONFIG?.API_URL;

  // Periksa konfigurasi URL API.
  if (
    !apiUrl ||
    typeof apiUrl !== 'string' ||
    apiUrl.includes('AKfycb...')
  ) {
    throw new Error(
      'URL API belum dikonfigurasi. Periksa file js/config.js.'
    );
  }

  let response;

  // Mengirim request ke Google Apps Script.
  try {
    response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      cache: 'no-store'
    });
  } catch (error) {
    throw new Error(
      'Gagal terhubung ke API. Periksa koneksi internet dan URL API.',
      { cause: error }
    );
  }

  // Memeriksa status respons HTTP.
  if (!response.ok) {
    throw new Error(
      `Permintaan API gagal: HTTP ${response.status}.`
    );
  }

  // Mengubah respons menjadi objek JavaScript.
  let data;

  try {
    data = await response.json();
  } catch (error) {
    throw new Error(
      'Respons API bukan JSON yang valid.',
      { cause: error }
    );
  }

  // Memeriksa struktur data utama.
  if (
    !data ||
    typeof data !== 'object' ||
    Array.isArray(data)
  ) {
    throw new Error('Format respons API tidak valid.');
  }

  if (data.status && data.status !== 'success') {
    throw new Error(
      'API mengembalikan status selain success.'
    );
  }

  if (
    !data.store ||
    typeof data.store !== 'object' ||
    Array.isArray(data.store)
  ) {
    throw new Error('Data identitas toko tidak ditemukan.');
  }

  if (!Array.isArray(data.products)) {
    throw new Error('Format daftar produk tidak valid.');
  }

  // Data siap digunakan oleh modul lain.
  return {
    store: data.store,
    products: data.products
  };
}
