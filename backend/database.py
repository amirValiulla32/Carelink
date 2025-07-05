import sqlite3
from contextlib import contextmanager
import os

# Database file path
DB_PATH = os.path.join(os.path.dirname(
    os.path.dirname(__file__)), "db", "carelink.db")


def init_database():
    """Initialize the database with schema if it doesn't exist."""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

    # Check if database exists, if not create it with schema
    if not os.path.exists(DB_PATH):
        conn = sqlite3.connect(DB_PATH)
        conn.execute("PRAGMA foreign_keys = ON")

        # Read and execute schema
        schema_path = os.path.join(os.path.dirname(
            os.path.dirname(__file__)), "db", "schema.sql")
        with open(schema_path, "r") as f:
            schema = f.read()

        conn.executescript(schema)
        conn.commit()
        conn.close()


@contextmanager
def db_cursor():
    """Context manager for database operations with proper cleanup."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    cursor = conn.cursor()
    try:
        yield cursor
        conn.commit()
    finally:
        cursor.close()
        conn.close()


@contextmanager
def db_connection():
    """Context manager for database connection when you need the connection object."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()
