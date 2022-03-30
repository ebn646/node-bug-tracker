import React, {useState, FocusEvent} from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { openModal } from '../../store/modal/modalSlice';
import {TextField, Paper }from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import { Draggable } from 'react-beautiful-dnd';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  margin: theme.spacing(1),
  textAlign: 'left',
  display: 'flex',
  justifyContent: 'space-between',
  minHeight: 40,
  color: theme.palette.text.secondary,
  '.delete': {
    display: 'none',
  },
  '&:hover, &.Mui-focusVisible': {
    background: '#f4f5f7',
    '.delete': {
      display: 'flex',
      '&:hover': {
        fill: 'red',
      }
    },
  },
}));

interface ICard {
  task: {
    _id: string,
    name: string,
    boardId: string,
    order: string,
  },
  callback: () => void,
  index: number,
}

export default function Card({ task, index, callback }:ICard) {
  const router = useRouter()
  const dispatch = useDispatch();

  const [edit, showEdit] = useState(false);

  async function editSubmitHandler(e: FocusEvent<HTMLInputElement>) {
    e.preventDefault();
    if(e.target.value === task.name) return
    const response = await axios.patch(`/api/cards/${task._id}`, {name: e.target.value});
    // TODO:  Add error handling...
    if(response.status === 200){
      console.log('update was a success!')
      task.name = e.target.value;
      callback();
    }else{
      throw new Error('There was an error deleting your card!')
    }
  }

  function goto(){
    const href = `/b/${task.boardId}?cid=${task._id}`
    router.push(href, href, { shallow: true })
    dispatch(openModal(true));
  }

  return (
    <Draggable draggableId={task._id} index={index} >
      {provided => (
        <Item
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => goto()}
        >
          {
            edit ? (
              <TextField
              id="task-name"
              variant="standard"
              defaultValue={task.name}
              autoFocus
              onBlur={(e:FocusEvent<HTMLInputElement>) => {showEdit(false); editSubmitHandler(e)}}
            />
            ) : <p>{task.name} ({task.order})</p>
          }
          <EditIcon className='delete' onClick={() =>  goto()} />
        </Item>
      )}
    </Draggable>
  );
}