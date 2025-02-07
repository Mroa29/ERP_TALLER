import CONFIG from "../configURL.js";

document.addEventListener("DOMContentLoaded", async () => {
    const selectSucursal = document.getElementById("sucursalInsumo");

    try {
        // 📌 Obtener el token del usuario
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Usuario no autenticado. Inicie sesión.");
        }

        // 📌 Decodificar el token para obtener el ID del usuario
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
        
        // 📌 Limpiar y llenar el select con las sucursales disponibles
        selectSucursal.innerHTML = '<option value="" disabled selected>Seleccione una sucursal</option>';

        sucursales.forEach(sucursal => {
            const option = document.createElement("option");
            option.value = sucursal.id_sucursal;
            option.textContent = sucursal.nombre_sucursal;
            selectSucursal.appendChild(option);
        });

    } catch (error) {
        console.error("Error al cargar las sucursales:", error);
        alert("Error al cargar las sucursales. Intente nuevamente.");
    }
});
