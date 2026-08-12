import { useNavigate } from "react-router-dom";
export default function ProfileDropdown() {
  const navigate = useNavigate();
  return (
    <div className="absolute right-0 top-14 w-72 bg-white rounded-2xl shadow-xl border z-50">
      <div className="p-5 border-b">
        <h3 className="font-semibold text-xl">
          John Doe
        </h3>

        <p className="text-gray-500">
          johndoe@menged.et
        </p>
      </div>

      <div className="py-2">
        <button className="w-full text-left px-5 py-3 hover:bg-gray-50">
          My Profile
        </button>

        <button className="w-full text-left px-5 py-3 hover:bg-gray-50">
          Account Settings
        </button>

        <button className="w-full text-left px-5 py-3 hover:bg-gray-50">
          Help & Support
        </button>
      </div>
<div className="border-t">
  <button
    onClick={() => {
      sessionStorage.removeItem("isLoggedIn");
      navigate("/login");
    }}
    className="w-full text-left px-5 py-4 text-red-600 hover:bg-gray-50"
  >
    Sign Out
  </button>
</div>
    </div>
  );
}