import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import DashBoardIcon from '@mui/icons-material/DashBoard';

type Workspaces = {
  workspaces: []
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({theme}) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(() => ({
  padding: 0,
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));


 const WSAccordions = (props: Workspaces): JSX.Element => {
   const { workspaces } = props;
  return (
    <div>
      {
        workspaces && workspaces.length > 0 && (
          workspaces.map(({name}: any) => (
            <Accordion key={Math.random()}>
            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
              <><DashBoardIcon /><Typography>{name}</Typography></>
            </AccordionSummary>
            <AccordionDetails>
            <Button sx={{width: '100%', justifyContent: 'flex-start'}} startIcon={<DashBoardIcon />}> Boards </Button>
            </AccordionDetails>
          </Accordion>
          )
        ))
      }
    </div>
  );
}

export default WSAccordions;
