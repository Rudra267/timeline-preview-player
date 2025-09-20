import { useState } from 'react';

interface Clip {
  id: number;
  title: string;
  duration: number;
  startFrame: number;
  thumbnail: string;
  videoSrc: string;
}

interface TimelineProps {
  clips: Clip[];
  currentClip: Clip;
  currentTime: number;
  onSeek: (time: number) => void;
  onClipSelect: (clip: Clip) => void;
}

const Timeline = ({ clips, currentClip, currentTime, onSeek, onClipSelect }: TimelineProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);

  // Calculate total timeline duration and positions
  const totalDuration = clips.reduce((sum, clip) => sum + clip.duration, 0);
  const timelineWidth = 100; // Percentage
  
  // Calculate clip positions and widths
  let currentPosition = 0;
  const clipPositions = clips.map(clip => {
    const startPos = (currentPosition / totalDuration) * timelineWidth;
    const width = (clip.duration / totalDuration) * timelineWidth;
    currentPosition += clip.duration;
    
    return {
      ...clip,
      startPos,
      width,
      endPos: startPos + width
    };
  });

  // Current playhead position within the current clip
  const currentClipPosition = clipPositions.find(c => c.id === currentClip.id);
  const playheadPosition = currentClipPosition 
    ? currentClipPosition.startPos + (currentTime / currentClip.duration) * currentClipPosition.width
    : 0;

  const handleTimelineClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickPercentage = (clickX / rect.width) * 100;
    
    // Find which clip was clicked
    const clickedClip = clipPositions.find(clip => 
      clickPercentage >= clip.startPos && clickPercentage <= clip.endPos
    );
    
    if (clickedClip) {
      const relativePosition = (clickPercentage - clickedClip.startPos) / clickedClip.width;
      const timeInClip = relativePosition * clickedClip.duration;
      
      onClipSelect(clickedClip);
      onSeek(timeInClip);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mousePercentage = (mouseX / rect.width) * 100;
    const timeAtMouse = (mousePercentage / timelineWidth) * totalDuration;
    
    setHoverTime(timeAtMouse);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-timeline-bg border-t border-border">
      {/* Timeline Header */}
      <div className="px-6 py-2 border-b border-border">
        <div className="flex items-center justify-between text-sm text-text-dim">
          <span>Timeline</span>
          <span>Total Duration: {formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* Timeline Tracks */}
      <div className="p-6">
        <div className="space-y-3">
          {/* Track Labels */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 text-sm text-text-dim">Track</div>
            <div className="flex-1 text-xs text-text-dim">
              <div className="flex justify-between">
                <span>0:00</span>
                <span>{formatTime(totalDuration / 2)}</span>
                <span>{formatTime(totalDuration)}</span>
              </div>
            </div>
          </div>

          {/* Video Track */}
          <div className="flex items-center gap-4">
            <div className="w-20 text-sm text-text-bright font-medium">Video</div>
            <div 
              className="flex-1 relative h-12 bg-muted rounded cursor-pointer border border-clip-border"
              onClick={handleTimelineClick}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* Clip Segments */}
              {clipPositions.map((clip, index) => (
                <div
                  key={clip.id}
                  className={`
                    absolute top-0 h-full rounded transition-all duration-200
                    ${clip.id === currentClip.id 
                      ? 'bg-progress-green border border-progress-green-bright' 
                      : 'bg-secondary border border-clip-border hover:bg-clip-hover'
                    }
                  `}
                  style={{
                    left: `${clip.startPos}%`,
                    width: `${clip.width}%`
                  }}
                  title={`${clip.title} (${clip.duration}s)`}
                >
                  {/* Clip Content */}
                  <div className="h-full flex items-center justify-center relative overflow-hidden">
                    <div className="text-xs text-text-bright font-medium truncate px-2">
                      {clip.title}
                    </div>
                    
                    {/* Green lines pattern for active clip */}
                    {clip.id === currentClip.id && (
                      <div className="absolute inset-0 opacity-30">
                        {Array.from({ length: Math.floor(clip.width / 2) }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute top-0 bottom-0 w-px bg-progress-green-bright"
                            style={{ left: `${(i + 1) * 8}px` }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Clip Separator */}
                  {index < clipPositions.length - 1 && (
                    <div className="absolute top-0 right-0 w-px h-full bg-border"></div>
                  )}
                </div>
              ))}

              {/* Playhead */}
              <div
                className="absolute top-0 bottom-0 w-px bg-progress-green-bright shadow-lg z-10"
                style={{ left: `${playheadPosition}%` }}
              >
                <div className="absolute -top-1 -left-2 w-4 h-3 bg-progress-green-bright border border-background"></div>
              </div>

              {/* Hover Indicator */}
              {isHovering && (
                <div className="absolute -top-6 bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none"
                     style={{ left: `${(hoverTime / totalDuration) * 100}%`, transform: 'translateX(-50%)' }}>
                  {formatTime(hoverTime)}
                </div>
              )}
            </div>
          </div>

          {/* Audio Track */}
          <div className="flex items-center gap-4">
            <div className="w-20 text-sm text-text-bright font-medium">Audio</div>
            <div className="flex-1 relative h-8 bg-muted rounded border border-clip-border">
              {clipPositions.map((clip) => (
                <div
                  key={`audio-${clip.id}`}
                  className="absolute top-0 h-full bg-progress-green/50 rounded"
                  style={{
                    left: `${clip.startPos}%`,
                    width: `${clip.width}%`
                  }}
                >
                  {/* Audio waveform simulation */}
                  <div className="h-full flex items-center justify-center">
                    <div className="flex items-end gap-px h-4">
                      {Array.from({ length: Math.floor(clip.width / 2) }).map((_, i) => (
                        <div
                          key={i}
                          className="bg-progress-green w-px"
                          style={{ height: `${30 + Math.sin(i * 0.5) * 20}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
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
            <span>Show Tasks Status</span>
            <span>Fit View</span>
          </div>
          <div className="text-progress-green">
            Current: {formatTime(currentTime)} / {formatTime(currentClip.duration)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;