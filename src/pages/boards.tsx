
import React, { useEffect } from 'react';
import Head from 'next/head';
import { useSession, getSession } from 'next-auth/react';
import axios from 'axios';
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

Boards.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Boards