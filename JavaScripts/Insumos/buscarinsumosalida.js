import CONFIG from "../configURL.js";

document.addEventListener('DOMContentLoaded', async function () {
    const inputBuscarInsumoSalida = document.getElementById('buscarInsumoSalida');
    const listaCoincidenciasSalida = document.getElementById('listaCoincidenciasInsumosSalida');
    const inputInsumoSeleccionadoSalida = document.getElementById('insumoSeleccionadoSalida');
    const hiddenInsumoIdSalida = document.getElementById('hiddenInsumoIdSalida');
    const selectSucursalSalida = document.getElementById('sucursalSalida');

    let insumosFiltrados = []; // Almacenará los insumos disponibles

    try {
        // 📌 Obtener token del usuario
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Usuario no autenticado. Por favor, inicie sesión.');

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;

        // 📌 Obtener las sucursales asociadas al usuario
        const sucursalesResponse = await fetch(`${CONFIG.API_BASE_URL}/api/usuarios/${userId}/sucursales`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!sucursalesResponse.ok) throw new Error('Error al obtener las sucursales del usuario.');

        const sucursales = await sucursalesResponse.json();

        // 📌 Cargar sucursales en el select
        sucursales.forEach(sucursal => {
            const option = document.createElement('option');
            option.value = sucursal.id_sucursal;
            option.textContent = sucursal.nombre_sucursal;
            selectSucursalSalida.appendChild(option);
        });

        console.log('✅ Sucursales cargadas correctamente:', sucursales);

        // 📌 Obtener la lista de insumos
        const insumosResponse = await fetch(`${CONFIG.API_BASE_URL}/api/insumos`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!insumosResponse.ok) throw new Error('Error al obtener los insumos.');

        insumosFiltrados = await insumosResponse.json();
        console.log('✅ Insumos cargados correctamente:', insumosFiltrados);

    } catch (error) {
        console.error('❌ Error al cargar insumos o sucursales:', error);
        alert('Error al cargar los datos. Por favor, intente nuevamente.');
        return;
    }

    // 📌 Función para manejar la búsqueda de insumos
    inputBuscarInsumoSalida.addEventListener('input', function () {
        const filtro = this.value.toLowerCase().trim();
        listaCoincidenciasSalida.innerHTML = ''; // Limpiar la lista de coincidencias

        if (filtro.length === 0) return; // No buscar si el campo está vacío

        // 📌 Filtrar insumos por descripción
        const coincidencias = insumosFiltrados.filter(insumo =>
            insumo.descripcion_insumo.toLowerCase().includes(filtro)
        );

        // 📌 Mostrar coincidencias con stock disponible
        coincidencias.forEach(insumo => {
            const item = document.createElement('a');
            item.href = '#';
            item.classList.add('list-group-item', 'list-group-item-action');
            item.innerHTML = `
                <div>
                    <strong>${insumo.descripcion_insumo}</strong>
                    <span class="badge badge-info float-right">Stock: ${insumo.stock_disponible_insumo || 0}</span>
                </div>
            `;
            item.addEventListener('click', function (e) {
                e.preventDefault();
                seleccionarInsumo(insumo);
            });
            listaCoincidenciasSalida.appendChild(item);
        });
    });

    // 📌 Función para seleccionar un insumo
    function seleccionarInsumo(insumo) {
        inputInsumoSeleccionadoSalida.value = insumo.descripcion_insumo; // Muestra la descripción
        hiddenInsumoIdSalida.value = insumo.id_insumo; // Guarda el ID
        listaCoincidenciasSalida.innerHTML = ''; // Limpiar lista de coincidencias
        inputBuscarInsumoSalida.value = ''; // Limpiar campo de búsqueda
    }

    // 📌 Limpiar selección al cerrar el modal
    $('#salidaItemEspecificoModal').on('hidden.bs.modal', function () {
        inputInsumoSeleccionadoSalida.value = '';
        hiddenInsumoIdSalida.value = '';
        listaCoincidenciasSalida.innerHTML = '';
    });
});
