import { connectToDatabase } from '../../../../../../lib/db';
import nc from 'next-connect';

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
  let db = client.db();

  let cards = await db
    .collection("cards")
    .find()
    .toArray();

  res.json( cards );
});

export default handler;