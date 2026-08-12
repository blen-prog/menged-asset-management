import { useState } from "react";
export default function Users({
  
  users,
  setUsers,
}) {
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
  name: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
  department: "",
  role: "",
  status: "",
});
const handleAddUser = () => {
  if (newUser.password !== newUser.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const userToAdd = {
    id: `USR-${String(users.length + 1).padStart(3, "0")}`,
    name: newUser.name,
    phone: newUser.phone,
    email: newUser.email,
    password: newUser.password,
    department: newUser.department,
    role: newUser.role,
    status: newUser.status,
    lastLogin: "Never",
  };

  setUsers([...users, userToAdd]);

  setNewUser({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    role: "",
    status: "Active",
  });

  setShowModal(false);
};
  return (
    
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-gray-500">
            Manage system users and access
          </p>
        </div>

        <button
  onClick={() => setShowModal(true)}
  className="bg-blue-600 text-white px-4 py-2 rounded-xl"
>
  Add User
</button>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="p-4">ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Department</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-4">{user.id}</td>
                <td>{user.name}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>{user.department}</td>
                <td>
  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
    {user.role}
  </span>
</td>
                <td>
  <span
    className={`px-3 py-1 rounded-full text-xs font-medium ${
      user.status === "Active"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {user.status}
  </span>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-[500px]">
      <h2 className="text-xl font-semibold mb-5">
        Add User
      </h2>

      <div className="space-y-3">
        <input
  type="text"
  placeholder="Full Name"
  value={newUser.name}
  onChange={(e) =>
    setNewUser({
      ...newUser,
      name: e.target.value,
    })
  }
  className="w-full border rounded-lg px-4 py-2"
/>
<input
  type="text"
  placeholder="Phone Number"
  value={newUser.phone}
  onChange={(e) =>
    setNewUser({
      ...newUser,
      phone: e.target.value,
    })
  }
  className="w-full border rounded-lg px-4 py-2"
/>
<input
  type="email"
  placeholder="Email"
  value={newUser.email}
  onChange={(e) =>
    setNewUser({
      ...newUser,
      email: e.target.value,
    })
  }
  className="w-full border rounded-lg px-4 py-2"
/>
<input
  type="password"
  placeholder="Password"
  value={newUser.password}
  onChange={(e) =>
    setNewUser({
      ...newUser,
      password: e.target.value,
    })
  }
  className="w-full border rounded-lg px-4 py-2"
/>
<input
  type="password"
  placeholder="Confirm Password"
  value={newUser.confirmPassword}
  onChange={(e) =>
    setNewUser({
      ...newUser,
      confirmPassword: e.target.value,
    })
  }
  className="w-full border rounded-lg px-4 py-2"
/>
<select
  value={newUser.department}
  onChange={(e) =>
    setNewUser({
      ...newUser,
      department: e.target.value,
    })
  }
  className="w-full border rounded-lg px-4 py-2"
>
  <option value="" disabled>
    Select Department
  </option>
  <option>IT</option>
  <option>HR</option>
  <option>Finance</option>
  <option>Operations</option>
  <option>Administration</option>
</select>
<select
  value={newUser.role}
  onChange={(e) =>
    setNewUser({
      ...newUser,
      role: e.target.value,
    })
  }
  className="w-full border rounded-lg px-4 py-2"
>
  <option value="" disabled>
    Select Role
  </option>

  <option>Administrator</option>
  <option>Manager</option>
  <option>Staff</option>
  <option>Viewer</option>
</select>
<select
  value={newUser.status}
  onChange={(e) =>
    setNewUser({
      ...newUser,
      status: e.target.value,
    })
  }
  className="w-full border rounded-lg px-4 py-2"
>
  <option value="" disabled>
    Select Status
  </option>
  <option>Active</option>
  <option>Inactive</option>
</select>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={handleAddUser}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}