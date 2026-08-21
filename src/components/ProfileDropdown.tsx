import { useNavigate } from "react-router-dom";

interface User {
  name?: string;
  email?: string;
}

export default function ProfileDropdown() {
  const navigate = useNavigate();

  const user: User | null = JSON.parse(
    sessionStorage.getItem("user") || "null"
  );

  return (
    <div className="absolute right-0 top-14 w-72 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 z-50 transition-colors duration-200">
      {/* User Details */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-800">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
          {user?.name || "User"}
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {user?.email || "user@example.com"}
        </p>
      </div>

      {/* Navigation Links */}
      <div className="py-2">
        

        <button
  onClick={() => navigate("/settings")}
  className="w-full text-left px-5 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
>
  Account Settings
</button>

        
      </div>

      {/* Logout Action */}
      <div className="border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={() => {
            sessionStorage.removeItem("isLoggedIn");
            sessionStorage.removeItem("user");
            navigate("/login");
          }}
          className="w-full text-left px-5 py-4 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-b-2xl transition-colors font-medium"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}