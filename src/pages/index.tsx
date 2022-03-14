import { useState, useRef, useEffect, FormEvent, ChangeEvent, MouseEvent } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { GetServerSideProps } from "next";
import { getSession } from 'next-auth/react';
import { DashboardLayout } from '../components/DashboardLayout';
import {
  Button,
  Typography,
  TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import Divider from '@mui/material/Divider';
import { fetcher } from '../../lib/fetch';
import useSWR, { mutate } from "swr";
function Index({ session }) {
  const router = useRouter();
  const { data: workspaces } = useSWR(session && session.id ? `/api/workspaces?id=${session.id}` : null, fetcher)
  // local state
  const [workspaceTitle, setWorkspaceTitle] = useState('');
  const [showForm, setShowForm] = useState(false);
  // refs
  const nameInputRef = useRef<HTMLInputElement>(null);

  // post for new workspace
  async function submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (nameInputRef?.current?.value) {
      if (!nameInputRef.current.value || nameInputRef.current.value === '') {
        return;
      }
      if (session) {
        await axios.post(`/api/workspaces/${router.query.id}?user=${session.id}`, { name: nameInputRef.current.value })
        mutate(`/api/workspaces?id=${session.id}`, false);
      }
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setWorkspaceTitle(e.target.value)
  }

  useEffect(() => {
    if (workspaces && !workspaces.length) {
      setShowForm(true)
    } else {
      setShowForm(false)
    }
  }, [workspaces, session])


  if (!workspaces) return <></>

  return (
    <>
      {
        !showForm ? (
          <>
            <Box sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper', m: 2 }}>
              <Button
                variant="contained"
                sx={{ borderRadius: 0 }}
                onClick={() => setShowForm(true)}
              >
                Create a new Workspace
              </Button>
              <nav aria-label="main mailbox folders">
                <List>
                  {
                    workspaces.map((ws: { _id: string, name: string }) =>
                      <>
                        <ListItem key={ws._id} disablePadding>
                          <Link href={`/workspace/${ws._id}`}>
                            <ListItemButton>
                              <a style={{ display: 'flex' }}>
                                <ListItemIcon>
                                  <WorkspacesIcon />
                                </ListItemIcon>
                                <ListItemText primary={ws.name} />
                              </a>
                            </ListItemButton>
                          </Link>
                        </ListItem>
                        <Divider />
                      </>
                    )
                  }
                </List>
              </nav>
            </Box>
          </>
        ) :
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
                value={workspaceTitle}
                onChange={handleChange}
              />
              <Button variant="contained" type="submit" sx={{ marginTop: 2 }}>Create Workspace</Button>
            </form>
          </Box>
      }
    </>
  );
}

Index.getLayout = (page: JSX.Element) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  } else {
    return {
      props: { session },
    };
  }
}

export default Index;
