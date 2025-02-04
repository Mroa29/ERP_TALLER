// Importar el pool de conexión a la base de datos
const pool = require('../config/db.config');

const TarifaPiezasPintadas = {
  /**
   * Agrega una nueva tarifa de piezas pintadas a la base de datos.
   * @param {Object} tarifa - Objeto con los datos de la tarifa.
   * @returns {Promise<Object>} - Retorna la tarifa agregada.
   */
  addTarifa: async (tarifa) => {
    try {
      const query = `
        INSERT INTO TARIFA_PIEZAS_PINTADAS (
          DESCRIPCION_TARIFA_PIEZAS_PINTADAS,
          PRECIO_POR_PIEZA_PINTADA,
          ID_SUCURSAL
        ) VALUES ($1, $2, $3)
        RETURNING *;
      `;
      const values = [
        tarifa.descripcion_tarifa,
        tarifa.precio_por_pieza,
        tarifa.id_sucursal,
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error al agregar tarifa:', error);
      throw error;
    }
  },

  /**
   * Obtiene todas las tarifas registradas.
   * @returns {Promise<Array<Object>>} - Retorna una lista de todas las tarifas.
   */
  getAllTarifas: async () => {
    try {
      const query = `SELECT * FROM TARIFA_PIEZAS_PINTADAS ORDER BY ID_TARIFA_PIEZAS_PINTADAS;`;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener todas las tarifas:', error);
      throw error;
    }
  },

  /**
   * Obtiene una tarifa por su ID.
   * @param {number} id - ID de la tarifa.
   * @returns {Promise<Object|null>} - Retorna la tarifa si existe o null si no.
   */
  findTarifaById: async (id) => {
    try {
      const query = `SELECT * FROM TARIFA_PIEZAS_PINTADAS WHERE ID_TARIFA_PIEZAS_PINTADAS = $1;`;
      const values = [id];

      const result = await pool.query(query, values);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error al buscar tarifa por ID:', error);
      throw error;
    }
  },

  /**
   * Actualiza una tarifa por su ID.
   * @param {number} id - ID de la tarifa.
   * @param {Object} tarifa - Datos de la tarifa a actualizar.
   * @returns {Promise<Object|null>} - Retorna la tarifa actualizada o null si no existe.
   */
  updateTarifa: async (id, tarifa) => {
    try {
      const query = `
        UPDATE TARIFA_PIEZAS_PINTADAS
        SET 
          DESCRIPCION_TARIFA_PIEZAS_PINTADAS = $2,
          PRECIO_POR_PIEZA_PINTADA = $3,
          ID_SUCURSAL = $4
        WHERE ID_TARIFA_PIEZAS_PINTADAS = $1
        RETURNING *;
      `;
      const values = [
        id,
        tarifa.descripcion_tarifa,
        tarifa.precio_por_pieza,
        tarifa.id_sucursal,
      ];

      const result = await pool.query(query, values);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error al actualizar tarifa:', error);
      throw error;
    }
  },

  /**
   * Elimina una tarifa por su ID.
   * @param {number} id - ID de la tarifa.
   * @returns {Promise<boolean>} - Retorna true si se eliminó la tarifa, false si no.
   */
  deleteTarifa: async (id) => {
    try {
      const query = `DELETE FROM TARIFA_PIEZAS_PINTADAS WHERE ID_TARIFA_PIEZAS_PINTADAS = $1;`;
      const values = [id];

      const result = await pool.query(query, values);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error al eliminar tarifa:', error);
      throw error;
    }
  },
};

module.exports = TarifaPiezasPintadas;
