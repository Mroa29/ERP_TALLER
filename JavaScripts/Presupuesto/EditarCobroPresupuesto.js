document.addEventListener("DOMContentLoaded", function () {
    const formEditCobro = document.getElementById("formEditCobro");
    const modalEditCobro = new bootstrap.Modal(document.getElementById("editModal"));
    let idCobroSeleccionado = null;

    // 📌 Evento para abrir el modal de edición con los datos del cobro seleccionado
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("btnEditarCobro")) {
            idCobroSeleccionado = event.target.getAttribute("data-id");
            cargarDatosCobro(idCobroSeleccionado);
            modalEditCobro.show();
        }
    });

    // 📌 Función para cargar los datos del cobro en el modal
    async function cargarDatosCobro(idCobro) {
        try {
            const response = await fetch(`http://localhost:3000/api/cobros/${idCobro}`);
            if (!response.ok) throw new Error("Error al obtener los datos del cobro.");

            const cobro = await response.json();

            // Formatear fecha a YYYY-MM-DD para el input date
            const fechaFormateada = cobro.fecha_cobro ? new Date(cobro.fecha_cobro).toISOString().split("T")[0] : "";

            // Cargar datos en el formulario
            document.getElementById("editNumeroReciboCobro").value = cobro.numero_recibo || "";
            document.getElementById("editImporteCobradoCorbo").value = cobro.cantidad_cobrada_cobros || "";
            document.getElementById("editFormaPagoCobro").value = cobro.forma_pago_cobros || "Efectivo";
            document.getElementById("editFechaCobro").value = fechaFormateada;
            document.getElementById("editDescripcionCobro").value = cobro.descripcion_cobro || "";
        } catch (error) {
            console.error("Error al cargar los datos del cobro:", error);
            alert("Hubo un error al cargar los datos del cobro.");
        }
    }

    // 📌 Evento para guardar los cambios en el cobro
    formEditCobro.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (!idCobroSeleccionado) {
            alert("No se ha seleccionado ningún cobro para editar.");
            return;
        }

        // Obtener los datos del formulario
        const data = {
            numero_recibo: document.getElementById("editNumeroReciboCobro").value.trim(),
            cantidad_cobrada: parseInt(document.getElementById("editImporteCobradoCorbo").value.trim(), 10),
            forma_pago: document.getElementById("editFormaPagoCobro").value.trim(),
            fecha_cobro: document.getElementById("editFechaCobro").value.trim(),
            descripcion: document.getElementById("editDescripcionCobro").value.trim(),
        };

        try {
            const response = await fetch(`http://localhost:3000/api/cobros/${idCobroSeleccionado}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error("Error al actualizar el cobro.");

            // Actualizar la tabla sin recargar la página
            actualizarFilaCobro(idCobroSeleccionado, data);

            alert("Cobro actualizado correctamente.");
            modalEditCobro.hide();
        } catch (error) {
            console.error("Error al actualizar el cobro:", error);
            alert("Hubo un error al actualizar el cobro.");
        }
    });

    // 📌 Función para actualizar una fila en la tabla después de editar
    function actualizarFilaCobro(id, data) {
        const fila = document.querySelector(`tr[data-id='${id}']`);
        if (!fila) return;

        // Formatear la fecha para la visualización en la tabla (DD/MM/YYYY)
        const fecha = new Date(data.fecha_cobro).toLocaleDateString("es-ES");

        fila.innerHTML = `
            <td>${data.numero_recibo}</td>
            <td>$${data.cantidad_cobrada.toLocaleString()}</td>
            <td>${data.forma_pago}</td>
            <td>${fecha}</td>
            <td>${data.descripcion}</td>
            <td>
                <button class="btn btn-warning btnEditarCobro" data-id="${id}">Editar</button>
            </td>
        `;
    }
});
