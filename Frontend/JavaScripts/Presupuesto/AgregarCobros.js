import CONFIG from "../configURL.js";

document.addEventListener("DOMContentLoaded", async function () {
    const formCobro = document.getElementById("formCobro");
    const tablaCobros = document.getElementById("tablacobrosacuenta").querySelector("tbody");

    // 📌 Evento para agregar un cobro
    formCobro.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Obtener ID del presupuesto desde la cabecera
        const idPresupuesto = document.getElementById("idPresupuestoCobros").textContent.trim();
        if (!idPresupuesto) {
            alert("Debe seleccionar un presupuesto antes de agregar un cobro.");
            return;
        }

        // Obtener valores del formulario
        const numeroRecibo = document.getElementById("numeroRecibo").value.trim();
        const importeCobrado = parseInt(document.getElementById("importeCobrado").value.trim(), 10);
        const formaPago = document.getElementById("formaPago").value;
        const fechaCobro = document.getElementById("fechaCobro").value;
        const descripcion = document.getElementById("descripcion").value.trim();

        // Validaciones
        if (!numeroRecibo || isNaN(importeCobrado) || !fechaCobro) {
            alert("Debe completar todos los campos obligatorios.");
            return;
        }

        if (importeCobrado <= 0) {
            alert("El importe cobrado debe ser un valor positivo.");
            return;
        }

        // 📌 Datos para enviar al backend
        const data = {
            id_presupuesto: parseInt(idPresupuesto),
            cantidad_cobrada: importeCobrado,
            forma_pago: formaPago,
            fecha_cobro: fechaCobro,
            numero_recibo: numeroRecibo,
            descripcion: descripcion
        };

        try {
            // 📌 Enviar el cobro al backend
            const token = localStorage.getItem("token");
            const response = await fetch(`${CONFIG.API_BASE_URL}/api/cobros`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : ""
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error("Error al agregar el cobro.");
            }

            const result = await response.json();
            console.log("Cobro agregado:", result);

            // 📌 Agregar el cobro a la tabla (al inicio para orden inverso)
            agregarFilaCobro(result.cobro, true);

            // Limpiar el formulario
            formCobro.reset();

            alert("Cobro agregado correctamente.");
        } catch (error) {
            console.error("Error al agregar cobro:", error);
            alert(error.message);
        }
    });

    // 📌 Función para agregar una fila de cobro a la tabla
    function agregarFilaCobro(cobro, agregarAlInicio = false) {
        const fila = document.createElement("tr");
        const fecha = new Date(cobro.fecha_cobro).toLocaleDateString("es-ES");

        fila.innerHTML = `
            <td>${cobro.numero_recibo}</td>
            <td>$${new Intl.NumberFormat("es-CL").format(cobro.cantidad_cobrada)}</td>
            <td>${cobro.forma_pago}</td>
            <td>${fecha}</td>
            <td>${cobro.descripcion || "-"}</td>
            <td>
                <button class="btn btn-warning btn-sm btnEditarCobro" data-id="${cobro.id_cobro}">
                    Editar
                </button>
            </td>
        `;

        // 📌 Insertar en la primera posición para mantener orden inverso
        if (agregarAlInicio) {
            tablaCobros.prepend(fila);
        } else {
            tablaCobros.appendChild(fila);
        }
    }
});
