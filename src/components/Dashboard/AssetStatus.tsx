import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import type { InventoryItem } from "../../types/models";

interface AssetStatusProps {
  items: InventoryItem[];
}

export default function AssetStatus({ items }: AssetStatusProps) {
  const assetItems = items.filter(
  (item) => item.type === "Asset"
);

const data = [
  {
    name: "Assigned",
    value: assetItems.filter(
      (item) => item.assetStatus === "Assigned"
    ).length,
    color: "#2563EB",
  },
  {
    name: "Available",
    value: assetItems.filter(
      (item) => item.assetStatus === "Available"
    ).length,
    color: "#22C55E",
  },
  {
    name: "Maintenance",
    value: assetItems.filter(
      (item) => item.assetStatus === "Maintenance"
    ).length,
    color: "#F59E0B",
  },
  {
    name: "Retired",
    value: assetItems.filter(
      (item) => item.assetStatus === "Retired"
    ).length,
    color: "#94A3B8",
  },
];

  const total = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Asset Status
      </h2>

      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Distribution across assets
      </p>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={25}
              outerRadius={55}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 mt-2">
        {data.map((item) => (
          <div
  key={item.name}
  className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300"
>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: item.color,
                }}
              />

              <span>{item.name}</span>
            </div>

            <span className="font-semibold text-gray-900 dark:text-white">
              {total === 0 ? "0.0" : ((item.value / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}