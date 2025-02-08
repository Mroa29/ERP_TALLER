const express = require('express');
const router = express.Router();
const ManoDeObraPresupuestadaController = require('../controllers/manoObraPresupuestadaController');

// 📌 Ruta para agregar una nueva mano de obra presupuestada
router.post('/', ManoDeObraPresupuestadaController.addManoDeObraPresupuestada);

// 📌 Ruta para obtener todas las manos de obra presupuestadas de un presupuesto específico
router.get('/:id_presupuesto', ManoDeObraPresupuestadaController.getManoDeObraByPresupuesto);

// 📌 Ruta para eliminar una mano de obra presupuestada por su ID
router.delete('/:id', ManoDeObraPresupuestadaController.deleteManoDeObraPresupuestada);

// Ruta para obtener el total de mano de obra presupuestada
router.get("/total/:idPresupuesto", ManoDeObraPresupuestadaController.getTotalManoObraPresupuestada);


module.exports = router;
