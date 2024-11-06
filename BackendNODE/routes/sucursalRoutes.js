const express = require('express');
const router = express.Router();
const sucursalController = require('../controllers/sucursalController');

// Rutas CRUD para sucursales
router.post('/', sucursalController.createSucursal);         // Crear nueva sucursal
router.get('/', sucursalController.getAllSucursales);        // Obtener todas las sucursales
router.get('/:id', sucursalController.getSucursalById);      // Obtener una sucursal por ID
router.put('/:id', sucursalController.updateSucursal);       // Actualizar una sucursal por ID
router.delete('/:id', sucursalController.deleteSucursal);    // Eliminar una sucursal por ID

module.exports = router;
