// -------------------------------
// VARIABLES GLOBALES
// -------------------------------
let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const catalogContainer = document.getElementById("catalog");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const btnClear = document.getElementById("btnClear");
const btnCheckout = document.getElementById("btnCheckout");
const ticket = document.getElementById("ticket");

// -------------------------------
// CARGA DE PRODUCTOS (SIMULACIÓN DE API)
// -------------------------------
fetch("js/productos.json")
  .then((response) => response.json())
  .then((data) => {
    productos = data;
    renderCatalogo(); // renderizar cuando se cargan los productos
  })
  .catch((error) => {
    console.error("Error al cargar productos:", error);
  });

// -------------------------------
// FUNCIONES DE CATÁLOGO
// -------------------------------
function renderCatalogo() {
  catalogContainer.innerHTML = "";
  productos.forEach((prod) => {
    const card = document.createElement("div");
    card.className = "product";
    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}" class="product-img">
      <h3>${prod.nombre}</h3>
      <p>Precio: $${prod.precio}</p>
      <button data-id="${prod.id}" class="btn-agregar">Agregar al carrito</button>
    `;
    catalogContainer.appendChild(card);
  });

  // eventos de agregar al carrito
  const botones = document.querySelectorAll(".btn-agregar");
  botones.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      agregarAlCarrito(id);
    });
  });
}

// -------------------------------
// FUNCIONES DE CARRITO
// -------------------------------
function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  const productoEnCarrito = carrito.find((item) => item.id === id);

  if (productoEnCarrito) {
    productoEnCarrito.cantidad++;
    productoEnCarrito.subtotal = productoEnCarrito.cantidad * producto.precio;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
      subtotal: producto.precio,
    });
  }

  actualizarCarrito();
  showNotification(`${producto.nombre} agregado al carrito`, "success");
}

function renderCarrito() {
  cartList.innerHTML = "";

  carrito.forEach((item) => {
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <p>${item.nombre} (${item.cantidad}) - $${item.subtotal}</p>
      <button class="btn-remove" data-id="${item.id}">X</button>
    `;
    cartList.appendChild(div);
  });

  const buttonsRemove = document.querySelectorAll(".btn-remove");
  buttonsRemove.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      eliminarDelCarrito(id);
    });
  });

  const total = carrito.reduce((acc, item) => acc + item.subtotal, 0);
  cartTotal.textContent = `$${total}`;
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter((item) => item.id !== id);
  actualizarCarrito();
}

function vaciarCarrito() {
  carrito = [];
  actualizarCarrito();
  showNotification("Carrito vaciado", "info");
}

// -------------------------------
// FINALIZAR COMPRA (TICKET)
// -------------------------------
function finalizarCompra() {
  if (carrito.length === 0) {
    showNotification("El carrito está vacío", "error");
    return;
  }

  let total = carrito.reduce((acc, item) => acc + item.subtotal, 0);

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

  carrito = [];
  localStorage.removeItem("carrito");
  renderCarrito();
  showNotification("Compra finalizada con éxito", "success");
}

// -------------------------------
// ACTUALIZAR CARRITO EN STORAGE Y DOM
// -------------------------------
function actualizarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderCarrito();
}

// -------------------------------
// NOTIFICACIONES BÁSICAS
// -------------------------------
function showNotification(message, type) {
  const notif = document.createElement("div");
  notif.className = `notification ${type}`;
  notif.textContent = message;
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.remove();
  }, 2500);
}

// -------------------------------
// EVENTOS PRINCIPALES
// -------------------------------
btnClear.addEventListener("click", vaciarCarrito);
btnCheckout.addEventListener("click", finalizarCompra);
renderCarrito();
