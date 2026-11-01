export type ServiceCategory = 'maintenance' | 'repair' | 'inspection' | 'tires';

export type Car = {
  id: string;
  make: string;
  model: string;
  year: number;
  engine: string;
  vin: string;
  licensePlate: string;
  currentMileageKm: number;
  photoUrl: string;
};

export type ServiceLog = {
  id: string;
  carId: string;
  title: string;
  car: string;
  shop: string;
  date: string; // 'YYYY-MM-DD'
  mileageKm: number;
  costBam: number;
  category: ServiceCategory;
  photoUrl: string;
  notes?: string;
};
