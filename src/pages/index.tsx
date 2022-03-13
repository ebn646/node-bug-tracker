/* eslint-disable react/jsx-filename-extension */
import React, { useContext, useEffect } from 'react';
import { GetServerSideProps } from "next";
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import {
  Box, 
  Container,
} from '@mui/material';
import { Boards } from '../components/board/Boards';
import { DashboardLayout } from '../components/DashboardLayout';
import UserContext from '../context/UserContext';

function Index() {
  const user = useContext(UserContext);

  return (
    <></>
  );
}

Index.getLayout = (page: JSX.Element) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {  
  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: '/workspaces',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default Index;
