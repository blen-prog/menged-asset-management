import { useState, useMemo } from "react";
import {
  Search,
  Monitor,
  Wifi,
  Printer,
  ShieldCheck,
  PenTool,
  Wrench,
  Fuel,
  HardHat,
  Package,
  X,
  LucideIcon,
} from "lucide-react";

import type { InventoryItem } from "../../types/models";

type ColorKey =
  | "blue"
  | "violet"
  | "amber"
  | "emerald"
  | "pink"
  | "orange"
  | "cyan"
  | "red";

interface CategoryMetaEntry {
  icon: LucideIcon;
  color: ColorKey;
}

const CATEGORY_META: Record<string, CategoryMetaEntry> = {
  "Computer Equipment": { icon: Monitor, color: "blue" },
  "Networking Equipment": { icon: Wifi, color: "violet" },
  "Office Equipment": { icon: Printer, color: "amber" },
  "Validators": { icon: ShieldCheck, color: "emerald" },
  "Stationery": { icon: PenTool, color: "pink" },
  "Spare Parts": { icon: Wrench, color: "orange" },
  "Vehicle Consumables": { icon: Fuel, color: "cyan" },
  "Safety Equipment": { icon: HardHat, color: "red" },
};

const COLOR_STYLES: Record<
  ColorKey,
  { bg: string; text: string; ring: string }
> = {
  blue: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600 dark:text-blue-400", ring: "group-hover:ring-blue-200" },
  violet: { bg: "bg-violet-50 dark:bg-violet-900/20", text: "text-violet-600 dark:text-violet-400", ring: "group-hover:ring-violet-200" },
  amber: { bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-600 dark:text-amber-400", ring: "group-hover:ring-amber-200" },
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600 dark:text-emerald-400", ring: "group-hover:ring-emerald-200" },
  pink: { bg: "bg-pink-50 dark:bg-pink-900/20", text: "text-pink-600 dark:text-pink-400", ring: "group-hover:ring-pink-200" },
  orange: { bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-600 dark:text-orange-400", ring: "group-hover:ring-orange-200" },
  cyan: { bg: "bg-cyan-50 dark:bg-cyan-900/20", text: "text-cyan-600 dark:text-cyan-400", ring: "group-hover:ring-cyan-200" },
  red: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-600 dark:text-red-400", ring: "group-hover:ring-red-200" },
};

// Fields that only make sense for Assets (not Consumables).
// getAssetOnlyValue returns "-" for these fields when the item is a
// Consumable, regardless of whether the underlying data has a value.
const ASSET_ONLY_FIELDS: (keyof InventoryItem)[] = [
  "assignedTo",
  "serialNumber",
  "condition",
  "assetStatus",
];

function getAssetOnlyValue(
  item: InventoryItem,
  field: keyof InventoryItem
) {
  if (
    item.type === "Consumable" &&
    ASSET_ONLY_FIELDS.includes(field)
  ) {
    return "-";
  }

  return item[field] ?? "-";
}

// Badge helpers
function TypeBadge({ type }: { type?: string }) {
  const isAsset = type === "Asset";
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
        isAsset ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
      }`}
    >
      {type}
    </span>
  );
}

function PurposeBadge({ purpose }: { purpose?: string }) {
  const styles: Record<string, string> = {
    Office: "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400",
    Vehicle: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
        (purpose && styles[purpose]) || "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
      }`}
    >
      {purpose ?? "-"}
    </span>
  );
}

// Stock status derived from quantity vs minimumStock
function getStockStatus(item: InventoryItem) {
  if (item.quantity === 0) return "Out of Stock";
  if (
    item.quantity !== undefined &&
    item.minimumStock !== undefined &&
    item.quantity <= item.minimumStock
  )
    return "Low Stock";
  return "In Stock";
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "In Stock": "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    "Low Stock": "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
    "Out of Stock": "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
        styles[status] || "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
      }`}
    >
      {status}
    </span>
  );
}

export default function Categories({
  items,
}: {
  items: InventoryItem[];
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [itemQuery, setItemQuery] = useState("");

  const categories = Object.keys(CATEGORY_META);

  const categoryData = useMemo(() => {
  return categories.map((category) => {
    const categoryItems = items.filter(
      (item) => item.category === category
    );

    return {
      name: category,
      count: categoryItems.length,
      assets: categoryItems.filter(
        (item) => item.type === "Asset"
      ).length,
      consumables: categoryItems.filter(
        (item) => item.type === "Consumable"
      ).length,
    };
  });
}, [items]);

  const filtered = categoryData.filter((c) =>
    c.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  const modalItems = useMemo(() => {
    if (!selected) return [];
    return items.filter((item) => item.category === selected);
  }, [selected, items]);

  const filteredModalItems = modalItems.filter((item) => {
    const q = itemQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      item.name?.toLowerCase().includes(q) ||
      item.id?.toLowerCase().includes(q) ||
      item.department?.toLowerCase().includes(q) ||
      item.serialNumber?.toLowerCase().includes(q)
    );
  });

  function openCategory(name: string) {
    setSelected(name);
    setItemQuery("");
  }

  function closeModal() {
    setSelected(null);
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
        <p className="text-gray-500 dark:text-gray-400">Browse inventory by category</p>
      </div>

      {/* Search bar */}
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search categories..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800
                     text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400
                     transition-all"
        />
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((category) => {
            const meta = CATEGORY_META[category.name] || { icon: Package, color: "blue" };
            const Icon = meta.icon;
            const styles = COLOR_STYLES[meta.color];

            return (
              <div
                key={category.name}
                onClick={() => openCategory(category.name)}
                className={`group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5
                            hover:shadow-lg hover:-translate-y-1 hover:ring-2 ${styles.ring}
                            transition-all duration-200 cursor-pointer active:scale-[0.98]`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {category.name}
                  </h3>
                  <div className={`${styles.bg} ${styles.text} p-2 rounded-xl`}>
                    <Icon size={20} />
                  </div>
                </div>

                <p className="text-3xl font-bold mt-4 text-gray-900 dark:text-white">
                  {category.count}
                </p>
                <p className="text-gray-400 text-sm">Total Items</p>

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    <span className="font-semibold text-gray-900 dark:text-white">{category.assets}</span> Assets
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    <span className="font-semibold text-gray-900 dark:text-white">{category.consumables}</span> Consumables
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Package size={40} className="mb-3" />
          <p className="text-sm">No categories match "{query}"</p>
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-6xl max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {(() => {
                  const meta = CATEGORY_META[selected] || { icon: Package, color: "blue" };
                  const Icon = meta.icon;
                  const styles = COLOR_STYLES[meta.color];
                  return (
                    <div className={`${styles.bg} ${styles.text} p-2 rounded-xl`}>
                      <Icon size={20} />
                    </div>
                  );
                })()}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selected}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{modalItems.length} total items</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal search */}
            <div className="px-6 pt-4">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={itemQuery}
                  onChange={(e) => setItemQuery(e.target.value)}
                  placeholder="Search by name, ID, serial, or department..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700
                             text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400
                             focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400
                             transition-all"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-auto px-6 py-4 flex-1">
              <table className="w-full text-sm border-separate border-spacing-0">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700 text-left text-gray-500 dark:text-gray-300 sticky top-0 z-10">
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">ID</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Item Name</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Type</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Category</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Purpose</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Department</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Quantity</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Serial Number</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Purchase Date</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Unit Price</th>
                    <th className="px-4 py-3 font-semibold whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredModalItems.length > 0 ? (
                    filteredModalItems.map((item, i) => (
                      <tr
                        key={item.id ?? i}
                        className="border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{item.id ?? "-"}</td>
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          {item.name ?? "-"}
                        </td>
                        <td className="px-4 py-3">
                          <TypeBadge type={item.type} />
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{item.category ?? "-"}</td>
                        <td className="px-4 py-3">
                          <PurposeBadge purpose={item.purpose} />
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{item.department ?? "-"}</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{item.quantity ?? "-"}</td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {getAssetOnlyValue(item, "serialNumber")}
                        </td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {item.purchaseDate || "-"}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                          {item.unitPrice ?? "-"}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={getStockStatus(item)} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="px-4 py-10 text-center text-gray-400">
                        No items found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}