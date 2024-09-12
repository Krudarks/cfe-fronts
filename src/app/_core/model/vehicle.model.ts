// src/app/models/vehicle.model.ts

export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  plates: string;
  vehicle_number: string;
}

export interface VehicleResponse {
  vehicles: Vehicle[];
  status: boolean;
}
