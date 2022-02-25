import React, { useState, useRef, useContext, useEffect } from 'react';
import useSWR, {mutate} from 'swr';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from '@mui/material';
import { ProjectCard } from './HomeCard';
import UserContext from '../../context/UserContext';
import { fetcher } from '../../../lib/fetch';

export const Boards = (props) => {
  const user = useContext(UserContext);
  const { data, error } = useSWR(user ? `/api/boards?id=${user._id}` : null, fetcher);
  const [open, setOpen] = useState(false);
  const nameInputRef = useRef();
  const descriptionRef = useRef();

  useEffect(() => {
    console.log('user from boards = ', user)
    console.log('data = ', data)
  },[user, data])

  const formik = useFormik({
    initialValues: {
      name: 'test project',
      description: 'test description'
    },
    validationSchema: Yup.object({
      name: Yup.string().required(''),
      description: Yup.string().required(''),
    }),
  });

  async function submitHandler(e) {
    e.preventDefault();
    const name = formik.values.name;
    const description = formik.values.description;
    const userId = user._id;
    const obj = { name, description, userId }
    const result = await axios.post('/api/boards/', obj)
    mutate(`/api/boards?id=${user._id}`);
    console.log('result ', result);
    setOpen(false);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box {...props}>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          m: -1,
        }}
      >
      </Box>
      <Box sx={{ pt: 3 }}>
          <Grid
            container
            spacing={1}
          >
            {data && data.map((project) => (
              <Grid
                item
                key={project._id}
                lg={3}
                md={6}
                xs={12}
              >
                <ProjectCard project={project} />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ m: 1 }}>
          <Button color="primary" variant="contained" onClick={handleClickOpen}>
            Add board
          </Button>
        </Box>
      </Box> 
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create A New Board</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a new project, please enter a name and description.
          </DialogContentText>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <TextField
              ref={nameInputRef}
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              fullWidth
              variant="standard"
              value={formik.values.name}
            />
            <TextField
              ref={descriptionRef}
              autoFocus
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
              value={formik.values.description}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={submitHandler}>Create</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
