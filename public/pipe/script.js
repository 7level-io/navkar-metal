const products = {
  pipe: {
    square: [
      {
        name: "Square Pipe 1x1",
        sizeIn: "1 x 1",
        sizeMm: "25 x 25",
        weight: 2.2,
      },
      {
        name: "Square Pipe 1x1",
        sizeIn: "1 x 1",
        sizeMm: "25 x 25",
        weight: 3.1,
        extra: "(Heavy)",
      },
      {
        name: "Square Pipe 1.5x1.5",
        sizeIn: "1.5 x 1.5",
        sizeMm: "38 x 38",
        weight: 4.8,
      },
      {
        name: "Square Pipe 2x2",
        sizeIn: "2 x 2",
        sizeMm: "50 x 50",
        weight: 5.6,
      },
      {
        name: "Square Pipe 2x2",
        sizeIn: "2 x 2",
        sizeMm: "50 x 50",
        weight: 8.0,
        extra: "(Heavy)",
      },
      {
        name: "Square Pipe 2.5x2.5",
        sizeIn: "2.5 x 2.5",
        sizeMm: "64 x 64",
        weight: 10.2,
      },
      {
        name: "Square Pipe 3x3",
        sizeIn: "3 x 3",
        sizeMm: "75 x 75",
        weight: 12.8,
      },
    ],
    rectangle: [
      {
        name: "Rectangle Pipe 1x2",
        sizeIn: "1 x 2",
        sizeMm: "25 x 50",
        weight: 3.3,
      },
      {
        name: "Rectangle Pipe 1x2",
        sizeIn: "1 x 2",
        sizeMm: "25 x 50",
        weight: 4.6,
        extra: "(Heavy)",
      },
      {
        name: "Rectangle Pipe 1.5x3",
        sizeIn: "1.5 x 3",
        sizeMm: "38 x 75",
        weight: 6.2,
      },
      {
        name: "Rectangle Pipe 2x3",
        sizeIn: "2 x 3",
        sizeMm: "50 x 75",
        weight: 8.4,
      },
      {
        name: "Rectangle Pipe 2x4",
        sizeIn: "2 x 4",
        sizeMm: "50 x 100",
        weight: 10.5,
      },
      {
        name: "Rectangle Pipe 2x4",
        sizeIn: "2 x 4",
        sizeMm: "50 x 100",
        weight: 14.2,
        extra: "(Heavy)",
      },
      {
        name: "Rectangle Pipe 3x4",
        sizeIn: "3 x 4",
        sizeMm: "75 x 100",
        weight: 16.8,
      },
    ],
    round: [
      { name: "Round Pipe 1in", sizeIn: "1", sizeMm: "25", weight: 1.8 },
      {
        name: "Round Pipe 1in",
        sizeIn: "1",
        sizeMm: "25",
        weight: 2.5,
        extra: "(Heavy)",
      },
      { name: "Round Pipe 1.5in", sizeIn: "1.5", sizeMm: "38", weight: 3.6 },
      { name: "Round Pipe 2in", sizeIn: "2", sizeMm: "50", weight: 4.8 },
      {
        name: "Round Pipe 2in",
        sizeIn: "2",
        sizeMm: "50",
        weight: 6.2,
        extra: "(Heavy)",
      },
      { name: "Round Pipe 2.5in", sizeIn: "2.5", sizeMm: "64", weight: 7.8 },
      { name: "Round Pipe 3in", sizeIn: "3", sizeMm: "75", weight: 9.5 },
    ],
  },
  angle: [
    {
      name: "Angle 1x1x1/8",
      sizeIn: "1 x 1 x 1/8",
      sizeMm: "25 x 25 x 3",
      weight: 0.9,
    },
    {
      name: "Angle 1.5x1.5x1/8",
      sizeIn: "1.5 x 1.5 x 1/8",
      sizeMm: "38 x 38 x 3",
      weight: 1.4,
    },
    {
      name: "Angle 2x2x1/8",
      sizeIn: "2 x 2 x 1/8",
      sizeMm: "50 x 50 x 3",
      weight: 1.9,
    },
    {
      name: "Angle 2x2x3/16",
      sizeIn: "2 x 2 x 3/16",
      sizeMm: "50 x 50 x 5",
      weight: 2.8,
    },
    {
      name: "Angle 2.5x2.5x1/4",
      sizeIn: "2.5 x 2.5 x 1/4",
      sizeMm: "64 x 64 x 6",
      weight: 4.5,
    },
    {
      name: "Angle 3x3x1/4",
      sizeIn: "3 x 3 x 1/4",
      sizeMm: "75 x 75 x 6",
      weight: 5.4,
    },
    {
      name: "Angle 4x4x1/4",
      sizeIn: "4 x 4 x 1/4",
      sizeMm: "100 x 100 x 6",
      weight: 7.2,
    },
  ],
  flat: [
    { name: "Flat Bar 3x25", sizeIn: "1/8 x 1", sizeMm: "3 x 25", weight: 0.6 },
    { name: "Flat Bar 6x25", sizeIn: "1/4 x 1", sizeMm: "6 x 25", weight: 1.3 },
    { name: "Flat Bar 6x50", sizeIn: "1/4 x 2", sizeMm: "6 x 50", weight: 2.5 },
    {
      name: "Flat Bar 10x50",
      sizeIn: "3/8 x 2",
      sizeMm: "10 x 50",
      weight: 3.8,
    },
    {
      name: "Flat Bar 12x75",
      sizeIn: "1/2 x 3",
      sizeMm: "12 x 75",
      weight: 7.6,
    },
    {
      name: "Flat Bar 16x100",
      sizeIn: "5/8 x 4",
      sizeMm: "16 x 100",
      weight: 12.5,
    },
    {
      name: "Flat Bar 20x100",
      sizeIn: "3/4 x 4",
      sizeMm: "20 x 100",
      weight: 15.8,
    },
  ],
};

const element = document.querySelector('.cart-drawer');
element.style.height = `${window.innerHeight}px`;

let cart = {};
let currentUnit = "in";
let currentCartUnit = "in";

// Load cart from localStorage
function loadCart() {
  const saved = localStorage.getItem("constructionMetalsCart");
  if (saved) {
    cart = JSON.parse(saved);
    updateCartCount();
    renderCart();
  }
}

function saveCart() {
  localStorage.setItem("constructionMetalsCart", JSON.stringify(cart));
}

// Generate unique ID for cart items
function getItemId(category, subcategory, item) {
  const sub = subcategory ? `_${subcategory}` : "";
  const extra = item.extra || "";
  return `${category}${sub}_${item.sizeIn}_${item.weight}${extra}`;
}

// Render products
function renderProducts(category, subcategory = null) {
  const items = subcategory
    ? products[category][subcategory]
    : products[category];
  const tbody = document.getElementById(
    subcategory ? `${subcategory}-items` : `${category}-items`
  );

  tbody.innerHTML = items
    .map(
      (item, index) => `
                <div class="table-row">
                    <div class="table-data">${item.name}</div>
                    <div class="table-data">
                        <span class="size-display" data-size-in="${
                          item.sizeIn
                        }" data-size-mm="${item.sizeMm}">
                            ${currentUnit === "in" ? item.sizeIn : item.sizeMm}
                        </span>
                        ${
                          item.extra
                            ? `<span style="color: #666; font-size: 13px;"> ${item.extra}</span>`
                            : ""
                        }
                    </div>
                    <div class="table-data">${item.weight}</div>
                    <div class="table-data">
                        <div class="qty-control">
                            <button class="qty-btn" onclick="decrementQty('${category}', '${subcategory}', ${index})">−</button>
                            <input type="number" class="qty-input w-12" id="qty-${category}-${subcategory}-${index}" value="0" min="0" onchange="updateQty('${category}', '${subcategory}', ${index}, this.value)">
                            <button class="qty-btn" onclick="incrementQty('${category}', '${subcategory}', ${index})">+</button>
                        </div>
                    </div>
                </div>
            `
    )
    .join("");

  updateAddButtonState(category);
}

// Quantity controls
function incrementQty(category, subcategory, index) {
  const input = document.getElementById(
    `qty-${category}-${subcategory}-${index}`
  );
  input.value = parseInt(input.value) + 1;
  updateInputStyle(input);
  updateAddButtonState(category);
}

function decrementQty(category, subcategory, index) {
  const input = document.getElementById(
    `qty-${category}-${subcategory}-${index}`
  );
  if (parseInt(input.value) > 0) {
    input.value = parseInt(input.value) - 1;
    updateInputStyle(input);
    updateAddButtonState(category);
  }
}

function updateQty(category, subcategory, index, value) {
  const input = document.getElementById(
    `qty-${category}-${subcategory}-${index}`
  );
  input.value = Math.max(0, parseInt(value) || 0);
  updateInputStyle(input);
  updateAddButtonState(category);
}

function updateInputStyle(input) {
  if (parseInt(input.value) > 0) {
    input.classList.add("has-value");
  } else {
    input.classList.remove("has-value");
  }
}

function updateAddButtonState(category) {
  const btn = document.getElementById(`${category}-add-btn`);
  const hasItems = checkHasItems(category);

  if (hasItems) {
    btn.classList.add("enabled");
  } else {
    btn.classList.remove("enabled");
  }
}

function checkHasItems(category) {
  if (category === "pipe") {
    const subcategories = ["square", "rectangle", "round"];
    return subcategories.some((sub) => {
      const items = products.pipe[sub];
      return items.some((_, index) => {
        const input = document.getElementById(`qty-pipe-${sub}-${index}`);
        return input && parseInt(input.value) > 0;
      });
    });
  } else {
    const items = products[category];
    return items.some((_, index) => {
      const input = document.getElementById(`qty-${category}-null-${index}`);
      return input && parseInt(input.value) > 0;
    });
  }
}

// Add to cart
function addToCart(category) {
  const btn = document.getElementById(`${category}-add-btn`);
  if (!btn.classList.contains("enabled")) return;

  if (category === "pipe") {
    const subcategories = ["square", "rectangle", "round"];
    subcategories.forEach((sub) => {
      const items = products.pipe[sub];
      items.forEach((item, index) => {
        const input = document.getElementById(`qty-pipe-${sub}-${index}`);
        const qty = parseInt(input.value);
        if (qty > 0) {
          const id = getItemId("pipe", sub, item);
          if (cart[id]) {
            cart[id].quantity += qty;
          } else {
            cart[id] = {
              category: "Pipe",
              subcategory: sub.charAt(0).toUpperCase() + sub.slice(1),
              ...item,
              quantity: qty,
            };
          }
          input.value = 0;
          updateInputStyle(input);
        }
      });
    });
  } else {
    const items = products[category];
    items.forEach((item, index) => {
      const input = document.getElementById(`qty-${category}-null-${index}`);
      const qty = parseInt(input.value);
      if (qty > 0) {
        const id = getItemId(category, null, item);
        if (cart[id]) {
          cart[id].quantity += qty;
        } else {
          cart[id] = {
            category: category.charAt(0).toUpperCase() + category.slice(1),
            subcategory: null,
            ...item,
            quantity: qty,
          };
        }
        input.value = 0;
        updateInputStyle(input);
      }
    });
  }

  saveCart();
  updateCartCount();
  renderCart();
  updateAddButtonState(category);
}

// Update cart count
function updateCartCount() {
  const count = Object.values(cart).reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  document.getElementById("cart-count").textContent = count;
}

// Render cart
function renderCart() {
  const container = document.getElementById("cart-items");

  if (Object.keys(cart).length === 0) {
    container.innerHTML =
      '<div class="text-center py-12"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart mx-auto h-12 w-12 text-muted-foreground mb-4" aria-hidden="true"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg><p class="text-muted-foreground">Your cart is empty</p></div>';
    document.getElementById("total-items").textContent = "0";
    return;
  }

  // Group by category and subcategory
  const grouped = {};
  Object.entries(cart).forEach(([id, item]) => {
    const cat = item.category;
    if (!grouped[cat]) grouped[cat] = {};

    if (item.subcategory) {
      const sub = item.subcategory;
      if (!grouped[cat][sub]) grouped[cat][sub] = [];
      grouped[cat][sub].push({ id, ...item });
    } else {
      if (!grouped[cat].items) grouped[cat].items = [];
      grouped[cat].items.push({ id, ...item });
    }
  });

  // Sort items by size
  const sortItems = (items) => {
    return items.sort((a, b) => {
      const aNum = parseFloat(a.sizeIn.split("x")[0]);
      const bNum = parseFloat(b.sizeIn.split("x")[0]);
      return aNum - bNum;
    });
  };

  let html = "";
  Object.entries(grouped).forEach(([category, data]) => {
    html += `<div class="cart-category">
                    <div class="cart-category-title">${category}</div>`;

    if (category === "Pipe") {
      ["Square", "Rectangle", "Round"].forEach((sub) => {
        if (data[sub]) {
          html += `<div class="cart-subcategory w-100 text-center">${sub}</div>`;
          sortItems(data[sub]).forEach((item) => {
            html += renderCartItem(item);
          });
        }
      });
    } else {
      if (data.items) {
        sortItems(data.items).forEach((item) => {
          html += renderCartItem(item);
        });
      }
    }

    html += `</div>`;
  });

  container.innerHTML = html;

  const total = Object.values(cart).reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  document.getElementById("total-items").textContent = total;
}

function renderCartItem(item) {
  const size = currentCartUnit === "in" ? item.sizeIn : item.sizeMm;
  const extraText = item.extra ? ` ${item.extra}` : "";
  return `
                <div class="cart-item">
                        <div class="cart-item-size">${size}${extraText}</div>
                        <div class="cart-item-weight">${item.weight}</div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="updateCartQty('${
                          item.id
                        }', -1)">−</button>
                        <input type="number" class="cart-qty-input w-12 text-center ${
                          item.quantity > 0 ? "has-value" : ""
                        }" value="${
    item.quantity
  }" min="1" onchange="setCartQty('${item.id}', this.value)">
                        <button class="qty-btn" onclick="updateCartQty('${
                          item.id
                        }', 1)">+</button>
                        
                    </div>
                    <button data-slot="button" onclick="removeFromCart('${item.id}')" class="btn cart-item-remove inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9 rounded-md text-destructive h-6 w-6 shrink-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2 lucide-trash-2 h-3 w-3" aria-hidden="true"><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path><path d="M3 6h18"></path><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                </div>
            `;
}

// Cart item controls
function updateCartQty(id, change) {
  if (cart[id]) {
    cart[id].quantity += change;
    if (cart[id].quantity <= 0) {
      delete cart[id];
    }
    saveCart();
    updateCartCount();
    renderCart();
  }
}

function setCartQty(id, value) {
  const qty = parseInt(value);
  if (cart[id] && qty > 0) {
    cart[id].quantity = qty;
    saveCart();
    updateCartCount();
    renderCart();
  }
}

function removeFromCart(id) {
  delete cart[id];
  saveCart();
  updateCartCount();
  renderCart();
}

function toggleUnit(unit, isCart = false) {
  if (isCart) {
    currentCartUnit = unit;
    document.querySelectorAll("#cart-drawer .unit-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.unit === unit);
    });
    renderCart();
  } else {
    currentUnit = unit;
    document
      .querySelectorAll(".unit-toggle:not(#cart-drawer .unit-toggle) .unit-btn")
      .forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.unit === unit);
      });

    document.querySelectorAll(".size-display").forEach((el) => {
      el.textContent = unit === "in" ? el.dataset.sizeIn : el.dataset.sizeMm;
    });
  }
}

// Tab switching
function switchTab(tab) {
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));
  document.querySelector(`[data-tab="${tab}"]`).classList.add("active");

  document
    .querySelectorAll(".tab-content")
    .forEach((c) => c.classList.add("hidden"));
  document.getElementById(`${tab}-content`).classList.remove("hidden");
}

function switchSubTab(subtab) {
  document
    .querySelectorAll(".sub-tab")
    .forEach((t) => t.classList.remove("active"));
  document.querySelector(`[data-subtab="${subtab}"]`).classList.add("active");

  document
    .querySelectorAll(".subtab-content")
    .forEach((c) => c.classList.add("hidden"));
  document.getElementById(`${subtab}-content`).classList.remove("hidden");
}

// Cart drawer
function openCart() {
  document.getElementById("cart-overlay").classList.add("active");
  document.getElementById("cart-drawer").classList.add("active");
}

function closeCart() {
  document.getElementById("cart-overlay").classList.remove("active");
  document.getElementById("cart-drawer").classList.remove("active");
}

// Event listeners
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => switchTab(tab.dataset.tab));
});

document.querySelectorAll(".sub-tab").forEach((tab) => {
  tab.addEventListener("click", () => switchSubTab(tab.dataset.subtab));
});

document
  .querySelectorAll(".unit-toggle:not(#cart-drawer .unit-toggle) .unit-btn")
  .forEach((btn) => {
    btn.addEventListener("click", () => toggleUnit(btn.dataset.unit));
  });

document
  .getElementById("cart-unit-in")
  .addEventListener("click", () => toggleUnit("in", true));
document
  .getElementById("cart-unit-mm")
  .addEventListener("click", () => toggleUnit("mm", true));

document
  .getElementById("pipe-add-btn")
  .addEventListener("click", () => addToCart("pipe"));
document
  .getElementById("angle-add-btn")
  .addEventListener("click", () => addToCart("angle"));
document
  .getElementById("flat-add-btn")
  .addEventListener("click", () => addToCart("flat"));

function handleCheckout() {
    if (Object.keys(cart).length === 0) {
        alert('Your cart is empty!');
        return;
    }

    let message = "Enquiry List:\n\n";
    
    const grouped = {};
    Object.entries(cart).forEach(([id, item]) => {
        const cat = item.category;
        if (!grouped[cat]) grouped[cat] = {};
        
        if (item.subcategory) {
            const sub = item.subcategory;
            if (!grouped[cat][sub]) grouped[cat][sub] = [];
            grouped[cat][sub].push({ id, ...item });
        } else {
            if (!grouped[cat].items) grouped[cat].items = [];
            grouped[cat].items.push({ id, ...item });
        }
    });

    const sortItems = (items) => {
        return items.sort((a, b) => {
            const aNum = parseFloat(a.sizeIn.split('x')[0]);
            const bNum = parseFloat(b.sizeIn.split('x')[0]);
            return aNum - bNum;
        });
    };

    Object.entries(grouped).forEach(([category, data]) => {
        message += `${category}:\n`;

        if (category === 'Pipe') {
            ['Square', 'Rectangle', 'Round'].forEach(sub => {
                if (data[sub]) {
                    message += `${sub}:\n`;
                    let counter = 1;
                    sortItems(data[sub]).forEach(item => {
                        const size = currentCartUnit === 'in' ? item.sizeIn : item.sizeMm;
                        const unit = currentCartUnit === 'in' ? 'Inch' : 'mm';
                        const extra = item.extra ? ` ${item.extra}` : '';
                        message += `${counter}. ${item.name}${extra} (Size: ${size} ${unit}, Weight: ${item.weight}kg) x${item.quantity}\n`;
                        counter++;
                    });
                }
            });
        } else {
            if (data.items) {
                let counter = 1;
                sortItems(data.items).forEach(item => {
                    const size = currentCartUnit === 'in' ? item.sizeIn : item.sizeMm;
                    const unit = currentCartUnit === 'in' ? 'Inch' : 'mm';
                    const extra = item.extra ? ` ${item.extra}` : '';
                    message += `${counter}. ${item.name}${extra} (Size: ${size} ${unit}, Weight: ${item.weight}kg) x${item.quantity}\n`;
                    counter++;
                });
            }
        }
        
        message += '\n';
    });

    const encoded = encodeURIComponent(message);
    const phoneNumber = '9860140359';
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encoded}`;
    
    window.open(whatsappURL, '_blank');
}

document.getElementById("cart-btn").addEventListener("click", openCart);
document.querySelector('.checkout-btn').addEventListener('click', handleCheckout);
document.getElementById("close-cart").addEventListener("click", closeCart);
document.getElementById("cart-overlay").addEventListener("click", closeCart);

// ESC key to close cart
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCart();
});

// Initialize
renderProducts("pipe", "square");
renderProducts("pipe", "rectangle");
renderProducts("pipe", "round");
renderProducts("angle");
renderProducts("flat");
loadCart();
