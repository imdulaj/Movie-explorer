import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Chip, 
  Rating, 
  Button, 
  Grid,
  IconButton,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Skeleton,
  Alert,
  Tooltip
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder,
  ArrowBack,
  PlayArrow
} from '@mui/icons-material';
import { getMovieDetails, getImageUrl, getYoutubeUrl } from '../../services/api';
import { useMovies } from '../../context/MovieContext';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useMovies();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (err) {
        setError('Failed to load movie details. Please try again later.');
        console.error('Error fetching movie details:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovieDetails();
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);
  
  const handleFavoriteToggle = () => {
    if (movie) {
      toggleFavorite(movie);
    }
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleTrailerClick = () => {
    setShowTrailer(true);
  };
  
  const getTrailerKey = () => {
    if (!movie || !movie.videos || !movie.videos.results) return null;
    
    const trailer = movie.videos.results.find(
      video => video.type === 'Trailer' && video.site === 'YouTube'
    );
    
    return trailer ? trailer.key : null;
  };
  
  const trailerKey = movie ? getTrailerKey() : null;
  const favorite = movie ? isFavorite(movie.id) : false;
  
  if (loading) {
    return (
      <Container maxWidth="lg" className="movie-detail-container">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width={100} sx={{ ml: 2 }} />
        </Box>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={450} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Skeleton variant="text" width="60%" height={60} />
            <Skeleton variant="text" width="40%" height={30} sx={{ mt: 1 }} />
            <Skeleton variant="text" width="30%" height={30} sx={{ mt: 1, mb: 2 }} />
            <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {Array(5).fill().map((_, i) => (
                <Skeleton key={i} variant="rounded" width={80} height={32} />
              ))}
            </Box>
            <Divider sx={{ my: 3 }} />
            <Skeleton variant="text" width="40%" height={40} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
              {Array(4).fill().map((_, i) => (
                <Skeleton key={i} variant="rectangular" width={120} height={180} />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" className="movie-detail-container">
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Container>
    );
  }
  
  if (!movie) return null;
  
  const releaseYear = movie.release_date 
    ? new Date(movie.release_date).getFullYear() 
    : 'N/A';
  
  // Convert vote_average from 0-10 scale to 0-5 scale for the Rating component
  const rating = Math.round((movie.vote_average / 2) * 10) / 10;
  
  return (
    <Container maxWidth="lg" className="movie-detail-container fade-in">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={handleBack}
          className="back-button"
        >
          Back
        </Button>
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box className="poster-container">
            <img 
              src={getImageUrl(movie.poster_path, 'w500')} 
              alt={movie.title}
              className="movie-poster"
            />
          </Box>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<Favorite />}
              onClick={handleFavoriteToggle}
              className={`favorite-button ${favorite ? 'is-favorite' : ''}`}
              sx={{
                width: '100%',
                bgcolor: favorite ? 'error.main' : 'primary.main',
              }}
            >
              {favorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
          </Box>
          
          {trailerKey && (
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              startIcon={<PlayArrow />}
              onClick={handleTrailerClick}
              sx={{ mt: 2, width: '100%' }}
              className="trailer-button"
            >
              Watch Trailer
            </Button>
          )}
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Box className="movie-info slide-up">
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
              {movie.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Chip label={releaseYear} color="primary" />
              <Chip 
                label={`${movie.runtime} min`} 
                variant="outlined"
                sx={{ display: movie.runtime ? 'inline-flex' : 'none' }} 
              />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating value={rating} precision={0.5} readOnly />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  {rating}/5 ({movie.vote_count} votes)
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {movie.genres?.map(genre => (
                <Chip 
                  key={genre.id} 
                  label={genre.name} 
                  size="small"
                  variant="outlined"
                  className="genre-chip"
                />
              ))}
            </Box>
            
            <Typography variant="h6" gutterBottom>Overview</Typography>
            <Typography variant="body1" paragraph className="overview">
              {movie.overview || 'No overview available.'}
            </Typography>
            
            {showTrailer && trailerKey && (
              <Box className="trailer-container" sx={{ my: 3 }}>
                <Typography variant="h6" gutterBottom>Trailer</Typography>
                <Box sx={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden', borderRadius: 2 }}>
                  <iframe
                    src={getYoutubeUrl(trailerKey)}
                    title={`${movie.title} Trailer`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                    }}
                  ></iframe>
                </Box>
              </Box>
            )}
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>Cast</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 2, overflowX: 'auto', pb: 2 }} className="cast-container">
              {movie.credits?.cast?.slice(0, 10).map(person => (
                <Card key={person.id} sx={{ minWidth: 120, width: 120 }} className="cast-card">
                  <CardMedia
                    component="img"
                    height={180}
                    image={
                      person.profile_path 
                        ? getImageUrl(person.profile_path, 'w185') 
                        : 'https://via.placeholder.com/185x278?text=No+Image'
                    }
                    alt={person.name}
                  />
                  <CardContent sx={{ p: 1 }}>
                    <Typography variant="body2" fontWeight="medium" noWrap>
                      {person.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {person.character}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
              
              {(!movie.credits?.cast || movie.credits.cast.length === 0) && (
                <Typography variant="body2" color="text.secondary">
                  No cast information available.
                </Typography>
              )}
            </Box>
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Details</Typography>
              <Grid container spacing={2}>
                {movie.production_companies?.length > 0 && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight="medium">
                      Production
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {movie.production_companies.map(company => company.name).join(', ')}
                    </Typography>
                  </Grid>
                )}
                
                {movie.original_language && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight="medium">
                      Original Language
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Intl.DisplayNames(['en'], { type: 'language' }).of(movie.original_language)}
                    </Typography>
                  </Grid>
                )}
                
                {movie.budget > 0 && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight="medium">
                      Budget
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${movie.budget.toLocaleString()}
                    </Typography>
                  </Grid>
                )}
                
                {movie.revenue > 0 && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight="medium">
                      Revenue
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${movie.revenue.toLocaleString()}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MovieDetail;