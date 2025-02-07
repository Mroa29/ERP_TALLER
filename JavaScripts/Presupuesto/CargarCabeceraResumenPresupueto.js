import CONFIG from "../configURL.js"; // 📌 Archivo de configuración de la API

document.addEventListener("DOMContentLoaded", async function () {
    const inputBuscarPresupuesto = document.getElementById("buscarPresupuestoResumen");
    const listaCoincidenciasPresupuestos = document.getElementById("listaCoincidenciasPresupuestosResumen");

    // Elementos de la cabecera donde se mostrarán los datos del presupuesto seleccionado
    const idPresupuesto = document.getElementById("idPresupuestoResumen");
    const rutCliente = document.getElementById("rutClienteResumen");
    const placaVehiculo = document.getElementById("placaVehiculoResumen");
    const sucursal = document.getElementById("sucursalResumen");
    const diasValidez = document.getElementById("diasValidezResumen");
    const observaciones = document.getElementById("observacionesResumen");

    let presupuestos = [];
    let sucursalesUsuario = [];
    let sucursalesMap = {}; // Mapa de sucursales para mostrar nombres en lugar de IDs

    // 📌 Obtener las sucursales del usuario autenticado
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

            // Crear un mapa con los nombres de las sucursales
            sucursales.forEach(sucursal => {
                sucursalesMap[sucursal.id_sucursal] = sucursal.nombre_sucursal;
            });

            return sucursales.map(sucursal => sucursal.id_sucursal);
        } catch (error) {
            console.error("❌ Error al obtener las sucursales:", error);
            return [];
        }
    }

    // 📌 Obtener todos los presupuestos filtrados por sucursales del usuario
    async function obtenerPresupuestos() {
        try {
            sucursalesUsuario = await obtenerSucursalesUsuario();
            if (sucursalesUsuario.length === 0) return;

            const response = await fetch(`${CONFIG.API_BASE_URL}/api/presupuestos`);
            if (!response.ok) throw new Error("Error al obtener los presupuestos.");

            const todosLosPresupuestos = await response.json();
            presupuestos = todosLosPresupuestos.filter(p => sucursalesUsuario.includes(p.id_sucursal));

            console.log("✅ Presupuestos cargados:", presupuestos);
        } catch (error) {
            console.error("❌ Error al cargar los presupuestos:", error);
        }
    }

    // 📌 Manejo de la barra de búsqueda de presupuestos
    inputBuscarPresupuesto.addEventListener("input", function () {
        const filtro = inputBuscarPresupuesto.value.toLowerCase().trim();
        listaCoincidenciasPresupuestos.innerHTML = ""; // Limpiar la lista previa

        if (filtro.length === 0) return;

        const coincidencias = presupuestos.filter(p =>
            p.placa_vehiculo.toLowerCase().includes(filtro) ||
            p.rut_cliente.toLowerCase().includes(filtro)
        );

        // Mostrar las coincidencias en la lista
        coincidencias.forEach(presupuesto => {
            const item = document.createElement("a");
            item.href = "#";
            item.classList.add("list-group-item", "list-group-item-action");
            item.textContent = `${presupuesto.placa_vehiculo} - ${presupuesto.rut_cliente}`;
            item.addEventListener("click", function (e) {
                e.preventDefault();
                seleccionarPresupuesto(presupuesto);
            });
            listaCoincidenciasPresupuestos.appendChild(item);
        });
    });

    // 📌 Seleccionar un presupuesto y actualizar la cabecera
    function seleccionarPresupuesto(presupuesto) {
        idPresupuesto.textContent = presupuesto.id_presupuesto;
        rutCliente.textContent = presupuesto.rut_cliente;
        placaVehiculo.textContent = presupuesto.placa_vehiculo;
        sucursal.textContent = sucursalesMap[presupuesto.id_sucursal] || "Sucursal desconocida";
        diasValidez.textContent = presupuesto.dias_validez_presupuesto_general;
        observaciones.textContent = presupuesto.observaciones || "No hay observaciones";

        // Limpiar lista y campo de búsqueda
        listaCoincidenciasPresupuestos.innerHTML = "";
        inputBuscarPresupuesto.value = "";

        console.log("✅ Presupuesto seleccionado:", presupuesto);
    }

    // 📌 Cargar los presupuestos al iniciar
    await obtenerPresupuestos();
});
