export interface SessionMetrics {
    pomodoroCount: number;
    breakCount: number;
    totalPomodoroDuration: number;
    totalBreakDuration: number;
    avgSessionLength: number;
    longestStreak: number;
    currentStreak: number;
    lastSessionDate: string;
}