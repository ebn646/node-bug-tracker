import { Container } from '@mui/material'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, {useEffect} from 'react'
import useSWR from 'swr'
import { DashboardLayout } from '../../components/DashboardLayout'
import WS from '../../components/workspace'

export default function Workspace({ session }) {
    const router = useRouter();

    useEffect(() => {
      console.log('r ',router)
    }, [router])
    
    const { data } = useSWR(`/api/boards?id=${router.query.id}`)
    return (
        <Container maxWidth={false}>
            <WS />
        </Container>)
}

Workspace.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

export async function getServerSideProps(context) {
    const session = await getSession({ req: context.req });

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            }
        }
    }

    return {
        props: { session }
    }
}
