import { authFetch } from "../utils/api";
import { useState, useEffect } from "react";
import {
  FileText,
  ThumbsUp,
  ThumbsDown,
  Activity,
  Users,
  MessageSquare,
  Frame,
  Clock,
  TrendingUp,
  Zap
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "../components/ui/button";

export default function Analytics() {
  const [data, setData] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [healthStatus, setHealthStatus] = useState({ database: "...", ollama: "..." });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await authFetch("/api/analytics/detailed");
        if (response.ok) setData(await response.json());
      } catch (e) {
        console.error("Failed to fetch detailed analytics", e);
      }
    };

    const fetchDashboard = async () => {
      try {
        const response = await authFetch("/api/analytics/dashboard");
        if (response.ok) setDashboardData(await response.json());
      } catch (e) {
        console.error("Failed to fetch dashboard", e);
      }
    };

    const fetchHealth = async () => {
      try {
        const response = await authFetch("/api/health");
        if (response.ok) {
          const result = await response.json();
          setHealthStatus({ database: result.database, ollama: result.ollama });
        }
      } catch (e) {
        setHealthStatus({ database: "error", ollama: "error" });
      }
    };

    fetchAnalytics();
    fetchDashboard();
    fetchHealth();
  }, []);

  const handleGenerateReport = () => {
    if (!data || !dashboardData) return;
    
    const rows = [
      ["Метрика", "Значение"],
      ["Всего сессий", dashboardData.stats.totalSessions],
      ["Активные сейчас", dashboardData.stats.activeSessions],
      ["Всего вопросов", dashboardData.stats.totalQuestions],
      ["Экспонатов в базе", dashboardData.stats.totalExhibits],
      ["Лайки", data.likes],
      ["Дизлайки", data.dislikes],
      ["Индекс удовлетворенности (%)", data.satisfaction_ratio],
      ["Среднее время ответа (сек)", data.avg_response_time || ""]
    ];

    const csvContent = rows.map(e => e.join(";")).join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const pieData = [
    { name: "Лайки", value: data?.likes || 0, color: "#10b981" },
    { name: "Дизлайки", value: data?.dislikes || 0, color: "#ef4444" },
  ];

  const topStats = [
    {
      name: "Всего сессий",
      value: dashboardData?.stats.totalSessions ?? "...",
      icon: Users,
      color: "bg-blue-500",
      sub: "Реальные данные",
    },
    {
      name: "Активные сейчас",
      value: dashboardData?.stats.activeSessions ?? "...",
      icon: Clock,
      color: "bg-green-500",
      sub: "За 5 минут",
    },
    {
      name: "Всего вопросов",
      value: dashboardData?.stats.totalQuestions ?? "...",
      icon: MessageSquare,
      color: "bg-purple-500",
      sub: "Реальные данные",
    },
    {
      name: "Экспонатов в базе",
      value: dashboardData?.stats.totalExhibits ?? "...",
      icon: Frame,
      color: "bg-orange-500",
      sub: "Реальные данные",
    },
    {
      name: "Время ответа ИИ",
      value: data?.avg_response_time ? `${data.avg_response_time} сек` : "...",
      icon: Zap,
      color: "bg-yellow-500",
      sub: "Среднее время",
    },
  ];

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-full">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Аналитика</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Статистика и метрики качества системы</p>
        </div>
        <Button onClick={handleGenerateReport} className="bg-blue-600 hover:bg-blue-700 text-white">
          <FileText className="w-4 h-4 mr-2" />
          Сгенерировать отчёт
        </Button>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {topStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stat.sub}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value.toString()}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.name}</p>
            </div>
          );
        })}
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Сессии и вопросы (7 дней)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dashboardData?.sessionData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="sessions" stroke="#3b82f6" fill="#3b82f6" name="Сессии" />
              <Area type="monotone" dataKey="questions" stroke="#8b5cf6" fill="#8b5cf6" name="Вопросы" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Популярные экспонаты</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dashboardData?.popularExhibits || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="questions" fill="#10b981" name="Вопросов" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Удовлетворённость ответами</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <ThumbsUp className="w-5 h-5 text-green-500 mr-1" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{data?.likes ?? "..."}</div>
              <p className="text-xs text-gray-500">Лайки</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <ThumbsDown className="w-5 h-5 text-red-500 mr-1" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{data?.dislikes ?? "..."}</div>
              <p className="text-xs text-gray-500">Дизлайки</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Activity className="w-5 h-5 text-purple-500 mr-1" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {data ? `${data.satisfaction_ratio}%` : "..."}
              </div>
              <p className="text-xs text-gray-500">Индекс</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData.filter((e) => e.value > 0)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Длительность сессий</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={dashboardData?.sessionDuration?.filter((e: any) => e.count > 0) || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ range, percent }) => `${range}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                dataKey="count"
              >
                {dashboardData?.sessionDuration?.filter((e: any) => e.count > 0).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Статус системы</h2>
        <div className="flex flex-wrap gap-8">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${healthStatus.database === "ok" ? "bg-green-500" : "bg-red-500"}`} />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">База данных</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {healthStatus.database === "ok" ? "Подключена" : healthStatus.database === "..." ? "Проверка..." : "Ошибка"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${healthStatus.ollama === "ok" ? "bg-green-500" : "bg-red-500"}`} />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Нейросеть (Ollama)</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {healthStatus.ollama === "ok" ? "Запущена" : healthStatus.ollama === "..." ? "Проверка..." : "Недоступна"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
