import { GetServerSideProps } from "next";
import { getSession } from 'next-auth/react';
import { DashboardLayout } from '../components/DashboardLayout';

function Index() {
  return (
    <></>
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
      redirect: {
        destination: '/workspaces',
        permanent: false,
      },
    };
  }
  // return {
  //   props: { session },
  // };
}

export default Index;
