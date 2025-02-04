const pool = require('../config/db.config');

const Vehiculo = {
  /**
   * Agregar un nuevo vehículo.
   * @param {Object} vehiculo - Datos del vehículo.
   * @returns {Promise<void>}
   */
  createVehiculo: async (vehiculo) => {
    const query = `
      INSERT INTO VEHICULO (
        PATENTE_VEHICULO,
        MARCA_VEHICULO,
        MODELO_VEHICULO,
        ANO_VEHICULO,
        COLOR_VEHICULO,
        KILOMETRAJE_VEHICULO,
        TIPO_VEHICULO,
        NUM_MOTOR_VEHICULO,
        OBS_VEHICULO,
        RUT_CLIENTE,
        ID_TALLER
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;
    const values = [
      vehiculo.patente,
      vehiculo.marca,
      vehiculo.modelo,
      vehiculo.ano,
      vehiculo.color,
      vehiculo.kilometraje,
      vehiculo.tipo,
      vehiculo.num_motor,
      vehiculo.observaciones,
      vehiculo.rut_cliente,
      vehiculo.id_taller,
    ];
    await pool.query(query, values);
  },

  /**
   * Obtener un vehículo por su patente.
   * @param {string} patente - Patente del vehículo.
   * @returns {Promise<Object|null>}
   */
  getVehiculoByPatente: async (patente) => {
    const query = `SELECT * FROM VEHICULO WHERE PATENTE_VEHICULO = $1`;
    const result = await pool.query(query, [patente]);
    return result.rows.length ? result.rows[0] : null;
  },

  /**
   * Actualizar un vehículo por su patente.
   * @param {string} patente - Patente del vehículo.
   * @param {Object} vehiculo - Datos actualizados del vehículo.
   * @returns {Promise<void>}
   */
  updateVehiculo: async (patente, vehiculo) => {
    const query = `
      UPDATE VEHICULO
      SET 
        MARCA_VEHICULO = $1,
        MODELO_VEHICULO = $2,
        ANO_VEHICULO = $3,
        COLOR_VEHICULO = $4,
        KILOMETRAJE_VEHICULO = $5,
        TIPO_VEHICULO = $6,
        NUM_MOTOR_VEHICULO = $7,
        OBS_VEHICULO = $8,
        RUT_CLIENTE = $9,
        ID_TALLER = $10
      WHERE PATENTE_VEHICULO = $11
    `;
    const values = [
      vehiculo.marca,
      vehiculo.modelo,
      vehiculo.ano,
      vehiculo.color,
      vehiculo.kilometraje,
      vehiculo.tipo,
      vehiculo.num_motor,
      vehiculo.observaciones,
      vehiculo.rut_cliente,
      vehiculo.id_taller,
      patente,
    ];
    await pool.query(query, values);
  },

  /**
   * Eliminar un vehículo por su patente.
   * @param {string} patente - Patente del vehículo.
   * @returns {Promise<void>}
   */
  deleteVehiculo: async (patente) => {
    const query = `DELETE FROM VEHICULO WHERE PATENTE_VEHICULO = $1`;
    await pool.query(query, [patente]);
  },

  /**
   * Obtener todos los vehículos.
   * @returns {Promise<Array<Object>>}
   */
  getAllVehiculos: async () => {
    const query = `SELECT * FROM VEHICULO`;
    const result = await pool.query(query);
    return result.rows;
  },

  /**
   * Obtener todos los tipos de vehículos.
   * @returns {Promise<Array<Object>>}
   */
  getAllTiposVehiculo: async () => {
    const query = `SELECT * FROM TIPO_VEHICULO`;
    const result = await pool.query(query);
    return result.rows;
  },

  /**
   * Obtiene todos los vehículos asociados a un cliente específico.
   * @param {string} rut_cliente - RUT del cliente.
   * @returns {Promise<Array<Object>>} - Retorna una lista de vehículos.
   */
  getVehiclesByRutCliente: async (rut_cliente) => {
    try {
      const query = `
        SELECT *
        FROM VEHICULO
        WHERE RUT_CLIENTE = $1;
      `;
      const values = [rut_cliente];

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener vehículos por rut_cliente:', error);
      throw error;
    }
  },
};

module.exports = Vehiculo;
