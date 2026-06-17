import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { 
  ArrowLeft, 
  Mic, 
  Send, 
  Volume2, 
  Moon,
  Sun,
  ThumbsUp,
  ThumbsDown,
  Square,
  X
} from "lucide-react";
import { Message } from "../types/session";
import { useTheme } from "../context/ThemeContext";
import { getExhibitByQr, sendMessage, submitFeedback, getWelcome, ApiError, RATE_LIMITED_MESSAGE } from "../api";
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';

export function ChatSession() {
  const { exhibitId } = useParams<{ exhibitId: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [exhibit, setExhibit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const loadExhibit = async () => {
      if (!exhibitId) {
        navigate("/");
        return;
      }
      try {
        const data = await getExhibitByQr(exhibitId);
        if (data) {
          setExhibit(data);
          
          try {
            const aiWelcome = await getWelcome(data.qrCode);

            const welcomeMessage: Message = {
              id: "welcome",
              type: "assistant",
              content: aiWelcome,
              timestamp: new Date(),
            };
            setMessages([welcomeMessage]);
            setChatHistory([{ role: "assistant", content: aiWelcome }]);
          } catch (err) {
            const isRateLimited = err instanceof ApiError && err.status === 429;
            const fallbackContent = isRateLimited
              ? RATE_LIMITED_MESSAGE
              : `Здравствуйте! Я ваш виртуальный ассистент. Вы находитесь у экспоната "${data.name}". О чем бы вы хотели узнать?`;
            const fallbackMessage: Message = {
              id: "welcome",
              type: "assistant",
              content: fallbackContent,
              timestamp: new Date(),
            };
            setMessages([fallbackMessage]);
            setChatHistory([{ role: "assistant", content: fallbackContent }]);
          }
        } else {
          setApiError(`Экспонат "${exhibitId}" не найден в базе данных.`);
        }
      } catch (err: any) {
        console.error("Failed to load exhibit", err);
        setApiError(`Ошибка подключения к серверу.\n\nПроверьте, что телефон в одной Wi-Fi сети с сервером.\n\nДетали: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    loadExhibit();
  }, [exhibitId, navigate]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  useEffect(() => {
    if (messages.length === 0) return;
    const lastMsgTime = messages[messages.length - 1].timestamp.getTime();
    
    const checkExpiration = () => {
      if (Date.now() - lastMsgTime > 5 * 60 * 1000) {
        setIsSessionExpired(true);
      }
    };
    

    checkExpiration();
    const interval = setInterval(checkExpiration, 10000);
    return () => clearInterval(interval);
  }, [messages]);



  const handleSendMessage = async () => {
    const textToSend = inputText;
    if (!textToSend.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: textToSend,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);


    const newHistory = [...chatHistory, { role: "user", content: textToSend }];

    try {
      const historyToPass = chatHistory.slice(-10);
      const { answer, sessionId: newSessionId, answerId } = await sendMessage(textToSend, exhibit?.qrCode || "", historyToPass, sessionId);
      if (!sessionId && newSessionId) setSessionId(newSessionId);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: answer,
        timestamp: new Date(),
        answerId: answerId
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setChatHistory([...newHistory, { role: "assistant", content: answer }]);
    } catch (err: any) {
      const isRateLimited = err instanceof ApiError && err.status === 429;
      const errorContent = isRateLimited
        ? RATE_LIMITED_MESSAGE
        : `⚠️ Не удалось получить ответ от ИИ-гида. Проверьте подключение к серверу и попробуйте ещё раз.`;
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: errorContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = async () => {
    try {
      const available = await SpeechRecognition.available();
      if (!available.available) {
        alert("Распознавание речи не поддерживается на вашем устройстве.");
        return;
      }
      
      let permission = await SpeechRecognition.checkPermissions();
      if (permission.speechRecognition !== 'granted') {
        permission = await SpeechRecognition.requestPermissions();
      }

      if (permission.speechRecognition !== 'granted') {
        alert("Доступ к микрофону отклонен. Пожалуйста, разрешите доступ в настройках устройства для использования голосового ввода.");
        return;
      }

      setIsRecording(true);
      
      const result = await SpeechRecognition.start({
        language: "ru-RU",
        maxResults: 1,
        prompt: "Говорите...",
        partialResults: false,
        popup: true,
      });

      if (result.matches && result.matches.length > 0) {
        const text = result.matches[0];
        setInputText(text);
      }
    } catch (err: any) {
      console.error("Speech recognition error:", err);

    } finally {
      setIsRecording(false);
    }
  };

  const handleSpeakText = async (messageId: string, text: string) => {
    try {
      if (speakingMessageId === messageId) {
        await TextToSpeech.stop();
        setSpeakingMessageId(null);
        return;
      }

      if (speakingMessageId) {
        await TextToSpeech.stop();
      }

      setSpeakingMessageId(messageId);
      await TextToSpeech.speak({
        text: text,
        lang: 'ru-RU',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        category: 'ambient',
      });
      setSpeakingMessageId((prev) => (prev === messageId ? null : prev));
    } catch (err) {
      console.error("TTS error:", err);
      setSpeakingMessageId((prev) => (prev === messageId ? null : prev));
    }
  };

  const handleFeedback = async (msgId: string, answerId: number | undefined, feedback: 'like' | 'dislike') => {
    if (!answerId) return;
    try {
      await submitFeedback(answerId, feedback);
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, feedback } : m));
    } catch (e) {
      console.error("Feedback failed", e);
    }
  };

  const handleEndSession = () => {
    if (window.confirm("Вы уверены, что хотите завершить сессию?")) {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6">
        <div className="bg-red-900/30 border border-red-700 rounded-2xl p-6 max-w-sm w-full">
          <h2 className="text-red-400 font-bold text-lg mb-3">Ошибка загрузки</h2>
          <p className="text-red-200 text-sm whitespace-pre-wrap mb-6">{apiError}</p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl transition-colors"
          >
            ← На главную
          </button>
        </div>
      </div>
    );
  }

  if (!exhibit) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <div>
                <h1 className="font-semibold text-gray-800 dark:text-gray-100">{exhibit.name}</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">{exhibit.period}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleEndSession}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Переключить тему"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 text-gray-300" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wide mb-0.5">
            {exhibit.category || 'Экспонат'}
          </p>
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">{exhibit.name}</h2>
          <div className="flex gap-3 mt-0.5">
            {exhibit.author && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{exhibit.author}</p>
            )}
            {exhibit.period && (
              <p className="text-sm text-gray-400 dark:text-gray-500">{exhibit.period}</p>
            )}
          </div>
        </div>
      </div>



      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm border border-gray-100 dark:border-gray-700'
                }`}
              >
                {message.isVoice && message.type === 'user' && (
                  <div className="flex items-center gap-2 mb-1 text-blue-100">
                    <Mic className="w-3 h-3" />
                    <span className="text-xs">Голосовой запрос</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.type === 'assistant' && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => handleSpeakText(message.id, message.content)}
                      className={`flex items-center gap-2 text-xs transition-colors ${
                        speakingMessageId === message.id 
                          ? 'text-red-600 hover:text-red-700' 
                          : 'text-blue-600 hover:text-blue-700'
                      }`}
                    >
                      {speakingMessageId === message.id ? (
                        <>
                          <Square className="w-3 h-3 fill-current" />
                          <span>Остановить</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3" />
                          <span>Озвучить</span>
                        </>
                      )}
                    </button>
                    
                    {message.answerId && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleFeedback(message.id, message.answerId, 'like')}
                          className={`p-1 rounded transition-colors ${message.feedback === 'like' ? 'text-green-600' : 'text-gray-400 hover:text-green-600'}`}
                        >
                          <ThumbsUp className={`w-3 h-3 ${message.feedback === 'like' ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleFeedback(message.id, message.answerId, 'dislike')}
                          className={`p-1 rounded transition-colors ${message.feedback === 'dislike' ? 'text-red-600' : 'text-gray-400 hover:text-red-600'}`}
                        >
                          <ThumbsDown className={`w-3 h-3 ${message.feedback === 'dislike' ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-1 text-xs opacity-60">
                  {message.timestamp.toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      
      <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {isRecording && (
            <div className="mb-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <Mic className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-sm text-red-800 dark:text-red-200 font-medium">
                Идет запись... Говорите ваш вопрос
              </span>
            </div>
          )}

          {isSessionExpired ? (
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600">
              <p className="text-red-500 dark:text-red-400 font-medium mb-3">Сессия завершена (5 минут без активности)</p>
              <button 
                onClick={() => navigate('/scanner')} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl transition-colors font-medium"
              >
                Начать новый диалог
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleVoiceInput}
                disabled={isRecording}
                className={`p-3 rounded-xl transition-colors ${
                  isRecording
                    ? 'bg-red-500 text-white'
                    : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>

              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Задайте вопрос..."
                className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />

              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          )}

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Все диалоги сохраняются анонимно для улучшения качества сервиса
          </p>
        </div>
      </div>

    </div>
  );
}
