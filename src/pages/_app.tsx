import React, { FC, useState, useEffect, useCallback } from 'react';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createEmotionCache } from '../utils/create-emotion-cache';
import { theme } from '../theme';
import { fetcher } from '../../lib/fetch';
import UserContext from '../context/UserContext';
import { store } from '../store/store';
import { Provider } from 'react-redux';

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
          Trell Node
        </title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
      </Head>

      <SessionProvider>
        <UserContext.Provider value={currentUser}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Provider store={store}>
            {getLayout(<Component {...pageProps} />)}
            </Provider>
          </ThemeProvider>
        </UserContext.Provider>
      </SessionProvider>
    </CacheProvider>
  );
}

export default App;
