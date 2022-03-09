// import { Grid } from '@mui/material';
// import React from 'react'
// import BoardTile from './BoardTile';

// export default function WSSection() {
//     return (
//         <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
//             <BoardTile />
//             <BoardTile />
//             <BoardTile />
//         </Grid>
//     )
// }
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import BoardTile from './BoardTile';
import { Typography } from '@mui/material';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function RowAndColumnSpacing() {
  return (
    <Box sx={{ width: '100%'}} my={2} px={1}>
        <Typography>Workspace name..</Typography>
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2 }}>
        <BoardTile />
        <BoardTile />
        <BoardTile />
        <BoardTile />
        <BoardTile />
        <BoardTile />
      </Grid>
    </Box>
  );
}
