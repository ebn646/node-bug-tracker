import Link from 'next/link';
import { styled } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material'
import Paper from '@mui/material/Paper';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderRadius: 0,
  height: 100,
  position: 'relative',
  '.star':{
    position: 'absolute',
    bottom: 8,
    right: 8,
    fill: 'white',
    display: 'none',
    cursor: 'pointer',
  },
  '&:hover': {
      '.star': {
        display: 'block',
      }
  }
}));

interface BoardTypes {
  board: {
    _id: string,
    name: string,
    backgroundImage: string,
  }
}


export default function BoardTile({ board } : BoardTypes) {
  
  return (
    <Grid item xs={3}>
      <Item sx={{
        mt: 0,
        mr: '1%',
        mb: '1%',
        ml: 0,
        p: 1,
        borderRadius: 0,
        width: '100%',
        height: 100,
        backgroundImage: `url(/static/images/${board.backgroundImage})`,
        backgroundSize: '100% 100%',
      }}>
        <Link href={`/b/${board._id}`}>
          <a
            style={{
              display: 'flex',
              width: '100%',
              height: '100%',
              textDecoration: 'none',
            }}
          >
            <Typography
              align="left"
              color="#fff"
              gutterBottom
              variant="subtitle2"
            >
              {board.name}
            </Typography>
          </a>
        </Link>
        <StarOutlineIcon className="star" />
      </Item>
    </Grid>
  )
}
