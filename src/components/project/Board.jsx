import React, { useState, useEffect, useRef, useContext } from 'react';
import { useRouter } from 'next/router';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import _ from 'lodash'
import {
  Box,
  Container,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from './Column';
import { fetcher } from '../../../lib/fetch';
import midString from '../../utils/ordering';
import UserContext from '../../context/UserContext';

export const Board = (props) => {
  const user = useContext(UserContext);
  const router = useRouter();

  const getData = (endpoint, cb) => {
    const { data } = useSWR(user ? `${endpoint}` : null, fetcher)
    return data
  }

  function mutateCards(card, type) {
    let newCards;
    switch (type) {
      case 'ADD':
        newCards = [...data.cards, card];
        break;
      case 'DELETE':
        newCards = cards.filter((c) => c._id !== card._id);
        break;
      default:
        throw new Error('Your type was not found!');
    }
    setData((prev) => ({
      ...prev,
      cards: newCards
    }))
  }

  function mutateLists(lst, type) {
    let newLists;
    switch (type) {
      case 'ADD':
        newLists = [...data.lists, lst];
        break;
      case 'DELETE':
        newLists = lists.filter((l) => l._id !== lst._id);
        break;
      default:
        throw new Error('Your type was not found!');
    }
    setData((prev) => ({
      ...prev,
      lists: newLists
    }))
  }

  function mutateBoard(name) {
    console.log('fuck')
    return {
      ...project,
      name,
    }
  }

  const project = getData(`/api/board/${router.query.id}`, mutateBoard);
  const cards = getData(`/api/cards/${router.query.id}`, mutateCards);
  const lists = getData(`/api/lists?id=${router.query.id}`, mutateLists);

  // refs
  const ref = useRef();

  // local state
  const [editable, setEditable] = useState(false);
  const [open, setOpen] = useState(false);
  const [addList, setAddList] = useState(false);
  const [data, setData] = useState({
    list: null,
    cards: null,
  })


  function getListsOrder() {
    if (lists.length) {
      return midString(lists[lists.length - 1].order, '')
    } else {
      return 'n'
    }
  }

  async function addNewList() {
    const obj = {
      name: ref.current.value,
      boardId: router.query.id,
      order: getListsOrder(),
    }

    const response = await axios.post('/api/lists', obj);
    console.log('responese = ', response);
    mutateLists(response.data, 'ADD');
    setAddList(false);
  }

  async function editList(data, id) {
    //  mutate(`/api/lists?id=${router.query.id}`, [data], false);
    const response = await axios.patch(`/api/lists/${id}`, { name: data.name });
    mutate(`/api/lists?id=${router.query.id}`);
  }

  async function editBoard(e) {
    if (e.target.value === '') return;
    const name = e.target.value;
    const obj = { ...project, name: name }
    mutate(`/api/board/${router.query.id}`, obj, false);
    const result = axios.patch(`/api/board/${router.query.id}`, { name });
    console.log('result = ', result);
    mutate(`/api/board/${router.query.id}`, result);
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (ref.current.value === '') {
        setAddList(false);
      }
      else {
        addNewList();
      }
    }
  }

  const resetAddList = () => {
    setAddList(false);

  }

  useEffect(() => {
    if (lists && cards && project) {
      console.log('lists', lists)

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

    let copy = [...data.cards];

    let target = copy.filter((c) => c._id === draggableId)[0];
    let newOrder;

    if (destination.index === 0) {
      console.log('i am first...')
      newOrder = midString('', target.order)
    } else if (destination.index > source.index) {
      console.log('i just moved down...')
      newOrder = midString(data.cards[destination.index].order, data.cards[destination.index].order + 1)
    } else if (destination.index < source.index) {
      console.log('i just moved up...')
      newOrder = midString(data.cards[destination.index].order - 1, data.cards[destination.index].order)
    } else {
      console.log('i am last...', target)
      newOrder = midString(target.order, '')
    }

    // assign order and listId
    copy = copy.filter((c) => c._id !== target._id);
    target = Object.assign({ ...target }, { listId: destination.droppableId, order: newOrder })
    copy = [...copy, target];

    console.log('target = ', target)
    // call api
    axios.patch(`/api/cards/${draggableId}`,
      { listId: destination.droppableId, order: newOrder })
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
    const targetCard = data.cards.filter((i) => i._id === draggableId)[0];

    if (source.droppableId !== destination.droppableId) {
      // move card to a new list
      moveToNewList(source, destination, draggableId);
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
  if (!project) {
    return (
      <></>
    )
  }
  return (
    <Container className="page-container" maxWidth={false} sx={{ position: 'relative', mt: 6 }}>
      <Box sx={{ marginBottom: 1}}>
        <Box sx={{ position: 'fixed', left: 0, right: 0, top: 70 }}>
        {
          !editable ? (
            <Button variant="text" onClick={() => setEditable(true)}>
              <Typography variant="h6">
                {project.name}
              </Typography>
            </Button>
          ) : <TextField
            autoFocus
            margin="dense"
            id="boardname"
            label="Name"
            variant="standard"
            onBlur={(e) => { editBoard(e); setEditable(false); }}
          />
        }
        </Box>
        <Box className="main-container" sx={{mt:14}}>
          <Box className="all-columns-wrapper" sx={{ minWidth: '100vw', flexGrow: 1 }}>
              <DragDropContext className="dropper" onDragEnd={onDragEnd} sx={{ flexGrow: 1, border: '2px solid purple'}}>
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
                        <div style={{ display: 'flex' }}>
                          {
                            data.lists && data.cards && data.lists.map((list, index) => {
                              const cards = data.cards.filter(card => card.listId === list._id);
                              return <Column key={list._id} column={list} tasks={cards} index={index} callback={mutateCards} listsCallback={mutateLists} editList={editList} />;
                            })}
                          {provided.placeholder}
                          <div>
                            <Stack
                              spacing={1}
                              sx={{ marginLeft: 1 }}
                            >
                              {
                                addList ? (
                                  <>
                                    <TextField
                                      id="new-list"
                                      variant="standard"
                                      placeholder="Enter list title..."
                                      inputRef={ref}
                                      autoFocus
                                      onKeyDown={handleKeyDown}
                                      onBlur={handleKeyDown}
                                    />
                                    <Box>
                                      <Button
                                        variant="contained"
                                        onClick={() => addNewList()}>Add list
                                      </Button>
                                      <IconButton
                                        color="primary"
                                        onClick={() => resetAddList()}
                                      >
                                        <CloseIcon />
                                      </IconButton>
                                    </Box>
                                  </>
                                ) : <Box sx={{ width: 280 }}>
                                  <Button sx={{ width: 270, justifyContent: 'flex-start' }} variant="contained" startIcon={<AddIcon />} onClick={() => setAddList(true)}>Add another list</Button>
                                </Box>
                              }
                            </Stack>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
          </Box>
        </Box>
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
    </Container>
  );
};
