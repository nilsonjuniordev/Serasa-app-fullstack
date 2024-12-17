import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import serasaLogo from '../assets/SerasaExperianLogo2.webp';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { text: 'Produtores', path: '/produtores', icon: <PeopleIcon /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <List>
      {menuItems.map((item) => (
        <ListItem key={item.text} disablePadding>
          <ListItemButton
            onClick={() => {
              navigate(item.path);
              if (isMobile) handleDrawerToggle();
            }}
            selected={location.pathname === item.path}
          >
            <Box display="flex" alignItems="center" gap={1}>
              {item.icon}
              <ListItemText primary={item.text} />
            </Box>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      <AppBar position="sticky" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {isMobile && (
              <IconButton
                color="primary"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            <Box
              component="img"
              src={serasaLogo}
              alt="Serasa Logo"
              sx={{
                height: 40,
                mr: 2,
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            />

            {!isMobile && (
              <Box display="flex" gap={2} ml="auto">
                {menuItems.map((item) => (
                  <Button
                    key={item.text}
                    color="primary"
                    startIcon={item.icon}
                    onClick={() => navigate(item.path)}
                    variant={location.pathname === item.path ? 'contained' : 'text'}
                    sx={{
                      backgroundColor: location.pathname === item.path ? theme.palette.primary.main : theme.palette.secondary.main,
                      color: theme.palette.common.white,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.light,
                        color: theme.palette.common.white,
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          backgroundColor: theme.palette.primary.main, color: theme.palette.common.white,
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}

      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar; 