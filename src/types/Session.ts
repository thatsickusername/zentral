export interface Session {
    id?: string
    type: "pomodoro" | "break"
    duration: number
    completedAt: Date
    linkedTaskId: string
}