interface VideoClip {
  id: number;
  title: string;
  duration: number;
  startFrame: number;
  thumbnails: string[];
  videoSrc: string;
}

interface ThumbnailGridProps {
  videoClip: VideoClip;
  currentTime: number;
  onTimeSelect: (timeIndex: number) => void;
}

// Generate thumbnail data for every 3 seconds of the video
const generateThumbnailsFromVideo = (clip: VideoClip) => {
  const intervalSeconds = 3;
  const thumbnailCount = Math.ceil(clip.duration / intervalSeconds);
  
  return Array.from({ length: thumbnailCount }, (_, index) => ({
    id: `thumb-${index}`,
    timeIndex: index,
    time: index * intervalSeconds,
    thumbnail: clip.thumbnails[index % clip.thumbnails.length], // Cycle through available thumbnails
    isCurrentTime: false
  }));
};

const ThumbnailGrid = ({ videoClip, currentTime, onTimeSelect }: ThumbnailGridProps) => {
  // Generate all thumbnails for the video
  const thumbnails = generateThumbnailsFromVideo(videoClip);
  
  // Calculate which thumbnail represents the current time
  const currentThumbnailIndex = Math.floor(currentTime / 3);

  const handleThumbnailClick = (timeIndex: number) => {
    onTimeSelect(timeIndex);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full bg-thumbnail-bg">
      {/* Grid Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between text-sm text-text-dim">
          <span>Video Timeline (3s intervals)</span>
          <span>{thumbnails.length} frames • {formatTime(videoClip.duration)}</span>
        </div>
      </div>

      {/* Thumbnail Grid */}
      <div className="p-4 h-[calc(100%-73px)] overflow-y-auto">
        <div className="grid grid-cols-6 gap-3">
          {thumbnails.map((thumbnail) => {
            const isCurrentTime = thumbnail.timeIndex === currentThumbnailIndex;
            
            return (
              <div
                key={thumbnail.id}
                className={`
                  relative aspect-video cursor-pointer rounded-md overflow-hidden
                  transition-all duration-200 hover:scale-105 hover:shadow-clip
                  ${isCurrentTime 
                    ? 'ring-2 ring-white shadow-clip' 
                    : 'ring-1 ring-clip-border hover:ring-clip-hover'
                  }
                `}
                onClick={() => handleThumbnailClick(thumbnail.timeIndex)}
              >
                {/* Thumbnail Image */}
                <img
                  src={thumbnail.thumbnail}
                  alt={`${videoClip.title} at ${formatTime(thumbnail.time)}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Time Overlay */}
                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                  {formatTime(thumbnail.time)}
                </div>
                
                {/* Current Time Indicator - White mark */}
                {isCurrentTime && (
                  <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full border-2 border-background shadow-md"></div>
                )}
                
                {/* Selection Overlay for current time */}
                {isCurrentTime && (
                  <div className="absolute inset-0 bg-white/10 border-2 border-white rounded-md"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4 border-t border-border bg-card">
        <div className="space-y-2 text-sm">
          <div className="text-text-bright font-medium">{videoClip.title}</div>
          <div className="grid grid-cols-2 gap-4 text-text-dim">
            <div>Duration: {formatTime(videoClip.duration)}</div>
            <div>Current: {formatTime(currentTime)}</div>
            <div>Start Frame: {videoClip.startFrame}</div>
            <div>Thumbnails: {thumbnails.length}</div>
          </div>
          <div className="text-progress-green text-xs">
            Playing segment: {formatTime(currentThumbnailIndex * 3)} - {formatTime((currentThumbnailIndex + 1) * 3)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThumbnailGrid;