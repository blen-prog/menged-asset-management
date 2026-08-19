export interface InventoryItem {
  id: string;
  image: string;
  name: string;
  type: "Asset" | "Consumable";
  purpose: string;
  department: string;
  quantity: number;
  minimumStock: number;
  unitPrice: string;
  assignedTo?: string;
  serialNumber?: string;
  purchaseDate: string;
  condition?: string;
  assetStatus?: string;
  category: string;
}

export interface Transaction {
  id: string;
  assetId: string;
  employeeId: string;
  type: string;
  date: string;
  time: string;
  cost: number;
  assetStatus: string;
  condition: string;
  recordedBy: string;
  status: string;
  notes: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  department: string;
  role: string;
  lastLogin: string;
}