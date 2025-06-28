import TopBar from "../components/TopBar/TopBar";
import Dock from "../components/Dock/Dock";

const DesktopLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="relative h-screen w-screen overflow-hidden">
            <TopBar/>
            <div>
                {children}
            </div>
            <Dock/>
        </div>  
    );
  };

export default DesktopLayout;