const pool = require('../config/db.config');

const TipoContrato = {
    /**
     * Obtiene todos los tipos de contrato.
     * @returns {Promise<Array>} - Lista de tipos de contrato.
     */
    getAllTiposContrato: async () => {
        try {
            const query = 'SELECT * FROM TIPO_CONTRATO';
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener los tipos de contrato:', error);
            throw error;
        }
    },

    /**
     * Obtiene un tipo de contrato por ID.
     * @param {number} id - ID del tipo de contrato.
     * @returns {Promise<Object|null>} - Retorna el tipo de contrato si existe, de lo contrario null.
     */
    getTipoContratoById: async (id) => {
        try {
            const query = 'SELECT * FROM TIPO_CONTRATO WHERE ID_TIPO_CONTRATO = $1';
            const values = [id];
            const result = await pool.query(query, values);
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            console.error('Error al obtener el tipo de contrato por ID:', error);
            throw error;
        }
    },

    /**
     * Agrega un nuevo tipo de contrato.
     * @param {Object} tipoContrato - Datos del tipo de contrato.
     * @returns {Promise<Object>} - Retorna el tipo de contrato creado.
     */
    addTipoContrato: async (tipoContrato) => {
        try {
            const query = `
                INSERT INTO TIPO_CONTRATO (DESCRIPCION)
                VALUES ($1) RETURNING *;
            `;
            const values = [tipoContrato.descripcion];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error al agregar tipo de contrato:', error);
            throw error;
        }
    },

    /**
     * Actualiza un tipo de contrato por ID.
     * @param {number} id - ID del tipo de contrato.
     * @param {Object} tipoContrato - Datos actualizados del tipo de contrato.
     * @returns {Promise<Object|null>} - Retorna el tipo de contrato actualizado o null si no existe.
     */
    updateTipoContrato: async (id, tipoContrato) => {
        try {
            const query = `
                UPDATE TIPO_CONTRATO
                SET DESCRIPCION = $1
                WHERE ID_TIPO_CONTRATO = $2
                RETURNING *;
            `;
            const values = [tipoContrato.descripcion, id];
            const result = await pool.query(query, values);
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            console.error('Error al actualizar tipo de contrato:', error);
            throw error;
        }
    },

    /**
     * Elimina un tipo de contrato por ID.
     * @param {number} id - ID del tipo de contrato.
     * @returns {Promise<boolean>} - True si se eliminó correctamente, de lo contrario false.
     */
    deleteTipoContrato: async (id) => {
        try {
            const query = 'DELETE FROM TIPO_CONTRATO WHERE ID_TIPO_CONTRATO = $1';
            const values = [id];
            const result = await pool.query(query, values);
            return result.rowCount > 0;
        } catch (error) {
            console.error('Error al eliminar tipo de contrato:', error);
            throw error;
        }
    }
};

module.exports = TipoContrato;
