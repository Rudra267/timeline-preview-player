import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

const ThumbnailGrid = ({ videoSrc, currentTime, onThumbnailClick }) => {
  const [thumbnails, setThumbnails] = useState([]);
  const [videoDuration, setVideoDuration] = useState(0);

  useEffect(() => {
    if (!videoSrc) return;

    const video = document.createElement('video');
    video.src = videoSrc;
    video.preload = 'metadata';
    
    video.addEventListener('loadedmetadata', () => {
      const duration = video.duration;
      setVideoDuration(duration);
      
      // Generate thumbnails every 3 seconds
      const interval = 3;
      const thumbnailCount = Math.ceil(duration / interval);
      const newThumbnails = [];

      for (let i = 0; i < thumbnailCount; i++) {
        const time = i * interval;
        newThumbnails.push({
          id: i,
          time: time,
          src: null // Will show placeholder instead of actual thumbnail
        });
      }
      
      setThumbnails(newThumbnails);
    });

    return () => {
      video.remove();
    };
  }, [videoSrc]);


  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCurrentThumbnailIndex = () => {
    return Math.floor(currentTime / 3);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-medium text-foreground">Video Frames</h3>
        <p className="text-xs text-muted-foreground">3-second intervals</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {thumbnails.map((thumbnail, index) => {
            const isCurrentThumbnail = index === getCurrentThumbnailIndex();
            
            return (
              <div
                key={thumbnail.id}
                className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  isCurrentThumbnail 
                    ? 'border-white shadow-lg scale-105' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => onThumbnailClick(thumbnail.time)}
              >
                <div className="aspect-video bg-muted flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center">
                        <div className="w-3 h-3 bg-primary/60 rounded-full"></div>
                      </div>
                      <div className="text-xs font-medium text-foreground">
                        {formatTime(thumbnail.time)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 ${
                  isCurrentThumbnail ? 'text-white' : 'text-white/80'
                }`}>
                  <div className="text-xs font-medium">
                    {formatTime(thumbnail.time)}
                  </div>
                </div>

                {isCurrentThumbnail && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ThumbnailGrid;