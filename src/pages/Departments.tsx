import { Building2, Users, Monitor, MapPin, Plus } from "lucide-react";
import { useState } from "react";
import { departmentsData } from "../data/departmentsData";

import type { InventoryItem, User } from "../types/models";

interface DepartmentsProps {
  items: InventoryItem[];
  users: User[];
}

// Fields that only make sense for Assets (not Consumables).
// Returns "-" for these fields when the item is a Consumable, regardless of
// whether the underlying data happens to have a value.
const ASSET_ONLY_FIELDS: (keyof InventoryItem)[] = [
  "assignedTo",
  "serialNumber",
  "condition",
  "assetStatus",
];

function getAssetOnlyValue(item: InventoryItem, field: keyof InventoryItem) {
  if (item.type === "Consumable" && ASSET_ONLY_FIELDS.includes(field)) {
    return "-";
  }
  return (item[field] as string | number | undefined) || "-";
}

export default function Departments({
  items,
  users,
}: DepartmentsProps) {
  const storedUser = sessionStorage.getItem("user");
  const currentUser: User | null = storedUser
    ? JSON.parse(storedUser)
    : null;

const isViewer =
  currentUser?.role === "Viewer";
  const [selectedDepartment, setSelectedDepartment] =
  useState<string | null>(null);
  const [departmentSearch, setDepartmentSearch] =
  useState("");
      function openDepartment(name: string) {
  setSelectedDepartment(name);
}

function closeDepartment() {
  setSelectedDepartment(null);
  setDepartmentSearch("");
}

  

const departmentItems = selectedDepartment
  ? items.filter(
      (item) => item.department === selectedDepartment
    )
  : [];
  const departmentUsers = selectedDepartment
  ? users.filter(
      (u) =>
        u.department === selectedDepartment
    )
  : [];

  const filteredDepartmentItems = departmentItems.filter(
  (item) => {
    const q = departmentSearch.toLowerCase();

    return (
      item.name?.toLowerCase().includes(q) ||
      item.id?.toLowerCase().includes(q) ||
      item.serialNumber?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q)
    );
  }
);
const departments = departmentsData.map((department) => {
  const departmentAssets = items.filter(
    (item) => item.department === department.name
  );

  const assets = departmentAssets
    .filter((item) => item.type === "Asset")
    .reduce((sum, item) => sum + item.quantity, 0);

  return {
    ...department,
    assets,
  };
});
const selectedDepartmentInfo =
  departmentsData.find(
    (d) => d.name === selectedDepartment
  );
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Departments</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {departments.length} departments at Menged Solution PLC
          </p>
        </div>

        {!isViewer && (
  <button
  disabled
  className="bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 px-4 py-2 rounded-xl cursor-not-allowed"
>
  Add Department (Coming Soon)
</button>
)}
      </div>

      {/* Cards */}
<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
  {departments.map((department) => (
          <div
  key={department.name}
  onClick={() => openDepartment(department.name)}
  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all"
>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
  <Building2 size={24} className="text-gray-700 dark:text-gray-300" />
</div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {department.name}
                </h3>

                <p className="text-gray-500 dark:text-gray-400">
                  Manager: {department.manager}
                </p>
              </div>
            </div>

            <div className="flex gap-20 mt-6">
              <div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Users size={15} />
                  Employees
                </div>

                <p className="font-bold text-2xl text-gray-900 dark:text-white">
                  {department.employees}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Monitor size={15} />
                  Assets
                </div>

                <p className="font-bold text-2xl text-gray-900 dark:text-white">
                  {department.assets}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-6 text-gray-500 dark:text-gray-400">
              <MapPin size={15} />
              {department.location}
            </div>
          </div>
        ))}
      </div>
      {selectedDepartment && (
  <div
    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={closeDepartment}
  >
    <div
  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-[90vw] max-w-7xl p-6"
  onClick={(e) => e.stopPropagation()}
>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
  {selectedDepartment}
</h2>

<p className="text-gray-500 dark:text-gray-400">
  Manager: {selectedDepartmentInfo?.manager}
</p>

<p className="text-gray-500 dark:text-gray-400">
  Location: {selectedDepartmentInfo?.location}
</p>
<p className="text-gray-500 dark:text-gray-400">
  Employees: {departmentUsers.length}
</p>

<p className="text-gray-500 dark:text-gray-400 mb-4">
  Assets: {departmentItems.length}
</p>

<p className="text-gray-500 dark:text-gray-400 mb-4">
  {departmentItems.length} total items
</p>
<h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
  Department Employees
</h3>

<div className="overflow-auto border border-gray-200 dark:border-gray-700 rounded-xl mb-6">
  <table className="w-full text-sm text-gray-900 dark:text-gray-200">
    <thead>
      <tr className="bg-gray-50 dark:bg-gray-700">
        <th className="p-3 text-left">ID</th>
        <th className="p-3 text-left">Name</th>
        <th className="p-3 text-left">Role</th>
        <th className="p-3 text-left">Status</th>
        <th className="p-3 text-left">Last Login</th>
      </tr>
    </thead>

    <tbody>
      {departmentUsers.map((u) => (
        <tr
          key={u.id}
          className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <td className="p-3">{u.id}</td>
          <td className="p-3">{u.name}</td>
          <td className="p-3">{u.role}</td>
          <td className="p-3">{u.status}</td>
          <td className="p-3">{u.lastLogin}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
<div className="mt-4 mb-4">
  <input
    type="text"
    placeholder="Search by name, ID, serial, or category..."
    value={departmentSearch}
    onChange={(e) =>
      setDepartmentSearch(e.target.value)
    }
    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-2"
  />
</div>


  <div className="overflow-auto max-h-[500px] border border-gray-200 dark:border-gray-700 rounded-xl mt-4">
  <table className="w-full text-sm text-gray-900 dark:text-gray-200">
    <thead>
      <tr className="bg-gray-50 dark:bg-gray-700 text-left">
        <th className="p-3">ID</th>
        <th className="p-3">Item Name</th>
        <th className="p-3">Type</th>
        <th className="p-3">Category</th>
        <th className="p-3">Purpose</th>
        <th className="p-3">Quantity</th>
        <th className="p-3">Serial Number</th>
        <th className="p-3">Purchase Date</th>
        <th className="p-3">Unit Price</th>
        <th className="p-3">Status</th>
        <th className="p-3">Asset Status</th>
      </tr>
    </thead>

    <tbody>
  {filteredDepartmentItems.map((item) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
    >
      <td className="p-3">{item.id}</td>

      <td className="p-3">{item.name}</td>

      <td className="p-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            item.type === "Asset"
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
          }`}
        >
          {item.type}
        </span>
      </td>

      <td className="p-3">{item.category}</td>

      <td className="p-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            item.purpose === "Office"
              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
              : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
          }`}
        >
          {item.purpose}
        </span>
      </td>

      <td className="p-3">{item.quantity}</td>

      <td className="p-3">
        {getAssetOnlyValue(item, "serialNumber")}
      </td>

      <td className="p-3">
        {item.purchaseDate || "-"}
      </td>

      <td className="p-3">{item.unitPrice}</td>

      <td className="p-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            item.quantity === 0
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
              : item.quantity <= item.minimumStock
              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
          }`}
        >
          {item.quantity === 0
            ? "Out of Stock"
            : item.quantity <= item.minimumStock
            ? "Low Stock"
            : "In Stock"}
        </span>
      </td>

      <td className="p-3">
  {item.type === "Asset" ? (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        item.assetStatus === "Assigned"
          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
          : item.assetStatus === "Available"
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
          : item.assetStatus === "Maintenance"
          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
          : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
      }`}
    >
      {item.assetStatus}
    </span>
  ) : (
    "-"
  )}
</td>
    </tr>
  ))}
</tbody>
  </table>
</div>
<div className="flex justify-end mt-4">
  <button
    onClick={closeDepartment}
    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
  >
    Close
  </button>
</div>
    </div>
  </div>
)}
    </div>
  );
}