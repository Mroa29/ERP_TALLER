// Importar el pool de conexiones desde db_config
const pool = require('../config/db.config');

// Obtener todos los clientes
const getAllClientes = async () => {
    const result = await pool.query('SELECT * FROM clientes');
    return result.rows;
};

// Crear un nuevo cliente
const createCliente = async (clienteData) => {
    const { RUT_CLIENTE, TIPO_CLIENTE, NOM_CLIENTE, TELMOVIL_CLIENTE, TELFIJO_CLIENTE, DIRECCION_CLIENTE, COMUNA_CLIENTE, CIUDAD_CLIENTE, PAIS_CLIENTE, EMAIL_CLIENTE, ID_SUCURSAL } = clienteData;
    const result = await pool.query(
        `INSERT INTO clientes (RUT_CLIENTE, TIPO_CLIENTE, NOM_CLIENTE, TELMOVIL_CLIENTE, TELFIJO_CLIENTE, DIRECCION_CLIENTE, COMUNA_CLIENTE, CIUDAD_CLIENTE, PAIS_CLIENTE, EMAIL_CLIENTE, ID_SUCURSAL)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [RUT_CLIENTE, TIPO_CLIENTE, NOM_CLIENTE, TELMOVIL_CLIENTE, TELFIJO_CLIENTE, DIRECCION_CLIENTE, COMUNA_CLIENTE, CIUDAD_CLIENTE, PAIS_CLIENTE, EMAIL_CLIENTE, ID_SUCURSAL]
    );
    return result.rows[0];
};

// Obtener un cliente por ID
const getClienteById = async (id) => {
    const result = await pool.query('SELECT * FROM clientes WHERE ID_CLIENTE = $1', [id]);
    return result.rows[0];
};

// Actualizar un cliente por ID
const updateCliente = async (id, clienteData) => {
    const { RUT_CLIENTE, TIPO_CLIENTE, NOM_CLIENTE, TELMOVIL_CLIENTE, TELFIJO_CLIENTE, DIRECCION_CLIENTE, COMUNA_CLIENTE, CIUDAD_CLIENTE, PAIS_CLIENTE, EMAIL_CLIENTE, ID_SUCURSAL } = clienteData;
    const result = await pool.query(
        `UPDATE clientes SET RUT_CLIENTE = $1, TIPO_CLIENTE = $2, NOM_CLIENTE = $3, TELMOVIL_CLIENTE = $4, TELFIJO_CLIENTE = $5,
        DIRECCION_CLIENTE = $6, COMUNA_CLIENTE = $7, CIUDAD_CLIENTE = $8, PAIS_CLIENTE = $9, EMAIL_CLIENTE = $10, ID_SUCURSAL = $11
        WHERE ID_CLIENTE = $12 RETURNING *`,
        [RUT_CLIENTE, TIPO_CLIENTE, NOM_CLIENTE, TELMOVIL_CLIENTE, TELFIJO_CLIENTE, DIRECCION_CLIENTE, COMUNA_CLIENTE, CIUDAD_CLIENTE, PAIS_CLIENTE, EMAIL_CLIENTE, ID_SUCURSAL, id]
    );
    return result.rows[0];
};

// Eliminar un cliente por ID
const deleteCliente = async (id) => {
    const result = await pool.query('DELETE FROM clientes WHERE ID_CLIENTE = $1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = {
    getAllClientes,
    createCliente,
    getClienteById,
    updateCliente,
    deleteCliente
};
