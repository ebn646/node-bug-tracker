import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import {
  Dashboard
} from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import AppsIcon from '@mui/icons-material/Apps';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { getInitials } from '../utils/get-initials';

const settings = ['Profile', 'Account', 'Logout'];

// eslint-disable-next-line import/prefer-default-export
export const UserHeader = (): JSX.Element => {
  const router = useRouter();
  const { data: session } = useSession();
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

  if (!session) return <>Loading...</>

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <AppBar position="fixed" sx={{ pl: 1, pr: 1 }}>
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
              <Dashboard />
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
            <Dashboard />
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
            <Tooltip title="Open settings" sx={{ display: 'flex' }}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={getInitials(session?.user?.name).toUpperCase()} src="/static/images/avatar/2.jpg" />
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
              <MenuItem onClick={handleCloseUserMenu}>
                <Avatar sx={{marginRight: 1}} alt={session?.user?.name?.toUpperCase()} src="/static/images/avatar/2.jpg" />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography textAlign="center">{session?.user?.name}</Typography>
                  <Typography textAlign="center">{session?.user?.email}</Typography>
                </Box>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography textAlign="center">{settings[0]}</Typography>
              </MenuItem>
              <MenuItem onClick={() => { signOut(); handleCloseUserMenu() }}>
                <Typography textAlign="center">{settings[2]}</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
