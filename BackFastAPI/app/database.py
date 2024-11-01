from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# URL de conexión a la base de datos PostgreSQL
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:akitasinus@localhost:5432/KronosTech"

# Crear el motor de conexión con SQLAlchemy
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Crear la base declarativa para los modelos
Base = declarative_base()

# Crear la sesión de base de datos
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependencia para obtener la sesión de base de datos en los endpoints de FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
