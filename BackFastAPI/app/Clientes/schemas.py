from pydantic import BaseModel, Field, EmailStr
from typing import Optional

# Esquema base para clientes
class ClienteBase(BaseModel):
    rut_cliente: str = Field(..., max_length=10)
    tipo_cliente: Optional[str] = Field(None, max_length=20)
    nom_cliente: str = Field(..., max_length=100)
    telmovil_cliente: Optional[str] = Field(None, max_length=15)
    telfijo_cliente: Optional[str] = Field(None, max_length=15)
    direccion_cliente: Optional[str] = Field(None, max_length=100)
    comuna_cliente: Optional[str] = Field(None, max_length=25)
    ciudad_cliente: Optional[str] = Field(None, max_length=25)
    pais_cliente: Optional[str] = Field(None, max_length=15)
    email_cliente: Optional[EmailStr] = None
    id_sucursal: Optional[int] = None

# Esquema para la creación de un nuevo cliente
class ClienteCreate(ClienteBase):
    rut_cliente: str = Field(..., max_length=10)
    nom_cliente: str = Field(..., max_length=100)

# Esquema para la respuesta de lectura de un cliente
class ClienteRead(ClienteBase):
    id_cliente: int

    class Config:
        orm_mode = True
