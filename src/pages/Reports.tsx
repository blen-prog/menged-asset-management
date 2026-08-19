import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { InventoryItem } from "../types/models";

interface ReportDatum {
  name: string;
  value: number;
}

export default function Reports({ items }: { items: InventoryItem[] }) {
  const formatCurrency = (value) => {
  if (value >= 1_000_000_000) {
    return `ETB ${(value / 1_000_000_000).toFixed(2)}B`;
  }

  if (value >= 1_000_000) {
    return `ETB ${(value / 1_000_000).toFixed(2)}M`;
  }

  if (value >= 1_000) {
    return `ETB ${(value / 1_000).toFixed(1)}K`;
  }

  return `ETB ${value.toLocaleString()}`;
};

  const shortenCategory = (name) => {
  const map = {
    "Computer Equipment": "Computers",
    "Networking Equipment": "Network",
    "Office Equipment": "Office",
    "Safety Equipment": "Safety",
    "Vehicle Consumables": "Vehicle",
  };

  return map[name] || name;
};
  const getPrice = (price) =>
  Number(
    String(price)
      .replace(/,/g, "")
      .replace("ETB", "")
      .trim()
  ) || 0;
  const totalInventoryValue = items.reduce(
    (sum, item) =>
      sum + Number(item.quantity) * getPrice(item.unitPrice),
    0
  );

  const assetItems = items.filter(
    (item) => item.type === "Asset"
  );
  const consumableItems = items.filter(
  (item) => item.type === "Consumable"
);
const totalConsumableValue =
  consumableItems.reduce(
    (sum, item) =>
      sum +
      Number(item.quantity) *
        getPrice(item.unitPrice),
    0
  );

  const totalAssetValue = assetItems.reduce(
    (sum, item) =>
      sum + Number(item.quantity) * getPrice(item.unitPrice),
    0
  );
  const currentYear = new Date().getFullYear();

const currentYearSpending = items
  .filter((item) => {
    if (!item.purchaseDate) return false;

    const purchaseYear = new Date(
      item.purchaseDate
    ).getFullYear();

    return purchaseYear === currentYear;
  })
  .reduce((sum, item) => {
    return (
      sum +
      Number(item.quantity) *
        getPrice(item.unitPrice)
    );
  }, 0);

  const totalAssets = assetItems.length;

  const totalInventoryItems = items.reduce(
    (sum, item) => sum + Number(item.quantity),
    0
  );

  const categoryData = Object.values(
    items.reduce((acc, item) => {
      const value =
        Number(item.quantity) * getPrice(item.unitPrice);

      if (!acc[item.category]) {
        acc[item.category] = {
          name: item.category,
          value: 0,
        };
      }

      acc[item.category].value += value;

      return acc;
    }, {} as Record<string, ReportDatum>)
  );

  const departmentData = Object.values(
    items.reduce((acc, item) => {
      const value =
        Number(item.quantity) * getPrice(item.unitPrice);

      if (!acc[item.department]) {
        acc[item.department] = {
          name: item.department,
          value: 0,
        };
      }

      acc[item.department].value += value;

      return acc;
    }, {} as Record<string, ReportDatum>)
  );
  const totalDepartmentValue =
  departmentData.reduce(
    (sum, dept) => sum + dept.value,
    0
  );
  const assetDepartmentData = Object.values(
  assetItems.reduce((acc, item) => {
    const value =
      Number(item.quantity) *
      getPrice(item.unitPrice);

    if (!acc[item.department]) {
      acc[item.department] = {
        name: item.department,
        value: 0,
      };
    }

    acc[item.department].value += value;

    return acc;
  }, {} as Record<string, ReportDatum>)
).sort((a, b) => b.value - a.value);


const topAssetsData = assetItems
  .map((item) => ({
    name: item.name,
    value:
      Number(item.quantity) *
      getPrice(item.unitPrice),
  }))
  .sort((a, b) => b.value - a.value)
  .slice(0, 5);


 const assignedAssets = assetItems.filter(
  (item) => item.assetStatus === "Assigned"
).length;

const assetUtilization =
  totalAssets === 0
    ? 0
    : (assignedAssets / totalAssets) * 100;


    const totalAssetQuantity = assetItems.reduce(
  (sum, item) => sum + Number(item.quantity),
  0
);



 const yearlyTotals = items.reduce((acc, item) => {
  if (!item.purchaseDate) return acc;

  const year = new Date(
    item.purchaseDate
  ).getFullYear();

  const value =
    Number(item.quantity) *
    getPrice(item.unitPrice);

  acc[year] = (acc[year] || 0) + value;

  return acc;
}, {});

const years = Object.keys(yearlyTotals)
  .map(Number)
  .sort((a, b) => a - b);

const minYear = years[0];
const maxYear = years[years.length - 1];

const yearData = [];

for (let year = minYear; year <= maxYear; year++) {
  yearData.push({
    year: String(year),
    value: yearlyTotals[year] || 0,
  });
}



  const lowStockItems = items.filter(
    (item) =>
      Number(item.quantity) <
      Number(item.minimumStock)
  );

  const restockingCost = lowStockItems.reduce(
    (sum, item) => {
      return (
        sum +
        (Number(item.minimumStock) -
          Number(item.quantity)) *
          getPrice(item.unitPrice)
      );
    },
    0
  );

  const COLORS = [
    "#2563eb",
    "#16a34a",
    "#eab308",
    "#9333ea",
    "#ea580c",
    "#dc2626",
  ];
  const maxCategoryValue = Math.max(
  ...categoryData.map((c) => c.value)
);

const yAxisMax =
  Math.ceil(maxCategoryValue / 500000) *
  500000;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Reports & Analytics
        </h1>

        <p className="text-gray-500">
          Inventory and financial insights
        </p>
      </div>

      {/* KPI Cards */}

      <div className="grid grid-cols-6 gap-4">
       <div className="bg-white rounded-2xl border p-5">
  <p className="text-gray-500 text-sm">
    Asset Value
  </p>

  <h2 className="text-3xl font-bold">
    ETB {totalAssetValue.toLocaleString()}
  </h2>
</div>
        <div className="bg-white rounded-2xl border p-5">
  <p className="text-gray-500 text-sm">
    Consumable Cost
  </p>

  <h2 className="text-3xl font-bold">
    ETB {totalConsumableValue.toLocaleString()}
  </h2>
</div>


        <div className="bg-white rounded-2xl border p-5">
          <p className="text-gray-500 text-sm">
            Total Inventory Value
          </p>

          <h2 className="text-3xl font-bold">
            ETB {totalInventoryValue.toLocaleString()}
          </h2>
        </div>
        <div className="bg-white rounded-2xl border p-5">
  <p className="text-gray-500 text-sm">
    Current Year Spending
  </p>

  <h2 className="text-3xl font-bold text-green-600">
    ETB {currentYearSpending.toLocaleString()}
  </h2>

  <p className="text-xs text-gray-400 mt-1">
    {currentYear}
  </p>
</div>

        <div className="bg-white rounded-2xl border p-5">
  <p className="text-gray-500 text-sm">
    Total Assets
  </p>

  <h2 className="text-3xl font-bold">
    {totalAssets}
  </h2>

  <p className="text-xl font-bold text-gray-500 mt-2">
  Qty: {totalAssetQuantity}
</p>
</div>

        <div className="bg-white rounded-2xl border p-5">
          <p className="text-gray-500 text-sm">
  Asset Utilization
</p>

<h2 className="text-3xl font-bold text-blue-600">
  {assetUtilization.toFixed(0)}%
</h2>

<p className="text-xs text-gray-400 mt-1">
  {assignedAssets} of {totalAssets} assigned
</p>
        </div>
      </div>

      {/* Charts */}

      <div className="grid grid-cols-3 gap-6">

  {/* Category Value */}

  <div className="col-span-2 bg-white rounded-2xl border p-5 min-h-[550px]">
    <h2 className="text-lg font-semibold mb-4">
      Value By Category
    </h2>

    <ResponsiveContainer width="100%" height={380}>
      <BarChart data={categoryData}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
  dataKey="name"
  tickFormatter={shortenCategory}
  interval={0}
  tick={{
    fontSize: 14,
    fontWeight: 600,
    fill: "#374151",
  }}
/>


        <YAxis
  domain={[0, yAxisMax]}
  width={140}
  tick={{
    fontSize: 14,
    fontWeight: 600,
    fill: "#374151",
  }}
  tickFormatter={(value) =>
    `ETB ${Number(value).toLocaleString()}`
  }
/>

        <Tooltip
  formatter={(value) => [
    `ETB ${Number(value).toLocaleString()}`,
    "Value",
  ]}
/>

        <Bar
          dataKey="value"
          fill="#2563eb"
        />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Department Value */}

<div className="col-span-1 bg-white rounded-2xl border p-5">
  <h2 className="text-lg font-semibold mb-4">
    Value By Department
  </h2>

  <ResponsiveContainer width="100%" height={220}>
    <PieChart>
      <Pie
        data={departmentData}
        dataKey="value"
        nameKey="name"
        innerRadius={55}
        outerRadius={90}
      >
        {departmentData.map((entry, index) => (
          <Cell
            key={index}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>

      <Tooltip
        formatter={(value) => [
          `ETB ${Number(value).toLocaleString()}`,
          "Department Value",
        ]}
      />
    </PieChart>
  </ResponsiveContainer>

  <div className="mt-4 space-y-2">
    {departmentData.map((dept, index) => (
      <div
        key={dept.name}
        className="flex justify-between items-center text-lg"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor:
                COLORS[index % COLORS.length],
            }}
          />

          <span>{dept.name}</span>
        </div>

        <div className="flex items-center gap-6">
  <span className="font-medium text-base">
    ETB {dept.value.toLocaleString()}
  </span>

  <span className="text-base text-gray-600 w-14 text-right">
    {(
      (dept.value / totalDepartmentValue) *
      100
    ).toFixed(1)}
    %
  </span>
</div>
      </div>
    ))}
  </div>
</div>
</div>
<div className="grid grid-cols-2 gap-6">
<div className="bg-white rounded-2xl border p-5">
  <h2 className="text-lg font-semibold mb-4">
    Top 5 Most Valuable Assets
  </h2>

  <ResponsiveContainer
    width="100%"
    height={300}
  >
    <BarChart
      data={topAssetsData}
      layout="vertical"
    >
      <CartesianGrid
        strokeDasharray="3 3"
        horizontal={false}
      />

      <XAxis
        type="number"
        tickFormatter={formatCurrency}
      />

      <YAxis
        type="category"
        dataKey="name"
        width={160}
        tick={{
          fontSize: 14,
          fontWeight: 600,
          fill: "#374151",
        }}
      />

      <Tooltip
        formatter={(value) => [
          formatCurrency(value),
          "Asset Value",
        ]}
      />

      <Bar
        dataKey="value"
        fill="#d61818"
        radius={[0, 4, 4, 0]}
        barSize={18}
      />
    </BarChart>
  </ResponsiveContainer>
</div>

<div className="bg-white rounded-2xl border p-5">
  <h2 className="text-lg font-semibold mb-4">
    Asset Value by Department
  </h2>

  <ResponsiveContainer
    width="100%"
    height={250}
  >
    <BarChart
      data={assetDepartmentData}
      layout="vertical"
    >
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis
        type="number"
        tickFormatter={formatCurrency}
      />

      <YAxis
  type="category"
  dataKey="name"
  width={120}
  tick={{
    fontSize: 15,
    fontWeight: 600,
    fill: "#374151",
  }}
/>

      <Tooltip
        formatter={(value) => [
          formatCurrency(value),
          "Asset Value",
        ]}
      />

      <Bar
  dataKey="value"
  fill="#2563eb"
  barSize={26}
  radius={[0, 4, 4, 0]}
/>
    </BarChart>
  </ResponsiveContainer>
</div>
</div>

<div className="bg-white rounded-2xl border p-5">
  <h2 className="text-lg font-semibold">
    Spending Trend
  </h2>

  <p className="text-sm text-gray-500 mb-4">
    Purchase spending trend over time (ETB)
  </p>

  <ResponsiveContainer
    width="100%"
    height={350}
  >
    <AreaChart data={yearData}>
      <defs>
        <linearGradient
          id="redGradient"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="#ef4444"
            stopOpacity={0.18}
          />
          <stop
            offset="100%"
            stopColor="#ef4444"
            stopOpacity={0.02}
          />
        </linearGradient>
      </defs>

      <CartesianGrid
        strokeDasharray="3 3"
        vertical={false}
        stroke="#e5e7eb"
      />

      <XAxis
  dataKey="year"
  tickLine={false}
  axisLine={{
    stroke: "#9ca3af",
    strokeWidth: 1.5,
  }}
  tick={{
    fill: "#4b5563",
    fontSize: 13,
    fontWeight: 500,
  }}
/>

<YAxis
  width={90}
  domain={[0, "auto"]}
  tickFormatter={formatCurrency}
  tickLine={false}
  axisLine={{
    stroke: "#9ca3af",
    strokeWidth: 1.5,
  }}
  tick={{
    fill: "#4b5563",
    fontSize: 13,
    fontWeight: 500,
  }}
/>

      <Tooltip
        formatter={(value) => [
          formatCurrency(value),
          "Spending",
        ]}
      />

      <Area
        type="monotone"
        dataKey="value"
        stroke="#ef4444"
        strokeWidth={3}
        fill="url(#redGradient)"
        dot={false}
        activeDot={{
          r: 6,
          stroke: "#ef4444",
          strokeWidth: 2,
          fill: "#fff",
        }}
      />
    </AreaChart>
  </ResponsiveContainer>
</div>


     

      {/* Inventory Alerts */}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border p-5">
          <p className="text-gray-500 text-sm">
            Low Stock Items
          </p>

          <h2 className="text-3xl font-bold">
            {lowStockItems.length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl border p-5">
          <p className="text-gray-500 text-sm">
            Restocking Cost
          </p>

          <h2 className="text-3xl font-bold text-red-600">
            ETB {restockingCost.toLocaleString()}
          </h2>
        </div>
      </div>
    </div>
  );
}