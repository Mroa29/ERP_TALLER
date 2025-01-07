document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar recargar la página
  
    // Obtener los valores del formulario
    const form = event.target;
    const formData = new FormData(form);
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
    };
  
    try {
      // Enviar la solicitud al backend
      const response = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
  
      // Manejar la respuesta
      if (response.ok) {
        const result = await response.json();
        console.log('Login exitoso:', result);
  
        // Guardar el token en localStorage o cookies
        localStorage.setItem('token', result.token);
  
        // Redirigir al usuario a la siguiente página
        window.location.href = form.action;
      } else {
        const error = await response.json();
        console.error('Error al iniciar sesión:', error.message);
        alert('Error al iniciar sesión: ' + error.message);
      }
    } catch (err) {
      console.error('Error al conectar con el servidor:', err);
      alert('Error al conectar con el servidor.');
    }
  });
  