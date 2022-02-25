import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Typography,
} from '@mui/material';

export const ProjectCard = ({ project, ...rest }) => (
  <Link href={`/b/${project._id}`}>
    <a style={{textDecoration: 'none', height: '100%', width: '100%'}}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
      {...rest}
    >
        <Typography
          align="left"
          color="textPrimary"
          gutterBottom
          variant="h5"
        >
          {project.name}
        </Typography>
      <Box sx={{ flexGrow: 1 }} />
    </Box>
    </a>
  </Link>
);

ProjectCard.propTypes = {
  project: PropTypes.object.isRequired,
};
