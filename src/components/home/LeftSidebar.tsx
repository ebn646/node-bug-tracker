import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import DashBoardIcon from '@mui/icons-material/DashBoard';
import AddIcon from '@mui/icons-material/Add';
import WSAccordion from './WSAccordion';

export default function LeftSidebar() {


  return (
    <div>
        <Button sx={{width: '100%', justifyContent: 'flex-start'}} startIcon={<DashBoardIcon />}> Boards </Button>
        <Button sx={{width: '100%', justifyContent: 'space-between'}} endIcon={<AddIcon />}> Workspaces </Button>
        <WSAccordion />
    </div>
  );
}
