import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  InputBase, 
  IconButton, 
  Paper, 
  CircularProgress,
  Box
} from '@mui/material';
import { 
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useMovies } from '../../context/MovieContext';
import './SearchBar.css';

const SearchBar = ({ fullWidth = false, autoFocus = false, onSearch }) => {
  const { searchQuery, search, loading, clearSearch } = useMovies();
  const [query, setQuery] = useState(searchQuery || '');
  const navigate = useNavigate();

  useEffect(() => {
    setQuery(searchQuery || '');
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (query.trim()) {
      search(query);
      navigate('/');
      if (onSearch) onSearch();
    }
  };

  const handleClear = () => {
    setQuery('');
    clearSearch();
  };

  return (
    <Paper 
      component="form"
      onSubmit={handleSearch}
      className={`search-bar ${fullWidth ? 'search-bar-full' : ''}`}
      elevation={0}
      sx={{ 
        display: 'flex', 
        alignItems: 'center',
        borderRadius: 2,
        p: '2px 4px',
      }}
    >
      <IconButton type="submit" aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        placeholder="Search for movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        fullWidth
        autoFocus={autoFocus}
        className="search-input"
        sx={{ ml: 1, flex: 1 }}
      />
      {loading ? (
        <Box sx={{ display: 'flex', padding: '8px' }}>
          <CircularProgress size={20} />
        </Box>
      ) : (
        query && (
          <IconButton aria-label="clear" onClick={handleClear}>
            <ClearIcon />
          </IconButton>
        )
      )}
    </Paper>
  );
};

export default SearchBar;