document.addEventListener('DOMContentLoaded', (event) => {
  console.log("DOM completamente cargado");

  const clientes = [
      { numero: 1, rut: "12345678-9", nombre: "Juan Pérez", tipo: "Particular" },
      { numero: 2, rut: "98765432-1", nombre: "María González", tipo: "Empresa" },
      { numero: 3, rut: "13579246-8", nombre: "Carlos Sánchez", tipo: "Independiente" },
  ];

  const tbody = document.querySelector("#tablalistadoclientes tbody");

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

  function validarRUT(rut) {
      rut = rut.replace(/\./g, '').replace(/-/g, '');
      const cuerpo = rut.slice(0, -1);
      let dv = rut.slice(-1).toUpperCase();

      if (cuerpo.length < 7 || cuerpo.length > 8) {
          return false;
      }

      let suma = 0;
      let multiplo = 2;

      for (let i = cuerpo.length - 1; i >= 0; i--) {
          suma += parseInt(cuerpo[i]) * multiplo;
          multiplo = multiplo < 7 ? multiplo + 1 : 2;
      }

      let dvEsperado = 11 - (suma % 11);
      dvEsperado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
      return dvEsperado === dv;
  }

  function asignarNumeroCliente() {
      const numeroClientes = document.querySelectorAll('#tablalistadoclientes tbody tr').length;
      document.getElementById('N°Cliente').value = numeroClientes + 1;
  }

  function agregarClienteATabla(cliente) {
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
  }

  document.getElementById('btnagregarcliente').addEventListener('click', function(event) {
      event.preventDefault();
      
      const rutInput = document.getElementById('rut').value.trim();
      const nombre = document.getElementById('nombre').value.trim();
      const tipoCliente = document.getElementById('tipoclient').value.trim();
      const mensajeError = document.getElementById('mensajeError');

      if (!validarRUT(rutInput)) {
          mensajeError.innerText = 'El RUT ingresado no es válido. Por favor, verifique el formato e intente nuevamente.';
          mensajeError.style.display = 'block';
          return;
      }

      if (nombre === '') {
          mensajeError.innerText = 'El nombre del cliente es obligatorio.';
          mensajeError.style.display = 'block';
          return;
      }

      mensajeError.style.display = 'none';

      const nuevoCliente = {
          numero: document.getElementById('N°Cliente').value,
          rut: rutInput,
          nombre: nombre,
          tipo: tipoCliente
      };

      agregarClienteATabla(nuevoCliente);
      document.getElementById('idformagregarcliente').reset();
      asignarNumeroCliente();

      // Cerrar el modal y eliminar el backdrop manualmente
      $('#agregarclientemodal').modal('hide').on('hidden.bs.modal', function () {
          $('.modal-backdrop').remove(); // Forzar eliminación del backdrop
      });
  });

  $('#agregarclientemodal').on('shown.bs.modal', function () {
      asignarNumeroCliente();
  });

  // Función para normalizar el RUT eliminando puntos y guiones
  function normalizarRUT(rut) {
      return rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
  }

  document.getElementById('inputImportarExcel').addEventListener('change', function(event) {
      const file = event.target.files[0];

      if (!file) {
          alert("Por favor, selecciona un archivo Excel.");
          return;
      }

      const reader = new FileReader();
      reader.onload = function(e) {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });

          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const dataExcel = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          if (dataExcel.length === 0) {
              alert("El archivo Excel está vacío o no contiene datos válidos.");
              return;
          }

          const tbody = document.querySelector("#tablalistadoclientes tbody");

          // Obtener el número de clientes actuales en la tabla
          let numeroCliente = document.querySelectorAll('#tablalistadoclientes tbody tr').length + 1;

          // Almacenar los RUTs existentes en la tabla actual
          const rutsExistentes = Array.from(document.querySelectorAll("#tablalistadoclientes tbody tr"))
              .map(row => normalizarRUT(row.cells[1].innerText)); // RUT está en la segunda columna

          // Almacenar los clientes duplicados encontrados
          const duplicados = [];
          const nuevosClientes = [];

          // Recorrer los datos del Excel
          dataExcel.slice(1).forEach(fila => {
              const rut = normalizarRUT(fila[1]); // RUT en la segunda columna

              if (rutsExistentes.includes(rut)) {
                  duplicados.push(fila);
              } else {
                  nuevosClientes.push(fila);
              }
          });

          // Si se encuentran duplicados, mostrar el modal
          if (duplicados.length > 0) {
              $('#modalDuplicados').modal('show');

              // Omitir duplicados
              document.getElementById('btnOmitirDuplicados').onclick = function() {
                  agregarClientes(nuevosClientes);
                  $('#modalDuplicados').modal('hide');
              };

              // Reemplazar duplicados
              document.getElementById('btnReemplazarDuplicados').onclick = function() {
                  // Primero eliminamos las filas duplicadas en la tabla
                  duplicados.forEach(dup => {
                      const rut = normalizarRUT(dup[1]);
                      const filas = document.querySelectorAll("#tablalistadoclientes tbody tr");
                      filas.forEach(fila => {
                          if (normalizarRUT(fila.cells[1].innerText) === rut) {
                              fila.remove();
                          }
                      });
                  });

                  // Luego agregamos tanto los nuevos clientes como los duplicados actualizados
                  agregarClientes([...nuevosClientes, ...duplicados]);
                  $('#modalDuplicados').modal('hide');
              };
          } else {
              // Si no hay duplicados, agregamos directamente los nuevos clientes
              agregarClientes(nuevosClientes);
          }
      };

      reader.readAsArrayBuffer(file);
  });

  // Función para agregar clientes a la tabla
  function agregarClientes(clientes) {
      const tbody = document.querySelector("#tablalistadoclientes tbody");
      let numeroCliente = document.querySelectorAll('#tablalistadoclientes tbody tr').length + 1;

      clientes.forEach(cliente => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
              <td>${numeroCliente++}</td>
              <td>${cliente[1]}</td> <!-- Columna "RUT" -->
              <td>${cliente[2]}</td> <!-- Columna "Nombre" -->
              <td>${cliente[3]}</td> <!-- Columna "Tipo" -->
              <td>
                  <button class="btn btn-info btn-sm" data-toggle="modal" data-target="#clienteModal">
                      <i class="fas fa-search"></i>
                  </button>
              </td>
          `;
          tbody.appendChild(tr);
      });

      alert("Datos importados exitosamente.");
  }

  document.getElementById('barraBuscarClientes').addEventListener('input', function() {
      const filtro = this.value.toLowerCase();
      const filas = document.querySelectorAll('#tablalistadoclientes tbody tr');

      filas.forEach(fila => {
          const textoFila = fila.textContent.toLowerCase();

          if (textoFila.includes(filtro)) {
              fila.style.display = '';
          } else {
              fila.style.display = 'none';
          }
      });
  });

  function exportarTablaAExcel() {
      const tabla = document.querySelector("#tablalistadoclientes");
      const wb = XLSX.utils.table_to_book(tabla, { sheet: "Clientes" });
      XLSX.writeFile(wb, "clientes.xlsx");
  }
  window.exportarTablaAExcel = exportarTablaAExcel; // Hacer la función accesible globalmente
});
