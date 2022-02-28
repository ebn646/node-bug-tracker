import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import CloseIcon from '@mui/icons-material/Close';
import FaceIcon from '@mui/icons-material/Face';

export default function TDrawer({show}) {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
      console.log('toggleDrawer')
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };


  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
      <ListItem sx={{display: 'flex', wodth: '100%', justifyContent: 'space-between'}}button key="menu">Menu <CloseIcon /></ListItem>
      <ListItem button key="change-background"><ListItemText primary="Change background" /></ListItem>
      <ListItem button key="delete"><ListItemText primary="Delete board" /></ListItem>
      <ListItem button key="activity"><ListItemText primary="Activity" /></ListItem>
      </List>
      <Divider />
      <Box>
         <List>
         {['Activity 1', 'Activity 2'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
               <FaceIcon />
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
         </List>
      </Box>
    </Box>
  );

  return (
    <div style={{position: 'absolute', right: 0}}>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button sx={{border: '1px solid red', width: 100, opacity: 0, zIndex: 5}}onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
          <Drawer
            hideBackdrop
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
