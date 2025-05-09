import { createContext, useState, useContext, useEffect } from 'react';
import { fetchTrending, searchMovies } from '../services/api';

const MovieContext = createContext();

export const useMovies = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [searchQuery, setSearchQuery] = useState(() => {
    const savedQuery = localStorage.getItem('lastSearch');
    return savedQuery || '';
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (searchQuery) {
      localStorage.setItem('lastSearch', searchQuery);
    }
  }, [searchQuery]);

  const loadTrending = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTrending();
      setTrendingMovies(data.results);
    } catch (err) {
      setError('Failed to load trending movies. Please try again later.');
      console.error('Error loading trending movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const search = async (query, page = 1, resetResults = true) => {
    if (!query.trim()) {
      setMovies([]);
      setTotalPages(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSearchQuery(query);
      const data = await searchMovies(query, page);
      
      if (resetResults) {
        setMovies(data.results);
      } else {
        setMovies(prev => [...prev, ...data.results]);
      }
      
      setTotalPages(data.total_pages);
      setPage(page);
    } catch (err) {
      setError('Failed to search movies. Please try again later.');
      console.error('Error searching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (page < totalPages) {
      await search(searchQuery, page + 1, false);
    }
  };

  const toggleFavorite = (movie) => {
    setFavorites(prev => {
      const isFavorite = prev.some(fav => fav.id === movie.id);
      
      if (isFavorite) {
        return prev.filter(fav => fav.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
  };

  const isFavorite = (movieId) => {
    return favorites.some(movie => movie.id === movieId);
  };

  const clearSearch = () => {
    setMovies([]);
    setSearchQuery('');
    setPage(1);
    setTotalPages(0);
    localStorage.removeItem('lastSearch');
  };

  const value = {
    movies,
    trendingMovies,
    favorites,
    searchQuery,
    loading,
    error,
    page,
    totalPages,
    loadTrending,
    search,
    loadMore,
    toggleFavorite,
    isFavorite,
    clearSearch
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};