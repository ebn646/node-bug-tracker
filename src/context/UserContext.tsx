import { string } from 'prop-types';
import { createContext } from 'react';

const UserContext = createContext({username: string});

export default UserContext