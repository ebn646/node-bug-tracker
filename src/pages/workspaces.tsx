
import { GetServerSideProps } from "next";
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import Home from '../components/home';
import { DashboardLayout } from '../components/DashboardLayout';

const Boards = () => {

  return (
    <>
      <Head>
        <title>
          Workspaces | Node Bug Tracker
        </title>
      </Head>
      <Home />
    </>
  )
}

Boards.getLayout = (page: JSX.Element) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {  
  const session = await getSession({req: context.req});
  if(!session){
    return{ 
      props: {
        redirect:{
          permanent: false,
          destination: '/login'
        }
      }
    }
  }
  return {
    props: {
      redirect:{
        permanent: false,
        destination: '/boards'
      }
    }
  }
}

export default Boards