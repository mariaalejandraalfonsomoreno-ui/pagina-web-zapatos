// ============================================================
//  CONFIGURACIÓN — edita esta línea con tu número de WhatsApp
//  Formato: código de país + número, sin espacios ni "+"
//  Ejemplo Colombia: "573001234567"
// ============================================================
const WHATSAPP_NUMBER = "573000000000";

// ---------- Estado ----------
let cart = JSON.parse(localStorage.getItem("lumina_cart") || "[]");
let activeFilter = "todos";
let modalProduct = null;

// ---------- Formato de precio ----------
function formatPrice(n) {
  return "$" + n.toLocaleString("es-CO");
}

// ---------- Render del catálogo ----------
function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  const list = PRODUCTS.filter(
    (p) => activeFilter === "todos" || p.category === activeFilter
  );

  list.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image"><img src="${p.image}" alt="${p.name}"></div>
      <div class="product-info">
        <div class="product-tag">${p.category === "samba" ? "Samba" : "Superstar"}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-price">${formatPrice(p.price)}</div>
      </div>
    `;
    card.addEventListener("click", () => openModal(p));
    grid.appendChild(card);
  });
}

// ---------- Filtros ----------
document.getElementById("filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-chip");
  if (!btn) return;
  document.querySelectorAll(".filter-chip").forEach((b) => b.classList.remove("is-active"));
  btn.classList.add("is-active");
  activeFilter = btn.dataset.filter;
  renderProducts();
});

// ---------- Modal de talla/color ----------
const modalOverlay = document.getElementById("modalOverlay");

function openModal(product) {
  modalProduct = product;
  document.getElementById("modalImage").src = product.image;
  document.getElementById("modalImage").alt = product.name;
  document.getElementById("modalName").textContent = product.name;
  document.getElementById("modalPrice").textContent = formatPrice(product.price);

  const sizeSelect = document.getElementById("modalSize");
  sizeSelect.innerHTML = product.sizes.map((s) => `<option value="${s}">${s}</option>`).join("");

  const colorSelect = document.getElementById("modalColor");
  colorSelect.innerHTML = product.colors.map((c) => `<option value="${c}">${c}</option>`).join("");

  modalOverlay.classList.add("is-open");
}

document.getElementById("modalClose").addEventListener("click", () => {
  modalOverlay.classList.remove("is-open");
});
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) modalOverlay.classList.remove("is-open");
});

document.getElementById("modalAdd").addEventListener("click", () => {
  const size = document.getElementById("modalSize").value;
  const color = document.getElementById("modalColor").value;
  addToCart(modalProduct, size, color);
  modalOverlay.classList.remove("is-open");
  openCart();
});

// ---------- Carrito ----------
function saveCart() {
  localStorage.setItem("lumina_cart", JSON.stringify(cart));
}

function addToCart(product, size, color) {
  const key = `${product.id}-${size}-${color}`;
  const existing = cart.find((i) => i.key === key);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      key,
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      size,
      color,
      qty: 1
    });
  }
  saveCart();
  renderCart();
}

function changeQty(key, delta) {
  const item = cart.find((i) => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.key !== key);
  }
  saveCart();
  renderCart();
}

function removeItem(key) {
  cart = cart.filter((i) => i.key !== key);
  saveCart();
  renderCart();
}

function renderCart() {
  const itemsEl = document.getElementById("cartItems");
  const emptyEl = document.getElementById("cartEmpty");
  const totalEl = document.getElementById("cartTotal");
  const countEl = document.getElementById("cartCount");
  const checkoutBtn = document.getElementById("checkoutBtn");

  itemsEl.innerHTML = "";

  if (cart.length === 0) {
    itemsEl.appendChild(emptyEl);
    checkoutBtn.disabled = true;
  } else {
    checkoutBtn.disabled = false;
    cart.forEach((item) => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-meta">Talla ${item.size} · ${item.color}</div>
          <div class="cart-item-row">
            <div class="qty-controls">
              <button data-action="dec">−</button>
              <span>${item.qty}</span>
              <button data-action="inc">+</button>
            </div>
            <strong>${formatPrice(item.price * item.qty)}</strong>
          </div>
          <button class="remove-item" data-action="remove">Quitar</button>
        </div>
      `;
      row.querySelector('[data-action="inc"]').addEventListener("click", () => changeQty(item.key, 1));
      row.querySelector('[data-action="dec"]').addEventListener("click", () => changeQty(item.key, -1));
      row.querySelector('[data-action="remove"]').addEventListener("click", () => removeItem(item.key));
      itemsEl.appendChild(row);
    });
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  totalEl.textContent = formatPrice(total);
  countEl.textContent = count;
}

// ---------- Abrir/cerrar carrito ----------
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");

function openCart() {
  cartDrawer.classList.add("is-open");
  cartOverlay.classList.add("is-open");
}
function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartOverlay.classList.remove("is-open");
}

document.getElementById("cartToggle").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// ---------- Checkout por WhatsApp ----------
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) return;

  let message = "¡Hola Lumina! Quiero hacer este pedido:\n\n";
  cart.forEach((item) => {
    message += `• ${item.name} — Talla ${item.size}, ${item.color} — x${item.qty} — ${formatPrice(item.price * item.qty)}\n`;
  });
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  message += `\nTotal: ${formatPrice(total)}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
});

// ---------- Inicio ----------
renderProducts();
renderCart();
