import { useState, useEffect, useRef } from "react";
import { Bell, ChevronDown } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";

interface User {
  name?: string;
  role?: string;
}

interface Notification {
  id: number;
  read: boolean;
  type: string;
  title: string;
  time: string;
  targetRole?: string;
}

interface TopbarProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<
    React.SetStateAction<Notification[]>
  >;
}

export default function Topbar({
  notifications,
  setNotifications,
}: TopbarProps) {


  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showProfile, setShowProfile] = useState<boolean>(false);
  

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const user: User | null = JSON.parse(
    sessionStorage.getItem("user") || "null"
  );

  const visibleNotifications =
  notifications.filter(
    (notification) =>
      !notification.targetRole ||
      notification.targetRole === user?.role
  );

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    }
    

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
 

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-8 h-20 relative transition-colors duration-200">
      <div className="flex items-center gap-8 ml-auto"></div>

      {/* Right Side */}
      <div className="flex items-center gap-8">
        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Notifications"
          >
            <Bell
              size={24}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            />
          </button>

          {visibleNotifications.filter(
  (notification) => !notification.read
).length > 0 && (
  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
    {
  visibleNotifications.filter(
    (notification) =>
      !notification.read
  ).length
}
  </span>
)}

          {showNotifications && <NotificationDropdown
  notifications={visibleNotifications}
  setNotifications={setNotifications}
/>}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              {initials || "U"}
            </div>

            <div className="text-left">
              <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role || "Guest"}
              </p>
            </div>

            <ChevronDown size={18} className="text-gray-600 dark:text-gray-400" />
          </button>

          {showProfile && <ProfileDropdown />}
        </div>
      </div>
    </div>
  );
}