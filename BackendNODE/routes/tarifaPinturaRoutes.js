const express = require('express');
const TarifaController = require('../controllers/TarifaPinturaController');

const router = express.Router();

// 📌 Ruta para agregar una nueva tarifa
router.post('/', TarifaController.addTarifa);

// 📌 Ruta para obtener todas las tarifas
router.get('/', TarifaController.getAllTarifas);

// 📌 Ruta para obtener una tarifa específica por su ID
router.get('/:id', TarifaController.getTarifaById);

// 📌 Ruta para actualizar una tarifa por su ID
router.put('/:id', TarifaController.updateTarifa);

// 📌 Ruta para eliminar una tarifa por su ID
router.delete('/:id', TarifaController.deleteTarifa);

module.exports = router;
