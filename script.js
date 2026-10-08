
const products = [
  {
    id: 1,
    name: "هاتف Galaxy S26 Ultra",
    category: "phones",
    icon: "📱",
    price: 249999,
    description: "هاتف قوي بكاميرا متقدمة وشاشة عالية الدقة."
  },
  {
    id: 2,
    name: "لابتوب للعمل والدراسة",
    category: "laptops",
    icon: "💻",
    price: 119999,
    description: "أداء ممتاز وبطارية مناسبة للعمل والدراسة."
  },
  {
    id: 3,
    name: "سماعات لاسلكية",
    category: "audio",
    icon: "🎧",
    price: 8999,
    description: "صوت نقي وبطارية تدوم طوال اليوم."
  },
  {
    id: 4,
    name: "شاحن سريع USB-C",
    category: "accessories",
    icon: "🔌",
    price: 3499,
    description: "شاحن سريع للهواتف والأجهزة الحديثة."
  },
  {
    id: 5,
    name: "ساعة ذكية رياضية",
    category: "watches",
    icon: "⌚",
    price: 12999,
    description: "ساعة ذكية لمتابعة النشاط اليومي."
  }
];

let selectedCategory = "all";
let cart = JSON.parse(localStorage.getItem("alamCart") || "[]");
const productsContainer = document.getElementById("productsContainer");
const noResults = document.getElementById("noResults");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const emptyCart = document.getElementById("emptyCart");
const cartTotal = document.getElementById("cartTotal");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");

function formatPrice(price) {
  return price.toLocaleString("fr-FR") + " دج";
}

function getCategoryName(category) {
  const names = {
    phones: "هواتف",
    laptops: "لابتوبات",
    audio: "صوتيات",
    accessories: "إكسسوارات",
    watches: "ساعات"
  };

  return names[category] || "منتجات";
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      selectedCategory === "all" ||
      product.category === selectedCategory;

    const searchMatch =
      query === "" ||
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);

    return categoryMatch && searchMatch;
  });

  productsContainer.innerHTML = "";

  noResults.style.display =
    filteredProducts.length === 0 ? "block" : "none";

  filteredProducts.forEach((product) => {
    const card = document.createElement("article");

    card.className = "product-card";

    card.innerHTML = `
      <div class="product-art">${product.icon}</div>

      <div class="product-info">
        <small>${getCategoryName(product.category)}</small>
        <h3>${product.name}</h3>
        <p>${product.description}</p>

        <div class="product-bottom">
          <span class="price">${formatPrice(product.price)}</span>
          <button class="add-button" data-id="${product.id}">
            أضف للسلة
          </button>
        </div>
      </div>
    `;

    productsContainer.appendChild(card);
  });

  document.querySelectorAll(".add-button").forEach((button) => {
    button.addEventListener("click", () => {
      addToCart(Number(button.dataset.id));
    });
  });
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return;
  }

  const existingProduct = cart.find((item) => item.id === productId);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  localStorage.setItem("alamCart", JSON.stringify(cart));
  renderCart();
  openCartPanel();
}

function renderCart() {
  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  cartCount.textContent = totalItems;
  cartTotal.textContent = formatPrice(totalPrice);

  cartItems.innerHTML = "";

  emptyCart.style.display =
    cart.length === 0 ? "block" : "none";

  cart.forEach((item) => {
    const row = document.createElement("div");

    row.className = "cart-item";

    row.innerHTML = `
      <div>
        <strong>${item.icon} ${item.name}</strong>
        <small>${item.quantity} × ${formatPrice(item.price)}</small>
      </div>

      <button class="remove-button" data-id="${item.id}">
        حذف
      </button>
    `;

    cartItems.appendChild(row);
  });

  document.querySelectorAll(".remove-button").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number(button.dataset.id);
      cart = cart.filter((item) => item.id !== productId);
      localStorage.setItem("alamCart", JSON.stringify(cart));
      renderCart();
    });
  });
}

function openCartPanel() {
  cartPanel.classList.add("open");
  overlay.classList.add("show");
}

function closeCartPanel() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("show");
}

document.querySelectorAll(".category-card").forEach((button) => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category || "all";
    renderProducts();
  });
});

searchInput.addEventListener("input", renderProducts);

document.getElementById("cartButton").addEventListener("click", openCartPanel);
document.getElementById("closeCart").addEventListener("click", closeCartPanel);
overlay.addEventListener("click", closeCartPanel);

renderProducts();
renderCart();
