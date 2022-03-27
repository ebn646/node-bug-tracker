import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { openModal } from '../../store/modal/modalSlice';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
    Box,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
} from '@mui/material';
import useSWR from 'swr';
import { fetcher } from '../../../lib/fetch';

interface ICard {
    name?: string,
    description?: string,
    listId: string,
}
interface IEditCardDiaog {
    lists: [],
    updateCards: () => void,
}

interface IList {
    _id: string,
    name: string,
}

function EditCardDialog({ lists, updateCards }: IEditCardDiaog) {
    // redux
    const open_modal = useSelector((state: RootState) => state.modal.open)
    const dispatch = useDispatch()
    // router
    const router = useRouter();
    // local state
    const [cardId, setCardId] = useState<any | undefined>(undefined);
    // data hook
    const { data: card, mutate } = useSWR<ICard>(cardId ? `/api/cards/${cardId}` : null, fetcher);
    // form
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('First name is required'),
        description: Yup.string()
    });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(validationSchema)
    });

    useEffect(() => {
        if (router.query && router.query.cid) {
            setCardId(router.query.cid)
        }
    }, [router])

    const handleChange = async (event: SelectChangeEvent) => {
        // call api to update cars
        const result = await axios.patch(`/api/cards/${router.query.cid}`, { listId: event.target.value })
        const updated = { ...card, listId: event.target.value }
        mutate(updated)
        updateCards()
    };


    const handleClose = () => {
        router.back()
        dispatch(openModal(false));
    };

    const onEditSubmit = async (data: any) => {
        const result = await axios.patch(`/api/cards/${router.query.cid}`, data)
        if (result.data) {
            const updated = { ...card, ...data }
            mutate(updated)
            updateCards()
        }
        console.log('success... ', result)
    }


    function getDefaultItem(){
        if(card){
            if(lists.filter((l: IList) => l._id === card.listId).length){
                return lists.filter((l: IList) => l._id === card.listId)[0]._id
            }
        }
    }


    if (!card || !router.query.cid) {
        return <></>
    }

    return (
        <Dialog
            open={open_modal}
            onClose={handleClose}>
            <DialogContent>
                <Box sx={{ display: 'flex' }}>
                    <Box component="form" sx={{ flex: 1 }}>
                        <TextField
                            defaultValue={card.name}
                            margin="dense"
                            id="name"
                            label="Name"
                            fullWidth
                            variant="outlined"
                            {...register('name')}
                        />
                        <Box>
                            <TextField
                                margin="dense"
                                id="description"
                                label="Description"
                                type="text"
                                fullWidth
                                variant="outlined"
                                multiline
                                rows={2}
                                {...register('description')}
                            />
                            <Button variant="contained" onClick={handleSubmit(onEditSubmit)}>Save</Button>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flex: 1, ml: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Column</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                defaultValue={getDefaultItem()}
                                onChange={handleChange}
                            >
                                {
                                    lists.map((l: IList) => <MenuItem key={l._id} value={l._id}>{l.name}</MenuItem>)
                                }
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                {/* <Box sx={{my:2}}>
                <Typography>Comments</Typography>
                <TextField
                        margin="dense"
                        id="name"
                        label="Add a coment..."
                        type="text"
                        fullWidth
                        variant="outlined"
                    />
                    <List>
                        <ListItem disablePadding>
                            <ListItemText primary="Activity one" />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemText primary="Activity two" />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemText primary="Activity three" />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemText primary="Activity four" />
                        </ListItem>
                    </List>
                </Box> */}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose()}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditCardDialog;
