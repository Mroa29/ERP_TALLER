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
};

module.exports = UserController;
