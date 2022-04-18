import React, { ReactElement } from 'react';
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Box, Container } from '@mui/material';
import { Board } from '../../components/board/Board';
import { DashboardLayout } from '../../components/DashboardLayout';

function Project() {
  return (
    <>
      <Head>
        <title>Board Name</title>
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

Project.getLayout = (page: ReactElement) => <DashboardLayout>{page}</DashboardLayout>;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const session = await getSession({ req: context.req });
    if (!session) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
  } catch(err){
    
  }
 
  return {
    props: {},
  };
}

export default Project;
