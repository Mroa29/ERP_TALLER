// Esperar a que el DOM esté completamente cargado
window.addEventListener('DOMContentLoaded', () => {
    const barraBuscarClientes = document.getElementById('barraBuscarClientes');
    const searchButton = document.getElementById('search_button');
    const tablaClientes = document.getElementById('tablalistadoclientes');
  
    // Filtrar filas de la tabla según el texto ingresado
    const filtrarClientes = () => {
      const filtro = barraBuscarClientes.value.toLowerCase(); // Convertir a minúsculas
      const filas = tablaClientes.querySelectorAll('tbody tr');
  
      filas.forEach((fila) => {
        const celdas = fila.getElementsByTagName('td');
        let coincide = false;
  
        // Verificar cada celda de la fila
        for (const celda of celdas) {
          if (celda.textContent.toLowerCase().includes(filtro)) {
            coincide = true;
            break;
          }
        }
  
        // Mostrar u ocultar la fila según la coincidencia
        fila.style.display = coincide ? '' : 'none';
      });
    };
  
    // Escuchar eventos en la barra de búsqueda
    barraBuscarClientes.addEventListener('input', filtrarClientes);
  
    // Opcional: Añadir funcionalidad al botón de búsqueda
    searchButton.addEventListener('click', (event) => {
      event.preventDefault(); // Evitar envío del formulario
      filtrarClientes();
    });
  });
  