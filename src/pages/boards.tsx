
import { GetServerSideProps } from "next";
import type { Session } from "next-auth";
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import Home from '../components/home';
import { DashboardLayout } from '../components/DashboardLayout';

const Boards = () => {

  return (
    <>
      <Head>
        <title>
          Boards | Node Bug Tracker
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
        redirect:{
          permanent: false,
          destination: '/login'
        }
    }
  }
  return {
      redirect:{
        permanent: false,
        destination: '/boards'
      }
  }
}

export default Boards