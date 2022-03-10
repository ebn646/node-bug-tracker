import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import BoardTile from './BoardTile';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function WSSection({ boards }) {
  return (
    <Box sx={{ width: '100%' }} my={2} pr={1}>
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2 }}>
        {
          boards && boards.length && (
            boards.map((b) => <BoardTile key={b._id} board={b} />)
          )
        }
        <Grid item sm={3}>
          <Button sx={{
            x: 1,
            width: '100%',
            height: 100,
            backgroundColor: 'primary.light',
            borderRadius: 0,
            '&:hover': {
              backgroundColor: 'primary.main',
              opacity: [0.9, 0.8, 0.7],
            },
          }} color="primary" variant="contained">
            Create new board
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
