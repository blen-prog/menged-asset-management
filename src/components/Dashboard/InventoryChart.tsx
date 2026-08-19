import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { InventoryItem } from "../../types/models";

interface InventoryChartProps {
  items: InventoryItem[];
}

interface CategoryCount {
  name: string;
  assetCount: number;
}

export default function InventoryChart({ items }: InventoryChartProps) {
const assetItems = items.filter(
  (item) => item.type === "Asset"
);

const data = Object.values(
  assetItems.reduce((acc, item) => {
    const shortNames: Record<string, string> = {
      "Computer Equipment": "Computer Equipment",
      "Office Equipment": "Office Equipment",
      "Networking Equipment": "Network Equipment",
      "Vehicle Consumables": "Vehicle ",
      "Safety Equipment": "Safety Equipment",
      "Spare Parts": "Spare Parts",
      "Validators": "Validators",
      "Stationery": "Stationery",
    };


    const category = shortNames[item.category] || item.category;

    if (!acc[category]) {
  acc[category] = {
    name: category,
    assetCount: 0,
  };
}

acc[category].assetCount += 1;

return acc;
  }, {} as Record<string, CategoryCount>)
);




  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
       <p className="text-xl font-bold text-gray-900 dark:text-white">
  Total asset items grouped by category
</p>

          <p className="text-lg text-gray-500 dark:text-gray-400">
            Total asset per category
          </p>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
  <CartesianGrid
  strokeDasharray="3 3"
  stroke="#374151"
/>

  <XAxis
  dataKey="name"
  interval={0}
  fontSize={14}
  tick={{ fill: "#9CA3AF" }}
/>

  <YAxis
  tick={{ fill: "#9CA3AF" }}
/>

  <Tooltip
  formatter={(value) => [value, "Asset Count"]}
  contentStyle={{
    backgroundColor: "#1F2937",
    border: "1px solid #374151",
    borderRadius: "8px",
    color: "#fff",
  }}
/>


  <Bar
  dataKey="assetCount"
  fill="#2563EB"
  barSize={22}
/>
</BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}