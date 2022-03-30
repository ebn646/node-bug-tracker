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
  const comments = await db
    .collection('comments')
    .aggregate([
      {
        $match: {
          cardId: new ObjectId(req.query.cid)
        }
      }
    ])
    .toArray();

  res.json(comments);
});

handler.post(
  async (req, res) => {
    const client = await connectToDatabase();
    const db = client.db();
    const data = req.body;
    const comment = {
      ...data,
      boardId: new ObjectId(data.boardId),
      cardId: new ObjectId(data.cardId),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const { insertedId } = await db.collection('comments').insertOne(comment);
    comment._id = insertedId;
    res.json(comment);
  },
);

export default handler;
