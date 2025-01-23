// Importar el pool de conexiones
const pool = require('../config/db.config');

// Modelo de usuario
const User = {
  /**
   * Obtiene un usuario por su correo electrónico.
   * @param {string} email - Correo electrónico del usuario.
   * @returns {Promise<Object|null>} - Retorna el usuario si existe o null si no.
   */
  findByEmail: async (email) => {
    try {
      const query = 'SELECT * FROM USUARIO WHERE EMAIL_USUARIO = $1';
      const values = [email];

      const result = await pool.query(query, values);

      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error al buscar usuario por correo:', error);
      throw error;
    }
  },

  /**
   * Obtiene un usuario por su ID.
   * @param {string} id - ID del usuario.
   * @returns {Promise<Object|null>} - Retorna el usuario si existe o null si no.
   */
  findById: async (id) => {
    try {
      const query = 'SELECT * FROM USUARIO WHERE ID_USUARIO = $1';
      const values = [id];

      const result = await pool.query(query, values);

      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error al buscar usuario por ID:', error);
      throw error;
    }
  },

  /**
   * Obtiene los módulos y submódulos disponibles para un usuario.
   * @param {string} userId - ID del usuario.
   * @returns {Promise<Object>} - Retorna un objeto con los módulos y submódulos permitidos.
   */
  findPantallasByUserId: async (userId) => {
    try {
      const query = `
        SELECT ID_MODULO, ID_SUBMODULO
        FROM PANTALLAS_USUARIO
        WHERE ID_USUARIO = $1
      `;
      const values = [userId];

      const result = await pool.query(query, values);

      const modulos = [...new Set(result.rows.map(row => row.id_modulo))]; // Eliminar duplicados
      const submodulos = result.rows.map(row => row.id_submodulo);

      return { modulos, submodulos };
    } catch (error) {
      console.error('Error al buscar pantallas del usuario:', error);
      throw error;
    }
  },

  /**
   * Obtiene las notificaciones de un usuario por ID.
   * @param {string} userId - ID del usuario.
   * @returns {Promise<Array<Object>>} - Retorna una lista de notificaciones del usuario.
   */
  getUserNotifications: async (userId) => {
    try {
      const query = `
        SELECT 
          N.TITULO_NOTIFICACION,
          N.DESCRIPCION_NOTIFICACION,
          N.ASUNTO_NOTIFICACION,
          N.FECHA_CREACION_NOTIFICACION,
          UN.VISIBILIDAD_NOTIFICACION
        FROM USUARIO_NOTIFICACION UN
        INNER JOIN NOTIFICACIONES N ON UN.ID_NOTIFICACION = N.ID_NOTIFICACION
        WHERE UN.ID_USUARIO = $1
        ORDER BY N.FECHA_CREACION_NOTIFICACION DESC
      `;
      const values = [userId];

      const result = await pool.query(query, values);

      return result.rows;
    } catch (error) {
      console.error('Error al obtener notificaciones del usuario:', error);
      throw error;
    }
  },

  /**
   * Cuenta la cantidad de notificaciones visibles de un usuario por ID.
   * @param {string} userId - ID del usuario.
   * @returns {Promise<number>} - Retorna el número de notificaciones visibles del usuario.
   */
  countVisibleNotifications: async (userId) => {
    try {
      const query = `
        SELECT COUNT(*) AS total
        FROM USUARIO_NOTIFICACION UN
        INNER JOIN NOTIFICACIONES N ON UN.ID_NOTIFICACION = N.ID_NOTIFICACION
        WHERE UN.ID_USUARIO = $1 AND UN.VISIBILIDAD_NOTIFICACION = true
      `;
      const values = [userId];

      const result = await pool.query(query, values);

      return parseInt(result.rows[0].total, 10);
    } catch (error) {
      console.error('Error al contar notificaciones visibles del usuario:', error);
      throw error;
    }
  },
  /**
 * Actualiza la visibilidad de una notificación para un usuario.
 * @param {string} userId - ID del usuario.
 * @param {number} notificationId - ID de la notificación.
 * @param {boolean} visibility - Nueva visibilidad de la notificación.
 * @returns {Promise<void>} - Promesa que se resuelve cuando la operación termina.
 */
updateNotificationVisibility: async (userId, notificationId, visibility) => {
  try {
      const query = `
          UPDATE USUARIO_NOTIFICACION
          SET VISIBILIDAD_NOTIFICACION = $1
          WHERE ID_USUARIO = $2 AND ID_NOTIFICACION = $3
      `;
      const values = [visibility, userId, notificationId];

      await pool.query(query, values);
  } catch (error) {
      console.error('Error al actualizar la visibilidad de la notificación:', error);
      throw error;
  }
},
/**
 * Obtiene todas las sucursales asociadas a un usuario.
 * @param {string} userId - ID del usuario.
 * @returns {Promise<Array<Object>>} - Retorna una lista de sucursales asociadas al usuario.
 */
getUserSucursales: async (userId) => {
  try {
    const query = `
      SELECT S.*
      FROM USUARIO_SUCURSAL US
      INNER JOIN SUCURSAL S ON US.ID_SUCURSAL = S.ID_SUCURSAL
      WHERE US.ID_USUARIO = $1
    `;
    const values = [userId];

    const result = await pool.query(query, values);

    return result.rows; // Devuelve todas las sucursales asociadas al usuario
  } catch (error) {
    console.error('Error al obtener las sucursales del usuario:', error);
    throw error;
  }
},

};

module.exports = User;
