import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
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
import { styled } from '@mui/material/styles';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Search as SearchIcon } from '../../icons/search';
import Column from './BoardColumn';
import { fetcher } from '../../../lib/fetch';

// const useStyles = makeStyles((theme) => ({
//   listContainer: {
//     display: 'flex',
//     alignItems: 'flex-start',
//     width: '100%',
//     marginTop: theme.spacing(0.5),
//     border: '1px solid red'
//   },
// }))

const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Take out the garbage' },
    'task-2': { id: 'task-2', content: 'Watch my favorite show' },
    'task-3': { id: 'task-3', content: 'Charge my phone' },
    'task-4': { id: 'task-4', content: 'Cook dinner' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To do',
      taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In progress',
      taskIds: [],
    },
  },
  // Facilitate reordering of the columns
  columnOrder: ['column-1', 'column-2'],
};

export const ProjectBoard = (props) => {
  const router = useRouter();
  const { data, error } = useSWR(
    `http://localhost:3000/api/projects/${router.query.id}`,
    fetcher
  );

  // const classes = useStyles()

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
      <Box sx={{ mt: 3, border: '1px solid red' }}>
        <Card>
          <CardContent>
            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
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
        <Droppable 
          droppableId="all-columns" 
          direction="horizontal" 
          type="column"
        >
        {(provided) => (
                <div
                  style={{display: 'flex'}}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
          {
            initialData.columnOrder.map((columnId, index) => {
              const column = initialData.columns[columnId];
              const tasks = column.taskIds.map(taskId => initialData.tasks[taskId]);
  
              return <Column key={column.id} column={column} tasks={tasks} index={index} />;
            })}
              {provided.placeholder}
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
