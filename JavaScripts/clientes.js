$(function () {
    $("#example1").DataTable({
        "responsive": true, "lengthChange": false, "autoWidth": false,
        "buttons": ["copy", "csv", "excel", "pdf", "print"]
    }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
    $('#example2').DataTable({
            "paging": true,
            "lengthChange": false,
            "searching": false,
            "ordering": true,
            "info": true,
            "autoWidth": false,
            "responsive": true,
    });
    });
    function showDescription(description) {
        document.getElementById('descriptionCard').textContent = description;
    }
    // Obtener referencia al botón, al icono y al contenido a mostrar/ocultar
    const agregarVehiculoBtn = document.getElementById('agregarVehiculoBtn');
    const iconoFlecha = document.getElementById('iconoFlecha');
    const vehiculoCollapseContent = document.getElementById('vehiculoCollapse');
  
    // Función para mostrar/ocultar el contenido y actualizar el icono
    function toggleVehiculoContent() {
      vehiculoCollapseContent.classList.toggle('show');
      // Desplazar hasta el final del modal
      const modalFooter = document.querySelector('.modal-footer');
      if (modalFooter) {
        modalFooter.scrollIntoView({ behavior: 'smooth' });
      }
      // Actualizar el icono
      iconoFlecha.classList.toggle('fa-chevron-down');
      iconoFlecha.classList.toggle('fa-chevron-up');
    }
  
    // Agregar evento para escuchar el clic en el botón
    agregarVehiculoBtn.addEventListener('click', toggleVehiculoContent);
  
    // Inicializar el icono con la flecha hacia abajo
    iconoFlecha.classList.add('fa', 'fa-chevron-down');
    document.getElementById('btnagregarcliente').addEventListener('click', function() {
      // Verifica si el formulario es válido
      if (document.getElementById('idformagregarcliente').checkValidity()) {
          // Envía el formulario si es válido
          document.getElementById('idformagregarcliente').submit();
      } else {
        // Si el formulario agregar no es válido, enfoca el primer campo inválido para que el usuario lo corrija
        document.getElementById('idformagregarcliente').querySelector(':invalid').focus();
        // Si el formulario no es válido, muestra un mensaje de error
        document.getElementById('mensajeError').innerText = 'Por favor complete todos los campos requeridos.';
        document.getElementById('mensajeError').style.display = 'block';
      }
    });
    document.getElementById('btneditarcliente').addEventListener('click', function() {
      // Verifica si el formulario es válido
      if (document.getElementById('idformeditarcliente').checkValidity()) {
          // Envía el formulario si es válido
          document.getElementById('idformeditarcliente').submit();
      } else {
        // Si el formulario agregar no es válido, enfoca el primer campo inválido para que el usuario lo corrija
        document.getElementById('idformeditarcliente').querySelector(':invalid').focus();
        // Si el formulario no es válido, muestra un mensaje de error
        document.getElementById('mensajeErroreditar').innerText = 'Procurar que los campos requeridos no queden vacíos.';
        document.getElementById('mensajeErroreditar').style.display = 'block';
      }
    });
    
    document.addEventListener('DOMContentLoaded', (event) => {
      // Datos simulados para la tabla
      const clientes = [
        { numero: 1, rut: "12345678-9", nombre: "Juan Pérez", tipo: "Particular" },
        { numero: 2, rut: "98765432-1", nombre: "María González", tipo: "Empresa" },
        { numero: 3, rut: "13579246-8", nombre: "Carlos Sánchez", tipo: "Independiente" },
        { numero: 4, rut: "24681357-0", nombre: "Ana López", tipo: "Particular" },
        { numero: 5, rut: "98765432-1", nombre: "María González", tipo: "Empresa" },
        { numero: 6, rut: "13579246-8", nombre: "Carlos Sánchez", tipo: "Independiente" },
        { numero: 7, rut: "24681357-0", nombre: "Ana López", tipo: "Particular" },
        { numero: 8, rut: "98765432-1", nombre: "María González", tipo: "Empresa" },
        { numero: 9, rut: "13579246-8", nombre: "Carlos Sánchez", tipo: "Independiente" },
        { numero: 10, rut: "24681357-0", nombre: "Ana López", tipo: "Particular" },
        { numero: 11, rut: "98765432-1", nombre: "María González", tipo: "Empresa" },
        { numero: 12, rut: "13579246-8", nombre: "Carlos Sánchez", tipo: "Independiente" },
        { numero: 13, rut: "24681357-0", nombre: "Ana López", tipo: "Particular" },
        { numero: 14, rut: "98765432-1", nombre: "María González", tipo: "Empresa" },
        { numero: 15, rut: "13579246-8", nombre: "Carlos Sánchez", tipo: "Independiente" },
        { numero: 16, rut: "24681357-0", nombre: "Ana López", tipo: "Particular" },
        { numero: 17, rut: "98765432-1", nombre: "María González", tipo: "Empresa" },
        { numero: 18, rut: "13579246-8", nombre: "Carlos Sánchez", tipo: "Independiente" },
        { numero: 19, rut: "24681357-0", nombre: "Ana López", tipo: "Particular" },
        { numero: 20, rut: "98765432-1", nombre: "María González", tipo: "Empresa" },
        { numero: 21, rut: "13579246-8", nombre: "Carlos Sánchez", tipo: "Independiente" },
        { numero: 22, rut: "24681357-0", nombre: "Ana López", tipo: "Particular" },
        { numero: 23, rut: "98765432-1", nombre: "María González", tipo: "Empresa" },
        { numero: 24, rut: "13579246-8", nombre: "Carlos Sánchez", tipo: "Independiente" },
        { numero: 25, rut: "24681357-0", nombre: "Ana López", tipo: "Particular" },
        { numero: 26, rut: "98765432-1", nombre: "María González", tipo: "Empresa" },
        { numero: 27, rut: "13579246-8", nombre: "Carlos Sánchez", tipo: "Independiente" },
        { numero: 28, rut: "24681357-0", nombre: "Ana López", tipo: "Particular" },
        { numero: 29, rut: "98765432-1", nombre: "María González", tipo: "Empresa" },
        { numero: 30, rut: "13579246-8", nombre: "Carlos Sánchez", tipo: "Independiente" },
        
  
        // Puedes agregar más datos aquí
      ];
  
      const tbody = document.querySelector("#tablalistadoclientes tbody");
  
      // Función para llenar la tabla
      function llenarTabla(clientes) {
        tbody.innerHTML = '';
  
        clientes.forEach(cliente => {
          const fila = document.createElement('tr');
  
          fila.innerHTML = `
            <td>${cliente.numero}</td>
            <td>${cliente.rut}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.tipo}</td>
            <td>
              <button class="btn btn-info btn-sm" data-toggle="modal" data-target="#clienteModal">
                <i class="fas fa-search"></i>
              </button>
            </td>
          `;
  
          tbody.appendChild(fila);
        });
      }
  
      llenarTabla(clientes);
  
      // Función para normalizar el texto
      function normalizarTexto(texto) {
        return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
      }
  
      // Función para filtrar la tabla
      function filtrarTabla() {
        // Obtén el valor del campo de búsqueda y normalízalo
        const input = normalizarTexto(document.getElementById('barraBuscarClientes').value);
        const rows = tbody.getElementsByTagName('tr');
  
        // Recorre las filas de la tabla
        for (let i = 0; i < rows.length; i++) {
          let cells = rows[i].getElementsByTagName('td');
          let match = false;
  
          // Recorre las celdas en cada fila
          for (let j = 0; j < cells.length - 1; j++) { // Excluye la última columna (botón Ver)
            if (cells[j]) {
              // Normaliza el texto de las celdas
              const txtValue = normalizarTexto(cells[j].textContent || cells[j].innerText);
              if (txtValue.indexOf(input) > -1) {
                match = true;
                break;
              }
            }
          }
  
          // Muestra la fila si coincide, o la oculta si no
          if (match) {
            rows[i].style.display = "";
          } else {
            rows[i].style.display = "none";
          }
        }
      }
  
      // Agrega un evento 'click' al botón de búsqueda
      document.getElementById('search_button').addEventListener('click', filtrarTabla);
  
      // Evento 'keydown' al campo de búsqueda para detectar la tecla Enter
      document.getElementById('barraBuscarClientes').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
          event.preventDefault(); // Prevenir el comportamiento por defecto (enviar formulario)
          filtrarTabla(); // Llama a la función de filtrado
        }
      });
  
    });
  
    // Función para validar el RUT chileno
  function validarRUT(rut) {
    // Elimina todos los puntos y guiones
    rut = rut.replace(/\./g, '').replace(/-/g, '');
    
    // Captura los últimos dígitos, que corresponden al dígito verificador
    var cuerpo = rut.slice(0, -1);
    var dv = rut.slice(-1).toUpperCase();
    
    // El cuerpo del RUT debe tener entre 7 y 8 dígitos
    if (cuerpo.length < 7 || cuerpo.length > 8) {
      return false;
    }
  
    // Calcula el dígito verificador esperado
    var suma = 0;
    var multiplo = 2;
  
    // Para cada dígito del cuerpo
    for (var i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
  
    var dvEsperado = 11 - (suma % 11);
    if (dvEsperado === 11) dvEsperado = '0';
    if (dvEsperado === 10) dvEsperado = 'K';
    if (dvEsperado.toString() !== dv) {
      return false;
    }
    return true;
  }
  
  // Validar el RUT en tiempo real mientras se escribe
  document.getElementById('rut').addEventListener('input', function() {
    var rutInput = document.getElementById('rut');
    var rut = rutInput.value.trim();
  
    if (validarRUT(rut)) {
      rutInput.classList.remove('is-invalid');
      rutInput.classList.add('is-valid');
      document.getElementById('mensajeError').style.display = 'none'; // Oculta el mensaje de error si el RUT es válido
    } else {
      rutInput.classList.add('is-invalid');
      rutInput.classList.remove('is-valid');
    }
  });
  
  // Escuchar el evento de ocultar para todos los modales
  $('.modal').on('hidden.bs.modal', function (e) {
    // Esperar a que el modal se haya cerrado completamente
    setTimeout(function() {
      // Si hay otro modal abierto, añadir la clase 'modal-open' al body
      if ($('.modal.show').length) {
        $('body').addClass('modal-open');
      }
    }, 500); // Esperar un tiempo para asegurarse de que el modal se haya cerrado
  });
  
  // Si hay múltiples modales, evitar que el body pierda la clase 'modal-open' cuando se cierra un modal
  $('#agregarclientemodal').on('hidden.bs.modal', function (e) {
    setTimeout(function() {
      if ($('#nuevopresupuestoModal').hasClass('show')) {
        $('body').addClass('modal-open');
      }
    }, 500); // Esperar un tiempo para asegurarse de que el modal se haya cerrado
  });
  
  // Consolidar la lógica del botón para agregar cliente
  document.getElementById('btnagregarcliente').addEventListener('click', function() {
    var rutInput = document.getElementById('rut');
    var rut = rutInput.value.trim();
  
    if (!validarRUT(rut)) {
      // Si el RUT no es válido, muestra un mensaje de error
      rutInput.classList.add('is-invalid');
      rutInput.classList.remove('is-valid');
      // Mostrar el mensaje de error arriba del formulario
      var mensajeError = document.getElementById('mensajeError');
      mensajeError.innerText = 'El RUT ingresado no es válido. Por favor, verifique el formato e intente nuevamente.';
      mensajeError.style.display = 'block';
      return; // Evita que el formulario se envíe
    }
  
    // Si el RUT es válido, remueve el estado de error y muestra el mensaje de validez
    rutInput.classList.remove('is-invalid');
    rutInput.classList.add('is-valid');
    document.getElementById('mensajeError').style.display = 'none'; // Oculta el mensaje de error si el RUT es válido
    
    // Aquí puedes continuar con la lógica de envío del formulario
    var form = document.getElementById('idformagregarcliente');
    if (form.checkValidity()) {
      // Antes de cerrar el modal, asegúrate de mantener la clase modal-open si otro modal está abierto
      var modalCount = $('.modal.show').length; // Contar los modales abiertos
  
      $('#agregarclientemodal').modal('hide'); // Cierra el modal
  
      // Después de cerrar el modal, verifica si hay otro modal abierto
      if (modalCount > 1) {
        // Mantener la clase 'modal-open' si otro modal está abierto
        setTimeout(function() {
          $('body').addClass('modal-open');
        }, 500); // Espera a que el modal termine de cerrarse
      }
    } else {
      // Si el formulario no es válido, enfoca el primer campo inválido para que el usuario lo corrija
      form.querySelector(':invalid').focus();
      // Muestra un mensaje de error si el formulario no es válido
      var mensajeError = document.getElementById('mensajeError');
      mensajeError.innerText = 'Por favor complete todos los campos requeridos.';
      mensajeError.style.display = 'block';
    }
  });