import uvicorn

if __name__ == "__main__":
    # Ejecuta la aplicación FastAPI desde el archivo main.py dentro de la carpeta app
    # Asegúrate de que `app.main:app` apunta correctamente al objeto de la aplicación en main.py
    uvicorn.run("app.main:app",reload=True)
