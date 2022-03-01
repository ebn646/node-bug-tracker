import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/client';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import AppsIcon from '@mui/icons-material/Apps';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

const settings = ['Profile', 'Account', 'Logout'];

// eslint-disable-next-line import/prefer-default-export
export function UserHeader() {
  const router = useRouter();
  const [session, loading] = useSession();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    console.log('session ', session);
  }, [session]);

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <AppBar position="fixed" sx={{pl: 1, pr: 1}}>
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              color="secondary"
              onClick={() => {
                return router.push('/');
              }}
            >
              <HomeIcon />
            </IconButton>
          </Box>
          {/* icons for large screen */}
          <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              color="secondary"
            >
              <AppsIcon />
            </IconButton>
            <IconButton
              color="secondary"
              onClick={() => {
                router.push('/');
              }}>
              <HomeIcon />
            </IconButton>
            <IconButton
              color="secondary"
              onClick={() => {
                router.push('/');
              }}>
              <DashboardIcon />
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
              >
                Boards
              </Typography>
            </IconButton>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            LOGO
          </Typography>

          <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex', justifyContent: 'center' } }}>
            <DashboardIcon />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
              Trell-node
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton color="secondary">
              <NotificationsIcon />
            </IconButton>
            <Tooltip title="Open settings" sx={{ display: 'flex' }}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Eric Nichols" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key={settings[0]} onClick={handleCloseUserMenu}>
                <Typography textAlign="center">{settings[0]}</Typography>
              </MenuItem>
              <MenuItem key={settings[1]} onClick={handleCloseUserMenu}>
                <Typography textAlign="center">{settings[1]}</Typography>
              </MenuItem>
              <MenuItem key={settings[2]} onClick={() => { signOut(); handleCloseUserMenu() }}>
                <Typography textAlign="center">{settings[2]}</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
