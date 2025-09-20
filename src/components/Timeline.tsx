interface VideoClip {
  id: number;
  title: string;
  duration: number;
  startFrame: number;
  thumbnails: string[];
  videoSrc: string;
}

interface TimelineProps {
  videoClip: VideoClip;
  currentTime: number;
  onSeek: (time: number) => void;
}

const Timeline = ({ videoClip, currentTime, onSeek }: TimelineProps) => {
  const handleTimelineClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickPercentage = clickX / rect.width;
    const timeAtClick = clickPercentage * videoClip.duration;
    
    onSeek(timeAtClick);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate playhead position as percentage
  const playheadPosition = (currentTime / videoClip.duration) * 100;

  // Generate segment markers every 3 seconds
  const segmentMarkers = [];
  for (let i = 0; i < videoClip.duration; i += 3) {
    const position = (i / videoClip.duration) * 100;
    segmentMarkers.push({
      time: i,
      position,
      isActive: currentTime >= i && currentTime < i + 3
    });
  }

  return (
    <div className="bg-timeline-bg border-t border-border">
      {/* Timeline Header */}
      <div className="px-6 py-2 border-b border-border">
        <div className="flex items-center justify-between text-sm text-text-dim">
          <span>Timeline • {videoClip.title}</span>
          <span>Duration: {formatTime(videoClip.duration)}</span>
        </div>
      </div>

      {/* Timeline Tracks */}
      <div className="p-6">
        <div className="space-y-3">
          {/* Time Ruler */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 text-sm text-text-dim">Time</div>
            <div className="flex-1 text-xs text-text-dim relative h-4">
              <div className="flex justify-between">
                <span>0:00</span>
                <span>{formatTime(videoClip.duration / 2)}</span>
                <span>{formatTime(videoClip.duration)}</span>
              </div>
              {/* 3-second interval markers */}
              {segmentMarkers.map((marker, index) => (
                <div
                  key={index}
                  className="absolute top-3 w-px h-2 bg-text-dim"
                  style={{ left: `${marker.position}%` }}
                  title={formatTime(marker.time)}
                />
              ))}
            </div>
          </div>

          {/* Video Track */}
          <div className="flex items-center gap-4">
            <div className="w-20 text-sm text-text-bright font-medium">Video</div>
            <div 
              className="flex-1 relative h-12 bg-muted rounded cursor-pointer border border-clip-border overflow-hidden"
              onClick={handleTimelineClick}
            >
              {/* Main video track */}
              <div className="absolute inset-0 bg-progress-green">
                {/* 3-second segment indicators */}
                {segmentMarkers.map((marker, index) => (
                  <div
                    key={index}
                    className={`
                      absolute top-0 h-full border-r border-background/20
                      ${marker.isActive ? 'bg-progress-green-bright' : 'bg-progress-green'}
                    `}
                    style={{
                      left: `${marker.position}%`,
                      width: `${Math.min(3, videoClip.duration - marker.time) / videoClip.duration * 100}%`
                    }}
                  >
                    {/* Segment content */}
                    <div className="h-full flex items-center justify-center relative overflow-hidden">
                      <div className="text-xs text-white font-medium opacity-70">
                        {formatTime(marker.time)}
                      </div>
                      
                      {/* Active segment highlight */}
                      {marker.isActive && (
                        <div className="absolute inset-0 bg-white/20"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Playhead - White indicator */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
                style={{ left: `${playheadPosition}%` }}
              >
                <div className="absolute -top-1 -left-2 w-4 h-3 bg-white border border-background shadow-md"></div>
              </div>

              {/* Hover time indicator */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute -top-6 bg-black/80 text-white text-xs px-2 py-1 rounded"
                     style={{ left: `${playheadPosition}%`, transform: 'translateX(-50%)' }}>
                  {formatTime(currentTime)}
                </div>
              </div>
            </div>
          </div>

          {/* Audio Track */}
          <div className="flex items-center gap-4">
            <div className="w-20 text-sm text-text-bright font-medium">Audio</div>
            <div className="flex-1 relative h-8 bg-muted rounded border border-clip-border">
              <div
                className="absolute top-0 h-full bg-progress-green/50 rounded"
                style={{ width: '100%' }}
              >
                {/* Audio waveform simulation */}
                <div className="h-full flex items-center px-2">
                  <div className="flex items-end gap-px h-4 w-full">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-progress-green flex-1 min-w-px"
                        style={{ height: `${30 + Math.sin(i * 0.3) * 30}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Tracks */}
          {['Effects', 'Titles', 'Music'].map((trackName) => (
            <div key={trackName} className="flex items-center gap-4">
              <div className="w-20 text-sm text-text-dim">{trackName}</div>
              <div className="flex-1 h-6 bg-muted/50 rounded border border-clip-border/50"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Controls */}
      <div className="px-6 py-3 border-t border-border">
        <div className="flex items-center justify-between text-sm text-text-dim">
          <div className="flex items-center gap-4">
            <span>Current Segment: {Math.floor(currentTime / 3) + 1}</span>
            <span>Frame: {videoClip.startFrame + Math.floor(currentTime * 30)}</span>
          </div>
          <div className="text-white">
            {formatTime(currentTime)} / {formatTime(videoClip.duration)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;