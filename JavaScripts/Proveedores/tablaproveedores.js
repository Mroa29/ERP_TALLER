document.addEventListener('DOMContentLoaded', async () => {
    const tablaProveedores = document.querySelector('#tablalistadoproovedores tbody');
    const barraBuscarProveedores = document.getElementById('barraBuscarProveedores');
    const mensajeErrorProveedor = document.getElementById('mensajeErrorproveedor');
  
    let proveedores = []; // Variable para almacenar los proveedores obtenidos
  
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
  
      // Obtener el id_taller del usuario
      const usuarioResponse = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!usuarioResponse.ok) {
        throw new Error('Error al obtener los datos del usuario.');
      }
  
      const usuarioData = await usuarioResponse.json();
      const idTaller = usuarioData.user.taller;
  
      // Obtener la lista de proveedores
      const proveedoresResponse = await fetch('http://localhost:3000/api/proveedores', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!proveedoresResponse.ok) {
        throw new Error('Error al obtener la lista de proveedores.');
      }
  
      const todosProveedores = await proveedoresResponse.json();
  
      // Filtrar los proveedores por el mismo id_taller
      proveedores = todosProveedores.filter(proveedor => proveedor.id_taller === idTaller);
  
      // Llenar la tabla con los proveedores filtrados
      llenarTablaProveedores(proveedores);
    } catch (error) {
      console.error('Error al cargar la tabla de proveedores:', error);
      mensajeErrorProveedor.textContent = `Error al cargar la tabla de proveedores: ${error.message}`;
      mensajeErrorProveedor.style.display = 'block';
    }
  
    // Función para llenar la tabla con los datos de los proveedores
    function llenarTablaProveedores(proveedores) {
      tablaProveedores.innerHTML = ''; // Limpiar la tabla antes de llenarla
  
      proveedores.forEach(proveedor => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${proveedor.razon_social_proveedor}</td>
            <td>${proveedor.rut_proveedor}</td>
            <td>${proveedor.giro_proveedor || 'Sin definir'}</td>
            <td>${proveedor.email_proveedor || 'No especificado'}</td>
            <td>${proveedor.persona_contacto_proveedor || 'No especificado'}</td>
            <td>
                <button class="btn btn-info btn-sm btn-ver-proveedor" data-rut="${proveedor.rut_proveedor}" data-id-taller="${proveedor.id_taller}">
                <i class="fas fa-eye"></i> Ver
                </button>
                <button class="btn btn-warning btn-sm btn-editar-proveedor" data-rut="${proveedor.rut_proveedor}" data-id-taller="${proveedor.id_taller}">
                <i class="fas fa-edit"></i> Editar
                </button>
            </td>
        `;
        tablaProveedores.appendChild(row);
      });
    }
  
    // Filtrar proveedores al escribir en la barra de búsqueda
    barraBuscarProveedores.addEventListener('input', () => {
      const filtro = barraBuscarProveedores.value.toLowerCase().trim();
  
      const proveedoresFiltrados = proveedores.filter(proveedor =>
        proveedor.razon_social_proveedor.toLowerCase().includes(filtro) ||
        proveedor.rut_proveedor.toLowerCase().includes(filtro) ||
        (proveedor.giro_proveedor && proveedor.giro_proveedor.toLowerCase().includes(filtro)) ||
        (proveedor.persona_contacto_proveedor && proveedor.persona_contacto_proveedor.toLowerCase().includes(filtro))
      );
  
      llenarTablaProveedores(proveedoresFiltrados); // Actualizar la tabla con los proveedores filtrados
    });
  
    // Agregar evento para el botón "Ver" en cada proveedor
    tablaProveedores.addEventListener('click', (event) => {
      if (event.target.classList.contains('btn-ver-proveedor')) {
        const rutProveedor = event.target.getAttribute('data-rut');
  
        const proveedorSeleccionado = proveedores.find(proveedor => proveedor.rut_proveedor === rutProveedor);
  
        if (proveedorSeleccionado) {
          mostrarModalProveedor(proveedorSeleccionado);
        }
      }
    });
  
    // Función para mostrar el modal con la información del proveedor
    function mostrarModalProveedor(proveedor) {
      // Llenar los campos del modal con la información del proveedor
      document.getElementById('modalRazonSocial').textContent = proveedor.razon_social_proveedor;
      document.getElementById('modalRUT').textContent = proveedor.rut_proveedor;
      document.getElementById('modalGiro').textContent = proveedor.giro_proveedor || 'Sin definir';
      document.getElementById('modalCorreo').textContent = proveedor.email_proveedor || 'No especificado';
      document.getElementById('modalDireccion').textContent = proveedor.direccion_proveedor || 'No especificado';
      document.getElementById('modalTelefono').textContent = proveedor.telefono_proveedor || 'No especificado';
      document.getElementById('modalPersonaContacto').textContent = proveedor.persona_contacto_proveedor || 'No especificado';
      document.getElementById('modalPaginaWeb').textContent = proveedor.pagina_web_proveedor || 'No especificado';
  
      // Mostrar el modal
      const modal = new bootstrap.Modal(document.getElementById('verProveedorModal'));
      modal.show();
    }
  });
  