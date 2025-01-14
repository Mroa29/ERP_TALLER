document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Evitar recargar la página

  const form = event.target;
  const formData = new FormData(form);
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  try {
      console.log('Datos enviados:', data); // Verificar datos enviados
      const response = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
          const result = await response.json();
          console.log('Login exitoso:', result);
          localStorage.setItem('token', result.token); // Guardar token
          window.location.href = form.action; // Redirigir
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
