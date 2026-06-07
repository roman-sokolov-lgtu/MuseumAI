import { authFetch } from "../utils/api";
import { useState, useEffect } from "react";
import {
  Users,
  MessageSquare,
  Frame,
  TrendingUp,
  Clock,
  Download,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "../components/ui/button";

// Removed mock data

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authFetch("/api/analytics/dashboard");
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  const stats = [
    {
      name: "Всего сессий",
      value: dashboardData ? dashboardData.stats.totalSessions.toString() : "...",
      change: "Реальные данные",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      name: "Активные сейчас",
      value: dashboardData ? dashboardData.stats.activeSessions.toString() : "...",
      change: "За 30 минут",
      icon: Clock,
      color: "bg-green-500",
    },
    {
      name: "Всего вопросов",
      value: dashboardData ? dashboardData.stats.totalQuestions.toString() : "...",
      change: "Реальные данные",
      icon: MessageSquare,
      color: "bg-purple-500",
    },
    {
      name: "Экспонатов в базе",
      value: dashboardData ? dashboardData.stats.totalExhibits.toString() : "...",
      change: "Реальные данные",
      icon: Frame,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Дашборд</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Общая статистика системы</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Download className="w-4 h-4 mr-2" />
          Экспорт отчета
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.name}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sessions and Questions Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Сессии и вопросы
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dashboardData ? dashboardData.sessionData : []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="sessions"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                name="Сессии"
              />
              <Area
                type="monotone"
                dataKey="questions"
                stackId="2"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                name="Вопросы"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Popular Exhibits */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Популярные экспонаты
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData ? dashboardData.popularExhibits : []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="questions" fill="#10b981" name="Вопросов" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Session Duration */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Длительность сессий
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData ? dashboardData.sessionDuration.filter((e: any) => e.count > 0) : []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ range, percent }) =>
                  `${range}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
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
    </div>
  );
}