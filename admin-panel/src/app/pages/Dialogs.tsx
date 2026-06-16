import { authFetch } from "../utils/api";
import { useState, useEffect } from "react";
import { Search, Download, Calendar, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "../components/ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  feedback?: "like" | "dislike" | null;
}

interface Dialog {
  id: string;
  sessionId: string;
  exhibitName: string;
  date: string;
  duration: string;
  messagesCount: number;
  messages: Message[];
}

export default function Dialogs() {
  const [dialogs, setDialogs] = useState<Dialog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedDialog, setExpandedDialog] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [feedbackFilter, setFeedbackFilter] = useState<"all" | "positive" | "negative" | "unrated">("all");

  useEffect(() => {
    const fetchDialogs = async () => {
      try {
        const response = await authFetch("/api/dialogs");
        if (response.ok) {
          const data = await response.json();

          const formattedData = data.map((d: any) => {
            const dDate = new Date(d.date);
            const dateStr = dDate.toLocaleDateString('ru-RU') + ' ' + dDate.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});
            return {
              ...d,
              date: dateStr,
              messages: d.messages.map((m: any) => ({
                ...m,
                timestamp: new Date(m.timestamp).toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})
              }))
            };
          });
          setDialogs(formattedData);
        }
      } catch (error) {
        console.error("Failed to fetch dialogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDialogs();
  }, []);

  const filteredDialogs = dialogs.filter((dialog) => {
    const matchesSearch =
      dialog.exhibitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dialog.sessionId.toLowerCase().includes(searchQuery.toLowerCase());
      
    let matchesDate = true;
    if (selectedDate) {
      const [year, month, day] = selectedDate.split("-");
      const formattedDate = `${day}.${month}.${year}`;
      matchesDate = dialog.date.includes(formattedDate);
    }
    
    let matchesFeedback = true;
    if (feedbackFilter !== "all") {
      const hasPositive = dialog.messages.some(m => m.feedback === "like");
      const hasNegative = dialog.messages.some(m => m.feedback === "dislike");
      if (feedbackFilter === "positive") matchesFeedback = hasPositive;
      else if (feedbackFilter === "negative") matchesFeedback = hasNegative;
      else if (feedbackFilter === "unrated") matchesFeedback = !hasPositive && !hasNegative;
    }
    
    return matchesSearch && matchesDate && matchesFeedback;
  });

  const handleExport = () => {

    const rows = [
      ["ID Сессии", "Дата", "Длительность", "Экспонат", "Роль", "Сообщение", "Время", "Отзыв"]
    ];

    filteredDialogs.forEach((dialog) => {
      dialog.messages.forEach((msg) => {
        const cleanContent = msg.content.replace(/\r?\n|\r/g, ' ');
        const escapedContent = `"${cleanContent.replace(/"/g, '""')}"`;
        rows.push([
          dialog.sessionId,
          dialog.date,
          dialog.duration,
          `"${dialog.exhibitName}"`,
          msg.role === "user" ? "Посетитель" : "Ассистент",
          escapedContent,
          msg.timestamp,
          msg.feedback === "like" ? "Лайк" : (msg.feedback === "dislike" ? "Дизлайк" : "")
        ]);
      });
    });

    const csvContent = rows.map(e => e.join(";")).join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dialogs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleDialog = (id: string) => {
    setExpandedDialog(expandedDialog === id ? null : id);
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-full">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Обезличенные диалоги
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Всего диалогов: {loading ? "..." : dialogs.length}
          </p>
        </div>
        <Button
          onClick={handleExport}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Экспорт данных
        </Button>
      </div>

      
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Поиск по экспонату или ID сессии..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <select
            value={feedbackFilter}
            onChange={(e) => setFeedbackFilter(e.target.value as any)}
            className="pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="all">Все отзывы</option>
            <option value="positive">Положительные (Лайки)</option>
            <option value="negative">Отрицательные (Дизлайки)</option>
            <option value="unrated">Без оценки</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      
      <div className="space-y-4">
        {filteredDialogs.map((dialog) => (
          <div
            key={dialog.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            
            <div
              onClick={() => toggleDialog(dialog.id)}
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {dialog.exhibitName}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    {dialog.sessionId}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{dialog.date}</span>
                  <span>•</span>
                  <span>Длительность: {dialog.duration}</span>
                  <span>•</span>
                  <span>Сообщений: {dialog.messagesCount}</span>
                </div>
              </div>
              {expandedDialog === dialog.id ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>

            
            {expandedDialog === dialog.id && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
                <div className="space-y-4">
                  {dialog.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium opacity-75">
                            {message.role === "user"
                              ? "Посетитель"
                              : "Ассистент"}
                          </span>
                          <span className="text-xs opacity-50">
                            {message.timestamp}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                        {message.role === "assistant" && (
                          <div className={`flex items-center gap-2 mt-2 pt-2 border-t ${
                            message.role === "user" 
                              ? "border-blue-500" 
                              : "border-gray-100 dark:border-gray-700"
                          }`}>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Отзыв:</span>
                            {message.feedback === "like" && (
                              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                <ThumbsUp className="w-3 h-3 fill-current" />
                                <span className="text-xs">Полезно</span>
                              </div>
                            )}
                            {message.feedback === "dislike" && (
                              <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                                <ThumbsDown className="w-3 h-3 fill-current" />
                                <span className="text-xs">Не полезно</span>
                              </div>
                            )}
                            {message.feedback === null && (
                              <span className="text-xs text-gray-400">Не оценено</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredDialogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Диалоги не найдены</p>
        </div>
      )}
    </div>
  );
}
