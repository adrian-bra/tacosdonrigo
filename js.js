const productos = [
    { id: 1, nombre: "Tacos de res", precio: 15 },
    { id: 2, nombre: "Tacos de adobada", precio: 15 },
    { id: 3, nombre: "Quesadilla de res", precio: 48 },
    { id: 4, nombre: "Quesadilla de adobada", precio: 48 },
    { id: 5, nombre: "Torta de res", precio: 50 },
    { id: 6, nombre: "Torta de adobada", precio: 50 },
    { id: 7, nombre: "Bebida de 1/2 litro", precio: 25 },
    { id: 8, nombre: "Bebida de 1 litro", precio: 30 }
];

const carrito = [];

const listaCarrito = document.getElementById("lista-carrito");
const totalElemento = document.getElementById("total");
const contadorElemento = document.getElementById("contador");

document.getElementById("anio").textContent = new Date().getFullYear();

function formatoPrecio(cantidad) {
    return cantidad.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 2
    });
}

function agregarProducto(id) {
    const producto = productos.find(item => item.id === id);

    if (!producto) return;

    const existente = carrito.find(item => item.id === id);

    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    mostrarCarrito();
}

function cambiarCantidad(id, cambio) {
    const item = carrito.find(producto => producto.id === id);

    if (!item) return;

    item.cantidad += cambio;

    if (item.cantidad <= 0) {
        const indice = carrito.findIndex(producto => producto.id === id);
        carrito.splice(indice, 1);
    }

    mostrarCarrito();
}

function eliminarProducto(id) {
    const indice = carrito.findIndex(item => item.id === id);

    if (indice !== -1) {
        carrito.splice(indice, 1);
    }

    mostrarCarrito();
}

function calcularTotal() {
    return carrito.reduce((suma, item) => {
        return suma + item.precio * item.cantidad;
    }, 0);
}

function mostrarCarrito() {
    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        listaCarrito.innerHTML =
            '<p class="carrito-vacio">Tu carrito está vacío. ¡Agrega algo del menú!</p>';
    } else {
        carrito.forEach(item => {
            const fila = document.createElement("div");
            fila.className = "item-carrito";

            const informacion = document.createElement("div");

            const nombre = document.createElement("h4");
            nombre.textContent = item.nombre;

            const precio = document.createElement("p");
            precio.textContent = formatoPrecio(item.precio * item.cantidad);

            informacion.append(nombre, precio);

            const controles = document.createElement("div");
            controles.className = "controles-cantidad";

            const menos = document.createElement("button");
            menos.type = "button";
            menos.textContent = "−";
            menos.setAttribute("aria-label", "Quitar una unidad de " + item.nombre);
            menos.addEventListener("click", () => cambiarCantidad(item.id, -1));

            const cantidad = document.createElement("span");
            cantidad.textContent = item.cantidad;

            const mas = document.createElement("button");
            mas.type = "button";
            mas.textContent = "+";
            mas.setAttribute("aria-label", "Agregar una unidad de " + item.nombre);
            mas.addEventListener("click", () => cambiarCantidad(item.id, 1));

            controles.append(menos, cantidad, mas);

            const eliminar = document.createElement("button");
            eliminar.type = "button";
            eliminar.className = "eliminar";
            eliminar.textContent = "Quitar";
            eliminar.addEventListener("click", () => eliminarProducto(item.id));

            fila.append(informacion, controles, eliminar);
            listaCarrito.appendChild(fila);
        });
    }

    totalElemento.textContent = formatoPrecio(calcularTotal());

    const cantidadTotal = carrito.reduce((suma, item) => {
        return suma + item.cantidad;
    }, 0);

    contadorElemento.textContent = cantidadTotal;
}

document.querySelectorAll(".agregar").forEach(boton => {
    boton.addEventListener("click", () => {
        const id = Number(boton.dataset.id);
        agregarProducto(id);

        const textoOriginal = boton.textContent;
        boton.textContent = "✓ Agregado";

        setTimeout(() => {
            boton.textContent = textoOriginal;
        }, 900);
    });
});

document.querySelectorAll(".filtro").forEach(boton => {
    boton.addEventListener("click", () => {
        const categoria = boton.dataset.categoria;

        document.querySelectorAll(".filtro").forEach(filtro => {
            filtro.classList.remove("activo");
        });

        boton.classList.add("activo");

        document.querySelectorAll(".producto").forEach(producto => {
            const coincide =
                categoria === "todos" ||
                producto.dataset.categoria === categoria;

            producto.classList.toggle("oculto", !coincide);
        });
    });
});

document.getElementById("vaciar-carrito").addEventListener("click", () => {
    carrito.length = 0;
    mostrarCarrito();
});

document.getElementById("enviar-whatsapp").addEventListener("click", () => {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agrega al menos un producto.");
        return;
    }

    const nombre = document.getElementById("nombre-cliente").value.trim();
    const direccion = document.getElementById("direccion-cliente").value.trim();
    const notas = document.getElementById("notas-cliente").value.trim();

    if (!nombre) {
        alert("Por favor, escribe tu nombre para identificar el pedido.");
        document.getElementById("nombre-cliente").focus();
        return;
    }

    let mensaje = "¡Hola, Tacos Don Rigo! Quiero hacer este pedido:\n\n";
    mensaje += "Nombre: " + nombre + "\n";

    if (direccion) {
        mensaje += "Dirección de entrega: " + direccion + "\n";
    }

    mensaje += "\nPRODUCTOS:\n";

    carrito.forEach(item => {
        mensaje +=
            item.cantidad + " x " + item.nombre +
            " - " + formatoPrecio(item.precio * item.cantidad) + "\n";
    });

    mensaje += "\nTOTAL: " + formatoPrecio(calcularTotal()) + "\n";

    if (notas) {
        mensaje += "\nIndicaciones: " + notas + "\n";
    }

    mensaje += "\n¿Me pueden confirmar mi pedido, por favor?";

    const numeroWhatsApp = "523411579078";
    const enlace = "https://wa.me/" + numeroWhatsApp +
        "?text=" + encodeURIComponent(mensaje);

    window.open(enlace, "_blank", "noopener,noreferrer");
});

mostrarCarrito();