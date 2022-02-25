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
    <a style={{textDecoration: 'none', height: '100%', width: '100%',display: 'inline-flex', border: '1pz solid blue'}}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
      {...rest}
    >
        <Typography
          align="left"
          color="#fff"
          gutterBottom
          variant="subtitleBold"
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
