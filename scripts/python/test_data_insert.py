import psycopg2
from datetime import datetime
from psycopg2.extras import Json

# Database connection parameters
DB_HOST = "localhost"
DB_NAME = "the_box_2025"
DB_USER = "test_user"
DB_PASSWORD = "password" # Replace with your PostgreSQL password

def insert_sensor_data(time, sensor_id, value, metadata):
    try:
        conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASSWORD)
        cur = conn.cursor()

        # Get current timestamp
        current_time = datetime.now()

        # Insert data into the hypertable
        cur.execute(
            "INSERT INTO sensor_data (time, sensor_id, value, metadata) VALUES (%s, %s, %s, %s);",
            (time, sensor_id, value, Json(metadata))
        )
        conn.commit()
        print(f"Data inserted: Sensor Time{time}, ID {sensor_id}, Value {value}, MetaData{metadata}")

    except Exception as e:
        print(f"Error inserting data: {e}")
    finally:
        if conn:
            cur.close()
            conn.close()

# Example usage: Replace with your actual sensor data acquisition logic
if __name__ == "__main__":
    # Simulate receiving sensor data
    time='2025-8-9 23:41:00'
    sensor_id_1 = 101
    value = 550.00
    metadata={'name': 'John Doe','age': 30, 'isStudent': 'false'}
    insert_sensor_data(time, sensor_id_1, value, metadata)