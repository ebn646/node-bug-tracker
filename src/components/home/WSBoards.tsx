
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Container, Box, Grid } from '@mui/material';

const WSBoards = () => {
    const { data } = useSession();

    async function getWorspaces(id) {
        const res = await axios.get(`/api/workspaces?id=${id}`)
        console.log('res = ', res)
    }
    useEffect(() => {
        // constaxios.get(`/api/workspaces/${data.id}`)
        if (data) {
            console.log(data.id)
            getWorspaces(data.id)
        }
    }, [data])

    return (
        <Box sx={{ bgcolor: '#cfe8fc', height: '600px' }}>
            I am the WS Boards
        </Box>
    )
}

export default WSBoards