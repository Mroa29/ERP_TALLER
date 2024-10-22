from fastapi import FastAPI, HTTPException
from .database import get_db

app = FastAPI()

# Ruta para obtener talleres activos
@app.get("/talleres")
def obtener_talleres():
    db = get_db()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM talleres WHERE ESTADO_TALLER = 'Activo';")
    talleres = cursor.fetchall()
    cursor.close()
    
    if not talleres:
        raise HTTPException(status_code=404, detail="No hay talleres activos")
    
    return {"talleres": talleres}

# Ruta para crear un nuevo taller
@app.post("/creartalleres")
def crear_taller(NOM_TALLER: str, DIRECCION_TALLER: str, COMUNA_TALLER: str, CIUDAD_TALLER: str, PAIS_TALLER: str, CONTACTO_TALLER: str, EMAIL_TALLER: str, CAPT_VEHICULOS: int, ESTADO_TALLER: str, GERENTE_TALLER: str):
    db = get_db()
    cursor = db.cursor()
    
    query = """
    INSERT INTO talleres (NOM_TALLER, DIRECCION_TALLER, COMUNA_TALLER, CIUDAD_TALLER, PAIS_TALLER, CONTACTO_TALLER, EMAIL_TALLER, CAPT_VEHICULOS, ESTADO_TALLER, GERENTE_TALLER)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
    """
    cursor.execute(query, (NOM_TALLER, DIRECCION_TALLER, COMUNA_TALLER, CIUDAD_TALLER, PAIS_TALLER, CONTACTO_TALLER, EMAIL_TALLER, CAPT_VEHICULOS, ESTADO_TALLER, GERENTE_TALLER))
    db.commit()
    cursor.close()
    
    return {"message": "Taller creado con éxito"}
