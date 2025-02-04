document.addEventListener("DOMContentLoaded", async () => {
    const selectSucursalTarifa = document.getElementById("sucursalSelectTarifa");

    try {
        // 📌 Obtener el token del usuario (si es necesario para la autenticación)
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Usuario no autenticado. Inicie sesión.");
        }

        // 📌 Decodificar el token para obtener el ID del usuario (asumiendo que es un JWT)
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userId = decodedToken.id;

        // 📌 Obtener las sucursales disponibles para el usuario desde la API
        const response = await fetch(`http://localhost:3000/api/usuarios/${userId}/sucursales`, {
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
        selectSucursalTarifa.innerHTML = '<option value="" disabled selected>Seleccione una sucursal</option>';

        sucursales.forEach(sucursal => {
            const option = document.createElement("option");
            option.value = sucursal.id_sucursal;
            option.textContent = sucursal.nombre_sucursal;
            selectSucursalTarifa.appendChild(option);
        });

    } catch (error) {
        console.error("Error al cargar las sucursales:", error);
        alert("Error al cargar las sucursales. Intente nuevamente.");
    }
});
