document.addEventListener("DOMContentLoaded", async function () {
    const btnImprimir = document.getElementById("btnImprimirPresupuesto");

    btnImprimir.addEventListener("click", async function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // 📌 OBTENER NOMBRE DEL TALLER Y SUCURSAL
        const nombreTaller = await obtenerNombreTaller();
        const nombreSucursal = await obtenerNombreSucursal();

        // 📌 ENCABEZADO DEL DOCUMENTO
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(`Presupuesto Detallado - ${nombreTaller}`, 20, 15);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 150, 15);
        doc.line(20, 18, 190, 18); // Línea separadora

        // 📌 DATOS DEL PRESUPUESTO
        const idPresupuesto = document.getElementById("idPresupuestoResumen").textContent || "N/A";
        const rutCliente = document.getElementById("rutClienteResumen").textContent || "N/A";
        const placaVehiculo = document.getElementById("placaVehiculoResumen").textContent || "N/A";
        const diasValidez = document.getElementById("diasValidezResumen").textContent || "N/A";
        const observaciones = document.getElementById("observacionesResumen").value.trim() || "No hay observaciones.";

        doc.text(`ID Presupuesto: ${idPresupuesto}`, 20, 30);
        doc.text(`RUT Cliente: ${rutCliente}`, 20, 40);
        doc.text(`Placa Vehículo: ${placaVehiculo}`, 20, 50);
        doc.text(`Sucursal: ${nombreSucursal}`, 20, 60);
        doc.text(`Días de Validez: ${diasValidez}`, 20, 70);
        
        // 📌 OBSERVACIONES
        doc.setFont("helvetica", "bold");
        doc.text("Observaciones:", 20, 80);
        doc.setFont("helvetica", "normal");
        doc.text(observaciones, 20, 90, { maxWidth: 170 });

        // 📌 TABLAS DE DETALLES
        let yPos = 110; // Posición inicial

        function agregarTabla(titulo, tablaId, columnas) {
            const tabla = document.getElementById(tablaId);
            if (!tabla) return;

            const filas = tabla.querySelectorAll("tbody tr");
            if (filas.length === 0) return;

            doc.setFont("helvetica", "bold");
            doc.text(titulo, 20, yPos);
            doc.setFont("helvetica", "normal");
            yPos += 5;

            let data = [];
            filas.forEach((fila) => {
                let rowData = [];
                columnas.forEach((columna, index) => {
                    rowData.push(fila.children[index]?.textContent || "N/A");
                });
                data.push(rowData);
            });

            doc.autoTable({
                startY: yPos,
                head: [columnas],
                body: data,
                theme: "striped",
                styles: { fontSize: 10 },
                margin: { left: 20, right: 20 }
            });

            yPos = doc.lastAutoTable.finalY + 10;
        }

        // 📌 Agregar las tablas
        agregarTabla("Pintura Presupuestada", "tablaPinturaResumen", ["Pieza", "Cantidad", "Tarifa", "Total"]);
        agregarTabla("Mano de Obra Presupuestada", "tablaManoObraResumen", ["Pieza", "Cantidad", "Tarifa", "Total"]);
        agregarTabla("Repuestos Presupuestados", "tablaRepuestosResumen", ["Pieza", "Precio"]);
        agregarTabla("Cobros Realizados", "tablaCobrosResumen", ["N° Recibo", "Importe", "Forma de Pago", "Fecha", "Descripción"]);

        // 📌 TOTALES
        const totalCobrado = document.getElementById("totalCobrado").textContent || "0";
        const presupuestoTotal = document.getElementById("presupuestoTotal").textContent || "0";

        doc.setFont("helvetica", "bold");
        doc.text(`Total Cobrado: $${totalCobrado}`, 20, yPos);
        doc.text(`Presupuesto Total: $${presupuestoTotal}`, 20, yPos + 10);

        // 📌 EXPORTAR PDF
        doc.save(`Presupuesto_${placaVehiculo}.pdf`);
    });

    // 📌 FUNCIONES PARA OBTENER DATOS DINÁMICAMENTE
    async function obtenerNombreTaller() {
        try {
            // Obtener el token
            const token = localStorage.getItem('token');
            if (!token) {
                mostrarError('No hay sesión activa. Por favor, inicie sesión.');
                window.location.href = '../login/loginkronos.html';
                return;
            }

            // Decodificar el token para obtener el userId
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const userId = decodedToken.id;

            // Obtener información del usuario específico
            const usuarioResponse = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
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

            const response = await fetch(`http://localhost:3000/api/talleres/${idTaller}`);
            if (!response.ok) throw new Error("Error al obtener el nombre del taller.");

            const data = await response.json();
            return data.nombre_taller || "Taller Desconocido";
        } catch (error) {
            console.error("Error al obtener el nombre del taller:", error);
            return "Taller Desconocido";
        }
    }

    async function obtenerNombreSucursal() {
        try {
            const idSucursal = document.getElementById("sucursalResumen").textContent.trim();
            if (!idSucursal) return "Sucursal Desconocida";

            const response = await fetch(`http://localhost:3000/api/sucursales/${idSucursal}`);
            if (!response.ok) throw new Error("Error al obtener el nombre de la sucursal.");

            const data = await response.json();
            return data.nombre_sucursal || "Sucursal Desconocida";
        } catch (error) {
            console.error("Error al obtener el nombre de la sucursal:", error);
            return "Sucursal Desconocida";
        }
    }
});
