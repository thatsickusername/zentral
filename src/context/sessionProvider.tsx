import { FC, createContext, useEffect, useState } from "react";
import { Session } from "../types/Session";
import { useAuth } from "./useAuth";
import { Timestamp } from "firebase/firestore";
import { DEFAULT_DAILY_GOALS, useFirestore } from "../services/firestore";
import { SessionMetrics } from "../types/SessionMetrics";
import { DailyMetrics } from "../types/DailyMetrics";
import { DailyGoals } from "../types/DailyGoals";

export interface SessionContextType {
  sessions: Session[];
  isLoading: boolean;
  isSyncing: boolean;
  sessionMetrics: SessionMetrics;
  dailyMetrics: DailyMetrics;
  dailyGoals: DailyGoals | null;
  setDailyGoals: (goals: DailyGoals) => Promise<void>;
  addSession: (type: "pomodoro" | "break", duration: number, linkedTaskId: string) => void;
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: React.ReactNode;
}

export const SessionProvider: FC<SessionProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const {
    fetchAllSessions,
    syncSessions,
    fetchDailyGoals,
    setDailyGoals: saveDailyGoals
  } = useFirestore();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const [sessionMetrics, setSessionMetrics] = useState<SessionMetrics>({
    pomodoroCount: 0,
    breakCount: 0,
    totalPomodoroDuration: 0,
    totalBreakDuration: 0,
    avgSessionLength: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastSessionDate: "",
  });

  const [dailyMetrics, setDailyMetrics] = useState<DailyMetrics>({
    todayDate: "",
    sessionCountToday: 0,
    sessionDurationToday: 0,
  });

  const [dailyGoals, setDailyGoalsState] = useState<DailyGoals | null>(null);

  useEffect(() => {
    const resetIfNewDay = () => {
      const todayStr = new Date().toISOString().split("T")[0];
      if (dailyMetrics.todayDate !== todayStr) {
        // Reset daily metrics
        setDailyMetrics({
          todayDate: todayStr,
          sessionCountToday: 0,
          sessionDurationToday: 0,
        });
      }
    };
  
    // Run once on mount
    resetIfNewDay();
  
    // Also run periodically (every 1 minute is enough)
    const interval = setInterval(resetIfNewDay, 60 * 1000);
  
    return () => clearInterval(interval);
  }, [dailyMetrics.todayDate]);

  // Load sessions + daily goals
  useEffect(() => {
    const loadAll = async () => {
      if (!user?.uid) return;
      try {
        const [fetchedSessions, fetchedGoals] = await Promise.all([
          fetchAllSessions(user.uid),
          fetchDailyGoals(user.uid)
        ]);
        setSessions(fetchedSessions);
        if (fetchedGoals) setDailyGoalsState(fetchedGoals || DEFAULT_DAILY_GOALS) 
      } catch (err) {
        console.error("Error loading sessions/goals", err);
        setDailyGoalsState(DEFAULT_DAILY_GOALS) 
      } finally {
        setIsLoading(false);
      }
    };
    loadAll();
  }, [user?.uid]);

  // Derive metrics from sessions
  useEffect(() => {
    if (!sessions.length) {
      setSessionMetrics({
        pomodoroCount: 0,
        breakCount: 0,
        totalPomodoroDuration: 0,
        totalBreakDuration: 0,
        avgSessionLength: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastSessionDate: "",
      });
      setDailyMetrics({
        todayDate: new Date().toISOString().split("T")[0],
        sessionCountToday: 0,
        sessionDurationToday: 0,
      });
      return;
    }

    const todayStr = new Date().toISOString().split("T")[0];
    let pomodoroCount = 0;
    let breakCount = 0;
    let totalPomodoroDuration = 0;
    let totalBreakDuration = 0;
    let sessionCountToday = 0;
    let sessionDurationToday = 0;
    const sessionDatesSet = new Set<string>();

    sessions.forEach((s) => {
      const dateStr = s.completedAt.toDate().toISOString().split("T")[0];
      sessionDatesSet.add(dateStr);

      if (s.type === "pomodoro") {
        pomodoroCount++;
        totalPomodoroDuration += s.duration;
      } else {
        breakCount++;
        totalBreakDuration += s.duration;
      }

      if (dateStr === todayStr) {
        sessionCountToday++;
        sessionDurationToday += s.duration;
      }
    });

    // streak calculation
    const sortedDates = Array.from(sessionDatesSet).sort();
    let currentStreak = 0;
    let longestStreak = 0;
    const today = new Date(todayStr);
    for (let i = sortedDates.length - 1; i >= 0; i--) {
      const date = new Date(sortedDates[i]);
      const diffDays = Math.floor(
        (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays === currentStreak) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else if (diffDays > currentStreak) {
        break;
      }
    }

    const avgSessionLength =
      pomodoroCount === 0 ? 0 : totalPomodoroDuration / pomodoroCount;

    setSessionMetrics({
      pomodoroCount,
      breakCount,
      totalPomodoroDuration,
      totalBreakDuration,
      avgSessionLength,
      currentStreak,
      longestStreak,
      lastSessionDate: todayStr,
    });

    setDailyMetrics({
      todayDate: todayStr,
      sessionCountToday,
      sessionDurationToday,
    });
  }, [sessions]);

  // Sync unsynced sessions
  useEffect(() => {
    if (!user?.uid) return;

    const interval = setInterval(async () => {
      const unSyncedSessions = sessions.filter((s) => !s.id);
      if (unSyncedSessions.length === 0) return;

      setIsSyncing(true);
      try {
        await syncSessions(user.uid, unSyncedSessions);
        setSessions((prev) =>
          prev.map((s) =>
            !s.id ? { ...s, id: "synced-" + Math.random().toString() } : s
          )
        );
      } catch (error) {
        console.error("Error syncing sessions", error);
      } finally {
        setIsSyncing(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [sessions, user]);

  // Add a new session
  const addSession = (
    type: "pomodoro" | "break",
    duration: number,
    linkedTaskId: string
  ) => {
    const now = new Date();
    const newSession: Session = {
      id: undefined,
      completedAt: Timestamp.fromDate(now),
      type,
      duration,
      linkedTaskId,
    };
    setSessions((prev) => [...prev, newSession]);
  };

  // Save daily goals to Firestore
  const updateDailyGoals = async (goals: DailyGoals) => {
    if (!user?.uid) return;
    await saveDailyGoals(user.uid, goals);
    setDailyGoalsState(goals);
  };

  return (
    <SessionContext.Provider
      value={{
        sessions,
        isLoading,
        isSyncing,
        sessionMetrics,
        dailyMetrics,
        dailyGoals,
        setDailyGoals: updateDailyGoals,
        addSession,
        setSessions,
        setIsLoading,
      }}
    >
      {!isLoading && children}
    </SessionContext.Provider>
  );
};
