import { useEffect, useRef, useState } from 'react';
import {
  useGetProgressQuery,
  useUpdateProgressMutation,
} from '../features/apiSlice';

const VideoPlayer = ({ userId, videoId }) => {
  const videoRef = useRef(null);
  const [watchedSeconds, setWatchedSeconds] = useState(new Set());

  const { data: savedProgress } = useGetProgressQuery({ userId, videoId });
  const [updateProgress] = useUpdateProgressMutation();

  // ✅ Set watchedSeconds as soon as data is available
  useEffect(() => {
    if (savedProgress) {
      const restored = new Set(savedProgress.seconds || []);
      setWatchedSeconds(restored);
    }
  }, [savedProgress]);

  // ✅ Set video currentTime after metadata is loaded
  useEffect(() => {
    const video = videoRef.current;
    if (!savedProgress || !video) return;

    const handleLoadedMetadata = () => {
      if (savedProgress.lastPosition) {
        video.currentTime = savedProgress.lastPosition;
      }
    };

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [savedProgress]);

  // ✅ Track real viewing
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let intervalId;

    const handlePlay = () => {
      intervalId = setInterval(() => {
        const currentSecond = Math.floor(video.currentTime);

        setWatchedSeconds((prev) => {
          if (!prev.has(currentSecond)) {
            const updated = new Set(prev);
            updated.add(currentSecond);

            updateProgress({
              userId,
              videoId,
              newSecond: currentSecond,
              lastPosition: video.currentTime,
            });

            return updated;
          }
          return prev;
        });
      }, 1000);
    };

    const handlePause = () => clearInterval(intervalId);
    const handleEnded = () => clearInterval(intervalId);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      clearInterval(intervalId);
    };
  }, [updateProgress, userId, videoId]);

  const calculateProgress = () => {
    const duration = Math.floor(videoRef.current?.duration || 1);
    return ((watchedSeconds.size / duration) * 100).toFixed(1);
  };

  return (
    <div className="p-4">
      <video
        ref={videoRef}
        width="640"
        height="360"
        controls
        className="rounded-lg shadow-md"
      >
        <source src="/sample.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="mt-3 text-xl font-semibold text-gray-800">
        Watched: {calculateProgress()}%
      </div>
    </div>
  );
};

export default VideoPlayer;