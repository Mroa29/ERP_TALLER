from sqlalchemy.orm import Session
from . import models, schemas

# Función para crear un nuevo cliente
def create_cliente(db: Session, cliente: schemas.ClienteCreate):
    db_cliente = models.Cliente(
        rut_cliente=cliente.rut_cliente,
        tipo_cliente=cliente.tipo_cliente,
        nom_cliente=cliente.nom_cliente,
        telmovil_cliente=cliente.telmovil_cliente,
        telfijo_cliente=cliente.telfijo_cliente,
        direccion_cliente=cliente.direccion_cliente,
        comuna_cliente=cliente.comuna_cliente,
        ciudad_cliente=cliente.ciudad_cliente,
        pais_cliente=cliente.pais_cliente,
        email_cliente=cliente.email_cliente,
        id_sucursal=cliente.id_sucursal
    )
    db.add(db_cliente)
    db.commit()
    db.refresh(db_cliente)  # Actualiza db_cliente con el id asignado
    return db_cliente

# Función para obtener un cliente por ID
def get_cliente_by_id(db: Session, cliente_id: int):
    return db.query(models.Cliente).filter(models.Cliente.id_cliente == cliente_id).first()

# Función para obtener un cliente por RUT
def get_cliente_by_rut(db: Session, rut_cliente: str):
    return db.query(models.Cliente).filter(models.Cliente.rut_cliente == rut_cliente).first()

# Función para obtener todos los clientes (con paginación opcional)
def get_clientes(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Cliente).offset(skip).limit(limit).all()

# Función para actualizar un cliente
def update_cliente(db: Session, cliente_id: int, cliente: schemas.ClienteBase):
    db_cliente = db.query(models.Cliente).filter(models.Cliente.id_cliente == cliente_id).first()
    if db_cliente is None:
        return None
    
    # Actualiza los campos si existen en el schema recibido
    for var, value in vars(cliente).items():
        setattr(db_cliente, var, value) if value else None
    
    db.commit()
    db.refresh(db_cliente)
    return db_cliente

# Función para eliminar un cliente
def delete_cliente(db: Session, cliente_id: int):
    db_cliente = db.query(models.Cliente).filter(models.Cliente.id_cliente == cliente_id).first()
    if db_cliente is None:
        return None
    
    db.delete(db_cliente)
    db.commit()
    return db_cliente
