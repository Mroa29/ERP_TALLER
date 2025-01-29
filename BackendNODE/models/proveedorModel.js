// Importar el pool de conexiones
const pool = require('../config/db.config');

// Modelo de proveedor
const Proveedor = {
  /**
   * Obtiene todos los proveedores.
   * @returns {Promise<Array>} - Lista de proveedores.
   */
  getAllProveedores: async () => {
    try {
      const query = 'SELECT * FROM PROVEEDOR';
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      throw error;
    }
  },

  /**
   * Obtiene un proveedor por RUT y ID de taller.
   * @param {number} rut - RUT del proveedor.
   * @param {number} idTaller - ID del taller asociado.
   * @returns {Promise<Object|null>} - El proveedor si existe, de lo contrario null.
   */
  getProveedorById: async (rut, idTaller) => {
    try {
      const query = 'SELECT * FROM PROVEEDOR WHERE RUT_PROVEEDOR = $1 AND ID_TALLER = $2';
      const values = [rut, idTaller];
      const result = await pool.query(query, values);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error al obtener el proveedor por RUT e ID de taller:', error);
      throw error;
    }
  },

  /**
   * Agrega un nuevo proveedor.
   * @param {Object} proveedor - Datos del proveedor.
   * @returns {Promise<Object>} - El proveedor creado.
   */
  addProveedor: async (proveedor) => {
    try {
      const query = `
        INSERT INTO PROVEEDOR (
          RUT_PROVEEDOR, ID_TALLER, RAZON_SOCIAL_PROVEEDOR, GIRO_PROVEEDOR, 
          DIRECCION_PROVEEDOR, TELEFONO_PROVEEDOR, EMAIL_PROVEEDOR, 
          PERSONA_CONTACTO_PROVEEDOR, PAGINA_WEB_PROVEEDOR, ID_TIPO_PROVEEDOR
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *
      `;
      const values = [
        proveedor.rut,
        proveedor.id_taller,
        proveedor.razon_social,
        proveedor.giro,
        proveedor.direccion,
        proveedor.telefono,
        proveedor.email,
        proveedor.persona_contacto,
        proveedor.pagina_web,
        proveedor.id_tipo_proveedor,
      ];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error al agregar proveedor:', error);
      throw error;
    }
  },

  /**
   * Actualiza un proveedor por RUT y ID de taller.
   * @param {number} rut - RUT del proveedor.
   * @param {number} idTaller - ID del taller asociado.
   * @param {Object} proveedor - Datos actualizados del proveedor.
   * @returns {Promise<Object|null>} - El proveedor actualizado si existe, de lo contrario null.
   */
  updateProveedor: async (rut, idTaller, proveedor) => {
    try {
      const query = `
        UPDATE PROVEEDOR
        SET 
          RAZON_SOCIAL_PROVEEDOR = $1,
          GIRO_PROVEEDOR = $2,
          DIRECCION_PROVEEDOR = $3,
          TELEFONO_PROVEEDOR = $4,
          EMAIL_PROVEEDOR = $5,
          PERSONA_CONTACTO_PROVEEDOR = $6,
          PAGINA_WEB_PROVEEDOR = $7,
          ID_TIPO_PROVEEDOR = $8
        WHERE RUT_PROVEEDOR = $9 AND ID_TALLER = $10 RETURNING *
      `;
      const values = [
        proveedor.razon_social,
        proveedor.giro,
        proveedor.direccion,
        proveedor.telefono,
        proveedor.email,
        proveedor.persona_contacto,
        proveedor.pagina_web,
        proveedor.id_tipo_proveedor,
        rut,
        idTaller,
      ];
      const result = await pool.query(query, values);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
      throw error;
    }
  },

  /**
   * Elimina un proveedor por RUT y ID de taller.
   * @param {number} rut - RUT del proveedor.
   * @param {number} idTaller - ID del taller asociado.
   * @returns {Promise<boolean>} - True si se eliminó correctamente, de lo contrario false.
   */
  deleteProveedor: async (rut, idTaller) => {
    try {
      const query = 'DELETE FROM PROVEEDOR WHERE RUT_PROVEEDOR = $1 AND ID_TALLER = $2';
      const values = [rut, idTaller];
      const result = await pool.query(query, values);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      throw error;
    }
  },

  /**
   * Obtiene todos los tipos de proveedores.
   * @returns {Promise<Array>} - Lista de tipos de proveedores.
   */
  getAllTiposProveedores: async () => {
    try {
      const query = 'SELECT * FROM TIPO_PROVEEDOR ORDER BY ID_TIPO_PROVEEDOR';
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener los tipos de proveedores:', error);
      throw error;
    }
  },
};

module.exports = Proveedor;
