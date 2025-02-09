import CONFIG from "../configURL.js";


document.addEventListener('DOMContentLoaded', async () => {
    try {
      // 📌 Obtener el token del usuario
      const token = localStorage.getItem('token');
      if (!token) {
        mostrarError('No hay sesión activa. Por favor, inicie sesión.');
        window.location.href = '../login/loginkronos.html';
        return;
      }
  
      // 📌 Decodificar el token para obtener el userId
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userId = decodedToken.id;
  
      // 📌 Obtener información del usuario
      const usuarioResponse = await fetch(`${CONFIG.API_BASE_URL}/api/usuarios/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!usuarioResponse.ok) {
        throw new Error('Error al obtener información del usuario.');
      }
  
      const usuarioData = await usuarioResponse.json();
      const idTaller = usuarioData.user.taller;
  
      // 📌 Llamada a la API para obtener la cantidad de presupuestos del mes
      const presupuestosResponse = await fetch(`${CONFIG.API_BASE_URL}/api/presupuestos/mes/${idTaller}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!presupuestosResponse.ok) {
        throw new Error('Error al obtener la cantidad de presupuestos.');
      }
  
      const presupuestosData = await presupuestosResponse.json();
  
      // 📌 Mostrar la cantidad de presupuestos en el elemento con id "AutosPresupuestadosDatos"
      document.getElementById('AutosPresupuestadosDatos').textContent = presupuestosData.cantidadPresupuestos;
    } catch (error) {
      console.error('Error en el script de dashboard:', error);
      mostrarError('Hubo un error al cargar la información. Intente nuevamente.');
    }
  });
  