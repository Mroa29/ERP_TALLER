import CONFIG from "../configURL.js"; // 📌 Archivo de configuración con la URL base de la API

document.addEventListener("DOMContentLoaded", async function () {
    const selectTarifaManoObra = document.getElementById("tarifaManoObra");

    let tarifas = [];
    let sucursalesUsuario = [];

    // 📌 Obtener las sucursales permitidas para el usuario
    async function obtenerSucursalesUsuario() {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Usuario no autenticado. Inicie sesión.");

            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            const userId = decodedToken.id;

            const response = await fetch(`${CONFIG.API_BASE_URL}/api/usuarios/${userId}/sucursales`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Error al obtener las sucursales del usuario.");
            const sucursales = await response.json();
            return sucursales.map(sucursal => sucursal.id_sucursal);
        } catch (error) {
            console.error("Error al obtener las sucursales del usuario:", error);
            return [];
        }
    }

    // 📌 Cargar tarifas de mano de obra permitidas para el usuario
    async function cargarTarifas() {
        try {
            sucursalesUsuario = await obtenerSucursalesUsuario();
            if (sucursalesUsuario.length === 0) return;

            // Obtener todas las tarifas de mano de obra
            const response = await fetch(`${CONFIG.API_BASE_URL}/api/tarifas-mano-obra`);
            if (!response.ok) throw new Error("Error al obtener tarifas.");

            const todasLasTarifas = await response.json();
            
            // Filtrar tarifas según las sucursales permitidas del usuario
            tarifas = todasLasTarifas.filter(tarifa => sucursalesUsuario.includes(tarifa.id_sucursal));

            // Rellenar el select con las tarifas permitidas
            selectTarifaManoObra.innerHTML = '<option value="">Seleccione una tarifa</option>';
            tarifas.forEach(tarifa => {
                const option = document.createElement("option");
                option.value = tarifa.id_tarifa_mano_de_obra;
                option.textContent = `${tarifa.descripcion_tarifa_mano_de_obra} - $${tarifa.precio_por_pieza_mano_de_obra}`;
                selectTarifaManoObra.appendChild(option);
            });

        } catch (error) {
            console.error("Error al cargar tarifas:", error);
        }
    }

    // 📌 Cargar tarifas al iniciar
    cargarTarifas();
});
