// lib/serial-manager.ts
import { SerialPort } from "serialport";

export interface SerialConfig {
  path: string;
  baudRate?: number;
  dataBits?: 5 | 6 | 7 | 8;
  stopBits?: 1 | 2;
  parity?: "none" | "even" | "odd" | "mark" | "space";
}

export interface SerialPortInfo {
  path: string;
  manufacturer?: string;
  serialNumber?: string;
  pnpId?: string;
  locationId?: string;
  productId?: string;
  vendorId?: string;
}

class SerialManager {
  private port: SerialPort | null = null;
  private connected = false;

  constructor() {
    this.port = null;
    this.connected = false;
  }

  async connect(config: SerialConfig): Promise<void> {
    if (this.connected && this.port) {
      await this.disconnect();
    }

    return new Promise((resolve, reject) => {
      this.port = new SerialPort({
        path: config.path,
        baudRate: config.baudRate || 9600,
        dataBits: config.dataBits || 8,
        stopBits: config.stopBits || 1,
        parity: config.parity || "none",
      });

      this.port.on("open", () => {
        this.connected = true;
        console.log(`Connected to ${config.path}`);
        resolve();
      });

      this.port.on("error", (error) => {
        this.connected = false;
        console.error("Serial port error:", error);
        reject(error);
      });

      this.port.on("close", () => {
        this.connected = false;
        console.log("Serial port closed");
      });
    });
  }

  async disconnect(): Promise<void> {
    if (!this.port) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.port!.close((error) => {
        if (error) {
          reject(error);
        } else {
          this.port = null;
          this.connected = false;
          resolve();
        }
      });
    });
  }

  async write(data: string | Buffer): Promise<void> {
    if (!this.port || !this.connected) {
      throw new Error("Serial port not connected");
    }

    return new Promise((resolve, reject) => {
      this.port!.write(data, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  isConnected(): boolean {
    return this.connected && this.port !== null;
  }

  static async listPorts(): Promise<SerialPortInfo[]> {
    try {
      const ports = await SerialPort.list();
      return ports.map((port) => ({
        path: port.path,
        manufacturer: port.manufacturer,
        serialNumber: port.serialNumber,
        pnpId: port.pnpId,
        locationId: port.locationId,
        productId: port.productId,
        vendorId: port.vendorId,
      }));
    } catch (error) {
      console.error("Error listing serial ports:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const serialManager = new SerialManager();
export { SerialManager };
