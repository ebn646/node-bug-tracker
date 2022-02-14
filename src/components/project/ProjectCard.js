import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from '@mui/material';

export const ProjectCard = ({ project, ...rest }) => (
  <Link href={`/projects/${project._id}`}>
    <a style={{textDecoration: 'none'}}>
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      {...rest}
    >
      <CardContent>
        <Typography
          align="left"
          color="textPrimary"
          gutterBottom
          variant="h5"
        >
          {project.name}
        </Typography>
        <Typography align="left" color="textPrimary" variant="body1">
          {project.description}
        </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
    </Card>
    </a>
  </Link>
);

ProjectCard.propTypes = {
  project: PropTypes.object.isRequired,
};
