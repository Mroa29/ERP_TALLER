import CONFIG from "../configURL.js"; // 📌 Importamos la URL base desde un archivo de configuración

document.addEventListener('DOMContentLoaded', async () => {
    const selectTipoProveedor = document.getElementById('tipoproveedor');
    const mensajeErrorProveedor = document.getElementById('mensajeErrorproveedor');

    try {
        // 📌 Realizar la consulta para obtener los tipos de proveedores
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/proveedores/tipos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener los tipos de proveedores.');
        }

        const tiposProveedores = await response.json();

        // 📌 Limpiar el select antes de llenarlo
        selectTipoProveedor.innerHTML = '<option value="" disabled selected>Seleccione el Tipo de Proveedor</option>';

        // 📌 Llenar el select con las opciones obtenidas
        tiposProveedores.forEach((tipo) => {
            const option = document.createElement('option');
            option.value = tipo.id_tipo_proveedor;
            option.textContent = tipo.descripcion_tipo_proveedor;
            selectTipoProveedor.appendChild(option);
        });
    } catch (error) {
        console.error('Error al llenar el select de tipos de proveedores:', error);
        mensajeErrorProveedor.textContent = 'Hubo un problema al cargar los tipos de proveedores. Intente nuevamente.';
        mensajeErrorProveedor.style.display = 'block'; // 📌 Mostrar mensaje de error
    }
});
