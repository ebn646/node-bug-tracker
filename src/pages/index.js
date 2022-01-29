import { getSession } from 'next-auth/client';
import Head from 'next/head';
import { Box, Container, Grid, Pagination } from '@mui/material';
import { projects } from '../__mocks__/projects';
import { ProductListToolbar } from '../components/project/project-list-toolbar';
import { ProjectCard } from '../components/project/project-card';
import { DashboardLayout } from '../components/dashboard-layout';

const Index = () => (
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
            {projects.map((project) => (
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
      </Container>
    </Box>
  </>
);

Index.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

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

export default Index;
