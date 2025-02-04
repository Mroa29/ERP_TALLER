const express = require('express');
const TarifaManoObraController = require('../controllers/TarifaManObraController');

const router = express.Router();

// 📌 Ruta para agregar una nueva tarifa de mano de obra
router.post('/', TarifaManoObraController.addTarifa);

// 📌 Ruta para obtener todas las tarifas de mano de obra
router.get('/', TarifaManoObraController.getAllTarifas);

// 📌 Ruta para obtener una tarifa específica por su ID
router.get('/:id', TarifaManoObraController.getTarifaById);

// 📌 Ruta para actualizar una tarifa de mano de obra por su ID
router.put('/:id', TarifaManoObraController.updateTarifa);

// 📌 Ruta para eliminar una tarifa de mano de obra por su ID
router.delete('/:id', TarifaManoObraController.deleteTarifa);

module.exports = router;
