const express = require('express');
const TallerController = require('../controllers/tallerControllers');
const router = express.Router();

// Ruta para obtener todos los talleres
router.get('/', TallerController.getAllTalleres);

// Ruta para obtener un taller por ID
router.get('/:id', TallerController.getTallerById);

// Ruta para crear un nuevo taller
router.post('/', TallerController.createTaller);

// Ruta para actualizar un taller por ID
router.put('/:id', TallerController.updateTaller);

// Ruta para eliminar un taller por ID
router.delete('/:id', TallerController.deleteTaller);

module.exports = router;