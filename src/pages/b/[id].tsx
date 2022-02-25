import React, { useState } from 'react';
import { getSession } from 'next-auth/client';
import Head from 'next/head';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { Box, Container } from '@mui/material';
import useSWR from 'swr';
import { Board } from '../../components/project/Board';
import { DashboardLayout } from '../../components/DashboardLayout';
import { fetcher } from '../../../lib/fetch';

function Project() {
  return (
    <>
      <Head>
        <title>Project Name</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 2,
        }}
      >
        <Container maxWidth={false}>
          <Board />
        </Container>
      </Box>
    </>
  );
}

Project.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

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

export default Project;
