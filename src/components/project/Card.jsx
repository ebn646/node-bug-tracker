import React, {useState} from 'react';
import axios from 'axios';
import {TextField, Paper }from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
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

export default function Card({ task, index, callback }) {

  const [edit, showEdit] = useState(false);

  async function deleteSubmitHandler(e) {
    const response = await axios.delete(`/api/cards/${task._id}`);
    // TODO:  Add error handling...
    if(response.status === 200){
      console.log('delete was a success!')
      callback({_id: task._id}, 'DELETE');
    }else{
      throw new Error('There was an error deleting your card!')
    }
  }

  async function editSubmitHandler(e) {
    e.preventDefault();
    if(e.target.value === task.name) return
    console.log(e.target.value)
    const response = await axios.patch(`/api/cards/${task._id}`, {name: e.target.value});
    // TODO:  Add error handling...
    if(response.status === 200){
      console.log('update was a success!')
      task.name = e.target.value;
    }else{
      throw new Error('There was an error deleting your card!')
    }
  }

  return (
    <Draggable draggableId={task._id} index={index}>
      {provided => (
        <Item
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => showEdit(true)}
        >
          {
            edit ? (
              <TextField
              id="task-name"
              variant="standard"
              defaultValue={task.name}
              autoFocus
              onBlur={(e) => {showEdit(false); editSubmitHandler(e)}}
            />
            ) : <p>{task.name} {task.order}</p>
          }
          <DeleteIcon className='delete' onClick={(e) => deleteSubmitHandler(e)} />
        </Item>
      )}
    </Draggable>
  );
}