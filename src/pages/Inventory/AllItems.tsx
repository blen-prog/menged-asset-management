import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";

import type { InventoryItem, Transaction, User } from "../../types/models";

interface NewItem {
  name: string;
  image: string | null;
  type: string;
  purpose: string;
  department: string;
  quantity: string;
  minimumStock: string;
  unitPrice: string;
  category: string;
  assignedTo: string;
  serialNumber: string;
  purchaseDate: string;
  condition: string;
  assetStatus: string;
}

interface AllItemsProps {
  items: InventoryItem[];
  setItems: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

export default function AllItems({
  items,
  setItems,
  transactions,
  setTransactions,
}: AllItemsProps) {
  const storedUser = sessionStorage.getItem("user");

  let user: User | null = null;

  if (storedUser) {
    try {
      user = JSON.parse(storedUser) as User;
    } catch {
      user = null;
    }
  }

  const isAdmin = user?.role === "Administrator";
  const isPurchase = user?.role === "Purchasing Manager";
  const canAddItem = isAdmin || isPurchase;

  const [searchParams] = useSearchParams();

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [purposeFilter, setPurposeFilter] = useState("All Purposes");
  const [departmentFilter, setDepartmentFilter] =
    useState("All Departments");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(
    null
  );
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const [newItem, setNewItem] = useState<NewItem>({
    name: "",
    image: null,
    type: "",
    purpose: "",
    department: "",
    quantity: "",
    minimumStock: "",
    unitPrice: "",
    category: "",
    assignedTo: "",
    serialNumber: "",
    purchaseDate: "",
    condition: "",
    assetStatus: "",
  });

  useEffect(() => {
    if (searchParams.get("add") === "item") {
      if (canAddItem) setShowModal(true);

      window.history.replaceState({}, "", "/all-items");
    }
  }, [searchParams, canAddItem]);

  useEffect(() => {
    if (searchParams.get("alert") === "inventory") {
      setStatusFilter("Inventory Alerts");
      window.history.replaceState({}, "", "/all-items");
    }
  }, [searchParams]);

  const getStatus = (quantity: number, minimumStock: number) => {
    if (quantity === 0) return "Out of Stock";
    if (quantity < minimumStock) return "Low Stock";
    return "In Stock";
  };

  const getStatusStyle = (status: string) => {
    if (status === "In Stock")
      return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";

    if (status === "Low Stock")
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";

    if (status === "Out of Stock")
      return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";

    return "";
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const filteredItems = items.filter((item) => {
    const query = search.toLowerCase();

    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query);

    const matchesType =
      typeFilter === "All Types" || item.type === typeFilter;

    const matchesPurpose =
      purposeFilter === "All Purposes" ||
      item.purpose === purposeFilter;

    const matchesDepartment =
      departmentFilter === "All Departments" ||
      item.department === departmentFilter;

    const matchesCategory =
      categoryFilter === "All Categories" ||
      item.category === categoryFilter;

    const status = getStatus(item.quantity, item.minimumStock);

    const matchesStatus =
      statusFilter === "All Statuses"
        ? true
        : statusFilter === "Inventory Alerts"
        ? status === "Low Stock" || status === "Out of Stock"
        : status === statusFilter;

    return (
      matchesSearch &&
      matchesType &&
      matchesPurpose &&
      matchesDepartment &&
      matchesCategory &&
      matchesStatus
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / itemsPerPage)
  );

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentItems = filteredItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleAddItem = () => {
    if (!canAddItem) {
      alert("You do not have permission to add items.");
      return;
    }

    if (
      !newItem.name ||
      !newItem.type ||
      !newItem.category ||
      !newItem.purpose ||
      !newItem.department ||
      !newItem.quantity ||
      !newItem.minimumStock ||
      !newItem.unitPrice
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (
      newItem.type === "Asset" &&
      (!newItem.assignedTo ||
        !newItem.serialNumber ||
        !newItem.purchaseDate ||
        !newItem.condition ||
        !newItem.assetStatus)
    ) {
      alert("Please complete all asset information");
      return;
    }

    const nextNumber =
      Math.max(
        ...items.map((item) =>
          Number(item.id.replace("ITM-", ""))
        ),
        0
      ) + 1;

    const itemToAdd: InventoryItem = {
      id: `ITM-${String(nextNumber).padStart(3, "0")}`,
      ...newItem,
      type: newItem.type as InventoryItem["type"],
      quantity: Number(newItem.quantity),
      minimumStock: Number(newItem.minimumStock),
      unitPrice: Number(newItem.unitPrice),
    };

    const nextTransactionNumber =
      Math.max(
        ...transactions.map((transaction) =>
          Number(transaction.id.replace("TRX-", ""))
        ),
        0
      ) + 1;

    const purchaseTransaction: Transaction = {
      id: `TRX-${String(nextTransactionNumber).padStart(3, "0")}`,
      assetId: itemToAdd.id,
      employeeId: "",
      type: "Purchase",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString(),
      cost:
        Number(itemToAdd.unitPrice) *
        Number(itemToAdd.quantity),
      assetStatus: "Available",
      condition: itemToAdd.condition || "Good",
      recordedBy: user?.name || "Admin",
      status: "Completed",
      notes: `${itemToAdd.name} added to inventory.`,
    };

    setItems([...items, itemToAdd]);
    setTransactions([purchaseTransaction, ...transactions]);

    setNewItem({
      name: "",
      image: null,
      type: "",
      category: "",
      purpose: "",
      department: "",
      quantity: "",
      minimumStock: "",
      unitPrice: "",
      assignedTo: "",
      serialNumber: "",
      purchaseDate: "",
      condition: "",
      assetStatus: "",
    });

    setShowModal(false);
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;

    setItems(
      items.map((item) =>
        item.id === editingItem.id ? editingItem : item
      )
    );

    setEditingItem(null);
  };

  const inputClass =
    "w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500";

  const selectClass =
    "border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500";

  const modalClass =
    "bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl p-6 w-[500px] max-h-[85vh] flex flex-col shadow-xl";

  return (
    <div className="p-6 text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">All Items</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage inventory and assets
          </p>
        </div>

        {canAddItem && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Item
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm mb-5">
        <div className="flex gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className={`${inputClass} pl-10 pr-4`}
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={`${selectClass} w-24 text-xs`}
          >
            <option value="All Types">All Type</option>
            <option value="Asset">Asset</option>
            <option value="Consumable">Consumable</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={`${selectClass} w-28 text-xs`}
          >
            <option value="All Categories">All Category</option>
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
            value={purposeFilter}
            onChange={(e) => {
              setPurposeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={`${selectClass} w-28 text-xs`}
          >
            <option value="All Purposes">All Purpose</option>
            <option>Office</option>
            <option>Vehicle</option>
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => {
              setDepartmentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={`${selectClass} w-28 text-xs`}
          >
            <option value="All Departments">
              All Department
            </option>
            <option>IT</option>
            <option>HR</option>
            <option>Finance</option>
            <option>Operations</option>
            <option>Administration</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className={`${selectClass} w-28 text-xs`}
          >
            <option value="All Statuses">All Status</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1400px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-left bg-gray-50 dark:bg-gray-800">
                <th className="p-4">ID</th>
                <th>Item Name</th>
                <th>Type</th>
                <th>Category</th>
                <th>Purpose</th>
                <th>Department</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentItems.map((item) => {
                const status = getStatus(
                  item.quantity,
                  item.minimumStock
                );

                return (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                  >
                    <td className="p-4">{item.id}</td>

                    <td>{item.name}</td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.type === "Asset"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                            : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>

                    <td>{item.category}</td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.purpose === "Office"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                            : "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                        }`}
                      >
                        {item.purpose}
                      </span>
                    </td>

                    <td>{item.department}</td>
                    <td>{item.quantity}</td>

                    <td className="font-medium">
                      {item.unitPrice}
                    </td>

                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </td>

                    <td>
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Eye size={18} />
                        </button>

                        {isAdmin && (
                          <>
                            <button
                              onClick={() =>
                                setEditingItem({ ...item })
                              }
                              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                            >
                              <Pencil size={18} />
                            </button>

                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you sure you want to delete this item?"
                                  )
                                ) {
                                  handleDelete(item.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {currentItems.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center py-8 text-gray-500 dark:text-gray-400"
                  >
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4 px-4 pb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing{" "}
            {filteredItems.length === 0
              ? 0
              : startIndex + 1}{" "}
            -{" "}
            {Math.min(
              startIndex + itemsPerPage,
              filteredItems.length
            )}{" "}
            of {filteredItems.length} items
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Previous
            </button>

            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showModal && canAddItem && (
        <div className="fixed inset-0 bg-black/30 dark:bg-black/60 flex items-center justify-center z-50">
          <div className={modalClass}>
            <h2 className="text-xl font-semibold mb-5">
              Add Item
            </h2>

            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              <input
                type="text"
                placeholder="Item Name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    name: e.target.value,
                  })
                }
                className={inputClass}
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    setNewItem({
                      ...newItem,
                      image: URL.createObjectURL(file),
                    });
                  }
                }}
                className={`${inputClass} file:bg-gray-100 dark:file:bg-gray-700 file:text-gray-700 dark:file:text-gray-200 file:border-0 file:rounded-md file:px-3 file:py-1`}
              />

              {newItem.image && (
                <div className="flex justify-center">
                  <div className="w-40 h-40 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    <img
                      src={newItem.image}
                      alt="Preview"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                </div>
              )}

              <select
                value={newItem.type}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    type: e.target.value,
                  })
                }
                className={inputClass}
              >
                <option value="" disabled>
                  Select Type
                </option>
                <option value="Asset">Asset</option>
                <option value="Consumable">Consumable</option>
              </select>

              <select
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    category: e.target.value,
                  })
                }
                className={inputClass}
              >
                <option value="" disabled>
                  Select Category
                </option>
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
                value={newItem.purpose}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    purpose: e.target.value,
                  })
                }
                className={inputClass}
              >
                <option value="" disabled>
                  Select Purpose
                </option>
                <option>Office</option>
                <option>Vehicle</option>
              </select>

              <select
                value={newItem.department}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    department: e.target.value,
                  })
                }
                className={inputClass}
              >
                <option value="" disabled>
                  Select Department
                </option>
                <option>IT</option>
                <option>HR</option>
                <option>Finance</option>
                <option>Operations</option>
                <option>Administration</option>
              </select>

              <input
                type="number"
                placeholder="Quantity"
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    quantity: e.target.value,
                  })
                }
                className={inputClass}
              />

              <input
                type="number"
                placeholder="Minimum Stock"
                value={newItem.minimumStock}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    minimumStock: e.target.value,
                  })
                }
                className={inputClass}
              />

              <input
                type="text"
                placeholder="Unit Price"
                value={newItem.unitPrice}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    unitPrice: e.target.value,
                  })
                }
                className={inputClass}
              />

              <input
                type="date"
                value={newItem.purchaseDate}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    purchaseDate: e.target.value,
                  })
                }
                className={inputClass}
              />

              {newItem.type === "Asset" && (
                <>
                  <input
                    type="text"
                    placeholder="Assigned To"
                    value={newItem.assignedTo}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        assignedTo: e.target.value,
                      })
                    }
                    className={inputClass}
                  />

                  <input
                    type="text"
                    placeholder="Serial Number"
                    value={newItem.serialNumber}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        serialNumber: e.target.value,
                      })
                    }
                    className={inputClass}
                  />

                  <select
                    value={newItem.condition}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        condition: e.target.value,
                      })
                    }
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select Condition
                    </option>
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Fair</option>
                    <option>Damaged</option>
                  </select>

                  <select
                    value={newItem.assetStatus}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        assetStatus: e.target.value,
                      })
                    }
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select Asset Status
                    </option>
                    <option>Assigned</option>
                    <option>Available</option>
                    <option>Maintenance</option>
                    <option>Retired</option>
                  </select>
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                onClick={handleAddItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedItem && (
        <div className="fixed inset-0 bg-black/30 dark:bg-black/60 flex items-center justify-center z-50">
          <div className={modalClass}>
            <h2 className="text-xl font-semibold mb-5">
              Item Details
            </h2>

            <div className="overflow-y-auto pr-1 flex-1">
              <div className="flex justify-center mb-5">
                <div className="w-48 h-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl flex items-center justify-center overflow-hidden">
                  {selectedItem.image ? (
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.name}
                      className="w-full h-full object-contain p-3"
                    />
                  ) : (
                    <span className="text-gray-400">
                      No Image
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <p><strong>ID:</strong> {selectedItem.id}</p>
                <p><strong>Name:</strong> {selectedItem.name}</p>
                <p><strong>Type:</strong> {selectedItem.type}</p>
                <p><strong>Category:</strong> {selectedItem.category}</p>
                <p><strong>Purpose:</strong> {selectedItem.purpose}</p>
                <p><strong>Department:</strong> {selectedItem.department}</p>
                <p><strong>Quantity:</strong> {selectedItem.quantity}</p>
                <p><strong>Minimum Stock:</strong> {selectedItem.minimumStock}</p>
                <p><strong>Unit Price:</strong> {selectedItem.unitPrice}</p>

                {selectedItem.type === "Asset" && (
                  <>
                    <p><strong>Assigned To:</strong> {selectedItem.assignedTo}</p>
                    <p><strong>Serial Number:</strong> {selectedItem.serialNumber}</p>
                    <p><strong>Purchase Date:</strong> {selectedItem.purchaseDate}</p>
                    <p><strong>Condition:</strong> {selectedItem.condition}</p>
                    <p><strong>Asset Status:</strong> {selectedItem.assetStatus}</p>
                  </>
                )}

                {selectedItem.type === "Consumable" && (
                  <p>
                    <strong>Purchase Date:</strong>{" "}
                    {selectedItem.purchaseDate}
                  </p>
                )}

                <p>
                  <strong>Stock Status:</strong>{" "}
                  {getStatus(
                    selectedItem.quantity,
                    selectedItem.minimumStock
                  )}
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {editingItem && (
        <div className="fixed inset-0 bg-black/30 dark:bg-black/60 flex items-center justify-center z-50">
          <div className={modalClass}>
            <h2 className="text-xl font-semibold mb-5">
              Edit Item
            </h2>

            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              <input
                type="text"
                value={editingItem.name}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    name: e.target.value,
                  })
                }
                className={inputClass}
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    setEditingItem({
                      ...editingItem,
                      image: URL.createObjectURL(file),
                    });
                  }
                }}
                className={`${inputClass} file:bg-gray-100 dark:file:bg-gray-700 file:text-gray-700 dark:file:text-gray-200 file:border-0 file:rounded-md file:px-3 file:py-1`}
              />

              {editingItem.image && (
                <div className="flex justify-center">
                  <div className="w-40 h-40 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    <img
                      src={editingItem.image}
                      alt="Preview"
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                </div>
              )}

              <select
                value={editingItem.type}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    type: e.target.value as InventoryItem["type"],
                  })
                }
                className={inputClass}
              >
                <option>Asset</option>
                <option>Consumable</option>
              </select>

              <select
                value={editingItem.category}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
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

              <select
                value={editingItem.purpose}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    purpose: e.target.value,
                  })
                }
                className={inputClass}
              >
                <option>Office</option>
                <option>Vehicle</option>
              </select>

              <select
                value={editingItem.department}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    department: e.target.value,
                  })
                }
                className={inputClass}
              >
                <option>IT</option>
                <option>HR</option>
                <option>Finance</option>
                <option>Operations</option>
                <option>Administration</option>
              </select>

              <input
                type="number"
                value={editingItem.quantity}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    quantity: Number(e.target.value),
                  })
                }
                className={inputClass}
              />

              <input
                type="number"
                value={editingItem.minimumStock}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    minimumStock: Number(e.target.value),
                  })
                }
                className={inputClass}
              />

              <input
                type="text"
                value={editingItem.unitPrice}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    unitPrice: e.target.value,
                  })
                }
                className={inputClass}
              />

              <input
                type="date"
                value={editingItem.purchaseDate || ""}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    purchaseDate: e.target.value,
                  })
                }
                className={inputClass}
              />

              {editingItem.type === "Asset" && (
                <>
                  <input
                    type="text"
                    placeholder="Assigned To"
                    value={editingItem.assignedTo || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        assignedTo: e.target.value,
                      })
                    }
                    className={inputClass}
                  />

                  <input
                    type="text"
                    placeholder="Serial Number"
                    value={editingItem.serialNumber || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        serialNumber: e.target.value,
                      })
                    }
                    className={inputClass}
                  />

                  <select
                    value={editingItem.condition || "Good"}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
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
                      editingItem.assetStatus || "Available"
                    }
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
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
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}