import CONFIG from "../configURL.js";

document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.querySelector("#tablahistorialinsumos tbody");
    const searchInput = document.getElementById("barraBuscarHistorial");

    try {
        // 📌 Obtener el token del usuario
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Usuario no autenticado. Inicie sesión.");
        }

        // 📌 Decodificar el token para obtener el ID del usuario
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userId = decodedToken.id;

        // 📌 Obtener las sucursales asociadas al usuario
        const sucursalResponse = await fetch(`${CONFIG.API_BASE_URL}/api/usuarios/${userId}/sucursales`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!sucursalResponse.ok) {
            throw new Error("Error al obtener las sucursales del usuario.");
        }

        const sucursales = await sucursalResponse.json();
        if (sucursales.length === 0) {
            throw new Error("El usuario no tiene sucursales asignadas.");
        }

        // 📌 Crear un mapa con los nombres de las sucursales
        const sucursalMap = {};
        sucursales.forEach(sucursal => {
            sucursalMap[sucursal.id_sucursal] = sucursal.nombre_sucursal;
        });

        // 📌 Obtener los IDs de las sucursales
        const sucursalIds = sucursales.map(sucursal => sucursal.id_sucursal);

        // 📌 Obtener los ítems específicos de las sucursales del usuario
        const itemResponse = await fetch(`${CONFIG.API_BASE_URL}/api/item-especifico?sucursales=${sucursalIds.join(",")}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!itemResponse.ok) {
            throw new Error("Error al obtener el historial de insumos.");
        }

        let items = await itemResponse.json();

        // 📌 Ordenar los registros de más reciente a más antiguo
        items.sort((a, b) => new Date(b.fecha_ingreso_item) - new Date(a.fecha_ingreso_item));

        // 📌 Obtener los detalles de los insumos en base a sus ID
        const insumoIds = [...new Set(items.map(item => item.id_insumo))];
        const insumosResponse = await fetch(`${CONFIG.API_BASE_URL}/api/insumos?ids=${insumoIds.join(",")}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!insumosResponse.ok) {
            throw new Error("Error al obtener los insumos.");
        }

        const insumos = await insumosResponse.json();
        const insumoMap = {};
        insumos.forEach(insumo => {
            insumoMap[insumo.id_insumo] = insumo.descripcion_insumo;
        });

        renderizarTabla(items, insumoMap, sucursalMap);

        // 📌 Funcionalidad de búsqueda
        searchInput.addEventListener("input", function () {
            const filtro = searchInput.value.toLowerCase();
            const itemsFiltrados = items.filter(item =>
                insumoMap[item.id_insumo].toLowerCase().includes(filtro) ||
                item.cantidad_insumo.toString().includes(filtro) ||
                calcularFechaOperacion(item.fecha_ingreso_item).includes(filtro) ||
                sucursalMap[item.id_sucursal].toLowerCase().includes(filtro)
            );
            renderizarTabla(itemsFiltrados, insumoMap, sucursalMap);
        });

    } catch (error) {
        console.error("❌ Error al cargar la tabla de historial de insumos:", error);
        alert("Error al cargar el historial de insumos. Intente nuevamente.");
    }

    function renderizarTabla(items, insumoMap, sucursalMap) {
        tableBody.innerHTML = "";

        items.forEach(item => {
            const row = document.createElement("tr");

            // 📌 Determinar si la operación es Entrada o Salida
            const operacion = item.cantidad_insumo > 0 ? "Entrada" : "Salida";
            const colorOperacion = item.cantidad_insumo > 0 ? "green" : "red";
            const cantidadFormato = item.cantidad_insumo > 0 
                ? `+${item.cantidad_insumo}` 
                : `${item.cantidad_insumo}`;

            row.innerHTML = `
                <td>${insumoMap[item.id_insumo] || "Desconocido"}</td>
                <td style="font-weight: bold;">${cantidadFormato}</td>
                <td style="color: ${colorOperacion}; font-weight: bold;">${operacion}</td>
                <td>${calcularFechaOperacion(item.fecha_ingreso_item)}</td>
                <td>${sucursalMap[item.id_sucursal] || "No asignado"}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function calcularFechaOperacion(fechaOperacion) {
        if (!fechaOperacion) return "Desconocida";

        const fecha = new Date(fechaOperacion);
        return fecha.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }
});
