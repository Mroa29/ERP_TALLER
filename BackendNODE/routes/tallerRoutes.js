const express = require('express');
const router = express.Router();
const tallerController = require('../controllers/tallerControllers');

// Rutas CRUD para talleres

// Obtener todos los talleres
router.get('/', tallerController.getAllTalleres);

// Crear un nuevo taller
router.post('/', tallerController.createTaller);

// Obtener un taller por ID
router.get('/:id', tallerController.getTallerById);

// Actualizar un taller por ID
router.put('/:id', tallerController.updateTaller);

// Eliminar un taller por ID
router.delete('/:id', tallerController.deleteTaller);

module.exports = router;
