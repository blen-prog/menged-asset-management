import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Wrench,
} from "lucide-react";

export default function Maintenance({
  items,
}) {
  const [showRequestModal, setShowRequestModal] =
    useState(false);

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [selectedRequest, setSelectedRequest] =
    useState(null);

  const [maintenanceRequests, setMaintenanceRequests] =
    useState([]);

  const [newRequest, setNewRequest] =
    useState({
      assetId: "",
      issue: "",
      technician: "",
      status: "Under Maintenance",
      notes: "",
    });
  const user = JSON.parse(
  sessionStorage.getItem("user")
);

const isAdmin =
  user?.role === "Administrator";


const [searchParams] =
  useSearchParams();

useEffect(() => {
  if (
    searchParams.get("add") ===
    "request"
  ) {
    setShowRequestModal(true);

    window.history.replaceState(
      {},
      "",
      "/maintenance"
    );
  }
}, [searchParams]);

  const filteredRequests =
    maintenanceRequests.filter((request) => {
      return (
        statusFilter === "All" ||
        request.status === statusFilter
      );
    });

  const handleAddRequest = () => {
    if (
      !newRequest.assetId ||
      !newRequest.issue
    ) {
      alert(
        "Please complete the required fields."
      );
      return;
    }

    const request = {
      id: `MNT-${String(
        maintenanceRequests.length + 1
      ).padStart(3, "0")}`,

      ...newRequest,

      createdDate:
        new Date().toLocaleDateString(),
    };

    setMaintenanceRequests([
      request,
      ...maintenanceRequests,
    ]);

    setNewRequest({
      assetId: "",
      issue: "",
      technician: "",
      status: "Under Maintenance",
      notes: "",
    });

    setShowRequestModal(false);
  };

  const underMaintenanceCount =
    maintenanceRequests.filter(
      (request) =>
        request.status ===
        "Under Maintenance"
    ).length;

  const repairedCount =
    maintenanceRequests.filter(
      (request) =>
        request.status === "Repaired"
    ).length;

  return (
    <div className="p-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            Maintenance
          </h1>

          <p className="text-gray-500">
            Track repairs and servicing
          </p>
        </div>

        <button
          onClick={() =>
            setShowRequestModal(true)
          }
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl"
        >
          <Plus size={18} />
          Maintenance Request
        </button>
      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white border rounded-xl p-5">
          <p className="text-gray-500 text-sm">
            Total Requests
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {maintenanceRequests.length}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <p className="text-gray-500 text-sm">
            Under Maintenance
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {underMaintenanceCount}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <p className="text-gray-500 text-sm">
            Repaired
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {repairedCount}
          </h2>
        </div>

      </div>

      {/* Filters */}

      <div className="bg-white border rounded-xl p-4 mb-6">
        <div className="flex gap-3">

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-3 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search..."
              className="w-full border rounded-lg pl-10 pr-4 py-2"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="border rounded-lg px-3 py-2"
          >
            <option value="All">
              All
            </option>

            <option value="Under Maintenance">
              Under Maintenance
            </option>

            <option value="Repaired">
              Repaired
            </option>
          </select>
        </div>
      </div>

      {/* Table */}

      <div className="bg-white border rounded-xl overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">
                Request ID
              </th>

              <th className="p-4 text-left">
                Asset
              </th>

              <th className="p-4 text-left">
                Issue
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Technician
              </th>

              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-center">
                View
              </th>
            </tr>
          </thead>

          <tbody>

            {filteredRequests.map(
              (request) => (
                <tr
                  key={request.id}
                  className="border-t"
                >
                  <td className="p-4">
                    {request.id}
                  </td>

                  <td className="p-4">
                    {items.find(
                      (item) =>
                        item.id ===
                        request.assetId
                    )?.name ||
                      request.assetId}
                  </td>

                  <td className="p-4">
                    {request.issue}
                  </td>

                  <td className="p-4">

  {request.status ===
  "Under Maintenance" ? (

    isAdmin ? (
      <label className="flex items-center gap-2">
        <input
  type="checkbox"
  checked={
    request.status === "Repaired"
  }
  disabled={!isAdmin}
  onChange={() => {
    const confirmed = window.confirm(
      request.status === "Repaired"
        ? "Return this item to Under Maintenance?"
        : "Has this item been repaired and returned to service?"
    );

    if (!confirmed) return;

    setMaintenanceRequests(
      maintenanceRequests.map((r) =>
        r.id === request.id
          ? {
              ...r,
              status:
                r.status === "Repaired"
                  ? "Under Maintenance"
                  : "Repaired",
            }
          : r
      )
    );
  }}
/>

        Mark Repaired
      </label>
    ) : (
      <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">
        Under Maintenance
      </span>
    )

  ) : (
    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
      Repaired
    </span>
  )}

</td>

                  <td className="p-4">
                    {request.technician}
                  </td>

                  <td className="p-4">
                    {request.createdDate}
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() =>
                        setSelectedRequest(
                          request
                        )
                      }
                      className="text-blue-600"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              )
            )}

            {filteredRequests.length ===
              0 && (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-10 text-gray-500"
                >
                  No maintenance requests
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>

      {/* New Request Modal */}

      {showRequestModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl w-full max-w-lg p-6">

            <h2 className="text-xl font-semibold mb-5">
              New Maintenance Request
            </h2>

            <div className="space-y-4">

              <select
                value={
                  newRequest.assetId
                }
                onChange={(e) =>
                  setNewRequest({
                    ...newRequest,
                    assetId:
                      e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="">
                  Select Asset
                </option>

                {items
                  .filter(
                    (item) =>
                      item.type ===
                      "Asset"
                  )
                  .map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  ))}
              </select>

              <textarea
                placeholder="Issue Description"
                value={newRequest.issue}
                onChange={(e) =>
                  setNewRequest({
                    ...newRequest,
                    issue:
                      e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-2"
              />

              <input
                type="text"
                placeholder="Technician / Vendor"
                value={
                  newRequest.technician
                }
                onChange={(e) =>
                  setNewRequest({
                    ...newRequest,
                    technician:
                      e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-2"
              />

              <textarea
                placeholder="Notes"
                value={newRequest.notes}
                onChange={(e) =>
                  setNewRequest({
                    ...newRequest,
                    notes:
                      e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-2"
              />

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() =>
                  setShowRequestModal(
                    false
                  )
                }
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={
                  handleAddRequest
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Create Request
              </button>

            </div>

          </div>

        </div>
      )}

      {/* View Request Modal */}

      {selectedRequest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl w-full max-w-lg p-6">

            <h2 className="text-xl font-semibold mb-4">
              Maintenance Details
            </h2>

            <div className="space-y-3">
              <p>
                <strong>ID:</strong>{" "}
                {selectedRequest.id}
              </p>

              <p>
                <strong>Issue:</strong>{" "}
                {selectedRequest.issue}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {selectedRequest.status}
              </p>

              <p>
                <strong>Technician:</strong>{" "}
                {
                  selectedRequest.technician
                }
              </p>

              <p>
                <strong>Notes:</strong>{" "}
                {selectedRequest.notes}
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() =>
                  setSelectedRequest(
                    null
                  )
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Close
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}