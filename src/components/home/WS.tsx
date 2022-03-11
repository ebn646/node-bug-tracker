
import { Container, Box, Grid, Typography } from '@mui/material';
import WSSection from './WSSection';
interface Props {
    workspace: {
        name: string;
    },
    boards: [],
}

const WS = ({ workspace, boards }: Props) => {
    return (
        <Box sx={{ bgcolor: '#fff', height: 'auto', py: 1 }}>
            <Typography variant="h6">{workspace.name}</Typography>
            <WSSection boards={boards} />
        </Box>
    )
}

export default WS