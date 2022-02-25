import React, { useState, useRef, useContext, useEffect } from 'react';
import useSWR, { mutate } from 'swr';
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
  // local state
  const [open, setOpen] = useState(false);
  const [boardTitle, setBoardTitle] = useState('');
  // refs
  const nameInputRef = useRef();


  const handleChange = (e) => {
    e.preventDefault()
    setBoardTitle(e.target.value)
  }

  useEffect(() => {
    console.log('user from boards = ', user)
    console.log('data = ', data)
  }, [user, data])

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required(''),
    }),
  });

  async function submitHandler(e) {
    console.log(nameInputRef.current.value)
    e.preventDefault();
    if (!nameInputRef.current.value || nameInputRef.current.value === '') {
      return;
    }

    const name = nameInputRef.current.value;
    const userId = user._id;
    const obj = { name, userId }
    const result = await axios.post('/api/boards/', obj)
    setBoardTitle('')
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
            <Box
              sx={{
                mx: 1,
                width: 200,
                height: 100,
                backgroundColor: 'primary.dark',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  opacity: [0.9, 0.8, 0.7],
                },
              }}
            >
              <ProjectCard project={project} />
            </Box>
          ))}
          <Button sx={{
            mx: 1,
            width: 200,
            height: 100,
            backgroundColor: 'primary.dark',
            '&:hover': {
              backgroundColor: 'primary.main',
              opacity: [0.9, 0.8, 0.7],
            },
          }} color="primary" variant="contained" onClick={handleClickOpen}>
            Create new board
          </Button>
        </Grid>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create A New Board</DialogTitle>
        <DialogContent>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <TextField
              inputRef={nameInputRef}
              autoFocus
              margin="dense"
              id="name"
              fullWidth
              variant="standard"
              placeholder="Add board title..."
              value={boardTitle}
              onChange={handleChange}

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
