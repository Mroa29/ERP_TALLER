const pool = require('../config/db.config');

const Empleado = {
    /**
     * Obtiene todos los empleados.
     * @returns {Promise<Array>} - Lista de empleados.
     */
    getAllEmpleados: async () => {
        try {
            const query = 'SELECT * FROM EMPLEADO';
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener empleados:', error);
            throw error;
        }
    },

    /**
     * Obtiene un empleado por RUT.
     * @param {string} rut - RUT del empleado.
     * @returns {Promise<Object|null>} - Empleado encontrado o null si no existe.
     */
    getEmpleadoByRut: async (rut) => {
        try {
            const query = 'SELECT * FROM EMPLEADO WHERE RUT_EMPLEADO = $1';
            const result = await pool.query(query, [rut]);
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            console.error('Error al obtener el empleado:', error);
            throw error;
        }
    },

    /**
     * Agrega un nuevo empleado.
     * @param {Object} empleado - Datos del empleado.
     * @returns {Promise<Object>} - Empleado creado.
     */
    addEmpleado: async (empleado) => {
        try {
            const query = `
                INSERT INTO EMPLEADO (
                    RUT_EMPLEADO, ID_TALLER, NOMBRE_EMPLEADO, DIRECCION_EMPLEADO,
                    COMUNA_EMPLEADO, CIUDAD_EMPLEADO, NACIONALIDAD_EMPLEADO,
                    FECHA_NACIMIENTO_EMPLEADO, ESTADO_CIVIL_EMPLEADO, GRUPO_SANGUINEO_EMPLEADO,
                    TELEFONO_EMPLEADO, TELEFONO_EMERGENCIA_EMPLEADO, PREVISION_SALUD_EMPLEADO,
                    AFP_EMPLEADO, EMAIL_EMPLEADO, OBSERVACIONES_EMPLEADO, ID_CARGO
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) 
                RETURNING *;
            `;
            const values = [
                empleado.rut, empleado.id_taller, empleado.nombre, empleado.direccion,
                empleado.comuna, empleado.ciudad, empleado.nacionalidad,
                empleado.fecha_nacimiento, empleado.estado_civil, empleado.grupo_sanguineo,
                empleado.telefono, empleado.telefono_emergencia, empleado.prevision_salud,
                empleado.afp, empleado.email, empleado.observaciones, empleado.id_cargo
            ];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error al agregar empleado:', error);
            throw error;
        }
    },

    /**
     * Actualiza un empleado por RUT.
     * @param {string} rut - RUT del empleado.
     * @param {Object} empleado - Datos actualizados del empleado.
     * @returns {Promise<Object|null>} - Empleado actualizado o null si no existe.
     */
    updateEmpleado: async (rut, empleado) => {
        try {
            const query = `
                UPDATE EMPLEADO
                SET 
                    NOMBRE_EMPLEADO = $1, DIRECCION_EMPLEADO = $2, COMUNA_EMPLEADO = $3,
                    CIUDAD_EMPLEADO = $4, NACIONALIDAD_EMPLEADO = $5, FECHA_NACIMIENTO_EMPLEADO = $6,
                    ESTADO_CIVIL_EMPLEADO = $7, GRUPO_SANGUINEO_EMPLEADO = $8, TELEFONO_EMPLEADO = $9,
                    TELEFONO_EMERGENCIA_EMPLEADO = $10, PREVISION_SALUD_EMPLEADO = $11, AFP_EMPLEADO = $12,
                    EMAIL_EMPLEADO = $13, OBSERVACIONES_EMPLEADO = $14, ID_CARGO = $15
                WHERE RUT_EMPLEADO = $16 RETURNING *;
            `;
            const values = [
                empleado.nombre, empleado.direccion, empleado.comuna,
                empleado.ciudad, empleado.nacionalidad, empleado.fecha_nacimiento,
                empleado.estado_civil, empleado.grupo_sanguineo, empleado.telefono,
                empleado.telefono_emergencia, empleado.prevision_salud, empleado.afp,
                empleado.email, empleado.observaciones, empleado.id_cargo, rut
            ];
            const result = await pool.query(query, values);
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            console.error('Error al actualizar empleado:', error);
            throw error;
        }
    },

    /**
     * Elimina un empleado por RUT.
     * @param {string} rut - RUT del empleado.
     * @returns {Promise<boolean>} - True si se eliminó correctamente, false si no.
     */
    deleteEmpleado: async (rut) => {
        try {
            const query = 'DELETE FROM EMPLEADO WHERE RUT_EMPLEADO = $1';
            const result = await pool.query(query, [rut]);
            return result.rowCount > 0;
        } catch (error) {
            console.error('Error al eliminar empleado:', error);
            throw error;
        }
    },

    /**
     * Obtiene todos los empleados que no están en la tabla contrato y pertenecen a un taller específico.
     * @param {number} idTaller - ID del taller del cual se desean obtener los empleados sin contrato.
     * @returns {Promise<Array>} - Lista de empleados sin contrato.
     */
    getEmpleadosSinContrato: async (idTaller) => {
        try {
            const query = `
                SELECT 
                    e.RUT_EMPLEADO AS rut,
                    e.NOMBRE_EMPLEADO AS nombre,
                    e.EMAIL_EMPLEADO AS email,
                    e.TELEFONO_EMPLEADO AS telefono,
                    e.PREVISION_SALUD_EMPLEADO AS prevision_salud,
                    c.NOM_CARGO AS cargo
                FROM EMPLEADO e
                INNER JOIN CARGO c ON e.ID_CARGO = c.ID_CARGO
                WHERE e.ID_TALLER = $1
                AND e.RUT_EMPLEADO NOT IN (
                    SELECT ID_EMPLEADO FROM CONTRATO
                )
                ORDER BY e.NOMBRE_EMPLEADO ASC;
            `;

            const { rows } = await pool.query(query, [idTaller]);
            return rows;
        } catch (error) {
            console.error('Error al obtener empleados sin contrato:', error);
            throw error;
        }
    },

    /**
     * Obtiene todos los empleados que tienen contrato en el mismo taller del usuario.
     * @param {number} idTaller - ID del taller asociado al usuario.
     * @returns {Promise<Array>} - Lista de empleados con contrato en el taller.
     */
    getEmpleadosConContrato: async (idTaller) => {
        try {
            const query = `
                SELECT e.*, c.id_contrato, tc.descripcion AS tipo_contrato
                FROM EMPLEADO e
                INNER JOIN CONTRATO c ON e.rut_empleado = c.id_empleado
                INNER JOIN TIPO_CONTRATO tc ON c.id_tipo_contrato = tc.id_tipo_contrato
                WHERE e.id_taller = $1;
            `;
            const result = await pool.query(query, [idTaller]);
            return result.rows;
        } catch (error) {
            console.error('Error al obtener empleados con contrato:', error);
            throw error;
        }
    }
};

module.exports = Empleado;
