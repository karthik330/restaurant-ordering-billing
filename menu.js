const menu = [
  {
    category: "Starters",
    items: [
      ["Crispy Corn", 180],
      ["Paneer Tikka", 240],
      ["Chicken 65", 260],
      ["Veg Spring Rolls", 190],
      ["Chilli Prawns", 320]
    ]
  },
  {
    category: "Main Dishes",
    items: [
      ["Butter Chicken", 340],
      ["Paneer Butter Masala", 290],
      ["Veg Biryani", 250],
      ["Mutton Rogan Josh", 390],
      ["Dal Makhani", 220]
    ]
  },
  {
    category: "Desserts",
    items: [
      ["Gulab Jamun", 110],
      ["Chocolate Brownie", 160],
      ["Kulfi", 130],
      ["Caramel Custard", 150],
      ["Rasmalai", 140]
    ]
  }
];

const menuElement = document.querySelector("#menu");
const placeOrderButton = document.querySelector("#place-order");
const selectAllButton = document.querySelector("#select-all");
const deselectAllButton = document.querySelector("#deselect-all");
const savedDraft = JSON.parse(sessionStorage.getItem("restaurant-last-order") || "[]");

const formatPrice = (price) => `₹${price}`;

menu.forEach(({ category, items }) => {
  const section = document.createElement("section");
  section.className = "category";
  section.innerHTML = `<h2>${category}</h2>`;

  const list = document.createElement("div");
  list.className = "menu-list";

  items.forEach(([name, price], index) => {
    const id = `${category.toLowerCase().replace(/\s/g, "-")}-${index}`;
    const draftItem = savedDraft.find((item) => item.name === name);
    const quantity = draftItem ? draftItem.quantity : 0;
    const row = document.createElement("article");
    row.className = "menu-item";
    row.innerHTML = `
      <div>
        <h3>${name}</h3>
        <p>${formatPrice(price)}</p>
      </div>
      <label class="quantity" for="${id}">
        <span>Quantity</span>
        <input id="${id}" type="number" step="1" value="${quantity}" data-name="${name}" data-price="${price}" />
      </label>
    `;
    list.append(row);
  });

  section.append(list);
  menuElement.append(section);
});

const quantities = () => [...document.querySelectorAll("input[type='number']")];

const updatePlaceOrder = () => {
  placeOrderButton.disabled = !quantities().some((input) => Number(input.value) > 0);
};

quantities().forEach((input) => input.addEventListener("input", updatePlaceOrder));

selectAllButton.addEventListener("click", () => {
  quantities().forEach((input) => {
    input.value = 1;
    input.disabled = true;
  });
  updatePlaceOrder();
});

deselectAllButton.addEventListener("click", () => {
  quantities().forEach((input) => {
    input.value = 0;
    input.disabled = false;
  });
  updatePlaceOrder();
});

placeOrderButton.addEventListener("click", () => {
  const order = quantities()
    .map((input) => ({
      name: input.dataset.name,
      price: Number(input.dataset.price),
      quantity: Number(input.value)
    }))
    .filter((item) => item.quantity > 0);

  sessionStorage.setItem("restaurant-order", JSON.stringify(order));
  sessionStorage.removeItem("restaurant-payment-success");
  window.location.href = "billing.html";
});

updatePlaceOrder();
