import React, { useState, useRef, useContext, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  ButtonBase,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material';
import { ProjectCard } from './HomeCard';
import UserContext from '../../context/UserContext';
import { fetcher } from '../../../lib/fetch';

const images = [
  {
    url: '/static/images/photo-1644145699796-6f88eedcb084.jpeg',
    title: 'Breakfast',
    id: '1644145699796-6f88eedcb084',
  },
  {
    url: '/static/images/photo-1646159378166-f342e7974649.jpeg',
    title: 'Burgers',
    id: '1646159378166-f342e797464',
  },
  {
    url: '/static/images/photo-1646167858622-b94eb44d1b7a.jpeg',
    title: 'Mountains',
    id: '1646167858622-b94eb44d1b7a',
  },
  {
    url: '/static/images/photo-1646233963514-f62b4267119b.jpeg',
    title: 'Camera',
    id: '1646233963514-f62b4267119b',
  },
];

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  height: 40,
  [theme.breakpoints.down('sm')]: {
    width: '100% !important', // Overrides inline-style
    height: 100,
  },
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiImageBackdrop-root': {
      opacity: 0.15,
    },
    '& .MuiImageMarked-root': {
      opacity: 0,
    },
    '& .MuiTypography-root': {
      border: '4px solid currentColor',
    },
  },
  '&.selected': {
    border: '2px solid #5048E5'
  }
}));

export const Boards = (props) => {
  const user = useContext(UserContext);
  const { data, error } = useSWR(user ? `/api/boards?id=${user._id}` : null, fetcher);
  // local state
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(images[0].id);
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
    <Box {...props} sx={{ padding: 2 }}>
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
          {data && data.map((board) => (
            <Box
              key={board._id}
              sx={{
                mt: 0,
                mr: '1%',
                mb: '1%',
                ml: 0,
                p: 1,
                borderRadius: 1,
                width: 200,
                height: 100,
                backgroundColor: 'primary.dark',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  opacity: [0.9, 0.8, 0.7],
                },
              }}
            >
              <ProjectCard project={board} />
            </Box>
          ))}
          <Button sx={{
            x: 1,
            width: 200,
            height: 100,
            backgroundColor: 'primary.light',
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
        <DialogTitle>Create Board</DialogTitle>
        <DialogContent>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <Typography variant="subtitle2">Background</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', maxWidth: 300, width: '100%' }}>
              {images.map((image) => (
                <ImageButton
                  id={image.id}
                  onClick={() => setSelected(image.id)}
                  className={`${selected === image.id && 'selected'}`}
                  focusRipple
                  key={image.id}
                  style={{
                    margin: 4,
                    width: 64,
                    height: 40,
                    backgroundImage: `url(${image.url})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              ))}
            </Box>
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
