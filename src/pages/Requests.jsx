import { useState } from "react";
import { Plus } from "lucide-react";

export default function Requests({
  items,
  requests,
  setRequests,
}) {


  const user = JSON.parse(
    sessionStorage.getItem("user")
  );

  const isApprover =
  user?.role === "Administrator" ||
  user?.role === "Purchasing Manager";

  const [showModal, setShowModal] =
    useState(false);


  const [newRequest, setNewRequest] =
  useState({
    itemId: "",
    otherItem: "",
    quantity: 1,
    reason: "",
  });

  const handleSubmit = () => {
    if (
      !newRequest.itemId ||
      !newRequest.reason
    ) {
      alert("Please complete all fields.");
      return;
    }

    const request = {
      id: `REQ-${String(
        requests.length + 1
      ).padStart(3, "0")}`,

      requestedBy: user?.name,

      status: "Pending",

      date: new Date().toLocaleDateString(),

      ...newRequest,
    };

    setRequests([
      request,
      ...requests,
    ]);

    setNewRequest({
      itemId: "",
      quantity: 1,
      reason: "",
    });

    setShowModal(false);
  };

  const handleApprove = (id) => {
  setRequests(
    requests.map((request) =>
      request.id === id
        ? {
            ...request,
            status: "Approved",
          }
        : request
    )
  );
};

const handleReject = (id) => {
  setRequests(
    requests.map((request) =>
      request.id === id
        ? {
            ...request,
            status: "Rejected",
          }
        : request
    )
  );
};

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            Item Requests
          </h1>

          <p className="text-gray-500">
            Request inventory items
          </p>
        </div>

        <button
          onClick={() =>
            setShowModal(true)
          }
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl"
        >
          <Plus size={18} />
          New Request
        </button>

      </div>

      <div className="bg-white rounded-xl border overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-50">

            <tr>
              <th className="p-4 text-left">
                Request ID
              </th>

              <th className="p-4 text-left">
                Item
              </th>

              <th className="p-4 text-left">
                Requested By
              </th>
              <th className="p-4 text-left">
  Reason
</th>


              <th className="p-4 text-left">
                Quantity
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              {isApprover && (
  <th className="p-4 text-left">
    Actions
  </th>
)}


              <th className="p-4 text-left">
                Date
              </th>
            </tr>

          </thead>

          <tbody>
  {requests.length > 0 ? (
    requests.map((request) => (
      <tr
        key={request.id}
        className="border-t"
      >
        <td className="p-4">
          {request.id}
        </td>

        <td className="p-4">
          {
            items.find(
              (item) =>
                item.id ===
                request.itemId
            )?.name
          }
        </td>

        <td className="p-4">
          {request.requestedBy}
        </td>

        <td className="p-4">
          {request.reason}
        </td>

        <td className="p-4">
          {request.quantity}
        </td>

        <td className="p-4">
  <span
  className={`px-3 py-1 rounded-full text-xs ${
    request.status === "Approved"
      ? "bg-green-100 text-green-700"
      : request.status === "Rejected"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700"
  }`}
>
  {request.status}
</span>
</td>

{isApprover && (
  <td className="p-4">

    {request.status === "Pending" && (
      <div className="flex gap-2">

        <button
          onClick={() =>
            handleApprove(request.id)
          }
          className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded"
        >
          Approve
        </button>

        <button
          onClick={() =>
            handleReject(request.id)
          }
          className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded"
        >
          Reject
        </button>

      </div>
    )}

  </td>
)}


<td className="p-4">
  {request.date}
</td>

      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan={isApprover ? 8 : 7}
        className="text-center py-10 text-gray-500"
      >
        No item requests found.
      </td>
    </tr>
  )}
</tbody>

        </table>

      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl w-full max-w-lg p-6">

            <h2 className="text-xl font-semibold mb-5">
              Item Request
            </h2>

            <div className="space-y-4">

              <select
                value={newRequest.itemId}
                onChange={(e) =>
                  setNewRequest({
                    ...newRequest,
                    itemId: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="">
                  Select Item
                </option>

                {items.map((item) => (
  <option
    key={item.id}
    value={item.id}
  >
    {item.name}
  </option>
))}
<option value="OTHER">
  Other (Not Listed)
</option>
              </select>

              {newRequest.itemId === "OTHER" && (
  <input
    type="text"
    placeholder="Please enter the item name"
    value={newRequest.otherItem}
    onChange={(e) =>
      setNewRequest({
        ...newRequest,
        otherItem: e.target.value,
      })
    }
    className="w-full border rounded-lg px-4 py-2"
  />
)}

              <input
  type="number"
  min="1"
  value={newRequest.quantity}
  onChange={(e) =>
    setNewRequest({
      ...newRequest,
      quantity: Number(
        e.target.value
      ),
    })
  }
  className="w-full border rounded-lg px-4 py-2"
  placeholder="Quantity"
/>

<textarea
  value={newRequest.reason}
  onChange={(e) =>
    setNewRequest({
      ...newRequest,
      reason: e.target.value,
    })
  }
  placeholder="Reason for request"
  className="w-full border rounded-lg px-4 py-2"
/>
</div>

<div className="flex justify-end gap-3 mt-6">

  <button
    onClick={() =>
      setShowModal(false)
    }
    className="px-4 py-2 border rounded-lg"
  >
    Cancel
  </button>

  <button
    onClick={handleSubmit}
    className="px-4 py-2 bg-purple-600 text-white rounded-lg"
  >
    Submit Request
  </button>

</div>

</div>
</div>
      )}
    </div>
  );
}
