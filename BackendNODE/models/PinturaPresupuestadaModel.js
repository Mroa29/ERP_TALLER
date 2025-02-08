// Importar el pool de conexiones
const pool = require('../config/db.config');

// Modelo de PINTURA_PRESUPUESTADA
const PinturaPresupuestada = {
  /**
   * Agrega una nueva pintura presupuestada a la base de datos.
   * @param {Object} pintura - Objeto con los datos de la pintura presupuestada.
   * @returns {Promise<Object>} - Retorna la pintura presupuestada agregada.
   */
  addPinturaPresupuestada: async (pintura) => {
    try {
      const query = `
        INSERT INTO PINTURA_PRESUPUESTADA (
          ID_PRESUPUESTO,
          NOMBRE_PIEZA_PINTADA,
          CANTIDAD_PIEZAS_PINTADAS,
          ID_TARIFA_PIEZAS_PINTADAS
        ) VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;
      const values = [
        pintura.id_presupuesto,
        pintura.nombre_pieza_pintada,
        pintura.cantidad_piezas_pintadas,
        pintura.id_tarifa_piezas_pintadas
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error al agregar pintura presupuestada:', error);
      throw error;
    }
  },

  /**
   * Obtiene todas las pinturas presupuestadas.
   * @returns {Promise<Array<Object>>} - Retorna una lista de todas las pinturas presupuestadas.
   */
  getAllPinturasPresupuestadas: async () => {
    try {
      const query = `
        SELECT * FROM PINTURA_PRESUPUESTADA;
      `;

      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener todas las pinturas presupuestadas:', error);
      throw error;
    }
  },

  /**
   * Obtiene una pintura presupuestada por su ID.
   * @param {number} id - ID de la pintura presupuestada.
   * @returns {Promise<Object|null>} - Retorna la pintura presupuestada si existe o null si no.
   */
  getPinturaPresupuestadaById: async (id) => {
    try {
      const query = `
        SELECT * FROM PINTURA_PRESUPUESTADA
        WHERE ID_PINTURA_PRESUPUESTADA = $1;
      `;
      const values = [id];

      const result = await pool.query(query, values);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error al obtener pintura presupuestada por ID:', error);
      throw error;
    }
  },

  /**
   * Obtiene todas las pinturas presupuestadas de un presupuesto específico.
   * @param {number} id_presupuesto - ID del presupuesto.
   * @returns {Promise<Array<Object>>} - Retorna una lista de pinturas presupuestadas del presupuesto.
   */
  getPinturasByPresupuesto: async (id_presupuesto) => {
    try {
      const query = `
        SELECT * FROM PINTURA_PRESUPUESTADA
        WHERE ID_PRESUPUESTO = $1;
      `;
      const values = [id_presupuesto];

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener pinturas presupuestadas por presupuesto:', error);
      throw error;
    }
  },

  /**
 * Elimina una pintura presupuestada por su ID y devuelve el ID eliminado.
 * @param {number} id - ID de la pintura presupuestada.
 * @returns {Promise<number|null>} - Retorna el ID si se eliminó correctamente, null si no se encontró.
 */
deletePinturaPresupuestada: async (id) => {
  try {
      const query = `
          DELETE FROM PINTURA_PRESUPUESTADA
          WHERE ID_PINTURA_PRESUPUESTADA = $1
          RETURNING ID_PINTURA_PRESUPUESTADA;
      `;
      const values = [id];

      const result = await pool.query(query, values);
      return result.rows.length > 0 ? result.rows[0].id_pintura_presupuestada : null;
  } catch (error) {
      console.error('Error al eliminar pintura presupuestada:', error);
      throw error;
  }
},
/**
     * Obtiene la suma total del precio de todas las pinturas presupuestadas para un presupuesto específico.
     * @param {number} idPresupuesto - ID del presupuesto.
     * @returns {Promise<number>} - Total del precio de pintura presupuestada.
     */
async getTotalPinturaPresupuestada(idPresupuesto) {
  try {
      const query = `
          SELECT COALESCE(SUM(pp.CANTIDAD_PIEZAS_PINTADAS * tp.PRECIO_POR_PIEZA_PINTADA), 0) AS total_pintura_presupuestada
          FROM PINTURA_PRESUPUESTADA pp
          JOIN TARIFA_PIEZAS_PINTADAS tp ON pp.ID_TARIFA_PIEZAS_PINTADAS = tp.ID_TARIFA_PIEZAS_PINTADAS
          WHERE pp.ID_PRESUPUESTO = $1;
      `;
      const { rows } = await pool.query(query, [idPresupuesto]);
      return rows.length ? rows[0].total_pintura_presupuestada : 0;
  } catch (error) {
      console.error("Error al obtener el total de pintura presupuestada:", error);
      throw error;
  }
}

};

module.exports = PinturaPresupuestada;
