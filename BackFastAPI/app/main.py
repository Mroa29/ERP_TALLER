from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.Clientes.router import router as clientes_router
from app.database import Base, engine

app = FastAPI()

# Configuración de CORS
origins = [
    "http://127.0.0.1:5500",    # Permite solicitudes desde este origen específico
    "http://localhost",          # Permite solicitudes desde localhost en otros puertos
    "http://127.0.0.1"           # Otros posibles orígenes en localhost
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # Permite solo estos orígenes específicos
    allow_credentials=True,
    allow_methods=["*"],            # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],            # Permite todos los encabezados
)

# Vincular el modelo con la base de datos (solo para desarrollo)
Base.metadata.create_all(bind=engine)

# Incluir el router de clientes
app.include_router(clientes_router)
