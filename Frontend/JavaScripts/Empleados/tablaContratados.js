import CONFIG from "../configURL.js";

document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("#tablalistadoContratdos tbody");
    const searchInput = document.getElementById("barraBuscarContratados");

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

        // Obtener empleados con contrato del mismo taller
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/empleados/con-contrato/${idTaller}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener los empleados contratados.");
        }

        const empleados = await response.json();

        // Obtener los nombres de los cargos para cada empleado
        await Promise.all(empleados.map(async empleado => {
            if (empleado.id_cargo) {
                try {
                    const cargoResponse = await fetch(`${CONFIG.API_BASE_URL}/api/cargos/${empleado.id_cargo}`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if (cargoResponse.ok) {
                        const cargoData = await cargoResponse.json();
                        empleado.cargo = cargoData.nom_cargo;
                    } else {
                        empleado.cargo = "No especificado";
                    }
                } catch (error) {
                    console.error(`Error al obtener el cargo para ID: ${empleado.id_cargo}`, error);
                    empleado.cargo = "Error al cargar";
                }
            } else {
                empleado.cargo = "No asignado";
            }
        }));

        renderizarTabla(empleados);

        // Agregar funcionalidad de búsqueda
        searchInput.addEventListener("input", () => {
            const filtro = searchInput.value.toLowerCase();
            const empleadosFiltrados = empleados.filter(empleado =>
                (empleado.nombre_empleado && empleado.nombre_empleado.toLowerCase().includes(filtro)) ||
                (empleado.rut_empleado && empleado.rut_empleado.toLowerCase().includes(filtro)) ||
                (empleado.cargo && empleado.cargo.toLowerCase().includes(filtro)) ||
                (empleado.email_empleado && empleado.email_empleado.toLowerCase().includes(filtro)) ||
                (empleado.telefono_empleado && empleado.telefono_empleado.toLowerCase().includes(filtro))
            );
            renderizarTabla(empleadosFiltrados);
        });

    } catch (error) {
        console.error("Error al cargar la tabla de empleados contratados:", error);
        alert("Error al cargar los empleados contratados. Por favor, intente nuevamente.");
    }

    function renderizarTabla(empleados) {
        tableBody.innerHTML = "";

        empleados.forEach(empleado => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${empleado.nombre_empleado}</td>
                <td>${empleado.rut_empleado}</td>
                <td>${empleado.cargo}</td>
                <td>${empleado.email_empleado || "No especificado"}</td>
                <td>${empleado.telefono_empleado || "No especificado"}</td>
                <td>
                    <button class="btn btn-info btn-sm btn-ver-contrato" data-rut="${empleado.rut_empleado}">
                        <i class="fas fa-eye"></i> Ver Contrato
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
});
