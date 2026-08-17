import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import AllItems from "./pages/Inventory/AllItems";
import Assets from "./pages/Inventory/Assets";
import Consumables from "./pages/Inventory/Consumables";
import Categories from "./pages/Inventory/Categories";
import Departments from "./pages/Departments";
import { useState } from "react";
import { inventoryItems } from "./data/inventoryData";
import Users from "./pages/Users";
import { usersData } from "./data/usersData";
import Reports from "./pages/Reports";
import Transactions from "./pages/Transactions";
import TransactionDetails from "./components/TransactionDetails";
import { initialTransactions } from "./data/transactionsData";
import Employees from "./pages/Employees";
import Suppliers from "./pages/Suppliers";
import Settings from "./pages/Settings";
import Maintenance from "./pages/Mainteinance";
import Requests from "./pages/Requests";


function App() {
  const [transactions, setTransactions] =
  useState(initialTransactions);

  const [users, setUsers] = useState(usersData);
  const [requests, setRequests] =
  useState([]);

  const [items, setItems] = useState(inventoryItems);
  return (
    <Routes>
  <Route path="/login" element={<Login />} />

  <Route
  element={
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  }
>
    <Route
  path="/"
  element={<Dashboard
  items={items}
  transactions={transactions}
/>}
/>
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
  element={<Assets items={items} />}
/>
    <Route
  path="/consumables"
  element={<Consumables items={items} />}
/>
    <Route
  path="/categories"
  element={<Categories items={items} />}
/>
<Route
  path="/departments"
  element={
    <Departments
      items={items}
      users={users}
    />
  }
/>
<Route
  path="/suppliers"
  element={<Suppliers />}
/>

<Route
  path="/users"
  element={
    <Users
      users={users}
      setUsers={setUsers}
    />
  }
/>
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

<Route
  path="/employees"
  element={<Employees />}
/>

<Route
  path="/reports"
  element={<Reports items={items} />}
/>

<Route
  path="/settings"
  element={<Settings />}
/>

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