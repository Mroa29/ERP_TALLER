document.addEventListener("DOMContentLoaded", async function () {
    const tableBody = document.querySelector("#tablalistadoInsumos tbody");
    const searchInput = document.getElementById("barraBuscarIsumos");

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
        const sucursalResponse = await fetch(`http://localhost:3000/api/usuarios/${userId}/sucursales`, {
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

        // 📌 Obtener los insumos de las sucursales del usuario
        const insumoResponse = await fetch(`http://localhost:3000/api/insumos?sucursales=${sucursalIds.join(",")}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!insumoResponse.ok) {
            throw new Error("Error al obtener los insumos.");
        }

        const insumos = await insumoResponse.json();
        renderizarTabla(insumos, sucursalMap);

        // 📌 Funcionalidad de búsqueda
        searchInput.addEventListener("input", function () {
            const filtro = searchInput.value.toLowerCase();
            const insumosFiltrados = insumos.filter(insumo =>
                insumo.descripcion_insumo.toLowerCase().includes(filtro) ||
                insumo.stock_disponible_insumo.toString().includes(filtro) ||
                insumo.precio_insumo.toString().includes(filtro) ||
                sucursalMap[insumo.id_sucursal].toLowerCase().includes(filtro)
            );
            renderizarTabla(insumosFiltrados, sucursalMap);
        });

    } catch (error) {
        console.error("❌ Error al cargar la tabla de insumos:", error);
        alert("Error al cargar los insumos. Intente nuevamente.");
    }

    function renderizarTabla(insumos, sucursalMap) {
        tableBody.innerHTML = "";

        insumos.forEach(insumo => {
            const row = document.createElement("tr");

            // 📌 Verificar si el stock es crítico para mostrarlo en rojo
            const stockDisponible = insumo.stock_disponible_insumo;
            const formato = insumo.formato_insumo || "";
            let stockDisplay = `${stockDisponible} ${formato}`;

            if (insumo.stock_critico_insumo) {
                stockDisplay = `<span style="color: red; font-weight: bold;">${stockDisponible} ${formato} (Crítico)</span>`;
            }

            // 📌 Calcular el Monto Total
            const montoTotal = stockDisponible * insumo.precio_insumo;

            row.innerHTML = `
                <td>${insumo.descripcion_insumo}</td>
                <td>${stockDisplay}</td>
                <td>$${insumo.precio_insumo}</td>
                <td>$${montoTotal.toLocaleString("es-CL")}</td>
                <td>${sucursalMap[insumo.id_sucursal] || "No asignado"}</td>
            `;
            tableBody.appendChild(row);
        });
    }
});
