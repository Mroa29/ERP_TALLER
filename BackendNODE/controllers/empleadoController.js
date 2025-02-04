const Empleado = require('../models/empleadoModel');

const empleadoController = {
    /**
     * Obtener todos los empleados.
     */
    getAllEmpleados: async (req, res) => {
        try {
            const empleados = await Empleado.getAllEmpleados();
            res.json(empleados);
        } catch (error) {
            console.error('Error al obtener los empleados:', error);
            res.status(500).json({ message: 'Error al obtener los empleados' });
        }
    },

    /**
     * Obtener un empleado por RUT.
     */
    getEmpleadoByRut: async (req, res) => {
        try {
            const { rut } = req.params;
            const empleado = await Empleado.getEmpleadoByRut(rut);
            if (!empleado) {
                return res.status(404).json({ message: 'Empleado no encontrado' });
            }
            res.json(empleado);
        } catch (error) {
            console.error('Error al obtener el empleado:', error);
            res.status(500).json({ message: 'Error al obtener el empleado' });
        }
    },

    /**
     * Agregar un nuevo empleado.
     */
    addEmpleado: async (req, res) => {
        try {
            const nuevoEmpleado = await Empleado.addEmpleado(req.body);
            res.status(201).json(nuevoEmpleado);
        } catch (error) {
            console.error('Error al agregar el empleado:', error);
            res.status(500).json({ message: 'Error al agregar el empleado' });
        }
    },

    /**
     * Actualizar un empleado por RUT.
     */
    updateEmpleado: async (req, res) => {
        try {
            const { rut } = req.params;
            const empleadoActualizado = await Empleado.updateEmpleado(rut, req.body);
            if (!empleadoActualizado) {
                return res.status(404).json({ message: 'Empleado no encontrado' });
            }
            res.json(empleadoActualizado);
        } catch (error) {
            console.error('Error al actualizar el empleado:', error);
            res.status(500).json({ message: 'Error al actualizar el empleado' });
        }
    },

    /**
     * Eliminar un empleado por RUT.
     */
    deleteEmpleado: async (req, res) => {
        try {
            const { rut } = req.params;
            const eliminado = await Empleado.deleteEmpleado(rut);
            if (!eliminado) {
                return res.status(404).json({ message: 'Empleado no encontrado' });
            }
            res.json({ message: 'Empleado eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar el empleado:', error);
            res.status(500).json({ message: 'Error al eliminar el empleado' });
        }
    },

    getEmpleadosSinContrato : async (req, res) => {
        try {
            const { idTaller } = req.params;
    
            // Validación de ID_TALLER
            if (!idTaller) {
                return res.status(400).json({ error: "El ID del taller es obligatorio." });
            }
    
            const empleados = await Empleado.getEmpleadosSinContrato(idTaller);
            res.status(200).json(empleados);
        } catch (error) {
            console.error("Error al obtener empleados sin contrato:", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    },
    /**
     * Obtiene todos los empleados con contrato en el mismo taller del usuario.
     * @route GET /api/empleados/con-contrato/:idTaller
     */
    getEmpleadosConContrato : async (req, res) => {
        try {
            const { idTaller } = req.params;

            if (!idTaller) {
                return res.status(400).json({ error: "El ID del taller es obligatorio." });
            }

            const empleados = await Empleado.getEmpleadosConContrato(idTaller);

            if (empleados.length === 0) {
                return res.status(404).json({ mensaje: "No hay empleados con contrato en este taller." });
            }

            res.status(200).json(empleados);
        } catch (error) {
            console.error("Error al obtener empleados con contrato:", error);
            res.status(500).json({ error: "Error interno del servidor." });
        }
    }

   
};

module.exports = empleadoController;
