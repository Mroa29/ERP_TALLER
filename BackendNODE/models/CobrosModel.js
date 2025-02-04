const pool = require("../config/db.config");

const Cobro = {
  /**
   * Agrega un nuevo cobro a la base de datos.
   * @param {Object} cobro - Datos del cobro.
   * @returns {Promise<Object>} - Cobro insertado.
   */
  addCobro: async (cobro) => {
    try {
      const query = `
        INSERT INTO COBROS (ID_PRESUPUESTO, CANTIDAD_COBRADA_COBROS, FORMA_PAGO_COBROS, FECHA_COBRO, NUMERO_RECIBO, DESCRIPCION_COBRO)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
      `;
      const values = [
        cobro.id_presupuesto,
        cobro.cantidad_cobrada,
        cobro.forma_pago,
        cobro.fecha_cobro,
        cobro.numero_recibo,
        cobro.descripcion
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error al agregar cobro:", error);
      throw error;
    }
  },

  /**
   * Obtiene todos los cobros asociados a un presupuesto específico.
   * @param {number} idPresupuesto - ID del presupuesto.
   * @returns {Promise<Array>} - Lista de cobros.
   */
  getCobrosByPresupuesto: async (idPresupuesto) => {
    try {
      const query = `SELECT * FROM COBROS WHERE ID_PRESUPUESTO = $1;`;
      const values = [idPresupuesto];

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("Error al obtener cobros por ID de presupuesto:", error);
      throw error;
    }
  },

  /**
   * Edita un cobro por su ID.
   * @param {number} idCobro - ID del cobro a editar.
   * @param {Object} cobro - Datos nuevos del cobro.
   * @returns {Promise<Object>} - Cobro actualizado.
   */
  updateCobro: async (idCobro, cobro) => {
    try {
      const query = `
        UPDATE COBROS
        SET 
          CANTIDAD_COBRADA_COBROS = $1,
          FORMA_PAGO_COBROS = $2,
          FECHA_COBRO = $3,
          NUMERO_RECIBO = $4,
          DESCRIPCION_COBRO = $5
        WHERE ID_COBRO = $6
        RETURNING *;
      `;
      const values = [
        cobro.cantidad_cobrada,
        cobro.forma_pago,
        cobro.fecha_cobro,
        cobro.numero_recibo,
        cobro.descripcion,
        idCobro
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error al actualizar cobro:", error);
      throw error;
    }
  },

  /**
   * Elimina un cobro por su ID y retorna el ID eliminado.
   * @param {number} idCobro - ID del cobro a eliminar.
   * @returns {Promise<number>} - ID del cobro eliminado.
   */
  deleteCobro: async (idCobro) => {
    try {
      const query = `DELETE FROM COBROS WHERE ID_COBRO = $1 RETURNING ID_COBRO;`;
      const values = [idCobro];

      const result = await pool.query(query, values);
      return result.rows.length ? result.rows[0].id_cobro : null;
    } catch (error) {
      console.error("Error al eliminar cobro:", error);
      throw error;
    }
  },

  /**
     * Obtiene un cobro por su ID.
     * @param {number} id - ID del cobro a buscar.
     * @returns {Promise<Object|null>} - Retorna el cobro si existe, o null si no se encuentra.
     */
  async getCobroById(id) {
    try {
        const query = `
            SELECT 
                ID_COBRO,
                ID_PRESUPUESTO,
                CANTIDAD_COBRADA_COBROS,
                FORMA_PAGO_COBROS,
                FECHA_COBRO,
                NUMERO_RECIBO,
                DESCRIPCION_COBRO
            FROM COBROS
            WHERE ID_COBRO = $1;
        `;
        const { rows } = await pool.query(query, [id]);

        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error al obtener el cobro por ID:", error);
        throw error;
    }
}
};

module.exports = Cobro;
