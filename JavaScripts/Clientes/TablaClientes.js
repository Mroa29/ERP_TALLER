document.addEventListener('DOMContentLoaded', function () {
    const url = 'http://localhost:3000/api/clientes';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#tablalistadoclientes tbody');
            tbody.innerHTML = ''; 

            if (!Array.isArray(data) || data.length === 0) {
                console.warn('No se encontraron clientes o los datos no son un array:', data);
                return;
            }

            // Obtener los últimos 10 clientes
            const ultimosClientes = data.slice(-10);

            // Iterar sobre los últimos 10 clientes y crear una fila para cada uno
            ultimosClientes.forEach(cliente => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${cliente.id_cliente ?? 'N/A'}</td>
                    <td>${cliente.rut_cliente ?? 'N/A'}</td>
                    <td>${cliente.nom_cliente ?? 'N/A'}</td>
                    <td>${cliente.tipo_cliente ?? 'N/A'}</td>
                    <td><button class="btn btn-primary btn-sm">Ver</button></td>
                `;
                
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error al obtener los clientes:', error);
        });
});
