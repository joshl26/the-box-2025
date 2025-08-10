import psycopg2

# Database connection parameters
DB_HOST = "localhost"
DB_NAME = "the_box_2025"
DB_USER = "test_user"
DB_PASSWORD = "password" # Replace with your PostgreSQL password


conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASSWORD)
cur = conn.cursor()
cur.execute("SELECT version();")
version = cur.fetchone()[0]
print(version)
cur.close()
conn.close()