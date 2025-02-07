import CONFIG from "../configURL.js";

document.addEventListener("DOMContentLoaded", function () {
    // 📌 Seleccionar los elementos necesarios
    const modalContrato = new bootstrap.Modal(document.getElementById("verContratoModal"));
    const tableBody = document.querySelector("#tablalistadoContratdos tbody");

    // 📌 Agregar evento a cada botón "Ver Contrato"
    tableBody.addEventListener("click", async function (event) {
        if (event.target.closest(".btn-ver-contrato")) {
            const btn = event.target.closest(".btn-ver-contrato");
            const rutEmpleado = btn.getAttribute("data-rut");

            if (!rutEmpleado) {
                alert("Error: No se encontró el RUT del empleado.");
                return;
            }

            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("Usuario no autenticado. Inicie sesión.");
                    return;
                }

                // 📌 Obtener datos del empleado
                const empleadoResponse = await fetch(`${CONFIG.API_BASE_URL}/api/empleados/${rutEmpleado}`, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
                });

                if (!empleadoResponse.ok) throw new Error("Error al obtener los datos del empleado.");

                const empleado = await empleadoResponse.json();

                // 📌 Obtener datos del contrato
                const contratoResponse = await fetch(`${CONFIG.API_BASE_URL}/api/contratos/contratado/${rutEmpleado}`, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
                });

                if (!contratoResponse.ok) throw new Error("Error al obtener los datos del contrato.");

                const contrato = await contratoResponse.json();

                // 📌 Llenar el modal con la información obtenida
                document.getElementById("verContratoNombre").value = empleado.nombre_empleado;
                document.getElementById("verContratoRut").value = empleado.rut_empleado;
                document.getElementById("verContratoCargo").value = contrato.tipo_contrato;
                document.getElementById("verContratoCorreo").value = empleado.email_empleado || "No especificado";
                document.getElementById("verContratoTelefono").value = empleado.telefono_empleado || "No especificado";
                document.getElementById("verContratoPrevision").value = empleado.prevision_salud_empleado || "No especificado";
                document.getElementById("verContratoRemuneracion").value = contrato.remuneracion_contrato;

                // 📌 Mostrar la firma del empleado (si existe)
                const firmaImg = document.getElementById("verFirmaEmpleado");
                if (contrato.direccion_firma_empleado) {
                    firmaImg.src = `${CONFIG.API_BASE_URL}${contrato.direccion_firma_empleado}`;
                    firmaImg.style.display = "block";
                } else {
                    firmaImg.style.display = "none";
                }

                // 📌 Mostrar el documento del contrato (si existe)
                const contratoLink = document.getElementById("verContratoDocumento");
                if (contrato.direccion_documento) {
                    contratoLink.href = `${CONFIG.API_BASE_URL}${contrato.direccion_documento}`;
                    contratoLink.style.display = "block";
                } else {
                    contratoLink.style.display = "none";
                }

                // 📌 Mostrar el modal
                modalContrato.show();

            } catch (error) {
                console.error("Error al cargar la información del contrato:", error);
                alert("Error al cargar la información del contrato.");
            }
        }
    });
});
