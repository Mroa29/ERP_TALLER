const express = require('express');
const sucursalController = require('../controllers/sucursalController');
const router = express.Router();

// Ruta para agregar una nueva sucursal
router.post('/', sucursalController.addSucursal);

// Ruta para obtener todas las sucursales
router.get('/', sucursalController.getAllSucursales);

// Ruta para obtener una sucursal por su ID
router.get('/:id', sucursalController.getSucursalById);

// Ruta para obtener una sucursal por su nombre
router.get('/nombre/:nombre', sucursalController.getSucursalByNombre);

// Ruta para actualizar una sucursal por su ID
router.put('/:id', sucursalController.updateSucursal);

// Ruta para eliminar una sucursal por su ID
router.delete('/:id', sucursalController.deleteSucursal);

module.exports = router;
