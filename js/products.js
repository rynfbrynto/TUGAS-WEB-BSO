/**
 * products.js
 * Modul untuk merender kartu produk ke dalam elemen DOM,
 * memformat harga ke mata uang Rupiah (IDR), dan membuat link checkout WhatsApp.
 */

/**
 * Memformat nominal angka menjadi format mata uang Rupiah (IDR).
 * @param {number|string} amount
 * @returns {string}
 */
export function formatRupiah(amount) {
  const numericAmount = Number(amount) || 0;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericAmount);
}

/**
 * Membersihkan nomor HP dan menghasilkan link pemesanan WhatsApp.
 * @param {string} phone - Nomor WhatsApp toko
 * @param {string} productName - Nama produk yang dipesan
 * @param {number|string} productPrice - Harga produk
 * @returns {string} Tautan wa.me dengan pesan terformat
 */
function createWhatsAppLink(phone, productName, productPrice) {
  if (!phone) return "#";

  // Hapus karakter selain angka
  const cleanPhone = String(phone).replace(/\D/g, "");
  if (!cleanPhone) return "#";

  const formattedPrice = formatRupiah(productPrice);
  const message = `Halo, saya ingin memesan produk berikut:\n\n*Nama Produk:* ${productName}\n*Harga:* ${formattedPrice}\n\nApakah produk ini masih tersedia?`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Gambar SVG fallback jika gambar produk kosong atau gagal dimuat.
 */
const PLACEHOLDER_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="#a0aec0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`
)}`;

/**
 * Membuat elemen kartu produk (card) secara dinamis.
 * @param {Object} product - Object data produk dari API
 * @param {string} storeWa - Nomor WhatsApp admin toko
 * @returns {HTMLElement} Elemen <article> kartu produk
 */
function createProductCard(product, storeWa) {
  const card = document.createElement("article");
  card.className = "product-card";

  const productName = String(product?.nama ?? "Produk Tanpa Nama").trim();
  const productCategory = String(product?.kategori ?? "").trim();
  const productPrice = product?.harga ?? 0;
  const productDescription = String(product?.deskripsi ?? "").trim();
  const imageUrl = String(product?.gambar ?? "").trim();

  const formattedPrice = formatRupiah(productPrice);
  const waUrl = createWhatsAppLink(storeWa, productName, productPrice);

  // Container Gambar
  const imageWrapper = document.createElement("div");
  imageWrapper.className = "product-image-container";

  const img = document.createElement("img");
  img.className = "product-image";
  img.alt = productName;
  img.loading = "lazy";
  img.src = imageUrl || PLACEHOLDER_IMAGE;

  // Fallback jika URL gambar rusak / error 404
  img.onerror = () => {
    img.onerror = null;
    img.src = PLACEHOLDER_IMAGE;
  };

  imageWrapper.appendChild(img);

  // Container Informasi Produk
  const infoContainer = document.createElement("div");
  infoContainer.className = "product-info";

  // Badge Kategori (jika ada)
  if (productCategory) {
    const categoryBadge = document.createElement("span");
    categoryBadge.className = "product-category";
    categoryBadge.textContent = productCategory;
    infoContainer.appendChild(categoryBadge);
  }

  // Nama Produk
  const title = document.createElement("h3");
  title.className = "product-title";
  title.textContent = productName;
  infoContainer.appendChild(title);

  // Deskripsi Produk (jika ada)
  if (productDescription) {
    const desc = document.createElement("p");
    desc.className = "product-description";
    desc.textContent = productDescription;
    infoContainer.appendChild(desc);
  }

  // Harga Produk
  const price = document.createElement("div");
  price.className = "product-price";
  price.textContent = formattedPrice;
  infoContainer.appendChild(price);

  // Tombol Beli via WhatsApp
  const buyButton = document.createElement("a");
  buyButton.className = "btn btn-buy";
  buyButton.href = waUrl;
  buyButton.target = "_blank";
  buyButton.rel = "noopener noreferrer";
  buyButton.innerHTML = `
    <svg class="icon-wa" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
    <span>Beli via WhatsApp</span>
  `;
  infoContainer.appendChild(buyButton);

  card.appendChild(imageWrapper);
  card.appendChild(infoContainer);

  return card;
}

/**
 * Menampilkan seluruh daftar produk yang sudah difilter ke dalam DOM kontainer.
 * @param {Array} products - Array daftar produk
 * @param {HTMLElement} container - Elemen grid tempat produk ditampilkan
 * @param {string} storeWa - Nomor WhatsApp admin toko
 */
export function renderProducts(products, container, storeWa) {
  if (!container) return;

  // Hapus semua elemen sebelumnya
  container.replaceChildren();

  if (!Array.isArray(products) || products.length === 0) {
    return;
  }

  // Gunakan DocumentFragment untuk optimasi performa rendering DOM
  const fragment = document.createDocumentFragment();

  products.forEach((product) => {
    const productCard = createProductCard(product, storeWa);
    fragment.appendChild(productCard);
  });

  container.appendChild(fragment);
}
