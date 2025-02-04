const pool = require('../config/db.config');

const Contrato = {
    /**
     * Obtiene todos los contratos.
     * @returns {Promise<Array>} - Lista de contratos.
     */
    getAllContratos: async () => {
        try {
            const query = 'SELECT * FROM CONTRATO';
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener contratos:', error);
            throw error;
        }
    },

    /**
     * Obtiene un contrato por ID.
     * @param {number} id - ID del contrato.
     * @returns {Promise<Object|null>} - Retorna el contrato si existe, de lo contrario null.
     */
    getContratoById: async (id) => {
        try {
            const query = 'SELECT * FROM CONTRATO WHERE ID_CONTRATO = $1';
            const values = [id];
            const result = await pool.query(query, values);
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            console.error('Error al obtener el contrato por ID:', error);
            throw error;
        }
    },

    /**
     * Agrega un nuevo contrato.
     * @param {Object} contrato - Datos del contrato.
     * @returns {Promise<Object>} - Retorna el contrato creado.
     */
    addContrato: async (contrato) => {
        try {
            const query = `
                INSERT INTO CONTRATO (
                    ID_EMPLEADO, ID_TIPO_CONTRATO, REMUNERACION_CONTRATO, ID_FIRMA_EMPLEADO, ID_DOCUMENTO
                ) VALUES ($1, $2, $3, $4, $5) RETURNING *;
            `;
            const values = [
                contrato.id_empleado,
                contrato.id_tipo_contrato,
                contrato.remuneracion,
                contrato.id_firma_empleado,
                contrato.id_documento
            ];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error al agregar contrato:', error);
            throw error;
        }
    },

    /**
     * Actualiza un contrato por ID.
     * @param {number} id - ID del contrato.
     * @param {Object} contrato - Datos actualizados del contrato.
     * @returns {Promise<Object|null>} - Retorna el contrato actualizado o null si no existe.
     */
    updateContrato: async (id, contrato) => {
        try {
            const query = `
                UPDATE CONTRATO
                SET ID_EMPLEADO = $1, 
                    ID_TIPO_CONTRATO = $2, 
                    REMUNERACION_CONTRATO = $3, 
                    ID_FIRMA_EMPLEADO = $4, 
                    ID_DOCUMENTO = $5
                WHERE ID_CONTRATO = $6
                RETURNING *;
            `;
            const values = [
                contrato.id_empleado,
                contrato.id_tipo_contrato,
                contrato.remuneracion,
                contrato.id_firma_empleado,
                contrato.id_documento,
                id
            ];
            const result = await pool.query(query, values);
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            console.error('Error al actualizar contrato:', error);
            throw error;
        }
    },

    /**
     * Elimina un contrato por ID.
     * @param {number} id - ID del contrato.
     * @returns {Promise<boolean>} - True si se eliminó correctamente, de lo contrario false.
     */
    deleteContrato: async (id) => {
        try {
            const query = 'DELETE FROM CONTRATO WHERE ID_CONTRATO = $1';
            const values = [id];
            const result = await pool.query(query, values);
            return result.rowCount > 0;
        } catch (error) {
            console.error('Error al eliminar contrato:', error);
            throw error;
        }
    },

    /**
     * Obtiene un contrato por el RUT del empleado.
     * @param {string} rut - RUT del empleado.
     * @returns {Promise<Object|null>} - Retorna el contrato si existe, de lo contrario null.
     */
    getContratoByRut: async (rut) => {
        try {
            const query = `
                SELECT 
                    C.ID_CONTRATO,
                    C.ID_EMPLEADO,
                    C.ID_TIPO_CONTRATO,
                    TC.DESCRIPCION AS TIPO_CONTRATO,
                    C.REMUNERACION_CONTRATO,
                    C.ID_FIRMA_EMPLEADO,
                    FE.DIRECCION_FIRMA_EMPLEADO,
                    C.ID_DOCUMENTO,
                    D.DIRECCION_DOCUMENTO
                FROM CONTRATO C
                LEFT JOIN TIPO_CONTRATO TC ON C.ID_TIPO_CONTRATO = TC.ID_TIPO_CONTRATO
                LEFT JOIN FIRMA_EMPLEADO FE ON C.ID_FIRMA_EMPLEADO = FE.ID_FIRMA_EMPLEADO
                LEFT JOIN DOCUMENTO D ON C.ID_DOCUMENTO = D.ID_DOCUMENTO
                WHERE C.ID_EMPLEADO = $1
            `;

            const result = await pool.query(query, [rut]);

            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            console.error("Error al obtener contrato por RUT:", error);
            throw error;
        }
    }
};

module.exports = Contrato;
