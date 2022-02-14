import React from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Draggable } from 'react-beautiful-dnd';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
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
            </Item>
          )}
        </Draggable>
      );
}