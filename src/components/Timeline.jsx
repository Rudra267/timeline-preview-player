import React from 'react';

const Timeline = ({ duration, currentTime, onTimeSeek }) => {
  const handleTimelineClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    onTimeSeek(newTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Generate time markers every 30 seconds
  const generateTimeMarkers = () => {
    const markers = [];
    const interval = 30; // 30 seconds
    const markerCount = Math.ceil(duration / interval);

    for (let i = 0; i <= markerCount; i++) {
      const time = i * interval;
      if (time <= duration) {
        const percentage = (time / duration) * 100;
        markers.push(
          <div
            key={time}
            className="absolute top-0 bottom-0 flex flex-col justify-between items-center"
            style={{ left: `${percentage}%` }}
          >
            <div className="w-px bg-border h-full"></div>
            <div className="text-xs text-muted-foreground bg-background px-1 rounded">
              {formatTime(time)}
            </div>
          </div>
        );
      }
    }
    return markers;
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Timeline</span>
        <span className="text-sm text-muted-foreground">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
      
      <div className="flex-1 relative">
        {/* Timeline Track */}
        <div
          className="relative h-12 bg-muted rounded-lg cursor-pointer overflow-hidden border border-border"
          onClick={handleTimelineClick}
        >
          {/* Time Markers */}
          <div className="absolute inset-0">
            {duration > 0 && generateTimeMarkers()}
          </div>

          {/* Video Progress */}
          <div 
            className="absolute top-0 left-0 h-full bg-primary/30 transition-all duration-150"
            style={{ width: `${progressPercentage}%` }}
          />

          {/* Current Time Indicator (Playhead) */}
          <div
            className="absolute top-0 h-full w-1 bg-white shadow-lg transition-all duration-150"
            style={{ left: `${progressPercentage}%` }}
          >
            <div className="absolute -top-1 -left-2 w-5 h-5 bg-white rounded-full border-2 border-primary shadow-md"></div>
          </div>

          {/* Hover Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200"></div>
        </div>

        {/* Waveform Placeholder */}
        <div className="mt-2 h-8 bg-muted/50 rounded flex items-center justify-center">
          <span className="text-xs text-muted-foreground">Audio Waveform</span>
        </div>
      </div>
    </div>
  );
};

export default Timeline;