import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function InventoryChart() {
  const data = [
    { name: "Computers", value: 85 },
    { name: "Validators", value: 40 },
    { name: "Ticket", value: 55 },
    { name: "Network", value: 22 },
    { name: "Spare Parts", value: 210 },
    { name: "Stationery", value: 350 },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-base font-semibold">
            Inventory by Category
          </h2>

          <p className="text-xs text-gray-500">
            Total stock units per category
          </p>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
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