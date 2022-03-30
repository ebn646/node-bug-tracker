import React from 'react'
import { useSession } from 'next-auth/react';
import UserAvatar from '../common/UserAvatar'
import ListItem from '@mui/material/ListItem';

export default function CommentItem({data}) {

  return (
    <ListItem><UserAvatar /><p>{data.text}</p></ListItem>
  )
}
