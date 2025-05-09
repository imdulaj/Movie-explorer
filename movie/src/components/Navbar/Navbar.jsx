import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  Menu, 
  MenuItem, 
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Brightness4 as MoonIcon, 
  Brightness7 as SunIcon, 
  Favorite as FavoriteIcon,
  AccountCircle,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../SearchBar/SearchBar';
import './Navbar.css';

const Navbar = ({ darkMode, setDarkMode }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [showSearch, setShowSearch] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleFavorites = () => {
    navigate('/favorites');
    handleMobileMenuClose();
  };

  return (
    <AppBar position="fixed" className="navbar" color="default" elevation={2}>
      <Toolbar>
        <Typography 
          variant="h5" 
          component={Link} 
          to="/" 
          className="logo"
          sx={{ 
            textDecoration: 'none', 
            color: 'inherit',
            fontWeight: 'bold',
            flexGrow: { xs: 1, sm: 0 }
          }}
        >
          MovieDB
        </Typography>

        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 3, flexGrow: 1 }}>
            <SearchBar fullWidth />
          </Box>
        )}

        {isMobile && (
          <>
            <IconButton 
              edge="start" 
              color="inherit" 
              aria-label="menu"
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMobileMenuClose}
            >
              <MenuItem onClick={toggleSearch}>
                <SearchIcon sx={{ mr: 1 }} />
                Search
              </MenuItem>
              <MenuItem onClick={handleFavorites}>
                <FavoriteIcon sx={{ mr: 1 }} />
                Favorites
              </MenuItem>
              <MenuItem onClick={toggleTheme}>
                {darkMode ? <SunIcon sx={{ mr: 1 }} /> : <MoonIcon sx={{ mr: 1 }} />}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </MenuItem>
              {isAuthenticated && (
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              )}
            </Menu>
          </>
        )}

        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Favorites">
              <IconButton 
                color="inherit" 
                onClick={() => navigate('/favorites')}
                className="nav-icon"
              >
                <FavoriteIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
              <IconButton 
                color="inherit" 
                onClick={toggleTheme}
                className="nav-icon"
              >
                {darkMode ? <SunIcon /> : <MoonIcon />}
              </IconButton>
            </Tooltip>

            {isAuthenticated ? (
              <>
                <Tooltip title="Account">
                  <IconButton
                    color="inherit"
                    onClick={handleMenuOpen}
                    className="nav-icon"
                  >
                    <AccountCircle />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem disabled>
                    {user?.username || 'User'}
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button 
                color="inherit"
                component={Link}
                to="/login"
              >
                Login
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
      
      {isMobile && showSearch && (
        <Box sx={{ p: 1, bgcolor: 'background.paper' }}>
          <SearchBar fullWidth autoFocus onSearch={() => setShowSearch(false)} />
        </Box>
      )}
    </AppBar>
  );
};

export default Navbar;