import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import AllItems from "./pages/Inventory/AllItems";
import Assets from "./pages/Inventory/Assets";
import Consumables from "./pages/Inventory/Consumables";
import Categories from "./pages/Inventory/Categories";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/all-items" element={<AllItems />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/consumables" element={<Consumables />} />
        <Route path="/categories" element={<Categories />} />
      </Route>
    </Routes>
  );
}

export default App;