import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd'
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Card from './Card';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const Title = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
}));

export default function Column({ column, tasks, index }) {
    return (
        <Draggable draggableId={column._id} index={index}>
            {
                (provided) => (
                    <Box ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{ width: '100%', maxWidth: 360, marginLeft: 1 }}>
                        <div style={{ height: 'auto', background: '#ebecf0', padding: 10 }}>
                            <p style={{padding: 10}} {...provided.dragHandleProps}>{column.name}</p>
                            {/* <p style={{ fontSize: 10 }}>{column._id}</p> */}
                            <Droppable droppableId={column._id} index={index} type="card">
                                {
                                    (provided) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps}>
                                            {tasks.map((task, index) => (
                                                <Card key={task._id} task={task} index={index} />
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )
                                }
                            </Droppable>
                        </div>
                    </Box>
                )
            }
        </Draggable>
    )
}