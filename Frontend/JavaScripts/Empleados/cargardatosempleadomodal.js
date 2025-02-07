import CONFIG from "../configURL.js";

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const selectCargo = document.getElementById('idCargoEmpleado');

        // Verificar si el select existe en el DOM
        if (!selectCargo) {
            console.error('Error: No se encontró el select de cargos.');
            return;
        }

        // Obtener el token almacenado en localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No hay sesión activa. Por favor, inicie sesión.');
        }

        // Consultar la API para obtener los cargos
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/cargos`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener la lista de cargos.');
        }

        const cargos = await response.json();

        // Limpiar opciones previas en el select
        selectCargo.innerHTML = '<option value="" disabled selected>Seleccione un cargo</option>';

        // Llenar el select con los datos de la API
        cargos.forEach(cargo => {
            const option = document.createElement('option');
            option.value = cargo.id_cargo;
            option.textContent = cargo.nom_cargo; // Muestra el nombre del cargo
            selectCargo.appendChild(option);
        });

    } catch (error) {
        console.error('Error al cargar los cargos:', error);
    }
});
