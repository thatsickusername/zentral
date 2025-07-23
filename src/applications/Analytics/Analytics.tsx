import { useState } from "react";
import OverviewTab from "./OverviewTab";
import TodayTab from "./TodayTab";

function Analytics() {

    const [activeTab, setActiveTab] = useState("overview") 

    return (
        <div className="text-gray-800 min-h-full w-full flex flex-col p-12 max-w-3xl mx-auto overflow-auto">
                <h4 className="text-4xl font-extrabold text-gray-900 mb-4 px-1">Analytics</h4>
                <div className="flex space-x-2 mb-8 px-1">
                    <button className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab ==="overview"? 'bg-blue-200 text-blue-700' : 'text-gray-600 hover:bg-gray-100' }`} 
                            onClick={()=>setActiveTab("overview")}>Overview
                    </button>
                    <button className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab ==="today"? 'bg-blue-200 text-blue-700' : 'text-gray-600 hover:bg-gray-100' }`} 
                             onClick={()=>setActiveTab("today")}>Today
                    </button>
                    <button className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab ==="something"? 'bg-blue-200 text-blue-700' : 'text-gray-600 hover:bg-gray-100' }`} 
                             onClick={()=>setActiveTab("something")}>Something
                    </button>
                </div>
                {
                    activeTab === "overview" ? <OverviewTab/> : activeTab ==="today" ?  <TodayTab/> : <div>Something</div>
                }
        </div>
    );
}

export default Analytics;