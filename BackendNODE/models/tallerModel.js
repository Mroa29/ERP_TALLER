const pool = require('../config/db.config');

// Obtener todos los talleres
const getAllTalleres = async () => {
    const result = await pool.query('SELECT * FROM talleres');
    return result.rows;
};

// Crear un nuevo taller
const createTaller = async (tallerData) => {
    const { NOM_TALLER, DIRECCION_TALLER, COMUNA_TALLER, CIUDAD_TALLER, PAIS_TALLER, CONTACTO_TALLER, EMAIL_TALLER, CAPT_VEHICULOS, ESTADO_TALLER, GERENTE_TALLER } = tallerData;
    const result = await pool.query(
        `INSERT INTO talleres (NOM_TALLER, DIRECCION_TALLER, COMUNA_TALLER, CIUDAD_TALLER, PAIS_TALLER, CONTACTO_TALLER, EMAIL_TALLER, CAPT_VEHICULOS, ESTADO_TALLER, GERENTE_TALLER)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [NOM_TALLER, DIRECCION_TALLER, COMUNA_TALLER, CIUDAD_TALLER, PAIS_TALLER, CONTACTO_TALLER, EMAIL_TALLER, CAPT_VEHICULOS, ESTADO_TALLER, GERENTE_TALLER]
    );
    return result.rows[0];
};

// Obtener un taller por ID
const getTallerById = async (id) => {
    const result = await pool.query('SELECT * FROM talleres WHERE ID_TALLER = $1', [id]);
    return result.rows[0];
};

// Actualizar un taller por ID
const updateTaller = async (id, tallerData) => {
    const { NOM_TALLER, DIRECCION_TALLER, COMUNA_TALLER, CIUDAD_TALLER, PAIS_TALLER, CONTACTO_TALLER, EMAIL_TALLER, CAPT_VEHICULOS, ESTADO_TALLER, GERENTE_TALLER } = tallerData;
    const result = await pool.query(
        `UPDATE talleres SET NOM_TALLER = $1, DIRECCION_TALLER = $2, COMUNA_TALLER = $3, CIUDAD_TALLER = $4, PAIS_TALLER = $5,
        CONTACTO_TALLER = $6, EMAIL_TALLER = $7, CAPT_VEHICULOS = $8, ESTADO_TALLER = $9, GERENTE_TALLER = $10
        WHERE ID_TALLER = $11 RETURNING *`,
        [NOM_TALLER, DIRECCION_TALLER, COMUNA_TALLER, CIUDAD_TALLER, PAIS_TALLER, CONTACTO_TALLER, EMAIL_TALLER, CAPT_VEHICULOS, ESTADO_TALLER, GERENTE_TALLER, id]
    );
    return result.rows[0];
};

// Eliminar un taller por ID
const deleteTaller = async (id) => {
    const result = await pool.query('DELETE FROM talleres WHERE ID_TALLER = $1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = {
    getAllTalleres,
    createTaller,
    getTallerById,
    updateTaller,
    deleteTaller
};
