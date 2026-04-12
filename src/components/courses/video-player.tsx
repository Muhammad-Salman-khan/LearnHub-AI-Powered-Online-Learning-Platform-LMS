"use client";

interface VideoPlayerProps {
  url?: string | null;
}

/**
 * Converts any YouTube URL format to an embeddable iframe URL.
 * Handles: watch URLs, shortened youtu.be URLs, and already-embed URLs.
 */
function getEmbedUrl(url: string): string {
  // Already an embed URL
  if (url.includes("/embed/")) return url;

  // Extract video ID from various formats
  let videoId = "";

  // Format: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) videoId = watchMatch[1];

  // Format: https://youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) videoId = shortMatch[1];

  // If we found a video ID, return the embed URL
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
  }

  // If it's not a YouTube URL, return as-is (could be Vimeo, direct video, etc.)
  return url;
}

export function VideoPlayer({ url }: VideoPlayerProps) {
  const embedUrl = url ? getEmbedUrl(url) : null;

  if (!embedUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0e0e0e] text-gray-500">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl mb-3">play_circle</span>
          <p className="text-sm">No video URL available for this chapter</p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      src={embedUrl}
      className="w-full h-full"
      title="Video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}
