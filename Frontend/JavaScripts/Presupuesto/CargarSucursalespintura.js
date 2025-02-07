import CONFIG from "../configURL.js"; // 📌 Archivo de configuración con la URL de la API

document.addEventListener("DOMContentLoaded", async () => {
    const selectSucursalTarifa = document.getElementById("sucursalSelectTarifa");

    try {
        // 📌 Obtener el token del usuario
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Usuario no autenticado. Inicie sesión.");
        }

        // 📌 Decodificar el token para obtener el ID del usuario (JWT)
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userId = decodedToken.id;

        // 📌 Obtener las sucursales disponibles para el usuario
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/usuarios/${userId}/sucursales`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener las sucursales del usuario.");
        }

        const sucursales = await response.json();

        // 📌 Limpiar el select antes de agregar opciones
        selectSucursalTarifa.innerHTML = '<option value="" disabled selected>Seleccione una sucursal</option>';

        // 📌 Manejo de caso en que no haya sucursales disponibles
        if (sucursales.length === 0) {
            selectSucursalTarifa.innerHTML += '<option value="" disabled>No hay sucursales disponibles</option>';
            return;
        }

        // 📌 Agregar opciones con las sucursales disponibles
        sucursales.forEach(sucursal => {
            const option = document.createElement("option");
            option.value = sucursal.id_sucursal;
            option.textContent = sucursal.nombre_sucursal;
            selectSucursalTarifa.appendChild(option);
        });

        console.log("✅ Sucursales cargadas correctamente:", sucursales);

    } catch (error) {
        console.error("❌ Error al cargar las sucursales:", error);
        alert(error.message || "Error al cargar las sucursales. Intente nuevamente.");
    }
});
