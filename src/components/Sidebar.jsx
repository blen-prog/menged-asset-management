import { useState } from "react";
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
    <div className="w-72 h-screen bg-[#08204d] text-white flex flex-col fixed left-0 top-0">
      {/* Logo Section */}
      <div className="p-6 border-b border-blue-900">
        <div className="flex justify-center mb-4">
          <div className="bg-white rounded-2xl p-4 w-full flex justify-center">
            <img
              src={logo}
              alt="Menged Logo"
              className="h-16 object-contain"
            />
          </div>
        </div>

        <h1 className="text-xl font-bold text-center">Menged Solution</h1>

        <p className="text-blue-200 text-sm text-center">Asset Management</p>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-xs tracking-wider text-gray-400 mb-4">MAIN MENU</p>

        {/* Dashboard */}
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 mb-4">
          <LayoutDashboard size={20} />
          Dashboard
        </button>

        <p className="text-xs tracking-wider text-gray-400 mb-4">OVERVIEW</p>

        {/* Inventory */}
        <button
          onClick={() => setInventoryOpen(!inventoryOpen)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-blue-900"
        >
          <div className="flex items-center gap-3">
            <Package size={20} />
            Inventory
          </div>

          {inventoryOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>

        {inventoryOpen && (
          <div className="ml-10 mt-2 space-y-2 text-gray-300">
            <div className="flex items-center gap-2 py-2 cursor-pointer hover:text-white">
              <Package size={16} />
              All Items
            </div>

            <div className="flex items-center gap-2 py-2 cursor-pointer hover:text-white">
              <Box size={16} />
              Assets
            </div>

            <div className="flex items-center gap-2 py-2 cursor-pointer hover:text-white">
              <Droplets size={16} />
              Consumables
            </div>

            <div className="flex items-center gap-2 py-2 cursor-pointer hover:text-white">
              <Car size={16} />
              Vehicles
            </div>

            <div className="flex items-center gap-2 py-2 cursor-pointer hover:text-white">
              <Tags size={16} />
              Categories
            </div>
          </div>
        )}

        {/* Other Menu Items */}
        <div className="mt-4 space-y-2">
          <MenuItem icon={<Building2 size={20} />} text="Departments" />
          <MenuItem icon={<Users size={20} />} text="Employees" />
          <MenuItem icon={<Truck size={20} />} text="Suppliers" />
          <MenuItem icon={<Wrench size={20} />} text="Maintenance" />
          <MenuItem icon={<BarChart3 size={20} />} text="Reports" />
          <MenuItem icon={<UserCog size={20} />} text="Users" />
          <MenuItem icon={<Settings size={20} />} text="Settings" />
        </div>
      </div>

      {/* User Section */}
      <div className="border-t border-blue-900 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
            JD
          </div>

          <div>
            <p className="font-medium">John Doe</p>
            <p className="text-sm text-gray-300">Administrator</p>
          </div>
        </div>

        <button className="flex items-center gap-3 text-gray-300 hover:text-white">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}

function MenuItem({ icon, text }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-900">
      {icon}
      {text}
    </button>
  );
}
