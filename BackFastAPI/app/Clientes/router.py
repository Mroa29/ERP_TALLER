from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from . import crud, schemas
from app.database import get_db 

router = APIRouter(
    prefix="/clientes",
    tags=["Clientes"]
)

# Endpoint para crear un nuevo cliente
@router.post("/", response_model=schemas.ClienteRead, status_code=status.HTTP_201_CREATED)
def create_cliente(cliente: schemas.ClienteCreate, db: Session = Depends(get_db)):
    db_cliente = crud.get_cliente_by_rut(db, cliente.rut_cliente)
    if db_cliente:
        raise HTTPException(status_code=400, detail="El cliente con este RUT ya existe.")
    return crud.create_cliente(db=db, cliente=cliente)

# Endpoint para obtener un cliente por ID
@router.get("/{cliente_id}", response_model=schemas.ClienteRead)
def get_cliente(cliente_id: int, db: Session = Depends(get_db)):
    db_cliente = crud.get_cliente_by_id(db, cliente_id)
    if db_cliente is None:
        raise HTTPException(status_code=404, detail="Cliente no encontrado.")
    return db_cliente

# Endpoint para obtener un cliente por RUT
@router.get("/rut/{rut_cliente}", response_model=schemas.ClienteRead)
def get_cliente_by_rut(rut_cliente: str, db: Session = Depends(get_db)):
    db_cliente = crud.get_cliente_by_rut(db, rut_cliente)
    if db_cliente is None:
        raise HTTPException(status_code=404, detail="Cliente no encontrado.")
    return db_cliente

# Endpoint para obtener todos los clientes (con paginación)
@router.get("/", response_model=List[schemas.ClienteRead])
def get_clientes(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    clientes = crud.get_clientes(db, skip=skip, limit=limit)
    return clientes

# Endpoint para actualizar un cliente
@router.put("/{cliente_id}", response_model=schemas.ClienteRead)
def update_cliente(cliente_id: int, cliente: schemas.ClienteBase, db: Session = Depends(get_db)):
    db_cliente = crud.get_cliente_by_id(db, cliente_id)
    if db_cliente is None:
        raise HTTPException(status_code=404, detail="Cliente no encontrado.")
    
    updated_cliente = crud.update_cliente(db=db, cliente_id=cliente_id, cliente=cliente)
    return updated_cliente

# Endpoint para eliminar un cliente
@router.delete("/{cliente_id}", response_model=schemas.ClienteRead)
def delete_cliente(cliente_id: int, db: Session = Depends(get_db)):
    db_cliente = crud.get_cliente_by_id(db, cliente_id)
    if db_cliente is None:
        raise HTTPException(status_code=404, detail="Cliente no encontrado.")
    
    return crud.delete_cliente(db=db, cliente_id=cliente_id)
