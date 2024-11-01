import validarRUT from '../Funciones/ValidarRUT.js';

document.addEventListener('DOMContentLoaded', () => {
    const mensajeAlerta = document.getElementById('mensajeError'); 
    const rutInput = document.getElementById('rut'); 
    const form = document.getElementById('idformagregarcliente'); 
    const btnAgregarCliente = document.getElementById('btnagregarcliente'); 

    // Función para validar los campos requeridos
    function validarCamposRequeridos() {
        const camposRequeridos = form.querySelectorAll('[required]');
        let todosCompletos = true;

        camposRequeridos.forEach((campo) => {
            if (!campo.value.trim()) {
                todosCompletos = false;
                campo.classList.add('is-invalid'); 
            } else {
                campo.classList.remove('is-invalid'); // Remueve la clase de error si el campo está completo
            }
        });

        return todosCompletos;
    }

    // Función para mostrar mensajes de alerta
    function mostrarMensaje(mensaje, tipo = "error") {
        mensajeAlerta.innerText = mensaje;
        mensajeAlerta.style.display = 'block';
        
        // Cambia el color según el tipo de mensaje
        if (tipo === "exito") {
            mensajeAlerta.classList.remove('alert-danger');
            mensajeAlerta.classList.add('alert-success');
        } else {
            mensajeAlerta.classList.remove('alert-success');
            mensajeAlerta.classList.add('alert-danger');
        }
    }

    // Listener para el botón "Agregar Cliente"
    btnAgregarCliente.addEventListener('click', async (event) => {
        event.preventDefault(); 

        const rut = rutInput.value;

        // Validar RUT
        if (!validarRUT(rut)) {
            mostrarMensaje('El RUT ingresado no es válido. Por favor, verifique e intente nuevamente.', "error");
            return;
        }

        // Validar los campos requeridos
        if (!validarCamposRequeridos()) {
            mostrarMensaje('Por favor, complete todos los campos requeridos.', "error");
            return;
        }

        // Si todo es válido, ocultar el mensaje de error
        mensajeAlerta.style.display = 'none';

        // Recopilar los datos del formulario
        const clienteData = {
            rut_cliente: rut,
            tipo_cliente: document.getElementById('tipoclient').value,
            nom_cliente: document.getElementById('nombre').value,
            telmovil_cliente: document.getElementById('movil').value,
            telfijo_cliente: document.getElementById('phone').value,
            direccion_cliente: document.getElementById('direccion').value,
            comuna_cliente: document.getElementById('comuna').value,
            ciudad_cliente: document.getElementById('city').value,
            pais_cliente: document.getElementById('country').value,
            email_cliente: document.getElementById('email').value,
            id_sucursal: 1  // Sucursal fija para este ejemplo
        };

        try {
            // Realizar la solicitud HTTP POST
            const response = await fetch("http://127.0.0.1:8000/clientes/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(clienteData)
            });

            // Verificar la respuesta del servidor
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Error al agregar el cliente.');
            }

            // Cliente agregado correctamente
            const data = await response.json();
            console.log("Cliente agregado exitosamente:", data);
            mostrarMensaje("Cliente agregado correctamente", "exito");
            form.reset(); // Limpiar el formulario
        } catch (error) {
            console.error("Hubo un problema al agregar el cliente:", error);
            mostrarMensaje(error.message, "error");
        }
    });
});
