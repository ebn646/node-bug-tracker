import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Avatar from '@mui/material/Avatar';
import { getInitials } from '../../utils/get-initials';

export default function UserAvatar() {
    const { data: session } = useSession();
  return (
    <Avatar sx={{width: 30, height: 30, fontSize: '1rem', mr:1}}>{session && session.user?.name && getInitials(session.user.name)}</Avatar>
    )
}
