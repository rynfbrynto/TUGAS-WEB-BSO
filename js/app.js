
/**
 * app.js
 * File utama untuk mengatur jalannya aplikasi katalog.
 *
 * Tugas:
 * 1. Mengambil data melalui api.js.
 * 2. Memperbarui identitas toko melalui store.js.
 * 3. Mengatur pencarian dan filter kategori.
 * 4. Menampilkan produk melalui products.js.
 * 5. Mengelola loading, error, dan kondisi produk kosong.
 */

import { fetchCatalog } from "./api.js";
import { updateStoreInfo } from "./store.js";
import { renderProducts } from "./products.js";

// Mengambil elemen HTML dari index.html.
const elements = {
  storeName: document.getElementById("store-name"),
  storeSlogan: document.getElementById("store-slogan"),
  adminWhatsApp: document.getElementById("btn-admin-wa"),
  searchInput: document.getElementById("input-search"),
  categoryFilters: document.getElementById("category-filters"),
  loadingState: document.getElementById("loading-state"),
  errorState: document.getElementById("error-state"),
  errorMessage: document.getElementById("error-message"),
  retryButton: document.getElementById("btn-retry"),
  productGrid: document.getElementById("product-grid"),
  emptyState: document.getElementById("empty-state"),
  footerYear: document.getElementById("footer-year"),
  footerStoreName: document.getElementById("footer-store-name"),
  pageTitle: document.getElementById("store-page-title")
};

// Menyimpan data katalog selama website berjalan.
let allProducts = [];
let currentStore = {};
let activeCategory = "all";

/**
 * Mengatur visibilitas elemen HTML.
 */
function showElement(element, visible, displayValue = "flex") {
  if (!element) return;

  element.style.display = visible ? displayValue : "none";
}

/**
 * Menampilkan status loading.
 */
function showLoading() {
  showElement(elements.loadingState, true);
  showElement(elements.errorState, false);
  showElement(elements.emptyState, false);
}

/**
 * Menampilkan pesan ketika terjadi kesalahan.
 */
function showError(message) {
  showElement(elements.loadingState, false);
  showElement(elements.errorState, true);
  showElement(elements.emptyState, false);

  if (elements.errorMessage) {
    elements.errorMessage.textContent =
      message ||
      "Gagal mengambil data katalog. Silakan coba lagi nanti.";
  }
}

/**
 * Membuat tombol filter berdasarkan kategori produk.
 */
function renderCategoryFilters(products) {
  if (!elements.categoryFilters) return;

  const categories = [
    ...new Set(
      products
        .map((product) => String(product?.kategori ?? "").trim())
        .filter(Boolean)
    )
  ].sort((a, b) => a.localeCompare(b, "id"));

  // Menghapus tombol kategori sebelumnya.
  elements.categoryFilters.replaceChildren();

  // Membuat tombol kategori Semua.
  const allButton = document.createElement("button");

  allButton.type = "button";
  allButton.className = "filter-btn active";
  allButton.dataset.category = "all";
  allButton.textContent = "Semua";
  allButton.setAttribute("aria-pressed", "true");

  elements.categoryFilters.appendChild(allButton);

  // Membuat tombol untuk setiap kategori unik.
  categories.forEach((category) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "filter-btn";
    button.dataset.category = category;
    button.textContent = category;
    button.setAttribute("aria-pressed", "false");

    elements.categoryFilters.appendChild(button);
  });
}

/**
 * Memfilter produk berdasarkan nama dan kategori.
 */
function getFilteredProducts() {
  const searchTerm = String(elements.searchInput?.value ?? "")
    .trim()
    .toLocaleLowerCase("id");

  return allProducts.filter((product) => {
    const productName = String(product?.nama ?? "")
      .toLocaleLowerCase("id");

    const productCategory = String(product?.kategori ?? "").trim();

    const matchesSearch = productName.includes(searchTerm);

    const matchesCategory =
      activeCategory === "all" ||
      productCategory === activeCategory;

    return matchesSearch && matchesCategory;
  });
}

/**
 * Memperbarui tampilan daftar produk.
 */
function updateProductView() {
  if (!elements.productGrid) return;

  const filteredProducts = getFilteredProducts();

  // Menampilkan produk melalui modul products.js.
  renderProducts(
    filteredProducts,
    elements.productGrid,
    currentStore.no_wa
  );

  // Menampilkan pesan jika tidak ada produk yang cocok.
  showElement(
    elements.emptyState,
    filteredProducts.length === 0
  );
}

/**
 * Mengambil data katalog dari API.
 */
async function loadCatalog() {
  showLoading();

  if (elements.retryButton) {
    elements.retryButton.disabled = true;
  }

  try {
    // Mengambil data dari Google Apps Script melalui api.js.
    const catalog = await fetchCatalog();

    currentStore = catalog.store ?? {};
    allProducts = Array.isArray(catalog.products)
      ? catalog.products
      : [];

    // Memperbarui identitas toko melalui store.js.
    updateStoreInfo(currentStore);

    // Memperbarui tahun pada footer.
    if (elements.footerYear) {
      elements.footerYear.textContent =
        String(new Date().getFullYear());
    }

    // Memastikan nama toko pada footer sesuai dengan data API.
    if (elements.footerStoreName) {
      elements.footerStoreName.textContent =
        String(currentStore.nama_toko ?? "").trim() ||
        "Katalog Toko";
    }

    // Memperbarui judul halaman browser.
    if (elements.pageTitle) {
      elements.pageTitle.textContent =
        String(currentStore.nama_toko ?? "").trim() ||
        "Katalog Toko";
    }

    // Mengembalikan pencarian dan kategori ke kondisi awal.
    activeCategory = "all";

    if (elements.searchInput) {
      elements.searchInput.value = "";
    }

    // Membuat filter kategori berdasarkan data produk.
    renderCategoryFilters(allProducts);

    // Menyembunyikan loading dan error.
    showElement(elements.loadingState, false);
    showElement(elements.errorState, false);

    // Menampilkan seluruh produk.
    updateProductView();

  } catch (error) {
    console.error("Gagal memuat katalog:", error);

    showError(
      error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat memuat katalog."
    );

  } finally {
    if (elements.retryButton) {
      elements.retryButton.disabled = false;
    }
  }
}

/**
 * Event pencarian produk secara langsung.
 */
if (elements.searchInput) {
  elements.searchInput.addEventListener(
    "input",
    updateProductView
  );
}

/**
 * Event klik tombol filter kategori.
 */
if (elements.categoryFilters) {
  elements.categoryFilters.addEventListener(
    "click",
    (event) => {
      const button = event.target.closest(
        "button[data-category]"
      );

      if (
        !button ||
        !elements.categoryFilters.contains(button)
      ) {
        return;
      }

      activeCategory = button.dataset.category || "all";

      // Memperbarui status aktif tombol kategori.
      elements.categoryFilters
        .querySelectorAll(".filter-btn")
        .forEach((filterButton) => {
          const isActive = filterButton === button;

          filterButton.classList.toggle(
            "active",
            isActive
          );

          filterButton.setAttribute(
            "aria-pressed",
            String(isActive)
          );
        });

      // Menampilkan produk sesuai kategori terpilih.
      updateProductView();
    }
  );
}

/**
 * Event tombol muat ulang ketika terjadi error.
 */
if (elements.retryButton) {
  elements.retryButton.addEventListener(
    "click",
    loadCatalog
  );
}

// Menjalankan aplikasi saat modul dimuat.
loadCatalog();
