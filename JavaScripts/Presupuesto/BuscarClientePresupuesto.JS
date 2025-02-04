document.addEventListener('DOMContentLoaded', async function () {
    // ELEMENTOS PARA CLIENTE
    const inputBuscarCliente = document.getElementById('buscarCliente');
    const listaCoincidenciasClientes = document.getElementById('listaCoincidenciasClientes');
    const inputClienteSeleccionado = document.getElementById('clienteSeleccionado');
  
    // (Opcional) Si deseas habilitar algún botón asociado, puedes obtenerlo aquí
    // const btnAgregarVehiculo = document.getElementById('btnagregarvehiculo');
  
    let clientesFiltrados = []; // Array para almacenar los clientes disponibles para el usuario
  
    // Cargar clientes según las sucursales asociadas al usuario
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuario no autenticado. Por favor, inicie sesión.');
  
      // Decodificar el token (asumiendo JWT) para obtener el ID del usuario
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.id;
  
      // Obtener las sucursales asociadas al usuario
      const sucursalesResponse = await fetch(`http://localhost:3000/api/usuarios/${userId}/sucursales`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!sucursalesResponse.ok) throw new Error('Error al obtener las sucursales del usuario.');
      const sucursales = await sucursalesResponse.json();
      const sucursalIds = sucursales.map(sucursal => sucursal.id_sucursal);
  
      // Obtener la lista completa de clientes
      const clientesResponse = await fetch('http://localhost:3000/api/clientes', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!clientesResponse.ok) throw new Error('Error al obtener los clientes.');
      const clientes = await clientesResponse.json();
  
      // Filtrar clientes según las sucursales del usuario
      clientesFiltrados = clientes.filter(cliente => sucursalIds.includes(cliente.id_sucursal));
      console.log('Clientes filtrados cargados:', clientesFiltrados);
    } catch (error) {
      console.error('Error al cargar los clientes:', error);
      alert('Error al cargar los clientes. Por favor, intente nuevamente.');
      return;
    }
  
    // Manejo de la búsqueda de clientes
    inputBuscarCliente.addEventListener('input', function () {
      const filtro = this.value.toLowerCase().trim();
      listaCoincidenciasClientes.innerHTML = ''; // Limpiar coincidencias previas
  
      if (filtro.length === 0) return; // No hacer nada si el campo está vacío
  
      // Filtrar por nombre o RUT
      const coincidencias = clientesFiltrados.filter(cliente =>
        cliente.nom_cliente.toLowerCase().includes(filtro) ||
        cliente.rut_cliente.replace(/\./g, '').replace(/-/g, '').toLowerCase().includes(filtro)
      );
  
      // Mostrar cada coincidencia en la lista
      coincidencias.forEach(cliente => {
        const item = document.createElement('a');
        item.href = '#';
        item.classList.add('list-group-item', 'list-group-item-action');
        item.textContent = `${cliente.nom_cliente} (${cliente.rut_cliente})`;
        item.addEventListener('click', function (e) {
          e.preventDefault();
          seleccionarCliente(cliente);
        });
        listaCoincidenciasClientes.appendChild(item);
      });
    });
  
    // Función para seleccionar un cliente
    function seleccionarCliente(cliente) {
      inputClienteSeleccionado.value = cliente.rut_cliente; // Coloca el RUT del cliente seleccionado
      listaCoincidenciasClientes.innerHTML = ''; // Limpia la lista de coincidencias
      inputBuscarCliente.value = ''; // Limpia el campo de búsqueda
  
      // (Opcional) Si se cuenta con un botón, se puede habilitar aquí:
      // btnAgregarVehiculo.disabled = false;
  
      // Opcionalmente, puedes despachar un evento personalizado para informar que se seleccionó un cliente:
      // document.dispatchEvent(new CustomEvent('clienteSeleccionado', { detail: cliente }));
    }
  
    // Limpiar la selección de cliente cuando se cierre el modal
    $('#agregarPresupuestomodal').on('hidden.bs.modal', function () {
      inputClienteSeleccionado.value = '';
      inputBuscarCliente.value = '';
      listaCoincidenciasClientes.innerHTML = '';
    });
  });
  