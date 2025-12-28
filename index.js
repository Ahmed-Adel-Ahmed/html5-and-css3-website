const CART_KEY = "rarehue_cart";

window.addEventListener("DOMContentLoaded", () => {
  updateHeaderCount();
});

function updateHeaderCount() {
  const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const badge = document.getElementById("header-cart-count");
  if (badge) badge.innerText = totalCount;
}

const addButtons = document.querySelectorAll(".product-card .btn-outline");

addButtons.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();

    const card = this.closest(".product-card");
    const title = card.querySelector(".product-title").innerText;
    const priceStr = card
      .querySelector(".product-price")
      .innerText.replace("$", "");
    const price = parseFloat(priceStr);
    const img = card.querySelector("img").src;

    let filterClass = "";
    const imgClasses = card.querySelector("img").classList;
    imgClasses.forEach((cls) => {
      if (cls.startsWith("img-")) filterClass = cls;
    });

    const newItem = {
      id: "PLANT-" + Math.floor(Math.random() * 10000),
      name: title,
      price: price,
      quantity: 1,
      image: img,
      filterClass: filterClass,
    };

    const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

    const existingItem = cart.find((item) => item.name === newItem.name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push(newItem);
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    updateHeaderCount();

    alert(`${title} added to your bag!`);
  });
});

function filterSelection(category) {
  const cards = document.querySelectorAll(".product-card");
  const buttons = document.querySelectorAll(".filter-btn");

  if (typeof event !== "undefined" && event.target) {
    buttons.forEach((btn) => btn.classList.remove("active"));
    if (event.target.classList.contains("filter-btn")) {
      event.target.classList.add("active");
    }
  }

  cards.forEach((card) => {
    card.classList.remove("show");
    const cardCategory = card.getAttribute("data-category");

    if (category === "all") {
      card.style.display = "block";
      setTimeout(() => card.classList.add("show"), 10);
    } else {
      if (cardCategory === category) {
        card.style.display = "block";
        setTimeout(() => card.classList.add("show"), 10);
      } else {
        card.style.display = "none";
      }
    }
  });
}
