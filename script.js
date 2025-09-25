// Quantity control logic
document.querySelectorAll(".qty-control").forEach((control) => {
  const input = control.querySelector("input");
  const decBtn = control.querySelector(".decrease");
  const incBtn = control.querySelector(".increase");

  decBtn.addEventListener("click", () => {
    let value = parseInt(input.value, 10) || 1;
    if (value > parseInt(input.min || 1, 10)) {
      input.value = value - 1;
    }
  });

  incBtn.addEventListener("click", () => {
    let value = parseInt(input.value, 10) || 0;
    input.value = value + 1;
  });
});

// localStorage Cart
function loadCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(item, inputEl) {
  const cart = loadCart();
  const existing = cart.find((i) => i.id === item.id);
  if (item.quantity == 0) {
    alert("Quantity has to be more than 0!");
    return;
  }
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
  alert(item.name + " added to cart!");

  inputEl.value = 0;
}

function removeFromCart(id) {
  let cart = loadCart();
  cart = cart.filter((item) => item.id !== id);
  saveCart(cart);
  renderCart();
}

function renderCart() {
  const cart = loadCart();
  const list = document.getElementById("cartItems");
  list.innerHTML = "";

  if (cart.length === 0) {
    list.innerHTML = "<li>Cart is empty</li>";
  } else {
    cart.forEach((item) => {
      const li = document.createElement("li");
      li.classList.add("cart-item");
      li.innerHTML = `<span>${item.name} (${item.size}, ${item.weight}) x ${item.quantity} <span>`;

      const removeBtn = document.createElement("button");
      removeBtn.classList.add("remove-btn");
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", () => {
        removeFromCart(item.id);
      });

      li.appendChild(removeBtn);
      list.appendChild(li);
    });
  }
}

document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", function () {
    const row = this.closest("tr");
    const qty = parseInt(row.querySelector("input").value, 10);
    const item = {
      id: this.dataset.id,
      name: this.dataset.name,
      size: this.dataset.size,
      weight: this.dataset.weight,
      quantity: qty,
    };
    addToCart(item);
  });
});

const cartDrawer = document.getElementById("cartDrawer");
const openCartBtn = document.getElementById("cartBtn");

document.getElementById("closeCart").addEventListener("click", () => {
  document.getElementById("cartDrawer").classList.remove("open")
  if (window.matchMedia("(min-width: 768px)").matches) {
    document.querySelector(".main").style.margin = "0 auto";
  }
});


openCartBtn.addEventListener("click", () => {
  renderCart();
  cartDrawer.classList.add("open");
  if (window.matchMedia("(min-width: 768px)").matches) {
    document.querySelector(".main").style.marginRight = "600px";
  }
});

// Close when clicking outside
window.addEventListener("click", (event) => {
  if (
    cartDrawer.classList.contains("open") &&
    !cartDrawer.contains(event.target) &&
    event.target !== openCartBtn
  ) {
    cartDrawer.classList.remove("open");
  }
  if (window.matchMedia("(min-width: 768px)").matches) {
    document.querySelector(".main").style.margin = "0 auto";
  }
});
