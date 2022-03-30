import nc from 'next-connect';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../../lib/db';

const ncOpts = {
  onError(err, req, res) {
    console.error(err);
    res.statusCode = err.status && err.status >= 100 && err.status < 600 ? err.status : 500;
    res.json({ message: err.message });
  },
};

const handler = nc(ncOpts);

handler.get(async (req, res) => {
    const client = await connectToDatabase();
    const db = client.db();
  
    const activities = await db
      .collection('activities')
      .aggregate([
        {
          $match: {
            boardId: new ObjectId(req.query.boardId)
          },
        },
      ])
      .toArray();
  
    res.json(activities);
  });

  export default handler;

  