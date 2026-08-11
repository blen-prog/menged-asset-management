import { useState } from "react";
import { NavLink } from "react-router-dom";

import logo from "../assets/menged-logo.png";

import {
  LayoutDashboard,
  Package,
  Box,
  Droplets,
  Car,
  Tags,
  Building2,
  Users,
  Truck,
  Wrench,
  BarChart3,
  UserCog,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {
  const [inventoryOpen, setInventoryOpen] = useState(true);

  return (
    <div className="w-56 h-screen bg-[#08204d] text-white flex flex-col fixed left-0 top-0">
      {/* Logo Section */}
      <div className="p-3 border-b border-blue-900">
        <div className="bg-white rounded-xl p-2 flex justify-center">
          <img
            src={logo}
            alt="Menged Logo"
            className="h-10 object-contain"
          />
        </div>

        <h1 className="text-base font-bold text-center mt-2">
          Menged Solution
        </h1>

        <p className="text-xs text-blue-200 text-center">
          Asset Management
        </p>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto p-3">
        <p className="text-xs tracking-wider text-gray-400 mb-3">
          MAIN MENU
        </p>

        {/* Dashboard */}
        <NavLink
  to="/"
  className={({ isActive }) =>
    `w-full flex items-center gap-3 px-3 py-1.5 rounded-lg mb-2 text-sm ${
      isActive ? "bg-blue-600" : "hover:bg-blue-900"
    }`
  }
>
  <LayoutDashboard size={18} />
  Dashboard
</NavLink>

        <p className="text-xs tracking-wider text-gray-400 mt-3 mb-2">
          OVERVIEW
        </p>

        {/* Inventory */}
        <button
          onClick={() => setInventoryOpen(!inventoryOpen)}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-blue-900 text-sm"
        >
          <div className="flex items-center gap-3">
            <Package size={18} />
            Inventory
          </div>

          {inventoryOpen ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>

        {inventoryOpen && (
          <div className="ml-5 mt-1 space-y-0.5 text-gray-300 text-sm">
            <NavLink
  to="/all-items"
  className={({ isActive }) =>
    `flex items-center gap-2 py-1 ${
      isActive ? "text-white font-semibold" : "text-gray-300"
    } hover:text-white`
  }
>
  <Package size={14} />
  All Items
</NavLink>

<NavLink
  to="/assets"
  className={({ isActive }) =>
    `flex items-center gap-2 py-1 ${
      isActive ? "text-white font-semibold" : "text-gray-300"
    } hover:text-white`
  }
>
  <Box size={14} />
  Assets
</NavLink>

            <NavLink
  to="/consumables"
  className={({ isActive }) =>
    `flex items-center gap-2 py-1 ${
      isActive ? "text-white font-semibold" : "text-gray-300"
    } hover:text-white`
  }
>
  <Droplets size={14} />
  Consumables
</NavLink>

            <div className="flex items-center gap-2 py-1 cursor-pointer hover:text-white">
              <Car size={14} />
              Vehicles
            </div>

            <NavLink
  to="/categories"
  className={({ isActive }) =>
    `flex items-center gap-2 py-1 ${
      isActive ? "text-white font-semibold" : "text-gray-300"
    } hover:text-white`
  }
>
  <Tags size={14} />
  Categories
</NavLink>
          </div>
        )}

        {/* Other Menu Items */}
        <div className="mt-3 space-y-1">
          <MenuItem
            icon={<Building2 size={18} />}
            text="Departments"
          />

          <MenuItem
            icon={<Users size={18} />}
            text="Employees"
          />

          <MenuItem
            icon={<Truck size={18} />}
            text="Suppliers"
          />

          <MenuItem
            icon={<Wrench size={18} />}
            text="Maintenance"
          />

          <MenuItem
            icon={<BarChart3 size={18} />}
            text="Reports"
          />

          <MenuItem
            icon={<UserCog size={18} />}
            text="Users"
          />

          <MenuItem
            icon={<Settings size={18} />}
            text="Settings"
          />
        </div>
      </div>

      {/* User Section */}
      <div className="border-t border-blue-900 p-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
            JD
          </div>

          <div>
            <p className="font-medium text-sm">
              John Doe
            </p>

            <p className="text-xs text-gray-300">
              Administrator
            </p>
          </div>
        </div>

        <button className="flex items-center gap-3 text-gray-300 hover:text-white text-sm">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}

function MenuItem({ icon, text }) {
  return (
    <button className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-blue-900 text-sm">
      {icon}
      {text}
    </button>
  );
}