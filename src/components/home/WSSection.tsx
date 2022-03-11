import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import BoardTile from './BoardTile';
import { Dialog, DialogContent, DialogTitle, Grid, TextField } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import { addBoard } from '../../store/boards/boardsSlice';

const items = [
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

type Boards = {
  boards: []
}

const WSSection = ({ boards }:Boards) => {
  // local state
  const [open, setOpen] = useState(false)
  const [boardTitle, setBoardTitle] = useState('');
  const nameInputRef = useRef<HTMLFormElement>(null);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Title is required'),
    backgroundImage: Yup.string(),
  })


  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  });

  const user_boards = useSelector((state: RootState) => state.boards.value)
  const dispatch = useDispatch();

  const handleChange = () => {
    if (nameInputRef.current && nameInputRef.current.value) {
      setBoardTitle(nameInputRef.current.value)
    }
  }

  const submitHandler = (data:any) => {
    console.log(data)
    console.log(errors)
    dispatch(addBoard(data))
  }
  useEffect(() => {
    console.log('user_boards = ', user_boards)
  }, [user_boards])
  

  return (
    <Box sx={{ width: '100%' }} my={2} pr={1}>
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2 }}>
        {
          boards.length ? (
            boards.map((b, {_id}: any) => <BoardTile key={_id} board={b} />)
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
          <Box component="form" id="createboard_form" onSubmit={handleSubmit(submitHandler)}>
            <Stack spacing={2}>
            <TextField
              inputRef={nameInputRef}
              autoFocus
              margin="dense"
              id="name"
              fullWidth
              variant="standard"
              placeholder="Add board title..."
              // value={boardTitle}
              // onChange={handleChange}
              {...register('name')}
              error={errors.name}

            />
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label" sx={{mb: 1}}>Background</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={items[0].url}
              >
                {
                  items.map((i) =>
                    <FormControlLabel 
                    value={i.url}
                    control={<Radio />}
                    key={i.id}
                      {...register("backgroundImage")}
                      label={
                        <img
                          src={i.url}
                          className='img-fluid'
                          alt={i.title}
                          width="64"
                          height="40"
                        />
                      } />
                  )
                }
              </RadioGroup>
            </FormControl>
            <Button type="submit">Create Board</Button>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
export default WSSection;