import { useState, useRef } from 'react';
import useSWR from 'swr';
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
import { Search as SearchIcon } from '../../icons/search';
import { ProjectCard } from './ProjectCard';

import { fetcher } from '../../../lib/fetch';

export const ProjectListToolbar = (props) => {
  const { data, error } = useSWR(`http://localhost:3000/api/projects/`, fetcher);
  const [open, setOpen] = useState(false);
  const nameInputRef = useRef();
  const descriptionRef = useRef();
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
    const content = { name, description }
    let result;
    try {
      // setIsLoading(true);
      result = await fetcher('/api/projects?', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( content ),
      });
      // toast.success('You have posted successfully');
      // contentRef.current.value = '';
      // refresh post lists
      //mutate();
    } catch (e) {
      //toast.error(e.message);
      console.log(e)
    } finally {
      console.log('Finally')
    }
    console.log('result ', result);
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
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          m: -1,
        }}
      >
        <Typography sx={{ m: 1 }} variant="h4">
          Projects
        </Typography>
        <Box sx={{ m: 1 }}>
          <Button color="primary" variant="contained" onClick={handleClickOpen}>
            Add project
          </Button>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ maxWidth: 500 }}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon fontSize="small" color="action">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                placeholder="Search projects"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ pt: 3 }}>
          <Grid
            container
            spacing={3}
          >
            {data && data.map((project) => (
              <Grid
                item
                key={project._id}
                lg={4}
                md={6}
                xs={12}
              >
                <ProjectCard project={project} />
              </Grid>
            ))}
          </Grid>
      </Box> 
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create A New Project</DialogTitle>
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
