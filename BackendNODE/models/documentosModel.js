const pool = require("../config/db.config");

const DocumentosModel = {
  // 📌 Obtener todos los documentos
  getAllDocumentos: async () => {
    try {
      const query = "SELECT * FROM DOCUMENTO";
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error al obtener documentos:", error);
      throw error;
    }
  },

  // 📌 Obtener un documento por ID
  getDocumentoById: async (id) => {
    try {
      const query = "SELECT * FROM DOCUMENTO WHERE ID_DOCUMENTO = $1";
      const result = await pool.query(query, [id]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error("Error al obtener documento por ID:", error);
      throw error;
    }
  },

  // 📌 Agregar un nuevo documento
  addDocumento: async (direccion) => {
    try {
      const query = "INSERT INTO DOCUMENTO (DIRECCION_DOCUMENTO) VALUES ($1) RETURNING *";
      const result = await pool.query(query, [direccion]);
      return result.rows[0];
    } catch (error) {
      console.error("Error al agregar documento:", error);
      throw error;
    }
  },

  // 📌 Obtener todas las firmas de clientes
  getAllFirmasClientes: async () => {
    try {
      const query = "SELECT * FROM FIRMA_CLIENTE";
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error al obtener firmas de clientes:", error);
      throw error;
    }
  },

  // 📌 Obtener una firma de cliente por ID
  getFirmaClienteById: async (id) => {
    try {
      const query = "SELECT * FROM FIRMA_CLIENTE WHERE ID_FIRMA_CLIENTE = $1";
      const result = await pool.query(query, [id]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error("Error al obtener firma de cliente por ID:", error);
      throw error;
    }
  },

  // 📌 Agregar una nueva firma de cliente
  addFirmaCliente: async (direccion) => {
    try {
      const query = "INSERT INTO FIRMA_CLIENTE (DIRECCION_FIRMA_CLIENTE) VALUES ($1) RETURNING *";
      const result = await pool.query(query, [direccion]);
      return result.rows[0];
    } catch (error) {
      console.error("Error al agregar firma de cliente:", error);
      throw error;
    }
  },

  // 📌 Obtener todas las firmas de empleados
  getAllFirmasEmpleados: async () => {
    try {
      const query = "SELECT * FROM FIRMA_EMPLEADO";
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error("Error al obtener firmas de empleados:", error);
      throw error;
    }
  },

  // 📌 Obtener una firma de empleado por ID
  getFirmaEmpleadoById: async (id) => {
    try {
      const query = "SELECT * FROM FIRMA_EMPLEADO WHERE ID_FIRMA_EMPLEADO = $1";
      const result = await pool.query(query, [id]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error("Error al obtener firma de empleado por ID:", error);
      throw error;
    }
  },

  // 📌 Agregar una nueva firma de empleado
  addFirmaEmpleado: async (direccion) => {
    try {
      const query = "INSERT INTO FIRMA_EMPLEADO (DIRECCION_FIRMA_EMPLEADO) VALUES ($1) RETURNING *";
      const result = await pool.query(query, [direccion]);
      return result.rows[0];
    } catch (error) {
      console.error("Error al agregar firma de empleado:", error);
      throw error;
    }
  }
};

module.exports = DocumentosModel;
