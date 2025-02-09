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
  
      // 📌 Obtener información del usuario para obtener el idTaller
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
  
      // 📌 Llamada a la API para obtener el total cobrado del mes en curso
      const cobrosResponse = await fetch(`${CONFIG.API_BASE_URL}/api/cobros/total/idTaller/${idTaller}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!cobrosResponse.ok) {
        throw new Error('Error al obtener el total cobrado.');
      }
  
      const cobrosData = await cobrosResponse.json();
      const totalCobrado = cobrosData.totalCobrado;
  
      // 📌 Mostrar el total cobrado en el elemento con id "VentasEnCurso"
      document.getElementById('VentasEnCurso').textContent = `$${totalCobrado.toLocaleString('es-CL')}`;
    } catch (error) {
      console.error('Error en el script de dashboard:', error);
      mostrarError('Hubo un error al cargar las ventas del mes. Intente nuevamente.');
    }
  });
  