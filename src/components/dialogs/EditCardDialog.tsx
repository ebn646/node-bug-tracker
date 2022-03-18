import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { openModal } from '../../store/modal/modalSlice';

import {
    Box,
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';

import useSWR from 'swr';
import { fetcher } from '../../../lib/fetch';

function EditCardDialog() {
    const open_modal = useSelector((state: RootState ) => state.modal.open)
    const dispatch = useDispatch()
    const router = useRouter();
    const test: string = "6230f3f8e3c6eb44eb63f46d"
    const [open, setOpen] = useState(true);
    const [cardId, setCardId] = useState();
    // data hook
    const { data } = useSWR(cardId ? `/api/cards/${cardId}` : null, fetcher);

    useEffect(() => {
      console.log(open_modal)
    }, [open_modal])
    

    useEffect(() => {
        console.log('data = ', data)
    }, [data])

    useEffect(() => {
        console.log('id = ', router.query.cardid)
        if(router.query && router.query.cid){
            setCardId(router.query.cid)
        }
    }, [router])



    const handleClose = () => {
        router.back()
        dispatch(openModal(false));    
    };


    if (!data || !router.query.cid) {
        return <></>
    }

    return (
        <Dialog         
        open={open_modal} 
        onClose={handleClose}>
            <DialogContent>
                {/* <div>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div> */}
                <TextField
                    defaultValue={data.name}
                    margin="dense"
                    id="name"
                    label="Name"
                    fullWidth
                    variant="outlined"
                />
                <Box>
                    <TextField
                        margin="dense"
                        id="name"
                        label="Description"
                        type="text"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={2}
                    />
                    <Button variant="contained" onClick={handleClose}>Save</Button>
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
