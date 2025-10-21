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
    const identifier =
      item.sizeMm || item.thickness || item.sizeIn || "unknown";
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

  getWeightIcons(weightCategory) {
    const iconSVG = `<svg style="width: 12px; height: 12px; display: inline-block;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor">
        <path d="M288 160C288 142.3 302.3 128 320 128C337.7 128 352 142.3 352 160C352 177.7 337.7 192 320 192C302.3 192 288 177.7 288 160zM410.5 192C414 182 416 171.2 416 160C416 107 373 64 320 64C267 64 224 107 224 160C224 171.2 225.9 182 229.5 192L207.7 192C179.4 192 154.5 210.5 146.4 237.6L66.4 504.2C64.8 509.4 64 514.8 64 520.2C64 551 89 576 119.8 576L520.2 576C551 576 576 551 576 520.2C576 514.8 575.2 509.4 573.6 504.2L493.6 237.7C485.5 210.6 460.6 192.1 432.3 192.1L410.5 192.1z"/>
      </svg>`;

    const iconCount =
      {
        light: 1,
        medium: 2,
        heavy: 3,
      }[weightCategory] || 0;

    if (iconCount === 0) return "";

    const color = {
      light: "#666",
      medium: "#444",
      heavy: "#000",
    }[weightCategory];

    return `<span style="color: ${color}; display: inline-flex; gap: 2px; align-items: center;">
    ${iconSVG.repeat(iconCount)}
  </span>`;
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

    table.innerHTML = items
      .map((item, index) => this.renderRow(item, index, category, subcategory))
      .join("");

    this.updateAddButtonState(category);
  },

  renderRow(item, index, category, subcategory) {
    const displaySize = Utils.getDisplaySize(item, STATE.currentUnit);
    const extraText = item.extra
      ? `<span style="color: #666; font-size: 13px">${item.extra}</span>`
      : "";

    const weightIcons = Utils.getWeightIcons(item.weightCategory);

    return `
      <div class="table-row" data-product-row="${category}-${subcategory}-${index}">
        <div class="table-data">
          <span
            class="size-display"
            data-size-in="${item.sizeIn || ""}"
            data-size-mm="${item.sizeMm || ""}"
            data-thickness="${item.thickness || ""}"
          >
            ${displaySize}
          </span>
          ${extraText}
        </div>
        <div class="table-data" style="display: flex;flex-direction:column; width: 3rem; text-align: center;"><span style=" align-self:center">${weightIcons}</span> <span>${
      item.weight || "N/A"
    }kg</span></div>
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

  /**
   * Updates badges on all category tabs showing item counts
   * Also shows breakdown tooltip on hover
   */
  updateTabBadges() {
    const categories = {
      pipe: ["square", "rectangle", "round"],
      angle: null,
      flat: null,
      channel: null,
      sheet: null,
    };

    Object.entries(categories).forEach(([category, subs]) => {
      let totalCount = 0;
      let breakdown = [];

      if (subs) {
        subs.forEach((sub) => {
          let subCount = 0;
          products.pipe[sub].forEach((_, index) => {
            const input = document.getElementById(`qty-pipe-${sub}-${index}`);
            const qty = Utils.parseIntSafe(input?.value);
            subCount += qty;
          });
          if (subCount > 0) {
            breakdown.push(`${Utils.capitalize(sub)}: ${subCount}`);
            totalCount += subCount;
          }
        });
      } else {
        products[category]?.forEach((_, index) => {
          const input = document.getElementById(
            `qty-${category}-null-${index}`
          );
          const qty = Utils.parseIntSafe(input?.value);
          totalCount += qty;
        });
      }

      // Update tab badge
      const tab = document.querySelector(`[data-tab="${category}"]`);
      if (!tab) return;

      let badge = tab.querySelector(".tab-badge");
      let tooltip = tab.querySelector(".tab-badge-tooltip");

      if (totalCount > 0) {
        // Create or update badge
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "tab-badge";
          tab.appendChild(badge);
        }
        badge.textContent = totalCount;

        // Create or update tooltip (for pipe only)
        if (breakdown.length > 0) {
          if (!tooltip) {
            tooltip = document.createElement("div");
            tooltip.className = "tab-badge-tooltip";
            tab.appendChild(tooltip);
          }
          tooltip.textContent = breakdown.join(" • ");
        }
      } else {
        // Remove badge and tooltip if count is 0
        badge?.remove();
        tooltip?.remove();
      }
    });

    // Also update floating button state
    this.updateFloatingButton();
  },

  /**
   * Updates floating "Add to Cart" button visibility
   */
  updateFloatingButton() {
    const floatingBtn = document.getElementById("floating-add-cart");
    if (!floatingBtn) return;

    const hasAnyItems = this.checkAnyItems();
    floatingBtn.classList.toggle("hidden", !hasAnyItems);

    // Update count on button
    if (hasAnyItems) {
      const totalCount = this.getTotalSelectedCount();
      const countSpan = floatingBtn.querySelector(".floating-cart-count");
      if (countSpan) {
        countSpan.textContent = totalCount;
      }
    }
  },

  /**
   * Checks if any items are selected across all categories
   */
  checkAnyItems() {
    const categories = ["pipe", "angle", "flat", "channel", "sheet"];

    return categories.some((category) => {
      if (category === "pipe") {
        return ["square", "rectangle", "round"].some((sub) => {
          return products.pipe[sub].some((_, index) => {
            const input = document.getElementById(`qty-pipe-${sub}-${index}`);
            return input && Utils.parseIntSafe(input.value) > 0;
          });
        });
      } else {
        return products[category]?.some((_, index) => {
          const input = document.getElementById(
            `qty-${category}-null-${index}`
          );
          return input && Utils.parseIntSafe(input.value) > 0;
        });
      }
    });
  },

  /**
   * Gets total count of selected items across all categories
   */
  getTotalSelectedCount() {
    const categories = ["pipe", "angle", "flat", "channel", "sheet"];
    let total = 0;

    categories.forEach((category) => {
      if (category === "pipe") {
        ["square", "rectangle", "round"].forEach((sub) => {
          products.pipe[sub].forEach((_, index) => {
            const input = document.getElementById(`qty-pipe-${sub}-${index}`);
            total += Utils.parseIntSafe(input?.value);
          });
        });
      } else {
        products[category]?.forEach((_, index) => {
          const input = document.getElementById(
            `qty-${category}-null-${index}`
          );
          total += Utils.parseIntSafe(input?.value);
        });
      }
    });

    return total;
  },

  updateQuantity(category, subcategory, index, change) {
    const input = document.getElementById(
      `qty-${category}-${subcategory}-${index}`
    );
    if (!input) return;

    const currentValue = Utils.parseIntSafe(input.value);
    const newValue = Math.max(0, currentValue + change);

    input.value = newValue;
    this.updateInputStyle(input);
    this.updateAddButtonState(category);
    this.updateTabBadges();
  },

  setQuantity(category, subcategory, index, value) {
    const input = document.getElementById(
      `qty-${category}-${subcategory}-${index}`
    );
    if (!input) return;

    input.value = Math.max(0, Utils.parseIntSafe(value));
    this.updateInputStyle(input);
    this.updateAddButtonState(category);
    this.updateTabBadges();
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
    this.updateTabBadges();
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

  addAllToCart() {
    ["pipe", "angle", "flat", "channel", "sheet"].forEach((category) => {
      if (category === "pipe") {
        this.addPipeToCart();
      } else {
        this.addSimpleCategoryToCart(category);
      }
    });

    Storage.save();
    Cart.updateCount();
    Cart.render();
    this.updateFloatingButton();
    this.updateTabBadges();
  },
};

const Cart = {
   updateCount() {
    const newCount = Object.values(STATE.cart).reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const countEl = document.querySelector(SELECTORS.cartCount);
    if (!countEl) return;

    const oldCount = parseInt(countEl.textContent) || 0;
    countEl.textContent = newCount;

    // Trigger pulse animation if count increased
    if (newCount > oldCount) {
      this.pulseCartBadge();
    }
  },

  /**
   * Triggers pulse animation on cart count badge
   */
  pulseCartBadge() {
    const countEl = document.querySelector(SELECTORS.cartCount);
    if (!countEl) return;

    countEl.classList.remove('pulse');
    
    // Trigger reflow to restart animation
    void countEl.offsetWidth;
    
    countEl.classList.add('pulse');
    
    setTimeout(() => {
      countEl.classList.remove('pulse');
    }, 600); // Match animation duration
  },

  /**
   * Clears all items from cart with confirmation
   * ${Object.keys(STATE.cart).length}
   **/
  clearCart() {
    this.showConfirmModal(
      "Clear Cart",
      `Are you sure you want to remove all 
      items from your cart? This action cannot be undone.`,
      () => {
        console.log(Object.keys(STATE.cart));
        STATE.cart = {};
        Storage.save();
        this.updateCount();
        this.render();
        Products.updateTabBadges();

        // Show success feedback
        this.showToast("Cart cleared successfully", "success");
      }
    );
  },

  /**
   * Shows confirmation modal
   */
  showConfirmModal(title, message, onConfirm) {
    // Create modal elements if they don't exist
    let overlay = document.getElementById("confirm-modal-overlay");
    let modal = document.getElementById("confirm-modal");

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "confirm-modal-overlay";
      overlay.className = "confirm-modal-overlay";
      document.body.appendChild(overlay);
    }

    if (!modal) {
      modal = document.createElement("div");
      modal.id = "confirm-modal";
      modal.className = "confirm-modal";
      document.body.appendChild(modal);
    }

    // Set modal content
    modal.innerHTML = `
      <h3>${title}</h3>
      <p>${message}</p>
      <div class="confirm-modal-buttons">
        <button class="confirm-btn-cancel" id="confirm-cancel">Cancel</button>
        <button class="confirm-btn-confirm" id="confirm-ok">Confirm</button>
      </div>
    `;

    // Show modal
    overlay.classList.add("active");
    modal.classList.add("active");

    // Handle cancel
    const cancelBtn = modal.querySelector("#confirm-cancel");
    const closeModal = () => {
      overlay.classList.remove("active");
      modal.classList.remove("active");
    };

    cancelBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", closeModal);

    // Handle confirm
    const confirmBtn = modal.querySelector("#confirm-ok");
    confirmBtn.addEventListener("click", () => {
      closeModal();
      onConfirm();
    });

    // ESC to cancel
    const escHandler = (e) => {
      if (e.key === "Escape") {
        closeModal();
        document.removeEventListener("keydown", escHandler);
      }
    };
    document.addEventListener("keydown", escHandler);
  },

  /**
   * Shows toast notification
   */
  showToast(message, type = "info") {
    let toast = document.getElementById("toast-notification");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast-notification";
      toast.className = "toast-notification";
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.className = `toast-notification toast-${type} active`;

    setTimeout(() => {
      toast.classList.remove("active");
    }, 3000);
  },

  render() {
    const container = document.querySelector(SELECTORS.cartItems);
    if (!container) return;

    const isEmpty = Object.keys(STATE.cart).length === 0;

    if (isEmpty) {
      container.innerHTML = this.renderEmptyCart();
      this.updateTotal(0);

      const clearBtn = document.getElementById("clear-cart-btn");
      if (clearBtn) clearBtn.disabled = true;

      container.classList.add("empty-cart");

      return;
    } else {
      container.classList.remove("empty-cart");
    }

    const grouped = this.groupItems();
    container.innerHTML = this.renderGroupedItems(grouped);

    const total = Object.values(STATE.cart).reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    this.updateTotal(total);

    const clearBtn = document.getElementById("clear-cart-btn");
    if (clearBtn) clearBtn.disabled = false;
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
          </div>`;
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
    const displayValue =
      STATE.currentUnit === "in"
        ? item.sizeIn && !item.sizeIn.includes("&")
          ? item.sizeIn
          : item.sizeMm || item.thickness
        : item.sizeMm || item.thickness;
    const weightIcons = Utils.getWeightIcons(item.weightCategory);

    const extraText = item.extra ? ` ${item.extra}` : "";
    return `
      <div class="cart-item" data-item-id="${item.id}">
        <div class="cart-item-size" 
             data-size-in="${item.sizeIn || ""}" 
             data-size-mm="${item.sizeMm || ""}" 
             data-thickness="${item.thickness || ""}"
             data-extra="${item.extra || ""}">
          ${displayValue}<span class="text-muted-foreground" style="font-size: 10px">${extraText}</span>
        </div>
        <div class="cart-item-weight" style="display:flex; flex-direction: column; justify-content: space-evenly; align-items:center;"><div>${weightIcons}</div><span style="font-size: 12px">${
      item.weight ?? "N/A"
    }kg/pc</span></div>
        <div class="cart-item-controls">
          <button class="qty-btn cart-decrement" type="button">−</button>
          <input 
            type="number" 
            class="cart-qty-input w-12 text-center ${
              item.quantity > 0 ? "has-value" : ""
            }" 
            value="${item.quantity}" 
            min="1"
          />
          <button class="qty-btn cart-increment" type="button">+</button>
        </div>
        <span class="text-center" style="color:#000">${
          item.weight * item.quantity
        }kg</span>
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
      return sum + weight * quantity;
    }, 0);

    const totalWeightEl = document.querySelector("#total-weight");
    if (totalWeightEl) {
      totalWeightEl.textContent = `${totalWeight.toFixed(2)}~`;
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

    if (window.history.state?.cartOpen !== true) {
      window.history.pushState({ cartOpen: true }, "", window.location.href);
    }
  },

  close() {
    document.querySelector(SELECTORS.cartOverlay)?.classList.remove("active");
    document.querySelector(SELECTORS.cartDrawer)?.classList.remove("active");

    if (window.history.state?.cartOpen === true) {
      window.history.back();
    }
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
        el.textContent =
          sizeIn && !sizeIn.includes("&") ? sizeIn : sizeMm || thickness;
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
        displayValue =
          sizeIn && !sizeIn.includes("&") ? sizeIn : sizeMm || thickness;
      } else {
        displayValue = sizeMm || thickness || sizeIn;
      }

      el.textContent = displayValue + extraText;
    });
  },

  switchTab(tab) {
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    document.querySelector(`[data-tab="${tab}"]`)?.classList.add("active");

    document
      .querySelectorAll(".tab-content")
      .forEach((c) => c.classList.add("hidden"));
    document.getElementById(`${tab}-content`)?.classList.remove("hidden");
  },

  switchSubTab(subtab) {
    document
      .querySelectorAll(".sub-tab")
      .forEach((t) => t.classList.remove("active"));
    document
      .querySelector(`[data-subtab="${subtab}"]`)
      ?.classList.add("active");

    document
      .querySelectorAll(".subtab-content")
      .forEach((c) => c.classList.add("hidden"));
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
            message += `  Subtotal Weight (${sub}): ${subWeight.toFixed(
              2
            )}! kg\n\n`;
            categoryTotalWeight += subWeight;
          }
        });
      } else if (data.items) {
        const { formattedItems, subWeight } = this.formatItems(data.items);
        message += formattedItems;
        categoryTotalWeight += subWeight;
      }

      message += `Total Weight (${category}): ${categoryTotalWeight.toFixed(
        2
      )}~ kg\n`;
      message += `${"=".repeat(35)}\n\n`;
      grandTotalWeight += categoryTotalWeight;
    });

    const totalItems = Object.values(STATE.cart).reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    message += `SUMMARY:\n`;
    message += `Total Items: ${totalItems}\n`;
    message += `Total Weight: ${grandTotalWeight.toFixed(2)}~ kg\n`;

    return message;
  },

  formatItems(items) {
    let result = "";
    let counter = 1;
    let subWeight = 0;

    Utils.sortItems(items).forEach((item) => {
      const displayValue = item.sizeMm || item.thickness || item.sizeIn;
      // const label = item.thickness && !item.sizeIn ? "Thickness" : "Size";
      // const unitLabel = "mm";

      // const extra = item.extra ? ` ${item.extra}` : "";
      const quantity = parseInt(item.quantity) || 0;
      const weight = parseFloat(item.weight) || 0;
      const itemTotalWeight = weight * quantity;

      result += `${counter}. ${displayValue} Item Weight: ${weight} x${quantity} | Total Item Weight: ${itemTotalWeight.toFixed(
        2
      )}~ kg\n`;
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
        Products.updateFloatingButton();
      }

      if (target.classList.contains("product-decrement")) {
        const { category, subcategory, index } = target.dataset;
        Products.updateQuantity(category, subcategory, parseInt(index), -1);
        Products.updateFloatingButton();
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
      document
        .getElementById("clear-cart-btn")
        ?.addEventListener("click", () => {
          Cart.clearCart();
        });
    });

    document.addEventListener("change", (e) => {
      const target = e.target;

      if (target.classList.contains("qty-input") && target.dataset.category) {
        const { category, subcategory, index } = target.dataset;
        Products.setQuantity(
          category,
          subcategory,
          parseInt(index),
          target.value
        );
        Products.updateFloatingButton();
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

    document
      .getElementById("floating-add-cart")
      ?.addEventListener("click", () => {
        Products.addAllToCart();
      });

    document
      .querySelector(SELECTORS.cartBtn)
      ?.addEventListener("click", () => Cart.open());
    document
      .querySelector(SELECTORS.closeCart)
      ?.addEventListener("click", () => Cart.close());
    document
      .querySelector(SELECTORS.cartOverlay)
      ?.addEventListener("click", () => Cart.close());
    document
      .querySelector(SELECTORS.checkoutBtn)
      ?.addEventListener("click", () => Checkout.handle());

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") Cart.close();
    });

    window.addEventListener("popstate", (e) => {
      const cartDrawer = document.querySelector(SELECTORS.cartDrawer);
      const isCartOpen = cartDrawer?.classList.contains("active");

      if (isCartOpen) {
        Cart.close();

        if (!e.state?.cartOpen) {
          window.history.pushState(
            { cartOpen: false },
            "",
            window.location.href
          );
        }
      }
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
