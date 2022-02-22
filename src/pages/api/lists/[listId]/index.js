import { connectToDatabase } from '../../../../../lib/db';
import nc from 'next-connect';
import { ObjectId } from 'mongodb';

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

  let lists = await db
    .collection("lists")
    .aggregate([
      {
        $match: {
          userId: new ObjectId(id)
        }
      }
    ])
    .toArray();

  res.json( lists );
});

handler.patch(async (req, res) => {
  let client = await connectToDatabase();
  let db = client.db();
  const obj = req.body;
  console.log('list update pob = ', obj, req.query.listId)
  let list = await db
    .collection("lists")
    .updateOne({_id: ObjectId(req.query.listId)}, { $set: obj })
  res.json( list );
});

handler.delete(async (req, res) => {
  let client = await connectToDatabase();
  let db = client.db();

  let card = await db
    .collection("lists")
    .deleteOne({_id: ObjectId(req.query.listId)})
  res.json( card );
})

export default handler;