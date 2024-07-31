document.addEventListener('DOMContentLoaded', () => {
    const formCobro = document.getElementById('formCobro');
    const formEditCobro = document.getElementById('formEditCobro');
    const tablaCobros = document.getElementById('tablacobrosacuenta').getElementsByTagName('tbody')[0];
    let editRowIndex = null;

    formCobro.addEventListener('submit', (event) => {
        event.preventDefault();
        const nuevoCobro = {
            numeroRecibo: document.getElementById('numeroRecibo').value,
            importeCobrado: document.getElementById('importeCobrado').value,
            formaPago: document.getElementById('formaPago').value,
            fechaCobro: document.getElementById('fechaCobro').value,
            descripcion: document.getElementById('descripcion').value
        };
        agregarCobroATabla(nuevoCobro);
        formCobro.reset();
    });

    formEditCobro.addEventListener('submit', (event) => {
        event.preventDefault();
        const cobroEditado = {
            numeroRecibo: document.getElementById('editNumeroRecibo').value,
            importeCobrado: document.getElementById('editImporteCobrado').value,
            formaPago: document.getElementById('editFormaPago').value,
            fechaCobro: document.getElementById('editFechaCobro').value,
            descripcion: document.getElementById('editDescripcion').value
        };
        actualizarCobroEnTabla(cobroEditado);
        $('#editModal').modal('hide');
    });

    function agregarCobroATabla(cobro) {
        const newRow = tablaCobros.insertRow();
        newRow.innerHTML = `
            <td>${cobro.numeroRecibo}</td>
            <td>$${cobro.importeCobrado}</td>
            <td>${cobro.formaPago}</td>
            <td>${cobro.fechaCobro}</td>
            <td>${cobro.descripcion}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarCobro(this)"><i class="fas fa-pencil-alt"></i></button>
                <button class="btn btn-danger btn-sm" onclick="eliminarCobro(this)"><i class="fas fa-trash"></i></button>
            </td>
        `;
    }

    window.editarCobro = function (btn) {
        const row = btn.parentNode.parentNode;
        editRowIndex = row.rowIndex - 1;
        document.getElementById('editNumeroRecibo').value = row.cells[0].innerText;
        document.getElementById('editImporteCobrado').value = row.cells[1].innerText.replace('$', '');
        document.getElementById('editFormaPago').value = row.cells[2].innerText;
        document.getElementById('editFechaCobro').value = row.cells[3].innerText;
        document.getElementById('editDescripcion').value = row.cells[4].innerText;
        $('#editModal').modal('show');
    };

    window.eliminarCobro = function (btn) {
        const row = btn.parentNode.parentNode;
        row.remove();
    };

    function actualizarCobroEnTabla(cobro) {
        const row = tablaCobros.rows[editRowIndex];
        row.cells[0].innerText = cobro.numeroRecibo;
        row.cells[1].innerText = `$${cobro.importeCobrado}`;
        row.cells[2].innerText = cobro.formaPago;
        row.cells[3].innerText = cobro.fechaCobro;
        row.cells[4].innerText = cobro.descripcion;
    }
});