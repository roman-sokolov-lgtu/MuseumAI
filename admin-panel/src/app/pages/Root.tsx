import { authFetch } from "../utils/api";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Frame,
  MessageSquare,
  BarChart3,
  LogOut,
  Menu,
  X,
  KeyRound,
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "../components/ThemeToggle";
import { useAuth } from "../contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import ChangePasswordDialog from "../components/ChangePasswordDialog";

function getInitials(name: string, email: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  if (name.length >= 2) return name.slice(0, 2).toUpperCase();
  if (email.length >= 2) return email.slice(0, 2).toUpperCase();
  return "?";
}

export default function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  const handleChangePassword = () => {
    setProfileOpen(false);
    setChangePasswordOpen(true);
  };

  const navigation = [
    { name: "Аналитика", href: "/", icon: BarChart3 },
    { name: "Экспонаты", href: "/exhibits", icon: Frame },
    { name: "Диалоги", href: "/dialogs", icon: MessageSquare },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          {isSidebarOpen && (
            <h1 className="font-semibold text-lg text-gray-900 dark:text-white">
              Панель администратора
            </h1>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && (
                  <span className="font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer: профиль и тема на одном уровне (при свёрнутой панели — друг над другом) */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div
            className={`flex w-full gap-2 ${
              isSidebarOpen
                ? "flex-row items-center"
                : "flex-col items-center"
            }`}
          >
            <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={`flex items-center rounded-lg p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-800 ${
                    isSidebarOpen ? "min-w-0 flex-1 gap-3" : "justify-center w-full max-w-[52px]"
                  }`}
                >
                  <Avatar className="h-9 w-9 shrink-0 rounded-full bg-orange-500 text-white text-sm font-medium">
                    <AvatarFallback>
                      {user ? getInitials(user.name, user.email) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  {isSidebarOpen && (
                    <span className="font-medium truncate text-left">
                      {user?.name || user?.email || "Профиль"}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align={isSidebarOpen ? "start" : "center"}
              sideOffset={8}
              className="min-w-[220px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
            >
              <div className="px-2 py-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-9 w-9 shrink-0 rounded-full bg-orange-500 text-white text-sm font-medium">
                    <AvatarFallback>
                      {user ? getInitials(user.name, user.email) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate">
                      {user?.name || "Пользователь"}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.email || ""}
                    </span>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />
              <DropdownMenuItem
                onClick={handleChangePassword}
                className="cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700"
              >
                <KeyRound className="w-4 h-4 mr-2" />
                Сменить пароль
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                variant="destructive"
                className="cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Выход
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
            <span className={`shrink-0 ${!isSidebarOpen ? "w-full flex justify-center" : ""}`}>
              <ThemeToggle />
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      <ChangePasswordDialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
    </div>
  );
}