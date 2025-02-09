const express = require('express');
const PresupuestoController = require('../controllers/presupuestoController');
const router = express.Router();

// Ruta para obtener todos los presupuestos
router.get('/', PresupuestoController.getAllPresupuestos);

// Ruta para obtener un presupuesto por su ID
router.get('/:id', PresupuestoController.getPresupuestoById);

// Ruta para agregar un nuevo presupuesto
router.post('/', PresupuestoController.addPresupuesto);

// Ruta para actualizar un presupuesto por su ID
router.put('/:id', PresupuestoController.updatePresupuesto);

// Ruta para eliminar un presupuesto por su ID
router.delete('/:id', PresupuestoController.deletePresupuesto);

// 📌 Ruta para obtener presupuestos por placa de vehículo
router.get('/placa/:placa', PresupuestoController.getPresupuestosByPlaca);

// Ruta para obtener la cantidad de presupuestos del mes en curso para un taller
router.get('/mes/:idTaller', PresupuestoController.getCantidadPresupuestosMes);

// Ruta para obtener la cantidad de presupuestos del mes en curso con al menos un cobro asociado
router.get('/con-cobros/mes/:idTaller', PresupuestoController.getPresupuestosConCobroMes);




module.exports = router;
