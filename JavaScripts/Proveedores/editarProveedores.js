document.addEventListener('DOMContentLoaded', () => {
    const tablaProveedores = document.querySelector('#tablalistadoproovedores tbody');
    const btnGuardarCambios = document.getElementById('guardarCambiosProveedor');
  
    let proveedorSeleccionado = null;
  
    // Evento para abrir el modal de edición
    tablaProveedores.addEventListener('click', async (event) => {
      if (event.target.classList.contains('btn-editar-proveedor')) {
        const rutProveedor = event.target.getAttribute('data-rut');
        const idTaller = event.target.getAttribute('data-id-taller'); // Captura el idTaller del botón
  
        try {
          // Obtener los datos del proveedor por su RUT e ID_TALLER
          const proveedorResponse = await fetch(`http://localhost:3000/api/proveedores/${rutProveedor}/${idTaller}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          });
  
          if (!proveedorResponse.ok) {
            throw new Error('Error al obtener los datos del proveedor.');
          }
  
          proveedorSeleccionado = await proveedorResponse.json();
  
          // Llenar los campos del modal con los datos del proveedor
          document.getElementById('editarRazonSocial').value = proveedorSeleccionado.razon_social_proveedor;
          document.getElementById('editarGiro').value = proveedorSeleccionado.giro_proveedor || '';
          document.getElementById('editarCorreo').value = proveedorSeleccionado.email_proveedor || '';
          document.getElementById('editarPersonaContacto').value = proveedorSeleccionado.persona_contacto_proveedor || '';
  
          // Guardar el ID del taller en el objeto seleccionado
          proveedorSeleccionado.id_taller = idTaller;
  
          // Mostrar el modal
          const modal = new bootstrap.Modal(document.getElementById('editarProveedorModal'));
          modal.show();
        } catch (error) {
          console.error('Error al obtener el proveedor:', error);
          alert('Hubo un problema al cargar los datos del proveedor.');
        }
      }
    });
  
    // Evento para guardar los cambios
    btnGuardarCambios.addEventListener('click', async () => {
      try {
        if (!proveedorSeleccionado) {
          throw new Error('No hay un proveedor seleccionado.');
        }
  
        // Obtener los valores actualizados del formulario
        const razonSocial = document.getElementById('editarRazonSocial').value.trim();
        const giro = document.getElementById('editarGiro').value.trim();
        const correo = document.getElementById('editarCorreo').value.trim();
        const personaContacto = document.getElementById('editarPersonaContacto').value.trim();
  
        // Validar campos obligatorios
        if (!razonSocial || !correo) {
          alert('Los campos Razón Social y Correo son obligatorios.');
          return;
        }
  
        // Crear el objeto actualizado, manteniendo los valores no editados
        const proveedorActualizado = {
          razon_social: razonSocial || proveedorSeleccionado.razon_social_proveedor,
          giro: giro || proveedorSeleccionado.giro_proveedor,
          email: correo || proveedorSeleccionado.email_proveedor,
          persona_contacto: personaContacto || proveedorSeleccionado.persona_contacto_proveedor,
          direccion: proveedorSeleccionado.direccion_proveedor, // Mantener dirección
          telefono: proveedorSeleccionado.telefono_proveedor, // Mantener teléfono
          pagina_web: proveedorSeleccionado.pagina_web_proveedor, // Mantener página web
          id_tipo_proveedor: proveedorSeleccionado.id_tipo_proveedor, // Mantener tipo
        };
  
        // Enviar los datos actualizados a la API
        const actualizarResponse = await fetch(
          `http://localhost:3000/api/proveedores/${proveedorSeleccionado.rut_proveedor}/${proveedorSeleccionado.id_taller}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(proveedorActualizado),
          }
        );
  
        if (!actualizarResponse.ok) {
          throw new Error('Error al actualizar el proveedor.');
        }
  
        alert('Proveedor actualizado exitosamente.');
        // Recargar la página
        window.location.reload();
      } catch (error) {
        console.error('Error al guardar los cambios del proveedor:', error);
        alert('Hubo un problema al guardar los cambios.');
      }
    });
  });
  