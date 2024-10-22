import psycopg2
from fastapi import FastAPI
from fastapi import Depends

def get_db():
    connection = psycopg2.connect(
        host="localhost",
        database="KronosTech ERP database",
        user="postgres",
        password="akitasinus"
    )
    return connection
