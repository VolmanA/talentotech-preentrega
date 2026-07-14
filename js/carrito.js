/* ------------ */
/* Product List */
/* ------------ */
let productos = [];

function getProductos() {
	return fetch("https://fakestoreapi.com/products?limit=6")
		.then(response => response.json())
		.then(data => {
			productos = data.map(item => ({
					nombre: item.title,
					imagen: item.image,
					precio: item.price
			}));
		})
		.catch(error => console.error("Error:", error));
}

/* ------- */
/* Carrito */
/* ------- */

let carrito = [];
const CLAVE_CARRITO = "carrito";


function guardarCarrito() {
	localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function cargarCarrito() {
	let guardado = localStorage.getItem(CLAVE_CARRITO);

	if (guardado) {
		carrito = JSON.parse(guardado);
	}
}

function agregarCarrito(producto) {
	carrito.push(producto);
	
	actualizarCarrito();
}

function calcularTotalCarrito() {
	let total = 0;
	carrito.forEach(producto => total += producto.precio);
	
	return total;
}

function mostrarProductos() {
	let listaProductos = document.getElementById("lista-productos");
	listaProductos.innerHTML = "";
	
	productos.forEach((producto, index) => {
		let item = document.createElement("li");
		item.className = "productos-card";

		item.innerHTML =
			"<img src='" + producto.imagen + "' alt='" + producto.nombre + "'>" +
			"<h2>" + producto.nombre + "</h2>" +
			"<h3> Precio: $" + producto.precio + "</h3>" +
			"<button class='button-agregar' data-indice='" + index + "'>Agregar</button>";
			
		listaProductos.appendChild(item);
	});
	
	let botones = document.querySelectorAll(".button-agregar");

	botones.forEach((boton) => {
		boton.addEventListener("click", function () {
			let indice = boton.getAttribute("data-indice");
			agregarCarrito(productos[indice]);
			console.log(indice + "Prod:" + productos[indice])
		});
	});
}

function eliminarCarrito(indice) {
	let producto = carrito[indice];
	carrito.splice(indice, 1);

	actualizarCarrito();
}

function vaciarCarrito() {
	carrito = [];

	actualizarCarrito();
}

function actualizarCarrito() {
	let listaCarrito = document.getElementById("lista-carrito");
	let totalCarrito = document.getElementById("total-carrito");

	listaCarrito.innerHTML = "";

	if (carrito.length === 0) {
		listaCarrito.innerHTML = "<li class='carrito-vacio'>Agrega productos a tu carrito.</li>";
	} else {
		carrito.forEach((producto, index) => {
			let item = document.createElement("li");
			item.className = "productos-card";

			item.innerHTML =
				"<img src='" + producto.imagen + "' alt='" + producto.nombre + "'>" +
				"<h3>" + producto.nombre + "</h3>" +
				"<h4> $" + producto.precio + "</h4>" +
				"<button class='button-eliminar' data-indice='" + index + "'>Eliminar</button>";
				
			listaCarrito.appendChild(item);
		});

		let botonesQuitar = document.querySelectorAll(".button-eliminar");

		botonesQuitar.forEach((boton) => {
			boton.addEventListener("click", function () {
				let indice = boton.getAttribute("data-indice");
				eliminarCarrito(indice);
			});
		});
	};

	totalCarrito.textContent = "$" + calcularTotalCarrito();

	guardarCarrito();
}

function comprarCarrito() {
	if (carrito.length === 0) {
		Swal.fire({
			icon: "info",
			title: "El carrito está vacío.",
			text: "Agregá productos.",
			confirmButtonColor: "#ff9900"
		});
		return;
	}

	Swal.fire({
		icon: "success",
		title: "¡Gracias por tu Compra!",
		html:
			"Total a pagar: <strong>$" + calcularTotalCarrito() + "</strong><br><br>" +
			"<small>*Esto es un ejemplo de pago.</small>",
		confirmButtonText: "Ok",
		confirmButtonColor: "#29cc23"
	});

	vaciarCarrito()
}

document.addEventListener("DOMContentLoaded", function () {
	cargarCarrito();

	getProductos().then(function () {
		mostrarProductos();
		actualizarCarrito();
	});
	
	let botonVaciar = document.getElementById("button-vaciar");
	let botonPagar = document.getElementById("button-comprar");
	
	botonVaciar.addEventListener("click", vaciarCarrito);
	botonPagar.addEventListener("click", comprarCarrito);
});
