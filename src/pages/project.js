import Head from 'next/head';
import { Box, Container, Grid, Pagination } from '@mui/material';
import { projects } from '../__mocks__/projects';
import { ProductBoardToolbar } from '../components/project/project-board-toolbar';
import { ProjectCard } from '../components/project/project-card';
import { DashboardLayout } from '../components/dashboard-layout';

const Project = () => (
  <>
    <Head>
      <title>
        Project Name
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
        <ProductBoardToolbar />
        <Box sx={{ pt: 3 }}>
          <Grid
            container
            spacing={3}
          >
            {projects && projects.length > 0 && projects.map((project) => (
              <Grid
                item
                key={project.id}
                lg={4}
                md={6}
                xs={12}
              >
                <ProjectCard project={project} />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 3
          }}
        >
          <Pagination
            color="primary"
            count={3}
            size="small"
          />
        </Box>
      </Container>
    </Box>
  </>
);

Project.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Project;
