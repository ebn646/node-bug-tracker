import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from '../../../../lib/auth';
import { connectToDatabase } from '../../../../lib/db';

export default NextAuth({
  providers: [
    CredentialsProvider({
      authorize: async (credentials:{email: string, password: string}) => {
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
          throw new Error('Could not log you in with password!');
        }

        client.close();

        if (user) {
          return { 
            email: user.email, 
            name: `${user.firstName} ${user.lastName}`, 
            id: user._id, 
            firstName: user.firstName, 
            lastName: user.lastName 
          }
        }
      }
    })
  ],
  callbacks: {
    jwt: async ({token, user}) => {
      if(user){
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },
    session: async ({session, token}) => {
      if(token){
        session.id = token.id;
        session.firstName = token.firstName;
        session.lastName = token.lastName;
      }

      return session;
    }  
  },
  secret: process.env.NEXTAUTH_URL,
  jwt: {
    secret: process.env.NEXTAUTH_URL,
    encryption: true,
  }
});

