import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
} from '@mui/material';

export const ProjectCard = ({ data, ...rest }) => (
  <Link href={`/b/${data._id}`}>
    <a style={{textDecoration: 'none', height: '100%', width: '100%',display: 'inline-flex'}}>
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
          {data.name}
        </Typography>
      <Box sx={{ flexGrow: 1 }} />
    </Box>
    </a>
  </Link>
);

ProjectCard.propTypes = {
  data: PropTypes.object.isRequired,
};
