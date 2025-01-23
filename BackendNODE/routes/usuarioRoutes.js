const express = require('express');
const UserController = require('../controllers/usuarioController');
const router = express.Router();

// Ruta para login
router.post('/login', UserController.login);

// Ruta para obtener usuario por ID
router.get('/:id', UserController.getUserById);

// Ruta para obtener los módulos y submódulos disponibles para un usuario
router.get('/:id/pantallas', UserController.getUserPantallas);

// Ruta para obtener las notificaciones de un usuario
router.get('/:id/notificaciones', UserController.getUserNotifications);

// Ruta para contar las notificaciones visibles de un usuario
router.get('/:id/notificaciones/count', UserController.countVisibleNotifications);

// Ruta para actualizar la visibilidad de una notificación
router.put('/:idUsuario/notificaciones/:idNotificacion', UserController.updateNotificationVisibility);

module.exports = router;
