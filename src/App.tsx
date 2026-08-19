import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import AllItems from "./pages/Inventory/AllItems";
import Assets from "./pages/Inventory/Assets";
import Consumables from "./pages/Inventory/Consumables";
import Categories from "./pages/Inventory/Categories";

import Departments from "./pages/Departments";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Transactions from "./pages/Transactions";
import TransactionDetails from "./components/TransactionDetails";
import Employees from "./pages/Employees";
import Suppliers from "./pages/Suppliers";
import Settings from "./pages/Settings";
import Maintenance from "./pages/Mainteinance";
import Requests from "./pages/Requests";

import { inventoryItems } from "./data/inventoryData";
import { usersData } from "./data/usersData";
import { initialTransactions } from "./data/transactionsData";


function App() {
  const [transactions, setTransactions] =
    useState(initialTransactions);

  const [users, setUsers] =
    useState(usersData);

  const [requests, setRequests] =
    useState([]);

  const [items, setItems] =
    useState(inventoryItems);


  // =========================================================
  // GLOBAL THEME
  // =========================================================
  useEffect(() => {
    const savedSettings =
      localStorage.getItem("menged-settings");

    if (savedSettings) {
      try {
        const parsedSettings =
          JSON.parse(savedSettings);

        if (parsedSettings.theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } catch (error) {
        console.error(
          "Failed to load theme settings:",
          error
        );

        document.documentElement.classList.remove("dark");
      }
    } else {
      // Default theme
      document.documentElement.classList.remove("dark");
    }
  }, []);


  return (
    <Routes>

      {/* =====================================================
          LOGIN
      ===================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />


      {/* =====================================================
          PROTECTED APPLICATION
      ===================================================== */}

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >

        {/* ===================================================
            DASHBOARD
        =================================================== */}

        <Route
          path="/"
          element={
            <Dashboard
              items={items}
              transactions={transactions}
            />
          }
        />


        {/* ===================================================
            INVENTORY
        =================================================== */}

        <Route
          path="/all-items"
          element={
            <AllItems
              items={items}
              setItems={setItems}
              transactions={transactions}
              setTransactions={setTransactions}
            />
          }
        />

        <Route
          path="/assets"
          element={
            <Assets
              items={items}
            />
          }
        />

        <Route
          path="/consumables"
          element={
            <Consumables
              items={items}
            />
          }
        />

        <Route
          path="/categories"
          element={
            <Categories
              items={items}
            />
          }
        />


        {/* ===================================================
            DEPARTMENTS
        =================================================== */}

        <Route
          path="/departments"
          element={
            <Departments
              items={items}
              users={users}
            />
          }
        />


        {/* ===================================================
            SUPPLIERS
        =================================================== */}

        <Route
          path="/suppliers"
          element={
            <Suppliers />
          }
        />


        {/* ===================================================
            USERS
        =================================================== */}

        <Route
          path="/users"
          element={
            <Users
              users={users}
              setUsers={setUsers}
            />
          }
        />


        {/* ===================================================
            TRANSACTIONS
        =================================================== */}

        <Route
          path="/transactions"
          element={
            <Transactions
              transactions={transactions}
              setTransactions={setTransactions}
              items={items}
            />
          }
        />


        {/* ===================================================
            REQUESTS
        =================================================== */}

        <Route
          path="/requests"
          element={
            <Requests
              items={items}
              requests={requests}
              setRequests={setRequests}
            />
          }
        />


        {/* ===================================================
            EMPLOYEES
        =================================================== */}

        <Route
          path="/employees"
          element={
            <Employees />
          }
        />


        {/* ===================================================
            REPORTS
        =================================================== */}

        <Route
          path="/reports"
          element={
            <Reports
              items={items}
            />
          }
        />


        {/* ===================================================
            SETTINGS
        =================================================== */}

        <Route
          path="/settings"
          element={
            <Settings />
          }
        />


        {/* ===================================================
            MAINTENANCE
        =================================================== */}

        <Route
          path="/maintenance"
          element={
            <Maintenance
              items={items}
            />
          }
        />

      </Route>

    </Routes>
  );
}


export default App;