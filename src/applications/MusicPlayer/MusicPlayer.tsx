import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume1, Volume2, VolumeX, Music2} from "lucide-react";
import { VideoItem } from "../../types/VideoItem";

// --- Type Definitions ---
declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady?: () => void;
  }
}

function MusicPlayer() {
  const [player, setPlayer] = useState<YT.Player | null>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isApiReady, setIsApiReady] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  const videoList: VideoItem[] = [
    { id: "jfKfPfyJRdk", title: "Lofi" },
    { id: "MYPVQccHhAQ", title: "Jazz" },
    { id: "8plwv25NYRo", title: "Raining" },
    { id: "gVKEM4K8J8A", title: "Thunderstorm" },
    { id: "xNN7iTA57jM", title: "Forest" },
    { id: "CIj-ZDSjZ2E", title: "Fire" },
    { id: "RhaLJvadovc", title: "Cafe" },
    { id: "4vIQON2fDWM", title: "Library"},
  ];

  // Load the YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setIsApiReady(true);
      };
    } else {
      setIsApiReady(true);
    }
  }, []);

  // Initialize player when API is ready
  useEffect(() => {
    if (isApiReady && playerRef.current && !player) {
      const newPlayer = new window.YT.Player(playerRef.current, {
        height: "1",
        width: "1",
        videoId: videoList[0].id,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          mute: 0,
        },
        events: {
          onReady: (event) => onPlayerReady(event),
          onStateChange: (event) => onPlayerStateChange(event),
        },
      });
      setPlayer(newPlayer);
      setCurrentVideoId(videoList[0].id);
    }
  }, [isApiReady, player]);

  const onPlayerReady = (event: YT.PlayerEvent) => {
    event.target.setVolume(volume);
  };

  const onPlayerStateChange = (event: YT.OnStateChangeEvent) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
    } else if (
      event.data === window.YT.PlayerState.PAUSED ||
      event.data === window.YT.PlayerState.ENDED
    ) {
      setIsPlaying(false);
    }
  };

  const loadVideo = (videoId: string) => {
    if (player) {
      player.loadVideoById(videoId);
      setCurrentVideoId(videoId);
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    if (!player) return;
    const state = player.getPlayerState();
  
    if (state === window.YT.PlayerState.PLAYING) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value, 10);
    setVolume(newVolume);
    if (player) {
      player.setVolume(newVolume);
    }
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={24} />;
    if (volume < 50) return <Volume1 size={24} />;
    return <Volume2 size={24} />;
  };


  return (
    <div className="h-full w-full flex flex-col max-w-3xl mx-auto relative">
      {/* Hidden YT Player */}
      <div ref={playerRef} className="absolute h-[0.1px] w-[0.1px] z-10 opacity-0" />

      {/* Song Buttons */}
      <div className="flex-grow p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pb-28 overflow-y-auto">
        {videoList.map((video) => (
          <button
            key={video.id}
            onClick={() => loadVideo(video.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md
              bg-white/30 backdrop-blur-md border border-gray-200
              hover:bg-white focus:outline-none
              ${
                currentVideoId === video.id
                  ? "ring-2 ring-blue-400 bg-blue-50"
                  : ""
              }`}
          >
            <Music2
              size={20}
              className={`${
                currentVideoId === video.id ? "text-blue-500" : "text-gray-600"
              }`}
            />
            <span
              className={`text-sm font-medium truncate ${
                currentVideoId === video.id ? "text-blue-500" : "text-gray-600"
              }`}
            >
              {video.title}
            </span>
          </button>
        ))}
      </div>

      {/* Control Panel */}
      <div className="absolute bottom-0 w-full border-t border-gray-200 p-4 flex items-center gap-4 backdrop-blur-xl bg-white/50 shadow-lg border border-white/50">
        {/* Play/Pause */}
        <button
          onClick={togglePlayPause}
          className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-md transition-colors duration-200"
        >
          {isPlaying ? <Pause size={22} /> : <Play size={22} />}
        </button>

        {/* Song Title */}
        <div className="flex-grow min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">
            {currentVideoId
              ? videoList.find((v) => v.id === currentVideoId)?.title
              : "Select a song"}
          </p>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 w-32">
          <div className="text-gray-500">{getVolumeIcon()}</div>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full accent-blue-500 cursor-pointer hover:accent-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
