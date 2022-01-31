import { connectToDatabase } from '../../../../lib/db';
import nc from 'next-connect';

async function findUserByUsername(db, email) {
    return db
      .collection('users')
      .findOne({ email })
      .then((user) => user || null);
  }

const ncOpts = {
    onError(err, req, res) {
      console.error(err);
      res.statusCode =
        err.status && err.status >= 100 && err.status < 600 ? err.status : 500;
      res.json({ message: err.message });
    },
  };

const handler = nc(ncOpts);

handler.get(async (req, res) => {
    let client = await connectToDatabase();
    const usersCollection = client.db().collection('users');

     const user = await usersCollection.findOne({
        email: req.query.email,
     });

     return res.json(user);
  });

  export default handler;