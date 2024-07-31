document.addEventListener('DOMContentLoaded', () => {
    const addPartButton = document.querySelector('#add-part');
    const newPartNameInput = document.querySelector('#new-part-name');
    const carModelInput = document.querySelector('#car-model');
    const paintPartsList = document.querySelector('#paint-parts-list');
    const repairPartsList = document.querySelector('#repair-parts-list');
    const buyPartsList = document.querySelector('#buy-parts-list');
    const processPartsList = document.querySelector('#process-parts-list');

    const selectedPaintParts = document.querySelector('#selected-paint-parts');
    const selectedRepairParts = document.querySelector('#selected-repair-parts');
    const selectedBuyParts = document.querySelector('#selected-buy-parts');
    const selectedProcessParts = document.querySelector('#selected-process-parts');

    const totalPaintCostEl = document.querySelector('#total-paint-cost');
    const totalRepairCostEl = document.querySelector('#total-repair-cost');
    const totalBuyCostEl = document.querySelector('#total-buy-cost');
    const totalProcessCostEl = document.querySelector('#total-process-cost');

    let totalPaintCost = 0;
    let totalRepairCost = 0;
    let totalBuyCost = 0;
    let totalProcessCost = 0;

    function updateTotalCost() {
        totalPaintCostEl.textContent = `$${totalPaintCost.toLocaleString()}`;
        totalRepairCostEl.textContent = `$${totalRepairCost.toLocaleString()}`;
        totalBuyCostEl.textContent = `$${totalBuyCost.toLocaleString()}`;
        totalProcessCostEl.textContent = `$${totalProcessCost.toLocaleString()}`;
    }

    function addPartToList(partName, model, action, listElement, selectedListElement, totalCost, totalCostEl) {
        const partItem = document.createElement('div');
        partItem.className = 'list-group-item part-item';
        partItem.setAttribute('data-name', partName);
        partItem.setAttribute('data-model', model);
        partItem.setAttribute('data-action', action);

        partItem.innerHTML = `
            <div class="d-flex justify-content-between">
                <div>${partName} de ${model}</div>
                <input type="number" class="form-control w-25 action-price" placeholder="Precio por ${action}" min="0">
            </div>
            <div class="mt-2">
                <label for="quantity-${partName.replace(/\s+/g, '-')}-${action}">Cantidad:</label>
                <input type="number" id="quantity-${partName.replace(/\s+/g, '-')}-${action}" class="quantity-input form-control w-25" min="1" value="1">
            </div>
            <button class="add-to-summary-btn"><i class="fas fa-plus"></i></button>
        `;

        partItem.querySelector('.add-to-summary-btn').onclick = function() {
            const priceInput = partItem.querySelector('.action-price');
            const quantityInput = partItem.querySelector('.quantity-input');
            const price = parseFloat(priceInput.value) || 0;
            const quantity = parseInt(quantityInput.value) || 1;
            const totalPartCost = price * quantity;

            const li = document.createElement('li');
            li.className = 'summary-item';
            li.setAttribute('data-name', partName);
            li.setAttribute('data-model', model);
            li.setAttribute('data-action', action);
            li.setAttribute('data-total-cost', totalPartCost);
            li.innerHTML = `
                ${partName} de ${model} (${action}, ${quantity} piezas)
                <span class="badge badge-primary badge-pill">$${totalPartCost.toLocaleString()}</span>
                <button class="remove-item"><i class="fas fa-trash"></i></button>
            `;

            li.querySelector('.remove-item').onclick = function() {
                selectedListElement.removeChild(li);
                totalCost -= totalPartCost;
                totalCostEl.textContent = `$${totalCost.toLocaleString()}`;

                // Remove from general process list
                const processLi = Array.from(selectedProcessParts.children).find(item => 
                    item.getAttribute('data-name') === partName && item.getAttribute('data-action') === action && item.getAttribute('data-model') === model
                );
                if (processLi) {
                    selectedProcessParts.removeChild(processLi);
                    totalProcessCost -= totalPartCost;
                    totalProcessCostEl.textContent = `$${totalProcessCost.toLocaleString()}`;
                }
            };

            selectedListElement.appendChild(li);
            totalCost += totalPartCost;
            totalCostEl.textContent = `$${totalCost.toLocaleString()}`;

            // Add to general process list
            const processLi = li.cloneNode(true);
            processLi.querySelector('.remove-item').onclick = function() {
                selectedProcessParts.removeChild(processLi);
                totalProcessCost -= totalPartCost;
                totalProcessCostEl.textContent = `$${totalProcessCost.toLocaleString()}`;
                
                // Also remove from specific lists
                const specificLi = Array.from(selectedListElement.children).find(item => 
                    item.getAttribute('data-name') === partName && item.getAttribute('data-action') === action && item.getAttribute('data-model') === model
                );
                if (specificLi) {
                    selectedListElement.removeChild(specificLi);
                    totalCost -= totalPartCost;
                    totalCostEl.textContent = `$${totalCost.toLocaleString()}`;
                }
            };
            selectedProcessParts.appendChild(processLi);
            totalProcessCost += totalPartCost;
            totalProcessCostEl.textContent = `$${totalProcessCost.toLocaleString()}`;
        };

        listElement.appendChild(partItem);
    }

    addPartButton.addEventListener('click', () => {
        const partName = newPartNameInput.value.trim();
        const model = carModelInput.value.trim();

        if (partName && model) {
            addPartToList(partName, model, 'Pintar', paintPartsList, selectedPaintParts, totalPaintCost, totalPaintCostEl);
            addPartToList(partName, model, 'Reparar', repairPartsList, selectedRepairParts, totalRepairCost, totalRepairCostEl);
            addPartToList(partName, model, 'Comprar', buyPartsList, selectedBuyParts, totalBuyCost, totalBuyCostEl);

            newPartNameInput.value = '';
            carModelInput.value = '';
        } else {
            alert('Por favor, ingrese un nombre de pieza y un modelo de auto válido.');
        }
    });

    // Función para actualizar el input del modelo de auto con los datos del vehículo seleccionado
    function actualizarInputModelo() {
        const selectedVehicle = document.querySelector('input[name="vehicleSelection"]:checked');
        if (selectedVehicle) {
            const patente = selectedVehicle.value;
            const vehiculo = vehiculos.find(v => v.patente === patente);
            if (vehiculo) {
                carModelInput.value = `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.año}`;
            }
        }
    }

    // Evento para actualizar el input del modelo de auto cuando se seleccione un vehículo
    document.querySelectorAll('input[name="vehicleSelection"]').forEach(radio => {
        radio.addEventListener('change', actualizarInputModelo);
    });

    // Llenar la tabla de vehículos inicialmente
    mostrarVehiculos(vehiculos);
});