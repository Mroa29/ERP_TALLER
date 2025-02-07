import CONFIG from "../configURL.js";

document.addEventListener("DOMContentLoaded", async function () {
    const btnAgregarPintura = document.getElementById("btnAgregarPintura");
    const listaPinturasPresupuestadas = document.getElementById("listaPinturasPresupuestadas");
    const selectTarifaPintura = document.getElementById("tarifaPiezasPintadas");

    let tarifas = [];
    let sucursalesUsuario = [];

    // 📌 Obtener las sucursales permitidas para el usuario
    async function obtenerSucursalesUsuario() {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Usuario no autenticado. Inicie sesión.");

            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            const userId = decodedToken.id;

            const response = await fetch(`${CONFIG.API_BASE_URL}/api/usuarios/${userId}/sucursales`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Error al obtener las sucursales del usuario.");
            const sucursales = await response.json();
            return sucursales.map(sucursal => sucursal.id_sucursal);
        } catch (error) {
            console.error("Error al obtener las sucursales del usuario:", error);
            return [];
        }
    }

    // 📌 Cargar tarifas de pintura permitidas para el usuario
    async function cargarTarifas() {
        try {
            sucursalesUsuario = await obtenerSucursalesUsuario();
            if (sucursalesUsuario.length === 0) return;

            const response = await fetch(`${CONFIG.API_BASE_URL}/api/tarifasPintura`);
            if (!response.ok) throw new Error("Error al obtener tarifas.");

            const todasLasTarifas = await response.json();
            tarifas = todasLasTarifas.filter(tarifa => sucursalesUsuario.includes(tarifa.id_sucursal));

            // Rellenar el select con las tarifas permitidas
            selectTarifaPintura.innerHTML = '<option value="">Seleccione una tarifa</option>';
            tarifas.forEach(tarifa => {
                const option = document.createElement("option");
                option.value = tarifa.id_tarifa_piezas_pintadas;
                option.textContent = `${tarifa.descripcion_tarifa_piezas_pintadas} - $${tarifa.precio_por_pieza_pintada.toLocaleString()}`;
                selectTarifaPintura.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar tarifas:", error);
        }
    }

    // 📌 Agregar pieza a la base de datos y a la lista de tarjetas
    btnAgregarPintura.addEventListener("click", async function () {
        // Obtener valores de los campos
        const nombrePieza = document.getElementById("nombrePiezaPintada").value.trim();
        const cantidad = parseInt(document.getElementById("cantidadPiezasPintadas").value.trim(), 10);
        const idTarifa = selectTarifaPintura.value;
        const tarifaText = selectTarifaPintura.options[selectTarifaPintura.selectedIndex]?.text;

        // Obtener ID del presupuesto desde la cabecera
        const idPresupuesto = document.getElementById("idPresupuesto").textContent.trim();
        if (!idPresupuesto) {
            alert("Debe seleccionar un presupuesto antes de agregar una pintura.");
            return;
        }

        // Validaciones
        if (!nombrePieza || isNaN(cantidad) || cantidad <= 0 || !idTarifa) {
            alert("Debe completar todos los campos correctamente.");
            return;
        }

        // Obtener el precio de la tarifa
        const precioTarifa = tarifas.find(tarifa => tarifa.id_tarifa_piezas_pintadas == idTarifa)?.precio_por_pieza_pintada || 0;
        const valorTotal = cantidad * precioTarifa;

        // 📌 Datos para enviar al backend
        const data = {
            id_presupuesto: parseInt(idPresupuesto),
            nombre_pieza_pintada: nombrePieza,
            cantidad_piezas_pintadas: cantidad,
            id_tarifa_piezas_pintadas: parseInt(idTarifa)
        };

        try {
            // 📌 Enviar la pintura presupuestada al backend
            const token = localStorage.getItem("token");
            const response = await fetch(`${CONFIG.API_BASE_URL}/api/pintura-presupuestada`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : ""
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al agregar la pintura presupuestada.");
            }

            // 📌 Obtener el resultado de la API correctamente
            const result = await response.json();
            console.log("Pintura presupuestada agregada:", result);

            // 📌 Crear la tarjeta visualmente después de éxito
            const card = document.createElement("div");
            card.classList.add("card", "mt-3");
            card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${nombrePieza} (${cantidad})</h5>
                    <p class="card-text">Tarifa: ${tarifaText}</p>
                    <p class="card-text"><strong>Valor total:</strong> $${valorTotal.toLocaleString()}</p>
                    <button class="btn btn-danger btnEliminarPintura" data-id="${result.pintura.id_pintura_presupuestada}">Eliminar</button>
                </div>
            `;

            // Agregar la tarjeta a la lista de pinturas presupuestadas
            listaPinturasPresupuestadas.appendChild(card);

            // 📌 Evento para eliminar la tarjeta
            card.querySelector(".btnEliminarPintura").addEventListener("click", async function (event) {
                const idPintura = event.target.getAttribute("data-id");

                if (confirm("¿Seguro que desea eliminar esta pieza presupuestada?")) {
                    try {
                        const deleteResponse = await fetch(`${CONFIG.API_BASE_URL}/api/pintura-presupuestada/${idPintura}`, {
                            method: "DELETE",
                            headers: {
                                "Authorization": token ? `Bearer ${token}` : ""
                            }
                        });

                        if (!deleteResponse.ok) throw new Error("Error al eliminar la pintura presupuestada.");

                        card.remove();
                        alert("Pieza presupuestada eliminada correctamente.");
                    } catch (error) {
                        console.error("Error al eliminar pintura presupuestada:", error);
                        alert(error.message);
                    }
                }
            });

            alert("Pintura presupuestada agregada correctamente.");
        } catch (error) {
            console.error("Error al agregar pintura presupuestada:", error);
            alert(error.message);
        }
    });

    // 📌 Cargar tarifas al iniciar
    cargarTarifas();
});
