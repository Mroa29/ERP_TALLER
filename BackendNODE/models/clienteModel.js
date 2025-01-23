// Importar el pool de conexiones
const pool = require('../config/db.config');

// Modelo de cliente
const Cliente = {
  /**
   * Agrega un nuevo cliente a la base de datos.
   * @param {Object} cliente - Objeto con los datos del cliente.
   * @returns {Promise<Object>} - Retorna el cliente agregado.
   */
  addCliente: async (cliente) => {
    try {
      const query = `
        INSERT INTO CLIENTE (
          RUT_CLIENTE,
          NOM_CLIENTE,
          TIPO_CLIENTE,
          DIRECCION_CLIENTE,
          COMUNA_CLIENTE,
          CIUDAD_CLIENTE,
          PAIS_CLIENTE,
          EMAIL_CLIENTE,
          OBS_CLIENTE,
          TELEFONO_CLIENTE,
          ID_SUCURSAL,
          ID_TIPO_CLIENTE,
          ID_ESTADO_CLIENTE,
          ID_TALLER
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *;
      `;
      const values = [
        cliente.rut_cliente,
        cliente.nom_cliente,
        cliente.tipo_cliente,
        cliente.direccion_cliente,
        cliente.comuna_cliente,
        cliente.ciudad_cliente,
        cliente.pais_cliente,
        cliente.email_cliente,
        cliente.obs_cliente,
        cliente.telefono_cliente,
        cliente.id_sucursal,
        cliente.id_tipo_cliente,
        cliente.id_estado_cliente,
        cliente.id_taller,
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error al agregar cliente:', error);
      throw error;
    }
  },

  /**
   * Obtiene un cliente por su RUT.
   * @param {string} rut - RUT del cliente.
   * @returns {Promise<Object|null>} - Retorna el cliente si existe o null si no.
   */
  findClienteByRut: async (rut) => {
    try {
      const query = `
        SELECT * FROM CLIENTE
        WHERE RUT_CLIENTE = $1;
      `;
      const values = [rut];

      const result = await pool.query(query, values);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error al buscar cliente por RUT:', error);
      throw error;
    }
  },

  /**
   * Actualiza un cliente por su RUT.
   * @param {string} rut - RUT del cliente.
   * @param {Object} cliente - Datos del cliente a actualizar.
   * @returns {Promise<Object|null>} - Retorna el cliente actualizado o null si no existe.
   */
  updateCliente: async (rut, cliente) => {
    try {
      const query = `
        UPDATE CLIENTE
        SET
          NOM_CLIENTE = $2,
          TIPO_CLIENTE = $3,
          DIRECCION_CLIENTE = $4,
          COMUNA_CLIENTE = $5,
          CIUDAD_CLIENTE = $6,
          PAIS_CLIENTE = $7,
          EMAIL_CLIENTE = $8,
          OBS_CLIENTE = $9,
          TELEFONO_CLIENTE = $10,
          ID_SUCURSAL = $11,
          ID_TIPO_CLIENTE = $12,
          ID_ESTADO_CLIENTE = $13,
          ID_TALLER = $14
        WHERE RUT_CLIENTE = $1
        RETURNING *;
      `;
      const values = [
        rut,
        cliente.nom_cliente,
        cliente.tipo_cliente,
        cliente.direccion_cliente,
        cliente.comuna_cliente,
        cliente.ciudad_cliente,
        cliente.pais_cliente,
        cliente.email_cliente,
        cliente.obs_cliente,
        cliente.telefono_cliente,
        cliente.id_sucursal,
        cliente.id_tipo_cliente,
        cliente.id_estado_cliente,
        cliente.id_taller,
      ];

      const result = await pool.query(query, values);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      throw error;
    }
  },

  /**
   * Elimina un cliente por su RUT.
   * @param {string} rut - RUT del cliente.
   * @returns {Promise<boolean>} - Retorna true si se eliminó el cliente, false si no.
   */
  deleteCliente: async (rut) => {
    try {
      const query = `
        DELETE FROM CLIENTE
        WHERE RUT_CLIENTE = $1;
      `;
      const values = [rut];

      const result = await pool.query(query, values);
      return result.rowCount > 0;
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      throw error;
    }
  },

  /**
   * Obtiene todos los clientes registrados.
   * @returns {Promise<Array<Object>>} - Retorna una lista de todos los clientes.
   */
  getAllClientes: async () => {
    try {
      const query = `
        SELECT * FROM CLIENTE;
      `;

      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error al obtener todos los clientes:', error);
      throw error;
    }
  },

  /**
 * Obtiene todos los tipos de clientes.
 * @returns {Promise<Array<Object>>} - Retorna una lista de todos los tipos de clientes.
 */
getAllTiposClientes: async () => {
    try {
      const query = 'SELECT * FROM TIPO_CLIENTE ORDER BY ID_TIPO_CLIENTE';
      const result = await pool.query(query);
  
      return result.rows; // Devuelve todos los tipos de clientes
    } catch (error) {
      console.error('Error al obtener los tipos de clientes:', error);
      throw error;
    }
  },
  
  /**
   * Obtiene todos los estados de clientes.
   * @returns {Promise<Array<Object>>} - Retorna una lista de todos los estados de clientes.
   */
  getAllEstadosClientes: async () => {
    try {
      const query = 'SELECT * FROM ESTADO_CLIENTE ORDER BY ID_ESTADO_CLIENTE';
      const result = await pool.query(query);
  
      return result.rows; // Devuelve todos los estados de clientes
    } catch (error) {
      console.error('Error al obtener los estados de clientes:', error);
      throw error;
    }
  },

  /**
 * Obtiene un tipo de cliente por su ID.
 * @param {number} id - ID del tipo de cliente.
 * @returns {Promise<Object|null>} - Retorna el tipo de cliente si existe o null si no.
 */
getTipoClienteById: async (id) => {
    try {
      const query = 'SELECT * FROM TIPO_CLIENTE WHERE ID_TIPO_CLIENTE = $1';
      const values = [id];
      const result = await pool.query(query, values);
  
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error al obtener el tipo de cliente por ID:', error);
      throw error;
    }
  },
  
  /**
   * Obtiene un estado de cliente por su ID.
   * @param {number} id - ID del estado de cliente.
   * @returns {Promise<Object|null>} - Retorna el estado de cliente si existe o null si no.
   */
  getEstadoClienteById: async (id) => {
    try {
      const query = 'SELECT * FROM ESTADO_CLIENTE WHERE ID_ESTADO_CLIENTE = $1';
      const values = [id];
      const result = await pool.query(query, values);
  
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error al obtener el estado de cliente por ID:', error);
      throw error;
    }
  },

    // Consulta para buscar tipo_cliente por descripción
    getTipoClienteByDescripcion: async (descripcion) => {
      try {
          const query = `
              SELECT *
              FROM TIPO_CLIENTE
              WHERE DESCRIPCION = $1
          `;
          const values = [descripcion];
          const result = await pool.query(query, values);
          return result.rows[0] || null; // Retorna el registro si existe, de lo contrario, null
      } catch (error) {
          console.error('Error al buscar tipo_cliente por descripción:', error);
          throw error;
      }
  },

  // Consulta para buscar estado_cliente por descripción
  getEstadoClienteByDescripcion: async (descripcion) => {
      try {
          const query = `
              SELECT *
              FROM ESTADO_CLIENTE
              WHERE DESCRIPCION = $1
          `;
          const values = [descripcion];
          const result = await pool.query(query, values);
          return result.rows[0] || null; // Retorna el registro si existe, de lo contrario, null
      } catch (error) {
          console.error('Error al buscar estado_cliente por descripción:', error);
          throw error;
      }
  },
};

module.exports = Cliente;
