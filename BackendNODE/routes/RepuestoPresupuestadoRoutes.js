const express = require("express");
const router = express.Router();
const RepuestoPresupuestadoController = require("../controllers/RepuestoPresupuestadoController");

// 📌 Ruta para agregar un nuevo repuesto presupuestado
router.post("/", RepuestoPresupuestadoController.addRepuestoPresupuestado);

// 📌 Ruta para eliminar un repuesto presupuestado por ID
router.delete("/:id", RepuestoPresupuestadoController.deleteRepuestoPresupuestado);

// 📌 Ruta para obtener los repuestos presupuestados por ID de presupuesto
router.get("/presupuesto/:idPresupuesto", RepuestoPresupuestadoController.getRepuestosByPresupuesto);

module.exports = router;
