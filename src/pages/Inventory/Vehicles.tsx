import { useState } from "react";

import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  X,
  Car,
} from "lucide-react";

import {
  vehiclesData,
  Vehicle,
} from "../../data/vehiclesData";


export default function Vehicles() {
  const user = JSON.parse(
    sessionStorage.getItem("user") || "null"
  );

  const isAdmin =
    user?.role === "Administrator";

  const isOperations =
    user?.role === "Operations Manager";

  const canManageVehicles =
    isAdmin || isOperations;


  // =========================================================
  // STATE
  // =========================================================

  const [vehicles, setVehicles] =
    useState<Vehicle[]>(vehiclesData);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All Statuses");

  const [typeFilter, setTypeFilter] =
    useState("All Types");

  const [selectedVehicle, setSelectedVehicle] =
    useState<Vehicle | null>(null);

  const [editingVehicle, setEditingVehicle] =
    useState<Vehicle | null>(null);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);


  const vehiclesPerPage = 10;


  // =========================================================
  // NEW VEHICLE
  // =========================================================

  const [newVehicle, setNewVehicle] =
    useState<Omit<Vehicle, "id">>({
      make: "",
      model: "",
      plateNumber: "",
      type: "",
      assignedTo: "",

      year: new Date().getFullYear(),
      vin: "",

      purchaseDate: "",
      condition: "Good",

      registrationExpiry: "",
      insuranceExpiry: "",

      lastServiceDate: "",
      nextServiceDate: "",

      status: "Available",
    });


  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";

      case "Assigned":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";

      case "Maintenance":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";

      case "Out of Service":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };


  // =========================================================
  // FILTER VEHICLES
  // =========================================================

  const filteredVehicles =
    vehicles.filter((vehicle) => {

      const searchText =
        `${vehicle.id}
        ${vehicle.make}
        ${vehicle.model}
        ${vehicle.plateNumber}
        ${vehicle.assignedTo}`
          .toLowerCase();

      const matchesSearch =
        searchText.includes(
          search.toLowerCase()
        );

      const matchesStatus =
        statusFilter === "All Statuses" ||
        vehicle.status === statusFilter;

      const matchesType =
        typeFilter === "All Types" ||
        vehicle.type === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });


  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredVehicles.length /
        vehiclesPerPage
    )
  );

  const startIndex =
    (currentPage - 1) *
    vehiclesPerPage;

  const currentVehicles =
    filteredVehicles.slice(
      startIndex,
      startIndex + vehiclesPerPage
    );


  // =========================================================
  // DELETE VEHICLE
  // =========================================================

  const handleDelete = (id: string) => {
    if (!canManageVehicles) {
      alert(
        "You do not have permission to delete vehicles."
      );
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this vehicle?"
      );

    if (!confirmed) return;

    setVehicles(
      vehicles.filter(
        (vehicle) =>
          vehicle.id !== id
      )
    );
  };


  // =========================================================
  // ADD VEHICLE
  // =========================================================

  const handleAddVehicle = () => {
    if (!canManageVehicles) {
      alert(
        "You do not have permission to add vehicles."
      );
      return;
    }

    if (
      !newVehicle.make ||
      !newVehicle.model ||
      !newVehicle.plateNumber ||
      !newVehicle.type
    ) {
      alert(
        "Please fill in the required vehicle information."
      );
      return;
    }


    const nextNumber =
      Math.max(
        ...vehicles.map((vehicle) =>
          Number(
            vehicle.id.replace(
              "VEH-",
              ""
            )
          )
        ),
        0
      ) + 1;


    const vehicleToAdd: Vehicle = {
      id: `VEH-${String(
        nextNumber
      ).padStart(3, "0")}`,

      ...newVehicle,
    };


    setVehicles([
      ...vehicles,
      vehicleToAdd,
    ]);


    setNewVehicle({
      make: "",
      model: "",
      plateNumber: "",
      type: "",
      assignedTo: "",

      year: new Date().getFullYear(),
      vin: "",

      purchaseDate: "",
      condition: "Good",

      registrationExpiry: "",
      insuranceExpiry: "",

      lastServiceDate: "",
      nextServiceDate: "",

      status: "Available",
    });


    setShowAddModal(false);
  };


  // =========================================================
  // UPDATE VEHICLE
  // =========================================================

  const handleUpdateVehicle = () => {
    if (!editingVehicle) return;

    setVehicles(
      vehicles.map((vehicle) =>
        vehicle.id === editingVehicle.id
          ? editingVehicle
          : vehicle
      )
    );

    setEditingVehicle(null);
  };


  // =========================================================
  // FORM INPUT COMPONENT
  // =========================================================

  const inputClass =
    "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500";


  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            Vehicles
          </h1>

          <p className="text-gray-500 dark:text-gray-400">
            Manage your fleet and vehicle information
          </p>
        </div>


        {canManageVehicles && (
          <button
            onClick={() =>
              setShowAddModal(true)
            }
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <Plus size={18} />
            Add Vehicle
          </button>
        )}

      </div>


      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Vehicles
          </p>

          <p className="text-2xl font-bold mt-1">
            {vehicles.length}
          </p>
        </div>


        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Available
          </p>

          <p className="text-2xl font-bold text-green-600 mt-1">
            {
              vehicles.filter(
                (vehicle) =>
                  vehicle.status ===
                  "Available"
              ).length
            }
          </p>
        </div>


        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Assigned
          </p>

          <p className="text-2xl font-bold text-blue-600 mt-1">
            {
              vehicles.filter(
                (vehicle) =>
                  vehicle.status ===
                  "Assigned"
              ).length
            }
          </p>
        </div>


        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Maintenance
          </p>

          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {
              vehicles.filter(
                (vehicle) =>
                  vehicle.status ===
                  "Maintenance"
              ).length
            }
          </p>
        </div>

      </div>


      {/* =====================================================
          FILTERS
      ===================================================== */}

      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm p-4 mb-6">

        <div className="flex flex-wrap gap-3">

          {/* Search */}

          <div className="relative flex-1 min-w-[220px]">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search vehicles..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />

          </div>


          {/* Vehicle Type */}

          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(
                e.target.value
              );
              setCurrentPage(1);
            }}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option>
              All Types
            </option>

            <option>Pickup</option>
            <option>Sedan</option>
            <option>SUV</option>
            <option>Van</option>
            <option>Truck</option>
            <option>Bus</option>
            <option>Motorcycle</option>
          </select>


          {/* Status */}

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(
                e.target.value
              );
              setCurrentPage(1);
            }}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option>
              All Statuses
            </option>

            <option>
              Available
            </option>

            <option>
              Assigned
            </option>

            <option>
              Maintenance
            </option>

            <option>
              Out of Service
            </option>
          </select>

        </div>

      </div>


      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="min-w-[1100px] w-full">

            <thead className="bg-gray-50 dark:bg-gray-700/50">

              <tr className="text-left text-sm text-gray-500 dark:text-gray-400">

                <th className="p-4">
                  Vehicle ID
                </th>

                <th className="p-4">
                  Vehicle
                </th>

                <th className="p-4">
                  Plate Number
                </th>

                <th className="p-4">
                  Type
                </th>

                <th className="p-4">
                  Assigned To
                </th>

                <th className="p-4">
                  Status
                </th>

                <th className="p-4 text-center">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {currentVehicles.map(
                (vehicle) => (

                  <tr
                    key={vehicle.id}
                    className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40"
                  >

                    {/* ID */}

                    <td className="p-4 font-medium">
                      {vehicle.id}
                    </td>


                    {/* Vehicle */}

                    <td className="p-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Car
                            size={20}
                            className="text-blue-600 dark:text-blue-400"
                          />
                        </div>

                        <div>

                          <p className="font-semibold">
                            {vehicle.make}{" "}
                            {vehicle.model}
                          </p>

                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {vehicle.year}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* Plate */}

                    <td className="p-4">
                      <span className="font-medium">
                        {vehicle.plateNumber}
                      </span>
                    </td>


                    {/* Type */}

                    <td className="p-4">

                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        {vehicle.type}
                      </span>

                    </td>


                    {/* Assigned To */}

                    <td className="p-4">

                      {vehicle.assignedTo ||
                        "Unassigned"}

                    </td>


                    {/* Status */}

                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          vehicle.status
                        )}`}
                      >
                        {vehicle.status}
                      </span>

                    </td>


                    {/* Actions */}

                    <td className="p-4">

                      <div className="flex justify-center gap-2">

                        {/* View */}

                        <button
                          onClick={() =>
                            setSelectedVehicle(
                              vehicle
                            )
                          }
                          className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600"
                          title="View"
                        >
                          <Eye size={17} />
                        </button>


                        {/* Edit */}

                        {canManageVehicles && (
                          <button
                            onClick={() =>
                              setEditingVehicle(
                                vehicle
                              )
                            }
                            className="p-2 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 text-yellow-600"
                            title="Edit"
                          >
                            <Pencil
                              size={17}
                            />
                          </button>
                        )}


                        {/* Delete */}

                        {canManageVehicles && (
                          <button
                            onClick={() =>
                              handleDelete(
                                vehicle.id
                              )
                            }
                            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600"
                            title="Delete"
                          >
                            <Trash2
                              size={17}
                            />
                          </button>
                        )}

                      </div>

                    </td>

                  </tr>

                )
              )}


              {/* Empty */}

              {currentVehicles.length ===
                0 && (

                <tr>

                  <td
                    colSpan={7}
                    className="p-12 text-center"
                  >

                    <Car
                      size={40}
                      className="mx-auto text-gray-400 mb-3"
                    />

                    <p className="font-medium">
                      No vehicles found
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Try changing your search or filters.
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* ===================================================
            PAGINATION
        =================================================== */}

        <div className="flex justify-between items-center p-4 border-t dark:border-gray-700">

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing{" "}
            {filteredVehicles.length ===
            0
              ? 0
              : startIndex + 1}{" "}
            to{" "}
            {Math.min(
              startIndex +
                vehiclesPerPage,
              filteredVehicles.length
            )}{" "}
            of{" "}
            {filteredVehicles.length}{" "}
            vehicles
          </p>


          <div className="flex gap-2">

            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      1,
                      page - 1
                    )
                )
              }
              className="px-3 py-1.5 border dark:border-gray-600 rounded-lg disabled:opacity-40"
            >
              Previous
            </button>


            <span className="px-3 py-1.5 text-sm">
              {currentPage} /{" "}
              {totalPages}
            </span>


            <button
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      totalPages,
                      page + 1
                    )
                )
              }
              className="px-3 py-1.5 border dark:border-gray-600 rounded-lg disabled:opacity-40"
            >
              Next
            </button>

          </div>

        </div>

      </div>


      {/* =====================================================
          VIEW VEHICLE MODAL
      ===================================================== */}

      {selectedVehicle && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">

              <div>

                <h2 className="text-xl font-bold">
                  {selectedVehicle.make}{" "}
                  {selectedVehicle.model}
                </h2>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedVehicle.id}
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedVehicle(null)
                }
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X size={20} />
              </button>

            </div>


            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

              <Detail
                label="Vehicle ID"
                value={selectedVehicle.id}
              />

              <Detail
                label="Plate Number"
                value={
                  selectedVehicle.plateNumber
                }
              />

              <Detail
                label="Make"
                value={
                  selectedVehicle.make
                }
              />

              <Detail
                label="Model"
                value={
                  selectedVehicle.model
                }
              />

              <Detail
                label="Vehicle Type"
                value={
                  selectedVehicle.type
                }
              />

              <Detail
                label="Year"
                value={
                  selectedVehicle.year
                }
              />

              <Detail
                label="Assigned To"
                value={
                  selectedVehicle.assignedTo ||
                  "Unassigned"
                }
              />

              <Detail
                label="VIN / Chassis Number"
                value={
                  selectedVehicle.vin ||
                  "Not provided"
                }
              />

              <Detail
                label="Condition"
                value={
                  selectedVehicle.condition
                }
              />

              <Detail
                label="Purchase Date"
                value={
                  selectedVehicle.purchaseDate
                }
              />

              <Detail
                label="Registration Expiry"
                value={
                  selectedVehicle.registrationExpiry
                }
              />

              <Detail
                label="Insurance Expiry"
                value={
                  selectedVehicle.insuranceExpiry
                }
              />

              <Detail
                label="Last Service"
                value={
                  selectedVehicle.lastServiceDate
                }
              />

              <Detail
                label="Next Service"
                value={
                  selectedVehicle.nextServiceDate
                }
              />

              <div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Status
                </p>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                    selectedVehicle.status
                  )}`}
                >
                  {selectedVehicle.status}
                </span>

              </div>

            </div>

            <div className="flex justify-end p-6 border-t dark:border-gray-700">

              <button
                onClick={() =>
                  setSelectedVehicle(null)
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          ADD VEHICLE MODAL
      ===================================================== */}

      {showAddModal && (

        <VehicleFormModal
          title="Add Vehicle"
          vehicle={newVehicle}
          setVehicle={setNewVehicle}
          onClose={() =>
            setShowAddModal(false)
          }
          onSave={handleAddVehicle}
          inputClass={inputClass}
        />

      )}


      {/* =====================================================
          EDIT VEHICLE MODAL
      ===================================================== */}

      {editingVehicle && (

        <VehicleFormModal
          title="Edit Vehicle"
          vehicle={editingVehicle}
          setVehicle={setEditingVehicle}
          onClose={() =>
            setEditingVehicle(null)
          }
          onSave={handleUpdateVehicle}
          inputClass={inputClass}
        />

      )}

    </div>
  );
}


// ============================================================
// DETAIL COMPONENT
// ============================================================

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
        {label}
      </p>

      <p className="font-medium">
        {value || "Not provided"}
      </p>
    </div>
  );
}


// ============================================================
// VEHICLE FORM MODAL
// ============================================================

function VehicleFormModal({
  title,
  vehicle,
  setVehicle,
  onClose,
  onSave,
  inputClass,
}: {
  title: string;
  vehicle: any;
  setVehicle: React.Dispatch<
    React.SetStateAction<any>
  >;
  onClose: () => void;
  onSave: () => void;
  inputClass: string;
}) {
  return (

    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

        {/* Header */}

        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">

          <h2 className="text-xl font-bold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>

        </div>


        {/* Form */}

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

          <FormInput
            label="Make *"
            value={vehicle.make}
            onChange={(value) =>
              setVehicle({
                ...vehicle,
                make: value,
              })
            }
            className={inputClass}
          />


          <FormInput
            label="Model *"
            value={vehicle.model}
            onChange={(value) =>
              setVehicle({
                ...vehicle,
                model: value,
              })
            }
            className={inputClass}
          />


          <FormInput
            label="Plate Number *"
            value={vehicle.plateNumber}
            onChange={(value) =>
              setVehicle({
                ...vehicle,
                plateNumber: value,
              })
            }
            className={inputClass}
          />


          <FormSelect
            label="Vehicle Type *"
            value={vehicle.type}
            options={[
              "Pickup",
              "Sedan",
              "SUV",
              "Van",
              "Truck",
              "Bus",
              "Motorcycle",
            ]}
            onChange={(value) =>
              setVehicle({
                ...vehicle,
                type: value,
              })
            }
            className={inputClass}
          />


          <FormInput
            label="Assigned To"
            value={vehicle.assignedTo}
            onChange={(value) =>
              setVehicle({
                ...vehicle,
                assignedTo: value,
              })
            }
            className={inputClass}
          />


          <FormInput
            label="Year"
            type="number"
            value={vehicle.year}
            onChange={(value) =>
              setVehicle({
                ...vehicle,
                year: Number(value),
              })
            }
            className={inputClass}
          />


          <FormInput
            label="VIN / Chassis Number"
            value={vehicle.vin}
            onChange={(value) =>
              setVehicle({
                ...vehicle,
                vin: value,
              })
            }
            className={inputClass}
          />


          <FormSelect
            label="Condition"
            value={vehicle.condition}
            options={[
              "Excellent",
              "Good",
              "Fair",
              "Damaged",
            ]}
            onChange={(value) =>
              setVehicle({
                ...vehicle,
                condition: value,
              })
            }
            className={inputClass}
          />


          <FormInput
            label="Purchase Date"
            type="date"
            value={vehicle.purchaseDate}
            onChange={(value) =>
              setVehicle({
                ...vehicle,
                purchaseDate: value,
              })
            }
            className={inputClass}
          />


          <FormInput
            label="Registration Expiry"
            type="date"
            value={
              vehicle.registrationExpiry
            }
            onChange={(value) =>
              setVehicle({
                ...vehicle,
                registrationExpiry:
                  value,
              })
            }
            className={inputClass}
          />


          <FormInput
            label="Insurance Expiry"
            type="date"
            value={
              vehicle.insuranceExpiry
            }
            onChange={(value) =>
              setVehicle({
                ...vehicle,
                insuranceExpiry: value,
              })
            }
            className={inputClass}
          />


          <FormInput
            label="Last Service Date"
            type="date"
            value={
              vehicle.lastServiceDate
            }
            onChange={(value) =>
              setVehicle({
                ...vehicle,
                lastServiceDate: value,
              })
            }
            className={inputClass}
          />


          <FormInput
            label="Next Service Date"
            type="date"
            value={
              vehicle.nextServiceDate
            }
            onChange={(value) =>
              setVehicle({
                ...vehicle,
                nextServiceDate: value,
              })
            }
            className={inputClass}
          />


          <FormSelect
            label="Status"
            value={vehicle.status}
            options={[
              "Available",
              "Assigned",
              "Maintenance",
              "Out of Service",
            ]}
            onChange={(value) =>
              setVehicle({
                ...vehicle,
                status: value,
              })
            }
            className={inputClass}
          />

        </div>


        {/* Footer */}

        <div className="flex justify-end gap-3 p-6 border-t dark:border-gray-700">

          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Vehicle
          </button>

        </div>

      </div>

    </div>
  );
}


// ============================================================
// FORM INPUT
// ============================================================

function FormInput({
  label,
  value,
  onChange,
  className,
  type = "text",
}: {
  label: string;
  value: any;
  onChange: (value: string) => void;
  className: string;
  type?: string;
}) {
  return (
    <div>

      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>

      <input
        type={type}
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={className}
      />

    </div>
  );
}


// ============================================================
// FORM SELECT
// ============================================================

function FormSelect({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  className: string;
}) {
  return (
    <div>

      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={className}
      >

        <option value="">
          Select
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}