let orders = [
  {
    id: 1001,
    customer: "Ali Khan",
    product: "Laptop",
    amount: 1200,
    status: "Completed",
  },
  {
    id: 1002,
    customer: "Sara Ahmed",
    product: "Headphones",
    amount: 150,
    status: "Pending",
  },
  {
    id: 1003,
    customer: "Usman Raza",
    product: "Smartphone",
    amount: 850,
    status: "Completed",
  },
  {
    id: 1004,
    customer: "Ayesha Malik",
    product: "Keyboard",
    amount: 75,
    status: "Cancelled",
  },
  {
    id: 1005,
    customer: "Hamza Shah",
    product: "Monitor",
    amount: 350,
    status: "Completed",
  },
  {
    id: 1006,
    customer: "Zainab Noor",
    product: "Mouse",
    amount: 45,
    status: "Pending",
  },
];

const ordersBody = document.getElementById("orders-body");
const searchInput = document.getElementById("search-input");
const statusFilter = document.getElementById("status-filter");
const visibleCount = document.getElementById("visible-count");
const orderForm = document.getElementById("order-form");
const formMessage = document.getElementById("form-message");
const toast = document.getElementById("toast");

function renderOrders() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedStatus = statusFilter.value;

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm) ||
      order.product.toLowerCase().includes(searchTerm) ||
      String(order.id).includes(searchTerm);
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  ordersBody.innerHTML = "";

  if (filteredOrders.length === 0) {
    ordersBody.innerHTML = `<tr><td colspan="6" class="empty-row">No orders found.</td></tr>`;
  } else {
    filteredOrders.forEach((order) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>#${order.id}</td>
          <td>${escapeHTML(order.customer)}</td>
          <td>${escapeHTML(order.product)}</td>
          <td>$${order.amount.toFixed(2)}</td>
          <td><span class="status ${order.status.toLowerCase()}">${order.status}</span></td>
          <td><button class="delete-btn" data-id="${order.id}">Delete</button></td>
        `;
      ordersBody.appendChild(row);
    });
  }

  visibleCount.textContent = `${filteredOrders.length} ${filteredOrders.length === 1 ? "order" : "orders"}`;
}

function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}

function updateStats() {
  const totalRevenue = orders
    .filter((order) => order.status === "Completed")
    .reduce((sum, order) => sum + order.amount, 0);

  document.getElementById("revenue").textContent =
    `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  document.getElementById("orders-count").textContent = orders.length;
  document.getElementById("customers-count").textContent = (
    1248 +
    orders.length -
    6
  ).toLocaleString();
}

searchInput.addEventListener("input", renderOrders);
statusFilter.addEventListener("change", renderOrders);

ordersBody.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete-btn");
  if (!deleteButton) return;
  const id = Number(deleteButton.dataset.id);
  const order = orders.find((item) => item.id === id);
  if (!order) return;
  orders = orders.filter((item) => item.id !== id);
  renderOrders();
  updateStats();
  showToast(`Order #${id} deleted.`);
});

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const customer = document.getElementById("customer").value.trim();
  const product = document.getElementById("product").value.trim();
  const amount = Number(document.getElementById("amount").value);
  const status = document.getElementById("new-status").value;

  if (!customer || !product || !Number.isFinite(amount) || amount <= 0) {
    formMessage.textContent = "Please enter valid order details.";
    formMessage.style.color = "var(--red)";
    return;
  }

  const newOrder = {
    id: orders.length ? Math.max(...orders.map((order) => order.id)) + 1 : 1001,
    customer,
    product,
    amount,
    status,
  };

  orders.unshift(newOrder);
  orderForm.reset();
  formMessage.textContent = `Order #${newOrder.id} added successfully.`;
  formMessage.style.color = "var(--accent)";

  renderOrders();
  updateStats();
  showToast("New order added successfully.");
});

const chartData = {
  monthly: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    values: [40, 65, 50, 80, 70, 95],
  },
  weekly: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    values: [45, 70, 55, 85, 65, 95, 75],
  },
};

function renderChart(period) {
  const chart = document.getElementById("chart");
  const data = chartData[period];
  chart.innerHTML = data.labels
    .map(
      (label, index) => `
      <div class="bar-group">
        <div class="bar" style="--height: ${data.values[index]}%;"></div>
        <span>${label}</span>
      </div>
    `,
    )
    .join("");
}

document.getElementById("chart-period").addEventListener("change", (event) => {
  renderChart(event.target.value);
});

document.querySelectorAll(".nav-links button").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".nav-links button")
      .forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    const section = button.dataset.section;
    const titles = {
      overview: [
        "Dashboard overview",
        "Welcome back — here's how the business is tracking.",
      ],
      orders: ["Orders management", "Search, filter, and manage your orders."],
      customers: ["Customers", "Review your customer activity."],
      settings: ["Settings", "Manage your dashboard preferences."],
    };

    document.getElementById("page-title").textContent = titles[section][0];
    document.getElementById("page-subtitle").textContent = titles[section][1];

    if (section === "orders") {
      document
        .getElementById("orders-section")
        .scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (section === "customers") {
      showToast("Customer management is ready for integration.");
    } else if (section === "settings") {
      showToast("Settings panel is available for customization.");
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove("show"), 2500);
}

renderOrders();
updateStats();
renderChart("monthly");
