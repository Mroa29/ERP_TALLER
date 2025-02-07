import CONFIG from "../configURL.js";

document.addEventListener('DOMContentLoaded', function () {
    const btnAgregarItemSalida = document.getElementById('btnRegistrarSalidaItem');

    btnAgregarItemSalida.addEventListener('click', async function (event) {
        event.preventDefault();

        console.log("📌 Iniciando proceso de salida de ítem específico...");

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("❌ Error: Usuario no autenticado.");
                alert("Usuario no autenticado. Inicie sesión.");
                return;
            }
            console.log("✅ Token encontrado en LocalStorage.");

            // 📌 Capturar valores del formulario
            const cantidadInsumoInput = document.getElementById('cantidadSalida');
            const caducidadInsumoInput = document.getElementById('caducidadSalida');
            const idInsumoInput = document.getElementById('hiddenInsumoIdSalida');
            const idSucursalInput = document.getElementById('sucursalSalida');

            console.log("📌 Verificando existencia de elementos en el DOM...");

            if (!cantidadInsumoInput || !caducidadInsumoInput || !idInsumoInput || !idSucursalInput) {
                console.error("❌ Error: Uno o más elementos del formulario no existen en el DOM.");
                alert("Error interno: No se encontraron los elementos del formulario.");
                return;
            }
            console.log("✅ Todos los elementos del formulario existen.");

            let cantidadInsumo = parseInt(cantidadInsumoInput.value);
            const caducidadInsumo = caducidadInsumoInput.value;
            const idInsumo = idInsumoInput.value;
            const idSucursal = idSucursalInput.value;

            console.log("📌 Datos capturados del formulario:");
            console.log("- Cantidad Insumo:", cantidadInsumo);
            console.log("- Caducidad Insumo:", caducidadInsumo);
            console.log("- ID Insumo:", idInsumo);
            console.log("- ID Sucursal:", idSucursal);

            if (!cantidadInsumo || cantidadInsumo <= 0 || !caducidadInsumo || !idInsumo || !idSucursal) {
                console.error("❌ Error: Falta uno o más campos obligatorios.");
                alert("Todos los campos son obligatorios y la cantidad debe ser mayor a 0.");
                return;
            }

            // 📌 Paso 1: Obtener el stock actual del insumo
            console.log(`📌 Consultando stock disponible para ID_INSUMO=${idInsumo} en ID_SUCURSAL=${idSucursal}`);

            const stockResponse = await fetch(`${CONFIG.API_BASE_URL}/api/item-especifico/total-stock/${idInsumo}/${idSucursal}`, {
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
            const stockDisponible = stockResult.total_stock || 0;
            console.log(`✅ Stock disponible actual: ${stockDisponible}`);

            // 📌 Validar que la cantidad a retirar no sea mayor que el stock disponible
            if (cantidadInsumo > stockDisponible) {
                alert(`No puede retirar más de ${stockDisponible} unidades disponibles.`);
                return;
            }

            // 📌 Convertir la cantidad en negativo para indicar salida
            cantidadInsumo = -Math.abs(cantidadInsumo);

            // 📌 Paso 2: Registrar la salida del ítem
            const itemData = {
                cantidad_insumo: cantidadInsumo,
                caducidad_insumo: caducidadInsumo,
                id_insumo: idInsumo,
                id_sucursal: idSucursal
            };

            console.log("📌 Enviando datos a la API para registrar salida de ítem:", JSON.stringify(itemData, null, 2));

            const itemResponse = await fetch(`${CONFIG.API_BASE_URL}/api/item-especifico`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(itemData)
            });

            if (!itemResponse.ok) {
                console.error("❌ Error en la respuesta de la API al registrar salida del ítem:", await itemResponse.text());
                throw new Error("Error al registrar la salida del ítem.");
            }

            const itemResult = await itemResponse.json();
            console.log("✅ Salida de ítem registrada con éxito:", itemResult);

            // 📌 Paso 3: Obtener el nuevo stock disponible después de la salida
            const stockResponseUpdated = await fetch(`${CONFIG.API_BASE_URL}/api/item-especifico/total-stock/${idInsumo}/${idSucursal}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!stockResponseUpdated.ok) {
                console.error("❌ Error en la respuesta de la API al obtener el nuevo stock:", await stockResponseUpdated.text());
                throw new Error("Error al obtener el nuevo stock disponible.");
            }

            const stockResultUpdated = await stockResponseUpdated.json();
            const nuevoStockDisponible = stockResultUpdated.total_stock || 0;
            console.log(`✅ Nuevo stock disponible después de la salida: ${nuevoStockDisponible}`);

            // 📌 Paso 4: Obtener datos del insumo para evaluar si el stock es crítico
            const insumoResponse = await fetch(`${CONFIG.API_BASE_URL}/api/insumos/${idInsumo}`, {
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

            // 📌 Paso 5: Actualizar el stock en la tabla INSUMO
            const actualizarStock = {
                stock_disponible: nuevoStockDisponible,
                stock_critico: esStockCritico
            };

            console.log("📌 Enviando datos a la API para actualizar el stock del insumo:", JSON.stringify(actualizarStock, null, 2));

            const updateResponse = await fetch(`${CONFIG.API_BASE_URL}/api/insumos/stock/${idInsumo}`, {
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

            alert("Salida de ítem registrada y stock actualizado correctamente.");
            window.location.reload();

        } catch (error) {
            console.error("❌ Error en el proceso de salida de ítem:", error);
            alert("Error al procesar la solicitud. Intente nuevamente.");
        }
    });
});
