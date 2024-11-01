import validarRUT from '../Funciones/ValidarRUT.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('idformagregarempleado'); 
    const mensajeError = document.getElementById('mensajeErrorproveedor'); 
    const rutInput = document.getElementById('rutproveedor'); 
    const btnAgregarEmpleado = document.getElementById('btnagregarproveedor'); 

    // Función para validar los campos requeridos
    function validarCamposRequeridos() {
        const camposRequeridos = form.querySelectorAll('[required]');
        let todosCompletos = true;

        camposRequeridos.forEach((campo) => {
            if (!campo.value.trim()) {
                todosCompletos = false;
                campo.classList.add('is-invalid'); 
            } else {
                campo.classList.remove('is-invalid');
            }
        });

        return todosCompletos;
    }

    // Listener para el botón "Agregar Empleado"
    btnAgregarEmpleado.addEventListener('click', (event) => {
        event.preventDefault();

        const rut = rutInput.value;

        // Validar RUT
        if (!validarRUT(rut)) {
            mensajeError.innerText = 'El RUT ingresado no es válido. Por favor, verifique e intente nuevamente.';
            mensajeError.style.display = 'block';
            return;
        }

        // Validar los campos requeridos
        if (!validarCamposRequeridos()) {
            mensajeError.innerText = 'Por favor, complete todos los campos requeridos.';
            mensajeError.style.display = 'block';
            return;
        }

        // Si todo es válido, ocultar el mensaje de error y enviar el formulario
        mensajeError.style.display = 'none';
        console.log("Todos los campos son válidos, enviando el formulario.");
        form.submit();
    });
});
