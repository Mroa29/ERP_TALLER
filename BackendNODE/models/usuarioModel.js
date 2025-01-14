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
};

module.exports = User;
