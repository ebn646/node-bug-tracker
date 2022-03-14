import { connectToDatabase } from '../../../../lib/db';
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
  console.log(' ws id = ',req.query.id)
    let client = await connectToDatabase();
    let db = client.db();

    let workspace = await db
      .collection("workspaces")
      .aggregate([
        {
          $match: {
            _id : new ObjectId(req.query.id)
          }
        }
      ])
      .toArray();
  
    res.json( workspace[0] );
  });

  handler.post(
    async (req, res) => {
      let client = await connectToDatabase();
      let db = client.db();
      const data = req.body;
      const ws = {
        ...data,
        creatorId: new ObjectId(req.query.user),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const { insertedId } = await db.collection('workspaces').insertOne(ws);
      ws._id = insertedId;
      res.json( ws );
    }
  );

  export default handler;