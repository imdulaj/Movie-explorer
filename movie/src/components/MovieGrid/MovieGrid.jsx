import { useRef, useCallback } from 'react';
import { Grid, Typography, Box, CircularProgress, Button } from '@mui/material';
import MovieCard from '../MovieCard/MovieCard';
import './MovieGrid.css';

const MovieGrid = ({ 
  movies, 
  loading, 
  error, 
  title,
  hasMore = false,
  onLoadMore = null,
  useInfiniteScroll = false,
  className = ''
}) => {
  const observer = useRef();
  
  const lastMovieElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && useInfiniteScroll) {
        onLoadMore();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, onLoadMore, useInfiniteScroll]);

  if (error) {
    return (
      <Box className="movie-grid-error" textAlign="center" py={4}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  if (movies.length === 0 && !loading) {
    return (
      <Box className="movie-grid-empty" textAlign="center" py={4}>
        <Typography variant="h6" color="text.secondary">
          No movies found
        </Typography>
      </Box>
    );
  }

  return (
    <Box className={`movie-grid-container ${className}`}>
      {title && (
        <Typography 
          variant="h5" 
          component="h2" 
          gutterBottom
          className="movie-grid-title"
          sx={{ 
            fontWeight: 'bold',
            position: 'relative',
            display: 'inline-block',
            mb: 3,
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '50%',
              height: '3px',
              bottom: '-8px',
              left: '0',
              backgroundColor: 'primary.main',
              borderRadius: '2px'
            }
          }}
        >
          {title}
        </Typography>
      )}
      
      <Grid container spacing={3} className="movie-grid">
        {movies.map((movie, index) => {
          const isLastElement = index === movies.length - 1;
          
          return (
            <Grid 
              item 
              xs={6} 
              sm={4} 
              md={3} 
              lg={2.4} 
              key={movie.id}
              ref={isLastElement && useInfiniteScroll ? lastMovieElementRef : null}
              className="movie-grid-item fade-in"
              style={{ 
                animationDelay: `${index * 0.05}s`,
              }}
            >
              <MovieCard movie={movie} />
            </Grid>
          );
        })}
      </Grid>
      
      {loading && (
        <Box textAlign="center" py={4}>
          <CircularProgress color="primary" />
        </Box>
      )}
      
      {!loading && hasMore && !useInfiniteScroll && (
        <Box textAlign="center" mt={4}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={onLoadMore}
            className="load-more-button"
          >
            Load More
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MovieGrid;