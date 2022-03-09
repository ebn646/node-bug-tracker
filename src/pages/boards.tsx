
import React, { useEffect } from 'react';
import { useSession, getSession } from 'next-auth/react';
import axios from 'axios';
import Home from '../components/home';

const Boards = () => {
  const { data } = useSession();


  async function getWorspaces(id) {
    const res = await axios.get(`/api/workspaces?id=${id}`)
    console.log('res = ', res)
  }
  useEffect(() => {
    if (data) {
      console.log(data.id)
      getWorspaces(data.id)
    }
  }, [data])

  return (
   <Home />
  )
}

export default Boards