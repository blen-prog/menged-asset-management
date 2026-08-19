import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
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

export default function Reports({
  items,
}: {
  items: InventoryItem[];
}) {
  // ======================================================
  // HELPERS
  // ======================================================

  const formatCurrency = (value: number) => {
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

  const shortenCategory = (name: string) => {
    const map: Record<string, string> = {
      "Computer Equipment": "Computers",
      "Networking Equipment": "Network",
      "Office Equipment": "Office",
      "Safety Equipment": "Safety",
      "Vehicle Consumables": "Vehicle",
    };

    return map[name] || name;
  };

  const getPrice = (price: unknown) =>
    Number(
      String(price)
        .replace(/,/g, "")
        .replace("ETB", "")
        .trim()
    ) || 0;

  // ======================================================
  // INVENTORY CALCULATIONS
  // ======================================================

  const totalInventoryValue = items.reduce(
    (sum, item) =>
      sum +
      Number(item.quantity) *
        getPrice(item.unitPrice),
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
      sum +
      Number(item.quantity) *
        getPrice(item.unitPrice),
    0
  );

  // ======================================================
  // CURRENT YEAR SPENDING
  // ======================================================

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

  // ======================================================
  // ASSETS
  // ======================================================

  const totalAssets = assetItems.length;

  const totalInventoryItems = items.reduce(
    (sum, item) =>
      sum + Number(item.quantity),
    0
  );

  const totalAssetQuantity = assetItems.reduce(
    (sum, item) =>
      sum + Number(item.quantity),
    0
  );

  const assignedAssets = assetItems.filter(
    (item) =>
      item.assetStatus === "Assigned"
  ).length;

  const assetUtilization =
    totalAssets === 0
      ? 0
      : (assignedAssets / totalAssets) * 100;

  // ======================================================
  // CATEGORY DATA
  // ======================================================

  const categoryData = Object.values(
    items.reduce(
      (acc, item) => {
        const value =
          Number(item.quantity) *
          getPrice(item.unitPrice);

        if (!acc[item.category]) {
          acc[item.category] = {
            name: item.category,
            value: 0,
          };
        }

        acc[item.category].value += value;

        return acc;
      },
      {} as Record<string, ReportDatum>
    )
  );

  // ======================================================
  // DEPARTMENT DATA
  // ======================================================

  const departmentData = Object.values(
    items.reduce(
      (acc, item) => {
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
      },
      {} as Record<string, ReportDatum>
    )
  );

  const totalDepartmentValue =
    departmentData.reduce(
      (sum, dept) =>
        sum + dept.value,
      0
    );

  // ======================================================
  // ASSET DEPARTMENT DATA
  // ======================================================

  const assetDepartmentData =
    Object.values(
      assetItems.reduce(
        (acc, item) => {
          const value =
            Number(item.quantity) *
            getPrice(item.unitPrice);

          if (!acc[item.department]) {
            acc[item.department] = {
              name: item.department,
              value: 0,
            };
          }

          acc[item.department].value +=
            value;

          return acc;
        },
        {} as Record<string, ReportDatum>
      )
    ).sort(
      (a, b) => b.value - a.value
    );

  // ======================================================
  // TOP ASSETS
  // ======================================================

  const topAssetsData = assetItems
    .map((item) => ({
      name: item.name,
      value:
        Number(item.quantity) *
        getPrice(item.unitPrice),
    }))
    .sort(
      (a, b) => b.value - a.value
    )
    .slice(0, 5);

  // ======================================================
  // YEARLY SPENDING
  // ======================================================

  const yearlyTotals = items.reduce(
    (acc, item) => {
      if (!item.purchaseDate) return acc;

      const year = new Date(
        item.purchaseDate
      ).getFullYear();

      const value =
        Number(item.quantity) *
        getPrice(item.unitPrice);

      acc[year] =
        (acc[year] || 0) + value;

      return acc;
    },
    {} as Record<number, number>
  );

  const years = Object.keys(yearlyTotals)
    .map(Number)
    .sort((a, b) => a - b);

  const minYear = years[0];
  const maxYear =
    years[years.length - 1];

  const yearData =
    years.length > 0
      ? Array.from(
          {
            length:
              maxYear - minYear + 1,
          },
          (_, index) => {
            const year =
              minYear + index;

            return {
              year: String(year),
              value:
                yearlyTotals[year] || 0,
            };
          }
        )
      : [];

  // ======================================================
  // LOW STOCK
  // ======================================================

  const lowStockItems = items.filter(
    (item) =>
      Number(item.quantity) <
      Number(item.minimumStock)
  );

  const restockingCost =
    lowStockItems.reduce(
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

  // ======================================================
  // CHART COLORS
  // ======================================================

  const COLORS = [
    "#2563eb",
    "#16a34a",
    "#eab308",
    "#9333ea",
    "#ea580c",
    "#dc2626",
  ];

  const maxCategoryValue =
    categoryData.length > 0
      ? Math.max(
          ...categoryData.map(
            (c) => c.value
          )
        )
      : 0;

  const yAxisMax =
    maxCategoryValue > 0
      ? Math.ceil(
          maxCategoryValue / 500000
        ) * 500000
      : 500000;

  // ======================================================
  // COMMON RECHART STYLES
  // ======================================================

  const axisTick = {
    fontSize: 13,
    fontWeight: 500,
    fill: "#6b7280",
  };

  const darkAxisTick = {
    fontSize: 13,
    fontWeight: 500,
    fill: "#9ca3af",
  };

  // ======================================================
  // RETURN
  // ======================================================

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 space-y-6 transition-colors">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Reports & Analytics
        </h1>

        <p className="text-gray-500 dark:text-gray-400">
          Inventory and financial insights
        </p>
      </div>

      {/* ================================================= */}
      {/* KPI CARDS */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

        {/* Asset Value */}

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Asset Value
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {formatCurrency(
              totalAssetValue
            )}
          </h2>
        </div>

        {/* Consumable Cost */}

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Consumable Cost
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {formatCurrency(
              totalConsumableValue
            )}
          </h2>
        </div>

        {/* Total Inventory */}

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Total Inventory Value
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {formatCurrency(
              totalInventoryValue
            )}
          </h2>
        </div>

        {/* Current Year */}

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Current Year Spending
          </p>

          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
            {formatCurrency(
              currentYearSpending
            )}
          </h2>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {currentYear}
          </p>
        </div>

        {/* Total Assets */}

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Total Assets
          </p>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {totalAssets}
          </h2>

          <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-2">
            Qty: {totalAssetQuantity}
          </p>
        </div>

        {/* Utilization */}

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Asset Utilization
          </p>

          <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            {assetUtilization.toFixed(
              0
            )}
            %
          </h2>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {assignedAssets} of{" "}
            {totalAssets} assigned
          </p>
        </div>
      </div>

      {/* ================================================= */}
      {/* CATEGORY + DEPARTMENT */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* CATEGORY VALUE */}

        <div className="xl:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 min-h-[550px] shadow-sm">

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Value By Category
          </h2>

          <ResponsiveContainer
            width="100%"
            height={380}
          >
            <BarChart
              data={categoryData}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.25}
              />

              <XAxis
                dataKey="name"
                tickFormatter={
                  shortenCategory
                }
                interval={0}
                tick={axisTick}
              />

              <YAxis
                domain={[
                  0,
                  yAxisMax,
                ]}
                width={140}
                tick={axisTick}
                tickFormatter={(value) =>
                  `ETB ${Number(
                    value
                  ).toLocaleString()}`
                }
              />

              <Tooltip
                contentStyle={{
                  backgroundColor:
                    "#111827",
                  border:
                    "1px solid #374151",
                  borderRadius: "10px",
                  color: "#fff",
                }}
                labelStyle={{
                  color: "#fff",
                }}
                formatter={(value) => [
                  `ETB ${Number(
                    value
                  ).toLocaleString()}`,
                  "Value",
                ]}
              />

              <Bar
                dataKey="value"
                fill="#2563eb"
                radius={[
                  4, 4, 0, 0,
                ]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* DEPARTMENT VALUE */}

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Value By Department
          </h2>

          <ResponsiveContainer
            width="100%"
            height={220}
          >
            <PieChart>
              <Pie
                data={departmentData}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={90}
              >
                {departmentData.map(
                  (entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor:
                    "#111827",
                  border:
                    "1px solid #374151",
                  borderRadius: "10px",
                  color: "#fff",
                }}
                formatter={(value) => [
                  `ETB ${Number(
                    value
                  ).toLocaleString()}`,
                  "Department Value",
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-3">

            {departmentData.map(
              (dept, index) => (
                <div
                  key={dept.name}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex items-center gap-2 min-w-0">

                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor:
                          COLORS[
                            index %
                              COLORS.length
                          ],
                      }}
                    />

                    <span className="text-gray-700 dark:text-gray-300 truncate">
                      {dept.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 ml-3">

                    <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {formatCurrency(
                        dept.value
                      )}
                    </span>

                    <span className="text-gray-500 dark:text-gray-400 w-12 text-right">
                      {totalDepartmentValue ===
                      0
                        ? "0.0"
                        : (
                            (dept.value /
                              totalDepartmentValue) *
                            100
                          ).toFixed(1)}
                      %
                    </span>

                  </div>
                </div>
              )
            )}

          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* TOP ASSETS + ASSET DEPARTMENT */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* TOP ASSETS */}

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
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
                stroke="#374151"
                opacity={0.25}
              />

              <XAxis
                type="number"
                tickFormatter={
                  formatCurrency
                }
                tick={axisTick}
              />

              <YAxis
                type="category"
                dataKey="name"
                width={160}
                tick={axisTick}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor:
                    "#111827",
                  border:
                    "1px solid #374151",
                  borderRadius: "10px",
                  color: "#fff",
                }}
                formatter={(value) => [
                  formatCurrency(
                    Number(value)
                  ),
                  "Asset Value",
                ]}
              />

              <Bar
                dataKey="value"
                fill="#d61818"
                radius={[
                  0, 4, 4, 0,
                ]}
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ASSET VALUE BY DEPARTMENT */}

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Asset Value by Department
          </h2>

          <ResponsiveContainer
            width="100%"
            height={250}
          >
            <BarChart
              data={
                assetDepartmentData
              }
              layout="vertical"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.25}
              />

              <XAxis
                type="number"
                tickFormatter={
                  formatCurrency
                }
                tick={axisTick}
              />

              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={axisTick}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor:
                    "#111827",
                  border:
                    "1px solid #374151",
                  borderRadius: "10px",
                  color: "#fff",
                }}
                formatter={(value) => [
                  formatCurrency(
                    Number(value)
                  ),
                  "Asset Value",
                ]}
              />

              <Bar
                dataKey="value"
                fill="#2563eb"
                barSize={26}
                radius={[
                  0, 4, 4, 0,
                ]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================================================= */}
      {/* SPENDING TREND */}
      {/* ================================================= */}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Spending Trend
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Purchase spending trend over
          time (ETB)
        </p>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <AreaChart
            data={yearData}
          >
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
                  stopOpacity={0.25}
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
              stroke="#374151"
              opacity={0.3}
            />

            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={{
                stroke: "#6b7280",
                strokeWidth: 1.5,
              }}
              tick={axisTick}
            />

            <YAxis
              width={90}
              domain={[0, "auto"]}
              tickFormatter={
                formatCurrency
              }
              tickLine={false}
              axisLine={{
                stroke: "#6b7280",
                strokeWidth: 1.5,
              }}
              tick={axisTick}
            />

            <Tooltip
              contentStyle={{
                backgroundColor:
                  "#111827",
                border:
                  "1px solid #374151",
                borderRadius: "10px",
                color: "#fff",
              }}
              formatter={(value) => [
                formatCurrency(
                  Number(value)
                ),
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
                fill: "#111827",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ================================================= */}
      {/* INVENTORY ALERTS */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* LOW STOCK */}

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">

          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Low Stock Items
          </p>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {lowStockItems.length}
          </h2>

        </div>

        {/* RESTOCKING COST */}

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">

          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Restocking Cost
          </p>

          <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
            {formatCurrency(
              restockingCost
            )}
          </h2>

        </div>
      </div>
    </div>
  );
}