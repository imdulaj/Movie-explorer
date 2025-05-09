import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  IconButton, 
  Rating, 
  Box,
  CardActionArea,
  Chip
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder 
} from '@mui/icons-material';
import { useMovies } from '../../context/MovieContext';
import { getImageUrl } from '../../services/api';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const { toggleFavorite, isFavorite } = useMovies();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  const favorite = isFavorite(movie.id);
  
  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };
  
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(movie);
  };
  
  // Convert vote_average from 0-10 scale to 0-5 scale
  const rating = Math.round((movie.vote_average / 2) * 10) / 10;
  
  const releaseYear = movie.release_date 
    ? new Date(movie.release_date).getFullYear() 
    : 'N/A';
  
  return (
    <Card 
      className={`movie-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <CardActionArea onClick={handleCardClick} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        <Box sx={{ position: 'relative', paddingTop: '150%' }}>
          <CardMedia
            component="img"
            image={getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="movie-poster"
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <Box 
            className="movie-overlay"
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
              padding: 1,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            <Typography variant="body2" color="white">
              {movie.overview ? `${movie.overview.slice(0, 80)}...` : 'No description available'}
            </Typography>
          </Box>
        </Box>
        
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography 
              variant="h6" 
              component="div" 
              className="movie-title"
              sx={{ 
                fontWeight: 'bold',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                mr: 1,
                flexGrow: 1
              }}
            >
              {movie.title}
            </Typography>
            <Chip 
              label={releaseYear} 
              size="small" 
              color="primary" 
              variant="outlined" 
              sx={{ fontWeight: 'medium' }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
            <Rating 
              value={rating}
              precision={0.5}
              readOnly
              size="small"
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              {rating}/5
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      
      <IconButton 
        className={`favorite-button ${favorite ? 'is-favorite' : ''}`}
        onClick={handleFavoriteClick}
        sx={{ 
          position: 'absolute', 
          top: 8, 
          right: 8, 
          bgcolor: 'rgba(255,255,255,0.8)',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.9)'
          }
        }}
      >
        {favorite ? 
          <Favorite color="error" /> : 
          <FavoriteBorder />
        }
      </IconButton>
    </Card>
  );
};

export default MovieCard;