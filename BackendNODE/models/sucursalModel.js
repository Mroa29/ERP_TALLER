// Importar el pool de conexiones desde db_config
const pool = require('../config/db.config');

// Crear una nueva sucursal
const createSucursal = async (sucursalData) => {
    const {
        NOM_SUCURSAL,
        DIRECION_SUCURSAL,
        COMUNA_SUCURSAL,
        CIUDAD_SUCURSAL,
        PAIS_SUCURSAL,
        TEL_SUCURSA,
        EMAIL_SUCURSAL,
        CAP_VEHICULOS_SUCURSAL,
        ID_TALLER
    } = sucursalData;

    const result = await pool.query(
        `INSERT INTO sucursales (NOM_SUCURSAL, DIRECION_SUCURSAL, COMUNA_SUCURSAL, CIUDAD_SUCURSAL, PAIS_SUCURSAL, TEL_SUCURSA, EMAIL_SUCURSAL, CAP_VEHICULOS_SUCURSAL, ID_TALLER)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [NOM_SUCURSAL, DIRECION_SUCURSAL, COMUNA_SUCURSAL, CIUDAD_SUCURSAL, PAIS_SUCURSAL, TEL_SUCURSA, EMAIL_SUCURSAL, CAP_VEHICULOS_SUCURSAL, ID_TALLER]
    );
    return result.rows[0];
};

// Obtener todas las sucursales
const getAllSucursales = async () => {
    const result = await pool.query('SELECT * FROM sucursales');
    return result.rows;
};

// Obtener una sucursal por ID
const getSucursalById = async (id) => {
    const result = await pool.query('SELECT * FROM sucursales WHERE ID_SUCURAL = $1', [id]);
    return result.rows[0];
};

// Actualizar una sucursal por ID
const updateSucursal = async (id, sucursalData) => {
    const {
        NOM_SUCURSAL,
        DIRECION_SUCURSAL,
        COMUNA_SUCURSAL,
        CIUDAD_SUCURSAL,
        PAIS_SUCURSAL,
        TEL_SUCURSA,
        EMAIL_SUCURSAL,
        CAP_VEHICULOS_SUCURSAL,
        ID_TALLER
    } = sucursalData;

    const result = await pool.query(
        `UPDATE sucursales SET NOM_SUCURSAL = $1, DIRECION_SUCURSAL = $2, COMUNA_SUCURSAL = $3, CIUDAD_SUCURSAL = $4, PAIS_SUCURSAL = $5,
        TEL_SUCURSA = $6, EMAIL_SUCURSAL = $7, CAP_VEHICULOS_SUCURSAL = $8, ID_TALLER = $9
        WHERE ID_SUCURAL = $10 RETURNING *`,
        [NOM_SUCURSAL, DIRECION_SUCURSAL, COMUNA_SUCURSAL, CIUDAD_SUCURSAL, PAIS_SUCURSAL, TEL_SUCURSA, EMAIL_SUCURSAL, CAP_VEHICULOS_SUCURSAL, ID_TALLER, id]
    );
    return result.rows[0];
};

// Eliminar una sucursal por ID
const deleteSucursal = async (id) => {
    const result = await pool.query('DELETE FROM sucursales WHERE ID_SUCURAL = $1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = {
    createSucursal,
    getAllSucursales,
    getSucursalById,
    updateSucursal,
    deleteSucursal
};
