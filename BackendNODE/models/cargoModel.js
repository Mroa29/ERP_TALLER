const pool = require('../config/db.config');

const Cargo = {
    /**
     * Obtiene todos los cargos.
     * @returns {Promise<Array>} - Lista de cargos.
     */
    getAllCargos: async () => {
        try {
            const query = 'SELECT * FROM CARGO';
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener cargos:', error);
            throw error;
        }
    },

    /**
     * Obtiene un cargo por ID.
     * @param {number} id - ID del cargo.
     * @returns {Promise<Object|null>} - Cargo encontrado o null si no existe.
     */
    getCargoById: async (id) => {
        try {
            const query = 'SELECT * FROM CARGO WHERE ID_CARGO = $1';
            const result = await pool.query(query, [id]);
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            console.error('Error al obtener el cargo:', error);
            throw error;
        }
    },

    /**
     * Agrega un nuevo cargo.
     * @param {Object} cargo - Datos del cargo.
     * @returns {Promise<Object>} - Cargo creado.
     */
    addCargo: async (cargo) => {
        try {
            const query = `
                INSERT INTO CARGO (NOM_CARGO, DESCRIPCION_CARGO, PAGO_CARGO)
                VALUES ($1, $2, $3) RETURNING *;
            `;
            const values = [cargo.nom_cargo, cargo.descripcion_cargo, cargo.pago_cargo];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error al agregar cargo:', error);
            throw error;
        }
    },

    /**
     * Actualiza un cargo por ID.
     * @param {number} id - ID del cargo.
     * @param {Object} cargo - Datos actualizados.
     * @returns {Promise<Object|null>} - Cargo actualizado o null si no existe.
     */
    updateCargo: async (id, cargo) => {
        try {
            const query = `
                UPDATE CARGO 
                SET NOM_CARGO = $1, DESCRIPCION_CARGO = $2, PAGO_CARGO = $3
                WHERE ID_CARGO = $4 RETURNING *;
            `;
            const values = [cargo.nom_cargo, cargo.descripcion_cargo, cargo.pago_cargo, id];
            const result = await pool.query(query, values);
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            console.error('Error al actualizar cargo:', error);
            throw error;
        }
    },

    /**
     * Elimina un cargo por ID.
     * @param {number} id - ID del cargo.
     * @returns {Promise<boolean>} - True si se eliminó correctamente, false si no.
     */
    deleteCargo: async (id) => {
        try {
            const query = 'DELETE FROM CARGO WHERE ID_CARGO = $1';
            const result = await pool.query(query, [id]);
            return result.rowCount > 0;
        } catch (error) {
            console.error('Error al eliminar cargo:', error);
            throw error;
        }
    }
};

module.exports = Cargo;
