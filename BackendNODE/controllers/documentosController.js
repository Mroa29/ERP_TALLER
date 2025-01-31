const DocumentosModel = require("../models/documentosModel");
const path = require("path");
const fs = require("fs");

// 📌 Subir un documento
const subirDocumento = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No se ha subido ningún archivo." });
        }

        const direccion = `/uploads/documentos/${req.file.filename}`;
        const documento = await DocumentosModel.addDocumento(direccion);

        res.status(201).json({ mensaje: "Documento subido con éxito.", documento });
    } catch (error) {
        console.error("Error al subir documento:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

// 📌 Obtener un documento por ID
const obtenerDocumentoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const documento = await DocumentosModel.getDocumentoById(id);

        if (!documento) {
            return res.status(404).json({ error: "Documento no encontrado." });
        }

        res.status(200).json(documento);
    } catch (error) {
        console.error("Error al obtener documento:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

// 📌 Subir firma de cliente
const subirFirmaCliente = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No se ha subido ninguna firma." });
        }

        const direccion = `/uploads/firmas-clientes/${req.file.filename}`;
        const firma = await DocumentosModel.addFirmaCliente(direccion);

        res.status(201).json({ mensaje: "Firma de cliente subida con éxito.", firma });
    } catch (error) {
        console.error("Error al subir firma de cliente:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

// 📌 Obtener firma de cliente por ID
const obtenerFirmaClientePorId = async (req, res) => {
    try {
        const { id } = req.params;
        const firma = await DocumentosModel.getFirmaClienteById(id);

        if (!firma) {
            return res.status(404).json({ error: "Firma de cliente no encontrada." });
        }

        res.status(200).json(firma);
    } catch (error) {
        console.error("Error al obtener firma de cliente:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

// 📌 Subir firma de empleado
const subirFirmaEmpleado = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No se ha subido ninguna firma." });
        }

        const direccion = `/uploads/firmas-empleados/${req.file.filename}`;
        const firma = await DocumentosModel.addFirmaEmpleado(direccion);

        res.status(201).json({ mensaje: "Firma de empleado subida con éxito.", firma });
    } catch (error) {
        console.error("Error al subir firma de empleado:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

// 📌 Obtener firma de empleado por ID
const obtenerFirmaEmpleadoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const firma = await DocumentosModel.getFirmaEmpleadoById(id);

        if (!firma) {
            return res.status(404).json({ error: "Firma de empleado no encontrada." });
        }

        res.status(200).json(firma);
    } catch (error) {
        console.error("Error al obtener firma de empleado:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};

module.exports = {
    subirDocumento,
    obtenerDocumentoPorId,
    subirFirmaCliente,
    obtenerFirmaClientePorId,
    subirFirmaEmpleado,
    obtenerFirmaEmpleadoPorId
};
