import React, { useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import UserHeader from './UserHeader';

const DashboardLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  maxWidth: '100%',
  paddingTop: 64,
}));

export const DashboardLayout = (props) => {
  const { children } = props;

  return (
    <>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      <UserHeader />
    </>
  );
};
