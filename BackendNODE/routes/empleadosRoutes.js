const express = require('express');
const router = express.Router();
const empleadoController = require('../controllers/empleadoController');

/**
 * @route GET /api/empleados
 * @desc Obtener todos los empleados
 */
router.get('/', empleadoController.getAllEmpleados);

/**
 * @route GET /api/empleados/:rut
 * @desc Obtener un empleado por RUT
 */
router.get('/:rut', empleadoController.getEmpleadoByRut);

/**
 * @route POST /api/empleados
 * @desc Agregar un nuevo empleado
 */
router.post('/', empleadoController.addEmpleado);

/**
 * @route PUT /api/empleados/:rut
 * @desc Actualizar un empleado por RUT
 */
router.put('/:rut', empleadoController.updateEmpleado);

/**
 * @route DELETE /api/empleados/:rut
 * @desc Eliminar un empleado por RUT
 */
router.delete('/:rut', empleadoController.deleteEmpleado);

// Ruta para obtener empleados sin contrato por ID de taller
router.get('/sin-contrato/:idTaller', empleadoController.getEmpleadosSinContrato);


// Ruta para obtener empleados con contrato en el mismo taller
router.get("/con-contrato/:idTaller", empleadoController.getEmpleadosConContrato);

module.exports = router;
