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
  console.log('req.query ========== ', req.query.boardid)

  const client = await connectToDatabase();
  const db = client.db();

  const cards = await db
    .collection('cards')
    .aggregate([
      {
        $match: {
          boardId: new ObjectId(req.query.boardid)
        }
      }
    ])
    .toArray();

  console.log('cards ========== ', cards)
  res.json(cards);
});

handler.post(
  async (req, res) => {
    const client = await connectToDatabase();
    const db = client.db();
    const data = req.body;
    const card = {
      ...data,
      boardId: new ObjectId(data.boardId),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const { insertedId } = await db.collection('cards').insertOne(card);
    // eslint-disable-next-line no-underscore-dangle
    card._id = insertedId;
    res.json(card);
  },
);

export default handler;
