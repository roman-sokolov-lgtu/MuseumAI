export const getServerUrl = (): string => {
  return import.meta.env.VITE_STATIC_URL;
};

const apiUrl = () => import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const RATE_LIMITED_MESSAGE =
  "ИИ-гид сейчас обрабатывает много запросов. Пожалуйста, подождите около минуты и повторите.";

export const getWelcome = async (qrCode: string): Promise<string> => {
  const response = await fetch(`${apiUrl()}/welcome`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ exhibit_qr: qrCode }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new ApiError(err.detail || "Welcome failed", response.status);
  }
  const data = await response.json();
  return data.answer;
};

export const getExhibitByQr = async (qrCode: string) => {
  const response = await fetch(`${apiUrl()}/exhibits/qr/${qrCode}`);
  if (!response.ok) {
    if (response.status === 404) return null;
    const err = await response.json().catch(() => ({}));
    throw new ApiError(err.detail || "Failed to fetch exhibit", response.status);
  }
  const data = await response.json();
  return {
    id: data.exhibit_id.toString(),
    name: data.exhibit_name,
    description: data.exhibit_description,
    period: data.exhibit_period,
    author: data.exhibit_author,
    material: data.exhibit_material,
    category: data.exhibit_category,
    qrCode: data.exhibit_qr,
  };
};

export const sendMessage = async (
  query: string,
  exhibitQr: string,
  history: { role: string; content: string }[],
  sessionId?: string | null
): Promise<{answer: string, sessionId: string, answerId: number}> => {
  const body: any = { query, exhibit_qr: exhibitQr, history };
  if (sessionId) {
    body.session_id = parseInt(sessionId, 10);
  }

  const response = await fetch(`${apiUrl()}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new ApiError(err.detail || "Ошибка сервера", response.status);
  }
  const data = await response.json();
  return { answer: data.answer, sessionId: data.session_id?.toString(), answerId: data.answer_id };
};

export const submitFeedback = async (answerId: number, feedback: 'like' | 'dislike') => {
  const response = await fetch(`${apiUrl()}/feedback/${answerId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ feedback }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new ApiError(err.detail || "Failed to submit feedback", response.status);
  }
  return response.json();
};
