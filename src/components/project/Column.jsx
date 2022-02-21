import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Box from '@mui/material/Box';
import Card from './Card';
import {
    Button,
    TextField,
    Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import midString from '../../utils/ordering';

const DraggableHeader = styled('div')(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'left',
    color: theme.palette.text.secondary,
}));

export default function Column({ column, tasks, index, callback, listsCallback }) {
    const router = useRouter();
    const ref = useRef();
    const [addCard, showAddCard] = useState(false);
    const [value, setValue] = useState('');

    function toggleAddCard() {
        showAddCard(!addCard)
        setValue('');
    }


    async function addCardSubmitHandler() {
        const obj = {
            name: ref.current.value,
            boardId: router.query.id,
            listId: column._id,
            order: tasks.length === 0 ? 'n' : midString(tasks[tasks.length - 1].order, ''),
        }
        const response = await axios.post('/api/cards/', obj);
        // TODO:  Add error handling...
        console.log('add card response is...', response);
        callback(response.data, 'ADD');
        setValue('');
    }

    async function deleteListSubmitHandler() {
        listsCallback({_id: column._id}, 'DELETE');
        const response = await axios.delete(`/api/lists/${column._id}`);
        // TODO:  Add error handling...
        console.log('delete response is...', response);
    }

    function handleKeyDown(e){
        if (e.key === 'Enter') {
          e.preventDefault()
          if (ref.current.value === ''){
            setValue('');;
          } 
          else {
            addCardSubmitHandler();
          }
        }
      }

    return (
        <Draggable draggableId={column._id} index={index}>
            {
                (provided) => (
                    <Box ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{ width: 280, marginLeft: 1 }}>
                        <div style={{ height: 'auto', background: '#ebecf0', padding: 10 }}>
                            <DraggableHeader 
                                style={{display: 'flex', justifyContent: 'space-between'}} 
                                {...provided.dragHandleProps}
                            >
                                <p style={{ padding: 10 }}>{column.name}</p>
                                <DeleteIcon className='delete' onClick={() => deleteListSubmitHandler()} />
                            </DraggableHeader>
                            <p style={{ fontSize: 10 }}>{column._id}</p>
                            <Droppable droppableId={column._id} index={index} type="card">
                                {
                                    (provided) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps}>
                                            {tasks.map((task, index) => (
                                                <Card key={task._id} task={task} index={index} callback={callback} />
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )
                                }
                            </Droppable>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {
                                    addCard ? (
                                        <Stack
                                            spacing={2}
                                            sx={{ marginLeft: 1 }}
                                        >
                                            <TextField
                                                id="outlined-basic"
                                                label="Enter a title for this card..."
                                                variant="filled"
                                                inputRef={ref}
                                                value={value}
                                                autoFocus
                                                onKeyDown={handleKeyDown}
                                                onChange={(e) => { setValue(e.target.value) }} 
                                                />
                                            <div style={{ display: 'flex', marginTop: 8 }}>
                                                <Button variant="contained" onClick={addCardSubmitHandler}>
                                                    Add card
                                                </Button>
                                                <Button variant="text" endIcon={<CloseIcon />} onClick={toggleAddCard} />
                                            </div>
                                        </Stack>

                                    ) : <Button onClick={toggleAddCard} startIcon={<AddIcon />} style={{width: 270}}>Add a card</Button>
                                }
                            </div>
                        </div>
                    </Box>
                )
            }
        </Draggable>
    )
}