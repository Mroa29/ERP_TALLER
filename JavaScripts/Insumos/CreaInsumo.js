document.addEventListener("DOMContentLoaded", function () {
    const btnAgregarInsumo = document.getElementById("btnAgregarInsumo");

    btnAgregarInsumo.addEventListener("click", async function (event) {
        event.preventDefault();

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Usuario no autenticado. Inicie sesión.");
                return;
            }

            // 📌 Obtener los valores del formulario
            const descripcion = document.getElementById("descripcionInsumo").value.trim();
            const formato = document.getElementById("formatoInsumo").value.trim();
            const precio = parseInt(document.getElementById("precioInsumo").value);
            const stockMinimo = parseInt(document.getElementById("stockMinimoInsumo").value);
            const stockMaximo = parseInt(document.getElementById("stockMaximoInsumo").value);
            const idSucursal = document.getElementById("sucursalInsumo").value;

            // 📌 Validar que los campos obligatorios no estén vacíos
            if (!descripcion || !formato || isNaN(precio) || isNaN(stockMinimo) || isNaN(stockMaximo) || !idSucursal) {
                alert("Todos los campos son obligatorios.");
                return;
            }

            // 📌 Crear el objeto del insumo
            const nuevoInsumo = {
                descripcion: descripcion,
                formato: formato,
                precio: precio,
                stock_minimo: stockMinimo,
                stock_maximo: stockMaximo,
                stock_disponible: 0, // Siempre comienza en 0
                stock_critico: true, // Siempre se envía como true
                id_sucursal: idSucursal
            };

            // 📌 Enviar solicitud a la API
            const response = await fetch("http://localhost:3000/api/insumos", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(nuevoInsumo)
            });

            if (!response.ok) {
                throw new Error("Error al agregar el insumo.");
            }

            alert("Insumo agregado con éxito.");
            location.reload(); // Refrescar la página para mostrar el nuevo insumo

        } catch (error) {
            console.error("Error al agregar insumo:", error);
            alert("Hubo un problema al agregar el insumo.");
        }
    });
});
