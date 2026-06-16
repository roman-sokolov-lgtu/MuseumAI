import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../contexts/AuthContext";
import { ThemeToggle } from "../components/ThemeToggle";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Введите логин");
      return;
    }
    if (!password) {
      setError("Введите пароль");
      return;
    }
    const ok = await login(email.trim(), password);
    if (ok) {
      navigate("/", { replace: true });
    } else {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm space-y-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Вход в панель администратора
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Введите данные для входа
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="login-username">Логин</Label>
            <Input
              id="login-username"
              type="text"
              placeholder="admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Пароль</Label>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full">
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
}
