import NextAuth from 'next-auth';
import CredentialProvider from "next-auth/providers/credentials";
import { verifyPassword } from '../../../../lib/auth';
import { connectToDatabase } from '../../../../lib/db';

export default NextAuth({
  providers: [
    CredentialProvider({
      authorize: async (credentials) => {
        console.log('credential ', credentials)
        const client = await connectToDatabase();

        const usersCollection = client.db().collection('users');

        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        if (!user) {
          client.close();
          throw new Error('No user found!');
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password,
        );

        if (!isValid) {
          client.close();
          throw new Error('Could not log you in!');
        }

        client.close();

        if (user) {
          console.log('user=======', user)
          return { email: user.email, name: `${user.firstName} ${user.lastName}`, id: user._id, firstName: user.firstName, lastName: user.lastName }
        }
      }
    })
  ],
  callbacks: {
    jwt: async ({token, user}) => {
      console.log('user = ', user)
      if(user){
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      console.log('token = ', token)
      return token;
    },
    session: async ({session, token, user}) => {
      console.log('session user = ', user)
      console.log('session token = ', token)

      if(token){
        console.log('t = ', token)

        session.id = token.id;
      }
      if(user){
        console.log('session user = ', user)
      }
      console.log('s = ', session)

      return session;
    }  
  },
  secret: process.env.NEXTAUTH_URL,
  jwt: {
    secret: process.env.NEXTAUTH_URL,
    encryption: true,
  }
});

