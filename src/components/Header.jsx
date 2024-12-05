import React, { useContext, useState, useCallback, useMemo } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  Drawer,
  List,
  ListItemButton,
  Box,
  ListItemText,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { signOut } from 'firebase/auth';
import { auth } from '../JS Files/Firebase';
import toast from 'react-hot-toast';
import BookLogo from '../assets/Book-Logo.svg';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import useMediaQuery from '@mui/material/useMediaQuery';
import HistoryIcon from '@mui/icons-material/History';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { signin } = useContext(AuthContext);
  const { cartItemCount } = useCart();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:750px)');

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const Signout = useCallback(async () => {
    try {
      await signOut(auth);
      toast('Good Bye!', { icon: '👋', duration: 1500 });
      handleMenuClose();
    } catch (error) {
      toast.error(error.message);
    }
  }, [handleMenuClose]);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && ['Tab', 'Shift'].includes(event.key)) return;
    setDrawerOpen(open);
  };

  const authButtons = useMemo(() => {
    if (signin.userLoggedIn) {
      return (
        <>
          {['/dashboard', '/add-new-book', '/mybooks'].map((path, index) => (
            <Link to={path} key={index} style={{ textDecoration: 'none' }}>
              <Button variant="outlined" sx={buttonStyles}>
                {path === '/dashboard'
                  ? 'Explore'
                  : path === '/add-new-book'
                    ? 'Add New Book'
                    : 'My Books'}
              </Button>
            </Link>
          ))}
          <Menu
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Avatar
                alt={signin.userLoggedIn?.displayName}
                src={signin.userLoggedIn?.photoURL || ''}
                sx={{ width: 100, height: 100, mb: 1 }}
              />
              <Typography variant="body1">
                {signin.userLoggedIn?.displayName || 'User Name'}
              </Typography>
              <Typography variant="body2">
                {signin.userLoggedIn?.email || 'Email'}
              </Typography>
              <Button variant="outlined" sx={buttonStyles} onClick={Signout}>
                Signout
              </Button>
            </Box>
          </Menu>
        </>
      );
    }
    return (
      <>
        <Link to="/signup" style={{ textDecoration: 'none' }}>
          <Button variant="outlined" sx={buttonStyles}>
            Signup
          </Button>
        </Link>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <Button variant="outlined" sx={buttonStyles}>
            Login
          </Button>
        </Link>
      </>
    );
  }, [signin.userLoggedIn, anchorEl, handleMenuClose, Signout]);

  return (
    <AppBar position="absolute" sx={appBarStyles}>
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <Typography variant="h6" sx={logoStyles}>
            <img
              src={BookLogo}
              alt="Book Logo"
              style={{ height: '40px', marginRight: '8px' }}
            />
            Online Library
          </Typography>
        </Link>
        <Box>
          {isSmallScreen ? (
            <>
              {signin.userLoggedIn ? (
                <IconButton
                  onClick={(e) => {
                    handleMenuOpen(e); // Open the profile menu
                    setDrawerOpen(false); // Close the drawer when the profile icon is clicked
                  }}
                >
                  <Avatar
                    alt={signin.userLoggedIn?.displayName || 'User'}
                    src={signin.userLoggedIn?.photoURL || ''}
                    sx={{ width: 30, height: 30 }}
                  />
                </IconButton>
              ) : null}

              <IconButton onClick={toggleDrawer(true)} sx={{ color: '#000' }}>
                <MenuIcon />
              </IconButton>

              <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box
                  sx={{ width: 'max-content' }}
                  role="presentation"
                  onClick={toggleDrawer(false)}
                  onKeyDown={toggleDrawer(false)}
                >
                  <List
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      margin: '20px',
                      gap: '20px',
                      alignItems: 'end',
                    }}
                  >
                    <Box>
                      <IconButton onClick={toggleTheme} sx={{ color: '#000' }}>
                        {theme === 'light' ? <Brightness4Icon /> : <BedtimeIcon />}
                      </IconButton>
                      {signin.userLoggedIn && (
                        <>
                          <IconButton
                            sx={{ color: '#000' }}
                            onClick={() => navigate('/cart')}
                          >
                            <ShoppingCartIcon />
                          </IconButton>
                          <IconButton
                            sx={{ color: '#000' }}
                            onClick={() => navigate('/history')}
                          >
                            <HistoryIcon />
                          </IconButton>
                        </>
                      )}
                    </Box>
                    {signin.userLoggedIn ? (
                      <>
                        {authButtons}
                      </>
                    ) : (
                      <>
                        <ListItemButton component={Link} to="/login">
                          <ListItemText primary="Login" />
                        </ListItemButton>
                        <ListItemButton component={Link} to="/signup">
                          <ListItemText primary="Signup" />
                        </ListItemButton>
                      </>
                    )}
                  </List>
                </Box>
              </Drawer>

              {/* Profile Menu */}
              <Menu
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorEl={anchorEl} // Ensures the menu opens at the correct position
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Avatar
                    alt={signin.userLoggedIn?.displayName}
                    src={signin.userLoggedIn?.photoURL || ''}
                    sx={{ width: 100, height: 100, mb: 1 }}
                  />
                  <Typography variant="body1">
                    {signin.userLoggedIn?.displayName || 'User Name'}
                  </Typography>
                  <Typography variant="body2">
                    {signin.userLoggedIn?.email || 'Email'}
                  </Typography>
                  <Button variant="outlined" sx={buttonStyles} onClick={Signout}>
                    Signout
                  </Button>
                </Box>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {signin.userLoggedIn && (
                <>
                  <IconButton sx={{ color: '#000' }} onClick={() => navigate('/cart')}>
                    <ShoppingCartIcon />
                  </IconButton>
                  <IconButton sx={{ color: '#000' }} onClick={() => navigate('/history')}>
                    <HistoryIcon />
                  </IconButton>
                </>
              )}
              <IconButton onClick={toggleTheme} sx={{ color: '#000' }}>
                {theme === 'light' ? <Brightness4Icon /> : <BedtimeIcon />}
              </IconButton>
              {authButtons}
              {signin.userLoggedIn &&
                <IconButton onClick={handleMenuOpen}>
                  <Avatar
                    alt={signin.userLoggedIn?.displayName || 'User'}
                    src={signin.userLoggedIn?.photoURL || ''}
                    sx={{ width: 30, height: 30 }}
                  />
                </IconButton>
              }

              <Menu
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorEl={anchorEl} // Ensures menu opens at the correct position
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Avatar
                    alt={signin.userLoggedIn?.displayName}
                    src={signin.userLoggedIn?.photoURL || ''}
                    sx={{ width: 100, height: 100, mb: 1 }}
                  />
                  <Typography variant="body1">
                    {signin.userLoggedIn?.displayName || 'User Name'}
                  </Typography>
                  <Typography variant="body2">
                    {signin.userLoggedIn?.email || 'Email'}
                  </Typography>
                  <Button variant="outlined" sx={buttonStyles} onClick={Signout}>
                    Signout
                  </Button>
                </Box>
              </Menu>
            </Box>
          )}

        </Box>
      </Toolbar>
    </AppBar>
  );
};

const appBarStyles = {
  top: 0,
  left: 0,
  height: '80px',
  width: '100%',
  backgroundColor: '#FFD700',
  color: '#000',
  boxShadow: 3,
  borderRadius: '0 0 16px 16px',
  transition: 'background-color 0.3s ease, color 0.3s ease',
  justifyContent: 'center',
};

const logoStyles = {
  fontWeight: 'bold',
  color: '#000',
  display: 'flex',
  alignItems: 'center',
  fontSize: '25px',
};

const buttonStyles = {
  borderColor: '#000',
  color: '#000',
  fontWeight: 'bold',
  '&:hover': { backgroundColor: '#fff' },
};

export default Header;
