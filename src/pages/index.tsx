import React from 'react';
import { useContext, useEffect } from 'react';
import { getSession } from 'next-auth/client';
import Head from 'next/head';
import { Box, Container, Grid, Pagination } from '@mui/material';
import { projects } from '../__mocks__/projects';
import { Boards } from '../components/project/Boards';
import { DashboardLayout } from '../components/dashboard-layout';
import UserContext from '../context/UserContext';

const Index = () => {
  const user = useContext(UserContext);

  useEffect(() => {
    console.log('user = ', user)
  }, [user])

  return (
    <>
      <Head>
        <title>
          Projects | Node Bug Tracker
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth={false}>
          <Boards />
        </Container>
      </Box>
    </>
  );
}

Index.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  console.log('req session = ', session)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  return {
    props: { session },
  }
}

export default Index;
