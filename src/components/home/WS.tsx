
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Container, Box, Grid, Typography } from '@mui/material';
import WSSection from './WSSection'

const WS = ({ workspace, boards }) => {
    const { data } = useSession();

    async function getWorspaces(id) {
        const res = await axios.get(`/api/workspaces?id=${id}`)
        console.log('res = ', res)
    }
    useEffect(() => {
        if (data) {
            console.log(data.id)
            getWorspaces(data.id)
        }
    }, [data])


    return (
        <Box sx={{ bgcolor: '#fff', height: 'auto', py: 1 }}>
            <Typography variant="h6">{workspace.name}</Typography>
            <WSSection key={Math.random()} boards={boards} />
        </Box>
    )
}

export default WS