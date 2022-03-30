import { useState, useRef } from 'react'
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import CommentItem from './CommentItem';
import Button from '@mui/material/Button';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import { fetcher } from '../../../lib/fetch';

export default function Comments() {
    const router = useRouter();
    const { data } = useSWR(`/api/comments?cid=${router.query.cid}`, fetcher);
    const ref = useRef();
    // local statusCode       
     const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (ref?.current?.value) {
            const response = await axios.post('/api/comments', { text: ref.current.value, boardId: router.query.id, cardId: router.query.cid })
            setComment('');
            mutate(`/api/comments?cid=${router.query.cid}`)
        }
    }

    const handleChange = (event) => {
        setComment(event.target.value)
    }

    return (
        <Box component="form" sx={{ my: 2 }} onSubmit={(e) => handleSubmit(e)}>
            <Typography>Comments</Typography>
            <TextField
                inputRef={ref}
                value={comment}
                margin="dense"
                id="name"
                label="Add a coment..."
                type="text"
                fullWidth
                variant="outlined"
                onChange={handleChange}
            />
            <Button type="submit">Save</Button>
            {
                data ? (
                    <List>
                        {
                            data.map((c) => <CommentItem key={c._id} data={c} />)
                        }
                    </List>) : null
            }

        </Box>
    )
}
