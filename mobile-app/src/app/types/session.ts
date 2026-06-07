export interface Exhibit {
  id: string;
  name: string;
  description: string;
  period: string;
  imageUrl?: string;
}

export interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  isVoice?: boolean;
  answerId?: number;
  feedback?: "like" | "dislike";
}

export interface Session {
  id: string;
  exhibitId: string;
  startTime: Date;
  endTime: Date;
  messages: Message[];
  isActive: boolean;
}
