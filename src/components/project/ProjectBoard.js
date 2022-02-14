import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import axios from 'axios';
import _ from 'lodash'
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

const midString = (prev, next) => {
  var p
  var n
  var pos
  let str
  for (pos = 0; p === n; pos++) {
    // find leftmost non-matching character
    p = pos < prev.length ? prev.charCodeAt(pos) : 96
    n = pos < next.length ? next.charCodeAt(pos) : 123
  }
  str = prev.slice(0, pos - 1) // copy identical part of string
  if (p === 96) {
    // prev string equals beginning of next
    while (n === 97) {
      // next character is 'a'
      n = pos < next.length ? next.charCodeAt(pos++) : 123 // get char from next
      str += 'a' // insert an 'a' to match the 'a'
    }
    if (n === 98) {
      // next character is 'b'
      str += 'a' // insert an 'a' to match the 'b'
      n = 123 // set to end of alphabet
    }
  } else if (p + 1 === n) {
    // found consecutive characters
    str += String.fromCharCode(p) // insert character from prev
    n = 123 // set to end of alphabet
    while ((p = pos < prev.length ? prev.charCodeAt(pos++) : 96) === 122) {
      // p='z'
      str += 'z' // insert 'z' to match 'z'
    }
  }
  return str + String.fromCharCode(Math.ceil((p + n) / 2)) // append middle character
}

const initial = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Take out the garbage', order: 'a' },
    'task-2': { id: 'task-2', content: 'Watch my favorite show', order: 'b' },
    'task-3': { id: 'task-3', content: 'Charge my phone', order: 'c' },
    'task-4': { id: 'task-4', content: 'Cook dinner', order: 'c' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To do',
      taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
      order: 'n'
    },
    'column-2': {
      id: 'column-2',
      title: 'In progress',
      taskIds: [],
      order: 'p'
    },
  },
  // Facilitate reordering of the columns
  columnOrder: ['column-1', 'column-2'],
};

export const ProjectBoard = (props) => {
  const router = useRouter();
  const getData = (endpoint) => {
    const { data } = useSWR(`${endpoint}`, fetcher)
    return data
  }
  // const getCards = async () => {
  //   await axios
  //   .get('https://jsonplaceholder.typicode.com/posts/1');
  // }
  const [initialData, setInitialData] = useState(initial)
  const [data, setData] = useState()
  // const [cards, setCards] = useState();

  // const { data, error } = useSWR(
  //   `http://localhost:3000/api/boards/${router.query.id}`,
  //   fetcher
  // );
  const cards = getData(`/api/cards/${router.query.id}`);
  const lists = getData(`/api/lists/${router.query.id}`); 

  useEffect(() => {
    if(lists && cards){
      console.log('lists = ', lists)
      console.log('cards = ', cards)
      setData({
        lists,
        cards,
      })
    }else{
      console.log('not yet...')
    }
  }, [cards, lists])

  useEffect(() => {
    console.log('Data = ', data)
  }, [data])

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const onDragEnd = (result) => {
    console.log('onDragEnd called ', result)
    let newOrder;
    const { destination, source, draggableId, type } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    // dropped in same position
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    // if dropped within same list
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    // 
    const startList = initialData.columns[source.droppableId]
    const endList = initialData.columns[destination.droppableId]

    // dropped in same column
    if (startList === endList) {
      // 1. get new order for this card
      // first
      const column = startList
      if (destination.index === 0) {
        console.log('I am first', initialData.tasks[column.taskIds[destination.index]].order)
        newOrder = midString('', initialData.tasks[column.taskIds[0]].order)
      }
      else if (destination.index === column.taskIds.length - 1) {
        console.log('I am last')
        newOrder = midString(
          initialData.tasks[column.taskIds[destination.index]].order,
          '',
        )
      }
      // move closer to top, decrease index
      else if (destination.index < source.index) {
        console.log('I moved closer to the top', initialData.tasks[column.taskIds[destination.index - 1]].order, initialData.tasks[column.taskIds[destination.index]].order)
        newOrder = midString(
          initialData.tasks[column.taskIds[destination.index - 1]].order,
          initialData.tasks[column.taskIds[destination.index]].order,
        )
      }
      // move closer to bottom, increase index
      else {
        console.log('I moved closer to the bottom')
        newOrder = midString(
          initialData.tasks[column.taskIds[destination.index]].order,
          initialData.tasks[column.taskIds[destination.index + 1]].order,
        )
      }
      // 2. update in db
      // fetch('http://localhost:3000/api/projects/6203f4d62fd12676b72aa6a0/cards', {
      //   method: 'PATCH',
      //   body: JSON.stringify({
      //     id: draggableId,
      //     order: newOrder
      //   }),
      //   headers: {
      //     'Content-type': 'application/json; charset=UTF-8',
      //   },
      // })
      //   .then((response) => response.json())
      //   .then((json) => console.log(json));
      // reorder list
      const newTaskIds = Array.from(column.taskIds)
      console.log('1. newTaskIds = ', newTaskIds)
      newTaskIds.splice(source.index, 1)
      console.log('2. newTaskIds = ', newTaskIds)
      newTaskIds.splice(destination.index, 0, draggableId)
      console.log('3. newTaskIds = ', newTaskIds)
      const destinationTask = initialData.tasks[draggableId]

      destinationTask.order = newOrder;
      // create a new updated column
      const newColumn = {
        ...column,
        taskIds: newTaskIds,
      }
      console.log('newColumn =', newColumn)
      // update the initialData with new tasks order
      const newData = {
        ...initialData,
        columns: {
          ...initialData.columns,
          [newColumn._id]: newColumn,
        },
        // tasks: {
        //   ...initialData.tasks,
        //   draggableId: destinationTask,
        // },
      }
      console.log('new data = ', newData)
      // reset the initial data
      setInitialData(newData)
    }
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
              style={{ display: 'flex' }}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {
                data && data.lists.map((list, index) => {
                  const cards = data.cards.filter(card => card.listId === list._id);
                  return <Column key={list._id} column={list} tasks={cards} index={index} />;
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
