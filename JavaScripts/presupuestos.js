// Datos de ejemplo para llenar la tabla dinámicamente
const vehiculos = [
  { patente: 'AA1122', marca: 'Toyota', modelo: 'Yaris', año: 2019 },
  { patente: 'BB2233', marca: 'Ford', modelo: 'Focus', año: 2018 },
  { patente: 'CC3344', marca: 'Chevrolet', modelo: 'Cruze', año: 2020 },
  { patente: 'DD4455', marca: 'Nissan', modelo: 'Sentra', año: 2017 },
  { patente: 'EE5566', marca: 'Hyundai', modelo: 'Accent', año: 2019 },
  { patente: 'FF6677', marca: 'Kia', modelo: 'Rio', año: 2018 },
  { patente: 'GG7788', marca: 'Mazda', modelo: '3', año: 2020 },
  { patente: 'HH8899', marca: 'Volkswagen', modelo: 'Golf', año: 2017 },
  { patente: 'II9900', marca: 'Renault', modelo: 'Clio', año: 2019 },
  { patente: 'JJ0011', marca: 'Peugeot', modelo: '208', año: 2018 },
  { patente: 'KK1122', marca: 'Citroën', modelo: 'C3', año: 2020 },
  { patente: 'LL2233', marca: 'Suzuki', modelo: 'Swift', año: 2017 },
  { patente: 'MM3344', marca: 'Fiat', modelo: 'Argo', año: 2019 },
  { patente: 'NN4455', marca: 'Honda', modelo: 'Civic', año: 2018 },
  { patente: 'OO5566', marca: 'Subaru', modelo: 'Impreza', año: 2020 },
  { patente: 'PP6677', marca: 'Audi', modelo: 'A3', año: 2017 },
  { patente: 'QQ7788', marca: 'BMW', modelo: 'Serie 1', año: 2019 },
  { patente: 'RR8899', marca: 'Mercedes-Benz', modelo: 'Clase A', año: 2018 },
  { patente: 'SS9900', marca: 'Volvo', modelo: 'S60', año: 2020 },
  { patente: 'TT0011', marca: 'Lexus', modelo: 'IS', año: 2017 },
  { patente: 'UU1122', marca: 'Infiniti', modelo: 'Q50', año: 2019 },
  // Agrega más vehículos aquí según sea necesario
];

// Datos de ejemplo para llenar la tabla de clientes
const clientes = [
  { numeroCliente: '0001', rut: '12345678-9', nombre: 'Juan Pérez', tipoCliente: 'Particular' },
  { numeroCliente: '0002', rut: '98765432-1', nombre: 'María López', tipoCliente: 'Empresa' },
  { numeroCliente: '0003', rut: '11223344-5', nombre: 'Carlos Sánchez', tipoCliente: 'Independiente' },
  { numeroCliente: '0004', rut: '22334455-6', nombre: 'Ana Gómez', tipoCliente: 'Particular' },
  { numeroCliente: '0005', rut: '33445566-7', nombre: 'Luis Martínez', tipoCliente: 'Empresa' },
  // Agrega más clientes aquí según sea necesario
];

document.addEventListener('DOMContentLoaded', function() {
  // -- Gestión de Vehículos --
  const vehiculosTbody = document.querySelector('#tablavehiculospresupuesto tbody');
  const buscarVehiculosInput = document.querySelector('input[name="buscarvehiculospresupuesto"]');
  const buscarVehiculosBtn = document.querySelector('.input-group-append .btn');

  function generarFilaVehiculo(vehiculo, index) {
    return `
      <tr>
        <td>${vehiculo.patente}</td>
        <td>${vehiculo.marca}</td>
        <td>${vehiculo.modelo}</td>
        <td>${vehiculo.año}</td>
        <td>
          <div class="form-check">
            <input class="form-check-input" type="radio" name="vehicleSelection" id="vehicle${index}" value="${vehiculo.patente}">
            <label class="form-check-label" for="vehicle${index}"></label>
          </div>
        </td>
      </tr>
    `;
  }

  function mostrarVehiculos(vehiculos) {
    vehiculosTbody.innerHTML = '';
    vehiculos.forEach((vehiculo, index) => {
      const filaHTML = generarFilaVehiculo(vehiculo, index);
      vehiculosTbody.insertAdjacentHTML('beforeend', filaHTML);
    });
  }

  mostrarVehiculos(vehiculos);

  function buscarVehiculos() {
    const termino = buscarVehiculosInput.value.trim().toLowerCase();
    const vehiculosFiltrados = vehiculos.filter(vehiculo => {
      return (
        vehiculo.patente.toLowerCase().includes(termino) ||
        vehiculo.marca.toLowerCase().includes(termino) ||
        vehiculo.modelo.toLowerCase().includes(termino) ||
        vehiculo.año.toString().includes(termino)
      );
    });
    mostrarVehiculos(vehiculosFiltrados);
  }

  buscarVehiculosBtn.addEventListener('click', function(event) {
    event.preventDefault();
    buscarVehiculos();
  });

  buscarVehiculosInput.addEventListener('input', buscarVehiculos);

  // -- Gestión de Clientes --
  const clientesTbody = document.querySelector('#tablalistadoclientes tbody');
  const buscarClientesInput = document.querySelector('#barraBuscarClientes');
  const buscarClientesBtn = document.querySelector('#search_button');

  function generarFilaCliente(cliente, index) {
    return `
      <tr>
        <td>${cliente.numeroCliente}</td>
        <td>${cliente.rut}</td>
        <td>${cliente.nombre}</td>
        <td>${cliente.tipoCliente}</td>
        <td>
          <button class="btn btn-info btn-sm" onclick="seleccionarCliente('${cliente.nombre}')">
            <i class="fas fa-check-circle"></i>
          </button>
        </td>
      </tr>
    `;
  }

  function mostrarClientes(clientes) {
    clientesTbody.innerHTML = '';
    clientes.forEach((cliente, index) => {
      const filaHTML = generarFilaCliente(cliente, index);
      clientesTbody.insertAdjacentHTML('beforeend', filaHTML);
    });
  }

  mostrarClientes(clientes);

  function buscarClientes() {
    const termino = buscarClientesInput.value.trim().toLowerCase();
    const clientesFiltrados = clientes.filter(cliente => {
      return (
        cliente.numeroCliente.toLowerCase().includes(termino) ||
        cliente.rut.toLowerCase().includes(termino) ||
        cliente.nombre.toLowerCase().includes(termino) ||
        cliente.tipoCliente.toLowerCase().includes(termino)
      );
    });
    mostrarClientes(clientesFiltrados);
  }

  buscarClientesBtn.addEventListener('click', function(event) {
    event.preventDefault();
    buscarClientes();
  });

  buscarClientesInput.addEventListener('input', buscarClientes);

  window.seleccionarCliente = function(nombre) {
    const clientInput = document.querySelector('#client');
    clientInput.value = nombre;
    const confirmacionModal = new bootstrap.Modal(document.getElementById('confirmacionModal'));
    confirmacionModal.show();
  };

  // -- Validación de RUT --
  function validarRUT(rut) {
    rut = rut.replace(/\./g, '').replace(/-/g, '');
    var cuerpo = rut.slice(0, -1);
    var dv = rut.slice(-1).toUpperCase();
    if (cuerpo.length < 7 || cuerpo.length > 8) {
      return false;
    }
    var suma = 0;
    var multiplo = 2;
    for (var i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
    var dvEsperado = 11 - (suma % 11);
    if (dvEsperado === 11) dvEsperado = '0';
    if (dvEsperado === 10) dvEsperado = 'K';
    return dvEsperado.toString() === dv;
  }

  document.getElementById('rut').addEventListener('input', function() {
    var rutInput = document.getElementById('rut');
    var rut = rutInput.value.trim();
    if (validarRUT(rut)) {
      rutInput.classList.remove('is-invalid');
      rutInput.classList.add('is-valid');
      document.getElementById('mensajeError').style.display = 'none';
    } else {
      rutInput.classList.add('is-invalid');
      rutInput.classList.remove('is-valid');
    }
  });

  $('.modal').on('hidden.bs.modal', function(e) {
    setTimeout(function() {
      if ($('.modal.show').length) {
        $('body').addClass('modal-open');
      }
    }, 500);
  });

  $('#agregarclientemodal').on('hidden.bs.modal', function(e) {
    setTimeout(function() {
      if ($('#nuevopresupuestoModal').hasClass('show')) {
        $('body').addClass('modal-open');
      }
    }, 500);
  });

  document.getElementById('btnagregarcliente').addEventListener('click', function() {
    var rutInput = document.getElementById('rut');
    var rut = rutInput.value.trim();
    if (!validarRUT(rut)) {
      rutInput.classList.add('is-invalid');
      rutInput.classList.remove('is-valid');
      var mensajeError = document.getElementById('mensajeError');
      mensajeError.innerText = 'El RUT ingresado no es válido. Por favor, verifique el formato e intente nuevamente.';
      mensajeError.style.display = 'block';
      return;
    }
    rutInput.classList.remove('is-invalid');
    rutInput.classList.add('is-valid');
    document.getElementById('mensajeError').style.display = 'none';
    var form = document.getElementById('idformagregarcliente');
    if (form.checkValidity()) {
      var modalCount = $('.modal.show').length;
      $('#agregarclientemodal').modal('hide');
      if (modalCount > 1) {
        setTimeout(function() {
          $('body').addClass('modal-open');
        }, 500);
      }
    } else {
      form.querySelector(':invalid').focus();
      var mensajeError = document.getElementById('mensajeError');
      mensajeError.innerText = 'Por favor complete todos los campos requeridos.';
      mensajeError.style.display = 'block';
    }
  });

  document.getElementById('btneditarcliente').addEventListener('click', function() {
    if (document.getElementById('idformeditarcliente').checkValidity()) {
      document.getElementById('idformeditarcliente').submit();
    } else {
      document.getElementById('idformeditarcliente').querySelector(':invalid').focus();
      var mensajeErroreditar = document.getElementById('mensajeErroreditar');
      mensajeErroreditar.innerText = 'Procurar que los campos requeridos no queden vacíos.';
      mensajeErroreditar.style.display = 'block';
    }
  });
  
            
});
