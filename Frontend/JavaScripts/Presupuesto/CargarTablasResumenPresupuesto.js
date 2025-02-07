import CONFIG from "../configURL.js"; // 📌 Archivo de configuración con la URL base de la API

document.addEventListener("DOMContentLoaded", function () {
    const idPresupuestoElement = document.getElementById("idPresupuestoResumen");
    const tablaPintura = document.getElementById("tablaPinturaResumen").querySelector("tbody");
    const tablaManoObra = document.getElementById("tablaManoObraResumen").querySelector("tbody");
    const tablaRepuestos = document.getElementById("tablaRepuestosResumen").querySelector("tbody");
    const tablaCobros = document.getElementById("tablaCobrosResumen").querySelector("tbody");

    let idPresupuestoSeleccionado = null;

    // 📌 Evento para actualizar las tablas cuando cambia el ID de presupuesto
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("list-group-item")) {
            idPresupuestoSeleccionado = idPresupuestoElement.textContent.trim();
            if (idPresupuestoSeleccionado) {
                cargarPinturaPresupuestada(idPresupuestoSeleccionado);
                cargarManoObraPresupuestada(idPresupuestoSeleccionado);
                cargarRepuestosPresupuestados(idPresupuestoSeleccionado);
                cargarCobros(idPresupuestoSeleccionado);
            }
        }
    });

    // 📌 Función para obtener y mostrar PINTURA PRESUPUESTADA con tarifas
    async function cargarPinturaPresupuestada(idPresupuesto) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/api/pintura-presupuestada/presupuesto/${idPresupuesto}`);
            if (!response.ok) throw new Error("Error al obtener pintura presupuestada.");

            const pinturas = await response.json();
            tablaPintura.innerHTML = ""; 

            for (let pintura of pinturas) {
                try {
                    const tarifaResponse = await fetch(`${CONFIG.API_BASE_URL}/api/tarifasPintura/${pintura.id_tarifa_piezas_pintadas}`);
                    if (!tarifaResponse.ok) throw new Error(`Error al obtener la tarifa de pintura para ${pintura.nombre_pieza_pintada}.`);

                    const tarifa = await tarifaResponse.json();
                    const precioTotal = pintura.cantidad_piezas_pintadas * tarifa.precio_por_pieza_pintada;

                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${pintura.nombre_pieza_pintada}</td>
                        <td>${pintura.cantidad_piezas_pintadas}</td>
                        <td>${tarifa.descripcion_tarifa_piezas_pintadas}</td>
                        <td>$${precioTotal.toLocaleString()}</td>
                    `;
                    tablaPintura.appendChild(row);
                } catch (error) {
                    console.error("Error al obtener tarifa de pintura:", error);
                }
            }
        } catch (error) {
            console.error("Error al cargar pintura presupuestada:", error);
        }
    }

    // 📌 Función para obtener y mostrar MANO DE OBRA PRESUPUESTADA con tarifas
    async function cargarManoObraPresupuestada(idPresupuesto) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/api/mano-de-obra-presupuestada/${idPresupuesto}`);
            if (!response.ok) throw new Error("Error al obtener mano de obra presupuestada.");

            const manoObra = await response.json();
            tablaManoObra.innerHTML = ""; 

            for (let mano of manoObra) {
                try {
                    const tarifaResponse = await fetch(`${CONFIG.API_BASE_URL}/api/tarifas-mano-obra/${mano.id_tarifa_mano_de_obra}`);
                    if (!tarifaResponse.ok) throw new Error(`Error al obtener la tarifa de mano de obra para ${mano.nombre_pieza_mano_obra}.`);

                    const tarifa = await tarifaResponse.json();
                    const precioTotal = mano.cantidad_piezas_mano_obra * tarifa.precio_por_pieza_mano_de_obra;

                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${mano.nombre_pieza_mano_de_obra}</td>
                        <td>${mano.cantidad_piezas_mano_obra}</td>
                        <td>${tarifa.descripcion_tarifa_mano_de_obra}</td>
                        <td>$${precioTotal.toLocaleString()}</td>
                    `;
                    tablaManoObra.appendChild(row);
                } catch (error) {
                    console.error("Error al obtener tarifa de mano de obra:", error);
                }
            }
        } catch (error) {
            console.error("Error al cargar mano de obra presupuestada:", error);
        }
    }

    // 📌 Función para obtener y mostrar REPUESTOS PRESUPUESTADOS
    async function cargarRepuestosPresupuestados(idPresupuesto) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/api/repuestos-presupuestados/presupuesto/${idPresupuesto}`);
            if (!response.ok) throw new Error("Error al obtener repuestos presupuestados.");

            const repuestos = await response.json();
            tablaRepuestos.innerHTML = "";

            repuestos.forEach(repuesto => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${repuesto.nombre_pieza_repuesto}</td>
                    <td>$${repuesto.precio_pieza_repuesto.toLocaleString()}</td>
                `;
                tablaRepuestos.appendChild(row);
            });
        } catch (error) {
            console.error("Error al cargar repuestos presupuestados:", error);
        }
    }

    // 📌 Función para obtener y mostrar COBROS
    async function cargarCobros(idPresupuesto) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/api/cobros/presupuesto/${idPresupuesto}`);
            if (!response.ok) throw new Error("Error al obtener cobros.");

            const cobros = await response.json();
            tablaCobros.innerHTML = "";

            cobros.forEach(cobro => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${cobro.numero_recibo}</td>
                    <td>$${cobro.cantidad_cobrada_cobros.toLocaleString()}</td>
                    <td>${cobro.forma_pago_cobros}</td>
                    <td>${cobro.fecha_cobro}</td>
                    <td>${cobro.descripcion_cobros || "Sin descripción"}</td>
                `;
                tablaCobros.appendChild(row);
            });
        } catch (error) {
            console.error("Error al cargar cobros:", error);
        }
    }
});
