// Importar el pool de conexiones
const pool = require('../config/db.config');

// Modelo de taller
const Taller = {
  /**
   * Obtiene todos los talleres.
   * @returns {Promise<Array>} - Retorna una lista de talleres.
   */
  findAll: async () => {
    try {
      const query = 'SELECT * FROM TALLER';
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener todos los talleres:', error);
      throw error;
    }
  },

  /**
   * Obtiene un taller por su ID.
   * @param {number} id - ID del taller.
   * @returns {Promise<Object|null>} - Retorna el taller si existe o null si no.
   */
  findById: async (id) => {
    try {
      const query = 'SELECT * FROM TALLER WHERE ID_TALLER = $1';
      const values = [id];
      const result = await pool.query(query, values);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error al obtener el taller por ID:', error);
      throw error;
    }
  },

  /**
   * Crea un nuevo taller.
   * @param {Object} data - Datos del taller.
   * @returns {Promise<Object>} - Retorna el taller creado.
   */
  create: async (data) => {
    try {
      const {
        nombre_taller,
        direccion_taller,
        comuna_taller,
        ciudad_taller,
        pais_taller,
        email_taller,
        capacidad_total_taller,
        gerente_taller,
        telefono_taller,
      } = data;

      const query = `
        INSERT INTO TALLER (
          NOMBRE_TALLER, DIRECCION_TALLER, COMUNA_TALLER, CIUDAD_TALLER, PAIS_TALLER,
          EMAIL_TALLER, CAPACIDAD_TOTAL_TALLER, GERENTE_TALLER, TELEFONO_TALLER
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`;
      const values = [
        nombre_taller,
        direccion_taller,
        comuna_taller,
        ciudad_taller,
        pais_taller,
        email_taller,
        capacidad_total_taller,
        gerente_taller,
        telefono_taller,
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error al crear un taller:', error);
      throw error;
    }
  },

  /**
   * Actualiza un taller por su ID.
   * @param {number} id - ID del taller.
   * @param {Object} data - Datos a actualizar.
   * @returns {Promise<Object|null>} - Retorna el taller actualizado o null si no existe.
   */
  update: async (id, data) => {
    try {
      const {
        nombre_taller,
        direccion_taller,
        comuna_taller,
        ciudad_taller,
        pais_taller,
        email_taller,
        capacidad_total_taller,
        gerente_taller,
        telefono_taller,
      } = data;

      const query = `
        UPDATE TALLER
        SET NOMBRE_TALLER = $1, DIRECCION_TALLER = $2, COMUNA_TALLER = $3, CIUDAD_TALLER = $4,
            PAIS_TALLER = $5, EMAIL_TALLER = $6, CAPACIDAD_TOTAL_TALLER = $7, GERENTE_TALLER = $8,
            TELEFONO_TALLER = $9
        WHERE ID_TALLER = $10
        RETURNING *`;
      const values = [
        nombre_taller,
        direccion_taller,
        comuna_taller,
        ciudad_taller,
        pais_taller,
        email_taller,
        capacidad_total_taller,
        gerente_taller,
        telefono_taller,
        id,
      ];

      const result = await pool.query(query, values);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error al actualizar el taller:', error);
      throw error;
    }
  },

  /**
   * Elimina un taller por su ID.
   * @param {number} id - ID del taller.
   * @returns {Promise<boolean>} - Retorna true si se eliminó o false si no.
   */
  delete: async (id) => {
    try {
      const query = 'DELETE FROM TALLER WHERE ID_TALLER = $1';
      const values = [id];
      const result = await pool.query(query, values);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error al eliminar el taller:', error);
      throw error;
    }
  },
};

module.exports = Taller;
