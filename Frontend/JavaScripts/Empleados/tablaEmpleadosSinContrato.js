import CONFIG from "../configURL.js";

document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("#tablalistadoempleados tbody");
    const searchInput = document.getElementById("barraBuscarEmpleados");

    try {
        // Obtener el token del localStorage
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Usuario no autenticado. Por favor, inicie sesión.");
        }

        // Decodificar el token para obtener el ID del usuario
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userId = decodedToken.id;

        // Obtener los datos del usuario para obtener el ID del taller
        const userResponse = await fetch(`${CONFIG.API_BASE_URL}/api/usuarios/${userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!userResponse.ok) {
            throw new Error("Error al obtener la información del usuario.");
        }

        const userData = await userResponse.json();
        const idTaller = userData.user.taller;

        // Obtener empleados sin contrato del mismo taller
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/empleados/sin-contrato/${idTaller}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener los empleados sin contrato.");
        }

        const empleados = await response.json();
        renderizarTabla(empleados);

        // Agregar funcionalidad de búsqueda
        searchInput.addEventListener("input", () => {
            const filtro = searchInput.value.toLowerCase();
            const empleadosFiltrados = empleados.filter(empleado =>
                empleado.nombre_empleado.toLowerCase().includes(filtro) ||
                empleado.rut_empleado.toLowerCase().includes(filtro)
            );
            renderizarTabla(empleadosFiltrados);
        });

    } catch (error) {
        console.error("Error al cargar la tabla de empleados sin contrato:", error);
        alert("Error al cargar los empleados. Por favor, intente nuevamente.");
    }

    function renderizarTabla(empleados) {
        tableBody.innerHTML = "";

        empleados.forEach(empleado => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${empleado.nombre}</td>
                <td>${empleado.rut}</td>
                <td>${empleado.cargo || "No especificado"}</td>
                <td>${empleado.email}</td>
                <td>${empleado.telefono || "No especificado"}</td>
                <td>
                    <button class="btn btn-success btn-sm btn-contratar" data-rut="${empleado.rut}">
                        <i class="fas fa-file-signature"></i> Contratar
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Agregar evento a los botones "Contratar"
        document.querySelectorAll(".btn-contratar").forEach(button => {
            button.addEventListener("click", async () => {
                const rut = button.getAttribute("data-rut");
                await cargarDatosEmpleado(rut);
                const modal = new bootstrap.Modal(document.getElementById("contratarEmpleadoModal"));
                modal.show();
            });
        });
    }

    async function cargarDatosEmpleado(rut) {
        try {
            console.log(`Obteniendo datos del empleado con RUT: ${rut}`);

            const response = await fetch(`${CONFIG.API_BASE_URL}/api/empleados/${rut}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Error al obtener la información del empleado.");
            }

            const empleado = await response.json();
            console.log("Empleado obtenido:", empleado);

            // Llenar los campos del modal con los datos del empleado
            document.getElementById("contratoNombreEmpleado").value = empleado.nombre_empleado || "";
            document.getElementById("contratoRutEmpleado").value = empleado.rut_empleado || "";
            document.getElementById("contratoCargoEmpleado").value = empleado.id_cargo || "No especificado";
            document.getElementById("contratoCorreoEmpleado").value = empleado.email_empleado || "";
            document.getElementById("contratoTelefonoEmpleado").value = empleado.telefono_empleado || "No especificado";
            document.getElementById("contratoPrevisionEmpleado").value = empleado.prevision_salud_empleado || "No especificado";

            // Cargar el select de tipo de contrato
            await cargarTiposContrato();

        } catch (error) {
            console.error("Error al cargar la información del empleado:", error);
            alert("Error al cargar la información del empleado. Intente nuevamente.");
        }
    }

    async function cargarTiposContrato() {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/api/tiposcontrato`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Error al obtener los tipos de contrato.");
            }

            const tiposContrato = await response.json();
            const selectContrato = document.getElementById("tipoContrato");
            selectContrato.innerHTML = '<option value="" disabled selected>Seleccione un tipo de contrato</option>';

            tiposContrato.forEach(tipo => {
                const option = document.createElement("option");
                option.value = tipo.id_tipo_contrato;
                option.textContent = tipo.descripcion;
                selectContrato.appendChild(option);
            });

        } catch (error) {
            console.error("Error al cargar los tipos de contrato:", error);
            alert("Error al cargar los tipos de contrato.");
        }
    }
});
