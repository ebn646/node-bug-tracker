import React from 'react';
import Paper from '@mui/material/Paper';
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
    color: theme.palette.text.secondary,
    '.delete': {
      display: 'none',
    },
    '&:hover, &.Mui-focusVisible': {
      boxShadow: `0px 0px 0px 8px ${alpha(theme.palette.success.main, 0.16)}`,
      '.delete':{
        display: 'flex',
        '&:hover':{
          fill: 'red',
        }
      },
    },
  }));
  
export default function Card({task, index}){
    return (
        <Draggable draggableId={task._id} index={index}>
          {provided => (
            <Item
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              {task.name}
              <DeleteIcon className='delete'/>
            </Item>
          )}
        </Draggable>
      );
}