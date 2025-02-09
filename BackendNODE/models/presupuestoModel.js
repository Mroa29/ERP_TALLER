// Importar el pool de conexiones
const pool = require('../config/db.config');

// Modelo de presupuesto
const Presupuesto = {
  /**
   * Agrega un nuevo presupuesto a la base de datos.
   * Se omite el campo FECHA_CREACION_PRESUPUESTO_GENERAL para que se asigne automáticamente con now()::date.
   * @param {Object} presupuesto - Objeto con los datos del presupuesto.
   * @returns {Promise<Object>} - Retorna el presupuesto agregado.
   */
  addPresupuesto: async (presupuesto) => {
    try {
      const query = `
        INSERT INTO PRESUPUESTO (
          RUT_CLIENTE,
          PLACA_VEHICULO,
          DIAS_VALIDEZ_PRESUPUESTO_GENERAL,
          OBS_PRESUPUESTO_GENERAL,
          ID_SUCURSAL
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const values = [
        presupuesto.rut_cliente,
        presupuesto.placa_vehiculo,
        presupuesto.dias_validez_presupuesto_general,
        presupuesto.obs_presupuesto_general,
        presupuesto.id_sucursal,
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error al agregar presupuesto:', error);
      throw error;
    }
  },

  /**
   * Obtiene un presupuesto por su ID.
   * @param {number} id - ID del presupuesto.
   * @returns {Promise<Object|null>} - Retorna el presupuesto si existe o null si no.
   */
  findPresupuestoById: async (id) => {
    try {
      const query = `
        SELECT * FROM PRESUPUESTO
        WHERE ID_PRESUPUESTO = $1;
      `;
      const values = [id];

      const result = await pool.query(query, values);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error al buscar presupuesto por ID:', error);
      throw error;
    }
  },

  /**
   * Actualiza un presupuesto por su ID.
   * @param {number} id - ID del presupuesto.
   * @param {Object} presupuesto - Datos del presupuesto a actualizar.
   * @returns {Promise<Object|null>} - Retorna el presupuesto actualizado o null si no existe.
   */
  updatePresupuesto: async (id, presupuesto) => {
    try {
      const query = `
        UPDATE PRESUPUESTO
        SET
          RUT_CLIENTE = $2,
          PLACA_VEHICULO = $3,
          DIAS_VALIDEZ_PRESUPUESTO_GENERAL = $4,
          OBS_PRESUPUESTO_GENERAL = $5,
          ID_SUCURSAL = $6
        WHERE ID_PRESUPUESTO = $1
        RETURNING *;
      `;
      const values = [
        id,
        presupuesto.rut_cliente,
        presupuesto.placa_vehiculo,
        presupuesto.dias_validez_presupuesto_general,
        presupuesto.obs_presupuesto_general,
        presupuesto.id_sucursal,
      ];

      const result = await pool.query(query, values);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error al actualizar presupuesto:', error);
      throw error;
    }
  },

  /**
   * Elimina un presupuesto por su ID.
   * @param {number} id - ID del presupuesto.
   * @returns {Promise<boolean>} - Retorna true si se eliminó el presupuesto, false si no.
   */
  deletePresupuesto: async (id) => {
    try {
      const query = `
        DELETE FROM PRESUPUESTO
        WHERE ID_PRESUPUESTO = $1;
      `;
      const values = [id];

      const result = await pool.query(query, values);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error al eliminar presupuesto:', error);
      throw error;
    }
  },

  /**
   * Obtiene todos los presupuestos registrados.
   * @returns {Promise<Array<Object>>} - Retorna una lista de todos los presupuestos.
   */
  getAllPresupuestos: async () => {
    try {
      const query = `
        SELECT * FROM PRESUPUESTO;
      `;
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener todos los presupuestos:', error);
      throw error;
    }
  },
  /**
   * Obtiene presupuestos por la patente del vehículo.
   * @param {string} placaVehiculo - Placa del vehículo.
   * @returns {Promise<Array<Object>>} - Lista de presupuestos encontrados.
   */
  getPresupuestosByPlaca: async (placaVehiculo) => {
    try {
      const query = `
        SELECT * FROM PRESUPUESTO
        WHERE PLACA_VEHICULO = $1
      `;
      const values = [placaVehiculo];

      const result = await pool.query(query, values);
      return result.rows; // Retorna los presupuestos encontrados
    } catch (error) {
      console.error('Error al obtener presupuestos por placa de vehículo:', error);
      throw error;
    }
  },
  /**
   * Obtiene la cantidad de presupuestos de un taller en el mes en curso.
   * @param {number} idTaller - ID del taller.
   * @returns {Promise<number>} - Retorna la cantidad de presupuestos del mes en curso para el taller.
   */
  getCantidadPresupuestosMes: async (idTaller) => {
    try {
      const query = `
        SELECT 
          COUNT(p.ID_PRESUPUESTO) AS cantidad_presupuestos
        FROM 
          PRESUPUESTO p
        JOIN 
          SUCURSAL s ON p.ID_SUCURSAL = s.ID_SUCURSAL
        WHERE 
          s.ID_TALLER = $1
          AND DATE_PART('year', p.FECHA_CREACION_PRESUPUESTO_GENERAL) = DATE_PART('year', CURRENT_DATE)
          AND DATE_PART('month', p.FECHA_CREACION_PRESUPUESTO_GENERAL) = DATE_PART('month', CURRENT_DATE)
      `;
      const values = [idTaller];

      const result = await pool.query(query, values);
      return result.rows[0].cantidad_presupuestos || 0;
    } catch (error) {
      console.error('Error al obtener la cantidad de presupuestos del mes en curso:', error);
      throw error;
    }
  },
  /**
   * Obtiene la cantidad de presupuestos del mes en curso con al menos un cobro asociado.
   * @param {number} idTaller - ID del taller.
   * @returns {Promise<number>} - Retorna la cantidad de presupuestos.
   */
  getPresupuestosConCobroMes: async (idTaller) => {
    try {
      const query = `
        SELECT 
          COUNT(DISTINCT p.ID_PRESUPUESTO) AS cantidad_presupuestos
        FROM 
          PRESUPUESTO p
        JOIN 
          COBROS c ON p.ID_PRESUPUESTO = c.ID_PRESUPUESTO
        JOIN 
          SUCURSAL s ON p.ID_SUCURSAL = s.ID_SUCURSAL
        WHERE 
          s.ID_TALLER = $1
          AND DATE_PART('year', c.FECHA_COBRO) = DATE_PART('year', CURRENT_DATE)
          AND DATE_PART('month', c.FECHA_COBRO) = DATE_PART('month', CURRENT_DATE);
      `;
      const values = [idTaller];
      const result = await pool.query(query, values);
      return result.rows[0].cantidad_presupuestos || 0;
    } catch (error) {
      console.error('Error al obtener presupuestos con cobros del mes:', error);
      throw error;
    }
  }
};

module.exports = Presupuesto;
