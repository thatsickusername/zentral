
function Dock() {
    const apps = ['A', 'B', 'C', 'D']

    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-end gap-4 bg-white/70 dark:bg-black/30 backdrop-blur-md px-4 py-2 rounded-2xl shadow-md">
        {apps.map((app, index) => (
          <div
            key={index}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold text-lg hover:scale-110 transition-transform cursor-pointer"
          >
            {app}
          </div>
        ))}
      </div>
    )
  }

export default Dock;