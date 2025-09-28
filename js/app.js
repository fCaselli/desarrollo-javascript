// -----------------------------
// Simulador Local de Ropa (DOM + LocalStorage)
// -----------------------------

const productos = [
  { id: 1, nombre: "Remera", precio: 5000, imagen: "img/remera.jpg" },
  { id: 2, nombre: "Pantalón", precio: 12000, imagen: "img/pantalon.jpg" },
  { id: 3, nombre: "Campera", precio: 20000, imagen: "img/campera.jpg" },
  { id: 4, nombre: "Zapatillas", precio: 25000, imagen: "img/zapatillas.jpg" },
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const catalogContainer = document.getElementById("catalog");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const btnClear = document.getElementById("btnClear");
const btnCheckout = document.getElementById("btnCheckout");
const notifications = document.getElementById("notifications");

// Renderizar catálogo
function renderCatalogo() {
  catalogContainer.innerHTML = "";
  productos.forEach((prod) => {
    const card = document.createElement("div");
    card.className = "product";
    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}" class="product-img">
      <h3>${prod.nombre}</h3>
      <p>Precio: $${prod.precio}</p>
      <button data-id="${prod.id}">Agregar al carrito</button>
    `;
    catalogContainer.appendChild(card);
  });
}

// Renderizar carrito
function renderCarrito() {
  cartList.innerHTML = "";
  if (carrito.length === 0) {
    cartList.innerHTML = "<p>El carrito está vacío</p>";
    cartTotal.textContent = "$0";
    return;
  }

  let total = 0;
  carrito.forEach((item) => {
    const div = document.createElement("div");
    div.innerHTML = `${item.nombre} - ${item.cantidad} x $${item.precio} = $${item.subtotal}`;
    cartList.appendChild(div);
    total += item.subtotal;
  });

  cartTotal.textContent = `$${total}`;
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Agregar producto al carrito
function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;

  const item = carrito.find((i) => i.id === id);
  if (item) {
    item.cantidad++;
    item.subtotal = item.cantidad * item.precio;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
      subtotal: producto.precio,
    });
  }
  renderCarrito();
  showNotification(`${producto.nombre} agregado al carrito`);
}

// Vaciar carrito
function vaciarCarrito() {
  carrito = [];
  localStorage.removeItem("carrito");
  renderCarrito();
  showNotification("Carrito vaciado");
}

// Finalizar compra
function finalizarCompra() {
  if (carrito.length === 0) {
    showNotification("El carrito está vacío", "error");
    return;
  }

  let total = carrito.reduce((acc, item) => acc + item.subtotal, 0);
  carrito = [];
  localStorage.removeItem("carrito");
  renderCarrito();
  showNotification(`Compra finalizada. Total: $${total}`, "success");
}

// Notificaciones en la página
function showNotification(msg, type = "info") {
  const p = document.createElement("p");
  p.textContent = msg;
  if (type === "success") p.style.color = "green";
  if (type === "error") p.style.color = "red";
  notifications.appendChild(p);
  setTimeout(() => p.remove(), 3000);
}

// Eventos
catalogContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const id = parseInt(e.target.dataset.id);
    agregarAlCarrito(id);
  }
});

btnClear.addEventListener("click", vaciarCarrito);
btnCheckout.addEventListener("click", finalizarCompra);

const ticket = document.getElementById("ticket");

// Finalizar compra con ticket detallado
function finalizarCompra() {
  if (carrito.length === 0) {
    showNotification("El carrito está vacío", "error");
    return;
  }

  let total = carrito.reduce((acc, item) => acc + item.subtotal, 0);

  // Construir ticket
  let detalle = `
    <h3>🧾 Ticket de compra</h3>
    <ul>
      ${carrito
        .map(
          (item) =>
            `<li>${item.cantidad} x ${item.nombre} = $${item.subtotal}</li>`
        )
        .join("")}
    </ul>
    <p><strong>Total pagado:</strong> $${total}</p>
  `;
  ticket.innerHTML = detalle;

  // Vaciar carrito
  carrito = [];
  localStorage.removeItem("carrito");
  renderCarrito();
  showNotification("Compra finalizada con éxito", "success");
}

// Inicialización
renderCatalogo();
renderCarrito();
