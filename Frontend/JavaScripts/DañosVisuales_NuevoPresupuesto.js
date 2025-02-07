document.addEventListener('DOMContentLoaded', function() {
    const vehicleMap = document.querySelector('.vehicle-map');
    const cursorMarker = document.getElementById('cursorMarker');
    let x, y;
    let damageCount = 0;
    let damages = [];
    let recycledIds = [];

    vehicleMap.addEventListener('mousemove', function(event) {
      const rect = vehicleMap.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      cursorMarker.style.left = `${x}px`;
      cursorMarker.style.top = `${y}px`;
      cursorMarker.style.display = 'block';
    });

    vehicleMap.addEventListener('mouseleave', function() {
      cursorMarker.style.display = 'none';
    });

    vehicleMap.addEventListener('click', function() {
      $('#damageModal').modal('show');
    });

    const damageForm = document.getElementById('damageForm');
    const damageList = document.getElementById('damageList');

    damageForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const description = document.getElementById('damageDescription').value;
      const severity = document.getElementById('damageSeverity').value;
      
      // Reuse the ID of a deleted damage if available, otherwise increment damageCount
      const damageId = recycledIds.length > 0 ? recycledIds.shift() : ++damageCount;
      
      const damage = { description, severity, id: damageId, x, y };
      damages.push(damage);

      // Crear marcador de daño
      const marker = document.createElement('div');
      marker.className = 'damage-marker';
      marker.style.top = `${y}px`;
      marker.style.left = `${x}px`;
      marker.innerText = damageId;
      marker.setAttribute('data-id', damageId);
      vehicleMap.appendChild(marker);

      // Agregar daño a la lista
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item';
      listItem.innerHTML = `
        <strong>Daño ${damageId}:</strong>
        <p>${description}</p>
        <span class="badge badge-${severity.toLowerCase() === 'severo' ? 'danger' : severity.toLowerCase() === 'moderado' ? 'warning' : 'success'}">${severity}</span>
        <button class="btn btn-danger btn-sm float-right" onclick="eliminarDaño(${damageId})"><i class="fas fa-trash"></i></button>
      `;
      listItem.setAttribute('data-id', damageId);
      damageList.appendChild(listItem);

      // Limpiar y cerrar modal
      document.getElementById('damageDescription').value = '';
      document.getElementById('damageSeverity').value = 'Leve';
      $('#damageModal').modal('hide');
    });

    window.eliminarDaño = function(id) {
      // Eliminar marcador de daño
      document.querySelector(`.damage-marker[data-id="${id}"]`).remove();
      // Eliminar daño de la lista
      document.querySelector(`.list-group-item[data-id="${id}"]`).remove();
      // Eliminar daño del array de daños
      damages = damages.filter(damage => damage.id !== id);
      // Agregar el ID a la lista de IDs reciclados
      recycledIds.push(id);
    };
  });