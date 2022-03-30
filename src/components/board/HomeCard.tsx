import React from 'react';
import Link from 'next/link';
import {
  Box,
  Typography,
} from '@mui/material';

interface IProject {
  data: {
    _id: string,
    name: string,
  }
}

export const ProjectCard = ({ data }:IProject) => (
  <Link href={`/b/${data._id}`}>
    <a style={{textDecoration: 'none', height: '100%', width: '100%',display: 'inline-flex'}}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
        <Typography
          align="left"
          color="#fff"
          gutterBottom
          variant="subtitle2"
        >
          {data.name}
        </Typography>
      <Box sx={{ flexGrow: 1 }} />
    </Box>
    </a>
  </Link>
);
