import { useNavigate } from "react-router";
import { QrCode, Info, History, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export function Home() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-center text-xl font-semibold text-gray-800 dark:text-gray-100">
            Музейный Ассистент
          </h1>
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Переключить тему"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-gray-300" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md mx-auto w-full px-6 py-8">
        <div className="mb-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <QrCode className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Добро пожаловать!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Начните интерактивную экскурсию, отсканировав QR-код экспоната
          </p>
        </div>

        {/* Main CTA Button */}
        <button
          onClick={() => navigate("/scanner")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl shadow-lg transition-colors mb-4 flex items-center justify-center gap-3"
        >
          <QrCode className="w-6 h-6" />
          <span className="text-lg font-medium">Сканировать QR-код</span>
        </button>

        {/* Info Cards */}
        <div className="space-y-3 mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                  Как это работает?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Отсканируйте QR-код на экспонате и задавайте вопросы голосом или текстом. 
                  Ассистент расскажет вам интересные факты!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-50 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                <History className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                  Бесконечный диалог
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Задавайте столько вопросов, сколько хотите. Сессия активна, пока вы общаетесь с ассистентом.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>


    </div>
  );
}