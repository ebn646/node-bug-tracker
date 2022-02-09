import React, { useState } from "react";
import { getSession } from 'next-auth/client';
import Head from 'next/head';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { Box, Container, Grid, Pagination } from '@mui/material';
import { ProjectBoard } from '../../components/project/ProjectBoard';
import { DashboardLayout } from '../../components/dashboard-layout';
import useSWR from 'swr';
import { fetcher } from '../../../lib/fetch';

const Project = () => {

  return (
    <>
      <Box>
        <Grid container>
          <Grid item>
              <Breadcrumbs aria-label="breadcrumb">
                <Link
                  underline="hover"
                  color="inherit"
                  href="/"
                >
                  Projects
                </Link>
                <Typography color="text.primary">Project Name</Typography>
              </Breadcrumbs>
          </Grid>
        </Grid>
      </Box>
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
          <ProjectBoard />
        </Container>
      </Box>
    </>
  );
};

Project.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;


export async function getServerSideProps(context){
  const session = await getSession({req: context.req});

  if(!session){
    return {
      redirect:{
        destination: '/login',
        permanent: false,
      }
    }
  }

  return {
    props: { session },
  }
}

export default Project;
