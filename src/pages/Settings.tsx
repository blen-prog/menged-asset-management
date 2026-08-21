import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  User,
  Bell,
  Palette,
  Lock,
  ShieldCheck,
  Users,
  Settings as SettingsIcon,
  Check,
  X,
  Save,
  Package,
  ClipboardList,
  Wrench,
} from "lucide-react";

/* =========================================================
   ROLE PERMISSIONS
   ========================================================= */

const ROLE_PERMISSIONS = {
  Administrator: {
    addItem: true,
    addTransaction: true,
    requestItem: true,
    requestMaintenance: true,
  },

  "IT Manager": {
    addItem: false,
    addTransaction: false,
    requestItem: true,
    requestMaintenance: true,
  },

  "Purchasing Manager": {
    addItem: true,
    addTransaction: true,
    requestItem: true,
    requestMaintenance: true,
  },

  "Finance Manager": {
    addItem: false,
    addTransaction: false,
    requestItem: true,
    requestMaintenance: true,
  },

  "Operations Manager": {
    addItem: false,
    addTransaction: false,
    requestItem: true,
    requestMaintenance: true,
  },
};

/* =========================================================
   DEFAULT SETTINGS
   ========================================================= */

const DEFAULT_SETTINGS = {
  maintenanceNotifications: true,
  itemRequestNotifications: true,
  transactionNotifications: true,
  lowStockNotifications: true,
  emailNotifications: false,

  theme: "light",

  maintenanceReminderDays: "30",
  defaultInventoryUnit: "Piece",
};

/* =========================================================
   MAIN SETTINGS COMPONENT
   ========================================================= */

export default function Settings() {
  const [user, setUser] = useState(null);
  const [searchParams] = useSearchParams();
  
  const [activeSection, setActiveSection] =
  useState(
    searchParams.get("section") || "profile"
  );
  useEffect(() => {
  const section =
    searchParams.get("section");

  if (section) {
    setActiveSection(section);
  }
}, [searchParams]);
  
  const [settings, setSettings] = useState(() => {
    const saved =
      localStorage.getItem("menged-settings");

    if (saved) {
      return {
        ...DEFAULT_SETTINGS,
        ...JSON.parse(saved),
      };
    }

    return DEFAULT_SETTINGS;
  });

  /* =======================================================
     LOAD CURRENT USER
     ======================================================= */

  useEffect(() => {
    const storedUser =
      sessionStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  /* =======================================================
     APPLY THEME
     ======================================================= */

  useEffect(() => {
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem(
      "menged-settings",
      JSON.stringify(settings)
    );
  }, [settings]);

  /* =======================================================
     LOADING
     ======================================================= */

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500">
          Loading settings...
        </p>
      </div>
    );
  }

  /* =======================================================
     USER ROLE
     ======================================================= */

  const role = user.role;

  const permissions =
    ROLE_PERMISSIONS[role] ||
    ROLE_PERMISSIONS["Operations Manager"];

  const isAdmin =
    role === "Administrator";

  /* =======================================================
     UPDATE SETTING
     ======================================================= */

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  /* =======================================================
     SAVE
     ======================================================= */

  const saveSettings = () => {
    localStorage.setItem(
      "menged-settings",
      JSON.stringify(settings)
    );

    alert("Settings saved successfully.");
  };

  /* =======================================================
     MENU
     ======================================================= */

  const menuItems = [
    {
      id: "profile",
      label: "My Profile",
      icon: User,
    },

    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },

    {
      id: "appearance",
      label: "Appearance",
      icon: Palette,
    },

    {
      id: "security",
      label: "Security",
      icon: Lock,
    },

    {
      id: "access",
      label: "My Access",
      icon: ShieldCheck,
    },
  ];

  /* ADMIN ONLY */

  if (isAdmin) {
    menuItems.push(
      {
        id: "users",
        label: "User & Role Management",
        icon: Users,
      },
      {
        id: "system",
        label: "System Settings",
        icon: SettingsIcon,
      }
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 dark:bg-gray-900">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>

        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Manage your account and settings based on your role.
        </p>

      </div>

      {/* =================================================
          MAIN LAYOUT
      ================================================= */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[250px_1fr]">

        {/* =================================================
            LEFT MENU
        ================================================= */}

        <div className="h-fit rounded-xl bg-white p-3 shadow-sm dark:bg-gray-800">

          {/* ROLE CARD */}

          <div className="mb-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">

            <p className="text-xs font-medium uppercase tracking-wide text-blue-600 dark:text-blue-400">
              Current Role
            </p>

            <p className="mt-1 font-semibold text-gray-900 dark:text-white">
              {user.role}
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.department}
            </p>

          </div>

          {/* MENU */}

          {menuItems.map((item) => {

            const Icon = item.icon;

            const active =
              activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() =>
                  setActiveSection(item.id)
                }
                className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >

                <Icon size={18} />

                <span>
                  {item.label}
                </span>

              </button>
            );
          })}

        </div>

        {/* =================================================
            RIGHT CONTENT
        ================================================= */}

        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">

          {/* =================================================
              PROFILE
          ================================================= */}

          {activeSection === "profile" && (
            <ProfileSection user={user} />
          )}

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          {activeSection === "notifications" && (
            <NotificationsSection
              settings={settings}
              updateSetting={updateSetting}
              saveSettings={saveSettings}
            />
          )}

          {/* =================================================
              APPEARANCE
          ================================================= */}

          {activeSection === "appearance" && (
            <AppearanceSection
              settings={settings}
              updateSetting={updateSetting}
            />
          )}

          {/* =================================================
              SECURITY
          ================================================= */}

          {activeSection === "security" && (
            <SecuritySection user={user} />
          )}

          {/* =================================================
              MY ACCESS
          ================================================= */}

          {activeSection === "access" && (
            <AccessSection
              user={user}
              permissions={permissions}
            />
          )}

          {/* =================================================
              ADMIN: USERS
          ================================================= */}

          {activeSection === "users" &&
            isAdmin && (
              <UserManagementSection />
            )}

          {/* =================================================
              ADMIN: SYSTEM
          ================================================= */}

          {activeSection === "system" &&
            isAdmin && (
              <SystemSettingsSection
                settings={settings}
                updateSetting={updateSetting}
                saveSettings={saveSettings}
              />
            )}

        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PROFILE SECTION
   ========================================================= */

function ProfileSection({ user }) {
  return (
    <section>

      <SectionHeader
        title="My Profile"
        description="View your personal and organizational information."
      />

      {/* PROFILE HEADER */}

      <div className="mb-8 flex items-center gap-4">

        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
          {getInitials(user.name)}
        </div>

        <div>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {user.name}
          </h2>

          <p className="text-gray-500 dark:text-gray-400">
            {user.role}
          </p>

        </div>

      </div>

      {/* INFORMATION */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        <InfoField
          label="Employee ID"
          value={user.id}
        />

        <InfoField
          label="Full Name"
          value={user.name}
        />

        <InfoField
          label="Phone Number"
          value={user.phone}
        />

        <InfoField
          label="Email"
          value={user.email}
        />

        <InfoField
          label="Department"
          value={user.department}
        />

        <InfoField
          label="Role"
          value={user.role}
        />

        <InfoField
          label="Account Status"
          value={user.status}
        />

        <InfoField
          label="Last Login"
          value={user.lastLogin}
        />

      </div>

      <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">

        Your department and role are assigned by an
        Administrator and cannot be changed here.

      </div>

    </section>
  );
}

/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function NotificationsSection({
  settings,
  updateSetting,
  saveSettings,
}) {
  return (
    <section>

      <SectionHeader
        title="Notifications"
        description="Choose which notifications you want to receive."
      />

      <div className="space-y-4">

        <Toggle
          icon={<Wrench size={19} />}
          title="Maintenance notifications"
          description="Receive updates about maintenance requests and scheduled maintenance."
          checked={
            settings.maintenanceNotifications
          }
          onChange={(value) =>
            updateSetting(
              "maintenanceNotifications",
              value
            )
          }
        />

        <Toggle
          icon={<Package size={19} />}
          title="Item request notifications"
          description="Receive updates when an item request is created or processed."
          checked={
            settings.itemRequestNotifications
          }
          onChange={(value) =>
            updateSetting(
              "itemRequestNotifications",
              value
            )
          }
        />

        <Toggle
          icon={<ClipboardList size={19} />}
          title="Transaction notifications"
          description="Receive notifications related to inventory transactions."
          checked={
            settings.transactionNotifications
          }
          onChange={(value) =>
            updateSetting(
              "transactionNotifications",
              value
            )
          }
        />

        <Toggle
          icon={<Package size={19} />}
          title="Low-stock alerts"
          description="Receive alerts when inventory items reach a low level."
          checked={
            settings.lowStockNotifications
          }
          onChange={(value) =>
            updateSetting(
              "lowStockNotifications",
              value
            )
          }
        />

        <Toggle
          icon={<Bell size={19} />}
          title="Email notifications"
          description="Receive important system notifications by email."
          checked={
            settings.emailNotifications
          }
          onChange={(value) =>
            updateSetting(
              "emailNotifications",
              value
            )
          }
        />

      </div>

      <SaveButton
        onClick={saveSettings}
      />

    </section>
  );
}

/* =========================================================
   APPEARANCE
   ========================================================= */

function AppearanceSection({
  settings,
  updateSetting,
}) {
  return (
    <section>

      <SectionHeader
        title="Appearance"
        description="Customize how Menged looks on your device."
      />

      <h3 className="mb-4 font-medium text-gray-900 dark:text-white">
        Theme
      </h3>

      <div className="grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">

        {/* LIGHT */}

        <button
          onClick={() =>
            updateSetting("theme", "light")
          }
          className={`rounded-xl border-2 p-4 text-left ${
            settings.theme === "light"
              ? "border-blue-600"
              : "border-gray-200 dark:border-gray-700"
          }`}
        >

          <div className="mb-4 h-24 rounded-lg bg-gray-100" />

          <div className="flex items-center justify-between">

            <span className="font-medium text-gray-900 dark:text-white">
              Light
            </span>

            {settings.theme === "light" && (
              <Check
                size={20}
                className="text-blue-600"
              />
            )}

          </div>

        </button>

        {/* DARK */}

        <button
          onClick={() =>
            updateSetting("theme", "dark")
          }
          className={`rounded-xl border-2 p-4 text-left ${
            settings.theme === "dark"
              ? "border-blue-600"
              : "border-gray-200 dark:border-gray-700"
          }`}
        >

          <div className="mb-4 h-24 rounded-lg bg-gray-900" />

          <div className="flex items-center justify-between">

            <span className="font-medium text-gray-900 dark:text-white">
              Dark
            </span>

            {settings.theme === "dark" && (
              <Check
                size={20}
                className="text-blue-600"
              />
            )}

          </div>

        </button>

      </div>

      <p className="mt-5 text-sm text-gray-500 dark:text-gray-400">
        Your appearance preference is saved automatically.
      </p>

    </section>
  );
}

/* =========================================================
   SECURITY
   ========================================================= */

function SecuritySection({ user }) {
  return (
    <section>

      <SectionHeader
        title="Security"
        description="View information about your account security."
      />

      <div className="max-w-xl space-y-5">

        <InfoField
          label="Account"
          value={user.email}
        />

        <InfoField
          label="Last Login"
          value={user.lastLogin}
        />

        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-300">

          <div className="flex gap-3">

            <Lock size={19} />

            <div>

              <p className="font-medium">
                Password management
              </p>

              <p className="mt-1">
                Password changes are currently handled
                by the system administrator.
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

/* =========================================================
   MY ACCESS
   ========================================================= */

function AccessSection({
  user,
  permissions,
}) {
  return (
    <section>

      <SectionHeader
        title="My Access"
        description="See what you can do in the Menged system."
      />

      {/* ROLE CARD */}

      <div className="mb-8 rounded-xl bg-gray-50 p-5 dark:bg-gray-700">

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Your role
        </p>

        <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
          {user.role}
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {user.department} Department
        </p>

      </div>

      {/* PERMISSIONS */}

      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Your Permissions
      </h3>

      <div className="space-y-3">

        <AccessRow
          icon={<Package size={18} />}
          label="Add New Item"
          allowed={permissions.addItem}
        />

        <AccessRow
          icon={<ClipboardList size={18} />}
          label="Add New Transaction"
          allowed={permissions.addTransaction}
        />

        <AccessRow
          icon={<Package size={18} />}
          label="Request Item"
          allowed={permissions.requestItem}
        />

        <AccessRow
          icon={<Wrench size={18} />}
          label="Request Maintenance"
          allowed={
            permissions.requestMaintenance
          }
        />

      </div>

      <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-500 dark:bg-gray-700 dark:text-gray-300">

        Permissions are assigned according to your role
        and cannot be changed from your account.

      </div>

    </section>
  );
}

/* =========================================================
   ADMIN USER MANAGEMENT
   ========================================================= */

function UserManagementSection() {
  return (
    <section>

      <SectionHeader
        title="User & Role Management"
        description="Administrator controls for managing system users and roles."
      />

      <div className="space-y-4">

        <AdminCard
          icon={<Users size={22} />}
          title="Manage Users"
          description="Add, deactivate, and manage system users."
          buttonText="Go to Users"
          path="/users"
        />

        <AdminCard
          icon={<ShieldCheck size={22} />}
          title="Manage Roles"
          description="Assign roles and departments to users."
          buttonText="Manage Roles"
        />

      </div>

      <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">

        Only Administrators have access to user and role
        management.

      </div>

    </section>
  );
}

/* =========================================================
   ADMIN SYSTEM SETTINGS
   ========================================================= */

function SystemSettingsSection({
  settings,
  updateSetting,
  saveSettings,
}) {
  return (
    <section>

      <SectionHeader
        title="System Settings"
        description="Configure system-wide preferences."
      />

      <div className="max-w-xl space-y-6">

        <div>

          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Default Inventory Unit
          </label>

          <select
            value={
              settings.defaultInventoryUnit
            }
            onChange={(e) =>
              updateSetting(
                "defaultInventoryUnit",
                e.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >

            <option>Piece</option>
            <option>Box</option>
            <option>Pack</option>
            <option>Unit</option>

          </select>

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Maintenance Reminder Period
          </label>

          <select
            value={
              settings.maintenanceReminderDays
            }
            onChange={(e) =>
              updateSetting(
                "maintenanceReminderDays",
                e.target.value
              )
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >

            <option value="7">
              7 Days
            </option>

            <option value="14">
              14 Days
            </option>

            <option value="30">
              30 Days
            </option>

            <option value="60">
              60 Days
            </option>

            <option value="90">
              90 Days
            </option>

          </select>

        </div>

        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">

          <div className="flex items-start gap-3">

            <ShieldCheck
              size={20}
              className="mt-1 text-blue-600"
            />

            <div>

              <h3 className="font-medium text-gray-900 dark:text-white">
                Role-based access control
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                System access is controlled according to
                each user's assigned role.
              </p>

            </div>

          </div>

        </div>

        <SaveButton
          onClick={saveSettings}
        />

      </div>

    </section>
  );
}

/* =========================================================
   SMALL COMPONENTS
   ========================================================= */

function SectionHeader({
  title,
  description,
}) {
  return (
    <div className="mb-8 border-b border-gray-200 pb-5 dark:border-gray-700">

      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h2>

      <p className="mt-1 text-gray-500 dark:text-gray-400">
        {description}
      </p>

    </div>
  );
}

function InfoField({
  label,
  value,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </label>

      <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
        {value || "Not available"}
      </div>

    </div>
  );
}

function Toggle({
  icon,
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-lg border border-gray-200 p-4 dark:border-gray-700">

      <div className="flex items-start gap-3">

        <div className="mt-1 text-blue-600">
          {icon}
        </div>

        <div>

          <h3 className="font-medium text-gray-900 dark:text-white">
            {title}
          </h3>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>

        </div>

      </div>

      <button
        type="button"
        onClick={() =>
          onChange(!checked)
        }
        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition ${
          checked
            ? "bg-blue-600"
            : "bg-gray-300 dark:bg-gray-600"
        }`}
      >

        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />

      </button>

    </div>
  );
}

function AccessRow({
  icon,
  label,
  allowed,
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">

      <div className="flex items-center gap-3">

        <div className="text-gray-500 dark:text-gray-400">
          {icon}
        </div>

        <span className="font-medium text-gray-800 dark:text-gray-200">
          {label}
        </span>

      </div>

      {allowed ? (
        <span className="flex items-center gap-1 text-sm font-medium text-green-600">
          <Check size={17} />
          Allowed
        </span>
      ) : (
        <span className="flex items-center gap-1 text-sm font-medium text-gray-400">
          <X size={17} />
          Not Allowed
        </span>
      )}

    </div>
  );
}

function SaveButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-6 flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
    >

      <Save size={18} />

      Save Changes

    </button>
  );
}

function AdminCard({
  icon,
  title,
  description,
  buttonText,
  path,
}: {
  icon: any;
  title: string;
  description: string;
  buttonText: string;
  path?: string;
}) {
  const handleClick = () => {
    if (path) {
      window.location.href = path;
    }
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 p-5 dark:border-gray-700">

      <div className="flex items-center gap-4">

        <div className="rounded-lg bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20">

          {icon}

        </div>

        <div>

          <h3 className="font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>

        </div>

      </div>

      {path && (
        <button
          onClick={handleClick}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500"
        >
          {buttonText}
        </button>
      )}

    </div>
  );
}

function getInitials(name = "") {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}