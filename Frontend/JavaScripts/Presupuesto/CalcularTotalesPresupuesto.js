import CONFIG from "../configURL.js";

document.addEventListener("DOMContentLoaded", function () {
    const totalCobradoElement = document.getElementById("totalCobrado");
    const totalPorCobrarElement = document.getElementById("totalPorCobrar");
    const presupuestoTotalElement = document.getElementById("presupuestoTotal");


    async function fetchTotal(url, key) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error al obtener datos de ${url}`);
            const data = await response.json();
            return parseInt(data[key]) || 0;
        } catch (error) {
            console.error(`Error al obtener el total de ${url}:`, error);
            return 0;
        }
    }

    async function calcularTotales(id) {
        const totalPintura = await fetchTotal(`${CONFIG.API_BASE_URL}/api/pintura-presupuestada/total/${id}`, "total_pintura_presupuestada");
        const totalManoObra = await fetchTotal(`${CONFIG.API_BASE_URL}/api/mano-de-obra-presupuestada/total/${id}`, "total_mano_obra_presupuestada");
        const totalRepuestos = await fetchTotal(`${CONFIG.API_BASE_URL}/api/repuestos-presupuestados/total/${id}`, "total_repuestos_presupuestados");
        const totalCobrado = await fetchTotal(`${CONFIG.API_BASE_URL}/api/cobros/total/${id}`, "total_cobrado");

        const presupuestoTotal = totalPintura + totalManoObra + totalRepuestos;
        const totalPorCobrar = presupuestoTotal - totalCobrado;

        // Actualizar elementos del DOM
        totalCobradoElement.textContent = `${totalCobrado.toLocaleString()}`;
        presupuestoTotalElement.textContent = `${presupuestoTotal.toLocaleString()}`;
        totalPorCobrarElement.textContent = `${totalPorCobrar.toLocaleString()}`;
    }

    function observarIDPresupuesto() {
        const idPresupuestoElement = document.getElementById("idPresupuestoResumen");

        const observer = new MutationObserver(() => {
            const idPresupuesto = idPresupuestoElement.textContent.trim();
            if (idPresupuesto) {
                console.log("ID de presupuesto detectado o cambiado:", idPresupuesto);
                calcularTotales(idPresupuesto);
            }
        });

        observer.observe(idPresupuestoElement, { childList: true, subtree: true, characterData: true });
    }

    observarIDPresupuesto();
});
