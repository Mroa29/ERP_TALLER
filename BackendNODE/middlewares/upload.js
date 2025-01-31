const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 📌 Directorios para almacenar archivos
const storagePaths = {
    documentos: "uploads/documentos",
    firmasClientes: "uploads/firmas-clientes",
    firmasEmpleados: "uploads/firmas-empleados"
};

// 📌 Crear los directorios si no existen
Object.values(storagePaths).forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// 📌 Configuración del almacenamiento en Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath;
        switch (req.uploadType) {
            case "documento":
                uploadPath = storagePaths.documentos;
                break;
            case "firmaCliente":
                uploadPath = storagePaths.firmasClientes;
                break;
            case "firmaEmpleado":
                uploadPath = storagePaths.firmasEmpleados;
                break;
            default:
                return cb(new Error("Tipo de archivo no válido"));
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    }
});

// 📌 Filtro de archivos permitidos
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Formato de archivo no permitido. Solo se aceptan PNG, JPG, JPEG y PDF."), false);
    }
};

// 📌 Configuración final de Multer
const upload = multer({ storage, fileFilter });

module.exports = {
    uploadDocumento: (req, res, next) => {
        req.uploadType = "documento";
        upload.single("archivo")(req, res, next);
    },
    uploadFirmaCliente: (req, res, next) => {
        req.uploadType = "firmaCliente";
        upload.single("archivo")(req, res, next);
    },
    uploadFirmaEmpleado: (req, res, next) => {
        req.uploadType = "firmaEmpleado";
        upload.single("archivo")(req, res, next);
    }
};
