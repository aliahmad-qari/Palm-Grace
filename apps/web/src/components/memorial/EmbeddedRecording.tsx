import React from 'react';

function recordingSource(value: string): { type: 'iframe' | 'video'; url: string } | null {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;
    const host = url.hostname.toLowerCase();
    if (host === 'youtu.be' || host === 'youtube.com' || host === 'www.youtube.com' || host === 'm.youtube.com') {
      const id = host === 'youtu.be' ? url.pathname.slice(1) : url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1];
      return id && /^[\w-]{11}$/.test(id) ? { type: 'iframe', url: `https://www.youtube-nocookie.com/embed/${id}` } : null;
    }
    if (host === 'vimeo.com' || host === 'www.vimeo.com' || host === 'player.vimeo.com') {
      const id = url.pathname.match(/\/(?:video\/)?(\d+)/)?.[1];
      return id ? { type: 'iframe', url: `https://player.vimeo.com/video/${id}` } : null;
    }
    if (/\.(mp4|webm|ogg)$/i.test(url.pathname) || (host === 'res.cloudinary.com' && url.pathname.includes('/video/upload/'))) return { type: 'video', url: value };
  } catch {
    return null;
  }
  return null;
}

export const EmbeddedRecording: React.FC<{ url: string }> = ({ url }) => {
  const source = recordingSource(url);
  return <div className="space-y-3">
    {source?.type === 'video' && <video controls preload="metadata" className="aspect-video w-full rounded-xl bg-black" src={source.url}>Your browser cannot play this recording.</video>}
    {source?.type === 'iframe' && <iframe title="Memorial service recording" src={source.url} className="aspect-video w-full rounded-xl bg-black" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />}
    <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-gold-light underline underline-offset-4">{source ? 'Open recording in a new tab' : 'Watch the recording'}</a>
  </div>;
};
