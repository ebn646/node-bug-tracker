import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import BoardTile from './BoardTile';
import { Dialog, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function WSSection({ boards }) {
  const [open, setOpen] = useState(false)
  const [boardTitle, setBoardTitle] = useState('');
  const [backgroundColor, setBackgroundColor] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState('photo-1644145699796-6f88eedcb084.jpeg')
  const nameInputRef = React.useRef();

  const handleChange = (e) => {
    e.preventDefault()
    setBoardTitle(e.target.value)
  }

  const submitHandler = (e) => {
    alert(true)
  }

  return (
    <Box sx={{ width: '100%' }} my={2} pr={1}>
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2 }}>
        {
          boards.length ? (
            boards.map((b) => <BoardTile key={b._id} board={b} />)
          ) : null
        }
        <Grid item sm={3}>
          <Button sx={{
            x: 1,
            width: '100%',
            height: 100,
            backgroundColor: 'primary.light',
            borderRadius: 0,
            '&:hover': {
              backgroundColor: 'primary.main',
              opacity: [0.9, 0.8, 0.7],
            },
          }}
            color="primary" variant="contained"
            onClick={() => setOpen(true)}
          >
            Create new board
          </Button>
        </Grid>
      </Grid>
      <Dialog open={open}>
        <DialogTitle>Create Board</DialogTitle>
        <DialogContent>
          <Box component="form" id="createboard_form" onSubmit={(e) => {submitHandler(e)}}>
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
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">Background</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
              >
                <FormControlLabel value="one" control={<Radio />}
                  label={
                    <img
                      src='https://via.placeholder.com/150x100'
                      className='img-fluid'
                      alt='tst'
                    />
                  } />
                <FormControlLabel value="two" control={<Radio />}
                  label={
                    <img
                      src='https://via.placeholder.com/150x100'
                      className='img-fluid'
                      alt='tst'
                    />
                  } />
                <FormControlLabel value="three" control={<Radio />}
                  label={
                    <img
                      src='https://via.placeholder.com/150x100'
                      className='img-fluid'
                      alt='tst'
                    />
                  } />
                <FormControlLabel value="four" control={<Radio />}
                  label={
                    <img
                      src='https://via.placeholder.com/150x100'
                      className='img-fluid'
                      alt='tst'
                    />
                  } />
              </RadioGroup>
            </FormControl>
            <Button type="submit">Create Board</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
