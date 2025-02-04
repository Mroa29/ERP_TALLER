document.addEventListener("DOMContentLoaded", async function () {
    const inputBuscarPresupuesto = document.getElementById("buscarPresupuestoResumen");
    const listaCoincidenciasPresupuestos = document.getElementById("listaCoincidenciasPresupuestosResumen");
    
    // Elementos de la cabecera
    const idPresupuesto = document.getElementById("idPresupuestoResumen");
    const rutCliente = document.getElementById("rutClienteResumen");
    const placaVehiculo = document.getElementById("placaVehiculoResumen");
    const sucursal = document.getElementById("sucursalResumen");
    const diasValidez = document.getElementById("diasValidezResumen");
    const observaciones = document.getElementById("observacionesResumen");

    let presupuestos = [];
    let sucursalesUsuario = [];

    // 📌 Obtener las sucursales permitidas para el usuario
    async function obtenerSucursalesUsuario() {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Usuario no autenticado. Inicie sesión.");

            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            const userId = decodedToken.id;

            const response = await fetch(`http://localhost:3000/api/usuarios/${userId}/sucursales`, {
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

    // 📌 Obtener todos los presupuestos y filtrar por sucursales del usuario
    async function obtenerPresupuestos() {
        try {
            sucursalesUsuario = await obtenerSucursalesUsuario();
            if (sucursalesUsuario.length === 0) return;

            const response = await fetch("http://localhost:3000/api/presupuestos");
            if (!response.ok) throw new Error("Error al obtener los presupuestos.");

            const todosLosPresupuestos = await response.json();
            presupuestos = todosLosPresupuestos.filter(p => sucursalesUsuario.includes(p.id_sucursal));
        } catch (error) {
            console.error("Error al cargar los presupuestos:", error);
        }
    }

    // 📌 Buscar presupuestos en la barra de búsqueda
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

    // 📌 Seleccionar presupuesto y cargar datos en la cabecera
    function seleccionarPresupuesto(presupuesto) {
        idPresupuesto.textContent = presupuesto.id_presupuesto;
        rutCliente.textContent = presupuesto.rut_cliente;
        placaVehiculo.textContent = presupuesto.placa_vehiculo;
        sucursal.textContent = presupuesto.id_sucursal;
        diasValidez.textContent = presupuesto.dias_validez_presupuesto_general;
        observaciones.textContent = presupuesto.observaciones ? presupuesto.observaciones : "No hay observaciones";

        listaCoincidenciasPresupuestos.innerHTML = "";
        inputBuscarPresupuesto.value = "";
    }

    // 📌 Cargar los presupuestos al iniciar
    obtenerPresupuestos();
});
