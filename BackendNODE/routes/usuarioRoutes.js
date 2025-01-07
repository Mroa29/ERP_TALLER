const express = require('express');
const UserController = require('../controllers/usuarioController');
const router = express.Router();

// Ruta para login
router.post('/login', UserController.login);

// Ruta para obtener usuario por ID
router.get('/:id', UserController.getUserById);

module.exports = router;
