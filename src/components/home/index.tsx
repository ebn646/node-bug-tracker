
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Container,Grid, Typography } from '@mui/material';
import LeftSidebar from './LeftSidebar';
import WSBoards from './WSBoards';

const Home = () => {
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
    <React.Fragment>
      <Container maxWidth="lg">
        <Grid container spacing={3} sx={{marginTop: 4}}>
          <Grid item xs={3}>
            <LeftSidebar />
          </Grid>
          <Grid item xs={8}>
              <Typography>YOUR WORKSPACES</Typography>
            <WSBoards />
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  )
}

export default Home