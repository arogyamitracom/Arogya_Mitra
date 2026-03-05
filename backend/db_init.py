import mysql.connector

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "admin",
    "database": "django_db"
}

def create_users_table():
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()

    create_table_query = """
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        date_of_birth DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
    """

    cursor.execute(create_table_query)
    conn.commit()

    print("Users table created successfully!")

    cursor.close()
    conn.close()


if __name__ == "__main__":
    create_users_table()