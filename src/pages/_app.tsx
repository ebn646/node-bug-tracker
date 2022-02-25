import React, { FC, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useSession } from 'next-auth/client';
import { createEmotionCache } from '../utils/create-emotion-cache';
import { theme } from '../theme';
import { fetcher } from '../../lib/fetch';
import UserContext from '../context/UserContext';

const clientSideEmotionCache = createEmotionCache();

function App(props) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState();
  
  useEffect(() => {
    if (!currentUser) {
      if (pageProps.session) {
        console.log('session is...');
        const { email } = pageProps.session.user;
        getUser(email);
      } else {
        console.log('Aint no sessions.....');
      }
    }
  }, [router]);

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page: any) => page);

  const getUser = useCallback(async (email) => {
    const result = await fetcher(`/api/users?email=${email}`);
    setCurrentUser(result);
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>
          Node Bug Tracker
        </title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
      </Head>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <UserContext.Provider value={currentUser}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {getLayout(<Component {...pageProps} />)}
          </ThemeProvider>
        </UserContext.Provider>
      </LocalizationProvider>
    </CacheProvider>
  );
}

export default App;
