import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { usersData } from "../data/usersData";
import { inventoryItems } from "../data/inventoryData";
import { Wallet } from "lucide-react";
import {
  Search,
  Plus,
  ArrowUpRight,
  RotateCcw,
  Wrench,
  ClipboardList,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
} from "lucide-react";

import TransactionDetails from "../components/TransactionDetails";



export default function Transactions({
  transactions,
  setTransactions,
  items,
})  {
    console.log(transactions);



const getEmployee = (employeeId) =>
  usersData.find((user) => user.id === employeeId);

const getAsset = (assetId) =>
  items.find(
    (asset) => asset.id === assetId
  );

const user = JSON.parse(
  sessionStorage.getItem("user")
);

const canCreateTransaction =
  user?.role === "Administrator" ||
  user?.role === "Purchasing Manager";

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const [searchParams] =
  useSearchParams();

  const [currentPage, setCurrentPage] =
    useState(1);

  useEffect(() => {
  const filterParam =
    searchParams.get("filter");

  if (filterParam) {
    setFilter(filterParam);
  }
}, [searchParams]);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [selectedTransaction, setSelectedTransaction] =
    useState(null);


  const transactionsPerPage = 10;


  // ======================================================
  // NEW TRANSACTION
  // ======================================================

  const [newTransaction, setNewTransaction] = useState({
  assetId: "",
  employeeId: "",

  type: "Assignment",

  date: "",
  time: "",
  cost: 0,
  recordedBy: "Admin",

  status: "Completed",

  assetStatus: "Assigned",

  condition: "Good",

  notes: "",
});



  // ======================================================
  // STAT COUNTS
  // ======================================================

  const totalCost = transactions.reduce(
  (sum, transaction) => sum + (transaction.cost || 0),
  0
);

  const assignmentCount =
    transactions.filter(
      (item) => item.type === "Assignment"
    ).length;

  const returnCount =
    transactions.filter(
      (item) => item.type === "Return"
    ).length;

  const maintenanceCount =
    transactions.filter(
      (item) => item.type === "Maintenance"
    ).length;

  const disposalCount =
    transactions.filter(
      (item) => item.type === "Disposal"
    ).length;
    const purchaseCount =
  transactions.filter(
    (item) => item.type === "Purchase"
  ).length;


  // ======================================================
  // FILTER TRANSACTIONS
  // ======================================================

  const filteredTransactions =
    transactions.filter((transaction) => {

      const searchValue =
        search.toLowerCase().trim();


      const asset = getAsset(transaction.assetId);
const employee = getEmployee(transaction.employeeId);

const matchesSearch =
  transaction.id
    .toLowerCase()
    .includes(searchValue) ||

  transaction.assetId
    .toLowerCase()
    .includes(searchValue) ||

  (asset?.name || "")
  .toLowerCase()
  .includes(searchValue) ||

(employee?.name || "")
  .toLowerCase()
  .includes(searchValue);


      const matchesFilter =
        filter === "All" ||
        transaction.type === filter;


      return (
        matchesSearch &&
        matchesFilter
      );
    });


  // ======================================================
  // PAGINATION
  // ======================================================

  const totalPages = Math.ceil(
    filteredTransactions.length /
      transactionsPerPage
  );


  const startIndex =
    (currentPage - 1) *
    transactionsPerPage;


  const currentTransactions =
    filteredTransactions.slice(
      startIndex,
      startIndex + transactionsPerPage
    );


  // ======================================================
  // SEARCH HANDLER
  // ======================================================

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };


  // ======================================================
  // FILTER HANDLER
  // ======================================================

  const handleFilter = (value) => {
    setFilter(value);
    setCurrentPage(1);
  };


  // ======================================================
  // STAT CARD CLICK
  // ======================================================

  const handleStatClick = (type) => {

    if (filter === type) {
      setFilter("All");
    } else {
      setFilter(type);
    }

    setCurrentPage(1);
  };


  // ======================================================
  // ADD TRANSACTION
  // ======================================================

  const handleAddTransaction = (e) => {

    e.preventDefault();


    if (
  !newTransaction.assetId ||
  !newTransaction.employeeId ||
  !newTransaction.date ||
  !newTransaction.time
) {
      return;
    }


    const transaction = {

      id: `TRX-${String(
        transactions.length + 1
      ).padStart(3, "0")}`,

      ...newTransaction,

      date: new Date(
        newTransaction.date
      ).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      ),
    };


    setTransactions([
      transaction,
      ...transactions,
    ]);


    setNewTransaction({
  assetId: "",
  employeeId: "",

  type: "Assignment",

  date: "",
  time: "",
  cost: 0,

  recordedBy: "Admin",

  status: "Completed",

  assetStatus: "Assigned",

  condition: "Good",

  notes: "",
});


    setShowAddModal(false);

    setCurrentPage(1);
  };


  // ======================================================
  // TYPE ICON
  // ======================================================

  const getTypeIcon = (type) => {
  switch (type) {
    case "Purchase":
      return <Plus size={14} />;

    case "Assignment":
      return <ArrowUpRight size={14} />;

    case "Return":
      return <RotateCcw size={14} />;

    case "Maintenance":
      return <Wrench size={14} />;

    case "Disposal":
      return <ClipboardList size={14} />;

    default:
      return null;
  }
};


  // ======================================================
  // TYPE STYLE
  // ======================================================

  const getTypeStyle = (type) => {

    switch (type) {
        case "Purchase":
  return "bg-indigo-50 text-indigo-700 border border-indigo-100";

      case "Assignment":
        return "bg-blue-50 text-blue-700 border border-blue-100";

      case "Return":
        return "bg-green-50 text-green-700 border border-green-100";

      case "Maintenance":
        return "bg-amber-50 text-amber-700 border border-amber-100";

      // Disposal is NEUTRAL, not red
      case "Disposal":
        return "bg-gray-100 text-gray-600 border border-gray-200";

      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };


  // ======================================================
  // STATUS STYLE
  // ======================================================

  const getStatusStyle = (status) => {

    if (status === "Completed") {
      return "bg-green-50 text-green-700";
    }

    if (status === "In Progress") {
      return "bg-amber-50 text-amber-700";
    }

    return "bg-gray-100 text-gray-600";
  };


  // ======================================================
  // STAT CARD
  // ======================================================

  const StatCard = ({
    title,
    count,
    description,
    type,
  }) => {

    const active =
      filter === type;


    return (
      <button
        onClick={() =>
          handleStatClick(type)
        }
        className={`text-left w-full rounded-xl p-5 border shadow-sm transition-all cursor-pointer
          ${
            active
              ? "border-blue-400 ring-2 ring-blue-100 bg-blue-50/40"
              : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-md"
          }
        `}
      >

        <div className="flex items-start justify-between">

          <div>

            <p className="text-sm text-gray-500">
              {title}
            </p>

            <h2 className="text-2xl font-bold text-gray-800 mt-2">
              {count}
            </h2>

          </div>

          <span
            className={`text-lg ${
              active
                ? "text-blue-600"
                : "text-gray-300"
            }`}
          >
            →
          </span>

        </div>

        <p
          className={`text-xs mt-2 ${
            active
              ? "text-blue-600"
              : "text-gray-500"
          }`}
        >
          {active
            ? "Showing filtered results"
            : description}
        </p>

      </button>
    );
  };


  // ======================================================
  // RENDER
  // ======================================================

  return (

    <div className="min-h-screen bg-gray-50 p-6">


      {/* ================================================== */}
      {/* HEADER */}
      {/* ================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>

          <h1 className="text-2xl font-bold text-gray-800">
            Transactions
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Track asset assignments, returns, maintenance and disposals
          </p>

        </div>


        {canCreateTransaction && (
  <button
    onClick={() =>
      setShowAddModal(true)
    }
    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
  >
    <Plus size={18} />
    New Transaction
  </button>
)}

      </div>


      {/* ================================================== */}
      {/* STAT CARDS */}
      {/* ================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">

        <StatCard
          title="Assignments"
          count={assignmentCount}
          description="Assets assigned to employees"
          type="Assignment"
        />

        <StatCard
          title="Returns"
          count={returnCount}
          description="Assets returned to inventory"
          type="Return"
        />

        <StatCard
          title="Maintenance"
          count={maintenanceCount}
          description="Assets under maintenance"
          type="Maintenance"
        />

        <StatCard
          title="Disposals"
          count={disposalCount}
          description="Assets removed from inventory"
          type="Disposal"
        />
        <StatCard
  title="Purchases"
  count={purchaseCount}
  description="Assets added to inventory"
  type="Purchase"
/>

<div className="bg-black rounded-xl p-5 shadow-lg">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-300">
        Total Cost
      </p>

      <h2 className="text-3xl font-bold text-white mt-2">
        ETB {totalCost.toLocaleString()}
      </h2>
    </div>

    <div className="p-3 rounded-xl bg-white/10">
      <Wallet
        size={24}
        className="text-white"
      />
    </div>
  </div>

  <p className="text-xs text-gray-400 mt-3">
    Total value of all recorded transactions
  </p>
</div>

      </div>


      {/* ================================================== */}
      {/* SEARCH / FILTER */}
      {/* ================================================== */}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5">

        <div className="flex flex-col md:flex-row gap-3">

          {/* SEARCH */}

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) =>
                handleSearch(e.target.value)
              }
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

          </div>


          {/* FILTER */}

          <div className="relative">

            <Filter
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />

            <select
              value={filter}
              onChange={(e) =>
                handleFilter(e.target.value)
              }
              className="appearance-none w-full md:w-48 pl-9 pr-8 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >

              <option value="All">
                All Types
              </option>

              <option value="Assignment">
                Assignment
              </option>

              <option value="Return">
                Return
              </option>

              <option value="Maintenance">
                Maintenance
              </option>

              <option value="Disposal">
                Disposal
              </option>
              <option value="Purchase">
  Purchase
</option>

            </select>

          </div>

        </div>

      </div>


      {/* ================================================== */}
      {/* TABLE */}
      {/* ================================================== */}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">


        {/* TABLE HEADER */}

        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

          <div>

            <h2 className="font-semibold text-gray-800">
              Transaction History
            </h2>

            <p className="text-sm text-gray-500 mt-1">

              {filteredTransactions.length === 0
                ? "No transactions"
                : `${startIndex + 1}–${Math.min(
                    startIndex +
                      transactionsPerPage,
                    filteredTransactions.length
                  )} of ${
                    filteredTransactions.length
                  } transactions`}

            </p>

          </div>


          {filter !== "All" && (
            <button
              onClick={() =>
                handleFilter("All")
              }
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear filter
            </button>
          )}

        </div>


        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left px-5 py-3 font-medium text-gray-500 whitespace-nowrap">
                  Transaction ID
                </th>

                <th className="text-left px-5 py-3 font-medium text-gray-500 whitespace-nowrap">
                  Asset
                </th>

                <th className="text-left px-5 py-3 font-medium text-gray-500 whitespace-nowrap">
                  Employee
                </th>
                <th>Cost</th>

                <th className="text-left px-5 py-3 font-medium text-gray-500 whitespace-nowrap">
                  Type
                </th>

                <th className="text-left px-5 py-3 font-medium text-gray-500 whitespace-nowrap">
                  Date
                </th>

                <th className="text-left px-5 py-3 font-medium text-gray-500 whitespace-nowrap">
                  Status
                </th>

                <th className="text-center px-5 py-3 font-medium text-gray-500 whitespace-nowrap">
                  Details
                </th>

              </tr>

            </thead>


            <tbody>

              {currentTransactions.length > 0 ? (

                currentTransactions.map(
                  (transaction, index) => (

                    <tr
                      key={transaction.id}
                      className={`
                        border-t border-gray-100
                        transition-colors
                        hover:bg-blue-50/40
                        ${
                          index % 2 === 0
                            ? "bg-white"
                            : "bg-gray-50/40"
                        }
                      `}
                    >

                      {/* ID */}

                      <td className="px-5 py-4 font-medium text-gray-800 whitespace-nowrap">

                        {transaction.id}

                      </td>


                      {/* ASSET */}

                      <td className="px-5 py-4">

                        <p className="font-medium text-gray-800 whitespace-nowrap">
  {getAsset(transaction.assetId)?.name ||
    "Unknown Asset"}
</p>

                        <p className="text-xs text-gray-400 mt-0.5">
                          {transaction.assetId}
                        </p>

                      </td>


                      {/* EMPLOYEE */}

                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap">

                        {transaction.type === "Purchase"
  ? "N/A"
  : getEmployee(transaction.employeeId)?.name ||
    "Unknown Employee"}

                      </td>
                      <td>
  ETB {transaction.cost?.toLocaleString()}
</td>


                      {/* TYPE */}

                      <td className="px-5 py-4">

                        <span
                          className={`
                            inline-flex
                            items-center
                            justify-center
                            gap-1.5
                            min-w-[115px]
                            px-3
                            py-1.5
                            rounded-full
                            text-xs
                            font-medium
                            ${getTypeStyle(
                              transaction.type
                            )}
                          `}
                        >

                          {getTypeIcon(
                            transaction.type
                          )}

                          {transaction.type}

                        </span>

                      </td>


                      {/* DATE */}

                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap">

                        {transaction.date}

                      </td>


                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <span
                          className={`
                            inline-flex
                            px-2.5
                            py-1
                            rounded-full
                            text-xs
                            font-medium
                            ${getStatusStyle(
                              transaction.status
                            )}
                          `}
                        >

                          {transaction.status}

                        </span>

                      </td>


                      {/* VIEW */}

                      <td className="px-5 py-4 text-center">

                        <button
                        onClick={() =>
  setSelectedTransaction(transaction)
}
                          title="View transaction details"
                          aria-label={`View ${transaction.id} details`}
                          className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >

                          <Eye size={17} />

                        </button>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="py-16 text-center"
                  >

                    <div className="flex flex-col items-center">

                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-3">

                        <Search size={22} />

                      </div>

                      <h3 className="font-medium text-gray-700">
                        No transactions found
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Try changing your search or filter.
                      </p>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* ================================================== */}
        {/* PAGINATION */}
        {/* ================================================== */}

        {filteredTransactions.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-t border-gray-100">

            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-700">
                {startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-gray-700">
                {Math.min(
                  startIndex +
                    transactionsPerPage,
                  filteredTransactions.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-700">
                {filteredTransactions.length}
              </span>
            </p>


            <div className="flex items-center gap-1">

              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage(
                    (page) => page - 1
                  )
                }
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={17} />
              </button>


              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              )
                .slice(0, 5)
                .map((page) => (

                  <button
                    key={page}
                    onClick={() =>
                      setCurrentPage(page)
                    }
                    className={`
                      min-w-[36px]
                      h-[36px]
                      rounded-lg
                      text-sm
                      font-medium
                      ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }
                    `}
                  >

                    {page}

                  </button>

                ))}


              <button
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (page) => page + 1
                  )
                }
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={17} />
              </button>

            </div>

          </div>
        )}

      </div>


      {/* ================================================== */}
      {/* ADD TRANSACTION MODAL */}
      {/* ================================================== */}

      {showAddModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between p-5 bg-white border-b border-gray-100">

              <div>

                <h2 className="text-lg font-semibold text-gray-800">
                  New Transaction
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Record an asset activity
                </p>

              </div>


              <button
                onClick={() =>
                  setShowAddModal(false)
                }
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
              >

                <X size={20} />

              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleAddTransaction}
              className="p-5 space-y-4"
            >

            

            


<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Asset
  </label>

  <select
    value={newTransaction.assetId}
    onChange={(e) =>
      setNewTransaction({
        ...newTransaction,
        assetId: e.target.value,
      })
    }
    className="w-full border border-gray-200 rounded-lg px-3 py-2.5"
  >
    <option value="">Select Asset</option>

    {inventoryItems.map((asset) => (
  <option
    key={asset.id}
    value={asset.id}
  >
    {asset.name}
  </option>
))}
  </select>
</div>



<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Employee
  </label>

  <select
  value={newTransaction.employeeId}
  onChange={(e) =>
    setNewTransaction({
      ...newTransaction,
      employeeId: e.target.value,
    })
  }
  className="w-full border border-gray-200 rounded-lg px-3 py-2.5"
>
  <option value="">
    Select Employee
  </option>

  {usersData.map((user) => (
    <option
      key={user.id}
      value={user.id}
    >
      {user.name}
    </option>
  ))}
</select>
</div>




             




              {/* TYPE */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Type
                </label>

                <select
                  value={newTransaction.type}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      type: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none"
                >

                  <option value="Assignment">
                    Assignment
                  </option>

                  <option value="Return">
                    Return
                  </option>

                  <option value="Maintenance">
                    Maintenance
                  </option>

                  <option value="Disposal">
                    Disposal
                  </option>

                </select>

              </div>
              {/* COST */}

<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Cost (ETB)
  </label>

  <input
    type="number"
    min="0"
    value={newTransaction.cost}
    onChange={(e) =>
      setNewTransaction({
        ...newTransaction,
        cost: Number(e.target.value),
      })
    }
    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none"
    placeholder="Enter amount"
  />
</div>


              {/* DATE */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>

                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      date: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none"
                />

              </div>


              {/* TIME */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>

                <input
                  type="time"
                  value={newTransaction.time}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      time: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none"
                />

              </div>


              {/* CONDITION */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asset Condition
                </label>

                <select
                  value={newTransaction.condition}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      condition: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none"
                >

                  <option value="Good">
                    Good
                  </option>

                  <option value="Needs Repair">
                    Needs Repair
                  </option>

                  <option value="Damaged">
                    Damaged
                  </option>

                </select>

              </div>


              {/* NOTES */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>

                <textarea
                  rows="3"
                  placeholder="Add transaction notes..."
                  value={newTransaction.notes}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      notes: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 outline-none resize-none focus:ring-2 focus:ring-blue-500"
                />

              </div>


              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() =>
                    setShowAddModal(false)
                  }
                  className="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Add Transaction
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* ================================================== */}
      {/* TRANSACTION DETAILS */}
      {/* ================================================== */}

      <TransactionDetails
  transaction={selectedTransaction}
  items={items}
  onClose={() => setSelectedTransaction(null)}
/>

    </div>
  );
}