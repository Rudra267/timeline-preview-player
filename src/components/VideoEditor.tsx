import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import ThumbnailGrid from './ThumbnailGrid';
import Timeline from './Timeline';

// Sample video clips data
const videoClips = [
  {
    id: 1,
    title: "010_0020_A",
    duration: 17.25,
    startFrame: 524,
    thumbnail: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=225&fit=crop",
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    id: 2,
    title: "120_0040_A", 
    duration: 14.3,
    startFrame: 2812,
    thumbnail: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=225&fit=crop",
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  },
  {
    id: 3,
    title: "030_0015_B",
    duration: 9.8,
    startFrame: 1456,
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop", 
    videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  }
];

const VideoEditor = () => {
  const [currentClip, setCurrentClip] = useState(videoClips[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([75]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [currentClip]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    setVolume(value);
    video.volume = value[0] / 100;
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleClipSelect = (clip: typeof videoClips[0]) => {
    setCurrentClip(clip);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleTimelineSeek = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = time;
    setCurrentTime(time);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-text-bright">Video Editor</h1>
            <div className="flex items-center gap-2 text-sm text-text-dim">
              <span>Shots</span>
              <span>Show: All</span>
              <span>Group by: Chronological</span>
            </div>
          </div>
          <div className="text-sm text-text-dim">
            {currentClip.title} | Duration: {currentClip.duration}s
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Thumbnails */}
        <div className="w-2/3 border-r border-border">
          <ThumbnailGrid 
            clips={videoClips}
            currentClip={currentClip}
            onClipSelect={handleClipSelect}
          />
        </div>

        {/* Right Panel - Video Player */}
        <div className="w-1/3 bg-video-bg flex flex-col">
          <div className="flex-1 flex flex-col">
            {/* Video Container */}
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="relative w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden shadow-video">
                <video
                  ref={videoRef}
                  src={currentClip.videoSrc}
                  className="w-full h-full object-contain"
                  poster={currentClip.thumbnail}
                />
                
                {/* Video Overlay Controls */}
                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={togglePlay}
                      className="bg-black/50 backdrop-blur-sm border-white/20 hover:bg-black/70"
                    >
                      {isPlaying ? (
                        <Pause className="h-8 w-8 text-white" />
                      ) : (
                        <Play className="h-8 w-8 text-white ml-1" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Controls */}
            <div className="p-6 pt-0">
              <div className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={0.1}
                    onValueChange={handleSeek}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-text-dim">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={togglePlay}>
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={toggleMute}>
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="w-20">
                      <Slider
                        value={volume}
                        max={100}
                        step={1}
                        onValueChange={handleVolumeChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="p-6 pt-0 border-t border-border">
              <div className="space-y-2 text-sm">
                <div className="text-text-bright font-medium">{currentClip.title}</div>
                <div className="space-y-1 text-text-dim">
                  <div>Duration: {currentClip.duration} sec</div>
                  <div>Start Frame: {currentClip.startFrame}</div>
                  <div>Assets: 4</div>
                  <div>Tasks: 7</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Timeline */}
      <Timeline 
        clips={videoClips}
        currentClip={currentClip}
        currentTime={currentTime}
        onSeek={handleTimelineSeek}
        onClipSelect={handleClipSelect}
      />
    </div>
  );
};

export default VideoEditor;