import CONFIG from "../configURL.js";

document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("firmaEmpleadoCanvas");
    const ctx = canvas.getContext("2d");
    const btnContratar = document.getElementById("btnContratarEmpleado");
    const limpiarFirmaBtn = document.getElementById("limpiarFirma");

    let dibujando = false;

    function ajustarCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    window.addEventListener("resize", ajustarCanvas);
    $('#contratarEmpleadoModal').on('shown.bs.modal', ajustarCanvas);

    canvas.addEventListener("mousedown", (event) => {
        dibujando = true;
        ctx.beginPath();
        ctx.moveTo(event.offsetX, event.offsetY);
    });

    canvas.addEventListener("mousemove", (event) => {
        if (dibujando) {
            ctx.lineTo(event.offsetX, event.offsetY);
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 2;
            ctx.lineCap = "round";
            ctx.stroke();
        }
    });

    canvas.addEventListener("mouseup", () => {
        dibujando = false;
        ctx.closePath();
    });

    canvas.addEventListener("mouseleave", () => {
        dibujando = false;
    });

    limpiarFirmaBtn.addEventListener("click", function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });

    // 📌 Evento al presionar "Contratar"
    btnContratar.addEventListener("click", async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Usuario no autenticado. Inicie sesión.");
                return;
            }

            // 📌 Obtener datos del formulario
            const rutEmpleado = document.getElementById("contratoRutEmpleado").value;
            const idTipoContrato = document.getElementById("tipoContrato").value;
            const remuneracion = document.getElementById("remuneracionContrato").value;
            const archivoContrato = document.getElementById("documentoContrato").files[0];

            if (!rutEmpleado || !idTipoContrato || !remuneracion) {
                alert("Por favor, complete todos los campos obligatorios.");
                return;
            }

            // 📌 Convertir la firma en una imagen
            const firmaBlob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
            const firmaFile = new File([firmaBlob], `firma-${rutEmpleado}.png`, { type: "image/png" });

            // 📌 Subir la firma y obtener el ID generado
            const formDataFirma = new FormData();
            formDataFirma.append("archivo", firmaFile);

            const firmaResponse = await fetch(`${CONFIG.API_BASE_URL}/api/documentos/firmas-empleado/subir`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formDataFirma
            });

            if (!firmaResponse.ok) throw new Error("Error al subir la firma.");

            const firmaData = await firmaResponse.json();
            console.log("📌 Respuesta de la API al subir firma:", JSON.stringify(firmaData, null, 2));

            // 📌 **EXTRAER ID DE LA FIRMA CORRECTAMENTE**
            const idFirma = firmaData.firma?.id_firma_empleado;

            if (!idFirma) {
                console.error("❌ Error: No se obtuvo un ID válido para la firma.");
                alert("Error al obtener el ID de la firma. Intente nuevamente.");
                return;
            }

            console.log(`✅ Firma subida con ID generado: ${idFirma}`);

            // 📌 Subir el documento del contrato (opcional)
            let idDocumento = 0; // 🔹 Si no se adjunta archivo, se asignará 0

            if (archivoContrato) {
                const formDataContrato = new FormData();
                formDataContrato.append("archivo", archivoContrato);

                const contratoResponse = await fetch(`${CONFIG.API_BASE_URL}/api/documentos/documentos/subir`, {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${token}` },
                    body: formDataContrato
                });

                if (!contratoResponse.ok) throw new Error("Error al subir el contrato.");
                const contratoData = await contratoResponse.json();

                // 📌 Si se subió un documento, asignar su ID
                idDocumento = contratoData.documento?.id_documento || 0;
                console.log(`✅ Documento subido con ID generado: ${idDocumento}`);
            } else {
                console.log("📌 No se adjuntó documento, se usará ID: 0");
            }

            // 📌 **Confirmar antes de insertar el contrato**
            console.log(`✅ Insertando contrato con:
                - Empleado: ${rutEmpleado}
                - Tipo de Contrato: ${idTipoContrato}
                - Remuneración: ${remuneracion}
                - ID Firma: ${idFirma}
                - ID Documento: ${idDocumento}
            `);

            // 📌 Insertar el contrato en la base de datos
            const contratoData = {
                id_empleado: rutEmpleado,
                id_tipo_contrato: idTipoContrato,
                remuneracion: remuneracion,
                id_firma_empleado: idFirma,
                id_documento: idDocumento
            };

            const contratoResponse = await fetch(`${CONFIG.API_BASE_URL}/api/contratos`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(contratoData)
            });

            if (!contratoResponse.ok) throw new Error("Error al registrar el contrato.");
            
            alert("Empleado contratado exitosamente.");
            location.reload();

        } catch (error) {
            console.error("Error al contratar empleado:", error);
            alert("Error al procesar la contratación.");
        }
    });
});
