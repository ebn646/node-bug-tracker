import React, { useState, useEffect, useRef, useContext } from 'react';
import { useRouter } from 'next/router';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import _ from 'lodash'
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
  Stack,
} from '@mui/material';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from './Column';
import { fetcher } from '../../../lib/fetch';
import midString from '../../utils/ordering';
import UserContext from '../../context/UserContext';

export const Board = (props) => {
  const user = useContext(UserContext);
  const router = useRouter();

  const getData = (endpoint, cb) => {
    const { data } = useSWR(user ? `${endpoint}` : null, fetcher, cb)
    return data
  }

  function mutateCards(data, type) {
    let newCards;
    switch (type) {
      case 'ADD':
        newCards = [...cards, data];
        break;
      case 'DELETE':
        newCards = cards.filter((c) => c._id !== data._id);
        break;
      default:
        throw new Error('Your type was not found!');
    }
    setData((prev) => ({
      ...prev,
      cards: newCards
    }))
  }

  function mutateLists(data, type) {
    let newLists;
    switch (type) {
      case 'ADD':
        newLists = [...lists, data];
        break;
      case 'DELETE':
        newLists = lists.filter((l) => l._id !== data._id);
        break;
      default:
        throw new Error('Your type was not found!');
    }
    setData((prev) => ({
      ...prev,
      lists: newLists
    }))
  }

  const project = getData(`/api/boards/${router.query.id}`);
  const cards = getData(`/api/cards/${router.query.id}`, mutateCards);
  const lists = getData(`/api/lists?id=${router.query.id}`, mutateLists);

  // refs
  const ref = useRef();

  // local state
  const [open, setOpen] = useState(false);
  const [addList, setAddList] = useState(false);
  const [data, setData] = useState({
    list: [],
    cards: [],
  })


  function getListsOrder(){
    if(lists.length){
      return midString(lists[lists.length - 1].order, '')
    } else {
      return 'n'
    }
  }

 async function addNewList(e) {
    const obj ={
      name: ref.current.value,
      boardId: router.query.id,
      order: getListsOrder(),
    }

    const response = await axios.post('/api/lists', obj);
    console.log('responese = ', response);
    mutateLists(response.data, 'ADD')
    setAddList(false);
  }

  useEffect(() => {
    if (lists && cards) {

      setData({
        lists,
        cards,
      })
    } else {
      console.log('not yet...')
    }
  }, [cards, lists, project, user])



  const handleClose = () => {
    setOpen(false);
  };

  const reorderColumns = (source, destination, draggableId) => {
    // change th eorder of gthe clluns, reset in stage to rerender
    console.log('s = ', source)
    console.log('d = ', destination)
    let newOrder;
    const target = data.lists.filter((i) => i._id === draggableId)[0];
    console.log('t = ', target)

    if (destination.index === 0) {
      newOrder = midString('', data.lists[destination.index].order)
    } else if (destination.index === data.lists.length - 1) {
      newOrder = midString(data.lists[destination.index].order, '')
    } else if (destination.index > source.index) {
      newOrder = midString(
        data.lists[destination.index - 1].order,
        data.lists[destination.index].order
      )
    } else {
      newOrder = midString(
        data.lists[destination.index].order,
        data.lists[destination.index + 1].order,
      )
    }

    // 2. update in db
    axios.patch(`/api/lists/${draggableId}`,
      {
        id: draggableId,
        order: newOrder
      })
      .then((response) => mutate());
    // reorder list
    target.order = newOrder;
    console.log('reorder the list', data.lists)
    const sorted = _.orderBy(data.lists, ['order'], ['asc'])
    console.log('sorted = ', sorted);
    // reset data to rereder

    setData((prev) => ({
      ...prev,
      lists: sorted,
    }))
  }

  const moveToNewList = (source, destination, draggableId) => {
    // console.log('I need to move card to a new list ', source, destination, draggableId);
    console.log('I need to move card to a new list ', source.index, destination.index);

    let copy = [...cards];

    let target = copy.filter((c) => c._id === draggableId)[0];
    const taskLength = copy.filter((c) => c.listId === source.droppableId).length;
    let newOrder;

    if (source.index === 0) {
      console.log('i am first...')
      newOrder = midString('', target.order)
    } else if (source.index > destination.index) {
      console.log('i just moved down...')
      newOrder = midString(data.cards[source.index].order, data.cards[source.index].order + 1)
    } else if (source.index < destination.index) {
      console.log('i just moved up...')
      newOrder = midString(data.cards[source.index].order - 1, data.cards[source.index].order)
    } else {
      console.log('i am last...', target)
      newOrder = midString(target.order, '')
    }

    // assign order and listId
    copy = copy.filter((c) => c._id !== target._id);
    target = Object.assign({ ...target }, { listId: source.droppableId, order: newOrder })
    copy = [...copy, target];

    console.log('target = ', target)
    // call api
    axios.patch(`/api/cards/${draggableId}`,
      {
        target
      })
      .then((response) => console.log('resp = ', response));

    const sorted = _.orderBy(copy, ['order'], ['asc'])
    // reorder cards to rerender 
    setData((prev) => ({
      ...prev,
      cards: sorted,
    }))
  }

  const onDragEnd = (result) => {
    console.log('onDragEnd called ', result)
    const { destination, source, draggableId, type } = result;
    let newOrder;
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
    if (type === 'column') {
      reorderColumns(source, destination, draggableId)
      return;
    }
    // 
    const startList = data.lists.filter((i) => i._id === source.droppableId);
    const endList = data.lists.filter((i) => i._id === destination.droppableId);
    const targetCard = data.cards.filter((i) => i._id === draggableId)[0];

    if (source.droppableId !== destination.droppableId) {
      // move card to a new list
      moveToNewList(destination, source, draggableId);
      return;
    }

    // dropped in same column
    if (source.droppableId === destination.droppableId) {
      // 1. get new order for this card
      // first
      const column = startList
      const taskLength = cards.filter((c) => c.listId === source.droppableId).length;
      console.log('l = ', taskLength);
      if (destination.index === 0) {
        console.log('I am first', column)
        // 1. find the card 
        // 2. assign card new order
        newOrder = midString('', data.cards[destination.index].order)
      }
      else if (destination.index === taskLength - 1) {
        console.log('I am last')
        newOrder = midString(data.cards[destination.index].order, '')
      }
      // move closer to top, decrease index
      else if (destination.index < source.index) {
        console.log('I moved closer to the top', data.cards[destination.index - 1].order, data.cards[destination.index].order);
        newOrder = midString(
          data.cards[destination.index - 1].order,
          data.cards[destination.index].order,
        )
      }
      // move closer to bottom, increase index
      else {
        console.log('I moved closer to the bottom')
        newOrder = midString(
          data.cards[destination.index].order,
          data.cards[destination.index + 1].order,
        )
      }
      console.log('neworder ', newOrder)
      // 2. update in db
      axios.patch(`/api/cards/${draggableId}`,
        {
          ...targetCard,
          order: newOrder,
        })
        .then((response) => console.log(response));
      // reorder list
      targetCard.order = newOrder;
      console.log('reorder the list', data.cards)
      const sorted = _.orderBy(data.cards, ['order'], ['asc'])
      // console.log('sorted = ', sorted);
      setData((prev) => ({
        ...prev,
        cards: sorted,
      }))
      return;
    }
  }
  return (
    <Box sx={{ minWidth: '100vw' }}>
      {
        project && (
          <p style={{ padding: 10 }}>{project.name}</p>
        )
      }
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <div>
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <div style={{display: 'flex'}}>
                {
                  data.lists && data.cards && data.lists.map((list, index) => {
                    const cards = data.cards.filter(card => card.listId === list._id);
                    return <Column key={list._id} column={list} tasks={cards} index={index} callback={mutateCards} listsCallback={mutateLists} />;
                  })}
                <Stack
                  spacing={1}
                  sx={{ marginLeft: 1 }}
                >
                  {
                    addList ? (
                      <>
                        <TextField
                          id="new-list"
                          placeholder="Enter list title..."
                          inputRef={ref}
                          autoFocus
                          onBlur={() => { addNewList(); }}
                        />
                        <Button variant="contained" onClick={() => addNewList()}>Add list</Button>
                      </>
                    ) : <Box sx={{width: 280}}>
                      <Button variant="contained" onClick={() => setAddList(true)}>Add another list</Button>
                    </Box>
                  }
                </Stack>
                {provided.placeholder}
                <div>
                </div>
              </div>
            </div>
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
