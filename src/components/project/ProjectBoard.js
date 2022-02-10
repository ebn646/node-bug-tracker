import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Search as SearchIcon } from '../../icons/search';
import { makeStyles, InputBase } from '@material-ui/core';
import Column from './ListColumn';
import { fetcher } from '../../../lib/fetch';

const useStyles = makeStyles((theme) => ({
  listContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    marginTop: theme.spacing(0.5),
  },
}))

export const ProjectBoard = (props) => {
  const router = useRouter();
  const { data, error } = useSWR(
    `http://localhost:3000/api/projects/${router.query.id}`,
    fetcher
  );

  const classes = useStyles()

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const onDragEnd= (result) => {
    console.log('onDragEnd called')
  }
  return (
    <Box {...props}>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <Box sx={{ maxWidth: 500 }}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon fontSize="small" color="action">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                placeholder="Search"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="all-columns" direction="horizontal" type="list">
        {(provided) => (
                <div
                  className={classes.listContainer}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
          {data &&
            data.length &&
            data.map((d) => {
              return <Column key={d._id} />;
            })}
            </div>
        )}
        </Droppable>
      </DragDropContext>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create A New Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a new project, please enter a name and description.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Create</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
