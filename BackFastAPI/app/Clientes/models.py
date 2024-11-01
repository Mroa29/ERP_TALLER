from sqlalchemy import Column, String, BigInteger, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base  # Asegúrate de que Base esté correctamente importado desde tu archivo de configuración de la base de datos

class Cliente(Base):
    __tablename__ = "clientes"
    
    id_cliente = Column(BigInteger, primary_key=True, autoincrement=True, index=True)
    rut_cliente = Column(String(10), unique=True, nullable=False)
    tipo_cliente = Column(String(20))
    nom_cliente = Column(String(100), nullable=False)
    telmovil_cliente = Column(String(15))
    telfijo_cliente = Column(String(15))
    direccion_cliente = Column(String(100))
    comuna_cliente = Column(String(25))
    ciudad_cliente = Column(String(25))
    pais_cliente = Column(String(15))
    email_cliente = Column(String(100))
    id_sucursal = Column(BigInteger, ForeignKey("sucursales.id_sucural"))

    # Relación opcional si quieres que SQLAlchemy administre la relación con sucursales
    sucursal = relationship("Sucursal", back_populates="clientes")
