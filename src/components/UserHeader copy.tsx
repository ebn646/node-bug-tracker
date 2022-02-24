import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/client';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import {
    AppBar,
    Avatar,
    Badge,
    Box,
    Button,
    ButtonBase,
    Divider,
    IconButton,
    Toolbar,
    Tooltip,
    Typography,
    Grid,
    Menu,
    MenuItem,
} from '@mui/material';
import {
    Home,
    Dashboard,
    Notifications,
} from '@mui/icons-material';
import AppsIcon from '@mui/icons-material/Apps';
import { NavItem } from './nav-item';
import { Bell as BellIcon } from '../icons/bell';
import { User as UserIcon } from '../icons/user';
import { UserCircle as UserCircleIcon } from '../icons/user-circle';
import { Cog as CogIcon } from '../icons/cog';
import MenuPopover from './MenuPopover';

const account = {
    displayName: 'Jaydon Frankie',
    email: 'demo@minimals.cc',
    photoURL: '/static/mock-images/avatars/avatar_default.jpg'
};

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


export default function UserHeader() {
    const router = useRouter();
    // const [session, loading] = useSession();
    const anchorRef = useRef(null);
    // local state
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        console.log(true)
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    function logoutHandler() {
        signOut();
    }

    // useEffect(() => {
    //     console.log('session ', session)
    // }, [session]);

    return (
        <React.Fragment>
            <AppBar sx={{
                flexDirection: 'row',
                minHeight: 40,
                padding: 1
            }}
            >
                <Grid container
                    direction='row'
                    alignItems='center'
                    spacing={1}
                >
                    <Grid item>
                        <ButtonBase>
                            <AppsIcon />
                        </ButtonBase>
                    </Grid>
                    <Grid item>
                        <ButtonBase
                            onClick={() => router.push(`/`)}
                        >
                            <Home />
                        </ButtonBase>
                    </Grid>
                    <Grid item>
                        <ButtonBase
                            onClick={() => router.push(`/boards`)}
                        >
                            <Dashboard
                                style={{ marginRight: '8px', paddingLeft: '4px' }}
                            />
                            <Typography
                                style={{
                                    fontWeight: 700,
                                    paddingRight: '8px',
                                }}
                            >
                                Boards
                            </Typography>
                        </ButtonBase>
                    </Grid>
                </Grid>
                {/* <Grid container
                    direction='row'
                    alignItems='center'
                    justifyContent="center"
                >
                    <Grid item>
                        <Dashboard
                            style={{ marginRight: '8px', paddingLeft: '4px' }}
                        />
                    </Grid>
                    <Grid item>
                        <Typography
                            style={{
                                fontWeight: 700,
                                paddingRight: '8px',
                            }}
                        >
                            Trell-node
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container
                    direction='row'
                    alignItems='center'
                    justifyContent='right'
                    spacing={1}
                >
                    <Grid item>
                        <ButtonBase>
                            <Notifications
                                style={{ marginRight: '8px', paddingLeft: '4px' }}
                            />
                        </ButtonBase>
                    </Grid>
                    <Grid item sx={{ position: 'relative' }}>
                        <Button
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        >
                            <Avatar 
                                sx={{ width: 30, height: 30 }} 
                            />
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem disabled onClick={handleClose}>Profile</MenuItem>
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </Menu>
                    </Grid>
                </Grid> */}
            </AppBar>
        </React.Fragment>
    )
}
