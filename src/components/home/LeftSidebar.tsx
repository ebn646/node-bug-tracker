import * as React from 'react';
import Button from '@mui/material/Button';
import DashBoardIcon from '@mui/icons-material/DashBoard';
import AddIcon from '@mui/icons-material/Add';
import WSAccordion from './WSAccordion';

type Props = {
  workspaces: [],
  openModal: (params:boolean) => void,
}

export default function LeftSidebar({workspaces, openModal}: Props) {

  return (
    <div>
        <Button sx={{width: '100%', justifyContent: 'flex-start'}} startIcon={<DashBoardIcon />}> Boards </Button>
        <Button sx={{width: '100%', justifyContent: 'space-between'}} endIcon={<AddIcon />} onClick={() => openModal(true)}> Workspaces </Button>
        <WSAccordion workspaces={workspaces} />
    </div>
  );
}
