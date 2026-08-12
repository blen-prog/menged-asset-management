import { useState, useEffect, useRef } from "react";
import { Search, Bell, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";

export default function Topbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const location = useLocation();
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
  function handleClickOutside(event) {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setShowNotifications(false);
    }

    if (
      profileRef.current &&
      !profileRef.current.contains(event.target)
    ) {
      setShowProfile(false);
    }
  }

  document.addEventListener("click", handleClickOutside);

  return () => {
    document.removeEventListener(
      "click",
      handleClickOutside
    );
  };
}, []);

  return (
    <div className="bg-white border-b flex items-center px-8 h-20 relative">
      {/* Search Bar */}
      {location.pathname === "/" && (
  <div className="flex items-center">
    <div className="relative">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        placeholder="Search assets, inventory, employees..."
        className="w-[550px] pl-12 pr-4 py-3 border rounded-xl bg-gray-50"
      />
    </div>
  </div>
)}
<div className="flex items-center gap-8 ml-auto"></div>


      {/* Right Side */}
      <div className="flex items-center gap-8">
        <div
          className="relative"
          ref={notificationRef}
        >
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
          >
            <Bell
              size={24}
              className="text-gray-600"
            />
          </button>

          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
            3
          </span>

          {showNotifications && (
            <NotificationDropdown />
          )}
        </div>

        <div
          className="relative"
          ref={profileRef}
        >
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              JD
            </div>

            <div className="text-left">
              <p className="font-medium text-sm">
                John Doe
              </p>

              <p className="text-xs text-gray-500">
                Administrator
              </p>
            </div>

            <ChevronDown size={18} />
          </button>

          {showProfile && (
            <ProfileDropdown />
          )}
        </div>
      </div>
    </div>
  );
}