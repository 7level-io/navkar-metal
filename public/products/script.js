import { products } from "../products.js";

const STATE = {
  cart: {},
  currentUnit: "mm",
};

const SELECTORS = {
  cartDrawer: ".cart-drawer",
  cartOverlay: "#cart-overlay",
  cartItems: "#cart-items",
  cartCount: "#cart-count",
  totalItems: "#total-items",
  checkoutBtn: ".checkout-btn",
  cartBtn: "#cart-btn",
  closeCart: "#close-cart",
};

const STORAGE_KEY = "constructionMetalsCart";
const WHATSAPP_NUMBER = "9860140359";

const Utils = {
  getItemId(category, subcategory, item) {
    const sub = subcategory ? `_${subcategory}` : "";
    const extra = item.extra || "";
    const identifier = item.sizeMm || item.thickness || item.sizeIn || "unknown";
    return `${category}${sub}_${identifier}_${item.weight}${extra}`;
  },

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  parseIntSafe(value, fallback = 0) {
    const parsed = parseInt(value);
    return isNaN(parsed) ? fallback : parsed;
  },

  parseFloatSafe(value, fallback = 0) {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? fallback : parsed;
  },

  getDisplaySize(item, unit) {
    if (unit === "in") {
      return item.sizeIn || item.sizeMm || item.thickness;
    }
    return item.sizeMm || item.thickness || item.sizeIn;
  },

  getNumericValue(item) {
    if (item.sizeMm) {
      const match = item.sizeMm.match(/(\d+\.?\d*)/);
      return match ? this.parseFloatSafe(match[1]) : 0;
    }
    if (item.thickness) {
      const match = item.thickness.match(/(\d+\.?\d*)/);
      return match ? this.parseFloatSafe(match[1]) : 0;
    }
    if (item.sizeIn) {
      const match = item.sizeIn.match(/(\d+\.?\d*)/);
      return match ? this.parseFloatSafe(match[1]) : 0;
    }
    return 0;
  },

  sortItems(items) {
    return items.sort((a, b) => {
      const aValue = this.getNumericValue(a);
      const bValue = this.getNumericValue(b);
      return aValue - bValue;
    });
  },

  getDisplayValueForCheckout(item, unit) {
    if (unit === "in") {
      if (item.sizeIn && !item.sizeIn.includes("&")) {
        return item.sizeIn;
      }
      return item.sizeMm || item.thickness;
    }
    return item.sizeMm || item.thickness || item.sizeIn;
  },
};

const Storage = {
  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE.cart));
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  },

  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        STATE.cart = JSON.parse(saved);
        Cart.updateCount();
        Cart.render();
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
      STATE.cart = {};
    }
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
    STATE.cart = {};
  },
};

const Products = {
  render(category, subcategory = null) {
    const items = subcategory
      ? products[category][subcategory]
      : products[category];
    
    const tableId = subcategory ? `${subcategory}-items` : `${category}-items`;
    const table = document.getElementById(tableId);
    
    if (!table) {
      console.error(`Table not found: ${tableId}`);
      return;
    }

    table.innerHTML = items.map((item, index) => 
      this.renderRow(item, index, category, subcategory)
    ).join("");

    this.updateAddButtonState(category);
  },

  renderRow(item, index, category, subcategory) {
    const displaySize = Utils.getDisplaySize(item, STATE.currentUnit);
    const extraText = item.extra 
      ? `<span style="color: #666; font-size: 13px">${item.extra}</span>` 
      : "";

    return `
      <div class="table-row" data-product-row="${category}-${subcategory}-${index}">
        <div class="table-data">${item.name}</div>
        <div class="table-data">
          <span
            class="size-display"
            data-size-in="${item.sizeIn || ''}"
            data-size-mm="${item.sizeMm || ''}"
            data-thickness="${item.thickness || ''}"
          >
            ${displaySize}
          </span>
          ${extraText}
        </div>
        <div class="table-data">${item.weight || "N/A"}</div>
        <div class="table-data">
          <div class="qty-control">
            <button
              class="qty-btn product-decrement"
              type="button"
              data-category="${category}"
              data-subcategory="${subcategory}"
              data-index="${index}"
            >
              −
            </button>
            <input
              type="number"
              class="qty-input w-12"
              id="qty-${category}-${subcategory}-${index}"
              value="0"
              min="0"
              data-category="${category}"
              data-subcategory="${subcategory}"
              data-index="${index}"
            />
            <button
              class="qty-btn product-increment"
              type="button"
              data-category="${category}"
              data-subcategory="${subcategory}"
              data-index="${index}"
            >
              +
            </button>
          </div>
        </div>
      </div>
    `;
  },

  updateQuantity(category, subcategory, index, change) {
    const input = document.getElementById(`qty-${category}-${subcategory}-${index}`);
    if (!input) return;

    const currentValue = Utils.parseIntSafe(input.value);
    const newValue = Math.max(0, currentValue + change);
    
    input.value = newValue;
    this.updateInputStyle(input);
    this.updateAddButtonState(category);
  },

  setQuantity(category, subcategory, index, value) {
    const input = document.getElementById(`qty-${category}-${subcategory}-${index}`);
    if (!input) return;

    input.value = Math.max(0, Utils.parseIntSafe(value));
    this.updateInputStyle(input);
    this.updateAddButtonState(category);
  },

  updateInputStyle(input) {
    const value = Utils.parseIntSafe(input.value);
    input.classList.toggle("has-value", value > 0);
  },

  updateAddButtonState(category) {
    const btn = document.getElementById(`${category}-add-btn`);
    if (!btn) return;

    const hasItems = this.checkHasItems(category);
    btn.classList.toggle("enabled", hasItems);
  },

  checkHasItems(category) {
    if (category === "pipe") {
      return ["square", "rectangle", "round"].some((sub) => {
        return products.pipe[sub].some((_, index) => {
          const input = document.getElementById(`qty-pipe-${sub}-${index}`);
          return input && Utils.parseIntSafe(input.value) > 0;
        });
      });
    }

    return products[category].some((_, index) => {
      const input = document.getElementById(`qty-${category}-null-${index}`);
      return input && Utils.parseIntSafe(input.value) > 0;
    });
  },

  addToCart(category) {
    const btn = document.getElementById(`${category}-add-btn`);
    if (!btn || !btn.classList.contains("enabled")) return;

    if (category === "pipe") {
      this.addPipeToCart();
    } else {
      this.addSimpleCategoryToCart(category);
    }

    Storage.save();
    Cart.updateCount();
    Cart.render();
    this.updateAddButtonState(category);
  },

  addPipeToCart() {
    ["square", "rectangle", "round"].forEach((sub) => {
      products.pipe[sub].forEach((item, index) => {
        const input = document.getElementById(`qty-pipe-${sub}-${index}`);
        const qty = Utils.parseIntSafe(input.value);
        
        if (qty > 0) {
          const id = Utils.getItemId("pipe", sub, item);
          
          if (STATE.cart[id]) {
            STATE.cart[id].quantity += qty;
          } else {
            STATE.cart[id] = {
              category: "Pipe",
              subcategory: Utils.capitalize(sub),
              ...item,
              quantity: qty,
            };
          }
          
          input.value = 0;
          this.updateInputStyle(input);
        }
      });
    });
  },

  addSimpleCategoryToCart(category) {
    products[category].forEach((item, index) => {
      const input = document.getElementById(`qty-${category}-null-${index}`);
      const qty = Utils.parseIntSafe(input.value);
      
      if (qty > 0) {
        const id = Utils.getItemId(category, null, item);
        
        if (STATE.cart[id]) {
          STATE.cart[id].quantity += qty;
        } else {
          STATE.cart[id] = {
            category: Utils.capitalize(category),
            subcategory: null,
            ...item,
            quantity: qty,
          };
        }
        
        input.value = 0;
        this.updateInputStyle(input);
      }
    });
  },
};

const Cart = {
  updateCount() {
    const count = Object.values(STATE.cart).reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const countEl = document.querySelector(SELECTORS.cartCount);
    if (countEl) countEl.textContent = count;
  },

  render() {
    const container = document.querySelector(SELECTORS.cartItems);
    if (!container) return;

    if (Object.keys(STATE.cart).length === 0) {
      container.innerHTML = this.renderEmptyCart();
      this.updateTotal(0);
      return;
    }

    const grouped = this.groupItems();
    container.innerHTML = this.renderGroupedItems(grouped);
    
    const total = Object.values(STATE.cart).reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    this.updateTotal(total);
  },

  renderEmptyCart() {
    return `
      <div class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart mx-auto h-12 w-12 text-muted-foreground mb-4">
          <circle cx="8" cy="21" r="1"></circle>
          <circle cx="19" cy="21" r="1"></circle>
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
        </svg>
        <p class="text-muted-foreground">Your cart is empty</p>
      </div>
    `;
  },

  groupItems() {
    const grouped = {};
    
    Object.entries(STATE.cart).forEach(([id, item]) => {
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

    return grouped;
  },

  renderGroupedItems(grouped) {
    let html = "";

    Object.entries(grouped).forEach(([category, data]) => {
      if (category === "Pipe") {
        html += `
        <div class="cart-category">
          <div class="cart-category-title inline-block w-100">
            <span class="cart-category-title-text">${category}</span>
            <div class="cart-unit-toggle inline-block ml-10">
              <div>
                <span class="text-muted-foreground" style="font-size: 14px; font-weight: 500">Size:</span>
                <div class="unit-toggle">
                  <button class="unit-btn active" data-unit="mm" id="cart-unit-mm">
                    mm
                  </button>
                  <button class="unit-btn" data-unit="in" id="cart-unit-in">
                    in
                  </button>
                </div>
              </div>
            </div>
          </div>`
      } else {
        html += `<div class="cart-category">
        <div class="cart-category-title">${category}</div>`;
      }
      if (category === "Pipe") {
        ["Square", "Rectangle", "Round"].forEach((sub) => {
          if (data[sub]) {
            html += `<div class="cart-subcategory w-100 text-center">${sub}</div>`;
            Utils.sortItems(data[sub]).forEach((item) => {
              html += this.renderCartItem(item);
            });
          }
        });
      } else if (data.items) {
        Utils.sortItems(data.items).forEach((item) => {
          html += this.renderCartItem(item);
        });
      }

      html += `</div>`;
    });

    return html;
  },

  renderCartItem(item) {
    const displayValue = STATE.currentUnit === "in" 
      ? (item.sizeIn && !item.sizeIn.includes("&") ? item.sizeIn : item.sizeMm || item.thickness)
      : (item.sizeMm || item.thickness);
    
    const extraText = item.extra ? ` ${item.extra}` : "";
    return `
      <div class="cart-item" data-item-id="${item.id}">
        <div class="cart-item-size" 
             data-size-in="${item.sizeIn || ''}" 
             data-size-mm="${item.sizeMm || ''}" 
             data-thickness="${item.thickness || ''}"
             data-extra="${item.extra || ''}">
          ${displayValue}${extraText}
        </div>
        <div class="cart-item-weight">${item.weight ?? "N/A"}</div>
        <div class="cart-item-controls">
          <button class="qty-btn cart-decrement" type="button">−</button>
          <input 
            type="number" 
            class="cart-qty-input w-12 text-center ${item.quantity > 0 ? "has-value" : ""}" 
            value="${item.quantity}" 
            min="1"
          />
          <button class="qty-btn cart-increment" type="button">+</button>
        </div>
        <button type="button" class="btn cart-item-remove inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 size-9 rounded-md text-destructive h-6 w-6 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3">
            <path d="M10 11v6"></path>
            <path d="M14 11v6"></path>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
            <path d="M3 6h18"></path>
            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `;
  },

  updateTotal(count) {
    const totalEl = document.querySelector(SELECTORS.totalItems);
    if (totalEl) totalEl.textContent = count;
    
    const totalWeight = Object.values(STATE.cart).reduce((sum, item) => {
      const weight = parseFloat(item.weight) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return sum + (weight * quantity);
    }, 0);
    
    const totalWeightEl = document.querySelector("#total-weight");
    if (totalWeightEl) {
      totalWeightEl.textContent = totalWeight.toFixed(2);
    }
  },

  updateQuantity(itemId, change) {
    if (!STATE.cart[itemId]) return;

    STATE.cart[itemId].quantity += change;
    
    if (STATE.cart[itemId].quantity <= 0) {
      delete STATE.cart[itemId];
    }

    Storage.save();
    this.updateCount();
    this.render();
  },

  setQuantity(itemId, value) {
    const qty = Utils.parseIntSafe(value);
    
    if (!STATE.cart[itemId] || qty <= 0) return;

    STATE.cart[itemId].quantity = qty;
    Storage.save();
    this.updateCount();
    this.render();
  },

  removeItem(itemId) {
    delete STATE.cart[itemId];
    Storage.save();
    this.updateCount();
    this.render();
  },

  open() {
    document.querySelector(SELECTORS.cartOverlay)?.classList.add("active");
    document.querySelector(SELECTORS.cartDrawer)?.classList.add("active");
  },

  close() {
    document.querySelector(SELECTORS.cartOverlay)?.classList.remove("active");
    document.querySelector(SELECTORS.cartDrawer)?.classList.remove("active");
  },
};


const UI = {
  toggleUnit(unit) {
    STATE.currentUnit = unit;

    document.querySelectorAll(".unit-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.unit === unit);
    });

    document.querySelectorAll(".size-display").forEach((el) => {
      const sizeIn = el.getAttribute("data-size-in");
      const sizeMm = el.getAttribute("data-size-mm");
      const thickness = el.getAttribute("data-thickness");

      if (unit === "in") {
        el.textContent = (sizeIn && !sizeIn.includes("&")) ? sizeIn : (sizeMm || thickness);
      } else {
        el.textContent = sizeMm || thickness || sizeIn;
      }
    });

    document.querySelectorAll(".cart-item-size").forEach((el) => {
      const sizeIn = el.getAttribute("data-size-in");
      const sizeMm = el.getAttribute("data-size-mm");
      const thickness = el.getAttribute("data-thickness");
      const extra = el.getAttribute("data-extra");
      const extraText = extra ? ` ${extra}` : "";

      let displayValue;
      if (unit === "in") {
        displayValue = (sizeIn && !sizeIn.includes("&")) ? sizeIn : (sizeMm || thickness);
      } else {
        displayValue = sizeMm || thickness || sizeIn;
      }

      el.textContent = displayValue + extraText;
    });
  },

  switchTab(tab) {
    document.querySelectorAll(".tab").forEach((t) => 
      t.classList.remove("active")
    );
    document.querySelector(`[data-tab="${tab}"]`)?.classList.add("active");

    document.querySelectorAll(".tab-content").forEach((c) => 
      c.classList.add("hidden")
    );
    document.getElementById(`${tab}-content`)?.classList.remove("hidden");
  },

  switchSubTab(subtab) {
    document.querySelectorAll(".sub-tab").forEach((t) => 
      t.classList.remove("active")
    );
    document.querySelector(`[data-subtab="${subtab}"]`)?.classList.add("active");

    document.querySelectorAll(".subtab-content").forEach((c) => 
      c.classList.add("hidden")
    );
    document.getElementById(`${subtab}-content`)?.classList.remove("hidden");
  },
};

const Checkout = {
  handle() {
    if (Object.keys(STATE.cart).length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const message = this.generateMessage();
    const encoded = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

    window.open(whatsappURL, "_blank");
  },

  generateMessage() {
    let message = "Purchase Order:\n\n";
    const grouped = Cart.groupItems();
    let grandTotalWeight = 0;

    Object.entries(grouped).forEach(([category, data]) => {
      message += `${category}:\n`;
      let categoryTotalWeight = 0;

      if (category === "Pipe") {
        ["Square", "Rectangle", "Round"].forEach((sub) => {
          if (data[sub]) {
            message += `${sub}:\n`;
            const { formattedItems, subWeight } = this.formatItems(data[sub]);
            message += formattedItems;
            message += `  Subtotal Weight (${sub}): ${subWeight.toFixed(2)} kg\n\n`;
            categoryTotalWeight += subWeight;
          }
        });
      } else if (data.items) {
        const { formattedItems, subWeight } = this.formatItems(data.items);
        message += formattedItems;
        categoryTotalWeight += subWeight;
      }

      message += `Total Weight (${category}): ${categoryTotalWeight.toFixed(2)} kg\n`;
      message += `${"=".repeat(40)}\n\n`;
      grandTotalWeight += categoryTotalWeight;
    });

    const totalItems = Object.values(STATE.cart).reduce((sum, item) => sum + item.quantity, 0);
    message += `SUMMARY:\n`;
    message += `Total Items: ${totalItems}\n`;
    message += `Total Weight: ${grandTotalWeight.toFixed(2)} kg\n`;

    return message;
  },

  formatItems(items) {
    let result = "";
    let counter = 1;
    let subWeight = 0;

    Utils.sortItems(items).forEach((item) => {
      const displayValue = item.sizeMm || item.thickness || item.sizeIn;
      // const label = item.thickness && !item.sizeIn ? "Thickness" : "Size";
      const unitLabel = "mm";
      
      const extra = item.extra ? ` ${item.extra}` : "";
      const quantity = parseInt(item.quantity) || 0;
      const weight = parseFloat(item.weight) || 0;
      const itemTotalWeight = weight * quantity;

      result += `${counter}. ${displayValue} ${unitLabel}${extra} x${quantity} | Total Item Weight: ${itemTotalWeight.toFixed(2)}\n`;
      counter++;
      
      subWeight += itemTotalWeight;
    });

    return { formattedItems: result, subWeight };
  },
};


const Events = {
  init() {
    document.addEventListener("click", (e) => {
      const target = e.target;

      if (target.classList.contains("product-increment")) {
        const { category, subcategory, index } = target.dataset;
        Products.updateQuantity(category, subcategory, parseInt(index), 1);
      }

      if (target.classList.contains("product-decrement")) {
        const { category, subcategory, index } = target.dataset;
        Products.updateQuantity(category, subcategory, parseInt(index), -1);
      }

      if (target.closest(".cart-increment")) {
        const cartItem = target.closest(".cart-item");
        if (cartItem) Cart.updateQuantity(cartItem.dataset.itemId, 1);
      }

      if (target.closest(".cart-decrement")) {
        const cartItem = target.closest(".cart-item");
        if (cartItem) Cart.updateQuantity(cartItem.dataset.itemId, -1);
      }

      if (target.closest(".cart-item-remove")) {
        const cartItem = target.closest(".cart-item");
        if (cartItem) Cart.removeItem(cartItem.dataset.itemId);
      }
    });

    document.addEventListener("change", (e) => {
      const target = e.target;

      if (target.classList.contains("qty-input") && target.dataset.category) {
        const { category, subcategory, index } = target.dataset;
        Products.setQuantity(category, subcategory, parseInt(index), target.value);
      }

      if (target.classList.contains("cart-qty-input")) {
        const cartItem = target.closest(".cart-item");
        if (cartItem) Cart.setQuantity(cartItem.dataset.itemId, target.value);
      }
    });

    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", () => UI.switchTab(tab.dataset.tab));
    });

    document.querySelectorAll(".sub-tab").forEach((tab) => {
      tab.addEventListener("click", () => UI.switchSubTab(tab.dataset.subtab));
    });

    document.querySelectorAll(".unit-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        UI.toggleUnit(btn.dataset.unit);
      });
    });

    ["pipe", "angle", "flat", "channel", "sheet"].forEach((category) => {
      const btn = document.getElementById(`${category}-add-btn`);
      if (btn) {
        btn.addEventListener("click", () => Products.addToCart(category));
      }
    });

    document.querySelector(SELECTORS.cartBtn)?.addEventListener("click", () => Cart.open());
    document.querySelector(SELECTORS.closeCart)?.addEventListener("click", () => Cart.close());
    document.querySelector(SELECTORS.cartOverlay)?.addEventListener("click", () => Cart.close());
    document.querySelector(SELECTORS.checkoutBtn)?.addEventListener("click", () => Checkout.handle());

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") Cart.close();
    });
  },
};

function init() {
  const cartDrawer = document.querySelector(SELECTORS.cartDrawer);
  if (cartDrawer) {
    cartDrawer.style.height = `${window.innerHeight}px`;
  }

  Products.render("pipe", "square");
  Products.render("pipe", "rectangle");
  Products.render("pipe", "round");
  Products.render("angle");
  Products.render("flat");
  Products.render("channel");
  Products.render("sheet");

  Storage.load();

  Events.init();
}

init();

export { STATE, Products, Cart, Storage, Checkout, Utils };