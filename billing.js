let savedOrder = sessionStorage.getItem("restaurant-order");

if (!savedOrder && sessionStorage.getItem("restaurant-payment-success")) {
  savedOrder = sessionStorage.getItem("restaurant-last-order");
}

const order = savedOrder ? JSON.parse(savedOrder) : [];
const itemsElement = document.querySelector("#bill-items");
const totalElement = document.querySelector("#grand-total");
const payButton = document.querySelector("#pay-now");
const billPage = document.querySelector("#bill-page");
const formatPrice = (price) => `₹${price}`;

const total = order.reduce((sum, item) => {
  const lineTotal = item.price * item.quantity;
  const row = document.createElement("div");
  row.className = "bill-item";
  row.innerHTML = `<span>${item.name}</span><span>${item.quantity}</span><span>${formatPrice(lineTotal)}</span>`;
  itemsElement.append(row);
  return sum + lineTotal;
}, 0);

totalElement.textContent = formatPrice(total);

payButton.addEventListener("click", () => {
  payButton.disabled = true;
  sessionStorage.setItem("restaurant-last-order", JSON.stringify(order));
  sessionStorage.setItem("restaurant-payment-success", "true");
  sessionStorage.removeItem("restaurant-order");
  billPage.innerHTML = `
    <section class="payment-complete">
      <p class="eyebrow">Table & Thyme</p>
      <h1>Payment Successful</h1>
      <p>Thank you for dining with us.</p>
      <a class="place-order" href="index.html">Back to Menu</a>
    </section>
  `;
});
