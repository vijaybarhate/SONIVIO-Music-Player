import axios from 'axios';
import { Track } from '../types';
import { cacheService } from './cache';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Delay helper to prevent 429 Rate Limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(ms > 0 ? resolve : () => {}, ms));

export const searchTracks = async (query: string, maxResults = 20, waitTime = 0): Promise<Track[]> => {
  const cacheKey = `search_${query}_${maxResults}`;
  const cached = cacheService.get<Track[]>(cacheKey);
  if (cached) return cached;

  if (waitTime > 0) await delay(waitTime);

  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        maxResults,
        q: query,
        type: 'video',
        videoCategoryId: '10', // Music category
        key: API_KEY,
      },
    });

    const tracks: Track[] = response.data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
    }));

    cacheService.set(cacheKey, tracks);
    return tracks;
  } catch (error: any) {
    console.error('Error fetching from YouTube API:', error);
    
    // Fallback to expired cache if available during 429 errors
    const fallback = cacheService.getFallback<Track[]>(cacheKey);
    if (fallback) {
      console.warn('Rate limit hit or error. Using fallback data for query:', query);
      return fallback;
    }
    
    throw error;
  }
};

export const getTrendingTracks = async (): Promise<Track[]> => {
  const cacheKey = 'trending_tracks';
  const cached = cacheService.get<Track[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'snippet,contentDetails,statistics',
        chart: 'mostPopular',
        regionCode: 'US',
        videoCategoryId: '10',
        maxResults: 20,
        key: API_KEY,
      },
    });

    const tracks: Track[] = response.data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
    }));

    cacheService.set(cacheKey, tracks);
    return tracks;
  } catch (error) {
    console.error('Error fetching trending tracks:', error);
    return searchTracks('trending music 2026'); // Fallback to search
  }
};

export const getIndianTrending = () => searchTracks('indian trending songs 2026', 15, 200);
export const getGlobalTrending = () => searchTracks('global top 50 music 2026', 15, 400);
export const getWorkoutMix = () => searchTracks('phonk gym workout music mix', 15, 600);
export const getConcentrationMix = () => searchTracks('deep focus binaural beats ambient', 15, 800);
export const getNightDriveMix = () => searchTracks('synthwave retrowave night drive music', 15, 1000);
export const getIndieMix = () => searchTracks('indie alternative bedroom pop 2026', 15, 1200);
export const getElectronicMix = () => searchTracks('cyberpunk industrial techno electronic', 15, 1400);
