import type { APIRoute } from 'astro';

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const GET: APIRoute = async ({ request }) => {
  // In Astro, server-side environment variables are read from import.meta.env
  // On Cloudflare Pages, they are also injected into process.env or platform context
  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || 
                    (typeof process !== 'undefined' ? process.env.VITE_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY : '');

  if (!API_KEY) {
    return new Response(JSON.stringify({ error: 'YouTube API Key is missing on the server.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  try {
    let fetchUrl = '';
    const params = new URLSearchParams();
    params.set('key', API_KEY);

    if (action === 'search') {
      const q = url.searchParams.get('q') || '';
      const type = url.searchParams.get('type') || 'video';
      const maxResults = url.searchParams.get('maxResults') || '20';
      const regionCode = url.searchParams.get('regionCode');
      const channelId = url.searchParams.get('channelId');
      const order = url.searchParams.get('order');

      fetchUrl = `${BASE_URL}/search`;
      params.set('part', 'snippet');
      params.set('q', q);
      params.set('type', type);
      params.set('maxResults', maxResults);
      if (type === 'video') params.set('videoCategoryId', '10'); // Music
      if (regionCode) params.set('regionCode', regionCode);
      if (channelId) params.set('channelId', channelId);
      if (order) params.set('order', order);

    } else if (action === 'trending') {
      const regionCode = url.searchParams.get('regionCode') || 'US';
      const maxResults = url.searchParams.get('maxResults') || '20';

      fetchUrl = `${BASE_URL}/videos`;
      params.set('part', 'snippet,contentDetails,statistics');
      params.set('chart', 'mostPopular');
      params.set('videoCategoryId', '10'); // Music
      params.set('regionCode', regionCode);
      params.set('maxResults', maxResults);

    } else if (action === 'video-details') {
      const id = url.searchParams.get('id') || '';

      fetchUrl = `${BASE_URL}/videos`;
      params.set('part', 'snippet,statistics,contentDetails');
      params.set('id', id);

    } else if (action === 'channel-details') {
      const id = url.searchParams.get('id') || '';

      fetchUrl = `${BASE_URL}/channels`;
      params.set('part', 'snippet,statistics');
      params.set('id', id);

    } else if (action === 'playlist-details') {
      const id = url.searchParams.get('id') || '';

      fetchUrl = `${BASE_URL}/playlists`;
      params.set('part', 'snippet,contentDetails');
      params.set('id', id);

    } else if (action === 'playlist-items') {
      const playlistId = url.searchParams.get('playlistId') || '';
      const maxResults = url.searchParams.get('maxResults') || '50';

      fetchUrl = `${BASE_URL}/playlistItems`;
      params.set('part', 'snippet');
      params.set('playlistId', playlistId);
      params.set('maxResults', maxResults);

    } else if (action === 'related') {
      const relatedToVideoId = url.searchParams.get('relatedToVideoId') || '';
      const maxResults = url.searchParams.get('maxResults') || '6';

      // YouTube deprecated relatedToVideoId in late 2023. As a modern fallback,
      // we search for similar terms or related content based on queries if relatedToVideoId fails.
      // We will first try searching with relatedToVideoId parameter.
      fetchUrl = `${BASE_URL}/search`;
      params.set('part', 'snippet');
      params.set('relatedToVideoId', relatedToVideoId);
      params.set('type', 'video');
      params.set('maxResults', maxResults);
    } else {
      return new Response(JSON.stringify({ error: 'Invalid action parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const targetUrl = `${fetchUrl}?${params.toString()}`;
    const response = await fetch(targetUrl);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('YouTube API response error:', errorData);
      
      // Fallback for related videos if relatedToVideoId returns 400 (deprecation error)
      if (action === 'related' && response.status === 400) {
        // Fallback: search for the current video's title (if title is provided in query params)
        const videoTitle = url.searchParams.get('videoTitle') || 'trending music';
        const maxResultsParam = url.searchParams.get('maxResults') || '6';
        const fallbackParams = new URLSearchParams();
        fallbackParams.set('key', API_KEY);
        fallbackParams.set('part', 'snippet');
        fallbackParams.set('q', videoTitle);
        fallbackParams.set('type', 'video');
        fallbackParams.set('videoCategoryId', '10');
        fallbackParams.set('maxResults', maxResultsParam);
        
        const fallbackUrl = `${BASE_URL}/search?${fallbackParams.toString()}`;
        const fallbackRes = await fetch(fallbackUrl);
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          return new Response(JSON.stringify(fallbackData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }

      return new Response(JSON.stringify({ error: 'Failed to fetch from YouTube API', details: errorData }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=1800', // Cache for 30 minutes on CDN/browser
      },
    });

  } catch (err: any) {
    console.error('Proxy Endpoint Exception:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error', message: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
