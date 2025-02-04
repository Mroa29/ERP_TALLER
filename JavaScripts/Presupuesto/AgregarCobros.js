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
        const importeCobrado = document.getElementById("importeCobrado").value.trim();
        const formaPago = document.getElementById("formaPago").value;
        const fechaCobro = document.getElementById("fechaCobro").value;
        const descripcion = document.getElementById("descripcion").value.trim();

        // Validaciones
        if (!numeroRecibo || !importeCobrado || !fechaCobro) {
            alert("Debe completar todos los campos obligatorios.");
            return;
        }

        // 📌 Datos para enviar al backend
        const data = {
            id_presupuesto: parseInt(idPresupuesto),
            cantidad_cobrada: parseInt(importeCobrado),
            forma_pago: formaPago,
            fecha_cobro: fechaCobro,
            numero_recibo: numeroRecibo,
            descripcion: descripcion
        };

        try {
            // 📌 Enviar el cobro al backend
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:3000/api/cobros", {
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

            // 📌 Agregar el cobro a la tabla
            agregarFilaCobro(result.cobro);

            // Limpiar el formulario
            formCobro.reset();

            alert("Cobro agregado correctamente.");
        } catch (error) {
            console.error("Error al agregar cobro:", error);
            alert(error.message);
        }
    });

    // 📌 Función para agregar una fila de cobro a la tabla
    function agregarFilaCobro(cobro) {
        const fila = document.createElement("tr");
        const fecha = new Date(cobro.fecha_cobro).toLocaleDateString("es-ES");

        fila.innerHTML = `
            <td>${cobro.numero_recibo}</td>
            <td>$${cobro.cantidad_cobrada_cobros.toLocaleString()}</td>
            <td>${cobro.forma_pago_cobros}</td>
            <td>${fecha}</td>
            <td>${cobro.descripcion_cobro || "-"}</td>
            <td>
                <button class="btn btn-warning btn-sm btnEditarCobro" data-id="${cobro.id_cobro}">
                    Editar
                </button>
            </td>
        `;

        tablaCobros.appendChild(fila);
    }
});
