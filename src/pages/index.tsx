/* eslint-disable react/jsx-filename-extension */
import React, { useContext, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import {
  Box, Container,
} from '@mui/material';
import { Boards } from '../components/board/Boards';
import { DashboardLayout } from '../components/DashboardLayout';
import UserContext from '../context/UserContext';

function Index() {
  const user = useContext(UserContext);

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
          py: 8,
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
  console.log('req session = ', session);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default Index;
