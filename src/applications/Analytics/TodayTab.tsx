import {RadialBarChart, PolarAngleAxis, RadialBar } from "recharts";
import { StatItem } from "./OverviewTab";
import { useSessions } from "../../hooks/useSessions";
import { useTasks } from "../../hooks/useTasks";

const TodayTab = ({ heartPoints = 20, steps = 200 }) => {
    const heartGoal = 100;
    const stepsGoal = 800;
  
    const heartPercent = Math.min((heartPoints / heartGoal) * 100, 100);
    const stepsPercent = Math.min((steps / stepsGoal) * 100, 100);

  const data = [
    { name: "Steps", value: stepsPercent, fill: "#3b82f6" },
    { name: "Heart", value: heartPercent, fill: "#22c55e" },
  ];

  const { sessionMetrics} = useSessions();
  const {taskMetrics} = useTasks()

  return (
    <div className="w-full h-full">
          
    <div className="flex w-full mb-6 justify-between">
      <div className="flex-row bg-white/50 p-4 w-[430px] rounded-xl border border-opacity-30 border-white">
          <div>
            <h2 className=" text-xl font-semibold text-gray-800">
            Tasks Summary
            </h2>
            <div className="w-full h-1/2 flex justify-evenly">
                <StatItem label={"Created"} value={taskMetrics.totalTasksCreated.toString()} color={"text-blue-500"} />
                <StatItem label={"Completed"} value={taskMetrics.totalTasksCompleted.toString()} color={"text-blue-500"} />
                <StatItem label={"Completion Rate"} value={`${taskMetrics.completionRate.toString()}%`} color={"text-blue-500"} />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
            Pomodoro Summary
            </h2>
            <div className="w-full h-1/2 flex justify-evenly">
                <StatItem label={"Total Sessions"} value={sessionMetrics.pomodoroCount.toString()} color={"text-blue-500"} />
                <StatItem label={"Total Duration"} value={sessionMetrics.totalPomodoroDuration.toString()} color={"text-blue-500"} />
                <StatItem label={"Avg Length"} value={sessionMetrics.totalPomodoroDuration.toString()} color={"text-blue-500"} />
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
                <div className="text-xl font-semibold text-green-500">{heartPoints} </div>
                <div className="text-sm text-blue-500">{steps}mins</div>
                </div>
            </div>
            </div>
      </div>
    </div>
  </div>
  );
};

export default TodayTab;
