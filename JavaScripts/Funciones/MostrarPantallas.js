document.addEventListener('DOMContentLoaded', async () => {
  try {
      // Obtener el token del localStorage
      const token = localStorage.getItem('token');

      if (!token) {
          // Si no hay token, redirigir al login
          window.location.href = '../login/login.html';
          return;
      }

      // Decodificar el token para obtener el ID del usuario
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.id;

      // Consultar las pantallas disponibles para el usuario
      const response = await fetch(`http://localhost:3000/api/usuarios/${userId}/pantallas`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error('Error al obtener las pantallas del usuario');
      }

      const data = await response.json();

      // Obtener los IDs de módulos y submódulos permitidos
      const { modulos, submodulos } = data;

      // Ocultar todos los módulos y submódulos
      const modulosElements = document.querySelectorAll('[id^="modulo-"]');
      const submodulosElements = document.querySelectorAll('[id^="submodulo-"]');

      modulosElements.forEach(modulo => modulo.style.display = 'none');
      submodulosElements.forEach(submodulo => submodulo.style.display = 'none');

      // Mostrar solo los módulos permitidos
      modulos.forEach(moduloId => {
          const moduloElement = document.getElementById(`modulo-${moduloId}`);
          if (moduloElement) {
              moduloElement.style.display = 'block';
          }
      });

      // Mostrar solo los submódulos permitidos
      submodulos.forEach(submoduloId => {
          const submoduloElement = document.getElementById(`submodulo-${submoduloId}`);
          if (submoduloElement) {
              submoduloElement.style.display = 'block';
          }
      });
  } catch (error) {
      console.error('Error al procesar las pantallas del usuario:', error);
      alert('Error al cargar las opciones disponibles.');
      // Redirigir al login en caso de error crítico
      window.location.href = '../login/login.html';
  }
});
