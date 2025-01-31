const express = require("express");
const router = express.Router();
const documentosController = require("../controllers/documentosController");
const { uploadDocumento, uploadFirmaCliente, uploadFirmaEmpleado } = require("../middlewares/upload");

// 📌 Subir un documento
router.post("/documentos/subir", uploadDocumento, documentosController.subirDocumento);

// 📌 Obtener un documento por ID
router.get("/documentos/:id", documentosController.obtenerDocumentoPorId);

// 📌 Subir firma de cliente
router.post("/firmas-cliente/subir", uploadFirmaCliente, documentosController.subirFirmaCliente);

// 📌 Obtener firma de cliente por ID
router.get("/firmas-cliente/:id", documentosController.obtenerFirmaClientePorId);

// 📌 Subir firma de empleado
router.post("/firmas-empleado/subir", uploadFirmaEmpleado, documentosController.subirFirmaEmpleado);

// 📌 Obtener firma de empleado por ID
router.get("/firmas-empleado/:id", documentosController.obtenerFirmaEmpleadoPorId);

module.exports = router;
