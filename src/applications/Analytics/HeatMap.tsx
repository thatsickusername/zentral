import { DaySummary } from "./OverviewTab";

type HeatmapProps = {
    data: DaySummary[];
    metric: "count" | "duration";
};

function getMapColor(value: number, metric: string): string {
  if( metric === "count"){
    if (value === 0) return "bg-gray-300";
    if (value <= 2) return "bg-green-300";
    if (value <= 5) return "bg-green-500";
    if (value <= 8) return "bg-green-700";
    return "bg-green-700";
  }else{
    if (value === 0) return "bg-gray-300";
    if (value <= 10 * 60) return "bg-green-300";
    if (value <= 30 * 60) return "bg-green-500";
    if (value <= 60 * 60) return "bg-green-700";
    return "bg-green-700";
  }   
}

const HeatMap: React.FC<HeatmapProps> = ({ data, metric }) => {
    // Split into weeks (columns of 7)
    const weeks: DaySummary[][] = [];
    for (let i = 0; i < data.length; i += 7) {
      weeks.push(data.slice(i, i + 7));
    }
  
    return (
      <div className="flex gap-[2px]">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-[2px]">
            {week.map((day, dIdx) => {
              const value = metric === "count" ? day.count : day.duration;
              return (
                <div
                  key={dIdx}
                  title={`${day.date} — ${day.count} sessions, ${day.duration} min`}
                  className={`w-[10px] h-[10px] rounded-sm ${getMapColor(value, metric)}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  };
  
  export default HeatMap;