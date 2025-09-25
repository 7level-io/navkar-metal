// localStorage Cart
function loadCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
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

const enquiryList = document.getElementById("list-enquiry");

enquiryList.addEventListener("click", () => {
  sendEnquiry();
});

function sendEnquiry() {
  let message = "Enquiry List:\n\n";

  let cart = loadCart();

  cart.forEach((item) => {
    message += `${item.name} (Size: ${item.size}, Weight: ${item.weight}) x${item.quantity} \n`;
  });

  // Encode and apply
  const encoded = encodeURIComponent(message);
  enquiryList.setAttribute("href", `https://wa.me/?text=${encoded}`);
  console.log(cart);
}
