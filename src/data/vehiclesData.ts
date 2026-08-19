export interface Vehicle {
  id: string;
  make: string;
  model: string;
  plateNumber: string;
  type: string;
  assignedTo: string;

  year: number;
  vin: string;

  purchaseDate: string;
  condition: string;

  registrationExpiry: string;
  insuranceExpiry: string;

  lastServiceDate: string;
  nextServiceDate: string;

  status: string;
}

export const vehiclesData: Vehicle[] = [
  {
    id: "VEH-001",
    make: "Toyota",
    model: "Hilux",
    plateNumber: "2-A12345",
    type: "Pickup",
    assignedTo: "Abebe Kebede",

    year: 2023,
    vin: "JT123456789000001",

    purchaseDate: "2023-03-15",
    condition: "Good",

    registrationExpiry: "2027-03-15",
    insuranceExpiry: "2027-03-15",

    lastServiceDate: "2026-07-10",
    nextServiceDate: "2026-10-10",

    status: "Assigned",
  },

  {
    id: "VEH-002",
    make: "Toyota",
    model: "Corolla",
    plateNumber: "2-B67890",
    type: "Sedan",
    assignedTo: "Dawit Tesfaye",

    year: 2022,
    vin: "JT123456789000002",

    purchaseDate: "2022-06-20",
    condition: "Good",

    registrationExpiry: "2027-06-20",
    insuranceExpiry: "2027-06-20",

    lastServiceDate: "2026-08-01",
    nextServiceDate: "2026-11-01",

    status: "Assigned",
  },

  {
    id: "VEH-003",
    make: "Isuzu",
    model: "NPR",
    plateNumber: "2-C24680",
    type: "Truck",
    assignedTo: "Operations",

    year: 2021,
    vin: "JAL123456789000003",

    purchaseDate: "2021-09-12",
    condition: "Fair",

    registrationExpiry: "2027-09-12",
    insuranceExpiry: "2027-09-12",

    lastServiceDate: "2026-06-15",
    nextServiceDate: "2026-09-15",

    status: "Maintenance",
  },

  {
    id: "VEH-004",
    make: "Hyundai",
    model: "Staria",
    plateNumber: "2-D13579",
    type: "Van",
    assignedTo: "Unassigned",

    year: 2024,
    vin: "KMH123456789000004",

    purchaseDate: "2024-02-10",
    condition: "Excellent",

    registrationExpiry: "2028-02-10",
    insuranceExpiry: "2028-02-10",

    lastServiceDate: "2026-07-25",
    nextServiceDate: "2026-10-25",

    status: "Available",
  },
];