
import { useState, useRef, useEffect, Fragment, FormEvent, ChangeEvent } from 'react';
import Image from 'next/image'
import useSWR, { mutate } from "swr";
import { useSession } from 'next-auth/react';
import axios from 'axios';
import {
    Box,
    Button,
    Container,
    Grid,
    Typography,
    Dialog,
    DialogActions,
    TextField,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import LeftSidebar from './LeftSidebar';
import WSBoards from './WS';
import { fetcher } from '../../../lib/fetch';

const Home = () => {
    const { data: session } = useSession<boolean>(undefined);
    const { data: workspaces } = useSWR(session ? `/api/workspaces?id=${session.id}` : null, fetcher)
    const { data: boards } = useSWR(session ? `/api/boards?id=${session.id}` : null, fetcher)

    // local state
    const [open, setOpen] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [boardTitle, setBoardTitle] = useState('');
    // refs
    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (workspaces && !workspaces.length) {
            setShowForm(true)
        }
    }, [workspaces])


    // post for new workspace
    async function submitHandler(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (nameInputRef?.current?.value) {
            if (!nameInputRef.current.value || nameInputRef.current.value === '') {
                return;
            }
            if (session) {
                await axios.post(`/api/workspaces?id=${session.id}`, { name: nameInputRef.current.value })
                mutate(`/api/workspaces?id=${session.id}`);
                setShowForm(false)
            }
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setBoardTitle(e.target.value)
    }

    const handleClose = () => {
        setOpen(false);
    };

    if (!workspaces || !boards) {
        return <div>Loading...</div>
    }

    return (
        <Fragment>
            <Container maxWidth="lg" sx={{ mt: 15 }}>
                {
                    showForm ? (
                        <Box sx={{ marginLeft: 'auto', marginRight: 'auto', width: 800 }}>
                            <form
                                onSubmit={(e) => {
                                    submitHandler(e);
                                }}
                            >
                                <Box sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: 250,
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                                >
                                    <Image
                                        alt="Mountains"
                                        src="/static/images/empty-board.d1f066971350650d3346.svg"
                                        layout="fill"
                                        width={340}
                                        height={250}
                                        quality={100}
                                    />
                                </Box>
                                <Typography variant="h5">Let's build a Workspace!</Typography>
                                <Typography variant="subtitle2">Boost your productivity by making it easier for everyone to access boards in one location.</Typography>
                                <TextField
                                    inputRef={nameInputRef}
                                    autoFocus
                                    margin="dense"
                                    id="name"
                                    fullWidth
                                    variant="standard"
                                    placeholder="Workspace name"
                                    value={boardTitle}
                                    onChange={handleChange}
                                />
                                <Button variant="contained" type="submit" sx={{ marginTop: 2 }}>Create Workspace</Button>
                            </form>
                        </Box>
                    ) : <Grid container spacing={3}>
                        <Grid item xs={3}>
                            <LeftSidebar
                                workspaces={workspaces}
                                openModal={setOpen}
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <Typography sx={{ my: 2, fontWeight: 700 }}>YOUR WORKSPACES</Typography>
                            {
                                workspaces.map((ws: any) => <WSBoards
                                    key={ws._id}
                                    workspace={ws}
                                    boards={boards}
                                />)
                            }
                        </Grid>
                    </Grid>
                }
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Let's build a workspace</DialogTitle>
                    <DialogContent>
                        <form
                            onSubmit={(e) => {
                                submitHandler(e);
                            }}
                        >
                            <Typography variant="subtitle2">Boost your productivity by making it easier for everyone to access boards in one location.</Typography>
                            <TextField
                                inputRef={nameInputRef}
                                autoFocus
                                margin="dense"
                                id="name"
                                fullWidth
                                variant="standard"
                                placeholder="Workspace name"
                                value={boardTitle}
                                onChange={handleChange}

                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button type="submit">Create</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Fragment>
    )
}

export default Home