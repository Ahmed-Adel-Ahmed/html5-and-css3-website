const CART_KEY = "rarehue_cart";

window.onload = function () {
  loadCartFromStorage();
};

function loadCartFromStorage() {
  const savedCart = localStorage.getItem(CART_KEY);
  const cartItemsContainer = document.getElementById("cart-items");
  const emptyRow = document.getElementById("empty-row");

  if (savedCart) {
    const items = JSON.parse(savedCart);
    if (items.length > 0) {
      
      if (emptyRow) emptyRow.remove();
      cartItemsContainer.innerHTML = "";

      items.forEach((item) => {
        renderRow(item);
      });
    }
  }
  updateCartTotal(false);
}

function renderRow(item) {
  const cartItemsContainer = document.getElementById("cart-items");
  const tr = document.createElement("tr");
  tr.classList.add("cart-row");

  tr.dataset.id = item.id;
  tr.dataset.name = item.name;
  tr.dataset.img = item.image;
  tr.dataset.filter = item.filterClass || "";

  tr.innerHTML = `
        <td>
            <div class="cart-item-info">
                <img src="${item.image}" class="cart-thumb ${
    item.filterClass || ""
  }" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <small>ID: #${item.id}</small>
                </div>
            </div>
        </td>
        <td class="price">$${parseFloat(item.price).toFixed(2)}</td>
        <td>
            <input type="number" value="${
              item.quantity
            }" min="1" class="qty-input" onchange="updateCartTotal(true)" oninput="updateCartTotal(true)">
        </td>
        <td class="item-subtotal">$${(item.price * item.quantity).toFixed(
          2
        )}</td>
        <td><button class="btn-remove" onclick="removeItem(this)">&times;</button></td>
    `;
  cartItemsContainer.appendChild(tr);
}

function updateCartTotal(shouldSave = true) {
  const rows = document.querySelectorAll(".cart-row");
  let subtotal = 0;
  let totalCount = 0;

  rows.forEach((row) => {
    const price = parseFloat(
      row.querySelector(".price").innerText.replace("$", "")
    );
    const quantityInput = row.querySelector(".qty-input");
    let quantity = parseInt(quantityInput.value);

    if (isNaN(quantity) || quantity < 1) {
      quantity = 1;
      quantityInput.value = 1;
    }

    const itemTotal = price * quantity;
    row.querySelector(".item-subtotal").innerText = "$" + itemTotal.toFixed(2);

    subtotal += itemTotal;
    totalCount += quantity;
  });

  document.getElementById("cart-subtotal").innerText =
    "$" + subtotal.toFixed(2);

  const shipping = 25.0;
  const cartItems = document.getElementById("cart-items");

  if (rows.length === 0) {
    document.getElementById("cart-total").innerText = "$0.00";
    document.getElementById("shipping-cost").innerText = "$0.00";

    if (!document.getElementById("empty-row")) {
      cartItems.innerHTML =
        '<tr id="empty-row"><td colspan="5" class="empty-cart-msg">Your cart is currently empty.</td></tr>';
    }
  } else {
    const total = subtotal + shipping;
    document.getElementById("cart-total").innerText = "$" + total.toFixed(2);
    document.getElementById("shipping-cost").innerText = "$25.00";
  }

  document.getElementById("cart-count-badge").innerText = totalCount;

  if (shouldSave) {
    saveCartToStorage();
  }
}

function saveCartToStorage() {
  const rows = document.querySelectorAll(".cart-row");
  const items = [];

  rows.forEach((row) => {
    items.push({
      id: row.dataset.id,
      name: row.dataset.name,
      image: row.dataset.img,
      filterClass: row.dataset.filter,
      price: parseFloat(row.querySelector(".price").innerText.replace("$", "")),
      quantity: parseInt(row.querySelector(".qty-input").value),
    });
  });

  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function removeItem(button) {
  const row = button.parentElement.parentElement;
  row.remove();
  updateCartTotal(true); 
}

function clearCart() {
  if (confirm("Are you sure you want to clear the cart?")) {
    localStorage.removeItem(CART_KEY);
    location.reload();
  }
}
