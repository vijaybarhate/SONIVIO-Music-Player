import axios from 'axios';
import { Track } from '../types';
import { usePlayerStore } from '../store/playerStore';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Helper to handle API requests with Zustand caching
const fetchWithCache = async <T>(cacheKey: string, fetcher: () => Promise<T>): Promise<T> => {
  const store = usePlayerStore.getState();
  const cached = store.getCache(cacheKey);
  if (cached) return cached as T;

  try {
    const data = await fetcher();
    store.setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`API Error for ${cacheKey}:`, error);
    // In case of error, if we have an expired cache entry, we might want to return it but Zustand logic currently returns null if expired.
    // For now, throw the error so UI handles the error state.
    throw error;
  }
};

export const searchTracks = async (query: string, maxResults = 20, regionCode?: string): Promise<Track[]> => {
  return fetchWithCache(`search_${query}_${maxResults}_${regionCode || 'none'}`, async () => {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        maxResults,
        q: query,
        type: 'video',
        videoCategoryId: '10', // Music
        regionCode,
        key: API_KEY,
      },
    });

    return response.data.items.map((item: any) => ({
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
      const response = await axios.get(`${BASE_URL}/videos`, {
        params: {
          part: 'snippet,contentDetails,statistics',
          chart: 'mostPopular',
          regionCode,
          videoCategoryId: '10',
          maxResults,
          key: API_KEY,
        },
      });

      return response.data.items.map((item: any) => ({
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
      // Fallback to search if chart is unavailable in the region
      return searchTracks(`trending music 2026 ${regionCode}`, maxResults, regionCode);
    }
  });
};

export const searchArtists = async (query: string, maxResults = 5) => {
  return fetchWithCache(`artist_${query}_${maxResults}`, async () => {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        maxResults,
        q: query,
        type: 'channel',
        key: API_KEY,
      },
    });

    // In a real app, you might map this to a specific Artist type
    return response.data.items.map((item: any) => ({
      id: item.id.channelId,
      title: item.snippet.title, // Channel Name
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      description: item.snippet.description,
    }));
  });
};

export const searchPlaylists = async (query: string, maxResults = 5) => {
  return fetchWithCache(`playlists_${query}_${maxResults}`, async () => {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        maxResults,
        q: query,
        type: 'playlist',
        key: API_KEY,
      },
    });

    return response.data.items.map((item: any) => ({
      id: item.id.playlistId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
    }));
  });
};

export const getRelatedTracks = async (videoId: string, maxResults = 6): Promise<Track[]> => {
  return fetchWithCache(`related_${videoId}_${maxResults}`, async () => {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        relatedToVideoId: videoId,
        type: 'video',
        maxResults,
        key: API_KEY,
      },
    });

    return response.data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
    }));
  });
};

export const getTrackDetails = async (videoId: string): Promise<Track | null> => {
  return fetchWithCache(`details_${videoId}`, async () => {
    const response = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'snippet,statistics,contentDetails',
        id: videoId,
        key: API_KEY,
      },
    });

    if (response.data.items.length === 0) return null;
    const item = response.data.items[0];

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
    const response = await axios.get(`${BASE_URL}/channels`, {
      params: {
        part: 'snippet,statistics',
        id: channelId,
        key: API_KEY,
      },
    });
    
    if (response.data.items.length === 0) return null;
    const item = response.data.items[0];
    
    return {
      id: item.id,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      subscriberCount: item.statistics?.subscriberCount,
      videoCount: item.statistics?.videoCount,
      bannerUrl: item.snippet.thumbnails.high?.url, // Normally banner is in brandingSettings, keeping it simple
    };
  });
};

export const getChannelVideos = async (channelId: string, order: 'date' | 'viewCount', maxResults = 12): Promise<Track[]> => {
  return fetchWithCache(`channel_vids_${channelId}_${order}_${maxResults}`, async () => {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        channelId,
        order,
        maxResults,
        type: 'video',
        key: API_KEY,
      },
    });

    return response.data.items.map((item: any) => ({
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
    const response = await axios.get(`${BASE_URL}/playlists`, {
      params: {
        part: 'snippet,contentDetails',
        id: playlistId,
        key: API_KEY,
      },
    });
    
    if (response.data.items.length === 0) return null;
    return response.data.items[0];
  });
};

export const getPlaylistItems = async (playlistId: string, maxResults = 50): Promise<Track[]> => {
  return fetchWithCache(`playlist_items_${playlistId}_${maxResults}`, async () => {
    const response = await axios.get(`${BASE_URL}/playlistItems`, {
      params: {
        part: 'snippet',
        playlistId,
        maxResults,
        key: API_KEY,
      },
    });

    return response.data.items
      .filter((item: any) => item.snippet.resourceId.videoId)
      .map((item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        artist: item.snippet.videoOwnerChannelTitle || item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      }));
  });
};

// Kept for backward compatibility if used directly
export const getIndianTrending = () => getTrendingTracks('IN', 15);
export const getGlobalTrending = () => getTrendingTracks('US', 10);
export const getNightDriveMix = () => searchTracks('late night drive music playlist', 6);
