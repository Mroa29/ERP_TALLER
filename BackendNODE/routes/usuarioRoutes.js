const express = require('express');
const UserController = require('../controllers/usuarioController');
const router = express.Router();

// Ruta para login
router.post('/login', UserController.login);

// Ruta para obtener usuario por ID
router.get('/:id', UserController.getUserById);

// Ruta para obtener los módulos y submódulos disponibles para un usuario
router.get('/:id/pantallas', UserController.getUserPantallas);

module.exports = router;