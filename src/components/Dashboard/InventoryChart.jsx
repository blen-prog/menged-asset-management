import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function InventoryChart({ items }) {
const assetItems = items.filter(
  (item) => item.type === "Asset"
);

const data = Object.values(
  assetItems.reduce((acc, item) => {
    const shortNames = {
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
        value: 0,
      };
    }

    acc[category].value += Number(item.quantity);

    return acc;
  }, {})
);




  return (
    <div className="bg-white rounded-2xl p-5 border shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-base font-semibold">
            Assets by Category
          </h2>

          <p className="text-xs text-gray-500">
            Total asset units per category
          </p>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
  dataKey="name"
  interval={0}
  fontSize={14}
/>
            <YAxis />
            <Bar
               dataKey="value"
               fill="#2563EB"
               barSize={22}
               />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}