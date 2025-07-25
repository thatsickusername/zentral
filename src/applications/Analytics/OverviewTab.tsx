import { useMemo, useState, FC, useEffect } from "react";
import { useSessions } from "../../hooks/useSessions";
import { Session } from "../../types/Session";
import HeatMap from "./HeatMap";
import { useTasks } from "../../hooks/useTasks";

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

interface StatItemProps {
  label: string;
  value: number;
  color?: string;
}

const StatItem: FC<StatItemProps> = ({ label, value, color = 'text-blue-500' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-2 text-center w-1/3">
      <p className={`text-2xl font-bold ${color}`}>
        {value}
      </p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
};


function OverviewTab() {

    const { sessions, sessionsCount, totalDuration} = useSessions();
    const { tasks } = useTasks()
    const currentYear = new Date().getFullYear();
    const [metric, setMetric] = useState<"count" | "duration">("count");
    const [year, setYear] = useState<number>(currentYear);
    const summary = useMemo(() => groupSessionsByDate(sessions, year), [sessions, year]);
    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const [tasksCreated, setTasksCreated] = useState(0);
    const [tasksCompleted, setTasksCompleted] = useState(0);
    const [tasksPending, setTasksPending] = useState(0);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);
    // const [avgSessionDaily, setAvgSessionDaily] = useState(0);
    // const [avgSessionLength, setAvgSessionLength] = useState(0);


    useEffect(()=>{
      setTasksCreated(tasks.length)
      for(const task of tasks){
        if(task.completed) setTasksCompleted(prev => prev+1)
        else setTasksPending(prev => prev+1)
      }
    }, [tasks])

    useEffect(()=>{
      setSessionsCompleted(sessionsCount)
    },[sessionsCount])


    return (
        <div className="w-full h-full">
          
          <div className="flex w-full mb-6 justify-between">
            <div className="flex-row bg-white/50 p-4 w-[430px] rounded-xl border border-opacity-30 border-white">
                <div>
                  <h2 className=" text-xl font-semibold text-gray-800">
                  Tasks Summary
                  </h2>
                  <div className="w-full h-1/2 flex justify-evenly">
                      <StatItem label={"Created"} value={tasksCreated} color={"text-blue-500"} />
                      <StatItem label={"Completed"} value={tasksCompleted} color={"text-blue-500"} />
                      <StatItem label={"Pending"} value={tasksPending} color={"text-blue-500"} />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                  Pomodoro Summary
                  </h2>
                  <div className="w-full h-1/2 flex justify-evenly">
                      <StatItem label={"Total Sessions"} value={sessionsCompleted} color={"text-blue-500"} />
                      <StatItem label={"Total Duration"} value={totalDuration} color={"text-blue-500"} />
                      <StatItem label={"Avg Length"} value={tasksPending} color={"text-blue-500"} />
                  </div>
                </div>
            </div>
            <div className="bg-white/50 p-4 rounded-xl border border-opacity-30 border-white">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Productivity Streak
                </h2>
                <div className="text-center">
                    <p className="text-6xl font-bold text-blue-500">14</p>
                    <p className="text-gray-500 dark:text-gray-400">Day Streak</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">Longest: 32 days</p>
                </div>
            </div>
          </div>

          {/* HEATMAP */}
          <div className="bg-white/50  p-4 w-full rounded-xl border border-opacity-30 border-white">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Productivity Heatmap
              </h2>
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
            </div>
      
            <HeatMap data={summary} metric={metric} />
          </div>
        </div>
      )
}

export default OverviewTab;