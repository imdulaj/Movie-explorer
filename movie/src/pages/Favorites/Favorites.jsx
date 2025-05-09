import { Container, Typography, Box, Button } from '@mui/material';
import { useMovies } from '../../context/MovieContext';
import MovieGrid from '../../components/MovieGrid/MovieGrid';
import './Favorites.css';

const Favorites = () => {
  const { favorites } = useMovies();

  return (
    <Container className="favorites-container fade-in">
      <Box className="favorites-header slide-up" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          My Favorites
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your collection of favorite movies.
        </Typography>
      </Box>

      {favorites.length > 0 ? (
        <MovieGrid
          movies={favorites}
          title={`${favorites.length} Favorite ${favorites.length === 1 ? 'Movie' : 'Movies'}`}
          loading={false}
        />
      ) : (
        <Box className="empty-favorites slide-up" textAlign="center" py={8}>
          <Typography variant="h6" gutterBottom>
            No favorites yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Start exploring movies and add some to your favorites.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            href="/"
            className="explore-button"
          >
            Explore Movies
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Favorites;