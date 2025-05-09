import { useEffect, useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Tabs, 
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  FormGroup,
  Alert,
  Paper
} from '@mui/material';
import { useMovies } from '../../context/MovieContext';
import MovieGrid from '../../components/MovieGrid/MovieGrid';
import { getGenres, getMoviesByFilter } from '../../services/api';
import './Home.css';

const Home = () => {
  const { 
    movies, 
    trendingMovies, 
    loading, 
    error, 
    loadTrending, 
    loadMore, 
    searchQuery 
  } = useMovies();
  
  const [activeTab, setActiveTab] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({
    genre: '',
    year: new Date().getFullYear(),
    rating: 0
  });
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);
  const [filterError, setFilterError] = useState(null);

  useEffect(() => {
    loadTrending();
    
    // Load genres for filters
    const loadGenres = async () => {
      try {
        const genreList = await getGenres();
        setGenres(genreList);
      } catch (err) {
        console.error('Error loading genres:', err);
      }
    };
    
    loadGenres();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    
    if (newValue === 1 && !showFilters) {
      setShowFilters(true);
      applyFilters();
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = async () => {
    setFilterLoading(true);
    setFilterError(null);
    
    try {
      const data = await getMoviesByFilter(filters);
      setFilteredMovies(data.results);
    } catch (err) {
      setFilterError('Failed to apply filters. Please try again.');
      console.error('Error applying filters:', err);
    } finally {
      setFilterLoading(false);
    }
  };

  const handleYearChange = (event, newValue) => {
    handleFilterChange('year', newValue);
  };

  const getYearMarks = () => {
    const currentYear = new Date().getFullYear();
    return [
      { value: currentYear - 10, label: `${currentYear - 10}` },
      { value: currentYear - 5, label: `${currentYear - 5}` },
      { value: currentYear, label: `${currentYear}` }
    ];
  };

  const clearFilters = () => {
    setFilters({
      genre: '',
      year: new Date().getFullYear(),
      rating: 0
    });
  };

  useEffect(() => {
    if (activeTab === 1 && showFilters) {
      const timer = setTimeout(() => {
        applyFilters();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [filters, activeTab, showFilters]);

  return (
    <Container className="home-container">
      <Box className="hero-section slide-up" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Discover and Explore Movies
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Find information about your favorite movies, watch trailers, and keep track of what you love.
        </Typography>
      </Box>

      <Tabs 
        value={activeTab} 
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        className="movie-tabs"
        sx={{ mb: 3 }}
      >
        <Tab label={searchQuery ? "Search Results" : "Trending"} />
        <Tab label="Discover" />
      </Tabs>

      {activeTab === 1 && (
        <Paper elevation={0} className="filters-section" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <FormControl sx={{ minWidth: 200, flex: 1 }}>
              <InputLabel>Genre</InputLabel>
              <Select
                value={filters.genre}
                label="Genre"
                onChange={(e) => handleFilterChange('genre', e.target.value)}
              >
                <MenuItem value="">All Genres</MenuItem>
                {genres.map((genre) => (
                  <MenuItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box sx={{ flex: 2, minWidth: 200 }}>
              <Typography gutterBottom>Year: {filters.year}</Typography>
              <Slider
                value={filters.year}
                min={1990}
                max={new Date().getFullYear()}
                step={1}
                marks={getYearMarks()}
                onChange={handleYearChange}
                valueLabelDisplay="auto"
              />
            </Box>
            
            <Box sx={{ flex: 2, minWidth: 200 }}>
              <Typography gutterBottom>
                Minimum Rating: {filters.rating > 0 ? `${filters.rating}/5` : 'Any'}
              </Typography>
              <Slider
                value={filters.rating}
                min={0}
                max={5}
                step={0.5}
                marks={[
                  { value: 0, label: 'Any' },
                  { value: 3, label: '3' },
                  { value: 5, label: '5' }
                ]}
                onChange={(e, val) => handleFilterChange('rating', val)}
                valueLabelDisplay="auto"
              />
            </Box>
          </Box>
          
          {filterError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {filterError}
            </Alert>
          )}
          
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>Active filters:</Typography>
            {filters.genre && genres.length > 0 && (
              <Chip 
                label={`Genre: ${genres.find(g => g.id === filters.genre)?.name || 'Unknown'}`} 
                onDelete={() => handleFilterChange('genre', '')}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {filters.year < new Date().getFullYear() && (
              <Chip 
                label={`Year: ${filters.year}`} 
                onDelete={() => handleFilterChange('year', new Date().getFullYear())}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {filters.rating > 0 && (
              <Chip 
                label={`Rating: ≥ ${filters.rating}/5`} 
                onDelete={() => handleFilterChange('rating', 0)}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {(filters.genre || filters.year < new Date().getFullYear() || filters.rating > 0) && (
              <Chip 
                label="Clear All" 
                onClick={clearFilters}
                size="small"
                color="secondary"
              />
            )}
          </Box>
        </Paper>
      )}
      
      {activeTab === 0 && (
        <MovieGrid 
          movies={searchQuery ? movies : trendingMovies} 
          loading={loading} 
          error={error}
          title={searchQuery ? `Search Results: "${searchQuery}"` : "Trending Movies"}
          hasMore={searchQuery ? true : false}
          onLoadMore={loadMore}
          useInfiniteScroll={true}
        />
      )}
      
      {activeTab === 1 && (
        <MovieGrid 
          movies={filteredMovies} 
          loading={filterLoading} 
          error={filterError}
          title="Discover Movies"
        />
      )}
    </Container>
  );
};

export default Home;