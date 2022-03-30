import { string } from 'prop-types';
import { createContext } from 'react';

const UserContext = createContext({firstName: string, lastName: string, _id: string, email: string,});

export default UserContext