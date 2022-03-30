import React from 'react';
import { format } from 'date-fns'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CloseIcon from '@mui/icons-material/Close';

export default function TDrawer({ activities }) {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };


  const list = (anchor) => (
    <Box
      sx={{ width: 335 }}
      role="presentation"
    >
      <List>
        <ListItem sx={{ display: 'flex', wodth: '100%', justifyContent: 'space-between' }} button key="menu" onClick={toggleDrawer(anchor, false)}>Menu <CloseIcon /></ListItem>
        <ListItem button key="activity"><ListItemText primary="Activity" /></ListItem>
      </List>
      <Divider />
      <Box>
        <List>
          {activities && activities.length > 0 && activities.map((act) => (
            <ListItem button key={act._id}>
              <Box>
                <p>{act.text}</p>
                <p style={{fontSize: 10}}>{format(new Date(act.createdAt), "M/d/yy' at 'HH:mm.aa")}</p>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <div style={{ position: 'absolute', right: 0 }}>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button sx={{ border: '1px solid red', width: 100, opacity: 0, zIndex: 5 }} onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
          <Drawer
            variant="persistent"
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
