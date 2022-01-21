import React, { useState } from "react";
import {useRouter} from 'next/router';
import Head from 'next/head';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import { Box, Container, Grid, Pagination } from '@mui/material';
import { ProductBoardToolbar } from '../../components/project/project-board-toolbar';
import { DashboardLayout } from '../../components/dashboard-layout';
import "@asseinfo/react-kanban/dist/styles.css";

const board = {
    columns: [
      {
        id: 1,
        title: "Backlog",
        backgroundColor: "#fff",
        cards: [
          {
            id: 1,
            title: "Card title 1",
            description: "Card content"
          },
          {
            id: 2,
            title: "Card title 2",
            description: "Card content"
          },
          {
            id: 3,
            title: "Card title 3",
            description: "Card content"
          }
        ]
      },
      {
        id: 2,
        title: "Doing",
        cards: [
          {
            id: 9,
            title: "Card title 9",
            description: "Card content"
          }
        ]
      },
      {
        id: 3,
        title: "Q&A",
        cards: [
          {
            id: 10,
            title: "Card title 10",
            description: "Card content"
          },
          {
            id: 11,
            title: "Card title 11",
            description: "Card content"
          }
        ]
      },
      {
        id: 4,
        title: "Production",
        cards: [
          {
            id: 12,
            title: "Card title 12",
            description: "Card content"
          },
          {
            id: 13,
            title: "Card title 13",
            description: "Card content"
          }
        ]
      }
    ]
  };

const Project = () => {
  const router = useRouter();
  function handleClick(event) {
    event.preventDefault();
    router.push('/')
  }

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
            <Box>
                
            </Box>
          <ProductBoardToolbar />
        </Container>
      </Box>
    </>
  );
};

Project.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Project;
