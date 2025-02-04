document.addEventListener('DOMContentLoaded', function () {
    const btnAgregarItemEspecifico = document.getElementById('btnAgregarItemEspecifico');

    btnAgregarItemEspecifico.addEventListener('click', async function (event) {
        event.preventDefault();

        console.log("📌 Iniciando proceso de agregar ítem específico...");

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("❌ Error: Usuario no autenticado.");
                alert("Usuario no autenticado. Inicie sesión.");
                return;
            }
            console.log("✅ Token encontrado en LocalStorage.");

            // 📌 Capturar valores del formulario
            const cantidadInsumoInput = document.getElementById('cantidadInsumo');
            const caducidadInsumoInput = document.getElementById('caducidadInsumo');
            const idInsumoInput = document.getElementById('hiddenInsumoId');
            const idSucursalInput = document.getElementById('sucursalInsumoEntrada');

            console.log("📌 Verificando existencia de elementos en el DOM...");

            if (!cantidadInsumoInput || !caducidadInsumoInput || !idInsumoInput || !idSucursalInput) {
                console.error("❌ Error: Uno o más elementos del formulario no existen en el DOM.");
                alert("Error interno: No se encontraron los elementos del formulario.");
                return;
            }
            console.log("✅ Todos los elementos del formulario existen.");

            const cantidadInsumo = cantidadInsumoInput.value;
            const caducidadInsumo = caducidadInsumoInput.value;
            const idInsumo = idInsumoInput.value;
            const idSucursal = idSucursalInput.value;

            console.log("📌 Datos capturados del formulario:");
            console.log("- Cantidad Insumo:", cantidadInsumo);
            console.log("- Caducidad Insumo:", caducidadInsumo);
            console.log("- ID Insumo:", idInsumo);
            console.log("- ID Sucursal:", idSucursal);

            if (!cantidadInsumo || !caducidadInsumo || !idInsumo || !idSucursal) {
                console.error("❌ Error: Falta uno o más campos obligatorios.");
                alert("Todos los campos son obligatorios.");
                return;
            }

            // 📌 Paso 1: Agregar el ítem específico
            const itemData = {
                cantidad_insumo: cantidadInsumo,
                caducidad_insumo: caducidadInsumo,
                id_insumo: idInsumo,
                id_sucursal: idSucursal
            };

            console.log("📌 Enviando datos a la API para agregar el ítem:", JSON.stringify(itemData, null, 2));

            const itemResponse = await fetch("http://localhost:3000/api/item-especifico", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(itemData)
            });

            if (!itemResponse.ok) {
                console.error("❌ Error en la respuesta de la API al agregar el ítem:", await itemResponse.text());
                throw new Error("Error al agregar el ítem específico.");
            }

            const itemResult = await itemResponse.json();
            console.log("✅ Ítem específico agregado con éxito:", itemResult);

            // 📌 Paso 2: Obtener el nuevo stock disponible
            console.log(`📌 Consultando stock disponible para ID_INSUMO=${idInsumo} en ID_SUCURSAL=${idSucursal}`);

            const stockResponse = await fetch(`http://localhost:3000/api/item-especifico/total-stock/${idInsumo}/${idSucursal}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!stockResponse.ok) {
                console.error("❌ Error en la respuesta de la API al obtener el stock disponible:", await stockResponse.text());
                throw new Error("Error al obtener el stock disponible.");
            }

            const stockResult = await stockResponse.json();
            const nuevoStockDisponible = stockResult.total_stock || 0;
            console.log(`✅ Nuevo stock disponible: ${nuevoStockDisponible}`);

            // 📌 Paso 3: Obtener datos del insumo
            console.log(`📌 Obteniendo información del insumo con ID=${idInsumo}`);

            const insumoResponse = await fetch(`http://localhost:3000/api/insumos/${idInsumo}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!insumoResponse.ok) {
                console.error("❌ Error en la respuesta de la API al obtener el insumo:", await insumoResponse.text());
                throw new Error("Error al obtener datos del insumo.");
            }

            const insumoData = await insumoResponse.json();
            console.log("📌 Datos del insumo obtenidos:", insumoData);

            // 📌 Determinar si el stock es crítico
            const esStockCritico = nuevoStockDisponible < insumoData.stock_minimo_insumo;
            console.log(`📌 Stock crítico: ${esStockCritico ? "Sí" : "No"}`);

            // 📌 Paso 4: Actualizar el stock en la tabla INSUMO (Solo stock_disponible y stock_critico)
            const actualizarStock = {
                stock_disponible: nuevoStockDisponible,
                stock_critico: esStockCritico
            };

            console.log("📌 Enviando datos a la API para actualizar el stock del insumo:", JSON.stringify(actualizarStock, null, 2));

            const updateResponse = await fetch(`http://localhost:3000/api/insumos/stock/${idInsumo}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(actualizarStock)
            });

            if (!updateResponse.ok) {
                console.error("❌ Error en la respuesta de la API al actualizar el stock:", await updateResponse.text());
                throw new Error("Error al actualizar el stock del insumo.");
            }

            const updateResult = await updateResponse.json();
            console.log("✅ Insumo actualizado con nuevo stock:", updateResult);

            alert("Ítem específico agregado y stock actualizado correctamente.");
            location.reload();

        } catch (error) {
            console.error("❌ Error en el proceso de agregar ítem:", error);
            alert("Error al procesar la solicitud. Intente nuevamente.");
        }
    });
});
