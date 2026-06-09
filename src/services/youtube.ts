import type { Track } from '../types';
import { useLibraryStore } from '../store/libraryStore';

const PROXY_URL = '/api/youtube';

// Helper to handle API requests with Zustand caching
const fetchWithCache = async <T>(cacheKey: string, fetcher: () => Promise<T>): Promise<T> => {
  const store = useLibraryStore.getState();
  const cached = store.getCache(cacheKey);
  if (cached) return cached as T;

  try {
    const data = await fetcher();
    store.setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`API Error for ${cacheKey}:`, error);
    throw error;
  }
};

// Helper for HTTP requests using native fetch
const getRequest = async (params: Record<string, any>) => {
  if (typeof window === 'undefined') {
    // During server-side rendering, fetch local proxy directly
    throw new Error('API calls should only be made on the client.');
  }
  
  const isGitHubPages = window.location.hostname.includes('github.io');
  
  if (isGitHubPages) {
    // If hosted on GitHub Pages, fetch directly from YouTube Data API v3!
    const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
    if (!API_KEY) {
      console.error('VITE_YOUTUBE_API_KEY is missing in client build.');
      throw new Error('YouTube API Key is missing in client build.');
    }
    
    const BASE_URL = 'https://www.googleapis.com/youtube/v3';
    const action = params.action;
    let fetchUrl = '';
    const queryParams = new URLSearchParams();
    queryParams.set('key', API_KEY);

    if (action === 'search') {
      fetchUrl = `${BASE_URL}/search`;
      queryParams.set('part', 'snippet');
      queryParams.set('q', params.q || '');
      queryParams.set('type', params.type || 'video');
      queryParams.set('maxResults', String(params.maxResults || '20'));
      if (params.type === 'video') queryParams.set('videoCategoryId', '10');
      if (params.regionCode) queryParams.set('regionCode', params.regionCode);
      if (params.channelId) queryParams.set('channelId', params.channelId);
      if (params.order) queryParams.set('order', params.order);
    } else if (action === 'trending') {
      fetchUrl = `${BASE_URL}/videos`;
      queryParams.set('part', 'snippet,contentDetails,statistics');
      queryParams.set('chart', 'mostPopular');
      queryParams.set('videoCategoryId', '10');
      queryParams.set('regionCode', params.regionCode || 'US');
      queryParams.set('maxResults', String(params.maxResults || '20'));
    } else if (action === 'video-details') {
      fetchUrl = `${BASE_URL}/videos`;
      queryParams.set('part', 'snippet,statistics,contentDetails');
      queryParams.set('id', params.id || '');
    } else if (action === 'channel-details') {
      fetchUrl = `${BASE_URL}/channels`;
      queryParams.set('part', 'snippet,statistics');
      queryParams.set('id', params.id || '');
    } else if (action === 'playlist-details') {
      fetchUrl = `${BASE_URL}/playlists`;
      queryParams.set('part', 'snippet,contentDetails');
      queryParams.set('id', params.id || '');
    } else if (action === 'playlist-items') {
      fetchUrl = `${BASE_URL}/playlistItems`;
      queryParams.set('part', 'snippet');
      queryParams.set('playlistId', params.playlistId || '');
      queryParams.set('maxResults', String(params.maxResults || '50'));
    } else if (action === 'related') {
      fetchUrl = `${BASE_URL}/search`;
      queryParams.set('part', 'snippet');
      queryParams.set('relatedToVideoId', params.relatedToVideoId || '');
      queryParams.set('type', 'video');
      queryParams.set('maxResults', String(params.maxResults || '6'));
    }

    const res = await fetch(`${fetchUrl}?${queryParams.toString()}`);
    if (!res.ok) {
      if (action === 'related' && res.status === 400) {
        const fallbackParams = new URLSearchParams();
        fallbackParams.set('key', API_KEY);
        fallbackParams.set('part', 'snippet');
        fallbackParams.set('q', params.videoTitle || 'trending music');
        fallbackParams.set('type', 'video');
        fallbackParams.set('videoCategoryId', '10');
        fallbackParams.set('maxResults', String(params.maxResults || '6'));
        const fallbackRes = await fetch(`${BASE_URL}/search?${fallbackParams.toString()}`);
        if (fallbackRes.ok) {
          return fallbackRes.json();
        }
      }
      throw new Error(`Failed to fetch from YouTube API: ${res.statusText}`);
    }
    return res.json();
  }

  const url = new URL(PROXY_URL, window.location.origin);
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      url.searchParams.set(key, String(val));
    }
  });

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.statusText}`);
  }
  return res.json();
};

export const searchTracks = async (query: string, maxResults = 20, regionCode?: string): Promise<Track[]> => {
  return fetchWithCache(`search_${query}_${maxResults}_${regionCode || 'none'}`, async () => {
    const data = await getRequest({
      action: 'search',
      q: query,
      type: 'video',
      maxResults,
      regionCode,
    });

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
    }));
  });
};

export const getTrendingTracks = async (regionCode = 'US', maxResults = 20): Promise<Track[]> => {
  return fetchWithCache(`trending_${regionCode}_${maxResults}`, async () => {
    try {
      const data = await getRequest({
        action: 'trending',
        regionCode,
        maxResults,
      });

      return data.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
        publishedAt: item.snippet.publishedAt,
        viewCount: item.statistics?.viewCount,
        duration: item.contentDetails?.duration,
      }));
    } catch (error) {
      console.error(`Error fetching trending tracks for ${regionCode}:`, error);
      return searchTracks(`trending music 2026 ${regionCode}`, maxResults, regionCode);
    }
  });
};

export const searchArtists = async (query: string, maxResults = 5) => {
  return fetchWithCache(`artist_${query}_${maxResults}`, async () => {
    const data = await getRequest({
      action: 'search',
      q: query,
      type: 'channel',
      maxResults,
    });

    return data.items.map((item: any) => ({
      id: item.id.channelId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      description: item.snippet.description,
    }));
  });
};

export const searchPlaylists = async (query: string, maxResults = 5) => {
  return fetchWithCache(`playlists_${query}_${maxResults}`, async () => {
    const data = await getRequest({
      action: 'search',
      q: query,
      type: 'playlist',
      maxResults,
    });

    return data.items.map((item: any) => ({
      id: item.id.playlistId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
    }));
  });
};

export const getRelatedTracks = async (videoId: string, maxResults = 6, videoTitle?: string): Promise<Track[]> => {
  return fetchWithCache(`related_${videoId}_${maxResults}`, async () => {
    const data = await getRequest({
      action: 'related',
      relatedToVideoId: videoId,
      videoTitle: videoTitle || 'music',
      maxResults,
    });

    return data.items.map((item: any) => ({
      id: item.id.videoId || item.id,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
    }));
  });
};

export const getTrackDetails = async (videoId: string): Promise<Track | null> => {
  return fetchWithCache(`details_${videoId}`, async () => {
    const data = await getRequest({
      action: 'video-details',
      id: videoId,
    });

    if (data.items.length === 0) return null;
    const item = data.items[0];

    return {
      id: item.id,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
      viewCount: item.statistics?.viewCount,
      likeCount: item.statistics?.likeCount,
      duration: item.contentDetails?.duration,
    };
  });
};

export const getChannelDetails = async (channelId: string) => {
  return fetchWithCache(`channel_${channelId}`, async () => {
    const data = await getRequest({
      action: 'channel-details',
      id: channelId,
    });
    
    if (data.items.length === 0) return null;
    const item = data.items[0];
    
    return {
      id: item.id,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      subscriberCount: item.statistics?.subscriberCount,
      videoCount: item.statistics?.videoCount,
      bannerUrl: item.snippet.thumbnails.high?.url,
    };
  });
};

export const getChannelVideos = async (channelId: string, order: 'date' | 'viewCount', maxResults = 12): Promise<Track[]> => {
  return fetchWithCache(`channel_vids_${channelId}_${order}_${maxResults}`, async () => {
    const data = await getRequest({
      action: 'search',
      channelId,
      order,
      maxResults,
      type: 'video',
    });

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
    }));
  });
};

export const getPlaylistDetails = async (playlistId: string) => {
  return fetchWithCache(`playlist_details_${playlistId}`, async () => {
    const data = await getRequest({
      action: 'playlist-details',
      id: playlistId,
    });
    
    if (data.items.length === 0) return null;
    return data.items[0];
  });
};

export const getPlaylistItems = async (playlistId: string, maxResults = 50): Promise<Track[]> => {
  return fetchWithCache(`playlist_items_${playlistId}_${maxResults}`, async () => {
    const data = await getRequest({
      action: 'playlist-items',
      playlistId,
      maxResults,
    });

    return data.items
      .filter((item: any) => item.snippet?.resourceId?.videoId)
      .map((item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        artist: item.snippet.videoOwnerChannelTitle || item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      }));
  });
};

export const getIndianTrending = () => getTrendingTracks('IN', 15);
export const getGlobalTrending = () => getTrendingTracks('US', 10);
export const getNightDriveMix = () => searchTracks('late night drive music playlist', 6);
