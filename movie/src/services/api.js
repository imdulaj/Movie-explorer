import axios from 'axios';

const API_KEY = '8ed5b20fc11b2641a27a6189b81c0e35'; // Replace with your actual API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// For demo purposes, we'll use a placeholder API key
// In a real app, you would store this in an environment variable
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const fetchTrending = async () => {
  try {
    const response = await tmdbApi.get('/trending/movie/day');
    return response.data;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
};

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await tmdbApi.get('/search/movie', {
      params: {
        query,
        page,
        include_adult: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'credits,videos',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

export const getMoviesByFilter = async (filters = {}) => {
  const { genre, year, rating, page = 1 } = filters;
  
  try {
    const params = {
      page,
      include_adult: false,
    };
    
    if (genre) params.with_genres = genre;
    if (year) params.primary_release_year = year;
    if (rating) params.vote_average_gte = rating;
    
    const response = await tmdbApi.get('/discover/movie', { params });
    return response.data;
  } catch (error) {
    console.error('Error filtering movies:', error);
    throw error;
  }
};

export const getGenres = async () => {
  try {
    const response = await tmdbApi.get('/genre/movie/list');
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://via.placeholder.com/300x450?text=No+Image';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getYoutubeUrl = (key) => {
  return `https://www.youtube.com/embed/${key}`;
};