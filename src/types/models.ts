export interface InventoryItem {
  id: string;
  image: string | null;
  name: string;
  type: "Asset" | "Consumable";
  purpose: string;
  department: string;
  quantity: number;
  minimumStock: number;
  unitPrice: number | string; // was `string` only — AllItems/Categories/Departments all store this as a number after Number() conversion, or a string while it's still a form field
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
  status?: string; // added — Departments.tsx renders this in its employee table; not present in usersData.ts today so it will just render blank until that field is actually populated
}

export interface Request {
  id: string;
  itemId: string;
  otherItem: string;
  quantity: number;
  reason: string;
  requestedBy?: string;
  status: "Pending" | "Approved" | "Rejected";
  date: string;
}