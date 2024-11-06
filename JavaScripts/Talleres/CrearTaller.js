document.querySelector('.sign-up-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita que el formulario se envíe de manera tradicional

    // Recopila los datos del formulario usando los `id`
    const tallerData = {
        NOM_TALLER: document.getElementById('NOM_TALLER').value,
        DIRECCION_TALLER: document.getElementById('DIRECCION_TALLER').value,
        COMUNA_TALLER: document.getElementById('COMUNA_TALLER').value,
        CIUDAD_TALLER: document.getElementById('CIUDAD_TALLER').value,
        PAIS_TALLER: document.getElementById('PAIS_TALLER').value,
        CONTACTO_TALLER: document.getElementById('CONTACTO_TALLER').value,
        EMAIL_TALLER: document.getElementById('EMAIL_TALLER').value,
        CAPT_VEHICULOS: parseInt(document.getElementById('CAPT_VEHICULOS').value, 10),
        ESTADO_TALLER: "Activo",  // Puedes ajustar esto según sea necesario o dejarlo como un valor fijo
        GERENTE_TALLER: document.getElementById('GERENTE_TALLER').value
    };

    try {
        // Enviar los datos al servidor
        const response = await fetch('http://localhost:3000/api/talleres', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tallerData)
        });

        // Procesar la respuesta
        if (response.ok) {
            const result = await response.json();
            alert('Taller creado con éxito');
            console.log('Nuevo Taller:', result);
            // Redirigir o limpiar el formulario según tu flujo de trabajo
        } else {
            const error = await response.json();
            console.error('Error al crear el taller:', error);
            alert('Hubo un problema al crear el taller');
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('Error de red al intentar crear el taller');
    }
});
