import { Building2, Users, Monitor, MapPin, Plus } from "lucide-react";
import { useState } from "react";
import { departmentsData } from "../data/departmentsData";

// Fields that only make sense for Assets (not Consumables).
// Returns "-" for these fields when the item is a Consumable, regardless of
// whether the underlying data happens to have a value.
const ASSET_ONLY_FIELDS = ["assignedTo", "serialNumber", "condition", "assetStatus"];

function getAssetOnlyValue(item, field) {
  if (item.type === "Consumable" && ASSET_ONLY_FIELDS.includes(field)) {
    return "-";
  }
  return item[field] || "-";
}

export default function Departments({ items }) {
  const [selectedDepartment, setSelectedDepartment] =
  useState(null);
  const [departmentSearch, setDepartmentSearch] =
  useState("");
      function openDepartment(name) {
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
          <h1 className="text-3xl font-bold">Departments</h1>
          <p className="text-gray-500">
            {departments.length} departments at Menged Solution PLC
          </p>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700">
          <Plus size={18} />
          Add Department
        </button>
      </div>

      {/* Cards */}
<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
  {departments.map((department) => (
          <div
  key={department.name}
  onClick={() => openDepartment(department.name)}
  className="bg-white rounded-2xl border shadow-sm p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all"
>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
  <Building2 size={24} className="text-gray-700" />
</div>

              <div>
                <h3 className="text-xl font-semibold">
                  {department.name}
                </h3>

                <p className="text-gray-500">
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

                <p className="font-bold text-2xl">
                  {department.employees}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Monitor size={15} />
                  Assets
                </div>

                <p className="font-bold text-2xl">
                  {department.assets}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-6 text-gray-500">
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
  className="bg-white rounded-2xl shadow-xl w-[90vw] max-w-7xl p-6"
  onClick={(e) => e.stopPropagation()}
>
      <h2 className="text-2xl font-bold">
  {selectedDepartment}
</h2>

<p className="text-gray-500">
  Manager: {selectedDepartmentInfo?.manager}
</p>

<p className="text-gray-500">
  Location: {selectedDepartmentInfo?.location}
</p>

<p className="text-gray-500 mb-4">
  {departmentItems.length} total items
</p>
<div className="mt-4 mb-4">
  <input
    type="text"
    placeholder="Search by name, ID, serial, or category..."
    value={departmentSearch}
    onChange={(e) =>
      setDepartmentSearch(e.target.value)
    }
    className="w-full border rounded-xl px-4 py-2"
  />
</div>


  <div className="overflow-auto max-h-[500px] border rounded-xl mt-4">
  <table className="w-full text-sm">
    <thead>
      <tr className="bg-gray-50 text-left">
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
      className="border-b hover:bg-gray-50"
    >
      <td className="p-3">{item.id}</td>

      <td className="p-3">{item.name}</td>

      <td className="p-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            item.type === "Asset"
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
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
              ? "bg-purple-100 text-purple-700"
              : "bg-orange-100 text-orange-700"
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
              ? "bg-red-100 text-red-700"
              : item.quantity <= item.minimumStock
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
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
          ? "bg-blue-100 text-blue-700"
          : item.assetStatus === "Available"
          ? "bg-green-100 text-green-700"
          : item.assetStatus === "Maintenance"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-gray-100 text-gray-700"
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
    className="px-4 py-2 border rounded-lg"
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