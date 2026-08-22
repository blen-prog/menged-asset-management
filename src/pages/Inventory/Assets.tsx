import { useState } from "react";
import { Search } from "lucide-react";
import type { InventoryItem } from "../../types/models";


interface User {
  role?: string;
}


export default function Assets({
  items,
}: {
  items: InventoryItem[];
}) {

  const storedUser = sessionStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;
  const isViewer = user?.role === "Viewer";

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] =
    useState("All Departments");
  const [conditionFilter, setConditionFilter] =
    useState("All Conditions");
  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");
  const [statusFilter, setStatusFilter] =
    useState("All Statuses");

    
const [selectedAsset, setSelectedAsset] =
  useState<InventoryItem | null>(null);

const [editingAsset, setEditingAsset] =
  useState<InventoryItem | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  const assets = items.filter(
    (item) => item.type === "Asset"
  );

  const filteredAssets = assets.filter((asset) => {
    const query = search.toLowerCase();

    const matchesSearch =
      asset.name.toLowerCase().includes(query) ||
      asset.id.toLowerCase().includes(query);

    const matchesDepartment =
      departmentFilter === "All Departments" ||
      asset.department === departmentFilter;

    const matchesCategory =
      categoryFilter === "All Categories" ||
      asset.category === categoryFilter;

    const matchesCondition =
      conditionFilter === "All Conditions" ||
      asset.condition === conditionFilter;

    const matchesStatus =
      statusFilter === "All Statuses" ||
      asset.assetStatus === statusFilter;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesCategory &&
      matchesCondition &&
      matchesStatus
    );
  });

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Assigned":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
      case "Available":
        return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";
      case "Retired":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const handleSaveAsset = () => {
    alert(
      "Edit functionality is ready. Once the backend is connected, changes will be saved permanently."
    );
    setEditingAsset(null);
  };

  const assetsPerPage = 9;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAssets.length / assetsPerPage)
  );

  const startIndex =
    (currentPage - 1) * assetsPerPage;

  const currentAssets = filteredAssets.slice(
    startIndex,
    startIndex + assetsPerPage
  );

  const inputClass =
    "border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="p-6 text-gray-900 dark:text-gray-100">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Assets
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Manage company assets
        </p>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className={`${inputClass} w-full pl-10`}
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => {
              setDepartmentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={inputClass}
          >
            <option>All Departments</option>
            <option>IT</option>
            <option>HR</option>
            <option>Finance</option>
            <option>Operations</option>
            <option>Administration</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={inputClass}
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
            value={conditionFilter}
            onChange={(e) => {
              setConditionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={inputClass}
          >
            <option>All Conditions</option>
            <option>Excellent</option>
            <option>Good</option>
            <option>Fair</option>
            <option>Damaged</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={inputClass}
          >
            <option>All Statuses</option>
            <option>Assigned</option>
            <option>Available</option>
            <option>Maintenance</option>
            <option>Retired</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(420px,1fr))] gap-6">
        {currentAssets.map((asset) => (
          <div
            key={asset.id}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4"
          >
            <div className="flex gap-4">
              <div className="w-32 h-32 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                {asset.image ? (
                  <img
                    src={asset.image}
                    alt={asset.name}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">
                    No Image
                  </span>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  {asset.name}
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {asset.category}
                </p>

                <p className="text-sm">
                  <strong>ID:</strong> {asset.id}
                </p>

                <p className="text-sm">
                  <strong>Department:</strong>{" "}
                  {asset.department}
                </p>

                <p className="text-sm">
                  <strong>Assigned:</strong>{" "}
                  {asset.assignedTo}
                </p>

                <p className="text-sm">
                  <strong>Serial:</strong>{" "}
                  {asset.serialNumber}
                </p>

                <p className="text-sm">
                  <strong>Condition:</strong>{" "}
                  {asset.condition}
                </p>

                <div className="mt-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      asset.assetStatus
                    )}`}
                  >
                    {asset.assetStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setSelectedAsset(asset)}
                className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg py-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                View
              </button>

              {!isViewer && (
                <button
                  onClick={() =>
                    setEditingAsset({ ...asset })
                  }
                  className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {currentAssets.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No assets found
        </div>
      )}

      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing{" "}
          {filteredAssets.length === 0
            ? 0
            : startIndex + 1}{" "}
          -{" "}
          {Math.min(
            startIndex + assetsPerPage,
            filteredAssets.length
          )}{" "}
          of {filteredAssets.length} assets
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setCurrentPage(currentPage - 1)
            }
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Previous
          </button>

          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage(currentPage + 1)
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Next
          </button>
        </div>
      </div>

      {selectedAsset && (
        <div className="fixed inset-0 bg-black/30 dark:bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl p-6 w-[900px] max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex gap-8">
              <div className="w-80 h-80 border border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                {selectedAsset.image ? (
                  <img
                    src={selectedAsset.image}
                    alt={selectedAsset.name}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <span className="text-gray-400">
                    No Image
                  </span>
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-6">
                  {selectedAsset.name}
                </h2>

                <div className="space-y-2">
                  <p>
                    <strong>ID:</strong>{" "}
                    {selectedAsset.id}
                  </p>

                  <p>
                    <strong>Type:</strong>{" "}
                    {selectedAsset.type}
                  </p>

                  <p>
                    <strong>Category:</strong>{" "}
                    {selectedAsset.category}
                  </p>

                  <p>
                    <strong>Purpose:</strong>{" "}
                    {selectedAsset.purpose}
                  </p>

                  <p>
                    <strong>Department:</strong>{" "}
                    {selectedAsset.department}
                  </p>

                  <p>
                    <strong>Quantity:</strong>{" "}
                    {selectedAsset.quantity}
                  </p>

                  <p>
                    <strong>Minimum Stock:</strong>{" "}
                    {selectedAsset.minimumStock}
                  </p>

                  <p>
                    <strong>Unit Price:</strong>{" "}
                    {selectedAsset.unitPrice}
                  </p>

                  <p>
                    <strong>Assigned To:</strong>{" "}
                    {selectedAsset.assignedTo}
                  </p>

                  <p>
                    <strong>Serial Number:</strong>{" "}
                    {selectedAsset.serialNumber}
                  </p>

                  <p>
                    <strong>Purchase Date:</strong>{" "}
                    {selectedAsset.purchaseDate}
                  </p>

                  <p>
                    <strong>Condition:</strong>{" "}
                    {selectedAsset.condition}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {selectedAsset.assetStatus}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setSelectedAsset(null)}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {editingAsset && (
        <div className="fixed inset-0 bg-black/30 dark:bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl p-6 w-[900px] max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex gap-8">
              <div className="w-80 h-80 border border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                {editingAsset.image ? (
                  <img
                    src={editingAsset.image}
                    alt={editingAsset.name}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <span className="text-gray-400">
                    No Image
                  </span>
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-6">
                  Edit Asset
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={editingAsset.name}
                    onChange={(e) =>
                      setEditingAsset({
                        ...editingAsset,
                        name: e.target.value,
                      })
                    }
                    className={inputClass}
                    placeholder="Asset Name"
                  />

                  <input
                    type="text"
                    value={editingAsset.department}
                    onChange={(e) =>
                      setEditingAsset({
                        ...editingAsset,
                        department: e.target.value,
                      })
                    }
                    className={inputClass}
                    placeholder="Department"
                  />

                  <select
                    value={editingAsset.category}
                    onChange={(e) =>
                      setEditingAsset({
                        ...editingAsset,
                        category: e.target.value,
                      })
                    }
                    className={inputClass}
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
                    type="text"
                    value={editingAsset.assignedTo || ""}
                    onChange={(e) =>
                      setEditingAsset({
                        ...editingAsset,
                        assignedTo: e.target.value,
                      })
                    }
                    className={inputClass}
                    placeholder="Assigned To"
                  />

                  <input
                    type="text"
                    value={editingAsset.serialNumber || ""}
                    onChange={(e) =>
                      setEditingAsset({
                        ...editingAsset,
                        serialNumber: e.target.value,
                      })
                    }
                    className={inputClass}
                    placeholder="Serial Number"
                  />

                  <input
                    type="date"
                    value={editingAsset.purchaseDate || ""}
                    onChange={(e) =>
                      setEditingAsset({
                        ...editingAsset,
                        purchaseDate: e.target.value,
                      })
                    }
                    className={inputClass}
                  />

                  <select
                    value={editingAsset.condition || "Good"}
                    onChange={(e) =>
                      setEditingAsset({
                        ...editingAsset,
                        condition: e.target.value,
                      })
                    }
                    className={inputClass}
                  >
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Fair</option>
                    <option>Damaged</option>
                  </select>

                  <select
                    value={
                      editingAsset.assetStatus ||
                      "Available"
                    }
                    onChange={(e) =>
                      setEditingAsset({
                        ...editingAsset,
                        assetStatus: e.target.value,
                      })
                    }
                    className={inputClass}
                  >
                    <option>Assigned</option>
                    <option>Available</option>
                    <option>Maintenance</option>
                    <option>Retired</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setEditingAsset(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveAsset}
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