import Head from 'next/head';
import { Box, Container, Grid, Pagination } from '@mui/material';
import { projects } from '../__mocks__/projects';
import { ProductListToolbar } from '../components/project/project-list-toolbar';
import { ProductCard } from '../components/project/project-card';
import { DashboardLayout } from '../components/dashboard-layout';

const Projects = () => (
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
        <ProductListToolbar />
        <Box sx={{ pt: 3 }}>
          <Grid
            container
            spacing={3}
          >
            {projects.map((product) => (
              <Grid
                item
                key={product.id}
                lg={4}
                md={6}
                xs={12}
              >
                <ProductCard product={product} />
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

Projects.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Projects;
