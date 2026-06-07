export const getServerUrl = (): string => {
  return import.meta.env.VITE_STATIC_URL;
};

const apiUrl = () => import.meta.env.VITE_API_URL;
export const getWelcome = async (qrCode: string): Promise<string> => {
  const response = await fetch(`${apiUrl()}/welcome`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "69420"
    },
    body: JSON.stringify({ exhibit_qr: qrCode }),
  });
  if (!response.ok) throw new Error("Welcome failed");
  const data = await response.json();
  return data.answer;
};

export const getExhibitByQr = async (qrCode: string) => {
  const response = await fetch(`${apiUrl()}/exhibits/qr/${qrCode}`, {
    headers: { "ngrok-skip-browser-warning": "69420" }
  });
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error("Failed to fetch exhibit");
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
      "ngrok-skip-browser-warning": "69420"
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Ошибка сервера");
  }
  const data = await response.json();
  return { answer: data.answer, sessionId: data.session_id?.toString(), answerId: data.answer_id };
};

export const submitFeedback = async (answerId: number, feedback: 'like' | 'dislike') => {
  const response = await fetch(`${apiUrl()}/feedback/${answerId}`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "69420"
    },
    body: JSON.stringify({ feedback }),
  });
  if (!response.ok) {
    throw new Error("Failed to submit feedback");
  }
  return response.json();
};
