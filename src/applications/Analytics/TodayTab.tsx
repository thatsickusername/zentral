import {RadialBarChart, PolarAngleAxis, RadialBar } from "recharts";
import { StatItem } from "./OverviewTab";
import { useSessions } from "../../hooks/useSessions";
import { FC, useEffect, useState } from "react";
import { DEFAULT_DAILY_GOALS } from "../../services/firestore";
import { displayDuration } from "../../utils/displayDuration";


interface SetStatItemProps {
  label: string;
  value: string;
  onIncrease: () => void;
  onDecrease: () => void;
  color?: string;
}

const SetStatItem: FC<SetStatItemProps> = ({ label, value, onIncrease, onDecrease, color = 'text-blue-500' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-2 text-center w-1/3">
      <div className="flex items-center space-x-3">
        <button onClick={onDecrease} className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
          </svg>
        </button>
        <p className={`text-2xl font-bold ${color}`}>
          {value}
        </p>
        <button onClick={onIncrease} className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
          </svg>
        </button>
      </div>
      <p className="text-sm text-gray-400 mt-2">{label}</p>
    </div>
  );
};

const TodayTab = () => {
    const { dailyMetrics, dailyGoals, setDailyGoals} = useSessions();
    const [localDailyGoals, setLocalDailyGoals] = useState(dailyGoals || DEFAULT_DAILY_GOALS);
    const [sessionCountPercent, setSessionCountPercent] = useState<number>()
    const [sessionDurationPercent, setSessionDurationPercent] = useState<number>()

    useEffect(() => {
      if (dailyGoals) {
        setLocalDailyGoals(dailyGoals);
      }
    }, [dailyGoals]);

    useEffect(() => {
      const handler = setTimeout(() => {
        if (
          localDailyGoals.sessionCountGoal !== dailyGoals?.sessionCountGoal ||
          localDailyGoals.sessionDurationGoal !== dailyGoals?.sessionDurationGoal
        ) {
          setDailyGoals(localDailyGoals);
        }
      }, 2000); 

      return () => {
        clearTimeout(handler);
      };
    }, [localDailyGoals, setDailyGoals]);

    const handleSessionCountIncrease = () => {
      setLocalDailyGoals(prev => ({ ...prev, sessionCountGoal: prev.sessionCountGoal + 1 }));
    };

    const handleSessionCountDecrease = () => {
      setLocalDailyGoals(prev => ({ ...prev, sessionCountGoal: Math.max(1, prev.sessionCountGoal - 1) }));
    };

    const handleDurationIncrease = () => {
      setLocalDailyGoals(prev => ({ ...prev, sessionDurationGoal: prev.sessionDurationGoal + 5 * 60 }));
    };

    const handleDurationDecrease = () => {
      setLocalDailyGoals(prev => ({ ...prev, sessionDurationGoal: Math.max(0, prev.sessionDurationGoal - 5 * 60) }));
    };

    useEffect(()=>{
      let dailyGoalsCheck = localDailyGoals ? localDailyGoals : DEFAULT_DAILY_GOALS
      setSessionCountPercent(Math.min(( dailyMetrics.sessionCountToday/ dailyGoalsCheck.sessionCountGoal) * 100, 100))
      setSessionDurationPercent(Math.min((dailyMetrics.sessionDurationToday / dailyGoalsCheck.sessionDurationGoal) * 100, 100))
    }, [localDailyGoals, dailyMetrics])


    const data = [
      { name: "Steps", value: sessionCountPercent, fill: "#3b82f6 " },
      { name: "Heart", value: sessionDurationPercent, fill: "#22c55e" },
    ];

  

  return (
    <div className="w-full h-full">
          
    <div className="flex w-full justify-between">
      <div className="flex-row bg-white/50 p-4 w-[430px] rounded-xl border border-opacity-30 border-white">
          <div>
            <h2 className=" text-xl font-semibold text-gray-800">
            Todays Summary
            </h2>
            <div className="w-full h-1/2 flex justify-evenly">
                <StatItem label={"Total Sessions"} value={dailyMetrics.sessionCountToday.toString()} color={"text-green-500"} />
                <StatItem label={"Total Focus Time"} value={displayDuration(dailyMetrics.sessionDurationToday)} color={"text-blue-500"} />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
            Set Daily Goals
            </h2>
            <div className="w-full h-1/2 flex justify-evenly">
                <SetStatItem 
                  label={"Total Sessions"} 
                  value={localDailyGoals.sessionCountGoal.toString()} 
                  color={"text-green-500"}
                  onIncrease={handleSessionCountIncrease}
                  onDecrease={handleSessionCountDecrease}
                />
                <SetStatItem 
                  label={"Total Duration"} 
                  value={displayDuration(localDailyGoals.sessionDurationGoal)} 
                  color={"text-blue-500"}
                  onIncrease={handleDurationIncrease}
                  onDecrease={handleDurationDecrease}
                />
            </div>
          </div>
      </div>
      <div className="bg-white/50 p-4 rounded-xl border border-opacity-30 border-white w-[205px]">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Daily Goals
          </h2>
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
                <RadialBarChart
                    width={150}
                    height={150}
                    innerRadius="60%"
                    outerRadius="100%"
                    barSize={10}
                    data={data}
                    startAngle={90}
                    endAngle={-270}
                    >
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar
                        background
                        dataKey="value"
                        cornerRadius={10}
                    />
                </RadialBarChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="text-xl font-semibold text-green-500">{dailyMetrics.sessionCountToday} </div>
                <div className="text-sm text-blue-500">{displayDuration(dailyMetrics.sessionDurationToday)}</div>
                </div>
            </div>
            </div>
      </div>
    </div>
  </div>
  );
};

export default TodayTab;
