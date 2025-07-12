import { useMemo } from "react";

type CalendarProps = {
    date: Date; // The 'date' prop is also a Date object
  };

const Calendar: React.FC<CalendarProps> = ({ date }) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = date.getDate();

    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Memoize calendar grid calculation to prevent re-computation on every render
    const calendarGrid = useMemo(() => {
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const grid = [];
        let dayCounter = 1;

        for (let i = 0; i < 6; i++) { // Max 6 rows
            const week = [];
            for (let j = 0; j < 7; j++) {
                if ((i === 0 && j < firstDayOfMonth) || dayCounter > daysInMonth) {
                    week.push(null);
                } else {
                    week.push(dayCounter++);
                }
            }
            grid.push(week);
            if (dayCounter > daysInMonth) break;
        }
        return grid;
    }, [year, month]);

    return (
        <div className="p-2 text-gray-700">
            <div className="text-center font-semibold mb-5">{monthName}</div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {daysOfWeek.map(day => (
                    <div key={day} className="font-medium text-gray-500">{day}</div>
                ))}
                {calendarGrid.flat().map((day, index) => (
                    <div
                        key={index}
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                            day === null ? '' : 'hover:bg-gray-700/20'
                        } ${day === today ? 'bg-blue-500 text-white font-bold hover:bg-blue-500 transition-all' : ''}`}
                    >
                        {day}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar