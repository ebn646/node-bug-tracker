import React from 'react';
import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material'
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderRadius: 0,
    height: 96,
  }));
  

export default function BoardTile() {
  return (
    <Grid item xs={3}> 
         <Item>1</Item>
    </Grid>
  )
}
