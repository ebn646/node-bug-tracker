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
  Typography,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from './Column';
import Drawer from './Drawer';
import { fetcher } from '../../../lib/fetch';
import midString from '../../utils/ordering';
import UserContext from '../../context/UserContext';
import EditCardDialog from '../dialogs/EditCardDialog';

export const Board = () => {
  const user = useContext(UserContext);
  const router = useRouter();

  const getData = (endpoint: string) => {
    const { data } = useSWR(`${endpoint}`, fetcher)
    return data
  }

  function mutateCards(card, type: string) {
    let newCards;
    switch (type) {
      case 'UPDATE':
        mutate(`/api/cards/?boardid=${router.query.id}`)
        mutate(`/api/lists/?boardid=${router.query.id}`)
        break;
      case 'ADD':
        newCards = [...data.cards, card];
        break;
      case 'DELETE':
        newCards = cards.filter((c) => c._id !== card._id);
        break;
      default:
        throw new Error('Your type was not found!');
    }
    // setData((prev) => ({
    //   ...prev,
    //   cards: newCards
    // }))
  }

  function mutateLists(lst, type: string) {
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

  function mutateActivities(act) {
    const newActivities = [...data.activities, act].reverse();
    setData((prev) => ({
      ...prev,
      activities: newActivities,
    }))
  }

  function mutateBoard(name) {
    return {
      ...project,
      name,
    }
  }
 // destructure
 const { data: cards } = useSWR(`/api/cards/?boardid=${router.query.id}`, fetcher);
 const { data: lists } = useSWR(`/api/lists?boardid=${router.query.id}`, fetcher);

  const project = getData(`/api/board/${router.query.id}`);
  const activities = getData(`/api/activities/${router.query.id}`);

  // refs
  const ref = useRef();

  // local state
  const [editable, setEditable] = useState(false);
  const [open, setOpen] = useState(true);
  const [addList, setAddList] = useState(false);
  const [data, setData] = useState({
    list: null,
    cards: null,
    activities: null,
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

  async function editList(data, id: string) {
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
    } else {
      setEditable(false)
      setAddList(false);
    }
  }

  const resetAddList = () => {
    setAddList(false);
  }

  useEffect(() => {
    if(lists){
      console.log('lists ', lists)
    }
    if (lists && project && activities) {
      const sortedLists = _.orderBy(lists, ['order'], ['asc'])
      const sortedCards = _.orderBy(cards, ['order'], ['asc'])
      const sortedAct = activities.reverse();
      console.log('sortedLists = ', sortedLists)
      setData({
        lists: sortedLists,
        activities: sortedAct,
      })
    } else {
      console.log('not yet...')
    }
  }, [lists, project, activities])

  useEffect(() => {
    const sortedCards = _.orderBy(cards, ['order'], ['asc'])
    setData((prev) => ({
     ...prev,
     cards: sortedCards
    }))
  }, [cards])
  



  const handleClose = () => {
    setOpen(false);
  };

  const reorderColumns = (source, destination, draggableId: string) => {
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
      .then((response) => { console.log('r = ', response); 
      mutate(); });
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

    let copy = [...data.cards];
    const taskLength = data.cards.length;
    console.log('I need to move card to a new list ', 'source index = ', source.index, 'dest index = ', destination.index, 'task len = ', taskLength);

    let target = copy.filter((c) => c._id === draggableId)[0];
    let newOrder;

    if (destination.index === 0) {
      console.log('i am first...')
      newOrder = midString('', target.order)
    } else if (destination.index < source.index) {
      console.log('i just moved up...')
      newOrder = midString(
        data.cards[destination.index - 1].order,
        data.cards[destination.index].order
      )
    } else if (destination.index > source.index) {
      console.log('i just moved down...')
      newOrder = midString(
        data.cards[destination.index].order,
        data.cards[destination.index].order + 1
      )
    } else {
      console.log('i am last...', target)
      newOrder = midString(target.order, '')
    }

    // assign order and listId
    copy = copy.filter((c) => c._id !== target._id);
    target = Object.assign({ ...target }, { listId: destination.droppableId, order: newOrder })
    copy = [...copy, target];
    // call api
    // post card
    axios.patch(`/api/cards/${draggableId}`,
      { listId: destination.droppableId, order: newOrder })
      .then((response) => console.log('resp = ', response));
    // post activity
    axios.post(`/api/activities`,
      { boardId: router.query.id, text: `${user.username} moved a card` })
      .then((response) => mutateActivities(response.data));

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
      const taskLength = data.cards.filter((c) => c.listId === source.droppableId).length;
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
      setData((prev) => {
        return ({
          ...prev,
          cards: sorted,
        });
      })
      return;
    }
  }
  if (!project || !lists) {
    return (
     <div/>
    )
  }
  return (
    <Container
      className="page-container"
      maxWidth={false}
      sx={{
        display: 'flex',
        height: 'auto',
        padding: '0 !important',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          width: '100vw',
          height: '100%',
          backgroundImage: `url(/static/images/${project.backgroundImage})`,
          position: 'fixed',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div style={{ width: '100%', marginTop: 64, position: 'relative' }}>
        <Drawer activities={data.activities} />
        <Box sx={{ position: 'fixed', top: 64, left: 0, right: 0 }}>
          {
            !editable ? (
              <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                <Button
                  sx={{
                    my: 1,
                    borderRadius: 0,
                    backgroundColor: 'rgba(255,255,255, 0.5)'
                  }}
                  onClick={() => setEditable(true)}
                >
                  <Typography variant="h6">
                    {project.name}
                  </Typography>
                </Button>
                <Button
                  sx={{
                    my: 1,
                    borderRadius: 0,
                    backgroundColor: 'rgba(255,255,255, 0.5)'
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  ... Show menu
                </Button>
              </Box>
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
        <Box className="all-columns-wrapper" sx={{ display: 'flex', mt: 5 }}>
          <div>
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
                      <div style={{ display: 'flex' }}>
                        {
                          data.lists && data.cards && data.lists.map((list, index) => {
                            const cards = data.cards.filter(card => card.listId === list._id);
                            return <Column
                              key={list._id}
                              column={list}
                              tasks={cards}
                              index={index}
                              callback={mutateCards}
                              listsCallback={mutateLists}
                              editList={editList}
                              activitiescb={mutateActivities} />;
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
                                  <Box sx={{
                                    p: 1,
                                    width: 280,
                                    backgroundColor: '#ebecf0',
                                  }}>
                                    <TextField
                                      id="new-list"
                                      variant="outlined"
                                      placeholder="Enter list title..."
                                      inputRef={ref}
                                      autoFocus
                                      onBlur={() => setEditable(false)}
                                      sx={{ py: 1, }}
                                    />
                                    <Box sx={{
                                      pt: 1,
                                    }}>
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
                                  </Box>
                                </>
                              ) : <Box sx={{ width: 280 }}>
                                <Button
                                  sx={{
                                    width: 270,
                                    justifyContent: 'flex-start'
                                  }}
                                  variant="contained"
                                  startIcon={<AddIcon />}
                                  onClick={() => setAddList(true)}>
                                  {`${data.lists && data.lists.length ? 'Add another list' : 'Add a list'}`}
                                </Button>
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
          </div>
        </Box>
        <EditCardDialog lists={lists} callback={mutateCards} mutateLists={mutateLists} />
      </div>
    </Container>
  );
};