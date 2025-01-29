const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');

// Rutas para proveedores


// Ruta para obtener todos los tipos de proveedores
router.get('/tipos', proveedorController.getAllTiposProveedores);
/**
 * @route GET /api/proveedores
 * @desc Obtener todos los proveedores
 */
router.get('/', proveedorController.getAllProveedores);

/**
 * @route GET /api/proveedores/:rut/:idTaller
 * @desc Obtener un proveedor por RUT e ID de taller
 */
router.get('/:rut/:idTaller', proveedorController.getProveedorById);

/**
 * @route POST /api/proveedores
 * @desc Agregar un nuevo proveedor
 */
router.post('/', proveedorController.addProveedor);

/**
 * @route PUT /api/proveedores/:rut/:idTaller
 * @desc Actualizar un proveedor por RUT e ID de taller
 */
router.put('/:rut/:idTaller', proveedorController.updateProveedor);

/**
 * @route DELETE /api/proveedores/:rut/:idTaller
 * @desc Eliminar un proveedor por RUT e ID de taller
 */
router.delete('/:rut/:idTaller', proveedorController.deleteProveedor);

module.exports = router;
