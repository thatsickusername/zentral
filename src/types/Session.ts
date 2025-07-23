import { Timestamp } from "firebase/firestore";

export interface Session {
  id?: string;
  type: "pomodoro" | "break";
  duration: number;
  completedAt: Timestamp;
  linkedTaskId: string;
}