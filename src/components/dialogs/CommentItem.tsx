import React from 'react'
import UserAvatar from '../common/UserAvatar'
import ListItem from '@mui/material/ListItem';

interface IComment {
  data: {
    text: string
  }
}

export default function CommentItem({data}: IComment) {
  const { text } = data
  return (
    <ListItem><UserAvatar /><p>{text}</p></ListItem>
  )
}
