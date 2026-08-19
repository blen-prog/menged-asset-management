// ...existing code...
import { useState } from "react";

import { Search } from "lucide-react";

export default function Consumables({ items }) {
  const user = JSON.parse(
  sessionStorage.getItem("user")
);

const isViewer =
  user?.role === "Viewer";
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [selectedConsumable, setSelectedConsumable] = useState(null);
  const [editingConsumable, setEditingConsumable] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const consumables = items.filter((item) => item.type === "Consumable");

  // helper functions must be declared before they are used
  const getStatus = (quantity, minimumStock) => {
    if (quantity === 0) return "Out of Stock";
    if (quantity < minimumStock) return "Low Stock";
    return "In Stock";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";
      case "Out of Stock":
        return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const handleSaveConsumable = () => {
    alert(
      "Edit functionality is ready. Once the backend is connected, changes will be saved permanently."
    );
    setEditingConsumable(null);
  };

  const filteredConsumables = consumables.filter((consumable) => {
    const matchesSearch =
      consumable.name.toLowerCase().includes(search.toLowerCase()) ||
      consumable.id.toLowerCase().includes(search.toLowerCase());

    const matchesDepartment =
      departmentFilter === "All Departments" ||
      consumable.department === departmentFilter;
      const matchesCategory =
  categoryFilter === "All Categories" ||
  consumable.category === categoryFilter;

    const status = getStatus(consumable.quantity, consumable.minimumStock);

    const matchesStatus =
      statusFilter === "All Statuses" || status === statusFilter;

    return matchesSearch && matchesDepartment && matchesCategory && matchesStatus;
  });

  const consumablesPerPage = 9;
  const totalPages = Math.max(1, Math.ceil(filteredConsumables.length / consumablesPerPage));
  const startIndex = (currentPage - 1) * consumablesPerPage;
  const currentConsumables = filteredConsumables.slice(startIndex, startIndex + consumablesPerPage);

  return (
    <div className="p-6 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Consumables</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-4">Manage company consumables</p>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search consumables..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => {
              setDepartmentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option>All Departments</option>
            <option>IT</option>
            <option>HR</option>
            <option>Finance</option>
            <option>Operations</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option>All Categories</option>

            <option>Computer Equipment</option>
            <option>Networking Equipment</option>
            <option>Office Equipment</option>

            <option>Validators</option>

            <option>Stationery</option>

            <option>Spare Parts</option>
            <option>Vehicle Consumables</option>

            <option>Safety Equipment</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option>All Statuses</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-6">
        {currentConsumables.map((consumable) => {
          const status = getStatus(consumable.quantity, consumable.minimumStock);
          return (
            <div
              key={consumable.id}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4"
            >
              <div className="flex gap-4">
                <div className="w-32 h-32 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img
                    src={consumable.image}
                    alt={consumable.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{consumable.name}</h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{consumable.category}</p>

                  <p className="text-sm"><strong>ID:</strong> {consumable.id}</p>
                  <p className="text-sm"><strong>Purpose:</strong> {consumable.purpose}</p>
                  <p className="text-sm"><strong>Category:</strong> {consumable.category}</p>
                  <p className="text-sm"><strong>Department:</strong> {consumable.department}</p>
                  <p className="text-sm"><strong>Quantity:</strong> {consumable.quantity}</p>
                  <p className="text-sm"><strong>Unit Price:</strong> {consumable.unitPrice}</p>

                  <div className="mt-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setSelectedConsumable(consumable)}
                  className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  View
                </button>

                {!isViewer && (
                  <button
                    onClick={() => setEditingConsumable({ ...consumable })}
                    className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {startIndex + 1} - {Math.min(startIndex + consumablesPerPage, filteredConsumables.length)} of {filteredConsumables.length} consumables
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Previous
          </button>

          <span className="text-sm text-gray-700 dark:text-gray-300">Page {currentPage} of {totalPages}</span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Next
          </button>
        </div>
      </div>

      {/* View modal */}
      {selectedConsumable && (
        <div className="fixed inset-0 bg-black/30 dark:bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl p-6 w-[900px] max-h-[90vh] overflow-y-auto">
            <div className="flex gap-8">
              <div className="w-80 h-80 border border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                <img
                  src={selectedConsumable.image}
                  alt={selectedConsumable.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>

              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-6">{selectedConsumable.name}</h2>

                <div className="space-y-2">
                  <p><strong>ID:</strong> {selectedConsumable.id}</p>
                  <p><strong>Type:</strong> {selectedConsumable.type}</p>
                  <p>
                    <strong>Category:</strong> {selectedConsumable.category}
                  </p>
                  <p><strong>Purpose:</strong> {selectedConsumable.purpose}</p>
                  <p><strong>Department:</strong> {selectedConsumable.department}</p>
                  <p><strong>Quantity:</strong> {selectedConsumable.quantity}</p>
                  <p><strong>Minimum Stock:</strong> {selectedConsumable.minimumStock}</p>
                  <p><strong>Unit Price:</strong> {selectedConsumable.unitPrice}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setSelectedConsumable(null)}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editingConsumable && (
        <div className="fixed inset-0 bg-black/30 dark:bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl p-6 w-[900px] max-h-[90vh] overflow-y-auto">
            <div className="flex gap-8">
              <div className="w-80 h-80 border border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                <img
                  src={editingConsumable.image}
                  alt={editingConsumable.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>

              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-6">Edit Consumable</h2>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={editingConsumable.name}
                    onChange={(e) =>
                      setEditingConsumable({ ...editingConsumable, name: e.target.value })
                    }
                    className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Consumable Name"
                  />

                  <input
                    type="text"
                    value={editingConsumable.department}
                    onChange={(e) =>
                      setEditingConsumable({ ...editingConsumable, department: e.target.value })
                    }
                    className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Department"
                  />

                  <select
                    value={editingConsumable.category}
                    onChange={(e) =>
                      setEditingConsumable({
                        ...editingConsumable,
                        category: e.target.value,
                      })
                    }
                    className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option>Computer Equipment</option>
                    <option>Networking Equipment</option>
                    <option>Office Equipment</option>
                    <option>Validators</option>
                    <option>Stationery</option>
                    <option>Spare Parts</option>
                    <option>Vehicle Consumables</option>
                    <option>Safety Equipment</option>
                  </select>

                  <input
                    type="number"
                    value={editingConsumable.quantity}
                    onChange={(e) =>
                      setEditingConsumable({ ...editingConsumable, quantity: Number(e.target.value) })
                    }
                    className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Quantity"
                  />

                  <input
                    type="number"
                    value={editingConsumable.minimumStock}
                    onChange={(e) =>
                      setEditingConsumable({ ...editingConsumable, minimumStock: Number(e.target.value) })
                    }
                    className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Minimum Stock"
                  />

                  <input
                    type="text"
                    value={editingConsumable.unitPrice}
                    onChange={(e) =>
                      setEditingConsumable({ ...editingConsumable, unitPrice: e.target.value })
                    }
                    className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Unit Price"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setEditingConsumable(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveConsumable}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}