import React, { useState, useEffect, useRef, useContext } from 'react';
import { useRouter } from 'next/router';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import _ from 'lodash';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { DragDropContext, Droppable, DropResult, DraggableLocation } from 'react-beautiful-dnd';
import Column from './Column';
import Drawer from './Drawer';
import midString from '../../utils/ordering';
import UserContext from '../../context/UserContext';
import EditCardDialog from '../dialogs/EditCardDialog';
import { fetcher } from '../../../lib/fetch';

interface ICard {
  _id: string,
  listId: string,
}
interface IList {
  _id: string,
}

export const Board = () => {
  const user= useContext(UserContext);
  const router = useRouter();

  function updateCards() {
    mutate(`/api/cards?boardid=${router.query.id}`)
  }

  function updateLists() {
    mutate(`/api/lists?boardid=${router.query.id}`)
  }

  function updateActivities() {
    mutate(`/api/activities/${router.query.id}`)
  }

  // destructure
  const { data: cards } = useSWR(`/api/cards?boardid=${router.query.id}`, fetcher);
  const { data: lists } = useSWR(`/api/lists?boardid=${router.query.id}`, fetcher);
  const { data: project } = useSWR(`/api/board/${router.query.id}`, fetcher);
  const { data: activities } = useSWR(`/api/activities/${router.query.id}`, fetcher);

  // refs
  const listTitleRef = useRef<HTMLInputElement>(null);
  const boardnameRef = useRef<HTMLInputElement>(null);

  // local state
  const [editable, setEditable] = useState(false);
  const [addList, setAddList] = useState(false);

  function getListsOrder() {
    if (lists.length) {
      return midString(lists[lists.length - 1].order, '')
    } else {
      return 'n'
    }
  }

  async function addNewList() {
    const obj = {
      name: listTitleRef?.current?.value,
      boardId: router.query.id,
      order: getListsOrder(),
    }

    await axios.post('/api/lists', obj);
    mutate(`/api/lists?boardid=${router.query.id}`)
    setAddList(false);
  }

  async function editList(data:{name: string}, id: string) {
    await axios.patch(`/api/lists/${id}`, { name: data.name });
    mutate(`/api/lists?boardid=${router.query.id}`);
  }

  async function editBoard() {
    if(boardnameRef && boardnameRef.current){
      const name = boardnameRef.current.value;
      const obj = { ...project, name: name }
      mutate(`/api/board/${router.query.id}`, obj, false);
      const result = axios.patch(`/api/board/${router.query.id}`, { name });
      console.log('result = ', result);
      mutate(`/api/board/${router.query.id}`, result);
    }
  }

  const handleKeyDown = (event:KeyboardEvent) => {
    console.log('keydown called')
    // if (e.key === 'Enter') {
    //   e.preventDefault()
    //   if (listTitleRef.current.value === '') {
    //     setAddList(false);
    //   }
    //   else {
    //     addNewList();
    //   }
    // } else {
    //   setEditable(false)
    //   setAddList(false);
    // }
  }

  const resetAddList = () => {
    setAddList(false);
  }

  useEffect(() => {
    if (lists && project && activities) {
      const sortedLists = _.orderBy(lists, ['order'], ['asc'])
      const sortedCards = _.orderBy(cards, ['order'], ['asc'])
    } else {
      console.log('not yet...')
    }
  }, [lists, project, activities])


  const reorderColumns = (source:DraggableLocation, destination:DraggableLocation, draggableId: string) => {
    let newOrder;
    const target = lists.filter((i:IList) => i._id === draggableId)[0];

    if (destination.index === 0) {
      newOrder = midString('', lists[destination.index].order)
    } else if (destination.index === lists.length - 1) {
      newOrder = midString(lists[destination.index].order, '')
    } else if (destination.index > source.index) {
      newOrder = midString(
        lists[destination.index - 1].order,
        lists[destination.index].order
      )
    } else {
      newOrder = midString(
        lists[destination.index].order,
        lists[destination.index + 1].order,
      )
    }
    let copy = lists.find((l: IList) => l._id === draggableId)
   copy = {...copy, order: newOrder}
   // mutate(`/api/lists?boardid=${router.query.id}`, [copy])
    // 2. update in db
    axios.patch(`/api/lists/${draggableId}`,
      {
        id: draggableId,
        order: newOrder
      })
      .then(() => {
        mutate(`/api/lists?boardid=${router.query.id}`)
      });
    // reorder list
    target.order = newOrder;
    console.log('reorder the list', lists)
    const sorted = _.orderBy(lists, ['order'], ['asc'])
    console.log('sorted = ', sorted);
    // reset data to rereder
  }

  const moveToNewList = (source:DraggableLocation, destination:DraggableLocation, draggableId: string) => {
    console.log('I need to move card to a new list ', source, destination, draggableId);
    let copy = [...cards];
    const taskLength = cards.length;
    console.log('I need to move card to a new list ', 'source index = ', source.index, 'dest index = ', destination.index, 'task len = ', taskLength);

    let target = copy.filter((c) => c._id === draggableId)[0];
    let newOrder;

    if (destination.index === 0) {
      console.log('i am first...')
      newOrder = midString('', target.order)
    } else if (destination.index < source.index) {
      console.log('i just moved up...')
      newOrder = midString(
        cards[destination.index - 1].order,
        cards[destination.index].order
      )
    } else if (destination.index > source.index) {
      console.log('i just moved down...')
      newOrder = midString(
        cards[destination.index].order,
        cards[destination.index].order + 1
      )
    } else {
      console.log('i am last...', target)
      newOrder = midString(target.order, '')
    }

    // assign order and listId
    copy = copy.filter((c) => c._id !== target._id);
    target = Object.assign({ ...target }, { listId: destination.droppableId, order: newOrder })
    copy = [...copy, target];
    mutate(`/api/cards?boardid=${router.query.id}`, copy)

    // post card
    axios.patch(`/api/cards/${draggableId}`,
      { listId: destination.droppableId, order: newOrder })
      .then(() => updateCards());
    // post activity
    axios.post(`/api/activities`,
      { boardId: router.query.id, text: `${user.firstName} ${user.lastName} moved a card` })
      .then(() => updateActivities());
  }

  const onDragEnd = (result: DropResult) => {
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
    const startList = lists.filter((l:IList) => l._id === source.droppableId);
    const targetCard = cards.filter((c: ICard) => c._id === draggableId)[0];

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
      const taskLength = cards.filter((c:ICard) => c.listId === source.droppableId).length;
      const colummnCards = cards.filter((c:ICard) => c.listId === source.droppableId)
      const sorted = _.orderBy(colummnCards, ['order'], ['asc'])
      if (destination.index === 0) {
        console.log('I am first', column)
        // 1. find the card 
        // 2. assign card new order
        newOrder = midString('', cards[destination.index].order)
      }
      else if (destination.index === taskLength - 1) {
       //  console.log('I am last')
        newOrder = midString(cards[destination.index].order, '')
      }
      // move closer to top, decrease index
      else if (destination.index < source.index) {
        // console.log('I moved closer to the top!', sorted[destination.index].order, sorted[destination.index - 1].order);
        newOrder = midString(
          sorted[destination.index - 1].order,
          sorted[destination.index].order,
        )
        console.log('new order = ', newOrder)
      }
      // move closer to bottom, increase index
      else {
        // console.log('I moved closer to the bottom' , sorted[destination.index + 1].order, sorted[destination.index].order)
        newOrder = midString(
          sorted[destination.index].order,
          sorted[destination.index + 1].order,
        )
      }
      // 2. update in db
      axios.patch(`/api/cards/${draggableId}`,
        {
          order: newOrder,
        })
        .then(() => updateCards());
      // reorder list
      updateCards();
      return;
    }
  }

  if (!project || !lists || !activities) {
    return (
      <div />
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
        <Drawer activities={activities.reverse()} />
        <Box sx={{ position: 'fixed', top: 64, left: 0, right: 0 }}>
          {
            !editable ? (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'row', 
                width: '100%', 
                justifyContent: 'space-between' }}
                >
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
              inputRef={boardnameRef}
              autoFocus
              margin="dense"
              id="boardname"
              label="Name"
              variant="standard"
              onBlur={() => { editBoard(); setEditable(false); }}
            />
          }
        </Box>
        <Box
          className="all-columns-wrapper"
          sx={{ display: 'flex', mt: 5 }}
        >
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
                          lists && cards && _.orderBy(lists, ['order'], ['asc']).map((list:IList, index: number) => {
                            const listCards = cards.filter((card:ICard) => card.listId === list._id);
                            return <Column
                              key={list._id}
                              column={list}
                              tasks={_.orderBy(listCards, ['order'], ['asc'])}
                              index={index}
                              callback={updateCards}
                              listsCallback={updateLists}
                              editList={editList}
                              activitiescb={updateActivities} />;
                          })}
                        {provided.placeholder}
                        <div>
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
                                      inputRef={listTitleRef}
                                      autoFocus
                                      onBlur={() => setEditable(false)}
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
                                  {`${lists && lists.length ? 'Add another list' : 'Add a list'}`}
                                </Button>
                              </Box>
                            }
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </Box>
        <EditCardDialog
          lists={lists}
          updateCards={updateCards}
        />
      </div>
    </Container>
  );
};