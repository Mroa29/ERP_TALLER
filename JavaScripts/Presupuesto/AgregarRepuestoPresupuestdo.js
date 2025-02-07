import CONFIG from "../configURL.js";

document.addEventListener("DOMContentLoaded", async function () {
    const btnAgregarRepuesto = document.getElementById("btnAgregarRepuesto");
    const listaRepuestosPresupuestados = document.getElementById("listaRepuestosPresupuestados");

    // 📌 Obtener el token del usuario
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Usuario no autenticado. Inicie sesión.");
        window.location.href = "../login/loginkronos.html";
        return;
    }

    // 📌 Agregar repuesto a la base de datos y a la lista de tarjetas
    btnAgregarRepuesto.addEventListener("click", async function () {
        // Obtener valores de los campos
        const nombrePieza = document.getElementById("nombrePiezaRepuesto").value.trim();
        const precioPieza = parseInt(document.getElementById("precioPiezaRepuesto").value.trim(), 10);

        // Obtener ID del presupuesto desde la cabecera
        const idPresupuesto = document.getElementById("idPresupuestoRepuestos").textContent.trim();
        if (!idPresupuesto) {
            alert("Debe seleccionar un presupuesto antes de agregar un repuesto.");
            return;
        }

        // Validaciones
        if (!nombrePieza || isNaN(precioPieza) || precioPieza <= 0) {
            alert("Debe completar todos los campos correctamente.");
            return;
        }

        // 📌 Datos para enviar al backend
        const data = {
            id_presupuesto: parseInt(idPresupuesto),
            nombre_pieza_repuesto: nombrePieza,
            precio_pieza_repuesto: precioPieza
        };

        try {
            // 📌 Enviar el repuesto presupuestado al backend
            const response = await fetch(`${CONFIG.API_BASE_URL}/api/repuestos-presupuestados`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al agregar el repuesto presupuestado.");
            }

            // 📌 Obtener el resultado de la API correctamente
            const result = await response.json();
            console.log("Repuesto presupuestado agregado:", result);

            if (!result || !result.repuesto?.id_repuestos_presupuestado) {
                throw new Error("Error: El backend no devolvió un ID válido para el repuesto presupuestado.");
            }

            // 📌 Crear la tarjeta visualmente después de éxito
            const card = document.createElement("div");
            card.classList.add("card", "mt-3");
            card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${nombrePieza}</h5>
                    <p class="card-text"><strong>Precio:</strong> $${precioPieza.toLocaleString()}</p>
                    <button class="btn btn-danger btnEliminarRepuesto" data-id="${result.repuesto.id_repuestos_presupuestado}">Eliminar</button>
                </div>
            `;

            // Agregar la tarjeta a la lista de repuestos presupuestados
            listaRepuestosPresupuestados.appendChild(card);

            // 📌 Evento para eliminar la tarjeta
            card.querySelector(".btnEliminarRepuesto").addEventListener("click", async function (event) {
                const idRepuesto = event.target.getAttribute("data-id");

                if (confirm("¿Seguro que desea eliminar este repuesto presupuestado?")) {
                    try {
                        const deleteResponse = await fetch(`${CONFIG.API_BASE_URL}/api/repuestos-presupuestados/${idRepuesto}`, {
                            method: "DELETE",
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        });

                        if (!deleteResponse.ok) throw new Error("Error al eliminar el repuesto presupuestado.");

                        card.remove();
                        alert("Repuesto presupuestado eliminado correctamente.");
                    } catch (error) {
                        console.error("Error al eliminar repuesto presupuestado:", error);
                        alert(error.message);
                    }
                }
            });

            alert("Repuesto presupuestado agregado correctamente.");
        } catch (error) {
            console.error("Error al agregar repuesto presupuestado:", error);
            alert(error.message);
        }
    });
});
