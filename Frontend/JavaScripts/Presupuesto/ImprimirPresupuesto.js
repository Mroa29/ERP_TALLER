import CONFIG from "../configURL.js";

document.addEventListener("DOMContentLoaded", async function () {
  const btnImprimir = document.getElementById("btnImprimirPresupuesto");

  btnImprimir.addEventListener("click", async function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");

    // Configuración de márgenes y medidas
    const marginLeft = 10;
    const marginRight = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let currentY = 15;

    // Función para verificar el salto de página
    function checkPageBreak(currentY, marginTop = 15, marginBottom = 10) {
      if (currentY + marginBottom > pageHeight) {
        doc.addPage();
        return marginTop;
      }
      return currentY;
    }

    // ───────────────────────────────────────────────
    // 📌 OBTENER NOMBRE DEL TALLER Y SUCURSAL
    // ───────────────────────────────────────────────
    const nombreTaller = await obtenerNombreTaller();
    const nombreSucursal = document
      .getElementById("sucursalResumen")
      .textContent.trim();

    // (Opcional) Agregar logo
    // Si cuentas con una imagen base64, descomenta y ajusta la siguiente línea:
    // doc.addImage(logoData, 'PNG', marginLeft, 5, 30, 30);

    // ───────────────────────────────────────────────
    // 📌 ENCABEZADO DEL DOCUMENTO
    // ───────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    currentY = checkPageBreak(currentY);
    doc.text(nombreTaller, pageWidth / 2, currentY, { align: "center" });
    currentY += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    currentY = checkPageBreak(currentY);
    doc.text(`Sucursal: ${nombreSucursal}`, pageWidth / 2, currentY, {
      align: "center",
    });
    doc.text(
      `Fecha: ${new Date().toLocaleDateString()}`,
      pageWidth - marginLeft,
      currentY,
      { align: "right" }
    );
    currentY += 10;

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(marginLeft, currentY, pageWidth - marginLeft, currentY);
    currentY += 5;

    // ───────────────────────────────────────────────
    // 📌 DATOS DEL PRESUPUESTO
    // ───────────────────────────────────────────────
    const idPresupuesto =
      document.getElementById("idPresupuestoResumen").textContent || "N/A";
    const rutCliente =
      document.getElementById("rutClienteResumen").textContent || "N/A";
    const placaVehiculo =
      document.getElementById("placaVehiculoResumen").textContent || "N/A";
    const diasValidez =
      document.getElementById("diasValidezResumen").textContent || "N/A";

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    currentY = checkPageBreak(currentY);
    doc.text("Datos del Presupuesto", marginLeft, currentY);
    currentY += 5;

    // Fondo para datos del presupuesto
    doc.setFillColor(245, 245, 245);
    currentY = checkPageBreak(currentY);
    doc.rect(marginLeft, currentY, pageWidth - 2 * marginLeft, 25, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    currentY = checkPageBreak(currentY);
    doc.text(`ID Presupuesto: ${idPresupuesto}`, marginLeft + 5, currentY + 7);
    doc.text(`RUT Cliente: ${rutCliente}`, marginLeft + 5, currentY + 14);
    doc.text(
      `Placa Vehículo: ${placaVehiculo}`,
      pageWidth / 2,
      currentY + 7,
      { align: "center" }
    );
    doc.text(
      `Días de Validez: ${diasValidez}`,
      pageWidth / 2,
      currentY + 14,
      { align: "center" }
    );
    currentY += 30;

    // ───────────────────────────────────────────────
    // 📌 DATOS DEL CLIENTE
    // ───────────────────────────────────────────────
    const datosCliente = await obtenerDatosCliente(rutCliente);
    if (datosCliente) {
      doc.setFont("helvetica", "bold");
      currentY = checkPageBreak(currentY);
      doc.text("Datos del Cliente", marginLeft, currentY);
      currentY += 5;
      doc.setFillColor(235, 235, 235);
      currentY = checkPageBreak(currentY);
      // Se aumenta la altura del rectángulo para acomodar las 2 líneas de datos
      doc.rect(marginLeft, currentY, pageWidth - 2 * marginLeft, 30, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      // Se muestra el nombre en una línea por sí solo
      doc.text(
        `Nombre: ${datosCliente.nom_cliente || "N/A"}`,
        marginLeft + 5,
        currentY + 7
      );
      // En la siguiente línea, se muestran Teléfono y Dirección
      doc.text(
        `Teléfono: ${datosCliente.telefono_cliente || "N/A"}`,
        marginLeft + 5,
        currentY + 14
      );
      doc.text(
        `Dirección: ${datosCliente.direccion_cliente || "N/A"}`,
        pageWidth - marginLeft - 5,
        currentY + 14,
        { align: "right" }
      );
      currentY += 35;
    }

    // ───────────────────────────────────────────────
    // 📌 DATOS DEL VEHÍCULO
    // ───────────────────────────────────────────────
    const datosVehiculo = await obtenerDatosVehiculo(placaVehiculo);
    if (datosVehiculo) {
      doc.setFont("helvetica", "bold");
      currentY = checkPageBreak(currentY);
      doc.text("Datos del Vehículo", marginLeft, currentY);
      currentY += 5;
      doc.setFillColor(245, 245, 245);
      currentY = checkPageBreak(currentY);
      doc.rect(marginLeft, currentY, pageWidth - 2 * marginLeft, 25, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(
        `Marca: ${datosVehiculo.marca_vehiculo || "N/A"}`,
        marginLeft + 5,
        currentY + 7
      );
      doc.text(
        `Modelo: ${datosVehiculo.modelo_vehiculo || "N/A"}`,
        pageWidth / 2,
        currentY + 7,
        { align: "center" }
      );
      doc.text(
        `Año: ${datosVehiculo.ano_vehiculo || "N/A"}`,
        marginLeft + 5,
        currentY + 14
      );
      currentY += 30;
    }

    // ───────────────────────────────────────────────
    // 📌 Función para agregar tablas con un estilo mejorado
    // ───────────────────────────────────────────────
    function agregarTabla(titulo, tablaId, columnas) {
      const tabla = document.getElementById(tablaId);
      if (!tabla) return;

      const filas = tabla.querySelectorAll("tbody tr");
      if (filas.length === 0) return;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      currentY = checkPageBreak(currentY);
      doc.text(titulo, marginLeft, currentY);
      currentY += 5;

      let data = [];
      filas.forEach((fila) => {
        let rowData = [];
        columnas.forEach((columna, index) => {
          rowData.push(fila.children[index]?.textContent || "N/A");
        });
        data.push(rowData);
      });

      doc.autoTable({
        startY: currentY,
        head: [columnas],
        body: data,
        theme: "striped",
        headStyles: {
          fillColor: [52, 73, 94],
          textColor: 255,
          halign: "center",
        },
        bodyStyles: {
          fontSize: 10,
          halign: "center",
        },
        margin: { left: marginLeft, right: marginLeft },
        styles: { overflow: "linebreak" },
        didDrawPage: function (data) {
          currentY = data.cursor.y;
        },
      });
      currentY = doc.lastAutoTable.finalY + 10;
    }

    // ───────────────────────────────────────────────
    // 📌 Agregar las tablas
    // ───────────────────────────────────────────────
    agregarTabla("Pintura Presupuestada", "tablaPinturaResumen", [
      "Pieza",
      "Cantidad",
      "Tarifa",
      "Total",
    ]);
    agregarTabla("Mano de Obra Presupuestada", "tablaManoObraResumen", [
      "Pieza",
      "Cantidad",
      "Tarifa",
      "Total",
    ]);
    agregarTabla("Repuestos Presupuestados", "tablaRepuestosResumen", [
      "Pieza",
      "Precio",
    ]);
    agregarTabla("Cobros Realizados", "tablaCobrosResumen", [
      "N° Recibo",
      "Importe",
      "Forma de Pago",
      "Fecha",
      "Descripción",
    ]);

    // ───────────────────────────────────────────────
    // 📌 DATOS FINANCIEROS
    // ───────────────────────────────────────────────
    const totalCobrado =
      document.getElementById("totalCobrado").textContent || "0";
    const presupuestoTotal =
      document.getElementById("presupuestoTotal").textContent || "0";
    const totalPorCobrar =
      document.getElementById("totalPorCobrar").textContent || "0";

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    currentY = checkPageBreak(currentY);
    doc.text("Resumen Financiero", marginLeft, currentY);
    currentY += 5;
    doc.setFillColor(230, 230, 230);
    currentY = checkPageBreak(currentY);
    doc.rect(marginLeft, currentY, pageWidth - 2 * marginLeft, 20, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(
      `Total Cobrado: ${totalCobrado}`,
      marginLeft + 5,
      currentY + 7
    );
    doc.text(
      `Presupuesto Total: ${presupuestoTotal}`,
      marginLeft + 5,
      currentY + 14
    );
    doc.text(
      `Total Por Cobrar: ${totalPorCobrar}`,
      pageWidth / 2,
      currentY + 7,
      { align: "center" }
    );
    currentY += 30;

    // ───────────────────────────────────────────────
    // 📌 BLOQUE FINAL: Condiciones y Tiempos (Diseño Mejorado)
    // ───────────────────────────────────────────────
    currentY += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    currentY = checkPageBreak(currentY);
    doc.text("Condiciones y Tiempos", marginLeft, currentY);
    currentY += 5;

    const finalSections = [
      {
        title: "Condiciones Generales de Trabajo y Presupuestos",
        lines: [
          "_______________________________________________________________________________________",
          "Tiempos Estimados de Trabajo:",
          "  • Leve: 5 a 7 días hábiles.",
          "  • Medio: 10 a 12 días hábiles.",
          "  • Alto: 15 a 20 días hábiles.",
          "  • Extremo/Pintura Completa: 20 a 30 días hábiles.",
          "Los tiempos son aproximados y pueden variar. Cualquier cambio será comunicado oportunamente.",
        ],
      },
      {
        title: "Condiciones de Pago",
        lines: [
          "_______________________________________________________________________________________",
          "1. Reserva de agenda: 10% del presupuesto.",
          "2. Ingreso del vehículo: 50% del saldo restante.",
          "3. Entrega del vehículo: 50% del saldo restante.",
          "Debe contactarnos para agendar según disponibilidad.",
        ],
      },
      {
        title: "Importante sobre Repuestos",
        lines: [
          "_______________________________________________________________________________________",
          "Se recomienda siempre el uso de piezas originales, ya que repuestos alternativos pueden presentar:",
          "  • Descuadres o malas terminaciones (especialmente en parachoques y ópticos).",
          "  • Diferencias en el ramal eléctrico, que podrían requerir modificaciones adicionales.",
          "Kronos Automotriz no se responsabiliza por fallas en repuestos alternativos ni por costos adicionales asociados a su montaje o ajuste.",
          "Nota: Piezas como tapas de remolque, molduras o embellecedores no están incluidas en parachoques y se venden por separado.",
        ],
      },
      {
        title: "Sobre Daños Mayores y Modificaciones",
        lines: [
          "_______________________________________________________________________________________",
          "Al desarmar el vehículo, pueden surgir daños adicionales no visibles inicialmente.",
          "Esto podría requerir ajustes al presupuesto, los cuales serán comunicados y autorizados previamente por el cliente.",
          "Kronos no puede dar garantías por parachoques reparado, debido a que las sujeciones y piezas son muy delgadas para asegurar que no se volverán a dañar en el mismo punto.",
          "En caso de ser repuestos de desarmaduría o que los proporcione el cliente, Kronos no se hace responsable por daños ocasionados en el transporte de estos.",
        ],
      },
      {
        title: "Revisión",
        lines: [
          "_______________________________________________________________________________________",
          "Revisar cada ítem del presupuesto para evitar confusiones.",
          "Trabajos adicionales serán realizados solo con aprobación previa.",
        ],
      },
    ];

    finalSections.forEach((section) => {
      currentY += 5;
      currentY = checkPageBreak(currentY);
      const headerHeight = 8;
      doc.setFillColor(220, 220, 220);
      doc.rect(marginLeft, currentY, pageWidth - 2 * marginLeft, headerHeight, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(section.title, marginLeft + 2, currentY + headerHeight - 2);
      currentY += headerHeight + 2;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      section.lines.forEach((line) => {
        const splittedText = doc.splitTextToSize(line, pageWidth - 2 * marginLeft);
        splittedText.forEach((textLine) => {
          currentY = checkPageBreak(currentY);
          doc.text(textLine, marginLeft, currentY);
          currentY += 6; // Aproximadamente 6mm de altura por línea
        });
      });
    });
    // ───────────────────────────────────────────────

    // ───────────────────────────────────────────────
    // 📌 Guardar el PDF
    // ───────────────────────────────────────────────
    doc.save(`Presupuesto_${placaVehiculo}.pdf`);
  });

  // ───────────────────────────────────────────────
  // 📌 Funciones para obtener datos (cliente, vehículo, taller y sucursal)
  // ───────────────────────────────────────────────
  async function obtenerDatosCliente(rut) {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/clientes/${rut}`);
      if (!response.ok)
        throw new Error("Error al obtener los datos del cliente.");
      return await response.json();
    } catch (error) {
      console.error("Error al obtener datos del cliente:", error);
      return null;
    }
  }

  async function obtenerDatosVehiculo(placa) {
    try {
      const response = await fetch(`${CONFIG.API_BASE_URL}/api/vehiculos/${placa}`);
      if (!response.ok)
        throw new Error("Error al obtener los datos del vehículo.");
      return await response.json();
    } catch (error) {
      console.error("Error al obtener datos del vehículo:", error);
      return null;
    }
  }

  async function obtenerNombreTaller() {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Usuario no autenticado.");
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.id;

      const response = await fetch(`${CONFIG.API_BASE_URL}/api/usuarios/${userId}`);
      if (!response.ok)
        throw new Error("Error al obtener información del usuario.");
      const usuarioData = await response.json();
      const idTaller = usuarioData.user.taller;

      const tallerResponse = await fetch(`${CONFIG.API_BASE_URL}/api/talleres/${idTaller}`);
      if (!tallerResponse.ok)
        throw new Error("Error al obtener el nombre del taller.");
      const tallerData = await tallerResponse.json();
      return tallerData.nombre_taller || "Taller Desconocido";
    } catch (error) {
      console.error("Error al obtener el nombre del taller:", error);
      return "Taller Desconocido";
    }
  }
});
