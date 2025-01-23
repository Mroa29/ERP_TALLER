// Importar el pool de conexiones
const pool = require('../config/db.config');

// Modelo de sucursal
const Sucursal = {
  /**
   * Obtiene todas las sucursales.
   * @returns {Promise<Array>} - Lista de sucursales.
   */
  getAllSucursales: async () => {
    try {
      const query = 'SELECT * FROM SUCURSAL';
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener sucursales:', error);
      throw error;
    }
  },

  /**
   * Obtiene una sucursal por ID.
   * @param {number} id - ID de la sucursal.
   * @returns {Promise<Object|null>} - La sucursal si existe, de lo contrario null.
   */
  getSucursalById: async (id) => {
    try {
      const query = 'SELECT * FROM SUCURSAL WHERE ID_SUCURSAL = $1';
      const values = [id];
      const result = await pool.query(query, values);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error al obtener la sucursal por ID:', error);
      throw error;
    }
  },

  /**
   * Obtiene una sucursal por nombre.
   * @param {string} nombre - Nombre de la sucursal.
   * @returns {Promise<Object|null>} - La sucursal si existe, de lo contrario null.
   */
  getSucursalByNombre: async (nombre) => {
    try {
      const query = 'SELECT * FROM SUCURSAL WHERE NOMBRE_SUCURSAL = $1';
      const values = [nombre];
      const result = await pool.query(query, values);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error al obtener la sucursal por nombre:', error);
      throw error;
    }
  },

  /**
   * Agrega una nueva sucursal.
   * @param {Object} sucursal - Datos de la sucursal.
   * @returns {Promise<Object>} - La sucursal creada.
   */
  addSucursal: async (sucursal) => {
    try {
      const query = `
        INSERT INTO SUCURSAL (
          NOMBRE_SUCURSAL, DIRECCION_SUCURSAL, COMUNA_SUCURSAL, CIUDAD_SUCURSAL, 
          PAIS_SUCURSAL, EMAIL_SUCURSAL, CAPACIDAD_SUCURSAL, TELEFONO_SUCURSAL, ID_TALLER
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
      `;
      const values = [
        sucursal.nombre,
        sucursal.direccion,
        sucursal.comuna,
        sucursal.ciudad,
        sucursal.pais,
        sucursal.email,
        sucursal.capacidad,
        sucursal.telefono,
        sucursal.id_taller,
      ];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error al agregar sucursal:', error);
      throw error;
    }
  },

  /**
   * Actualiza una sucursal por ID.
   * @param {number} id - ID de la sucursal.
   * @param {Object} sucursal - Datos actualizados de la sucursal.
   * @returns {Promise<Object|null>} - La sucursal actualizada si existe, de lo contrario null.
   */
  updateSucursal: async (id, sucursal) => {
    try {
      const query = `
        UPDATE SUCURSAL
        SET 
          NOMBRE_SUCURSAL = $1,
          DIRECCION_SUCURSAL = $2,
          COMUNA_SUCURSAL = $3,
          CIUDAD_SUCURSAL = $4,
          PAIS_SUCURSAL = $5,
          EMAIL_SUCURSAL = $6,
          CAPACIDAD_SUCURSAL = $7,
          TELEFONO_SUCURSAL = $8,
          ID_TALLER = $9
        WHERE ID_SUCURSAL = $10 RETURNING *
      `;
      const values = [
        sucursal.nombre,
        sucursal.direccion,
        sucursal.comuna,
        sucursal.ciudad,
        sucursal.pais,
        sucursal.email,
        sucursal.capacidad,
        sucursal.telefono,
        sucursal.id_taller,
        id,
      ];
      const result = await pool.query(query, values);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error al actualizar sucursal:', error);
      throw error;
    }
  },

  /**
   * Elimina una sucursal por ID.
   * @param {number} id - ID de la sucursal.
   * @returns {Promise<boolean>} - True si se eliminó correctamente, de lo contrario false.
   */
  deleteSucursal: async (id) => {
    try {
      const query = 'DELETE FROM SUCURSAL WHERE ID_SUCURSAL = $1';
      const values = [id];
      const result = await pool.query(query, values);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error al eliminar sucursal:', error);
      throw error;
    }
  },
};

module.exports = Sucursal;
