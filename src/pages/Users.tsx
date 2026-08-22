import { useState, ChangeEvent } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

import type { User } from "../types/models";

type NewUserForm = Omit<User, "id" | "lastLogin"> & {
  confirmPassword: string;
};

interface UsersProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export default function Users({ users, setUsers }: UsersProps) {
  const userRaw = sessionStorage.getItem("user");
  const user: User | null = userRaw ? JSON.parse(userRaw) : null;

  const isViewer = user?.role === "Viewer";

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const [newUser, setNewUser] = useState<NewUserForm>({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    role: "",
  });

  const handleAddUser = () => {
    if (users.some((user) => user.phone === newUser.phone)) {
      alert("Phone number already exists");
      return;
    }

    if (users.some((user) => user.email === newUser.email)) {
      alert("Email already exists");
      return;
    }

    if (
      !newUser.name ||
      !newUser.phone ||
      !newUser.email ||
      !newUser.department ||
      !newUser.role
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const userToAdd: User = {
      id: `USR-${String(users.length + 1).padStart(3, "0")}`,
      name: newUser.name,
      phone: newUser.phone,
      email: newUser.email,
      password: newUser.password,
      department: newUser.department,
      role: newUser.role,
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
    });

    setShowModal(false);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.phone.includes(search) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    setUsers(
      users.map((user) =>
        user.id === editingUser.id ? editingUser : user
      )
    );

    setEditingUser(null);
  };

  return (
    <div className="p-6 text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>

          <p className="text-gray-500 dark:text-gray-400">
            Manage system users and access
          </p>
        </div>

        {!isViewer && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
          >
            Add User
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm mb-5">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-left">
              <th className="p-4">ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Department</th>
              <th>Role</th>
              <th>Last Login</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="p-4">{user.id}</td>
                <td>{user.name}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>{user.department}</td>

                <td>
                  <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium">
                    {user.role}
                  </span>
                </td>

                <td>{user.lastLogin}</td>

                <td>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => setEditingUser({ ...user })}
                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this user?"
                          )
                        ) {
                          handleDeleteUser(user.id);
                        }
                      }}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-8 text-gray-500 dark:text-gray-400"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 dark:bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-[500px] text-gray-900 dark:text-gray-100">
            <h2 className="text-xl font-semibold mb-5">Add User</h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={newUser.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewUser({
                    ...newUser,
                    name: e.target.value,
                  })
                }
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2"
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={newUser.phone}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewUser({
                    ...newUser,
                    phone: e.target.value,
                  })
                }
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2"
              />

              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewUser({
                    ...newUser,
                    email: e.target.value,
                  })
                }
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2"
              />

              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewUser({
                    ...newUser,
                    password: e.target.value,
                  })
                }
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={newUser.confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewUser({
                    ...newUser,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2"
              />

              <select
                value={newUser.department}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setNewUser({
                    ...newUser,
                    department: e.target.value,
                  })
                }
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2"
              >
                <option value="" disabled>
                  Select Department
                </option>
                <option>IT</option>
                <option>Purchasing</option>
                <option>Finance</option>
                <option>Operations</option>
                <option>Administration</option>
              </select>

              <select
                value={newUser.role}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setNewUser({
                    ...newUser,
                    role: e.target.value,
                  })
                }
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2"
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option>Administrator</option>
                <option>Purchasing Manager</option>
                <option>IT Manager</option>
                <option>Finance Manager</option>
                <option>Operations Manager</option>
                <option>Viewer</option>
                
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 bg-black/30 dark:bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-[500px] text-gray-900 dark:text-gray-100">
            <h2 className="text-xl font-semibold mb-5">Edit User</h2>

            <div className="space-y-3">
              <input
                type="text"
                value={editingUser.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEditingUser({
                    ...editingUser,
                    name: e.target.value,
                  })
                }
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2"
              />

              <input
                type="text"
                value={editingUser.phone}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEditingUser({
                    ...editingUser,
                    phone: e.target.value,
                  })
                }
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2"
              />

              <input
                type="email"
                value={editingUser.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEditingUser({
                    ...editingUser,
                    email: e.target.value,
                  })
                }
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2"
              />

              <select
                value={editingUser.department}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setEditingUser({
                    ...editingUser,
                    department: e.target.value,
                  })
                }
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2"
              >
                <option>IT</option>
                <option>Purchasing</option>
                <option>Finance</option>
                <option>Operations</option>
                <option>Administration</option>
              </select>

              <select
                value={editingUser.role}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setEditingUser({
                    ...editingUser,
                    role: e.target.value,
                  })
                }
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-4 py-2"
              >
                <option>Administrator</option>
                <option>Purchasing Manager</option>
                <option>IT Manager</option>
                <option>Finance Manager</option>
                <option>Operations Manager</option>
                <option>Viewer</option>
                
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateUser}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 bg-black/30 dark:bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-[500px] text-gray-900 dark:text-gray-100">
            <h2 className="text-xl font-semibold mb-5">User Details</h2>

            <div className="space-y-3">
              <p>
                <strong>ID:</strong> {selectedUser.id}
              </p>
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Phone:</strong> {selectedUser.phone}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Department:</strong> {selectedUser.department}
              </p>
              <p>
                <strong>Role:</strong> {selectedUser.role}
              </p>
              <p>
                <strong>Last Login:</strong> {selectedUser.lastLogin}
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
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