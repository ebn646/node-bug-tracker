import { useRef, useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/client';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavItem } from './nav-item';
import { Bell as BellIcon } from '../icons/bell';
import { User as UserIcon } from '../icons/user';
import { UserCircle as UserCircleIcon } from '../icons/user-circle';
import { Cog as CogIcon } from '../icons/cog';
// components
import MenuPopover from './MenuPopover';
import account from '../__mocks__/account';

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}));

const items = [
  {
    href: '/account',
    icon: (<UserIcon fontSize="small" />),
    title: 'Account'
  },
  {
    href: '/settings',
    icon: (<CogIcon fontSize="small" />),
    title: 'Settings'
  }
];
export const DashboardNavbar = (props) => {
  const { onSidebarOpen, ...other } = props;
  const [session, loading] = useSession();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log('Hi Eric ', session)
  }, [session]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  function logoutHandler() {
    signOut();
  }
  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280,
          },
          width: {
            lg: 'calc(100% - 280px)',
          },
        }}
        {...other}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2,
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: 'inline-flex',
                lg: 'none',
              },
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          {/* <Tooltip title="Notifications">
            <IconButton sx={{ ml: 1 }}>
              <Badge badgeContent={4} color="primary" variant="dot">
                <BellIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip> */}
            {
              session && session.user.email && (
                <p style={{ color: 'black',  fontSize: 12 }}>Hello {session.user.email}!</p>
              )
            }
          <IconButton
            ref={anchorRef}
            onClick={handleOpen}
            sx={{
              padding: 0,
              width: 44,
              height: 44,
              ...(open && {
                '&:before': {
                  zIndex: 1,
                  content: "''",
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  position: 'absolute',
                },
              }),
            }}
          >
            <Avatar
              sx={{
                height: 40,
                width: 40,
                ml: 1,
              }}
              src="/static/images/avatars/avatar_1.png"
            >
              <UserCircleIcon fontSize="small" />
            </Avatar>
          </IconButton>
          <MenuPopover
            open={open}
            onClose={handleClose}
            anchorEl={anchorRef.current}
            sx={{ width: 220 }}
          >
            <Box sx={{ my: 1.5, px: 2.5 }}>
              <Typography variant="subtitle1" noWrap>
                {account.displayName}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary' }}
                noWrap
              >
                {account.email}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />
            {items.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              href={item.href}
              title={item.title}
            />
          ))}

            <Box sx={{ p: 2, pt: 1.5 }}>
              <Button
                fullWidth
                color="inherit"
                variant="outlined"
                onClick={logoutHandler}
              >
                Logout
              </Button>
            </Box>
          </MenuPopover>
        </Toolbar>
      </DashboardNavbarRoot>
    </>
  );
};

DashboardNavbar.propTypes = {
  onSidebarOpen: PropTypes.func,
};
