import { string } from 'prop-types';
import { createContext } from 'react';

interface AppContextInterface {
    _id: string
    firstName: string
    lastName: string
    email: string
  }

const UserContext = createContext<AppContextInterface | null>(null);

export default UserContext