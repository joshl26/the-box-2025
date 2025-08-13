import psycopg2
import serial
import json
import time
from datetime import datetime
from psycopg2.extras import Json

# Database connection parameters
DB_HOST = "localhost"
DB_NAME = "the_box_2025"
DB_USER = "test_user"
DB_PASSWORD = "password"  # Replace with your PostgreSQL password

# Serial connection parameters
SERIAL_PORT = "/dev/ttyACM0"  # Linux/Mac: /dev/ttyUSB0, /dev/ttyACM0, etc. | Windows: COM3, COM4, etc.
BAUD_RATE = 9600
TIMEOUT = 1  # seconds

def insert_sensor_data(timestamp, sensor_id, value, metadata):
    conn = None
    cur = None
    try:
        conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASSWORD)
        cur = conn.cursor()

        # Insert data into the hypertable
        cur.execute(
            "INSERT INTO sensor_data (time, sensor_id, value, metadata) VALUES (%s, %s, %s, %s);",
            (timestamp, sensor_id, value, Json(metadata))
        )
        conn.commit()
        print(f"Data inserted: Time {timestamp}, Sensor ID {sensor_id}, Value {value}")

    except Exception as e:
        print(f"Error inserting data: {e}")
        if conn:
            conn.rollback()

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()
    
def parse_arduino_data(data_string):
    """
    Parse Arduino data string. Modify this function based on your Arduino data format.

    Expected formats examples:
    - Simple: "sensor_id,value" -> "101,25.6"
    - JSON: {"sensor_id": 101, "value": 25.6, "metadata": {"location": "room1"}}
    - CSV with metadata: "101,25.6,room1,temperature"
    """
    try:
        data_string = data_string.strip()

        # Try JSON format first
        try:
            data = json.loads(data_string)
            return {
                'sensor_id': data.get('sensor_id', 1),
                'value': float(data.get('value', 0)),
                'metadata': data.get('metadata', {})
            }
        except json.JSONDecodeError:
            pass

        # Try simple comma-separated format: sensor_id,value
        if ',' in data_string:
            parts = data_string.split(',')
            if len(parts) >= 2:
                return {
                    'sensor_id': int(parts[0]),
                    'value': float(parts[1]),
                    'metadata': {'raw_data': data_string}
                }

        # Try single value (assume sensor_id = 1)
        try:
            value = float(data_string)
            return {
                'sensor_id': 1,
                'value': value,
                'metadata': {'raw_data': data_string}
            }
        except ValueError:
            pass

        print(f"Could not parse data: {data_string}")
        return None

    except Exception as e:
        print(f"Error parsing Arduino data: {e}")
        return None

def read_arduino_serial():
    """
    Read data from Arduino via serial connection
    """
    try:
        # Initialize serial connection
        print(f"Connecting to Arduino on {SERIAL_PORT} at {BAUD_RATE} baud...")
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=TIMEOUT)

        # Wait for Arduino to initialize
        time.sleep(2)
        print("Connected! Reading sensor data...")

        while True:
            try:
                # Read line from serial
                if ser.in_waiting > 0:
                    raw_data = ser.readline().decode('utf-8', errors='ignore').strip()

                    if raw_data:
                        print(f"Received: {raw_data}")

                        # Parse the data
                        parsed_data = parse_arduino_data(raw_data)

                        if parsed_data:
                            # Get current timestamp
                            current_time = datetime.now()

                            # Insert into database
                            insert_sensor_data(
                                current_time,
                                parsed_data['sensor_id'],
                                parsed_data['value'],
                                parsed_data['metadata']
                            )

                # Small delay to prevent excessive CPU usage
                time.sleep(0.1)

            except KeyboardInterrupt:
                print("\nStopping data collection...")
                break
            except Exception as e:
                print(f"Error reading serial data: {e}")
                time.sleep(1)
    
    except serial.SerialException as e:
        print(f"Serial connection error: {e}")
        print("Make sure:")
        print("1. Arduino is connected via USB")
        print("2. Correct port is specified")
        print("3. No other program is using the serial port")
        print("4. You have permission to access the serial port")

    except Exception as e:
        print(f"Unexpected error: {e}")

    finally:
        if 'ser' in locals() and ser.is_open:
            ser.close()
            print("Serial connection closed")

def list_serial_ports():
    """
    List available serial ports
    """
    import serial.tools.list_ports

    ports = serial.tools.list_ports.comports()
    print("Available serial ports:")
    for port in ports:
        print(f"  {port.device} - {port.description}")

    if not ports:
        print("  No serial ports found")

def test_insert():
    """
    Test function to insert sample data (your original code)
    """
    time_str = '2025-8-9 23:41:00'
    sensor_id_1 = 101
    value = 550.00
    metadata = {'name': 'John Doe', 'age': 30, 'isStudent': 'false'}
    insert_sensor_data(time_str, sensor_id_1, value, metadata)

if __name__ == "__main__":
    import sys

    print("Arduino Sensor Data Reader")
    print("=" * 30)

    if len(sys.argv) > 1:
        command = sys.argv[1].lower()

        if command == "ports":
            list_serial_ports()
        elif command == "test":
            test_insert()
        else:
            print("Unknown command. Use 'ports' to list ports or 'test' to test database insertion")
    else:
        # Default: start reading from Arduino
        read_arduino_serial()