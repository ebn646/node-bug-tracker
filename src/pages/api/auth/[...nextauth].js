import NextAuth from 'next-auth';
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../../lib/mongodb"
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyPassword } from '../../../../lib/auth';
import { connectToDatabase } from '../../../../lib/db';

export default NextAuth({
  // adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.

      async authorize({ email, password }) {
        // Add logic here to look up the user from the credentials supplied
        const client = await connectToDatabase();
        const usersCollection = client.db().collection('users');
        const user = await usersCollection.findOne({
          email,
        });

        if (!user) {
          client.close();
          throw new Error('No user found!');
        } else {
          const isValid = await verifyPassword(password, user.password);

          if (!isValid) {
            client.close();
            throw new Error('Could not log you in with password!');
          }

          client.close();

          return {
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
          };
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.id = token.id;
        session.firstName = token.firstName;
        session.lastName = token.lastName;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_URL,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
});
