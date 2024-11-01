import validarRUT from '../Funciones/ValidarRUT.js';


document.addEventListener('DOMContentLoaded', () => {

    const mensajeErrorclienteauto = document.getElementById('mensajeErrorclienteauto');
    const formclienteauto = document.getElementById('idformagregarclienteauto');  
    const rutInputclienteauto = document.getElementById('rutclienteauto'); 
    const btnAgregarClienteauto = document.getElementById('btnagregarclienteauto'); 

    // Función para validar los campos requeridos
    function validarCamposRequeridos() {
        const camposRequeridos = formclienteauto.querySelectorAll('[required]');
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

    // Listener para el botón "Agregar Cliente y Auto"
    btnAgregarClienteauto.addEventListener('click', (event) => {
        event.preventDefault(); 

        
        const rut = rutInputclienteauto.value;

        // Validar RUT
        if (!validarRUT(rut)) {
            mensajeErrorclienteauto.innerText = 'El RUT ingresado no es válido. Por favor, verifique e intente nuevamente.';
            mensajeErrorclienteauto.style.display = 'block';
            return;
        }

        // Validar los campos requeridos
        if (!validarCamposRequeridos()) {
            mensajeErrorclienteauto.innerText = 'Por favor, complete todos los campos requeridos.';
            mensajeErrorclienteauto.style.display = 'block';
            return;
        }

        // Si todo es válido, ocultar el mensaje de error y enviar el formulario
        mensajeErrorclienteauto.style.display = 'none';
        console.log("Todos los campos son válidos, enviando el formulario.");
        formclienteauto.submit(); // Enviar el formulario manualmente
    });
});


