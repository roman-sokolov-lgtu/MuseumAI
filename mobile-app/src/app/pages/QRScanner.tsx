import { useState } from "react";
import { useNavigate } from "react-router";
import { QrCode, X, AlertCircle, Sun, Moon, Camera } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import {
  BarcodeScanner,
  BarcodeFormat,
} from "@capacitor-mlkit/barcode-scanning";


export function QRScanner() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const handleScannedValue = (rawValue: string) => {
    let finalValue = rawValue;
    if (rawValue.includes("museum://exhibit/")) {
      finalValue = rawValue.split("/").pop() || rawValue;
    }
    navigate(`/session/${finalValue}`);
  };

  const startScan = async () => {
    try {
      setError(null);
      setScanning(true);

      const { camera } = await BarcodeScanner.requestPermissions();
      if (camera !== "granted" && camera !== "limited") {
        setError("Нет разрешения на использование камеры. Разрешите доступ в настройках.");
        setScanning(false);
        return;
      }

      const { barcodes } = await BarcodeScanner.scan({
        formats: [BarcodeFormat.QrCode],
      });

      setScanning(false);

      if (barcodes.length > 0) {
        handleScannedValue(barcodes[0].rawValue);
      }
    } catch (err) {
      console.error("Scan error:", err);
      setError("Не удалось запустить сканер. Попробуйте ещё раз.");
      setScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-gray-900 dark:text-white font-semibold">Сканирование QR-кода</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Переключить тему"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-700 dark:text-white" />
            </button>
          </div>
        </div>
      </header>

      
      <main className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <div className="w-full max-w-sm flex flex-col items-center gap-6">
          <div className="w-48 h-48 rounded-3xl bg-gray-100 dark:bg-gray-800 border-4 border-blue-500 flex items-center justify-center">
            {scanning ? (
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent" />
            ) : (
              <QrCode className="w-24 h-24 text-blue-500 dark:text-blue-400" />
            )}
          </div>

          <button
            onClick={startScan}
            disabled={scanning}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:opacity-60 text-white py-4 px-6 rounded-2xl shadow-lg transition-colors text-lg font-semibold"
          >
            <Camera className="w-6 h-6" />
            {scanning ? "Открываю камеру..." : "Начать сканирование"}
          </button>

          <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
            Наведите камеру на QR-код рядом с экспонатом.{"\n"}
            Код считается автоматически.
          </p>

          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/40 border border-red-300 dark:border-red-700 rounded-xl p-4 flex items-start gap-3 w-full">
              <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
