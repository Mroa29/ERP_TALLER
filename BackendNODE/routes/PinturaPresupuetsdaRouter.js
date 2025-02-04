const express = require("express");
const PinturaPresupuestadaController = require("../controllers/PinturaPresupuetsdaController");

const router = express.Router();

// 📌 Ruta para agregar una nueva pintura presupuestada
router.post("/", PinturaPresupuestadaController.addPinturaPresupuestada);

// 📌 Ruta para obtener todas las pinturas presupuestadas
router.get("/", PinturaPresupuestadaController.getAllPinturasPresupuestadas);

// 📌 Ruta para obtener una pintura presupuestada por ID
router.get("/:id", PinturaPresupuestadaController.getPinturaPresupuestadaById);

// 📌 Ruta para obtener todas las pinturas presupuestadas de un presupuesto específico
router.get("/presupuesto/:id_presupuesto", PinturaPresupuestadaController.getPinturasByPresupuesto);

// 📌 Ruta para eliminar una pintura presupuestada por ID
router.delete("/:id", PinturaPresupuestadaController.deletePinturaPresupuestada);

module.exports = router;
