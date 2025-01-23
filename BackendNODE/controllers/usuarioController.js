const User = require('../models/usuarioModel');
const { generateToken } = require('../config/jwt');

/**
 * Controlador de usuarios
 */
const UserController = {
  /**
   * Inicia sesión un usuario con email y contraseña.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   * @returns {void}
   */
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Buscar usuario por email
      const user = await User.findByEmail(email);

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Verificar si la contraseña está configurada
      if (!user.contrasena_usuario) {
        return res.status(400).json({ message: 'Contraseña no configurada para este usuario' });
      }

      // Validar contraseña directamente (sin encriptación)
      if (password !== user.contrasena_usuario) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }

      // Generar token JWT
      const token = generateToken({ id: user.id_usuario, email: user.email_usuario });

      res.status(200).json({
        token,
        user: {
          id: user.id_usuario,
          email: user.email_usuario,
          nombre: user.nombre_usuario,
        },
      });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  /**
   * Obtiene los detalles de un usuario por ID.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   * @returns {void}
   */
  getUserById: async (req, res) => {
    const { id } = req.params;

    try {
      // Buscar usuario por ID
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.status(200).json({
        user: {
          id: user.id_usuario,
          email: user.email_usuario,
          nombre: user.nombre_usuario,
          apeliido_paterno: user.apep_usuario,
          apellido_materno: user.apem_usuario,
          contacto: user.contacto_usuario,
          fecha_creacion: user.f_ingreso_usuario,
          estado: user.id_estado_usuario,
          taller: user.id_taller,
        },
      });
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  /**
   * Obtiene los módulos y submódulos permitidos para un usuario.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   * @returns {void}
   */
  getUserPantallas: async (req, res) => {
    const { id } = req.params;

    try {
      // Obtener los módulos y submódulos disponibles para el usuario
      const pantallas = await User.findPantallasByUserId(id);

      res.status(200).json({
        modulos: pantallas.modulos,
        submodulos: pantallas.submodulos,
      });
    } catch (error) {
      console.error('Error al obtener pantallas del usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  /**
   * Obtiene las notificaciones de un usuario.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   * @returns {void}
   */
  getUserNotifications: async (req, res) => {
    const { id } = req.params;

    try {
      // Obtener las notificaciones del usuario
      const notifications = await User.getUserNotifications(id);

      res.status(200).json(notifications);
    } catch (error) {
      console.error('Error al obtener notificaciones del usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  /**
   * Cuenta las notificaciones visibles de un usuario.
   * @param {Object} req - Objeto de solicitud HTTP.
   * @param {Object} res - Objeto de respuesta HTTP.
   * @returns {void}
   */
  countVisibleNotifications: async (req, res) => {
    const { id } = req.params;

    try {
      // Contar notificaciones visibles del usuario
      const count = await User.countVisibleNotifications(id);

      res.status(200).json({ count });
    } catch (error) {
      console.error('Error al contar notificaciones visibles del usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  },

  /**
 * Actualiza la visibilidad de una notificación específica de un usuario.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {void}
 */
updateNotificationVisibility: async (req, res) => {
  const { idUsuario, idNotificacion } = req.params;
  const { visibility } = req.body; // Recibe la nueva visibilidad desde el cuerpo de la solicitud.

  if (visibility === undefined) {
      return res.status(400).json({ message: 'La visibilidad es requerida.' });
  }

  try {
      // Actualizar la visibilidad de la notificación
      await User.updateNotificationVisibility(idUsuario, idNotificacion, visibility);

      res.status(200).json({ message: 'Visibilidad de la notificación actualizada con éxito.' });
  } catch (error) {
      console.error('Error al actualizar la visibilidad de la notificación:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
  }
},
/**
 * Obtiene todas las sucursales asociadas a un usuario.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {void}
 */
getUserSucursales: async (req, res) => {
  const { id } = req.params;

  try {
    // Obtener las sucursales asociadas al usuario
    const sucursales = await User.getUserSucursales(id);

    res.status(200).json(sucursales);
  } catch (error) {
    console.error('Error al obtener las sucursales del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
},


};

module.exports = UserController;
