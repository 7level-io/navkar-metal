import { products } from "./products.js";

const STATE = {
  cart: {},
  currentUnit: "mm",
  currentCategory: "pipe",
};

const CATEGORY_CONTENT = {
  pipe: {
    title: "Pipe",
    description: "Browse square, rectangle and round pipe options by size, weight and quantity.",
  },
  angle: {
    title: "Angle",
    description: "Review the available angle sizes and select the quantities for your enquiry.",
  },
  flat: {
    title: "Flat",
    description: "Compare the listed flat sections by size and weight before adding your selection.",
  },
  channel: {
    title: "Channel",
    description: "Explore the available channel sizes and build a focused product selection.",
  },
  sheet: {
    title: "Sheet",
    description: "Choose from the listed sheet thicknesses and add the required quantities to your enquiry.",
  },
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
    if (!weightCategory) return "";
    const iconSVG = `<svg class="weight-tier-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor">
        <path d="M288 160C288 142.3 302.3 128 320 128C337.7 128 352 142.3 352 160C352 177.7 337.7 192 320 192C302.3 192 288 177.7 288 160zM410.5 192C414 182 416 171.2 416 160C416 107 373 64 320 64C267 64 224 107 224 160C224 171.2 225.9 182 229.5 192L207.7 192C179.4 192 154.5 210.5 146.4 237.6L66.4 504.2C64.8 509.4 64 514.8 64 520.2C64 551 89 576 119.8 576L520.2 576C551 576 576 551 576 520.2C576 514.8 575.2 509.4 573.6 504.2L493.6 237.7C485.5 210.6 460.6 192.1 432.3 192.1L410.5 192.1z"/>
      </svg>`;

    const iconCount = { light: 1, medium: 2, heavy: 3 }[weightCategory] || 0;
    if (iconCount === 0) return "";
    const label = { light: "Light", medium: "Medium", heavy: "Heavy" }[weightCategory] || "";

    return `<span class="weight-tier-badge tier-${weightCategory}" title="${label} Class: ${iconCount} weight icon${iconCount > 1 ? 's' : ''}">
      <span class="tier-icons">${iconSVG.repeat(iconCount)}</span>
      <span class="tier-label">${label}</span>
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
    const isPipe = category === "pipe";
    const displaySize = Utils.getDisplaySize(item, isPipe ? STATE.currentUnit : "mm");
    const extraText = item.extra
      ? `<span class="size-extra">${item.extra}</span>`
      : "";

    if (isPipe) {
      const weightIcons = Utils.getWeightIcons(item.weightCategory);

      return `
        <div class="table-row" data-product-row="${category}-${subcategory}-${index}" data-search-text="${`${displaySize} ${item.weight || ""} ${item.weightCategory || ""} ${item.extra || ""}`.toLowerCase()}">
          <div class="table-data cell-size">
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
          <div class="table-data cell-weight">
            <span class="weight-number">${item.weight ? `${item.weight} <small>kg</small>` : "N/A"}</span>
            ${weightIcons}
          </div>
          <div class="table-data cell-qty">
            <div class="qty-control">
              <button
                class="qty-btn product-decrement product-step-btn"
                type="button"
                aria-label="Decrease quantity"
                data-category="${category}"
                data-subcategory="${subcategory}"
                data-index="${index}"
                data-step="-1"
              >
                &minus;
              </button>
              <input
                type="number"
                class="qty-input"
                id="qty-${category}-${subcategory}-${index}"
                value="0"
                min="0"
                data-category="${category}"
                data-subcategory="${subcategory}"
                data-index="${index}"
                aria-label="Quantity for ${displaySize}${item.extra ? ` ${item.extra}` : ""}"
              />
              <button
                class="qty-btn product-increment product-step-btn"
                type="button"
                aria-label="Increase by 1"
                data-category="${category}"
                data-subcategory="${subcategory}"
                data-index="${index}"
                data-step="1"
              >
                +
              </button>
              <button
                class="qty-btn qty-btn-step product-step-btn"
                type="button"
                aria-label="Add 5"
                data-category="${category}"
                data-subcategory="${subcategory}"
                data-index="${index}"
                data-step="5"
              >
                +5
              </button>
              <button
                class="qty-btn qty-btn-step product-step-btn"
                type="button"
                aria-label="Add 10"
                data-category="${category}"
                data-subcategory="${subcategory}"
                data-index="${index}"
                data-step="10"
              >
                +10
              </button>
            </div>
          </div>
        </div>
      `;
    }

    // Non-pipe categories have weight data, but no weight class metadata.
    return `
      <div class="table-row" data-product-row="${category}-${subcategory}-${index}" data-search-text="${`${displaySize} ${item.weight || ""} ${item.extra || ""}`.toLowerCase()}">
        <div class="table-data cell-size">
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
        <div class="table-data cell-weight">
          <span class="weight-number">${item.weight ? `${item.weight} <small>kg</small>` : "N/A"}</span>
        </div>
        <div class="table-data cell-qty">
          <div class="qty-control">
            <button
              class="qty-btn product-decrement product-step-btn"
              type="button"
              aria-label="Decrease quantity"
              data-category="${category}"
              data-subcategory="${subcategory}"
              data-index="${index}"
              data-step="-1"
            >
              &minus;
            </button>
            <input
              type="number"
              class="qty-input"
              id="qty-${category}-${subcategory}-${index}"
              value="0"
              min="0"
              data-category="${category}"
              data-subcategory="${subcategory}"
              data-index="${index}"
              aria-label="Quantity for ${displaySize}${item.extra ? ` ${item.extra}` : ""}"
            />
            <button
              class="qty-btn product-increment product-step-btn"
              type="button"
              aria-label="Increase by 1"
              data-category="${category}"
              data-subcategory="${subcategory}"
              data-index="${index}"
              data-step="1"
            >
              +
            </button>
            <button
              class="qty-btn qty-btn-step product-step-btn"
              type="button"
              aria-label="Add 5"
              data-category="${category}"
              data-subcategory="${subcategory}"
              data-index="${index}"
              data-step="5"
            >
              +5
            </button>
            <button
              class="qty-btn qty-btn-step product-step-btn"
              type="button"
              aria-label="Add 10"
              data-category="${category}"
              data-subcategory="${subcategory}"
              data-index="${index}"
              data-step="10"
            >
              +10
            </button>
          </div>
        </div>
      </div>
    `;
  },

  updateTabBadges() {
    const categories = {
      pipe: ["square", "rectangle", "round"],
      angle: null,
      flat: null,
      channel: null,
      sheet: null,
    };

    const subIcons = {
      square: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="tab-sub-svg" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>`,
      rectangle: `<svg width="13" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="tab-sub-svg" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/></svg>`,
      round: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="tab-sub-svg" aria-hidden="true"><circle cx="12" cy="12" r="9"/></svg>`
    };

    Object.entries(categories).forEach(([category, subs]) => {
      let totalCount = 0;
      const subCounts = {};

      if (subs) {
        subs.forEach((sub) => {
          let subCount = 0;
          products.pipe[sub].forEach((_, index) => {
            const input = document.getElementById(`qty-pipe-${sub}-${index}`);
            const qty = Utils.parseIntSafe(input?.value);
            subCount += qty;
          });
          subCounts[sub] = subCount;
          totalCount += subCount;

          // Update pill counter on the sub-tab itself
          const subTabBtn = document.querySelector(`.sub-tab[data-subtab="${sub}"]`);
          if (subTabBtn) {
            let pill = subTabBtn.querySelector(".subtab-pill");
            if (subCount > 0) {
              if (!pill) {
                pill = document.createElement("span");
                pill.className = "subtab-pill";
                subTabBtn.appendChild(pill);
              }
              pill.textContent = subCount;
            } else if (pill) {
              pill.remove();
            }
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

      // Update main category tab badge: clean pill
      const tab = document.querySelector(`[data-tab="${category}"]`);
      if (!tab) return;

      let badge = tab.querySelector(".tab-badge");
      tab.querySelector(".tab-badge-tooltip")?.remove(); // remove old tooltip completely

      if (totalCount > 0) {
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "tab-badge pill-badge";
          tab.appendChild(badge);
        }

        if (subs) {
          // Render visual geometric icons with counts (e.g., [ □ 20 ▭ 20 ○ 20 ])
          let indicatorsHtml = "";
          Object.entries(subCounts).forEach(([sub, cnt]) => {
            if (cnt > 0) {
              indicatorsHtml += `<span class="sub-indicator" title="${Utils.capitalize(sub)}: ${cnt}">${subIcons[sub]}<span class="sub-indicator-num">${cnt}</span></span>`;
            }
          });
          badge.innerHTML = indicatorsHtml || `${totalCount}`;
        } else {
          badge.textContent = totalCount;
        }
      } else {
        badge?.remove();
      }
    });

    this.updateFloatingButton();
  },

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
  filterRows(query) {
    const needle = query.trim().toLowerCase();
    const tabsContainer = document.querySelector(".tabs");
    const subTabsContainer = document.querySelector(".sub-tabs-container");
    const allTabContents = document.querySelectorAll(".tab-content");
    const allSubTabContents = document.querySelectorAll(".subtab-content");
    
    let visible = 0;

    if (needle) {
      // Enter Global Search Mode
      document.body.classList.add("global-search-active");
      if (tabsContainer) tabsContainer.style.display = "none";
      if (subTabsContainer) subTabsContainer.style.display = "none";
      
      // Force unhide all tab contents so all rows can be seen
      allTabContents.forEach(tc => tc.classList.remove("hidden"));
      allSubTabContents.forEach(stc => stc.classList.remove("hidden"));
      
      document.querySelectorAll("[data-product-row]").forEach((row) => {
        const matches = row.dataset.searchText.includes(needle);
        row.classList.toggle("search-hidden", !matches);
        if (matches) visible += 1;
        
        // Hide empty categories visually during search
        const tableBody = row.closest('.table-body');
        if (tableBody) {
            const hasVisible = Array.from(tableBody.querySelectorAll('[data-product-row]')).some(r => !r.classList.contains('search-hidden'));
            const productTable = tableBody.closest('.product-table');
            if (productTable) productTable.style.display = hasVisible ? 'block' : 'none';
            // Also hide the title if the table is hidden
            const title = productTable.previousElementSibling;
            if (title && title.classList.contains('search-category-title')) {
                title.style.display = hasVisible ? 'block' : 'none';
            }
        }
      });
    } else {
      // Exit Global Search Mode
      document.body.classList.remove("global-search-active");
      if (tabsContainer) tabsContainer.style.display = "";
      if (subTabsContainer) subTabsContainer.style.display = "";
      
      // Reset all visibility
      document.querySelectorAll("[data-product-row]").forEach(r => r.classList.remove("search-hidden"));
      document.querySelectorAll('.product-table').forEach(pt => pt.style.display = "");
      document.querySelectorAll('.search-category-title').forEach(t => t.style.display = "");
      
      // Restore tab states based on STATE without calling switchTab
      document.querySelectorAll(".tab-content").forEach(c => c.classList.add("hidden"));
      const currentContent = document.getElementById(`${STATE.currentCategory}-content`);
      if (currentContent) currentContent.classList.remove("hidden");
    }

    const status = document.getElementById("catalog-search-status");
    if (status) status.textContent = needle ? `${visible} matching size${visible === 1 ? "" : "s"}` : "";
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
    const row = input.closest(".table-row");
    if (row) {
      row.classList.toggle("row-selected", value > 0);
    }
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

    countEl.classList.remove("pulse");

    // Trigger reflow to restart animation
    void countEl.offsetWidth;

    countEl.classList.add("pulse");

    setTimeout(() => {
      countEl.classList.remove("pulse");
    }, 600); // Match animation duration
  },

  /**
   * Clears all items from cart with confirmation
   * ${Object.keys(STATE.cart).length}
   **/
  clearCart() {
    this.showConfirmModal(
      "Clear Enquiry",
      "Are you sure you want to remove all items from your quotation enquiry? This action cannot be undone.",
      () => {
        STATE.cart = {};
        Storage.save();
        this.updateCount();
        this.render();
        Products.updateTabBadges();

        // Show success feedback
        this.showToast("Enquiry cleared successfully", "success");
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
      <div class="empty-enquiry-container text-center py-12">
        <div class="empty-icon-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="empty-enquiry-icon">
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1 2-2h2"/>
            <path d="M12 11h4"/>
            <path d="M12 16h4"/>
            <path d="M8 11h.01"/>
            <path d="M8 16h.01"/>
          </svg>
        </div>
        <h3 class="empty-enquiry-title">Your enquiry is empty</h3>
        <p class="empty-enquiry-desc">Add pipe, angle, flat, channel, or sheet sections from the catalogue to assemble your quotation enquiry.</p>
      </div>
    `;
  },
  _old_renderEmptyCart() {
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
      if (!item || !item.quantity || item.quantity <= 0) return;
      const cat = item.category;
      if (!cat) return;
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
        const activeSubs = ["Square", "Rectangle", "Round"].filter(
          (sub) => data[sub] && data[sub].length > 0
        );
        if (activeSubs.length === 0) return; // Do not render empty Pipe category

        html += `
        <div class="cart-category">
          <div class="cart-category-header">
            <div class="cart-category-title-text">${category}</div>
            <div class="cart-unit-toggle">
              <span class="cart-unit-label">Unit:</span>
              <div class="unit-toggle">
                <button class="unit-btn ${STATE.currentUnit === "mm" ? "active" : ""}" data-unit="mm" type="button">mm</button>
                <button class="unit-btn ${STATE.currentUnit === "in" ? "active" : ""}" data-unit="in" type="button">in</button>
              </div>
            </div>
          </div>`;

        activeSubs.forEach((sub) => {
          const subIcon = {
            Square: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>`,
            Rectangle: `<svg width="13" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="5" width="20" height="14" rx="2"/></svg>`,
            Round: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="9"/></svg>`
          }[sub] || "";

          html += `
          <div class="cart-subcategory-group">
            <div class="cart-subcategory-header">${subIcon}<span>${sub}</span></div>
            <div class="cart-items-list">
              ${Utils.sortItems(data[sub]).map((item) => this.renderCartItem(item)).join("")}
            </div>
          </div>`;
        });

        html += `</div>`;
      } else {
        if (!data.items || data.items.length === 0) return; // Do not render empty category

        html += `
        <div class="cart-category">
          <div class="cart-category-header">
            <div class="cart-category-title-text">${category}</div>
          </div>
          <div class="cart-items-list">
            ${Utils.sortItems(data.items).map((item) => this.renderCartItem(item)).join("")}
          </div>
        </div>`;
      }
    });

    return html;
  },

  renderCartItem(item) {
    const isPipe = item.category === "Pipe";
    const displayValue =
      STATE.currentUnit === "in" && isPipe
        ? item.sizeIn && !item.sizeIn.includes("&")
          ? item.sizeIn
          : item.sizeMm || item.thickness
        : item.sizeMm || item.thickness;
    const weightIcons = isPipe ? Utils.getWeightIcons(item.weightCategory) : "";
    const extraText = item.extra ? ` ${item.extra}` : "";
    const totalItemWeight = (item.weight && item.quantity)
      ? (parseFloat(item.weight) * item.quantity).toFixed(2)
      : null;

    return `
      <div class="cart-item" data-item-id="${item.id}">
        <div class="cart-item-col-info">
          <div class="cart-item-title-row">
            <strong
              class="cart-item-name cart-item-size"
              data-size-in="${item.sizeIn || ""}"
              data-size-mm="${item.sizeMm || ""}"
              data-thickness="${item.thickness || ""}"
              data-extra="${item.extra || ""}"
            >${displayValue}</strong>
            ${extraText ? `<span class="cart-item-extra">${extraText}</span>` : ""}
          </div>
          <div class="cart-item-meta-row">
            ${weightIcons ? `<span class="cart-weight-badge">${weightIcons}</span>` : ""}
            <span class="cart-weight-spec">${item.weight ? `${item.weight} kg/pc` : ""}</span>
          </div>
        </div>
        <div class="cart-item-col-qty">
          <div class="qty-control cart-qty-ctrl">
            <button class="qty-btn cart-decrement cart-step-btn" type="button" data-step="-1" title="Decrease">&minus;</button>
            <input 
              type="number" 
              class="qty-input cart-qty-input has-value" 
              value="${item.quantity}" 
              min="1"
              data-item-id="${item.id}"
              aria-label="Quantity"
            />
            <button class="qty-btn cart-increment cart-step-btn" type="button" data-step="1" title="Increase">+</button>
          </div>
        </div>
        <div class="cart-item-col-total">
          ${totalItemWeight ? `<span class="cart-item-total-weight">${totalItemWeight} <small>kg</small></span>` : ""}
        </div>
        <div class="cart-item-col-del">
          <button type="button" aria-label="Remove ${displayValue} from enquiry" class="cart-item-remove-btn" title="Remove item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    `;
  },

  updateTotal(count) {
    const totalEl = document.querySelector(SELECTORS.totalItems);
    if (totalEl) totalEl.textContent = `(${count})`;

    const totalWeight = Object.values(STATE.cart).reduce((sum, item) => {
      const weight = parseFloat(item.weight) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return sum + weight * quantity;
    }, 0);

    const totalWeightEl = document.querySelector("#total-weight");
    if (totalWeightEl) {
      totalWeightEl.textContent = totalWeight > 0 ? `${totalWeight.toFixed(2)}~` : "0";
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
    this.previousFocus = document.activeElement;
    document.body.classList.add("drawer-open");
    document.querySelector(SELECTORS.cartOverlay)?.classList.add("active");
    document.querySelector(SELECTORS.cartDrawer)?.classList.add("active");
    document.querySelector(SELECTORS.cartDrawer)?.setAttribute("aria-hidden", "false");
    document.querySelector("#close-cart")?.focus();

    if (window.history.state?.cartOpen !== true) {
      window.history.pushState({ cartOpen: true }, "", window.location.href);
    }
  },

  close() {
    document.body.classList.remove("drawer-open");
    document.querySelector(SELECTORS.cartOverlay)?.classList.remove("active");
    document.querySelector(SELECTORS.cartDrawer)?.classList.remove("active");
    document.querySelector(SELECTORS.cartDrawer)?.setAttribute("aria-hidden", "true");
    this.previousFocus?.focus?.();

    if (window.history.state?.cartOpen === true) {
      window.history.back();
    }
  },
};

const UI = {
  updateCategoryIntro(category) {
    const content = CATEGORY_CONTENT[category] || CATEGORY_CONTENT.pipe;
    const title = document.getElementById("product-page-title");
    const description = document.getElementById("product-description");
    const heroCategory = document.getElementById("hero-category");

    if (title) title.textContent = `Choose the right ${content.title.toLowerCase()} section for your project.`;
    if (description) description.textContent = content.description;
    if (heroCategory) heroCategory.textContent = content.title;
  },

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

  switchTab(tab, { updateUrl = true } = {}) {
    if (!CATEGORY_CONTENT[tab]) return;
    STATE.currentCategory = tab;
    document
      .querySelectorAll(".tab")
      .forEach((t) => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
    const activeTab = document.querySelector(`[data-tab="${tab}"]`);
    activeTab?.classList.add("active");
    activeTab?.setAttribute("aria-selected", "true");

    document
      .querySelectorAll(".tab-content")
      .forEach((c) => c.classList.add("hidden"));
    document.getElementById(`${tab}-content`)?.classList.remove("hidden");
    this.updateCategoryIntro(tab);
    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set("category", tab);
      window.history.pushState({ category: tab }, "", url);
    }
    Products.filterRows(document.getElementById("catalog-search")?.value || "");
  },

  switchSubTab(subtab) {
    document
      .querySelectorAll(".sub-tab")
      .forEach((t) => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
    document
      .querySelector(`[data-subtab="${subtab}"]`)
      ?.classList.add("active");
    document.querySelector(`[data-subtab="${subtab}"]`)?.setAttribute("aria-selected", "true");

    document
      .querySelectorAll(".subtab-content")
      .forEach((c) => c.classList.add("hidden"));
    document.getElementById(`${subtab}-content`)?.classList.remove("hidden");
  },
};

const Checkout = {
  handle() {
    if (Object.keys(STATE.cart).length === 0) {
      alert("Your enquiry is empty! Please select metal sections first.");
      return;
    }

    Details.open();
  },

  send(details = {}) {
    const form = document.getElementById("enquiry-form");
    const message = this.generateMessage(details || (form ? Object.fromEntries(new FormData(form).entries()) : {}));
    const encoded = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

    window.open(whatsappURL, "_blank");
    Details.close();
    const feedback = document.getElementById("enquiry-feedback");
    if (feedback) feedback.textContent = "WhatsApp opened with your enquiry. Your selection has been retained.";
  },

  generateMessage(details = {}) {
    let message = `Navkar Metals enquiry\nName: ${details.name || "-"}\nPhone: ${details.phone || "-"}\nLocation: ${details.location || "-"}\nProject: ${details.project || "-"}\n\nSelection:\n\n`;
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
            message += `  Sub Net wt (${sub}): ${subWeight.toFixed(2)}! kg\n\n`;
            categoryTotalWeight += subWeight;
          }
        });
      } else if (data.items) {
        const { formattedItems, subWeight } = this.formatItems(data.items);
        message += formattedItems;
        categoryTotalWeight += subWeight;
      }

      message += `Net Wt (${category}): ${categoryTotalWeight.toFixed(
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
    message += `Net Items: ${totalItems}\n`;
    message += `Net Wt: ${grandTotalWeight.toFixed(2)}~ kg\n`;

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

      result += `${counter}. ${displayValue} | Wt: ${weight} x${quantity} | Net Item Wt: ${itemTotalWeight.toFixed(
        2
      )}~ kg\n`;
      counter++;

      subWeight += itemTotalWeight;
    });

    return { formattedItems: result, subWeight };
  },
};

const Details = {
  previousFocus: null,
  open() {
    this.previousFocus = document.activeElement;
    document.getElementById("details-overlay")?.classList.add("active");
    const modal = document.getElementById("details-modal");
    modal?.classList.add("active");
    modal?.setAttribute("aria-hidden", "false");
    modal?.querySelector("input")?.focus();
  },
  close() {
    document.getElementById("details-overlay")?.classList.remove("active");
    const modal = document.getElementById("details-modal");
    modal?.classList.remove("active");
    modal?.setAttribute("aria-hidden", "true");
    this.previousFocus?.focus?.();
  },
};

const Events = {
  init() {
    document.addEventListener("click", (e) => {
      const target = e.target;

      const unitButton = target.closest(".unit-btn");
      if (unitButton) {
        UI.toggleUnit(unitButton.dataset.unit);
        return;
      }

      const productStepBtn = target.closest(".product-step-btn");
      if (productStepBtn) {
        const { category, subcategory, index, step } = productStepBtn.dataset;
        const delta = parseInt(step) || 1;
        Products.updateQuantity(category, subcategory, parseInt(index), delta);
        Products.updateFloatingButton();
      }

      const cartStepBtn = target.closest(".cart-step-btn");
      if (cartStepBtn) {
        const cartItem = cartStepBtn.closest(".cart-item");
        if (cartItem) {
          const step = parseInt(cartStepBtn.dataset.step) || 1;
          Cart.updateQuantity(cartItem.dataset.itemId, step);
        }
      }

      if (target.closest(".cart-item-remove") || target.closest(".cart-item-remove-btn")) {
        const cartItem = target.closest(".cart-item");
        if (cartItem) Cart.removeItem(cartItem.dataset.itemId);
      }
      if (target.closest("#clear-cart-btn")) {
        Cart.clearCart();
      }
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

    document.getElementById("catalog-search")?.addEventListener("input", (event) => Products.filterRows(event.target.value));
    document.getElementById("close-enquiry-details")?.addEventListener("click", () => Details.close());
    document.getElementById("details-overlay")?.addEventListener("click", () => Details.close());
    document.getElementById("skip-enquiry-details")?.addEventListener("click", () => Checkout.send({}));
    document.getElementById("enquiry-form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (event.currentTarget.reportValidity()) {
        Checkout.send(Object.fromEntries(new FormData(event.currentTarget).entries()));
      }
    });
    document.querySelectorAll(".sub-tab").forEach((tab) => {
      tab.addEventListener("click", () => UI.switchSubTab(tab.dataset.subtab));
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
      if (e.key !== "Escape") return;
      if (document.getElementById("details-modal")?.classList.contains("active")) {
        Details.close();
        return;
      }
      Cart.close();
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
      } else {
        const category = new URL(window.location.href).searchParams.get("category");
        if (CATEGORY_CONTENT[category]) UI.switchTab(category, { updateUrl: false });
      }
    });
  },
};

function init() {
  Products.render("pipe", "square");
  Products.render("pipe", "rectangle");
  Products.render("pipe", "round");
  Products.render("angle");
  Products.render("flat");
  Products.render("channel");
  Products.render("sheet");

  const initialCategory = new URL(window.location.href).searchParams.get("category");
  UI.switchTab(CATEGORY_CONTENT[initialCategory] ? initialCategory : "pipe", { updateUrl: false });

  Storage.load();

  Events.init();
  Products.filterRows(document.getElementById("catalog-search")?.value || "");
}

init();

export { STATE, Products, Cart, Storage, Checkout, Utils };
