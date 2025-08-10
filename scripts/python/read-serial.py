import serial
import time

# Configure the serial port
# Replace '/dev/ttyACM0' with the correct port if different
ser = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
ser.flush() # Clear any pending data

while True:
    if ser.in_waiting > 0:
        line = ser.readline().decode('utf-8').rstrip()
        print(f"Received: {line}")
    time.sleep(0.1) # Small delay to prevent busy-waiting


#sudo -E python3 save_sensor_data.py