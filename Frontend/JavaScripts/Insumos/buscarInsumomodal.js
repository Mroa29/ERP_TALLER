import CONFIG from "../configURL.js";

document.addEventListener('DOMContentLoaded', async function () {
    const inputBuscarInsumo = document.getElementById('buscarInsumo');
    const listaCoincidencias = document.getElementById('listaCoincidenciasInsumos');
    const inputInsumoSeleccionado = document.getElementById('insumoSeleccionado'); // Campo visible (Muestra descripción)
    const hiddenInsumoId = document.getElementById('hiddenInsumoId'); // Campo oculto (Guarda ID)
    const btnAgregarItemEspecifico = document.getElementById('btnAgregarItemEspecifico');
    let insumosFiltrados = []; // Lista para almacenar los insumos dinámicamente

    try {
        // Obtener el token y validar autenticación
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Usuario no autenticado. Por favor, inicie sesión.');

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;

        // Obtener las sucursales asociadas al usuario
        const sucursalesResponse = await fetch(`${CONFIG.API_BASE_URL}/api/usuarios/${userId}/sucursales`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!sucursalesResponse.ok) throw new Error('Error al obtener las sucursales del usuario.');

        const sucursales = await sucursalesResponse.json();
        const sucursalIds = sucursales.map(sucursal => sucursal.id_sucursal);

        // Obtener la lista de insumos
        const insumosResponse = await fetch(`${CONFIG.API_BASE_URL}/api/insumos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!insumosResponse.ok) throw new Error('Error al obtener los insumos.');

        const insumos = await insumosResponse.json();
        // Filtrar insumos por las sucursales asociadas al usuario
        insumosFiltrados = insumos.filter(insumo => sucursalIds.includes(insumo.id_sucursal));

        console.log('Insumos filtrados cargados:', insumosFiltrados);
    } catch (error) {
        console.error('Error al cargar los insumos:', error);
        alert('Error al cargar los datos. Por favor, intente nuevamente.');
        return;
    }

    // Función para manejar la búsqueda de insumos
    inputBuscarInsumo.addEventListener('input', function () {
        const filtro = this.value.toLowerCase().trim();
        listaCoincidencias.innerHTML = ''; // Limpiar la lista de coincidencias

        if (filtro.length === 0) return; // No buscar si el campo está vacío

        // Filtrar insumos por descripción
        const coincidencias = insumosFiltrados.filter(insumo =>
            insumo.descripcion_insumo.toLowerCase().includes(filtro)
        );

        // Mostrar las coincidencias
        coincidencias.forEach(insumo => {
            const item = document.createElement('a');
            item.href = '#';
            item.classList.add('list-group-item', 'list-group-item-action');
            item.textContent = `${insumo.descripcion_insumo}`;
            item.addEventListener('click', function (e) {
                e.preventDefault();
                seleccionarInsumo(insumo);
            });
            listaCoincidencias.appendChild(item);
        });
    });

    // Función para seleccionar un insumo
    function seleccionarInsumo(insumo) {
        inputInsumoSeleccionado.value = insumo.descripcion_insumo; // Mostrar descripción en el campo visible
        hiddenInsumoId.value = insumo.id_insumo; // Guardar el ID en un campo oculto
        btnAgregarItemEspecifico.disabled = false; // Habilitar el botón de agregar ítem
        listaCoincidencias.innerHTML = ''; // Limpiar la lista de coincidencias
        inputBuscarInsumo.value = ''; // Limpiar el campo de búsqueda
    }

    // Limpiar selección y deshabilitar botón cuando se cierra el modal
    $('#agregarItemEspecificoModal').on('hidden.bs.modal', function () {
        inputInsumoSeleccionado.value = '';
        hiddenInsumoId.value = '';
        btnAgregarItemEspecifico.disabled = true;
        listaCoincidencias.innerHTML = '';
    });
});
