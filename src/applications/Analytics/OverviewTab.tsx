import { useMemo, useState } from "react";
import { useSessions } from "../../hooks/useSessions";
import { Session } from "../../types/Session";
import HeatMap from "./HeatMap";

export interface DaySummary{
    count: number
    duration: number
    date: string
}

function groupSessionsByDate(sessions: Session[], year: number): DaySummary[]{
    const map = new Map<string, {count: number; duration: number}>()
    

    sessions.forEach((session)=> {
        if (session.type !== "pomodoro") return

        // Convert Firestore timestamp to JS Date
        const timestamp = session.completedAt;
        const dateObj = new Date(timestamp.seconds * 1000);

        if (dateObj.getFullYear() !== year) return;

        const dateStr = dateObj.toISOString().split("T")[0];
        const prev = map.get(dateStr) || { count: 0, duration: 0 };
                map.set(dateStr, {
                    count: prev.count + 1,
                    duration: prev.duration + session.duration
                })

        console.log(session)
    })

    const summary: DaySummary[] = []
    const startDate = new Date( year, 0, 1)
    const endDate = new Date( year, 11, 31)

    for(let d = new Date(startDate); d<= endDate; d.setDate(d.getDate()+1)){
        const dateStr = d.toISOString().split("T")[0]
        const val = map.get(dateStr) || {count: 0, duration: 0}

        summary.push({
            date: dateStr,
            count: val.count,
            duration: val.duration
        })
    }

    return summary
}


function OverviewTab() {

    //get the session data from the context
    //loop over the user sessions and make an array of obects with date and number of pomodoros that day and duration of pomodoros

    const { sessions } = useSessions();
    const currentYear = new Date().getFullYear();
    const [metric, setMetric] = useState<"count" | "duration">("count");
    const [year, setYear] = useState<number>(currentYear);
    const summary = useMemo(() => groupSessionsByDate(sessions, year), [sessions, year]);
    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
        <div className="p-4 w-full">
          <div className="mb-4 flex items-center gap-4">
            <div>
              <label className="mr-1 text-sm font-medium">Metric:</label>
              <select
                value={metric}
                onChange={(e) => setMetric(e.target.value as "count" | "duration")}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="count">Sessions</option>
                <option value="duration">Focus Time (min)</option>
              </select>
            </div>
    
            <div>
              <label className="mr-1 text-sm font-medium">Year:</label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
    
          <HeatMap data={summary} metric={metric} />
        </div>
      )
}

export default OverviewTab;