import CONFIG from "../configURL.js"; // 📌 Archivo de configuración con la URL base de la API

document.addEventListener("DOMContentLoaded", async function () {
    const inputBuscarPresupuesto = document.getElementById("buscarPresupuesto");
    const listaCoincidenciasPresupuestos = document.getElementById("listaCoincidenciasPresupuestos");

    // Elementos para la cabecera del modal
    const idPresupuesto = document.getElementById("idPresupuesto");
    const rutClientePresupuesto = document.getElementById("rutClientePresupuesto");
    const placaVehiculoPresupuesto = document.getElementById("placaVehiculoPresupuesto");
    const sucursalPresupuesto = document.getElementById("sucursalPresupuesto");
    const diasValidezPresupuesto = document.getElementById("diasValidezPresupuestO");

    let presupuestos = [];
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

    // 📌 Cargar presupuestos y filtrar por sucursales permitidas
    async function cargarPresupuestos() {
        try {
            sucursalesUsuario = await obtenerSucursalesUsuario();
            if (sucursalesUsuario.length === 0) return;

            const response = await fetch(`${CONFIG.API_BASE_URL}/api/presupuestos`);
            if (!response.ok) throw new Error("Error al obtener presupuestos.");

            const todosLosPresupuestos = await response.json();
            presupuestos = todosLosPresupuestos.filter(p => sucursalesUsuario.includes(p.id_sucursal));
        } catch (error) {
            console.error("Error al cargar presupuestos:", error);
        }
    }

    // 📌 Buscar presupuestos por patente (filtro estático)
    inputBuscarPresupuesto.addEventListener("input", function () {
        const filtro = inputBuscarPresupuesto.value.toLowerCase();
        listaCoincidenciasPresupuestos.innerHTML = "";

        if (filtro.length === 0) return;

        const coincidencias = presupuestos.filter(p =>
            p.placa_vehiculo.toLowerCase().includes(filtro)
        );

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
    
    // 📌 Seleccionar presupuesto y mostrar en la cabecera
    function seleccionarPresupuesto(presupuesto) {
        idPresupuesto.textContent = presupuesto.id_presupuesto;
        rutClientePresupuesto.textContent = presupuesto.rut_cliente;
        placaVehiculoPresupuesto.textContent = presupuesto.placa_vehiculo;
        sucursalPresupuesto.textContent = presupuesto.id_sucursal;
        diasValidezPresupuesto.textContent = presupuesto.dias_validez_presupuesto_general;

        listaCoincidenciasPresupuestos.innerHTML = "";
        inputBuscarPresupuesto.value = "";
    }

    // 📌 Cargar presupuestos al inicio
    cargarPresupuestos();
});
