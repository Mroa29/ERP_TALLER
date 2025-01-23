document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Obtener el token del localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      // Si no hay token, redirigir al login
      window.location.href = 'http://127.0.0.1:5500/Login/loginkronos.html';
      return;
    }

    // Decodificar el token para obtener el ID del usuario
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodedToken.id;

    // Consultar las pantallas disponibles para el usuario
    const responsePantallas = await fetch(`http://localhost:3000/api/usuarios/${userId}/pantallas`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!responsePantallas.ok) {
      throw new Error('Error al obtener las pantallas del usuario');
    }

    const pantallasData = await responsePantallas.json();

    // Obtener los IDs de módulos y submódulos permitidos
    const { modulos, submodulos } = pantallasData;

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

    // Consultar la información del usuario para mostrar su nombre, apellido y taller
    const responseUsuario = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!responseUsuario.ok) {
      throw new Error('Error al obtener la información del usuario');
    }

    const usuarioData = await responseUsuario.json();

    // Insertar el nombre y apellido paterno del usuario en el elemento correspondiente
    const { nombre, apeliido_paterno, taller } = usuarioData.user;

    const userInfoElement = document.getElementById('user-name'); // Asegúrate de que en tu HTML exista un elemento con id="user-name"
    if (userInfoElement) {
      userInfoElement.textContent = `${nombre} ${apeliido_paterno}`;
    }

    // Consultar el nombre del taller
    const responseTaller = await fetch(`http://localhost:3000/api/talleres/${taller}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!responseTaller.ok) {
      throw new Error('Error al obtener la información del taller');
    }

    const tallerData = await responseTaller.json();

    // Insertar el nombre del taller en el elemento correspondiente
    const { nombre_taller } = tallerData;
    const tallerElement = document.getElementById('Nombre_Taller');
    if (tallerElement) {
      tallerElement.textContent = nombre_taller;
    }
  } catch (error) {
    console.error('Error al procesar las pantallas del usuario:', error);
    alert('Error al cargar las opciones disponibles.');
    // Redirigir al login en caso de error crítico
    window.location.href = 'http://127.0.0.1:5500/Login/loginkronos.html';
  }
});
