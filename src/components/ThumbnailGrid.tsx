import { useState } from 'react';

interface Clip {
  id: number;
  title: string;
  duration: number;
  startFrame: number;
  thumbnail: string;
  videoSrc: string;
}

interface ThumbnailGridProps {
  clips: Clip[];
  currentClip: Clip;
  onClipSelect: (clip: Clip) => void;
}

// Generate thumbnail snapshots for each clip (simulating 3-second intervals)
const generateThumbnails = (clip: Clip) => {
  const thumbnailCount = Math.ceil(clip.duration / 3); // Every 3 seconds
  return Array.from({ length: thumbnailCount }, (_, index) => ({
    id: `${clip.id}-${index}`,
    time: index * 3,
    thumbnail: clip.thumbnail, // In a real app, these would be different frames
    isSelected: false
  }));
};

const ThumbnailGrid = ({ clips, currentClip, onClipSelect }: ThumbnailGridProps) => {
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);

  // Generate all thumbnails from all clips
  const allThumbnails = clips.flatMap(clip => 
    generateThumbnails(clip).map(thumb => ({
      ...thumb,
      clip,
      isFromCurrentClip: clip.id === currentClip.id
    }))
  );

  const handleThumbnailClick = (thumbnail: any) => {
    setSelectedThumbnail(thumbnail.id);
    onClipSelect(thumbnail.clip);
  };

  return (
    <div className="h-full bg-thumbnail-bg">
      {/* Grid Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between text-sm text-text-dim">
          <span>Timeline Thumbnails (3s intervals)</span>
          <span>{allThumbnails.length} frames</span>
        </div>
      </div>

      {/* Thumbnail Grid */}
      <div className="p-4 h-[calc(100%-73px)] overflow-y-auto">
        <div className="grid grid-cols-6 gap-3">
          {allThumbnails.map((thumbnail) => (
            <div
              key={thumbnail.id}
              className={`
                relative aspect-video cursor-pointer rounded-md overflow-hidden
                transition-all duration-200 hover:scale-105 hover:shadow-clip
                ${thumbnail.isFromCurrentClip 
                  ? 'ring-2 ring-progress-green shadow-clip' 
                  : 'ring-1 ring-clip-border hover:ring-clip-hover'
                }
                ${selectedThumbnail === thumbnail.id ? 'ring-progress-green-bright' : ''}
              `}
              onClick={() => handleThumbnailClick(thumbnail)}
            >
              {/* Thumbnail Image */}
              <img
                src={thumbnail.thumbnail}
                alt={`${thumbnail.clip.title} at ${thumbnail.time}s`}
                className="w-full h-full object-cover"
              />
              
              {/* Time Overlay */}
              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                {Math.floor(thumbnail.time / 60)}:{(thumbnail.time % 60).toString().padStart(2, '0')}
              </div>
              
              {/* Current Clip Indicator */}
              {thumbnail.isFromCurrentClip && (
                <div className="absolute top-1 left-1 w-2 h-2 bg-progress-green rounded-full"></div>
              )}
              
              {/* Selection Indicator */}
              {selectedThumbnail === thumbnail.id && (
                <div className="absolute inset-0 bg-progress-green/20 border-2 border-progress-green-bright rounded-md"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Grid Footer with Clip Info */}
      <div className="p-4 border-t border-border bg-card">
        <div className="grid grid-cols-3 gap-4 text-sm">
          {clips.map((clip) => (
            <div
              key={clip.id}
              className={`
                p-3 rounded-lg border cursor-pointer transition-colors
                ${clip.id === currentClip.id 
                  ? 'border-progress-green bg-progress-green/10 text-text-bright' 
                  : 'border-clip-border bg-muted text-text-dim hover:bg-clip-hover'
                }
              `}
              onClick={() => onClipSelect(clip)}
            >
              <div className="font-medium">{clip.title}</div>
              <div className="text-xs mt-1">
                Duration: {clip.duration}s
              </div>
              <div className="text-xs">
                Frames: {Math.ceil(clip.duration / 3)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThumbnailGrid;