import CONFIG from "../configURL.js";

document.getElementById('btn-exportar-clientes').addEventListener('click', async () => {
    try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No hay sesión activa. Por favor, inicie sesión.');
            window.location.href = '../login/loginkronos.html';
            return;
        }

        // Decodificar el token para obtener el ID del usuario
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

        if (!sucursalesResponse.ok) {
            throw new Error('Error al obtener las sucursales asociadas al usuario.');
        }

        const sucursales = await sucursalesResponse.json();
        const sucursalIds = sucursales.map(sucursal => sucursal.id_sucursal);

        // Obtener los clientes de las sucursales
        const clientesResponse = await fetch(`${CONFIG.API_BASE_URL}/api/clientes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!clientesResponse.ok) {
            throw new Error('Error al obtener los clientes.');
        }

        const allClientes = await clientesResponse.json();

        // Filtrar clientes por las sucursales asociadas al usuario
        const filteredClientes = allClientes.filter(cliente =>
            sucursalIds.includes(cliente.id_sucursal)
        );

        if (filteredClientes.length === 0) {
            alert('No se encontraron clientes asociados a sus sucursales.');
            return;
        }

        // Preparar los datos para el archivo Excel
        const excelData = filteredClientes.map(cliente => ({
            RUT: cliente.rut_cliente,
            Nombre: cliente.nom_cliente,
            Tipo: cliente.tipo_cliente,
            Email: cliente.email_cliente,
            Teléfono: cliente.telefono_cliente,
            Dirección: cliente.direccion_cliente,
            Comuna: cliente.comuna_cliente,
            Ciudad: cliente.ciudad_cliente,
            País: cliente.pais_cliente,
        }));

        // Generar el archivo Excel
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');

        // Descargar el archivo Excel
        XLSX.writeFile(workbook, 'Clientes.xlsx');
        alert('Archivo Excel generado con éxito.');
    } catch (error) {
        console.error('Error al exportar clientes a Excel:', error);
        alert('Error al exportar los clientes. Por favor, intente nuevamente.');
    }
});
