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
  
      // 📌 Obtener el total de ventas del mes en curso
      const ventasResponse = await fetch(`${CONFIG.API_BASE_URL}/api/cobros/total/idTaller/${idTaller}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!ventasResponse.ok) {
        throw new Error('Error al obtener el total de ventas.');
      }
  
      const ventasData = await ventasResponse.json();
      const totalVentas = ventasData.totalCobrado;
  
      // 📌 Obtener la cantidad de presupuestos con al menos un cobro en el mes en curso
      const presupuestosResponse = await fetch(`${CONFIG.API_BASE_URL}/api/presupuestos/con-cobros/mes/${idTaller}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!presupuestosResponse.ok) {
        throw new Error('Error al obtener la cantidad de presupuestos con cobros.');
      }
  
      const presupuestosData = await presupuestosResponse.json();
      const cantidadPresupuestos = presupuestosData.cantidadPresupuestos;
  
      // 📌 Calcular el ticket promedio (totalVentas / cantidadPresupuestos)
      let ticketPromedio = cantidadPresupuestos > 0 ? totalVentas / cantidadPresupuestos : 0;
  
      // 📌 Mostrar el ticket promedio en el elemento con id "TiketPromedioVentas"
      document.getElementById('TiketPromedioVentas').textContent = `$${ticketPromedio.toLocaleString('es-CL', { minimumFractionDigits: 0 })}`;
    } catch (error) {
      console.error('Error en el script de dashboard:', error);
      document.getElementById('TiketPromedioVentas').textContent = 'Error';
    }
  });
  