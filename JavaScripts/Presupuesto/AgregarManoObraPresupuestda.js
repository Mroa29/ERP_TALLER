document.addEventListener("DOMContentLoaded", async function () {
    const btnAgregarManoObra = document.getElementById("btnAgregarManoObra");
    const listaPinturasPresupuestadasManoObra = document.getElementById("listaManoObraPresupuestada");
    const selectTarifaManoObra = document.getElementById("tarifaManoObra");

    let tarifas = [];
    let sucursalesUsuario = [];

    // 📌 Obtener las sucursales permitidas para el usuario
    async function obtenerSucursalesUsuario() {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Usuario no autenticado. Inicie sesión.");

            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            const userId = decodedToken.id;

            const response = await fetch(`http://localhost:3000/api/usuarios/${userId}/sucursales`, {
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

    // 📌 Cargar tarifas de mano de obra permitidas para el usuario
    async function cargarTarifas() {
        try {
            sucursalesUsuario = await obtenerSucursalesUsuario();
            if (sucursalesUsuario.length === 0) return;

            const response = await fetch("http://localhost:3000/api/tarifas-mano-obra");
            if (!response.ok) throw new Error("Error al obtener tarifas.");

            const todasLasTarifas = await response.json();
            tarifas = todasLasTarifas.filter(tarifa => sucursalesUsuario.includes(tarifa.id_sucursal));

            // Rellenar el select con las tarifas permitidas
            selectTarifaManoObra.innerHTML = '<option value="">Seleccione una tarifa</option>';
            tarifas.forEach(tarifa => {
                const option = document.createElement("option");
                option.value = tarifa.id_tarifa_mano_de_obra;
                option.textContent = `${tarifa.descripcion_tarifa_mano_de_obra} - $${tarifa.precio_por_pieza_mano_de_obra}`;
                selectTarifaManoObra.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar tarifas:", error);
        }
    }

    // 📌 Agregar pieza de mano de obra a la base de datos y a la lista de tarjetas
    btnAgregarManoObra.addEventListener("click", async function () {
        // Obtener valores de los campos
        const nombrePieza = document.getElementById("nombrePiezaManoObra").value.trim();
        const cantidad = parseInt(document.getElementById("cantidadPiezasManoObra").value.trim(), 10);
        const idTarifa = selectTarifaManoObra.value;
        const tarifaText = selectTarifaManoObra.options[selectTarifaManoObra.selectedIndex].text;

        // Obtener ID del presupuesto desde la cabecera
        const idPresupuesto = document.getElementById("idPresupuestoManoObra").textContent.trim();
        if (!idPresupuesto) {
            alert("Debe seleccionar un presupuesto antes de agregar una mano de obra.");
            return;
        }

        // Validaciones
        if (!nombrePieza || isNaN(cantidad) || cantidad <= 0 || !idTarifa) {
            alert("Debe completar todos los campos correctamente.");
            return;
        }

        // Obtener el precio de la tarifa
        const precioTarifa = parseInt(tarifaText.match(/\$(\d+)/)?.[1], 10) || 0;
        const valorTotal = cantidad * precioTarifa;

        // 📌 Datos para enviar al backend
        const data = {
            id_presupuesto: parseInt(idPresupuesto),
            nombre_pieza_mano_obra: nombrePieza,
            cantidad_piezas_mano_obra: cantidad,
            id_tarifa_mano_de_obra: parseInt(idTarifa)
        };

        try {
            // 📌 Enviar la mano de obra presupuestada al backend
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/mano-de-obra-presupuestada", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : ""
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.message.includes("duplicate key")) {
                    throw new Error("Esta pieza ya está presupuestada en este presupuesto.");
                }
                throw new Error(errorData.message || "Error al agregar la mano de obra presupuestada.");
            }

            // 📌 Obtener el resultado de la API correctamente
            const result = await response.json();
            console.log("Mano de obra presupuestada agregada:", result.manoDeObra.id_mano_obra);

            if (!result || !result.manoDeObra.id_mano_obra) {
                throw new Error("Error: El backend no devolvió un ID válido para la mano de obra presupuestada.");
            }

            // 📌 Crear la tarjeta visualmente después de éxito
            const card = document.createElement("div");
            card.classList.add("card", "mt-3");
            card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${nombrePieza} (${cantidad})</h5>
                    <p class="card-text">Tarifa: ${tarifaText}</p>
                    <p class="card-text"><strong>Valor total:</strong> $${valorTotal.toLocaleString()}</p>
                    <button class="btn btn-danger btnEliminarManoObra" data-id="${result.manoDeObra.id_mano_obra}">Eliminar</button>
                </div>
            `;

            // Agregar la tarjeta a la lista de mano de obra presupuestada
            listaPinturasPresupuestadasManoObra.appendChild(card);

            // 📌 Evento para eliminar la tarjeta
            card.querySelector(".btnEliminarManoObra").addEventListener("click", async function (event) {
                const idManoObra = event.target.getAttribute("data-id");
                if (!idManoObra) {
                    alert("No se encontró el ID de la mano de obra presupuestada.");
                    return;
                }

                const confirmacion = confirm("¿Seguro que desea eliminar esta mano de obra presupuestada?");
                if (!confirmacion) return;

                try {
                    const deleteResponse = await fetch(`http://localhost:3000/api/mano-de-obra-presupuestada/${idManoObra}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": token ? `Bearer ${token}` : ""
                        }
                    });

                    if (!deleteResponse.ok) {
                        throw new Error("Error al eliminar la mano de obra presupuestada.");
                    }

                    card.remove();
                    alert("Mano de obra presupuestada eliminada correctamente.");
                } catch (error) {
                    console.error("Error al eliminar mano de obra presupuestada:", error);
                    alert(error.message);
                }
            });

            alert("Mano de obra presupuestada agregada correctamente.");
        } catch (error) {
            console.error("Error al agregar mano de obra presupuestada:", error);
            alert(error.message);
        }
    });

    // 📌 Cargar tarifas al iniciar
    cargarTarifas();
});
