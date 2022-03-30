import React, { useState, useRef, useContext } from 'react';
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
import UserContext from '../../context/UserContext';

const DraggableHeader = styled('div')(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'left',
    color: theme.palette.text.secondary,
}));

interface IColumn {
    index: number,
    column: {
        _id: string,
        name: string,
        order: string,
    },
    tasks:any[],
    updateCards:() => void,
    deleteList:(id:string) => void,
    editList:(name:string, id: string) => void,
    updateActivities:() => void,
}

export default function Column({ column, tasks, index, updateCards, deleteList, editList, updateActivities }:IColumn) {
    const user = useContext(UserContext);
    const router = useRouter();
    const ref = useRef<any>(null);
    const titleRef = useRef<any>(null);
    const [addCard, showAddCard] = useState(false);
    const [value, setValue] = useState('');
    const [edit, setEdit] = useState(false);

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
        updateCards();
        // post activity
        axios.post(`/api/activities`,
            { boardId: router.query.id, text: `${user.firstName} ${user.lastName} added ${ref.current.value}` })
            .then((response) => {
                updateActivities()
            });
        setValue('');
    }

    async function deleteListSubmitHandler() {
        deleteList(column._id);
        // TODO:  Add error handling...
        setValue('');
    }

    function handleKeyDown(e:KeyboardEvent) {
        if (e.key === 'Enter') {
            e.preventDefault()
            if (ref.current.value === '') {
                setValue('');;
            }
            else {
                addCardSubmitHandler();
            }
        }
    }

    function updateListName() {
        editList(titleRef.current.value, column._id)
    }

    function handleKeyDown2(e:any) {
        if (e.key === 'Enter') {
            e.preventDefault()
            if (titleRef.current.value === '') {
                return
            }
            else {
                setEdit(false);
                updateListName();
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
                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                {...provided.dragHandleProps}
                            >
                                {
                                    edit ? (
                                        <TextField
                                            id="list-name"
                                            variant="standard"
                                            inputRef={titleRef}
                                            autoFocus
                                            onKeyDown={(e) => handleKeyDown2(e)}
                                            onBlur={() => setEdit(false)}
                                        />
                                    ) : <Button variant="text" onClick={() => setEdit(true)}>{column.name} ({column.order})</Button>
                                }
                                <DeleteIcon className='delete' onClick={() => deleteListSubmitHandler()} />
                            </DraggableHeader>
                            {/* <p style={{ fontSize: 10 }}>{column._id}</p> */}
                            <Droppable droppableId={column._id} type="card">
                                {
                                    (provided) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps}>
                                            {tasks.map((task:any, index) => (
                                                <Card key={task._id} task={task} index={index} callback={updateCards} />
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
                                                // onKeyDown={handleKeyDown}
                                                // onBlur={toggleAddCard}
                                                onChange={(e) => { setValue(e.target.value) }}
                                            />
                                            <div style={{ display: 'flex', marginTop: 8 }}>
                                                <Button variant="contained" onClick={addCardSubmitHandler}>
                                                    Add card
                                                </Button>
                                                <Button variant="text" endIcon={<CloseIcon />} onClick={toggleAddCard} />
                                            </div>
                                        </Stack>

                                    ) : <Button onClick={toggleAddCard} startIcon={<AddIcon />} sx={{ width: 270, justifyContent: 'flex-start' }}><span>Add a card</span></Button>
                                }
                            </div>
                        </div>
                    </Box>
                )
            }
        </Draggable>
    )
}